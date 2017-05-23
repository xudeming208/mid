fml.define('component/utils', ['component/md5'], function(require, exports) {

	// Underscore.js
	
	var md5 = require('component/md5');
	// 常用的方法集合
	var utils = {
		md5: function(str) {
			return str ? md5(str) : '';
		},
		// 获取数组中最大的值
		getMax: function(arr) {
			return Math.max.apply(null, arr);
		},
		getMin: function(arr) {
			return Math.min.apply(null, arr);
		},
		// 对象是否为空
		isEmpey: function(obj) {
			return Object.keys(obj).length ? false : true;
		},
		htmlEncode: function(str) {
			return str ? str.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;') : '';
		},
		isObject: function(obj) {
			return ({}).toString.call(obj) === '[object Object]';
		},
		isArray: function(obj) {
			return Array.isArray(obj) || ({}).toString.call(obj) === '[object Array]';
		},
		isString: function(obj) {
			return ({}).toString.call(obj) === '[object String]';
		},
		isNumber: function(obj) {
			return ({}).toString.call(obj) === '[object Number]';
		},
		isFunction: function(obj) {
			return ({}).toString.call(obj) === '[object Function]';
		},
		isNaN: function(obj) {
			return moduleObj.isNumber(obj) && obj !== +obj;
		},
		isBoolean: function(obj) {
			return obj === true || obj === false || ({}).toString.call(obj) === '[object Boolean]';
		},
		isNull: function(obj) {
			return obj === null;
		},
		isUndefined: function(obj) {
			return obj === void 0;
		},
		// 数组去重
		unique: function(arr) {
			if (window.Set) {
				return [...new Set(arr)];
			}
			var hash = {},
				i = 0,
				result = [],
				len = arr.length; //n为hash表，r为临时数组
			for (; i < len; i++) {
				//如果hash表中没有当前项
				if (!hash[arr[i]]) {
					hash[arr[i]] = true; //存入hash表
					result.push(arr[i]);
				}
			}
			return result;
		},
		//获取参数
		getQueryString: function(name) {
			var searchStr = window.location.search.substr(1);
			if (window.URLSearchParams) {
				var params = new URLSearchParams(searchStr);
				return params.get(name);
			}
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = searchStr.match(reg);
			if (r != null) return decodeURIComponent(r[2]);
			return null;
		},
		os: (function() {
			var os = {},
				ua = navigator.userAgent,
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
			if (safari && (osx || os.ios)) {
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

	return utils;
})