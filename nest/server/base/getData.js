const remoteApi = require('./remoteApi');

async function getData(php) {
	const loadModel = UTILS.loadModel('./loadModel');
	let self = this,
		req = self.req,
		res = self.res;
	// console.dir(php)

	if (!UTILS.isObject(php)) {
		res.writeHead(503, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		})
		res.end('oops! some errors has happend!');
		console.error(`php is required and must be Object!`);
		return await {};
	}

	loadModel(php);
	// console.dir(php)

	if (UTILS.isEmpey(php)) {
		return await SITE;
	}

	return await remoteApi(req, res, php).catch(err => {
		console.error(err);
	});

}

module.exports = getData;