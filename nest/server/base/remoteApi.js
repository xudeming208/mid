const http = require('http'),
	querystring = require('querystring');
let apiData = {};
module.exports = remoteApi = (self, req, res, php, cbk) => {
	let phpLen = Object.keys(php).length;
	for (let phpKey in php) {
		let remoteUri = php[phpKey],
			hostSource,
			reqHeaders = {},
			defaultApiHost = 'busi';

		if (remoteUri.indexOf('::') > 0) {
			remoteUri = remoteUri.split('::');
			hostSource = remoteUri[0];
			remoteUri = remoteUri[1];
		}
		let host = API[hostSource];
		if (!host) {
			console.log(`${remoteUri} is not configed`);
			host = defaultApiHost;
		}
		let proxyHeaders = {};
		reqHeaders.reqHost = req.headers.host;
		reqHeaders.requrl = req.url;
		reqHeaders.targetEnd = hostSource;
		reqHeaders['Content-Length'] = Buffer.byteLength(querystring.stringify(self.req.__get), 'utf8');
		let proxyDomain = ['XREF', 'seashell', 'clientIp', 'referer', 'cookie', 'user-agent'];
		for (let i = 0, j = proxyDomain.length; i < j; i++) {
			if (req.headers.hasOwnProperty(proxyDomain[i])) {
				proxyHeaders[proxyDomain[i]] = req.headers[proxyDomain[i]]
			}
		}
		let options = {
			host: host,
			port: 80,
			headers: proxyHeaders,
			path: remoteUri,
			agent: false,
			method: 'GET',
		};
		// console.log(options);
		let request_timer;
		let request = http.request(options, response => {
			phpLen--;
			request_timer && clearTimeout(request_timer);
			request_timer = null;

			let res_state = response.statusCode;
			if (200 != res_state && 400 != res_state && 4000 > res_state) {
				console.log('error', 'api', remoteUri, 'STATUS: ', res_state)
				apiData[phpKey] = false;
				hasFinished(phpLen, cbk);
				return;
			}
			let result = '';
			let buff = []
			response.on('data', chunk => {
				buff.push(chunk)
			}).on('end', () => {
				result = Buffer.concat(buff);
				if (400 == res_state) {
					console.log('error', 'api', remoteUri, '400: ', result)
					apiData[phpKey] = false;
					hasFinished(phpLen, cbk);
					return;
				}

				if ('""' == result) result = false
				try {
					let result_orgin = result;
					result = result ? (JSON.parse(result) || result) : false
				} catch (err) {
					console.log('error', 'api', remoteUri, 'API ERROR:', result_orgin)
				}
				apiData[phpKey] = result;
				hasFinished(phpLen, cbk);
				return;
			});
		});
		request.on('error', e => {
			console.log('error', 'api', remoteUri, e.message);
			phpLen--;
			apiData[phpKey] = false;
			hasFinished(phpLen, cbk);
		});
		request_timer = setTimeout(() => {
			request_timer = null
			request.abort();
			console.log('error', 'api', remoteUri, 'Request Timeout');
			phpLen--;
			apiData[phpKey] = false;
			hasFinished(phpLen, cbk);
			return;
		}, ETC.apiTimeOut);


		// request.write(self.req.__get);
		request.end();

	}
}

let hasFinished = (phpLen, cbk) => {
	//确保数据都返回完再callback
	if (phpLen == 0) {
		cbk(Object.assign(SITE, apiData));
	}
}