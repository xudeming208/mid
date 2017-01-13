const controllerObj = {
	index: function() {
		let php = {
			
		};
		this.getData(php, data => {
			data.pageTitle = 'index';
			data._CSSLinks = ['page/index'];
			this.render('index.html', data);
		})
	}
}


exports.controllerObj = controllerObj;