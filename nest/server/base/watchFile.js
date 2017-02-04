'use strict'
const fs = require('fs');
let isWindows = process.platform === 'win32',
    interval = 20,
    persistent = true;
let watchFile = (filePath, onChg) => {
    if (isWindows) {
        fs.watch(filePath, {
            persistent: persistent,
            interval: interval
        }, onChg);
    } else {
        fs.watchFile(filePath, {
            persistent: persistent,
            interval: interval
        }, onChg);
    }
}
module.exports = watchFile;