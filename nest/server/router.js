'use strict'
const url = require('url');
const path = require('path');
const fs = require('fs');
const watcher = require("./base/watch");
const getData = require('./base/getData');
const useModule = require('./base/useModule');
const redirectTo = require('./base/redirectTo');
const render = require('./base/render').render;

let route = (req, res) => {
	// try {
	// 	var reqUrl = url.parse('http://' + req.headers.host + req.url, true);
	// } catch (err) {
	// 	console.log('Route Parse Error:', req.url)
	// 	res.writeHead(500, {
	// 		'Content-Type': 'text/plain'
	// 	});
	// 	res.end('url is wrong');
	// 	return
	// }
	// let hostname = reqUrl.hostname,
	// 	pathname = reqUrl.pathname,
	// 	modUrl = pathname.substr(1).replace(/\/+/g, '/').split('/');

	console.log((req.url).split('?'))
	let reqUrl = req.url,
		hostname = req.headers.host.split(':')[0],
		reqUrlArr = reqUrl.split('?'),
		modUrl = reqUrlArr[0].substr(1).replace(/\/+/g, '/').split('/'),
		reqQuery = reqUrlArr[1] && reqUrlArr[1].split('&') || [];

	// favicon.ico
	if (reqUrl == '/favicon.ico') {
		let icoPath = path.resolve(__dirname, '../', 'favicon.ico');
		fs.readFile(icoPath, (err, html) => {
			if (err) {
				res.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				// console.log(err);
				res.end(JSON.stringify(err));
			}
			res.writeHead(200, {
				'Server': ETC.server,
				'Content-Type': 'image/x-icon;charset=utf-8'
			});
			res.end(html);
		});
		return;
	}

	// 获取URL参数
	// console.log('---------------------------------------------');
	// console.log(reqUrl);
	req.__get = {};
	reqQuery.forEach(function(query) {
		let queryArr = query.split('=');
		req.__get[queryArr[0]] = queryArr[1];
	});
	// console.log(req.__get)
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
	let controllerPath = path.resolve(__dirname, PATH.apps, PATH[HOST[hostname]], PATH.controller),
		modPath = path.resolve(controllerPath, modName + '.js');
	// console.log(reqUrl)

	// console.log(modPath);
	let notFoundFun = (modPath) => {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		res.end('404 Not Found');
		console.log('cannot found modPath:\n' + modPath);
	}
	if (!fs.existsSync(modPath)) {
		notFoundFun(modPath);
	} else {
		// console.log(req)
		let modJs = require(modPath);
		// console.log(modJs)
		// console.log(modFun)
		let extendObj = {
			hostname,
			req,
			res,
			getData,
			useModule,
			redirectTo,
			render
		};
		let modJsObj = modJs['controllerObj'];
		// merge
		Object.assign(modJsObj, extendObj);
		// watcher
		watcher.takeCare(controllerPath);

		let fn = modJsObj[modFun];
		if (fn && typeof fn === 'function') {
			fn.call(modJsObj, modParam);
		} else {
			notFoundFun(fn);
		}
	}
}
module.exports = route;