'use strict'
require('../config/config')
const cluster = require('cluster');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');
const less = require('less');
const uglifyJS = require('uglify-js');
const clusterEnable = require('../config/cluster');
const mime = require('./mime');
const mimeTypes = mime.types;
const mimeBuffer = mime.bufferTypeArr;
let staticCache = {};
let maxAge = 60 * 60 * 24 * 180;
let port = +ETC.jserverPort || 8084;
let ip = ETC.ip || '127.0.0.1';


//自动打开浏览器
// if (ETC.debug) {
// const IS_WIN = process.platform.indexOf('win') === 0;
// const child_process = require('child_process');

// function openBrower(path, callback) {
// 	let cmd = '"' + path + '"';
// 	if (IS_WIN) {
// 		cmd = 'start "" ' + cmd;
// 	} else {
// 		if (process.env['XDG_SESSION_COOKIE'] ||
// 			process.env['XDG_CONFIG_DIRS'] ||
// 			process.env['XDG_CURRENT_DESKTOP']) {
// 			cmd = 'xdg-open ' + cmd;
// 		} else if (process.env['GNOME_DESKTOP_SESSION_ID']) {
// 			cmd = 'gnome-open ' + cmd;
// 		} else {
// 			cmd = 'open ' + cmd;
// 		}
// 	}
// 	child_process.exec(cmd, callback);
// };
// openBrower(`http://${ip}:${port-1}`, function() {})


// 	let open = require("open");
// 	open(`http://${ip}:${port-1}`);
// }

// loadFile
let loadFile = (req, res, filePath, fileType) => {
	let unicode = mimeBuffer.includes(fileType) ? '' : 'utf-8';
	//cache，第二个用户不再IO
	if (staticCache.hasOwnProperty(filePath)) {
		// console.log(staticCache[filePath]);
		res.end(staticCache[filePath]);
		return;
	}
	// define writeFile fun
	let writeFile = (data) => {
		!ETC.debug && (staticCache[filePath] = data);
		res.write(data);
		res.end();
	}
	if (!fs.existsSync(filePath) || filePath.match(/\bmvc\b/)) {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		res.end('404 Not Found');
		console.log(filePath + ' is lost');
	} else {
		fs.readFile(filePath, unicode, (err, data) => {
			if (err) {
				res.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				res.end(JSON.stringify(err));
			}
			// less compaile
			if (fileType == 'less') {
				less.render(data, {
					paths: [filePath.substr(0, filePath.lastIndexOf('/'))],
					compress: !ETC.debug
				}).then(output => {
					writeFile(output && output.css);
				}, error => {
					console.log(error);
					res.writeHead(500, {
						'Content-Type': 'text/plain'
					});
					res.end(`"${filePath}": compile error`);
				})
			} else {
				if (!ETC.debug && fileType == 'js') {
					//js compress
					data = uglifyJS.minify(data, {
						fromString: true
					}).code;
				}
				writeFile(data);
			}
		});
	}
}

//jserver
if (cluster.isMaster) {
	clusterEnable();
} else {
	http.createServer((req, res) => {
		let reqUrl = url.parse(req.url);
		let pathname = reqUrl.pathname,
			fileType = pathname.match(/(\.[^.]+|)$/)[0].substr(1); //取得后缀名

		// favicon.ico
		if (reqUrl.pathname == '/favicon.ico') {
			let icoPath = path.resolve(__dirname, '../', 'favicon.ico');
			fs.readFile(icoPath, (err, html) => {
				if (err) {
					res.writeHead(500, {
						'Content-Type': 'text/plain'
					});
					// console.log(err);
					res.end(JSON.stringify(err));
				}
				res.writeHead(200, {
					'Server': ETC.server,
					'Content-Type': 'image/x-icon;charset=utf-8'
				});
				res.end(html);
			});
			return;
		}

		// console.dir(CONFIG)
		let filePath = path.resolve(__dirname, PATH.apps),
			contentType = mimeTypes[fileType] || 'text/plain';
		// console.log(reqUrl)

		//将CSS的请求转化为Less的请求
		if (fileType == 'css') {
			pathname = pathname.replace('/css/', '/less/').replace('.css', '.less');
			fileType = 'less';
		}
		filePath += pathname;
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
			// chrome增加了from memory cache和from disk cache，所以开发模式下光禁止304是不行的
			// if (!ETC.debug && req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
			if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
				res.writeHead(304, 'Not Modified');
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
				// chrome增加了from memory cache和from disk cache，所以开发模式下光禁止304是不行的
				if (ETC.debug) {
					delete resHeader['Last-Modified'];
					delete resHeader['Expires'];
					resHeader['Cache-Control'] = 'no-cache,no-store';
				}
				res.writeHead(200, resHeader);
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
	}).listen(port, () => {
		if (ETC.debug) {
			require('colors');
			console.log(`the Jserver has started on`, `${ip}:${port}`.green.underline, `at`, `${new Date().toLocaleString()}`.green.underline);
		} else {
			console.log(`the Jserver has started on ${ip}:${port} at ${new Date().toLocaleString()}`);
		}
	});
}

process.on('uncaughtException', function(err) {
	console.dir(err);
	process.exit(1);
})