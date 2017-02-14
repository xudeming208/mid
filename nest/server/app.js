'use strict'
require('../config/config')
const cluster = require('cluster');
const http = require('http');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const clusterEnable = require('../config/cluster');
const router = require('./router');
let port = +ETC.serverPort || 8083;
let ip = require('./base/getIp')() || '127.0.0.1';

let init = () => {
	// config
	let configPath = path.resolve(__dirname, '../config/config.json');
	let content = require(configPath);
	// 删除host字段中最后一个属性（IP变化的时候不会累加在host中）
	let hostKeys = Object.keys(content.host);
	let hostLen = hostKeys.length;
	if (hostLen > 3) {
		delete content.host[hostKeys[hostLen - 1]];
	}
	content.etc.ip = ip;
	content.host[ip] = ETC.defaultPage;
	content.site.staticHost = `http://${ip}:${ETC.jserverPort}`;

	// 重启服务清除缓存
	exec(['cd ../.. ', 'rm -rf tmp/*', 'rm -rf logs/*'].join(' && '), function(error, stdout, stderr) {
		if (error) {
			console.dir(error);
		}
		console.log('Clear cache finised');
	})

	// 版本号
	if (!ETC.debug) {
		let PUBDAY = 81.011;
		let getNowDate = () => {
			let st = new Date
			let leadZero = t => {
				if (t < 10) t = '0' + t
				return t
			}
			return leadZero(st.getMonth()) + leadZero(st.getDate()) + leadZero(st.getHours()) + leadZero(st.getMinutes()) + leadZero(st.getSeconds());
		}
		content.site.version = `?${getNowDate()}${PUBDAY}`;
	} else {
		delete content.site.version;
	}

	fs.writeFileSync(configPath, JSON.stringify(content), 'utf-8');
}


// server
if (cluster.isMaster) {
	clusterEnable();
} else {
	init();
	http.createServer((req, res) => {
		router(req, res);
	}).listen(port, () => {
		if (ETC.debug) {
			require('colors');
			console.log(`the Server has started on`, `${ip}:${port}`.green.underline, `at`, `${new Date().toLocaleString()}`.green.underline);
		} else {
			console.log(`the Server has started on ${ip}:${port} at ${new Date().toLocaleString()}`);
		}
	});
}

process.on('uncaughtException', function(err) {
	console.dir(err);
	process.exit(1);
})