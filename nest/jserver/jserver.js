'use strict'
const events = require("events");
const mEmitter = new events.EventEmitter;
mEmitter.setMaxListeners(0);

require('../config/config')
require('colors');
const cluster = require('cluster');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');
const less = require('less');
const clusterEnable = require('../config/cluster');
const mime = require('./mime');
const mimeTypes = mime.types;
const mimeBuffer = mime.bufferTypeArr;
let staticCache = {};
let timer = '';
let maxAge = 60 * 60 * 24 * 180;
let port = +ETC.jserverPort || 8084;
let ip = ETC.ip || '127.0.0.1';


//自动打开浏览器
// let openBrowerFun = () => {
// 	const openBrower = require('./openBrower');
// 	openBrower(`http://${ip}:${port-1}`);
// }

// loadFile
let loadFile = (req, res, filePath, fileType) => {
	let unicode = mimeBuffer.includes(fileType) ? '' : 'utf-8';

	// define writeFile fun
	let writeFile = (fileType, data) => {
		staticCache[fileType] = data;
		res.write(data);
		res.end();
	}

	fs.readFile(filePath, unicode, (err, data) => {
		if (err) {
			res.writeHead(500, {
				'Content-Type': contentType
			});
			res.end(err);
		}
		// less compaile
		if (fileType == 'less') {
			less.render(data, {
				paths: [filePath.substr(0, filePath.lastIndexOf('/'))],
				compress: ETC.compress
			}).then(output => {
				writeFile('css', output && output.css);
			}, error => {
				console.log(error);
				res.writeHead(500, {
					'Content-Type': contentType
				});
				res.end(filePath + 'compile error');
			})
		} else {
			writeFile(fileType, data);
		}
	});
}

//jserver
if (cluster.isMaster) {
	clusterEnable();
	// openBrowerFun();
} else {
	http.createServer((req, res) => {
		let reqUrl = url.parse(req.url);
		let pathname = reqUrl.pathname,
			fileType = pathname.match(/(\.[^.]+|)$/)[0].substr(1); //取得后缀名

		// console.dir(CONFIG)
		let filePath = path.resolve(__dirname, PATH.apps),
			contentType = mimeTypes[fileType] || 'text/plain';
		console.log(reqUrl)

		//将CSS的请求转化为Less的请求
		if (fileType == 'css') {
			pathname = pathname.replace('/css/', '/less/').replace('.css', '.less');
			fileType = 'less';
		}
		filePath += pathname;
		if (!fs.existsSync(filePath) || filePath.match(/\bmvc\b/)) {
			res.writeHead(404, {
				'Content-Type': contentType
			});
			res.end('404 Not Found');
			console.log(filePath + ' is lost');
		} else {
			// 读取文件的最后修改时间
			fs.stat(filePath, function(err, stat) {
				if (err) {
					throw err;
				}
				let lastModified = stat.mtime.toUTCString(),
					ifModifiedSince = 'If-Modified-Since'.toLowerCase(),
					expires = new Date();
				expires.setTime(expires.getTime() + maxAge * 1000);
				// 304
				if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
					res.writeHead(304, 'Not Modified');
					res.end();
				} else {
					res.writeHead(200, {
						'Server': ETC.server,
						'Content-Type': contentType + ';charset=utf-8',
						'Last-Modified': lastModified,
						'Expires': expires.toUTCString(),
						'Cache-Control': 'max-age=' + maxAge
					});
					//cache，第二个用户不再IO
					if(staticCache.hasOwnProperty(filePath)){
						console.log(staticCache[filePath]);
						res.end(staticCache[filePath]);
						return;
					}
					if (fileType) {
						loadFile(req, res, filePath, fileType);
					} else {
						// let pathArr = pathname.split('~'),
						// 	pathStr = pathArr[0],
						// 	blocks = pathArr[1].split('+'),
						// 	type = 'css';
						// if (pathStr.match(/\bjs\b/g)) {
						// 	type = 'js';
						// }
						// blocks.map(mod => {
						// 	// console.log(pathStr + mod + '.' + type)
						// 	loadFile(req, res, filePath, type);
						// })
					}
				}
			});
		}
	}).listen(port, () => {
		console.log(`the Jserver has started on ${ip}:${port} at ${new Date().toLocaleString()}`.green.underline);
	});
}

process.on('uncaughtException', function (err) {
    console.log(err)
})
