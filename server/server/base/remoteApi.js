module.exports = remoteApi = php => {
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

	return testData
}