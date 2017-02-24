fml.define("widget/banner", ['component/touchSlide'], function(require, exports) {
	fml.vars.banner.length && fml.vars.banner.forEach(function(item, index) {
		$('#' + item.id).touchSlide(item.config);
	})
})