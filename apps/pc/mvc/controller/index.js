const controllerObj = {
	index: function(arg) {
		arg in this ? this[arg]() : this["main"]();
	},
	main: function(arg) {
		let php = {};
		if (arg == 1) {
			php = {
				'busi': 'busi::/mobile/mobile_share_api?liveid=1481105372291334&uid=5778280&openid=',
				'busi2': 'busi::/mobile/mobile_share_api?liveid=1481105372291334&uid=5778280&openid='
			};
		}
		this.getData(php, data => {
			data.pageTitle = 'index2';
			data._CSSLinks = ['page/index', 'page/index2'];
			this.render('index.html', data);
		})
	},
	test: function() {
		let php = {

		};
		this.getData(php, data => {
			data.pageTitle = 'test33';
			data._CSSLinks = ['page/index'];
			this.render('index.html', data);
		})
	}
}


exports.controllerObj = controllerObj;