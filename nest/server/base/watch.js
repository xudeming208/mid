let fs = require('fs'),
    path = require("path"),
    isWindows = process.platform === 'win32',
    interval = 200;

let listenToChange = file => {
    file = path.resolve(file);

    let onChg = (prev, now) => {
        if (prev.mtime == now.mtime) {
            return;
        }
        delete require.cache[file];
    }

    if (isWindows)
        fs.watch(file, {
            persistent: true,
            interval: interval
        }, onChg);
    else
        fs.watchFile(file, {
            persistent: true,
            interval: interval
        }, onChg);
}

let mapDir = (dir, ext) => {
    fs.readdir(dir, (err, files) => {
        if (err || (ext && !files.indexOf(ext))) {
            return;
        }
        files.forEach(file => {
            file = dir + '/' + file;
            fs.lstat(file, (err, stats) => {
                if (err) {
                    console.dir(err);
                    return;
                }
                if (stats.isDirectory()) {
                    mapDir(file, ext);
                } else if (stats.isFile()) {
                    listenToChange(file);
                }
            });
        });
    });
}

/*
'somedir' | ['somedir' , 'another dir']
*/
exports.takeCare = (dir, ext) => {
    if ('string' == typeof dir) {
        dir = [dir];
    }
    dir.forEach(dirItem => {
        mapDir(dirItem, ext);
    })
}