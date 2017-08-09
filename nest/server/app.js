'use strict'
require('../config/config')
require('colors');
const CFonts = require('cfonts');
const cluster = require('cluster');
const http = require('http');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const router = require('./router');
const cpuNums = +ETC.cpuNums || require('os').cpus().length;
const port = +ETC.serverPort || 8083;
const ip = require('./base/getIp')() || '127.0.0.1';

const init = () => {
	// config
	let configPath = path.resolve(__dirname, '../config/config.json');
	let content = require(configPath);
	// 删除host字段中最后一个属性（IP变化的时候不会累加在host中）
	let hostKeys = Object.keys(content.host);
	let hostLen = hostKeys.length;
	if (hostLen > 3) {
		delete content.host[hostKeys[hostLen - 1]];
	}
	content.host[ip] = ETC.defaultPage;
	content.site.staticHost = `http://${ip}:${ETC.jserverPort}`;
	content.site.ip = ip;
	content.site.port = port;

	// 重启服务清除缓存
	exec(['cd ../.. ', 'rm -rf tmp/*', 'rm -rf logs/*'].join(' && '), (error, stdout, stderr) => {
		if (error) {
			console.error(error);
		}
		console.log(`Clear cache finised`);
	})

	// 版本号
	// if (!ETC.debug) {
	// 	let PUBDAY = 81.011;
	// 	let getNowDate = () => {
	// 		let st = new Date
	// 		let leadZero = t => {
	// 			if (t < 10) t = '0' + t
	// 			return t
	// 		}
	// 		return leadZero(st.getMonth()) + leadZero(st.getDate()) + leadZero(st.getHours()) + leadZero(st.getMinutes()) + leadZero(st.getSeconds());
	// 	}
	// 	content.site.version = `?${getNowDate()}${PUBDAY}`;
	// } else {
	// 	delete content.site.version;
	// }

	fs.writeFileSync(configPath, JSON.stringify(content, null, '\t'), 'utf-8');
}

init();

// server
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

	// CFonts
	CFonts.say('MID', {
		font: '3d',
		align: 'left',
		colors: ['white', 'black'],
		background: 'Black',
		letterSpacing: 1,
		lineHeight: 1,
		space: true,
		maxLength: '0'
	});

} else {
	http.createServer((req, res) => {
		router(req, res);
	}).listen(port, () => {
		console.log(`the Server has started on`, `${ip}:${port}`.green.underline, `at`, `${new Date().toLocaleString()}`.green.underline);
	});
}

process.on('uncaughtException', (err, promise) => {
	console.error(err);
	console.log(promise);
	process.exit(1);
})