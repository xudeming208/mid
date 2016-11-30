const path = require('path');
const remoteApi = require('./remoteApi');

function getData(php, cbk) {
	const loadModel = require(path.resolve(__dirname, '../', PATH.apps, HOST[this.hostname], PATH.model, './loadModel'));
	// console.dir(php)
	loadModel(php);
	// console.dir(php)
	remoteApi(php, cbk);
}


module.exports = getData