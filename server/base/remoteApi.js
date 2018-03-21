const http = require('http'),
	querystring = require('querystring'),
	cookie = require('./cookie.js'),
	Agent = require('agentkeepalive');

// const agent = new http.Agent({
// 	maxSockets: 10
// });

// 对同一个服务器端发起的http请求默认最大连接数为5（超过5个的请求将进入连接池排队），这里修改默认值为ETC.maxSockets；如果设置为false，则代表不受限制
// Agent对象的sockets和requests属性性分别表示当前连接池中使用中的连接数和处于等待状态的请求数，在业务中监视这两个值有助于发现业务状态的繁忙程程 。
const agent = ETC.maxSockets ? new Agent({
	maxSockets: ETC.maxSockets
}) : false;

const apiData = {};

//remoteSingle
const remoteSingle = (req, res, phpKey, remoteObj) => {
	return new Promise((resolve, reject) => {
		if (UTILS.isString(remoteObj)) {
			remoteObj = {
				'path': remoteObj
			}
		}
		let protocol = (remoteObj['protocol'] || 'http') + ':',
			path = remoteObj['path'] || '',
			method = remoteObj['method'] && remoteObj['method'].toUpperCase() || 'GET',
			port = remoteObj['port'] || 80,
			remoteData = querystring.stringify(remoteObj['data'] || {}),
			hostSource = 'web',
			reqHeaders = {};

		if (~path.indexOf('::')) {
			path = path.split('::');
			hostSource = path[0];
			path = path[1];
		}
		let host = API[hostSource];

		//config.json api中找不到host的时候
		if (!host) {
			console.error(`"${hostSource}": is not configed in config.json -> api`);
			resolve(false);
		}
		reqHeaders.reqHost = req.headers.host;
		reqHeaders.requrl = req.url;
		reqHeaders.targetEnd = hostSource;

		// 将请求头中的字段传递到后端接口
		let proxyDomain = ['clientIp', 'referer', 'cookie', 'user-agent'];
		proxyDomain.forEach((item) => {
			if (req.headers.hasOwnProperty(item)) {
				reqHeaders[item] = req.headers[item];
			}
		});

		if (method === 'GET') {
			if (remoteData) {
				path = path.trim();
				path += (~path.indexOf('?') ? '&' : '?') + remoteData;
			}
			remoteData = '';
		} else {
			reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		reqHeaders['Content-Length'] = Buffer.byteLength(remoteData, 'utf8');

		let startTime = Date.now(),
			request_timer,
			options = {
				protocol: protocol,
				method: method,
				host: host,
				port: port,
				path: path,
				// timeout: ETC.apiTimeOut,
				headers: reqHeaders,
				agent: agent
			};
		console.log(`\n'${phpKey}' API request options:\n `, options, `\n`);

		let httpRequest = http.request(options, response => {
			// 后面的Buffer.concat(buff)参数必须是Array, Buffer, or Uint8Array，所以这里不能设置utf-8
			// response.setEncoding('utf8');

			request_timer && clearTimeout(request_timer);
			request_timer = null;

			let res_state = response.statusCode;
			if (200 !== res_state && 400 !== res_state && 4000 > res_state) {
				console.error('error', 'api', path, 'STATUS: ', res_state);
				resolve(false);
				return;
			}
			let result = '',
				buff = [];
			response.on('data', chunk => {
				buff.push(chunk);
			}).on('end', () => {
				result = Buffer.concat(buff);
				if (400 === res_state) {
					console.error('error', 'api', path, '400: ', result);
					resolve(false);
					return;
				}
				if ('""' === result) {
					result = false;
				}
				if (ETC.debug) {
					let result_orgin = result;
					try {
						result = result ? (JSON.parse(result) || result) : false;
					} catch (err) {
						console.error('error', 'api', path, 'API ERROR:', result_orgin);
					}
				} else {
					try {
						result = result ? (JSON.parse(result) || result) : false;
					} catch (err) {
						console.error('error', 'api', path, 'API ERROR:', result);
						result = false;
					}
				}

				// API request time
				let runlong = Date.now() - startTime;
				console.log(`INFO: "${host}${path}" request time is ${runlong}ms`);

				if (runlong > 500) {
					console.log(`WARNING: "${host}${path}" request time is ${runlong}ms > 500ms`);
				}

				// test demo
				// response.headers['set-cookie'] = ['a=1;path=/', 'b=2', 'c=3'];

				// 暂时只考虑将后端接口响应头中的cookie传递至前端
				['set-cookie'].forEach(proxyKey => {
					if (proxyKey in response.headers) {
						let pdVal = response.headers[proxyKey];
						if (!pdVal) {
							return;
						}

						// if ('set-cookie' == proxyKey) {

							// 通过cookie.js中的res.setHeader('set-cookie', req.__addCookie)将后端的cookie传至浏览器中
							// let cookieSet = cookie.getHandler(req, res);
							// pdVal.forEach((val) => {
							// 	cookieSet.set(val);
							// })

							// 不通过cookie.js传递cookie，通过res直接传递，这样不只是node调用接口能传递cookie，ajaxTo也可以传递
							res.setHeader('set-cookie', pdVal);

						// 暂时只考虑传递cookie
						// } else {
						// 	res.setHeader(proxyKey, pdVal)
						// }
					}
				})

				resolve(result);
				return;
			});
		}).on('error', e => {
			console.error('error', 'api', path, e.message);
			resolve(false);
		});
		request_timer = setTimeout(() => {
			request_timer = null;
			httpRequest.abort();
			console.error('error', 'api', path, 'Request Timeout');
			resolve(false);
			return;
		}, ETC.apiTimeOut);

		// 写入数据到请求主体 post
		httpRequest.write(remoteData);
		httpRequest.end();
	}).then(data => {
		apiData[phpKey] = data;
	}).catch(err => {
		console.error(err);
	});
}

module.exports = (req, res, php) => {
	let promiseArr = [];
	for (let phpKey in php) {
		let remoteObj = php[phpKey];
		promiseArr.push(remoteSingle(req, res, phpKey, remoteObj));
	}
	return Promise.all(promiseArr).then(() => {
		return Object.assign({}, SITE, apiData);
	});
}