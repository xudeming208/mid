fml.define("page/index", [], function(require, exports) {
	console.log(9999)
	$('#link').on('click',function(){
		window.location.href='http://pc.fedevot.test.com:8083/'
	})
});