let isWindows = process.platform === 'win32';
let open = require("open");
let openBrower = url => {
	if (isWindows) {
		start(url);
	} else {
		open(url);
	}
}

module.exports = openBrower;