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

global.SITE.version = `?v=${getNowDate()}${PUBDAY}`;