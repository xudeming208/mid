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
		// 对象是否为空
		isEmpey: obj => {
			let arr = Object.keys(obj);
			return arr.length ? false : true;
		},
		htmlEncode: str => {
			return str ? str.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;') : '';
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
		// 数组去重
		unique: arr => {
			let hash = {},
				result = [],
				len = arr.length; //n为hash表，r为临时数组
			for (let i = 0; i < len; i++) {
				//如果hash表中没有当前项
				if (!hash[arr[i]]) {
					hash[arr[i]] = true; //存入hash表
					result.push(arr[i]);
				}
			}
			return result;
		},
		browser: (() => {
			let browser = '没作此浏览器的匹配',
				ua = self.req.headers['user-agent'];
			if (!ua) {
				return browser;
			}
			let ie = ua.match(/msie\s([\d.]+)/i),
				chrome = ua.match(/chrome\/([\d.]+)/i),
				safari = ua.match(/safari\/([\d.]+)/i),
				firefox = ua.match(/firefox\/([\d.]+)/i),
				opera = ua.match(/presto\/([\d.]+)/i),
				weixin = ua.match(/micromessenger\/([\d.]+)/i),
				qq = ua.match(/qq/i),
				uc = ua.match(/ucbrowser\/([\d.]+)/i);
			if (ie) {
				browser = `ie ${ie[1]}`;
			} else if (chrome) {
				browser = `chrome ${chrome[1]}`;
			} else if (weixin) {
				browser = `weixin ${weixin[1]}`;
			} else if (qq) {
				browser = `qq`;
			} else if (uc) {
				browser = `uc ${uc[1]}`;
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
				weixin = ua.match(/MicroMessenger/i),
				webkit = ua.match(/WebKit\/([\d.]+)/i),
				android = ua.match(/(Android)\s+([\d.]+)/i),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/i),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/i),
				webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/i),
				touchpad = webos && ua.match(/TouchPad/i),
				kindle = ua.match(/Kindle\/([\d.]+)/i),
				silk = ua.match(/Silk\/([\d._]+)/i),
				blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/i),
				bb10 = ua.match(/(BB10).*Version\/([\d.]+)/i),
				rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/i),
				playbook = ua.match(/PlayBook/i),
				chrome = ua.match(/Chrome\/([\d.]+)/i) || ua.match(/CriOS\/([\d.]+)/i),
				firefox = ua.match(/Firefox\/([\d.]+)/i);

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
				(chrome && ua.match(/Android/i)) || (chrome && ua.match(/CriOS\/([\d.]+)/i)) || (firefox && ua.match(/Mobile/i))));
			os.isWeixin = !!weixin;
			os.isMobileQQ = !!mobileQQ;
			os.isTablet = !!(ipad || playbook || (android && !ua.match(/Mobile/i)) || (firefox && ua.match(/Tablet/i)));
			return os;
		})()
	}
	return moduleObj;
}

module.exports = tools;