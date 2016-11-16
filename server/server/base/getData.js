const path = require('path');
const remoteApi = require('./remoteApi.js');
module.exports = getData = function(php, cbk) {
	const loadModel = require(path.resolve(__dirname, '../../../apps/', HOST[this.hostname], PATH.model, './loadModel.js'));
	loadModel(php);
	cbk(remoteApi(php));
}