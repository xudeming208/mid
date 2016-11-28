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
let ip = ETC.ip || '127.0.0.1';

// server
if (cluster.isMaster) {
	// 重启清除缓存
	// exec(['cd ../tmp', 'rm -rf *'].join(' && '), function(error, stdout, stderr) {
	// 	if (error) {
	// 		console.log(error)
	// 	}
	// 	console.log('Clear cache finised');
	// })
	clusterEnable();
} else {
	http.createServer((req, res) => {
		router(req, res);
	}).listen(port, () => {
		console.log(`Server has start on ${ip}:${port} at ${new Date().toLocaleString()}`.green.underline);
	});
}