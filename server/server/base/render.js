'use strict'
const fs = require('fs');
const path = require('path');
let isWindows = process.platform === 'win32';
let interval = 20;
let persistent = true;
let host = 'pc';
let quotes = '`';

//watchTpl
let watchTpl = (filePath, onChg) => {
	if (isWindows) {
		fs.watch(filePath, {
			persistent: persistent,
			interval: interval
		}, onChg);
	} else {
		fs.watchFile(filePath, {
			persistent: persistent,
			interval: interval
		}, onChg);
	}
}

// getTmpFile
let getTmpFile = tpl => {
	return path.resolve(__dirname, '../../tmp/', host + tpl.replace('.html', '.js'));
}

// complie
let complie = (filePath, tpl, content, data) => {
	let html = '';
	ETC.compress && (content = content.replace(/[\r\n\t]+/g, ''));
	let str = content.replace(/this/g, '_data');
	let arr = str.split('<%');
	html += "/* " + filePath + " */\n"
	html += "let getHtml = require('" + __filename + "').getHtml;\n"
	html += "let _getHtml = _data => {\n"
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
	html += 'exports._getHtml = _getHtml' + '\n'
	let tmpFile = getTmpFile(tpl);
	fs.writeFileSync(tmpFile, html);
	return require(tmpFile)._getHtml(data);
}

// 获取HTML
let getHtml = (tpl, data) => {
	let filePath = path.resolve(__dirname, '../../../apps/', host, PATH.view, '.', tpl);
	let tmpFile = getTmpFile(tpl);
	//watchTpl
	watchTpl(filePath, function() {
		delete require.cache[tmpFile];
		return complie(filePath, tpl, fs.readFileSync(filePath, 'utf-8'), data);
	});
	if (fs.existsSync(tmpFile)) {
		return require(tmpFile)._getHtml(data);
	} else {
		return complie(filePath, tpl, fs.readFileSync(filePath, 'utf-8'), data);
	}
}

// 输出HTML
let render = function(tpl, data) {
	// mkdir tmp
	if (!fs.existsSync('../tmp')) {
		fs.mkdirSync('../tmp');
	}
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
	host = HOST[this.hostname];
	try {
		this.res.writeHead(200, {
			'Content-Type': 'text/html;charset=utf-8',
			'Cache-Control': 'no-cache,no-store',
			'X-Frame-Options': 'SAMEORIGIN',
			'X-Xss-Protection': '1; mode=block',
			'X-Content-Type-Options': 'nosniff',
			'Server': ETC.server
		})
		this.res.end(getHtml(tpl, data) || '');
	} catch (err) {
		console.log(err);
	}
}

exports.getHtml = getHtml;
exports.render = render;