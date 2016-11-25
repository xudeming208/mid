const fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec;

// execFun
const execFun = (todo, msg, displayProgress, cbk) => {
	!Array.isArray(todo) && (todo = [todo]);
	let t = '';
	let isFirst = true;
	let progressFun = () => {
		process.stdout.write(`'${msg}'\n wait.`);
		t = setInterval(function() {
			process.stdout.write('.');
		}, 500);
	}
	if (displayProgress) {
		progressFun();
	} else {
		process.stdin.setEncoding('utf8');
		process.stdin.on('readable', () => {
			let chunk = process.stdin.read();
			if (chunk !== null) {
				chunk = chunk.slice(0, -2);
				if (isFirst) {
					process.stdout.write(`请再次敲回车确认密码\n`);
				}
				isFirst = false;
			}
			if (chunk === '') {
				process.stdin.emit('end');
				return
			}
		});

		process.stdin.on('end', () => {
			console.log(922)
			progressFun();
		});
	}
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
const installPm2 = () => {
	execFun('sudo npm install -g pm2', 'install pm2', false, installPackage);
}

// install package
const installPackage = () => {
	execFun(['cd tirger/server', 'rm -rf node_modules', 'rm -rf tmp', 'npm install'], 'install package', true, config);
}

// config
const config = () => {
	let filePath = path.resolve(__dirname, './tirger/server/config');
	let fileName = path.resolve(filePath, './config.json');
	let content = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
	let serverPort = Math.random() * 1000 | 0 + 6000;
	let jserverPort = serverPort + 1;
	let ip = require(filePath + '/getIp.js')();
	let staticPath = `http://${ip}:${jserverPort}`;
	content.etc.serverPort = serverPort;
	content.etc.jserverPort = jserverPort;
	content.site.staticPath = staticPath;
	fs.writeFile(fileName, JSON.stringify(content), 'utf-8', (err) => {
		if (err) {
			console.log(err);
		}
		// exec framework
		// let npmPath = path.resolve(__dirname, './tirger/server');
		// require(npmPath + '/node_modules/colors/safe.js');
		execFun(['cd tirger/server', 'npm run start'], 'framework start', true, function() {
			console.log(`In the browser input **127.0.0.1:${serverPort}** or **${ip}:${serverPort}**, and then can see the pages`)
		});
	})
}


execFun('git clone https://github.com/xudeming208/tirger.git', 'git clone', true, installPm2);