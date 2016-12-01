'use strict'
require('../config/config')
require('colors');
const cluster = require('cluster');
const http = require('http');
const fs = require('fs');
const exec = require('child_process').exec;
const clusterEnable = require('../config/cluster');
const router = require('./router');
let port = +ETC.serverPort || 8083;
let ip = require('./base/getIp')() || '127.0.0.1';

let init = () => {
	// config
	let configPath = '../config/config.json';
	let content = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
	content.etc.ip = ip;
	content.host[ip] = ETC.defaultHost;
	content.site.staticHost = `http://${ip}:${ETC.jserverPort}`;

	// 重启服务清除缓存,包括静态服务器(主要是304)
	if (ETC.clearCatch) {
		// server
		if (fs.existsSync('../tmp')) {
			exec(['cd ../tmp', 'rm -rf *'].join(' && '), function(error, stdout, stderr) {
				if (error) {
					console.log(error)
				}
				console.log('Clear cache finised');
			})
		}
		// jserver
		let PUBDAY = 81.011;
		let getNowDate = () => {
			let st = new Date
			let leadZero = t => {
				if (t < 10) t = '0' + t
				return t
			}
			return ('' + st.getYear()).slice(1) + leadZero(st.getMonth()) + leadZero(st.getDate()) + leadZero(st.getHours()) + leadZero(st.getMinutes()) + leadZero(st.getSeconds());
		}
		content.site.version = `${getNowDate()}${PUBDAY}`;
	}

	fs.writeFileSync(configPath, JSON.stringify(content), 'utf-8');
}

init();

// server
if (cluster.isMaster) {
	clusterEnable();
} else {
	http.createServer((req, res) => {
		router(req, res);
	}).listen(port, () => {
		console.log(`the Server has started on ${ip}:${port} at ${new Date().toLocaleString()}`.green.underline);
	});
}