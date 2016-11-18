'use strict'
// console.log(__dirname)
require('../config/config.js')
require('colors');
const cluster = require('cluster');
const cpuNums = ETC.cpuNums || require('os').cpus().length;
const http = require('http');
const fs = require('fs');
const port = ETC.serverPort || 8083;
const getIp = require('../config/getIp');
const router = require('./router.js');
// mkdir tmp
if (!fs.existsSync('../tmp')) {
	fs.mkdirSync('../tmp');
}
// server
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
		// res.setHeader("Access-Control-Allow-Origin", "*");
		// res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
		// res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
		// res.setHeader("X-Powered-By", ' 3.2.1');
		router(req, res);
	}).listen(port, () => {
		console.log(`Server has start on ${getIp()}:${port} at ${new Date().toLocaleString()}`.green.underline);
	});
}