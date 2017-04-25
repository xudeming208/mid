'use strict'
const fs = require('fs');
const path = require('path');
const watchFile = require("./watchFile");
let isWindows = process.platform === 'win32';
let host = 'pc';
let quotes = '`';
//去掉注释，包含单行和多行<!--注释-->、//注释、/*注释*/，同时不去掉//www.baidu.com/img/bd_logo1.png
let reg = /<!--[\s\S]*?-->|[^\S]\/\/.*|\/\*[\s\S]*?\*\//g;

// getTmpFile
let getTmpFile = tpl => {
	return path.resolve(__dirname, '../../../tmp/', host + '_' + tpl.replace(/\//g, '_').replace('.html', '.js'));
}

// complie
let complie = (filePath, tpl, content, data) => {
	let tplStr = '';
	let arr = content.replace(reg, '\n').split('<%');
	tplStr += "/* " + filePath + " */\n";
	tplStr += "let getHtml = require('" + (isWindows ? __filename.replace(/\\/g, '/') : __filename) + "').getHtml;\n";
	tplStr += "let requireWidget = getHtml\n";
	tplStr += "let _getHtml = _data => {\n";
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
							tplStr += "html+=TOOLS.htmlEncode(" + rightArr0.substr(2) + ")\n";
							break;
						default:
							tplStr += "html+=" + rightArr0.substr(1) + "\n";
							break;
					}
					break;
				case '#':
					tplStr += "html+=getHtml('" + rightArr0.substr(1) + "',_data);\n";
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
	let tmpFile = getTmpFile(tpl);
	fs.writeFileSync(tmpFile, tplStr);
	return require(tmpFile)._getHtml(data);
}

// 获取HTML
let getHtml = (tpl, data) => {
	let filePath = path.resolve(__dirname, '../', PATH.apps, host, PATH.view, '.', tpl);
	let tmpFile = getTmpFile(tpl);
	//watchFile
	watchFile(filePath, () => {
		delete require.cache[tmpFile];
		return complie(filePath, tpl, fs.readFileSync(filePath, 'utf-8'), data);
	});
	if (fs.existsSync(tmpFile)) {
		ETC.debug && delete require.cache[tmpFile];
		return require(tmpFile)._getHtml(data);
	} else {
		return complie(filePath, tpl, fs.readFileSync(filePath, 'utf-8'), data);
	}
}

// 输出HTML
let render = function(tpl, data = {}) {
	host = HOST[this.hostname];
	['_JSLinks', '_CSSLinks', '_JSstack', '_CSSstack', '_JSmods', '_CSSmods'].map(item => {
		if (!data.hasOwnProperty(item)) {
			data[item] = [];
		}
	});
	data.useModule = this.useModule.bind(data);
	//combo css
	if (ETC.merge) {
		// data._CSSmods = [].concat(data._CSSLinks);
		data._CSSmods.push(...data._CSSLinks);
		data._CSSLinks.length = 0;
	}
	// mkdir tmp
	let tmpPath = path.resolve(__dirname, '../../../tmp');
	if (!fs.existsSync(tmpPath)) {
		fs.mkdirSync(tmpPath);
	}
	//show data
	if (this.req.__get['__pd__']) {
		let now = new Date();
		if (this.req.__get['__pd__'] == '/rb/' + (now.getMonth() + now.getDate() + 1)) {
			this.res.writeHead(200, {
				'Content-Type': 'text/plain',
				'Cache-Control': 'no-cache,no-store'
			});
			this.res.end(JSON.stringify(data));
			return;
		}
	}
	try {
		let html = getHtml(tpl, data);
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
		console.dir(e);
		this.res.writeHead(503, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		})
		this.res.end('oops! complie error!');
		return;
	}
}

exports.getHtml = getHtml;
exports.render = render;