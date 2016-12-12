const path = require('path');
const remoteApi = require('./remoteApi');

function getData(php, cbk) {
	const loadModel = require(path.resolve(__dirname, '../', PATH.apps, HOST[this.hostname], PATH.model, './loadModel'));
	let self = this,
		req = self.req,
		res = self.res;
	// console.dir(php)
	loadModel(php);
	// console.dir(php)
	remoteApi(self, req, res, php, cbk);
}


module.exports = getData