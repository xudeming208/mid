fml.define("widget/banner", ['component/touchSlide'], function(require, exports) {
	fml.vars.widgetBanner.length && fml.vars.widgetBanner.forEach(function(item, index) {
		item.config.beforeCallback = item.beforeCallback;
		item.config.finishCallback = item.finishCallback;
		$('#' + item.id).touchSlide(item.config);
	})

})