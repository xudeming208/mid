// getIp
let getIp = () => {
	let ifaces = require('os').networkInterfaces();
	let ret = [];
	for (let dev in ifaces) {
		ifaces[dev].forEach(details => {
			if (details.family == 'IPv4' && !details.internal) {
				ret.push(details.address)
			}
		})
	}
	return ret.length ? ret[0] : '127.0.0.1'
};
module.exports = getIp;