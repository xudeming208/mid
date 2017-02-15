fml.define("page/index", [], function(require, exports) {
	console.log(9999)
	$('#get').on('click', function() {
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
				alert(JSON.stringify(data));
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