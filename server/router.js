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
const utils = require('./base/utils');

const route = (req, res) => {
	try {
		var reqUrl = url.parse('http://' + req.headers.host + req.url, true);
	} catch (err) {
		console.error(`Route Parse Error: ${req.url}`);
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

	// 获取参数
	// 如果是GET方式，参数的key重复了，其值会是数组，而POST方式不会是数组，而是后面的值覆盖前面的值，所以利用参数时要判断其值的类型，避免报错
	// foo=bar&foo=baz
	// var query = url.parse(req.url, true).query;
	// {
	// foo: ['bar', 'baz']
	// }

	req.__get = {};
	req.__post = {}
	for (let key in reqQuery) {
		req.__get[key.replace(/[<>%\'\"]/g, '')] = reqQuery[key];
	}

	/*
	url 格式 [/ 地址/...]模块文件名/方法名/[参数] 
	3 mod/fn/param
	2 mod/../param
	1 mod
	*/

	if (modUrl.length < 3) {
		modUrl.splice(1, 0, 'index');
	}

	let modArr = modUrl.splice(-3),
		modName = modArr[0] || ETC.defaultMod,
		modFun = modArr.length >= 2 ? modArr[1] : 'index',
		modParam = modArr.length >= 3 ? modArr[2] : null;

	if (modParam) {
		modParam = decodeURIComponent(modParam);
	}

	console.log(`hostname: ${hostname}`);

	let controllerPath = path.resolve(__dirname, PATH.apps, HOST[hostname], PATH.controller),
		modPath = path.resolve(controllerPath, modName + '.js');

	// notFoundFun
	let notFoundFun = modPath => {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		res.end('404 Not Found');
		console.error(`cannot found modPath: ${modPath}`);
	}

	if (!fs.existsSync(modPath)) {
		notFoundFun(modPath);
		return;
	}

	let Mod = require(modPath);

	// watchFile
	watchFile(modPath, () => {
		delete require.cache[modPath];
	});

	Object.assign(Mod.prototype, {
		hostname,
		req,
		res,
		getData,
		useModule,
		redirectTo,
		render,
		ajaxTo,
		utils
	});

	let mod = new Mod();

	let fn = mod[modFun];

	// UTILS(常用的工具函数集合)，代码和模板中都可以使用，例如：UTILS.md5(str)
	global.UTILS = mod.utils();

	let toExe = () => {
		if (fn && typeof fn === 'function') {
			try {
				fn.call(mod, modParam);
			} catch (err) {
				res.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				res.end(`Oops! some errors has happend!`);
				console.error(err);
			}
		} else {
			notFoundFun(fn);
		}
	}

	// post
	if ('POST' === req.method) {
		// let str = '';
		let arr = [];
		req.on('data', chunk => {
				// str += chunk;
				// if (data.length > 1e6) {
				// 	req.connection.destroy();
				// }

				arr.push(chunk);
			})
			.on('end', () => {
				// str = querystring.parse(str);
				// req.__post = str;

				let postData = querystring.parse(Buffer.concat(arr).toString());
				req.__post = postData;
				console.log(`POST query: `, req.__post);

				toExe();
			})
	} else {
		console.log(`GET query: `, req.__get);

		toExe();
	}
}
module.exports = route;