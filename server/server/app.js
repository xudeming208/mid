'use strict'
require('../config/config.js')
require('colors');
const cluster = require('cluster');
const http = require('http');
const fs = require('fs');
const clusterEnable = require('../config/cluster');
const router = require('./router.js');
let port = ETC.serverPort || 8083;
let ip = ETC.ip || '127.0.0.1';

// mkdir tmp
if (!fs.existsSync('../tmp')) {
	fs.mkdirSync('../tmp');
}

// server
if (cluster.isMaster) {
	clusterEnable();
} else {
	http.createServer((req, res) => {
		router(req, res);
	}).listen(port, () => {
		console.log(`Server has start on ${ip}:${port} at ${new Date().toLocaleString()}`.green.underline);
	});
}