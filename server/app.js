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

	try {
		fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'), 'utf-8');
	} catch (error) {
		console.error(error);
	}
}

init();

// server
if (cluster.isMaster) {
	// process就是当前的进程
	console.log(`主进程 ${process.pid} 正在运行`);

	// 根据CPU数量生成工作进程
	for (let i = cpuNums; i--;) {
		cluster.fork();
	}

	// 当任何一个工作进程关闭的时候，cluster 模块都将会触发 'exit' 事件。这可以用于重启工作进程（通过再次调用 .fork()）。
	cluster.on('exit', (worker, code, signal) => {
		if (signal) {
			console.log(`工作进程已被信号 ${signal} 杀死`);
		} else if (code !== 0) {
			console.log(`工作进程退出，退出码: ${code}`);
		} else {
			console.log(`工作进程成功退出，pid为${worker.process.pid}`);
		}

		console.log('重启中...');
		cluster.fork();
	});
} else {
	// process就是当前的进程
	console.log(`工作进程 ${process.pid} 已启动`);

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