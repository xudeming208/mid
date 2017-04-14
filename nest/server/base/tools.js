'use strict'
const path = require('path');
const cryto = require('crypto');
const isWindows = process.platform === 'win32';

// TOOLS(常用的工具函数集合)，只能用于nodeJS端，比如server代码或者模板中，例如：TOOLS.md5(str)
function tools() {
	const self = this;
	let moduleObj = {
		loadModel: modName => {
			return require(path.resolve(__dirname, '../', PATH.apps, HOST[self.hostname], PATH.model, modName));
		},
		md5: str => {
			return str ? cryto.createHash('md5').update(str.toString()).digest('hex') : '';
		},
		//获取数组中最大的值
		getMax: arr => {
			return Math.max.apply(null, arr);
		},
		getMin: arr => {
			return Math.min.apply(null, arr);
		},
		// 对象是否为空
		isEmpey: obj => {
			return Object.keys(obj).length ? false : true;
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
		isNumber: obj => {
			return ({}).toString.call(obj) === '[object Number]';
		},
		isFunction: function(obj) {
			return ({}).toString.call(obj) === '[object Function]';
		},
		isNaN: obj => {
			return moduleObj.isNumber(obj) && obj !== +obj;;
		},
		isBoolean: obj => {
			return obj === true || obj === false || ({}).toString.call(obj) === '[object Boolean]';
		},
		isNull: obj => {
			return obj === null;
		},
		isUndefined: obj => {
			return obj === void 0;
		},
		// 数组去重
		unique: arr => {
			return [...new Set(arr)];
		},
		os: (() => {
			let os = {},
				ua = self.req.headers['user-agent'],
				mobileQQ = ua.match(/qq\/(\/[\d\.]+)*/i) || ua.match(/qzone\//i),
				weixin = ua.match(/MicroMessenger/i),
				webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
				android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
				osx = !!ua.match(/\(Macintosh\; Intel /),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				wp = ua.match(/Windows Phone ([\d.]+)/),
				touchpad = webos && ua.match(/TouchPad/),
				kindle = ua.match(/Kindle\/([\d.]+)/),
				silk = ua.match(/Silk\/([\d._]+)/),
				blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
				bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
				rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
				playbook = ua.match(/PlayBook/),
				chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
				firefox = ua.match(/Firefox\/([\d.]+)/),
				firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
				ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
				webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
				safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
				opera = ua.match(/presto\/([\d.]+)/i),
				uc = ua.match(/ucbrowser\/([\d.]+)/i),
				qqbrowser = ua.match(/qqbrowser\/([\d.]+)/i);

			os.browser = {};
			if (os.browser.webkit = !!webkit) os.browser.version = webkit[1]

			if (android) os.android = true, os.version = android[2]
			if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
			if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
			if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
			if (wp) os.wp = true, os.version = wp[1]
			if (webos) os.webos = true, os.version = webos[2]
			if (touchpad) os.touchpad = true
			if (blackberry) os.blackberry = true, os.version = blackberry[2]
			if (bb10) os.bb10 = true, os.version = bb10[2]
			if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
			if (playbook) os.browser.playbook = true
			if (kindle) os.kindle = true, os.version = kindle[1]
			if (silk) os.browser.silk = true, os.browser.version = silk[1]
			if (!silk && os.android && ua.match(/Kindle Fire/)) os.browser.silk = true
			if (chrome) os.browser.chrome = true, os.browser.version = chrome[1]
			if (firefox) os.browser.firefox = true, os.browser.version = firefox[1]
			if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
			if (ie) os.browser.ie = true, os.browser.version = ie[1]
			if (opera) os.browser.opera = true, os.browser.version = opera[1]
			if (uc) os.browser.uc = true, os.browser.version = uc[1]
			if (qqbrowser) os.browser.qqbrowser = true, os.browser.version = qqbrowser[1]
			if (safari && (osx || os.ios || isWindows)) {
				os.browser.safari = true
				if (!os.ios) os.browser.version = safari[1]
			}
			if (webview) os.browser.webview = true

			os.browser.isWeixin = !!weixin;
			os.browser.isMobileQQ = !!mobileQQ;
			os.isTablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
				(firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
			os.isMobile = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
				(chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
				(firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
			return os;
		})()
	}
	return moduleObj;
}

module.exports = tools;