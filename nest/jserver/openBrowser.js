// const IS_WIN = process.platform.indexOf('win') === 0;
// const child_process = require('child_process');

// function openBrower(path, callback) {
// 	let cmd = '"' + path + '"';
// 	if (IS_WIN) {
// 		cmd = 'start "" ' + cmd;
// 	} else {
// 		if (process.env['XDG_SESSION_COOKIE'] ||
// 			process.env['XDG_CONFIG_DIRS'] ||
// 			process.env['XDG_CURRENT_DESKTOP']) {
// 			cmd = 'xdg-open ' + cmd;
// 		} else if (process.env['GNOME_DESKTOP_SESSION_ID']) {
// 			cmd = 'gnome-open ' + cmd;
// 		} else {
// 			cmd = 'open ' + cmd;
// 		}
// 	}
// 	child_process.exec(cmd, callback);
// };
// openBrower('http://www.baidu.com', function() {})


let open = require("open");

module.exports = url => {
	open(url);
}