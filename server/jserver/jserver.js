'use strict'
require('../config/config.js')
require('colors');
const cluster = require('cluster');
const path = require('path');
const cpuNums = ETC.cpuNums || require('os').cpus().length;
const http = require('http');
const fs = require('fs');
const url = require('url');
const less = require('less');
const getIp = require('../config/getIp');
const mime = require("./mime.js");
const mimeTypes = require("./mime.js").types;
const mimeBuffer = require("./mime.js").bufferTypeArr;
const port = ETC.jserverPort || 8084;

//jserver
if (cluster.isMaster) {
	for (let i = 0; i < cpuNums; i++) {
		cluster.fork()
	}

	cluster.on('death', worker => {
		console.log('worker ' + worker.pid + ' died')
		cluster.fork()
	})

	cluster.on('exit', worker => {
		let st = new Date
		st = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate() + ' ' + st.toLocaleTimeString()
		console.log('worker ' + worker.process.pid + ' died at:', st)
		cluster.fork()
	})
} else {
	http.createServer((req, res) => {
		let reqUrl = url.parse('http://' + req.headers.host + req.url, true),
			hostname = reqUrl.hostname,
			pathname = reqUrl.pathname,
			fileType = pathname.match(/(\.[^.]+|)$/)[0].substr(1); //取得后缀名
		//去除参数
		if (pathname.indexOf('?') != -1) {
			fileType = fileType.substr(0, fileType.indexOf('?'));
			filePath = filePath.substr(0, filePath.indexOf('?'));
		}
		// 
		let filePath = path.resolve(__dirname, '../../apps/', PATH[HOST[hostname]], PATH.static),
			contentType = mimeTypes[fileType] || 'text/plain',
			unicode = mimeBuffer.includes(fileType) ? '' : 'utf-8';

		// define writeFile fun
		let writeFile = (fileType, data) => {
			res.writeHead(200, {
				"Content-Type": contentType + ';charset=utf-8'
			});
			res.end(data);
		}

		//将CSS的请求转化为Less的请求
		if (fileType == 'css') {
			pathname = pathname.replace('/css/', '/less/').replace('.css', '.less');
			fileType = 'less';
		}
		filePath += pathname;

		console.log(filePath)
		if (!fs.existsSync(filePath)) {
			res.writeHead(404, {
				'Content-Type': contentType
			});
			res.end(filePath + ' is lost');
			console.log(filePath + ' is lost');
		} else {
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
	}).listen(port, () => {
		console.log(`jserver has start on ${getIp()}:${port} at ${new Date().toLocaleString()}`.green.underline);
	});
}