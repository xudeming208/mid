'use strict'
// const fs = require('fs');
// let isWindows = process.platform === 'win32',
// 	interval = 100,
// 	persistent = true;
// let watchFile = (filePath, onChg) => {
// 	if (isWindows) {
// 		fs.watch(filePath, {
// 			persistent: persistent,
// 			interval: interval
// 		}, function(prev, now) {
// 			if (prev.mtime != now.mtime) {
// 				onChg();
// 			}
// 		});
// 	} else {
// 		// fs.unwatchFile(filePath)
// 		fs.watchFile(filePath, {
// 			persistent: persistent,
// 			interval: interval
// 		}, function(prev, now) {
// 			if (prev.mtime != now.mtime) {
// 				onChg();
// 			}
// 		});
// 	}
// }


// 监听apps文件夹中文件的change，其文件更改刷新浏览器即可更新；server文件夹中的文件change需要重启服务（npm run restart）更新
// controller由router.js监听；view模板由render.js监听；model由getData.js监听；静态资源有jserver.js实时返回，无需监听；
const chokidar = require('chokidar');
const watchFile = (filePath, onChg) => {
	chokidar.watch(filePath, {
		// persistent: false
		// alwaysStat:true
		// followSymlinks: false
		// awaitWriteFinish: true
	}).on('change', () => {
		// watchFile现在还有点问题：改变文件一次，按道理只执行一次，但是现在是刷新页面几次，就执行几次
		// console.error('test')
		onChg();
	})
}


module.exports = watchFile;