const controlObj = {
	index: function(arg) {
		let php = {};
		if (this.req.__get.d == 1) {
			php.busi = 'busi::/mobile/mobile_share_api?liveid=1481105372291334&uid=5778280&openid=';
		}
		if (arg == 'd2') {
			php.busi2 = 'busi::/mobile/mobile_share_api?liveid=1481105372291334&uid=5778280&openid=';
		}
		this.getData(php, data => {
			data.pageTitle = 'test2';
			data._CSSLinks = ['page/index'];
			this.render('index.html', data);
		})
	}
}


exports.controlObj = controlObj;