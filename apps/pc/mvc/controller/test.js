const controllerObj = {
	index: function(args) {
		args = (args in controllerObj) ? args : 'main'
		this[args]()
	},
	main: function() {
		let php = {

		};
		this.getData(php, data => {
			data.pageTitle = 'index';
			data._CSSLinks = ['index'];
			this.render('test.html', data);
		})
	},
	test2: function() {
		let php = {

		};
		this.getData(php, data => {
			data.pageTitle = 'index';
			data._CSSLinks = ['index'];
			this.render('test2.html', data);
		})
	}
}


exports.controllerObj = controllerObj;