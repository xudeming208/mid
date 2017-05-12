fml.define("page/index", ['component/shareTmp', 'component/utils'], function(require, exports) {

	var shareTmp = require('component/shareTmp'),
		utils = require('component/utils');

	console.log('md5:', utils.md5('asdasd'))

	console.log('os:', utils.os)

	console.log('browser:', utils.os.browser)

	console.log('queryString:test=', utils.getQueryString('test'))

	$('#get').on('click', function() {
		$('#ajaxContent').html('loading...').css('color', '#f00');
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: 'index/aj/list?c=4&d=5',
			data: {
				"a": 1,
				"b": 2
			},
			timeout: 5000,
			success: function(data) {
				var inkeData = data.data || {}
				var hotlists = inkeData.hotlists || []
				var tpl = shareTmp('pageTpl', {
					'hotlists': hotlists
				});
				$('#ajaxContent').html(tpl);

				// alert(JSON.stringify(data));
			},
			error: function(error) {
				alert('error')
			}
		});
	})

	$('#post').on('click', function() {
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: 'index/aj/busi',
			data: {
				'liveid': '1481105372291334',
				'uid': '5778280'
			},
			timeout: 5000,
			success: function(data) {
				alert(JSON.stringify(data));
			},
			error: function(error) {
				alert('error')
			}
		});
	})

});