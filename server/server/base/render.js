const fs = require('fs');
const path = require('path');

// complie
let complie = (obj, tpl, content, data) => {
	let html = '';
	let result = '';
	let str = content.replace(/[\r\n\t]+/g, '').replace(/this/g, '_data'),
		arr = str.split('<%');
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
			html += "html+='" + rightArr[1] + "'\n";
		} else {
			html += "html+='" + arr[i] + "'\n";
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
let getHtml = function(obj, tpl, data) {
	let filePath = path.resolve(__dirname, '../../../apps/', HOST[obj.hostname], PATH.view, '.', tpl);
	console.log('-----------')
	console.log(filePath)
	return complie(obj, tpl, fs.readFileSync(filePath, 'utf-8'), data);
};

// 输出HTML
let render = function(tpl, data) {
	this.res.end(getHtml(this, tpl, data));
}

exports.getHtml = getHtml;
exports.render = render;