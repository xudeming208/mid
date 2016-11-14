const controllerObj = {
	'index': function() {
		let php = {

		};
		this.getData(php, data => {
			data.pageTitle = 'index';
			data._CSSLinks = ['index'];
			this.render('index.html', data);
		})
	}
}


exports.controllerObj = controllerObj;