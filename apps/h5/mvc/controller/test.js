'use strict'

class Test {
	index(arg) {
		Reflect.has(this, arg) ? this[arg]() : this['main']();
	}

	main(arg) {
		let php = {};
		this.getData(php).then(data => {
			data.pageTitle = '压力测试';
			data._CSSLinks = ['page/test'];
			data._CSSstack = ['body{background:#eee}','div{color:red}'];
			data._JSstack = ['console.log(\'test\')','console.log(\'test2\')'];
			this.render('test.html', data);
		})
	}
}

module.exports = Test;