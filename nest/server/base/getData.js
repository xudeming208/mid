const remoteApi = require('./remoteApi');

function getData(php, cbk) {
	const loadModel = UTILS.loadModel('./loadModel');
	let self = this,
		req = self.req,
		res = self.res;
	// console.dir(php)
	loadModel(php);
	// console.dir(php)
	if (UTILS.isEmpey(php)) {
		return cbk(SITE);
	}
	remoteApi(req, res, false, php, cbk);
}


module.exports = getData;