'use strict'
const fs = require('fs');
const path = require('path');
let appPath = path.resolve(__dirname, '../../../apps/');
let tplPath = '';
let isWindows = process.platform === 'win32';
let quotes = '`';

//watchTpl
function watchTpl(filePath, onChg) {
	if (isWindows) {
		fs.watch(filePath, {
			persistent: true,
			interval: 10
		}, onChg);
	} else {
		fs.watchFile(filePath, {
			persistent: true,
			interval: 10
		}, onChg);
	}
}

// complie
let complie = (filePath, tpl, content, data) => {
	let html = '';
	ETC.compress && (content = content.replace(/[\r\n\t]+/g, ''));
	let str = content.replace(/this/g, '_data');
	let arr = str.split('<%');
	html += "/* " + filePath + " */\n"
	html += "var getHtml=require('" + __filename + "').getHtml;\n"
	html += "function _getHtml(_data){\n"
	html += "let html='';\n"
	for (let i = 0, len = arr.length; i < len; i++) {
		let item = arr[i];
		if (!item) {
			continue;
		}
		if (item.indexOf('%>') > 0) {
			let rightArr = item.split('%>');
			switch (item.substr(0, 1)) {
				case '=':
					html += "html+=" + rightArr[0].substr(1) + "\n";
					break;
				case '#':
					html += "html+=getHtml('" + rightArr[0].substr(1) + "',_data);\n"
					break;
				default:
					html += rightArr[0] + "\n";
			}
			html += "html+=" + quotes + rightArr[1] + quotes + "\n";
		} else {
			html += "html+=" + quotes + arr[i] + quotes + "\n";
		}
	}
	html += "return html;"
	html += "}\n"
	html += 'exports._getHtml=_getHtml' + '\n'
	let tmpFile = path.resolve(__dirname, '../../tmp/', tpl.replace('.html', '.js'));
	fs.writeFileSync(tmpFile, html);
	return require(tmpFile)._getHtml(data);
};

// 获取HTML
let getHtml = (tpl, data) => {
	let filePath = path.resolve(tplPath, '.', tpl);
	let tmpFile = path.resolve(__dirname, '../../tmp/', tpl.replace('.html', '.js'));
	if (fs.existsSync(tmpFile)) {
		watchTpl(filePath, function() {
			delete require.cache[tmpFile];
			return complie(filePath, tpl, fs.readFileSync(filePath, 'utf-8'), data);
		});
		return require(tmpFile)._getHtml(data);
	} else {
		return complie(filePath, tpl, fs.readFileSync(filePath, 'utf-8'), data);
	}
};

// 输出HTML
let render = function(tpl, data) {
	if (this.req.__get['__pd__']) {
		//show data  
		var now = new Date()
		if (this.req.__get['__pd__'] == '/rb/' + (now.getMonth() + now.getDate() + 1)) {
			this.res.writeHead(200, {
				'Content-Type': 'text/plain',
				'Cache-Control': 'no-cache,no-store'
			});
			this.res.end(JSON.stringify(data));
			return;
		}
	}
	tplPath = path.resolve(appPath, HOST[this.hostname], PATH.view);
	this.res.end(getHtml(tpl, data));
}

exports.getHtml = getHtml;
exports.render = render;