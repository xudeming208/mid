const controllerObj = {
	index: function() {
		let php = {

		};
		this.getData(php, data => {
			data.pageTitle = 'index';
			data._CSSLinks = ['page/index', 'page/index2'];
			this.render('index.html', data);
		})
	}
}


exports.controllerObj = controllerObj;