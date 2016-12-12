/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/index.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/nest/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=getHtml('head.html',_data);
html+=``
var testData = {'s':'pc'};var busi = _data.busi || {};var busiData = busi.data || {};var wx = busiData.wx || {};
html+=`<div>`
html+= testData.s 
html+=`</div><img src="`
html+= _data.staticHost + _data.pcPath 
html+=`/img/index.png" alt=""><img src="//www.baidu.com/img/bd_logo1.png" alt=""><ul>`
 for(var i in wx){ 
html+=`<p>`
html+= wx[i] 
html+=`</p>`
 } 
html+=`</ul>`
 _data.useModule( [ 'page/index' ] ) 
html+=``
 _data.useModule( [ 'page/test/test' ] ) 
html+=``
html+=getHtml('foot.html',_data);
html+=``
return html;}
exports._getHtml = _getHtml
