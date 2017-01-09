'use strict'
const fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec;

//执行之前确保已经全局安装了pm2
// execFun
const execFun = (todo, msg, cbk) => {
	!Array.isArray(todo) && (todo = [todo]);
	let t = '';
	let progressFun = () => {
		process.stdout.write(`'${msg}'\n wait.`);
		t = setInterval(function() {
			process.stdout.write('.');
		}, 500);
	}
	progressFun();
	// if (displayProgress) {
	// 	progressFun();
	// } else {
	// 	process.stdin.setEncoding('utf8');
	// 	process.stdin.on('readable', () => {
	// 		let chunk = process.stdin.read();
	// 		if (chunk !== null) {
	// 			chunk = chunk.slice(0, -2);
	// 			if (isFirst) {
	// 				process.stdout.write(`请再次敲回车确认密码\n`);
	// 			}
	// 			isFirst = false;
	// 		}
	// 		if (chunk === '') {
	// 			process.stdin.emit('end');
	// 			return
	// 		}
	// 	});

	// 	process.stdin.on('end', () => {
	// 		progressFun();
	// 	});
	// }
	exec(todo.join(' && '), function(error, stdout, stderr) {
		if (error) {
			console.log(error)
		}
		t && clearInterval(t);
		console.log(`\n '${msg}' finised`);
		cbk && typeof cbk == 'function' && cbk();
	})
}

// install pm2
// const installPm2 = () => {
// 	execFun('sudo npm install -g pm2', 'install pm2', false, installPackage);
// }

// install package
const installPackage = () => {
	execFun(['cd tirger', 'rm -rf tmp', 'cd nest', 'rm -rf node_modules', 'npm install'], 'install package', config);
}

// config
const config = () => {
	let tirgerPath = path.resolve(__dirname, './tirger/nest');
	let fileName = path.resolve(tirgerPath, './config/config.json');
	let content = require(fileName);
	let serverPort = Math.random() * 1000 | 0 + 6000;
	let jserverPort = serverPort + 1;
	let ip = require(tirgerPath + '/server/base/getIp')();
	let staticHost = `http://${ip}:${jserverPort}`;
	content.etc.serverPort = serverPort;
	content.etc.jserverPort = jserverPort;
	content.site.staticHost = staticHost;
	fs.writeFile(fileName, JSON.stringify(content), 'utf-8', (err) => {
		if (err) {
			console.log(err);
		}
		// exec framework
		execFun(['cd tirger/nest', 'npm run start'], 'framework start', function() {
			console.log(`In the browser input **127.0.0.1:${serverPort}** or **${ip}:${serverPort}**, and then can see the pages`)
			let openBrower = require(tirgerPath + '/jserver/openBrower');
			openBrower(`http://${ip}:${serverPort}`);
		});
	})
}


execFun('git clone https://github.com/xudeming208/tirger.git', 'git clone', installPackage);
