'use strict'
// const fs = require('fs');
// let isWindows = process.platform === 'win32',
//     interval = 100,
//     persistent = true;
// let watchFile = (filePath,noChange, onChg) => {
//     if (isWindows) {
//         fs.watch(filePath, {
//             persistent: persistent,
//             interval: interval
//         }, function(prev,now){
//         	if (prev.mtime == now.mtime  ){
//         		return noChange()
//         	}
//         	onChg();
//         });
//     } else {
//         fs.watchFile(filePath, {
//             persistent: persistent,
//             interval: interval
//         }, function(prev,now){
//         	if (prev.mtime == now.mtime  ){
//         		return noChange()
//         	}
//         	onChg();
//         });
//     }
// }



// https://github.com/paulmillr/chokidar
// const chokidar = require('chokidar');
// const watchFile = (filePath, onChg) => {
//     let watcher = chokidar.watch(filePath, {
//         persistent: true,
//         interval: 100
//     });
//     watcher.on('change', onChg);
// }



// var watch = require('watch')
// const watchFile = (filePath, onChg) => {
// 	watch.createMonitor(filePath, {interval:10},function(monitor) {
// 		monitor.on("changed", function(f, curr, prev) {
// 			onChg()
// 		})
// 	})
// }

module.exports = watchFile;