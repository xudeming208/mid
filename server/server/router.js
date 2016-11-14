const url = require('url');
const path = require('path');
const fs = require('fs');
const getData = require('./base/getData.js').getData;
const render = require('./base/render.js').render;

let route = (req, res) => {
	let reqUrl = url.parse('http://' + req.headers.host + req.url, true),
		hostname = reqUrl.hostname,
		pathname = reqUrl.pathname,
		modUrl = pathname.substr(1).replace(/\/+/g, '/').split('/'),
		fileType = pathname.match(/(\.[^.]+|)$/)[0]; //取得后缀名
	console.log(fileType)
	if (fileType == '.ico') {
		fs.readFile('./favicon.ico', (err, html) => { //读取内容
			if (err) throw err;
			// console.log(data)
			res.writeHead(200, {
				"Content-Type": "image/x-icon;charset=utf-8"
			});
			res.end(html);
		});
		return;
	}
	/*
	url 格式 [/ 地址/...]模块文件名/方法名/[参数] 
	3 mod/fn/param
	2 mod/../param
	1 mod
	*/
	// console.log(modUrl)
	if (modUrl.length < 3) {
		modUrl.splice(1, 0, 'index');
	}
	// console.log(modUrl)
	let mods = modUrl.splice(-3),
		modName = mods[0] || ETC.defaultMod,
		modFun = mods[1] || 'index',
		modParam = mods[2] || null;
	// console.log(reqUrl.hostname)
	let modPath = path.resolve(__dirname, '../../apps/', PATH[HOST[hostname]], PATH.controller, modName + '.js');
	console.log(modPath);
	// console.log(req)
	let modJs = require(modPath);
	// console.log(modJs)
	// console.log(modFun)
	modJs['controllerObj']['hostname'] = hostname;
	modJs['controllerObj']['req'] = req;
	modJs['controllerObj']['res'] = res;
	modJs['controllerObj']['getData'] = getData;
	modJs['controllerObj']['render'] = render;
	modJs['controllerObj'][modFun](modParam);
}
exports.route = route;