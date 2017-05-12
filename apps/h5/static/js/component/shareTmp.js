fml.define('component/shareTmp', ['component/utils'], function(require, exports) {
	var utils = require('component/utils');
	var cache = {};

	function etic(str, data, isCheck) {
		//debug模式下默认开启检查,isCheck为false时不检查
		if (fml.vars.debug && utils.isUndefined(isCheck)) {
			isCheck = true;
		}

		if (isCheck) {
			checkTemplate(str, data);
		}

		if (!cache[str]) {
			var tpl = document.getElementById(str).innerHTML;

			tpl = tpl
				.replace(/[\r\t\n]/g, " ")
				.split("<\?").join("\t")
				.replace(/((^|\?>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)\?>/g, "',$1,'")
				.split("\t").join("');")
				.split("\?>").join(";p.push('")
				.split("\r").join("\\'");

			try {
				cache[str] = new Function("", "var p=[];p.push('" + tpl + "');return p.join('');");
			} catch (e) {
				if (console) {
					console.error(e);

					var err = tpl.replace(/^[ ]*\'\)|p.push\(\'[ ]*\'\)|p.push\(\'/g, '').replace(/^[ ]*;|;[ ]*$/g, '');

					console.error(e.message + "   :   " + err);

					var errNode = document.createElement('script');

					errNode.innerHTML = err;

					try {
						// document.body.appendChild(errNode);
						var s = new Function('', err);
					} catch (e) {
						console.error(e);
					}
				}
			}
		}

		var fn = cache[str];

		if (data) {
			try {
				return fn.apply(data);
			} catch (e) {
				if (console) {
					console.error(e);
					console.log(data);
				}
			}
		} else {
			return fn;
		}
	}



	// checkTemplate
	function checkTemplate(str, data) {
		'use strict';

		var source = document.getElementById(str).innerHTML;
		var jsStr = '';
		var jsInner = '';
		var innerArr = [];
		var arr = source.split('<?');
		for (var i = 0, len = arr.length; i < len; i++) {
			if (!~arr[i].indexOf('?>')) {
				continue;
			}
			innerArr = arr[i].split('?>');
			jsStr = innerArr[0];
			if (jsStr.substr(0, 1) === '=') {
				jsInner += jsStr.substr(1) + ';\n';
			} else {
				jsInner += jsStr + '\n';
			}
		}

		var fn = '(function() {\r\n';

		fn += jsInner;

		fn += "}.call(JSON.parse('" + JSON.stringify(data).replace(/\'/g, '‘') + "')))";

		/*
		 onerror arguments：https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onerror
		 */
		var iframe = document.createElement('iframe');

		iframe.style.display = "none";
		iframe.setAttribute('id', 'iframe');
		document.body.appendChild(iframe);
		iframe.contentWindow.$ = window.$;
		iframe.contentWindow.onerror = function(msg, _, line, col, error) {

			console.group('Error');
			console.log('Error occurs at Line:', line, ' Col:', col);

			requestAnimationFrame(function() {
				console.groupEnd();
			});

			return false;
		};

		var doc = iframe.contentDocument;
		var s = doc.createElement('script');
		s.innerHTML = fn;
		doc.body.appendChild(s);
	}


	// var sjt = require('core/etic');
	return function(obj, data, isCheck) {
		data = data || Object;
		try {
			var shareTpl = etic(obj, data, isCheck);
		} catch (e) {
			fml.debug(e);
		}
		return shareTpl;
	};
});