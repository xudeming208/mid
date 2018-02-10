'use strict'
const fs = require('fs');
const path = require('path');
// const watchFile = require("./watchFile");
const isWindows = process.platform === 'win32';
let host = 'pc';
let quotes = '`';
let routeObj = {};

// getTmpFile
const getTmpPath = (tpl) => {
	let modName = routeObj.modName,
		modFun = routeObj.modFun,
		modParam = routeObj.modParam;

	let reg = /\?.*/g,
		query = tpl.match(reg) ? tpl.match(reg)[0].substr(1).replace(/(=|&)/g, '_') : '';

	return path.resolve(__dirname, '../../tmp/', host + '_' + modName + '_' + modFun + '_' + modParam + '_' + query + tpl.replace(/\//g, '_').replace(reg, ''));
}

// complie
const complie = (tpl, content) => {
	let tplStr = '';
	let arr = content.split('<%');
	tplStr += "let _getHtml = (getHtml,_data) => {\n";
	tplStr += "let requireWidget = getHtml\n";
	tplStr += "let html='';\n";
	for (let i = 0, len = arr.length; i < len; i++) {
		// let item = arr[i].trim();
		let item = arr[i].replace(/^\s*/g, '');
		if (!item) {
			continue;
		}
		if (~item.indexOf('%>')) {
			let rightArr = item.split('%>'),
				rightArr0 = rightArr[0].replace(/this/g, '_data'),
				rightArr1 = rightArr[1];
			switch (item.substr(0, 1)) {
				case '=':
					// '<%== val %>' 防止XSS
					switch (item.substr(1, 1)) {
						case '=':
							tplStr += "html+=UTILS.htmlEncode(" + rightArr0.substr(2) + ")\n";
							break;
						default:
							tplStr += "html+=" + rightArr0.substr(1) + "\n";
							break;
					}
					break;
				case '#':
					tplStr += "html+=getHtml('" + rightArr0.substr(1) + "',_data);\n";
					break;
				case '*':
					break;
				default:
					tplStr += ";" + rightArr0 + "\n";
			}
			tplStr += "html+=" + quotes + rightArr1 + quotes + "\n";
		} else {
			tplStr += "html+=" + quotes + item + quotes + "\n";
		}
	}
	tplStr += "return html;";
	tplStr += "}\n";
	tplStr += 'return _getHtml' + '\n';

	return new Function(tplStr)();
}

// 将HTML写入缓存
function writeTmp(tpl, content, getHtml, data) {
	let tmpPath = getTmpPath(tpl);
	// 获取html
	let htmlCode = complie(tpl, content)(getHtml, data);
	// 写入缓存
	fs.writeFileSync(tmpPath, htmlCode);

	return htmlCode;
}

// 获取HTML
const getHtml = (tpl, data) => {
	let tmpPath = getTmpPath(tpl);
	let filePath = path.resolve(__dirname, '../', PATH.apps, host, PATH.view, '.', tpl);
	// 获取模板内容
	let content = fs.readFileSync(filePath.replace(/\?.*/g, ''), 'utf-8');

	// 没有缓存的话就编译
	if (!fs.existsSync(tmpPath)) {
		return writeTmp(tpl, content, getHtml, data);
	} else{
		// watchFile
		// watchFile(filePath, () => {
		// 	return writeTmp(tpl, content, getHtml, data);
		// });
		return fs.readFileSync(tmpPath, 'utf-8');
	}
}

// 输出HTML
const render = function(tpl, data = {}) {
	// 根据请求获取controller、function、argument
	routeObj = {
		modName: this.modName,
		modFun: this.modFun,
		modParam: this.modParam
	};

	host = HOST[this.hostname];
	['_JSLinks', '_CSSLinks', '_JSstack', '_CSSstack', '_JSmods'].map(item => {
		if (!data.hasOwnProperty(item)) {
			data[item] = [];
		}
	});
	data.useModule = this.useModule.bind(data);

	// mkdir tmp
	let tmpDirPath = path.resolve(__dirname, '../../tmp');
	if (!fs.existsSync(tmpDirPath)) {
		fs.mkdirSync(tmpDirPath);
	}

	try {
		let html = getHtml(tpl, data);

		//show render data
		if (this.req.__get.server === 'json') {
			this.res.writeHead(200, {
				'Content-Type': 'text/plain',
				'Cache-Control': 'no-cache,no-store'
			});
			this.res.end(JSON.stringify(data));
			return;
		}

		this.res.writeHead(200, {
			'Content-Type': 'text/html;charset=utf-8',
			'Cache-Control': 'no-cache,no-store',
			'X-Frame-Options': 'SAMEORIGIN',
			'X-Xss-Protection': '1; mode=block',
			'X-Content-Type-Options': 'nosniff',
			// 'Access-Control-Allow-Origin': '*',
			'Server': ETC.server
		});
		!ETC.debug && (html = html.replace(/[\r\n\t]+/g, ''));
		this.res.end(html);
	} catch (e) {
		console.error(e);
		this.res.writeHead(503, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		})
		this.res.end('Oops! complie error!');
	}
}

module.exports = render;