'use strict'
const fs = require('fs');
const path = require('path');
const watchFile = require("./watchFile");
const isWindows = process.platform === 'win32';
let host = 'pc';
let quotes = '`';

// getTmpPath
const getTmpPath = tpl => {
	return path.resolve(__dirname, '../../tmp/', host + '_' + tpl.replace(/\//g, '_').replace(/\.html$/, '.js'));
}

// complie
const complie = (filePath, tpl, content, data) => {
	let tplStr = '';
	// 替换`字符
	// 如果保留模板中的`
	// content = content.replace(/`+/g,'\\`');
	// 如果按照ES6语法
	content = content.replace(/`+/g, '');

	let arr = content.split('<%');
	tplStr += "/* " + filePath + " */\n";
	tplStr += "let getHtml = require('" + (isWindows ? __filename.replace(/\\/g, '/') : __filename) + "').getHtml;\n";
	tplStr += "let _getHtml = _data => {\n";
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
	tplStr += 'exports._getHtml = _getHtml' + '\n';

	let tmpPath = getTmpPath(tpl);
	try {
		fs.writeFileSync(tmpPath, tplStr);
	} catch (error) {
		console.error(error);
	}
}

// 获取HTML
const getHtml = (tpl, data) => {
	let tmpPath = getTmpPath(tpl);
	let filePath = path.resolve(__dirname, '../', PATH.apps, host, PATH.view, '.', tpl);

	// watchFile
	watchFile(filePath, () => {
		delete require.cache[tmpPath];
		try {
			complie(filePath, tpl, fs.readFileSync(filePath, 'utf-8'), data);
		} catch (error) {
			console.error(error);
		}
	});

	// 没有缓存的话就编译
	if (!fs.existsSync(tmpPath)) {
		try {
			complie(filePath, tpl, fs.readFileSync(filePath, 'utf-8'), data);
		} catch (error) {
			console.error(error);
		}
	}

	return require(tmpPath)._getHtml(data);
}

// 输出HTML
const render = function(tpl, data = {}) {
	host = HOST[this.hostname];
	['_JSLinks', '_CSSLinks', '_JSstack', '_CSSstack', '_JSmods'].map(item => {
		if (!data.hasOwnProperty(item)) {
			data[item] = [];
		}
	});
	data.useModule = this.useModule.bind(data);

	// mkdir tmp
	let tmpDirPath = path.resolve(__dirname, '../../tmp');
	try {
		if (!fs.existsSync(tmpDirPath)) {
			fs.mkdirSync(tmpDirPath);
		}

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
			// 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
			'Server': ETC.server
		});
		!ETC.debug && (html = html.replace(/[\r\n\t]+/g, ''));
		this.res.end(html);
	} catch (error) {
		console.error(JSON.stringify({
			trace: console.trace(),
			error: error.toString()
		}));

		this.res.writeHead(503, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		})
		this.res.end('Oops! complie error!');
	}
}

module.exports = {
	getHtml,
	render
};