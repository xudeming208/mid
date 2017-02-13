const path = require('path');
const remoteApi = require('./remoteApi');

function getData(php, cbk) {
	const loadModel = BASE.loadModel('./loadModel');
	let self = this,
		req = self.req,
		res = self.res;
	// console.dir(php)
	loadModel(php);
	// console.dir(php)
	if (BASE.isEmpey(php)) {
		return cbk(SITE);
	}
	remoteApi(req, res, php, cbk);
}


module.exports = getData;