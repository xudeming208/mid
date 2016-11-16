require('../config/config.js')
require('colors');
const cluster = require('cluster');
const path = require('path');
const cpuNums = ETC.cpuNums || require('os').cpus().length;
const http = require('http');
const fs = require('fs');
const url = require('url');
const less = require('less');
const port = ETC.jserverPort || 8084;
const contentType = {
	"css": "text/css",
	"html": "text/html",
	"js": "text/javascript",
	"json": "application/json",
	"svg": "image/svg+xml",
	"txt": "text/plain",
	"xml": "text/xml",
	"gif": "image/gif",
	"ico": "image/x-icon",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"pdf": "application/pdf",
	"png": "image/png",
	"swf": "application/x-shockwave-flash",
	"tiff": "image/tiff",
	"wav": "audio/x-wav",
	"wma": "audio/x-ms-wma",
	"wmv": "video/x-ms-wmv"
};
const bufferTypeArr = ["gif", "ico", "jpeg", "jpg", "pdf", "png", "swf", "tiff", "wav", "wma", "wmv"];
// getIp
let getIp = () => {
	let ifaces = require('os').networkInterfaces();
	let ret = [];
	for (let dev in ifaces) {
		ifaces[dev].forEach(details => {
			if (details.family == 'IPv4' && !details.internal) {
				ret.push(details.address)
			}
		})
	}
	return ret.length ? ret[0] : '127.0.0.1'
};
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
			fileType = pathname.match(/(\.[^.]+|)$/)[0].substr(1), //取得后缀名
			// console.log(fileType)
			unicode = bufferTypeArr.includes(fileType) ? '' : 'utf-8',
			filePath = path.resolve(__dirname, '../../apps/', PATH[HOST[hostname]], PATH.static);
		// console.log(reqUrl)
		let writeFile = (fileType, data) => {
			res.writeHead(200, {
				"Content-Type": contentType[fileType] + ';charset=utf-8'
			});
			res.end(data);
		}
		if (fileType == 'css') {
			pathname = pathname.replace('/css/', '/less/').replace('.css', '.less');
			fileType = 'less';
		}
		filePath += pathname;
		console.log(filePath)
		if (!fs.existsSync(filePath)) {
			res.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			res.end(filePath + ' is lost');
		} else {
			fs.readFile(filePath, unicode, (err, data) => { //读取内容
				if (err) {
					res.writeHead(500, {
						'Content-Type': 'text/plain'
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
							'Content-Type': 'text/plain'
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