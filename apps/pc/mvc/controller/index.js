const controlObj = {
	index: function(arg) {
		arg in this ? this[arg]() : this["main"]();
	},
	main: function(arg) {
		let tools = BASE.loadModel('./tools');
		let php = {};
		// if (arg == 1) {
			php = {
				'busi': {
					'protocol': 'http',
					'path': '/mobile/mobile_share_api',
					'method': 'post',
					'port': 80,
					'data': {
						'liveid': '1481105372291334',
						'uid': '5778280'
					}
				},
				'list': 'inke::/web/live_hotlist_pc'
			};
		// }
		this.getData(php, data => {
			data.browers = tools.getBrowser(this.req);
			data.pageTitle = 'index';
			data._CSSLinks = ['page/index', 'page/index2'];
			this.render('index.html', data);
		})
	},
	test: function() {
		let php = {

		};
		this.getData(php, data => {
			data.pageTitle = 'test';
			this.render('test.html', data);
		})
	}
}


exports.controlObj = controlObj;