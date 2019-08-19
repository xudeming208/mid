// 本地日志功能
// 要输出日志，用户只需调用console.error方法即可。此方法已经通过下面重写了：

// const log = require('./base/log');
// console.meerror = console.error;
// global.console.error = (...arg) => {
//   // 输出本来的error
//   console.meerror.call(global, arg);
//   // 写进本地日志文件
//   log(arg);
// }

// mid本地日志在哪？
// 通过查看本地日志，可以了解mid的错误信息等：
// windows:
// 1. 打开C盘，然后进入Users(用户)文件夹
// 2. 进入登录用户的文件夹，比如xudeming
// 3. 找到.midLog.txt
// mac:
// 1. 右键点击Finder(访达)，点击“前往文件夹”
// 2. 输入框中输入/，点击前往按钮即可打开根目录
// 3. 点击用户文件夹，然后点击登录用户的文件夹，比如xudeming
// 4. 如果没有显示隐藏文件夹，可以按下快捷键`command + shift + .`显示隐藏文件
// 5. 找到.midLog.txt
// linux:
// 1. 执行命令`cd ~`
// 2. 找到.midLog.txt

const fs = require('fs');
const os = require('os');
const platform = os.platform();
const dir = os.homedir() + '/.midLog.txt';
const config = require('../../package.json');

const logger = fs.createWriteStream(dir, {
	// 'flags: a' means appending (old data will be preserved)
	flags: 'a'
});


let loggerObj = {};
let hasWriteCommonMsg = false;

function writeCommonMsg() {
	// 输出通用信息
	let myos = 'null';
	switch (platform) {
		case 'win32':
			myos = 'Windows';
			break;
		case 'darwin':
			myos = 'Mac';
			break;
		case 'linux':
			myos = 'Linux';
			break;
		default:
			myos = 'unknow';
	};
	loggerObj.os = myos;
	loggerObj['mid-version'] = config.version;

	logger.write('\n通用信息：\n');
	logger.write(JSON.stringify(loggerObj, null, '\t'));

	hasWriteCommonMsg = true;
}

// 通用信息只写一遍，自定义消息一直append
if (!hasWriteCommonMsg) {
	// 退出重启mid时，清空原来的log
	fs.createWriteStream(dir).write('');

	writeCommonMsg();
}

// 输出用户自定义的信息
// export function log(msg) {
function log(msg) {
	logger.write(`\n\n\n错误详情：\n`);

	// 输出日期
	logger.write(`时间：${new Date().toLocaleString()}\n`);

	msg = `\tmsg：${msg} \n\tJSON.stringify：${JSON.stringify(msg)}\n\tmsg.toString：${msg.toString()}`;

	logger.write(`信息：\n${msg}`);
}


global.console.myerror = global.console.error;
global.console.error = (...arg) => {
  // 输出本来的error
  console.myerror.apply(global, arg);
  // 写进本地日志文件
  log(arg);
}