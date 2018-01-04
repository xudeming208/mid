'use strict'
//生产环境下静态资源应考虑cdn or Nginx
require('colors');
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
const staticCache = {};
const maxAge = 60 * 60 * 24 * 180;
const cpuNums = +ETC.cpuNums || require('os').cpus().length;
const port = +ETC.jserverPort || 8084;
const ip = SITE.ip || '127.0.0.1';


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

	//cache
	if (staticCache.hasOwnProperty(filePath)) {
		// console.log(staticCache[filePath]);
		res.end(staticCache[filePath]);
		return;
	}

	let data = await readFile(filePath, unicode, fileType).catch(err => {
		res.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		console.error(err);
		res.end(err.toString());
	});

	!ETC.debug && (staticCache[filePath] = data);
	res.end(data);
}

// statFile
const statFile = (req, res, filePath, fileType, contentType) => {
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
			let resHeader = {
				'Server': ETC.server,
				'Content-Type': contentType + ';charset=utf-8',
				'Last-Modified': lastModified,
				'Expires': expires.toUTCString(),
				// 'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'max-age=' + maxAge
			};

			// 开发模式下，禁用cache
			if (ETC.debug) {
				delete resHeader['Last-Modified'];
				delete resHeader['Expires'];
				resHeader['Cache-Control'] = 'no-cache,no-store';
			}

			res.writeHead(200, resHeader);
			loadFile(req, res, filePath, fileType);
		}
	});
}

// onRequest
const onRequest = (req, res) => {
	let reqUrl = url.parse(req.url);
	let pathname = reqUrl.pathname,
		fileType = pathname.match(/(\.[^.]+|)$/)[0].substr(1); //取得后缀名

	if (pathname === '/') {
		res.writeHead(404, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		})
		console.error(`What do you want to do?`);
		return res.end(`What do you want to do?`);
	}

	// console.dir(CONFIG)
	let appPath = path.resolve(__dirname, '../', PATH.apps),
		contentType = mimeTypes[fileType] || 'text/plain';
	// console.log(reqUrl)

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
		statFile(req, res, filePath, fileType, contentType);
	}
}

//jserver
if (cluster.isMaster) {
	for (let i = cpuNums; i--;) {
		cluster.fork();
	}
	cluster.on('death', worker => {
		console.log('worker ' + worker.pid + ' died');
		cluster.fork();
	})
	cluster.on('exit', worker => {
		let st = new Date;
		st = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate() + ' ' + st.toLocaleTimeString();
		console.log('worker ' + worker.process.pid + ' died at:', st);
		cluster.fork();
	})
} else {
	http.createServer((req, res) => {
		onRequest(req, res);
	}).listen(port, () => {
		console.log(`the Jserver has started on`, `${ip}:${port}`.green.underline, `at`, `${new Date().toLocaleString()}`.green.underline);
	});
}

process.on('uncaughtException', (err, promise) => {
	console.error(err);
	console.log(promise);
	process.exit(1);
})