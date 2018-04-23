fml.define("page/index", ['component/shareTmp', 'widget/dialog', 'component/utils'], function(require, exports) {

	var shareTmp = require('component/shareTmp'),
		dialog = require('widget/dialog'),
		utils = require('component/utils');

	console.log('md5:', utils.md5('test'))

	console.log('os:', utils.os)

	console.log('browser:', utils.os.browser)

	console.log('queryString:test=', utils.getQueryString('test'))

	// confirm
	$('#btnDialog').on('click', function() {
		dialog({
			'title': '我是一个弹层',
			'cancel': '取消',
			'confirm': '确定',
			'type': 'confirm',
			// 可以通过传入class覆盖默认弹层样式，此class会添加到弹层顶层div中
			'class': 'my-dialog-Class',
			'oncancel': function() {
				$('#widgetDialog').remove();
			},
			'onconfirm': function() {
				alert('你点击了确认按钮');
			}
		});
	});

	// alert
	$('#btnDialog2').on('click', function() {
		dialog({
			'onconfirm': function() {
				$('#widgetDialog').remove();
			}
		});
	})


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
				alert(error)
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
				alert(error)
			}
		});
	})

	$('#jsonp').on('click', function() {
		// jQuery或者zepto会把post改为get，并会把jsonp callback中的数据匹配出来传给success
		$.ajax({
			type: 'post',
			dataType: 'jsonp',
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
				alert(error)
			}
		});
	})

});