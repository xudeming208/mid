'use strict'
//生产环境下，应先将less编译、JS压缩传至cdn or Nginx，如果更改HTML的引入路径即可；这时不需要此静态文件服务器了
require('../config/config')

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
		resHeader['Expires'] = '0';
		resHeader['Cache-Control'] = 'no-cache,no-store';
		return loadFile(req, res, filePath, fileType);
	}

	// 读取文件的最后修改时间
	fs.stat(filePath, (err, stat) => {
		if (err) {
			console.error(err);
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
	if (!fs.existsSync(filePath)) {
		res.writeHead(404, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		});
		console.error(filePath + ' is lost');
		return res.end(`404 Not Found`);
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
	for (let i = cpuNums; i--;) {
		cluster.fork();
	}
	cluster.on('death', worker => {
		console.log(`worker ${worker.pid} died`);
		cluster.fork();
	})
	cluster.on('exit', worker => {
		console.log(`worker worker.process.pid died`);
		cluster.fork();
	})
} else {
	http.createServer((req, res) => {
		onRequest(req, res);
	}).listen(port, () => {
		console.log(`the Jserver has started on ${ip}:${port} at ${new Date().toLocaleString()}`);
	});
}

process.on('uncaughtException', (err, promise) => {
	console.error(err);
	process.exit(1);
})