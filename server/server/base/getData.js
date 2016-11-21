const path = require('path');
const remoteApi = require('./remoteApi.js');

function getData(php, cbk) {
	const loadModel = require(path.resolve(__dirname, '../../../apps/', HOST[this.hostname], PATH.model, './loadModel.js'));
	// console.dir(php)
	loadModel(php);
	// console.dir(php)
	remoteApi(php, cbk);
}


module.exports = getData