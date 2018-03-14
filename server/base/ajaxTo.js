/*
 * ajax桥
 * 隐藏接口真实路径，解决跨域
 */

const remoteApi = require('./remoteApi');

function ajaxTo(php, args) {
	let self = this,
		req = self.req,
		res = self.res,
		phpObj = {};

	if (!php[args]) {
		res.writeHead(404, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store',
			'Server': ETC.server
		})
		console.error(`can't find ${args} in ${JSON.stringify(php)}`);
		res.end(`can't find ${args} in ${JSON.stringify(php)}`);
		return;
	}

	// 特殊的protocol和特殊的port 可以通过controller设置
	// 如果control中有设置字段，以control中的设置为准
	phpObj[args] = {
		'protocol': php[args]['protocol'] || 'http',
		'port': php[args]['port'] || 80,
		'path': php[args]['path'] || php[args],
		'method': php[args]['method'] || req.method || 'get'
	};
	if (req.method === 'GET') {
		phpObj[args]['data'] = php[args]['data'] || req.__get;
	} else {
		phpObj[args]['data'] = php[args]['data'] || req.__post;
	}

	remoteApi(req, res, phpObj).then(data => {
		data = data[args];

		// set-cookie在remoteApi.js中设置

		let headObj = {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store',
			'Content-length': Buffer.byteLength(JSON.stringify(data), 'utf-8'),
			// 'Access-Control-Allow-Origin': '*',
			'Server': ETC.server
		}

		//for jsonp
		if (req.__get.callback) {
			let jsonpData = req.__get.callback + '(' + JSON.stringify(data) + ')';
			headObj['Content-length'] = Buffer.byteLength(jsonpData, 'utf-8');

			res.writeHead(200, headObj);
			res.end(jsonpData);
			return;
		}
		res.writeHead(200, headObj);
		res.end(JSON.stringify(data));
	})
}


module.exports = ajaxTo;