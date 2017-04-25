const http = require('http'),
	querystring = require('querystring'),
	cookie = require('./cookie.js');
let apiData = {};
module.exports = remoteApi = (req, res, isAjax, php, cbk) => {
	let phpLen = Object.keys(php).length;
	for (let phpKey in php) {
		let remoteObj = php[phpKey];
		if (TOOLS.isString(remoteObj)) {
			remoteObj = {
				'path': remoteObj
			}
		}
		let protocol = remoteObj['protocol'] && (remoteObj['protocol'] + ':') || 'http:',
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
			console.log(`"${hostSource}": is not configed in config.json -> api`);
			phpLen--;
			apiData[phpKey] = false;
			hasFinished(phpLen, phpKey, isAjax, cbk);
			continue;
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
		console.log('API request options:\n', options, '\n');

		let httpRequest = http.request(options, response => {
			phpLen--;
			request_timer && clearTimeout(request_timer);
			request_timer = null;

			let res_state = response.statusCode;
			if (200 != res_state && 400 != res_state && 4000 > res_state) {
				console.log('error', 'api', path, 'STATUS: ', res_state);
				apiData[phpKey] = false;
				hasFinished(phpLen, phpKey, isAjax, cbk);
				return;
			}
			let result = '',
				buff = [];
			response.on('data', chunk => {
				buff.push(chunk);
			}).on('end', () => {
				result = Buffer.concat(buff);
				if (400 == res_state) {
					console.log('error', 'api', path, '400: ', result);
					apiData[phpKey] = false;
					hasFinished(phpLen, phpKey, isAjax, cbk);
					return;
				}
				if ('""' == result) {
					result = false;
				}
				if (ETC.debug) {
					let result_orgin = result;
					try {
						result = result ? (JSON.parse(result) || result) : false;
					} catch (err) {
						console.log('error', 'api', path, 'API ERROR:', result_orgin);
					}
				} else {
					try {
						result = result ? (JSON.parse(result) || result) : false;
					} catch (err) {
						console.log('error', 'api', path, 'API ERROR:', result);
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
				['set-cookie'].forEach((proxyKey) => {
					if (proxyKey in response.headers) {
						let pdVal = response.headers[proxyKey];
						if (!pdVal) {
							return
						}
						if ('set-cookie' == proxyKey) {
							let cookieSet = cookie.getHandler(req, res);
							pdVal.forEach((val) => {
								cookieSet.set(val);
							})
						} else
							res.setHeader(proxyKey, pdVal);
					}
				})

				apiData[phpKey] = result;
				hasFinished(phpLen, phpKey, isAjax, cbk);
				return;
			});
		}).on('error', e => {
			console.log('error', 'api', path, e.message);
			phpLen--;
			apiData[phpKey] = false;
			hasFinished(phpLen, phpKey, isAjax, cbk);
		});
		request_timer = setTimeout(() => {
			request_timer = null
			httpRequest.abort();
			console.log('error', 'api', path, 'Request Timeout');
			phpLen--;
			apiData[phpKey] = false;
			hasFinished(phpLen, phpKey, isAjax, cbk);
			return;
		}, ETC.apiTimeOut);

		// 写入数据到请求主体 post
		httpRequest.write(remoteData);
		httpRequest.end();

	}
}

let hasFinished = (phpLen, phpKey, isAjax, cbk) => {
	//确保数据都返回完再callback
	if (phpLen == 0) {
		if (isAjax) {
			cbk(apiData[phpKey]);
		} else {
			let siteOrgin = JSON.stringify(SITE);
			cbk(Object.assign(SITE, apiData));
			//Object.assign改变SITE后，还原SIZE
			SITE = JSON.parse(siteOrgin);
		}
	}
}