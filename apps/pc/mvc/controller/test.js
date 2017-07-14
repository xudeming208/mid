'use strict'

class Test {
	index(arg) {
		Reflect.has(this, arg) ? this[arg]() : this['main']();
	}

	main(arg) {
		let php = {};
		this.getData(php).then(data => {
			data.pageTitle = 'test';
			data._CSSLinks = ['page/test'];
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
			this.render('test.html', data);
		})
	}
}

module.exports = Test;