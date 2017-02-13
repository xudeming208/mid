'use strict'
const path = require('path');
const cryto = require('crypto');

function base() {
	const self = this;
	let moduleObj = {
		loadModel: modName => {
			return require(path.resolve(__dirname, '../', PATH.apps, HOST[self.hostname], PATH.model, modName));
		},
		md5: str => {
			return str ? cryto.createHash('md5').update(str.toString()).digest('hex') : '';
		},
		isEmpey: obj => {
			let arr = Object.keys(obj);
			return arr.length ? false : true;
		},
		htmlEncode: str => {
			return str.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
		}
	}
	return moduleObj;
}

module.exports = base;