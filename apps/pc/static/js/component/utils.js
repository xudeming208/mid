fml.define('component/utils', ['component/md5'], function(require, exports) {

	// Underscore.js
	
	var md5 = require('component/md5');
	var isType = function(type) {
		return function(obj) {
			// return ({}).toString.call(obj).replace(/\[object\s(\w+)\]/g, '$1');
			return ({}).toString.call(obj) === '[object ' + type + ']';
		}
	}
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
			return isType('Object')(obj);
		},
		isArray: function(obj) {
			return Array.isArray ? Array.isArray(obj) : isType('Array')(obj);
		},
		isString: function(obj) {
			return isType('String')(obj);
		},
		isNumber: function(obj) {
			return isType('Number')(obj);
		},
		isFunction: function(obj) {
			return isType('Function')(obj);
		},
		isNaN: function(obj) {
			return moduleObj.isNumber(obj) && obj !== +obj;
		},
		isBoolean: function(obj) {
			return obj === true || obj === false || isType('Boolean')(obj);
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
				// uglifyJS压缩会报错，先注释
				// return [...new Set(arr)];
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
		// Object.assign、{...obj} 和 [...arr] 拷贝的都是引用类型的引用，不是实际的值

		// 如果需要实现真正的克隆，不是克隆其引用，可以用：JSON.parse(JSON.stringify(obj))，但是
		// JSON.parse(JSON.stringify(obj))有一些值不能正确clone：
		// * undefined(会直接删除此属性),
		// * function(会直接删除此属性),
		// * regexp(此属性的值会变成空对象),
		// * NaN(此属性的值会变成null),
		// * Infinity(此属性的值会变成null)
		deepClone: function(obj) {
			// return { ...obj };
			var o;
			if (obj.constructor == Object) {
				o = new obj.constructor();
			} else {
				o = new obj.constructor(obj.valueOf());
			}
			for (var key in obj) {
				if (o[key] != obj[key]) {
					if (typeof(obj[key]) == 'object') {
						o[key] = utils.deepClone(obj[key]);
					} else {
						o[key] = obj[key];
					}
				}
				// null
				if (Object.is(obj[key], null)) {
					o[key] = null;
				}
				// undefined
				if (Object.is(obj[key], void 0)) {
					o[key] = undefined;
				}
			}
			o.toString = obj.toString;
			o.valueOf = obj.valueOf;
			return o;
		},
		//获取参数
		getQueryString: function(name) {
			// var searchStr = window.location.search.substr(1);
			// if (window.URLSearchParams) {
			// 	var params = new URLSearchParams(searchStr);
			// 	return params.get(name);
			// }
			// var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			// var r = searchStr.match(reg);
			// if (r != null) return decodeURIComponent(r[2]);
			// return null;
			return new URL(location.href).searchParams.get(name);
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