const controlObj = {
	index: function(arg) {
		arg in this ? this[arg]() : this["main"]();
	},
	main: function(arg) {
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
			data.pageTitle = 'index';
			//实际情况不推荐CSS数组写法，而可以利用less的@import
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
	},
	test2: function() {
		let php = {

		};
		this.getData(php, data => {
			this.redirectTo('http://www.baidu.com', true);
		})
	},
	aj: function(args) {
		let php = {
			'busi': '/mobile/mobile_share_api',
			'list': 'inke::/web/live_hotlist_pc'
		};
		this.ajaxTo(php, args);
	}
}


exports.controlObj = controlObj;