'use strict'
const events = require("events");
const mEmitter = new events.EventEmitter;
mEmitter.setMaxListeners(0);

const getIp = require('./getIp')();
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
ETC.ip = getIp;
let staticPath = `http://${ETC.ip}:${ETC.jserverPort}`;
HOST[ETC.ip] = ETC.defaultHost;
SITE.staticPath = staticPath;