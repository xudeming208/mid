'use strict'
require('./config/config')
const log = require('fe-logs');
log.setName('.midLog.txt');
log.setMode('error');

// log会打印4遍，因为mid采用了pm2集群模式
// log.info('this is a log.info log');
// console.error('this is a console.error log');

const cluster = require('cluster');
const http = require('http');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const router = require('./router');
const cpuNums = +ETC.cpuNums;
const port = +ETC.serverPort;
const ip = require('./base/getIp')();

const init = () => {
	// config
	let configPath = path.resolve(__dirname, './config/config.json');
	let config = require(configPath);

	// 删除host字段中最后一个属性（IP变化的时候不会累加在host中）
	let hostKeys = Object.keys(config.host);
	let hostLen = hostKeys.length;
	if (hostLen > 3) {
		delete config.host[hostKeys[hostLen - 1]];
	}

	// 更改config的相关配置。如果想访问PC页，可以将此h5修改为pc，这样就可以通过IP地址访问PC页了
	config.host[ip] = 'h5';
	config.site.staticHost = `http://${ip}:${ETC.jserverPort}`;
	config.site.ip = ip;
	config.site.port = port;

	// 重启服务清除缓存
	exec(['cd .. ', 'rm -rf tmp/*', 'rm -rf logs/*'].join(' && '), (error, stdout, stderr) => {
		if (error) {
			console.error(JSON.stringify({
				trace: console.trace(),
				error: error.toString()
			}));
		}
		console.log(`Clear cache finised`);
	});

	fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'), 'utf-8');
}

init();

// server
if (cluster.isMaster) {
	for (let i = cpuNums; i--;) {
		cluster.fork();
	}
	cluster.on('death', worker => {
		console.log(`worker ${worker.pid} died`);
		cluster.fork();
	})
	cluster.on('exit', worker => {
		console.log(`worker ${worker.process.pid} died`);
		cluster.fork();
	})
} else {
	http.createServer((req, res) => {
		router(req, res);
	}).listen(port, '0.0.0.0', () => {
		console.log(`the Server has started on ${ip}:${port} at ${new Date().toLocaleString()}`);
	});
}

process.on('uncaughtException', (error, promise) => {
	console.error(JSON.stringify({
		trace: console.trace(),
		error: error.toString()
	}));
	process.exit(1);
})