module.exports = remoteApi = (php, cbk) => {
	let testData = {
		"site": SITE,
		"test": 'hello',
		"arr": [{
			"title": 'title',
			"content": 'content'
		}, {
			"title": 'title2',
			"content": 'content2'
		}, {
			"title": 'title3',
			"content": 'content3'
		}]
	}
	//模拟接口延迟
	setTimeout(function() {
		cbk(testData)
	}, 1e3)
}