'use strict'
global.CONFIG = require('./config.json');
global.ETC = CONFIG.etc;
global.PATH = CONFIG.path;
global.SITE = CONFIG.site;
global.HOST = CONFIG.host;

//get SVERSION
let PUBDAY = 81.011;
let getNowDate = () => {
	let st = new Date
	let leadZero = t => {
		if (t < 10) t = '0' + t
		return t
	}
	return ('' + st.getYear()).slice(1) + leadZero(st.getMonth()) + leadZero(st.getDate()) + leadZero(st.getHours()) + leadZero(st.getMinutes());
}

SITE.version = `${getNowDate()}${PUBDAY}`;


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

ETC.ip = getIp();


// config
// let serverPort = Math.random() * 1000 | 0 + 6000;
// let jserverPort = serverPort + 1;
let staticPath = `http://${ETC.ip}:${ETC.jserverPort}`;
// ETC.serverPort = serverPort;
// ETC.jserverPort = jserverPort;
HOST[ETC.ip] = ETC.defaultPages;
SITE.staticPath = staticPath;