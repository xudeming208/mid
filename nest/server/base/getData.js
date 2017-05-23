const remoteApi = require('./remoteApi');

function getData(php) {
	const loadModel = UTILS.loadModel('./loadModel');
	let self = this,
		req = self.req,
		res = self.res;
	// console.dir(php)
	loadModel(php);
	// console.dir(php)
	return new Promise((resolve, reject) => {
		if (UTILS.isEmpey(php)) {
			resolve(SITE);
		} else {
			remoteApi(req, res, php).then(data => {
				resolve(Object.assign({}, SITE, data));
			}).catch(err => {
				console.log(err);
			});
		}
	}).catch(err => {
		console.log(err);
	});
}

module.exports = getData;