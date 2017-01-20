const controllerObj = {
	index: function() {
		let php = {
			'busi': 'busi::/mobile/mobile_share_api?liveid=1481105372291334&uid=5778280&openid=',
			'busi2': 'busi::/mobile/mobile_share_api?liveid=1481105372291334&uid=5778280&openid='
		};
		this.getData(php, data => {
			data.pageTitle = 'index';
			data._CSSLinks = ['page/index', 'page/index2'];
			this.render('index.html', data);
		})
	}
}


exports.controllerObj = controllerObj;