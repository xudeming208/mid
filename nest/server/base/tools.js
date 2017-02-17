'use strict'
const path = require('path');
const cryto = require('crypto');

function tools() {
	const self = this;
	let moduleObj = {
		loadModel: modName => {
			return require(path.resolve(__dirname, '../', PATH.apps, HOST[self.hostname], PATH.model, modName));
		},
		md5: str => {
			return str ? cryto.createHash('md5').update(str.toString()).digest('hex') : '';
		},
		isEmpey: obj => {
			let arr = Object.keys(obj);
			return arr.length ? false : true;
		},
		htmlEncode: str => {
			return str.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
		},
		isObject: obj => {
			return ({}).toString.call(obj) === '[object Object]';
		},
		isArray: obj => {
			return Array.isArray(obj) || ({}).toString.call(obj) === '[object Array]';
		},
		isString: obj => {
			return ({}).toString.call(obj) === '[object String]';
		},
		browser: (() => {
			let browser = 'unknow',
				ua = self.req.headers['user-agent'].toLowerCase();
			if (!ua) {
				return browser;
			}
			let ie = ua.match(/msie\s([\d.]+)/),
				chrome = ua.match(/chrome\/([\d.]+)/),
				safari = ua.match(/safari\/([\d.]+)/),
				firefox = ua.match(/firefox\/([\d.]+)/),
				opera = ua.match(/presto\/([\d.]+)/);
			if (ie) {
				browser = `ie ${ie[1]}`;
			} else if (chrome) {
				browser = `chrome ${chrome[1]}`;
			} else if (safari) {
				browser = `safari ${safari[1]}`;
			} else if (firefox) {
				browser = `firefox ${firefox[1]}`;
			} else if (opera) {
				browser = `opera ${opera[1]}`;
			}
			return browser;
		})(),
		os: (() => {
			let os = {},
				ua = self.req.headers['user-agent'];
			if (!ua) {
				return os;
			}
			let mobileQQ = ua.match(/qq\/(\/[\d\.]+)*/i) || ua.match(/qzone\//i),
				weixin = ua.match(/MicroMessenger/),
				webkit = ua.match(/WebKit\/([\d.]+)/),
				android = ua.match(/(Android)\s+([\d.]+)/),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				touchpad = webos && ua.match(/TouchPad/),
				kindle = ua.match(/Kindle\/([\d.]+)/),
				silk = ua.match(/Silk\/([\d._]+)/),
				blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
				bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
				rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
				playbook = ua.match(/PlayBook/),
				chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
				firefox = ua.match(/Firefox\/([\d.]+)/);

			if (android) os.isAndroid = true, os.version = android[2]
			if (iphone) os.isIos = os.isIphone = true, os.version = iphone[2].replace(/_/g, '.')
			if (ipad) os.isIos = os.isIpad = true, os.version = ipad[2].replace(/_/g, '.')
			if (webos) os.isWebos = true, os.version = webos[2]
			if (touchpad) os.isTouchpad = true
			if (blackberry) os.isBlackberry = true, os.version = blackberry[2]
			if (bb10) os.isBb10 = true, os.version = bb10[2]
			if (rimtabletos) os.isRimtabletos = true, os.version = rimtabletos[2]
			if (kindle) os.isKindle = true, os.version = kindle[1]

			os.isMobile = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
				(chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))));
			os.isWeixin = !!weixin;
			os.isMobileQQ = !!mobileQQ;
			os.isTablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)));
			return os;
		})()
	}
	return moduleObj;
}

module.exports = tools;