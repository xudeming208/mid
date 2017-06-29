'use strict'

class index {
	index(arg) {
		Reflect.has(this, arg) ? this[arg]() : this['main']();
	}

	main(arg) {
		let php = {};
		// if (arg == 'test') {
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
		this.getData(php).then(data => {
			data.pageTitle = 'index';
			data._CSSLinks = ['page/index'];
			data.banner = [{
				'href': '#',
				'src': 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2706547558,1569356033&fm=23&gp=0.jpg'
			}, {
				'href': '#',
				'src': 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1935176083,1386170183&fm=23&gp=0.jpg'
			}, {
				'href': '#',
				'src': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1487604818024&di=c54fcd1107050912969a2ddc60a73c0c&imgtype=0&src=http%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz%2FwgYCDpsjxWebKs1iaJrO2tH6Cd7fiaia26BuX1bTzkh6IxJRzBw6hUQ03pxZwjU8AFNJKPsYXDnFGRLYRFYzT7tLQ%2F0'
			}]
			this.render('index.html', data);
		})
	}

	xss() {
		let php = {

		};
		//只要是获取URL中的参数都要防止XSS
		let xss = this.req.__get.xss;
		this.getData(php).then(data => {
			//http://${data.ip}:${data.port}/index/xss/?xss=%27;alert(%27xss%27);%27
			data.pageTitle = 'xss';
			data.xss = xss;
			this.render('xss.html', data);
		})
	}

	redirect() {
		let php = {

		};
		this.getData(php).then(data => {
			this.redirectTo('http://www.baidu.com', true);
		})
	}

	aj(args) {
		let php = {
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
		this.ajaxTo(php, args);
	}
}

module.exports = index;