'use strict'
const url = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const watchFile = require("./base/watchFile");
const getData = require('./base/getData');
const useModule = require('./base/useModule');
const redirectTo = require('./base/redirectTo');
const render = require('./base/render').render;
const ajaxTo = require('./base/ajaxTo');
const tools = require('./base/tools');

let route = (req, res) => {
	try {
		var reqUrl = url.parse('http://' + req.headers.host + req.url, true);
	} catch (err) {
		console.log(`Route Parse Error: ${req.url}`);
		res.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		res.end('url is wrong');
		return;
	}
	let hostname = reqUrl.hostname,
		pathname = reqUrl.pathname,
		modUrl = pathname.substr(1).replace(/\/+/g, '/').split('/'),
		reqQuery = reqUrl.query || {};

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

	// 获取参数
	req.__get = {};
	req.__post = {}
	for (let key in reqQuery) {
		req.__get[key.replace(/[<>%\'\"]/g, '')] = reqQuery[key];
	}

	console.log(`query: `, req.__get);

	/*
	url 格式 [/ 地址/...]模块文件名/方法名/[参数] 
	3 mod/fn/param
	2 mod/../param
	1 mod
	*/

	if (modUrl.length < 3) {
		modUrl.splice(1, 0, 'index');
	}

	let mods = modUrl.splice(-3),
		modName = mods[0] || ETC.defaultMod,
		modFun = mods.length >= 2 ? mods[1] : 'index',
		modParam = mods.length >= 3 ? mods[2] : null;

	if (modParam) {
		modParam = decodeURIComponent(modParam);
	}

	console.log(`hostname: ${hostname}`);

	let controllerPath = path.resolve(__dirname, PATH.apps, HOST[hostname], PATH.controller),
		modPath = path.resolve(controllerPath, modName + '.js');

	// notFoundFun
	let notFoundFun = (modPath) => {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		res.end('404 Not Found');
		console.log(`cannot found modPath: ${modPath}`);
	}
	if (!fs.existsSync(modPath)) {
		notFoundFun(modPath);
		return;
	}

	let modJs = require(modPath);
	// watchFile
	watchFile(modPath, function() {
		delete require.cache[modPath];
	});

	let modJsObj = modJs['controlObj'],
		extendObj = {
			hostname,
			req,
			res,
			getData,
			useModule,
			redirectTo,
			render,
			ajaxTo,
			tools
		};

	// merge
	Object.assign(modJsObj, extendObj);

	// TOOLS(常用的工具函数集合)，代码和模板中都可以使用，例如：TOOLS.md5(str)
	global.TOOLS = modJsObj.tools();

	let fn = modJsObj[modFun];

	let toExe = () => {
		if (fn && typeof fn === 'function') {
			try {
				fn.call(modJsObj, modParam);
			} catch (err) {
				res.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				res.end('err: ', err);
				console.log('err: ', err);
			}
		} else {
			notFoundFun(fn);
		}
	}

	// post
	if ('POST' == req.method) {
		let data = '';
		req.addListener('data', chunk => {
				data += chunk;
				if (data.length > 1e6) {
					req.connection.destroy()
				}
			})
			.addListener('end', () => {
				data = querystring.parse(data);
				req.__post = data;
				toExe();
			})
	} else {
		toExe();
	}
}
module.exports = route;