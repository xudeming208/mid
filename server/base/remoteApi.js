const http = require('http'),
	querystring = require('querystring'),
	cookie = require('./cookie.js');
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
		let proxyDomain = ['XREF', 'seashell', 'clientIp', 'referer', 'cookie', 'user-agent', 'async'];
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
		// reqHeaders['Content-Type'] = 'text/html; charset=utf-8';

		reqHeaders['Content-Length'] = Buffer.byteLength(remoteData, 'utf8');

		// console.log('reqHeaders:', reqHeaders);

		let startTime = Date.now(),
			request_timer,
			options = {
				protocol: protocol,
				host: host,
				port: port,
				headers: reqHeaders,
				path: path,
				// agent: false,
				method: method,
			};
		console.log(`\n'${phpKey}' API request options:\n `, options, `\n`);

		let httpRequest = http.request(options, response => {
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

				// setCookie
				// ['set-cookie'].forEach(proxyKey => {
				// 	if (proxyKey in response.headers) {
				// 		let pdVal = response.headers[proxyKey];
				// 		if (!pdVal) {
				// 			return
				// 		}
				// 		if ('set-cookie' == proxyKey) {
				// 			let cookieSet = cookie.getHandler(req, res);
				// 			pdVal.forEach((val) => {
				// 				cookieSet.set(val);
				// 			})
				// 		} else {
				// 			res.setHeader(proxyKey, pdVal);
				// 		}
				// 	}
				// })

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

module.exports = remoteApi = (req, res, php) => {
	let promiseArr = [];
	for (let phpKey in php) {
		let remoteObj = php[phpKey];
		promiseArr.push(remoteSingle(req, res, phpKey, remoteObj));
	}
	return Promise.all(promiseArr).then(() => {
		return Object.assign({}, SITE, apiData);
	});
}