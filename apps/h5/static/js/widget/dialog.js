fml.define("widget/dialog", ['component/shareTmp'], function(require, exports) {
	var shareTmp = require('component/shareTmp');

	function Dialog(opts) {
		opts.title = opts.title || '我是一个弹层';
		opts.cancel = opts.cancel || '取消';
		opts.confirm = opts.confirm || '确认';
		opts.oncancel = opts.oncancel || function() {};
		opts.onconfirm = opts.onconfirm || function() {};
		// type为'alert' or 'confirm'，默认为'alert'
		opts.type = opts.type || 'alert';
		// 如果需要覆盖默认样式，可以传入class，此class会添加到弹层顶层div中
		opts.class = opts.class || '';
		this.init(opts);
	}
	Dialog.prototype = {
		constructor: Dialog,
		init: function(opts) {
			var body = $('body');

			if (!body.find('#widgetDialog').length) {
				var tpl = shareTmp('widgetDialogTpl', {
					'widgetDialogOpts': opts
				});
				body.append(tpl);
			}

			// confirm弹层
			if (opts.type == 'confirm') {
				$('#widgetDialogBtnCancel').off('click').on('click', function() {
					opts.oncancel();
				})
			}

			// alert弹层
			$('#widgetDialogBtnConfirm').off('click').on('click', function() {
				opts.onconfirm();
			})
		}
	}

	return function(opts) {
		return new Dialog(opts);
	};
})