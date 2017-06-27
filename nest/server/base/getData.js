const remoteApi = require('./remoteApi');

async function getData(php) {
	const loadModel = UTILS.loadModel('./loadModel');
	let self = this,
		req = self.req,
		res = self.res;
	// console.dir(php)
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