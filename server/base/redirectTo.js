function redirectTo(url, proxyArgs) {
	let args = '';
	if (proxyArgs) {
		args = this.req.__get;
	}
	if (args) {
		args = require('querystring').stringify(args);
		if (args) {
			url += (~url.indexOf('?') ? '&' : '?') + args
		}
	}
	try {
		this.res.writeHead(301, {
			'Location': url,
			'Cache-Control': 'no-cache,must-revalidate,no-store',
			'Pragma': 'no-cache'
		});
		this.res.end('');
	} catch (err) {
		console.error('write res error', err, new Date, '')
	}

	return false

}

module.exports = redirectTo;