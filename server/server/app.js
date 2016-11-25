'use strict'
require('../config/config.js')
require('colors');
const cluster = require('cluster');
const http = require('http');
const fs = require('fs');
const port = ETC.serverPort || 8083;
const clusterEnable = require('../config/cluster');
const getIp = require('../config/getIp');
const router = require('./router.js');
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
		console.log(`Server has start on ${getIp()}:${port} at ${new Date().toLocaleString()}`.green.underline);
	});
}