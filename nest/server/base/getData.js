const path = require('path');
const remoteApi = require('./remoteApi');

function isEmpey(obj) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
}

function getData(php, cbk) {
	const loadModel = require(path.resolve(__dirname, '../', PATH.apps, HOST[this.hostname], PATH.model, './loadModel'));
	let self = this,
		req = self.req,
		res = self.res;
	// console.dir(php)
	loadModel(php);
	// console.dir(php)
	if (isEmpey(php)) {
		return cbk(SITE);
	}
	remoteApi(self, req, res, php, cbk);
}


module.exports = getData;