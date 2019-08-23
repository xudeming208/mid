const remoteApi = require('./remoteApi');
const watchFile = require("./watchFile");

async function getData(php) {
	const modelPath = UTILS.getModelPath('./loadModel');
	const loadModel = require(modelPath);

	// watchFile
	watchFile(modelPath, () => {
		delete require.cache[modelPath];
	});

	let self = this,
		req = self.req,
		res = self.res;
	// console.dir(php)

	if (!UTILS.isObject(php)) {
		res.writeHead(503, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache,no-store'
		})
		res.end('Oops! some errors has happend!');

		console.error(JSON.stringify({
			trace: console.trace(),
			error: 'php is required and must be an Object!'
		}));
		
		return await {};
	}

	// 将model中的php assign
	loadModel(php);
	// console.dir(php)

	if (UTILS.isEmpey(php)) {
		return await SITE;
	}

	// return await remoteApi(req, res, php).catch(err => {
	// 	console.error(err);
	// });

	try {
		return await remoteApi(req, res, php);
	} catch (error) {
		console.error(JSON.stringify({
			trace: console.trace(),
			error: error.toString()
		}));
	}

}

module.exports = getData;