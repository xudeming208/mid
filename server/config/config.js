'use strict'
const getIp = require('./getIp.js');
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

// config
ETC.ip = getIp();
// let serverPort = Math.random() * 1000 | 0 + 6000;
// let jserverPort = serverPort + 1;
let staticPath = `http://${ETC.ip}:${ETC.jserverPort}`;
// ETC.serverPort = serverPort;
// ETC.jserverPort = jserverPort;
HOST[ETC.ip] = ETC.defaultPages;
SITE.staticPath = staticPath;