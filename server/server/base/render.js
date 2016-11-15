const fs = require('fs');
const path = require('path');
let quotes = ETC.compress ? "'" : "`";

// complie
let complie = (obj, tpl, content, data) => {
	let html = '';
	let result = '';
	ETC.compress && (content = content.replace(/[\r\n\t]+/g, ''));
	let str = content.replace(/this/g, '_data');
	let arr = str.split('<%');
	// console.log(arr)
	html += "var getHtml=require('" + __filename + "').getHtml;\n"
	html += "function _getHtml(obj,_data){\n"
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
					html += "html+=getHtml(obj,'" + rightArr[0].substr(1) + "',_data);\n"
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
	// console.log(tmpFile)
	// if (!fs.existsSync(tmpFile)) {
	fs.writeFileSync(tmpFile, html);
	// }
	result = require(tmpFile)._getHtml(obj, data);
	return result
};

// 获取HTML
let getHtml = (obj, tpl, data) => {
	let filePath = path.resolve(__dirname, '../../../apps/', HOST[obj.hostname], PATH.view, '.', tpl);
	console.log('-----------')
	console.log(filePath)
	return complie(obj, tpl, fs.readFileSync(filePath, 'utf-8'), data);
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
	this.res.end(getHtml(this, tpl, data));
}

exports.getHtml = getHtml;
exports.render = render;