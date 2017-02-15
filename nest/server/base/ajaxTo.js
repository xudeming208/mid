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
		console.log(`can't find ${args} in ${JSON.stringify(php)}`);
		res.writeHead(404, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store',
			'Server': ETC.server
		})
		res.end(`can't find ${args} in ${JSON.stringify(php)}`);
		return;
	}

	// 特殊的protocol和特殊的port 可以通过control设置
	// 如果control中有设置字段，以这个为准
	phpObj[args] = {
		'protocol': php[args]['protocol'] || 'http',
		'port': php[args]['port'] || 80,
		'path': php[args]['path'] || php[args],
		'method': php[args]['method'] || req.method || 'get'
	};
	if (req.method == 'GET') {
		phpObj[args]['data'] = php[args]['data'] || req.__get;
	} else {
		phpObj[args]['data'] = php[args]['data'] || req.__post;
	}

	let cbk = data => {
		res.writeHead(200, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store',
			'Server': ETC.server
		})

		//for jsonp
		if (req.__get.callback) {
			res.end(req.__get.callback + '(' + data + ')');
			return;
		}
		res.end(JSON.stringify(data));
	}
	remoteApi(req, res, true, phpObj, cbk);
}


module.exports = ajaxTo;