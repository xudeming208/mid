'use strict'
/**
 * @file 工具集
 */

// npm install lodash

const path = require('path');
const cryto = require('crypto');
const isWindows = process.platform === 'win32';

// UTILS(常用的工具函数集合)，只能用于nodeJS端，比如server代码或者模板中，例如：UTILS.md5(str)
function utils() {
	const self = this;
	const isType = type => {
		return obj => {
			// return ({}).toString.call(obj).replace(/\[object\s(\w+)\]/g, '$1');
			return ({}).toString.call(obj) === '[object ' + type + ']';
		}
	}
	let moduleObj = {
		getModelPath: modName => {
			return path.resolve(__dirname, '../', PATH.apps, HOST[self.hostname], PATH.model, modName);
		},
		md5: str => {
			return str ? cryto.createHash('md5').update(str.toString()).digest('hex') : '';
		},
		//获取数组中最大的值
		getMax: arr => {
			// return Math.max.apply(null, arr);
			return Math.max(...arr);
		},
		getMin: arr => {
			// return Math.min.apply(null, arr);
			return Math.min(...arr);
		},
		// 对象是否为空
		isEmpey: obj => {
			return Object.keys(obj).length ? false : true;
		},
		htmlEncode: str => {
			return str ? str.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;') : '';
		},
		isObject: obj => {
			return isType('Object')(obj);
		},
		isArray: obj => {
			return Array.isArray ? Array.isArray(obj) : isType('Array')(obj);
		},
		isString: obj => {
			return isType('String')(obj);
		},
		isNumber: obj => {
			return isType('Number')(obj);
		},
		isFunction: function(obj) {
			return isType('Function')(obj);
		},
		isNaN: obj => {
			// return moduleObj.isNumber(obj) && obj !== +obj;
			return Object.is(obj, NaN);
		},
		isBoolean: obj => {
			return obj === true || obj === false || isType('Boolean')(obj);;
		},
		isNull: obj => {
			// return obj === null;
			return Object.is(obj, null);
		},
		isUndefined: obj => {
			// return obj === void 0;
			return Object.is(obj, void 0);
		},
		// 拷贝数组，注意拷贝的都是引用类型的引用，不是实际的值，如果需要深度克隆，可用deepClone
		copyArr: arr => {
			return [...arr];
		},
		// 数组去重
		unique: arr => {
			// return Array.from(new Set(arr));
			return [...new Set(arr)];
		},
		// Object.assign、{...obj} 和 [...arr] 拷贝的都是引用类型的引用，不是实际的值

		// 如果需要实现真正的克隆，不是克隆其引用，可以用：JSON.parse(JSON.stringify(obj))，但是
		// JSON.parse(JSON.stringify(obj))有一些值不能正确clone：
		// * undefined(会直接删除此属性),
		// * function(会直接删除此属性),
		// * regexp(此属性的值会变成空对象),
		// * NaN(此属性的值会变成null),
		// * Infinity(此属性的值会变成null)
		deepClone: obj => {
			// return { ...obj };
			let o;
			if (obj.constructor == Object) {
				o = new obj.constructor();
			} else {
				o = new obj.constructor(obj.valueOf());
			}
			for (let key in obj) {
				if (o[key] != obj[key]) {
					if (typeof(obj[key]) == 'object') {
						o[key] = moduleObj.deepClone(obj[key]);
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
		// 多个对象合并
		// let a = {
		// 	x: 1
		// };
		// let b = {
		// 	y: 2
		// };
		// mergeObj(a, b) //{x:1,y:2}
		mergeObj: (...objs) => {
			return Object.assign({}, ...objs);
		},
		os: (() => {
			let os = {},
				ua = self.req.headers['user-agent'] || '',
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

module.exports = utils;