'use strict'
//生产环境下，应先在本地将less编译、JS压缩合并等传至cdn or Nginx，如果更改HTML的引入路径即可；这时不需要此静态文件服务器了
require('../config/config');
const log = require('fe-logs');
log.setName('.midLog.txt');
log.setMode('error');

const cluster = require('cluster');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');
const less = require('less');
const uglifyJS = require('uglify-js');
const mime = require('./mime');
const mimeTypes = mime.types;
const mimeBuffer = mime.bufferTypeArr;

// maxAge单位为秒
const maxAge = 60 * 60 * 24 * 180;
const cpuNums = +ETC.cpuNums;
const port = +ETC.jserverPort;
const ip = SITE.ip;

let resHeader = {};

// readFile fun
const readFile = (filePath, unicode, fileType) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, unicode, (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			// less compaile
			if (fileType === 'less') {
				less.render(data, {
					paths: [filePath.substr(0, filePath.lastIndexOf('/'))],
					compress: !ETC.debug
				}).then(output => {
					output && resolve(output.css)
				}, err => {
					reject(`"${filePath}": compile error`);
				})
			} else if (fileType === 'js') {
				if (!ETC.debug) {
					//js compress
					data = uglifyJS.minify(data, {
						fromString: true
					}).code;
				}
				resolve(data);
			} else {
				resolve(data);
			}
		})
	})
}

// loadFile
const loadFile = async (req, res, filePath, fileType) => {
	let unicode = mimeBuffer.includes(fileType) ? '' : 'utf-8';

	let data = await readFile(filePath, unicode, fileType).catch(err => {
		res.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		console.error(err);
		res.end(err.toString());
	});

	if (fileType == 'less') {
		fileType = 'css';
	}

	let contentType = mimeTypes[fileType] || 'text/plain';

	// 设置Content-Length可以让浏览器提前知道数据的多少，而无需自己去实时检测数据是否传输完毕，提高其效率
	// 如果没写Content-Length，浏览器默认为Transfer-Encoding:chunked，代表以流的方式传递数据，这两响应头不能共存
	resHeader['Content-Length'] = Buffer.byteLength(data, 'utf-8');
	resHeader['Content-Type'] = contentType + ';charset=utf-8';
	res.writeHead(200, resHeader);
	res.end(data);
}

// statFile
const statFile = (req, res, filePath, fileType) => {
	resHeader['Server'] = ETC.server;

	// 开发模式下，禁用cache
	if (ETC.debug) {
		// resHeader['Expires'] = new Date(Date.now() - 1).toUTCString();
		resHeader['Expires'] = 0;
		resHeader['Cache-Control'] = 'no-cache,no-store';
		return loadFile(req, res, filePath, fileType);
	}

	// 读取文件的最后修改时间
	fs.stat(filePath, (error, stat) => {
		if (error) {
			console.error(JSON.stringify({
				trace: console.trace(),
				error: error.toString()
			}));
		}
		let lastModified = stat.mtime.toUTCString(),
			ifModifiedSince = 'If-Modified-Since'.toLowerCase(),
			expires = new Date();

		expires.setTime(expires.getTime() + maxAge * 1000);

		// 304
		if (req.headers[ifModifiedSince] && lastModified === req.headers[ifModifiedSince]) {
			res.writeHead(304, `Not Modified`);
			res.end();
		} else {
			// resHeader
			resHeader['Last-Modified'] = lastModified;
			resHeader['Expires'] = expires.toUTCString();
			resHeader['Cache-Control'] = 'max-age=' + maxAge
			// resHeader['Access-Control-Allow-Origin'] = '*';

			loadFile(req, res, filePath, fileType);
		}
	});
}

// onRequest
const onRequest = (req, res) => {
	let reqUrl = url.parse(req.url);
	let pathname = reqUrl.pathname;

	if (pathname === '/') {
		res.writeHead(404, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		})
		console.error(`What do you want to do?`);
		return res.end(`What do you want to do?`);
	}

	let fileType = pathname.match(/(\.[^.\/]*)$/ig)[0].substr(1), //取得后缀名
		appPath = path.resolve(__dirname, '../', PATH.apps);

	//将CSS的请求转化为Less的请求
	if (fileType === 'css') {
		pathname = pathname.replace('/css/', '/less/').replace('.css', '.less');
		fileType = 'less';
	}

	let filePath = appPath + pathname;

	// 404
	try {
		if (!fs.existsSync(filePath)) {
			res.writeHead(404, {
				'Content-Type': 'text/plain',
				'Cache-Control': 'no-cache,no-store'
			});
			console.error(filePath + ' is lost');
			return res.end(`404 Not Found`);
		}
	} catch (error) {
		console.error(error);
	}

	// mvc源文件不允许访问
	if (filePath.match(/\bmvc\b/)) {
		res.writeHead(403, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		});
		console.error(filePath + '不允许访问');
		return res.end(`403 Forbidden`);
	}

	if (filePath.includes('~')) {

	} else {
		statFile(req, res, filePath, fileType);
	}
}

//jserver
if (cluster.isMaster) {
	// process就是当前的进程
	console.log(`主进程 ${process.pid} 正在运行`);

	// 根据CPU数量生成工作进程
	for (let i = cpuNums; i--;) {
		cluster.fork();
	}

	// 当任何一个工作进程关闭的时候，cluster 模块都将会触发 'exit' 事件。这可以用于重启工作进程（通过再次调用 .fork()）。
	cluster.on('exit', (worker, code, signal) => {
		if (signal) {
			console.log(`工作进程已被信号 ${signal} 杀死`);
		} else if (code !== 0) {
			console.log(`工作进程退出，退出码: ${code}`);
		} else {
			console.log(`工作进程成功退出，pid为${worker.process.pid}`);
		}

		console.log('重启中...');
		cluster.fork();
	});
} else {
	// process就是当前的进程
	console.log(`工作进程 ${process.pid} 已启动`);

	http.createServer((req, res) => {
		onRequest(req, res);
	}).listen(port, '0.0.0.0', () => {
		console.log(`the Jserver has started on ${ip}:${port} at ${new Date().toLocaleString()}`);
	});
}

process.on('uncaughtException', (error, promise) => {
	console.error(JSON.stringify({
		trace: console.trace(),
		error: error.toString()
	}));
	process.exit(1);
})