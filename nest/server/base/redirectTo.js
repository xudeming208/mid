function redirectTo(url, proxyArgs) {
	let args = '';
	if (proxyArgs) {
		args = this.req.__get;
	}
	if (args) {
		args = require('querystring').stringify(args);
		if (args) {
			url += (url.indexOf('?') > 0 ? '&' : '?') + args
		}
	}
	try {
		this.res.writeHead(301, {
			'Location': url,
			'Cache-Control': 'no-cache,must-revalidate,no-store',
			'Pragma': 'no-cache'
		});
		this.res.write('');
		this.res.end();
	} catch (err) {
		console.log('write res error', err, new Date, '')
	}

	return false

}

module.exports = redirectTo;