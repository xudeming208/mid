/* /Users/inke/Documents/xdm/tirger/apps/h5/mvc/view/index.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/nest/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=getHtml('head.html',_data);
html+=``
var testData = {'s':'h5'}
html+=`<div class="test">`
html+= _data.test 
html+=`</div><div>`
html+= testData.s 
html+=`</div><img src="`
html+= _data.staticHost + _data.h5Path 
html+=`/img/index.png" alt=""><img src="//www.baidu.com/img/bd_logo1.png" alt=""><ul>`
 _data.arr.forEach(function(item){ 
html+=`<li><h3>`
html+= item.title 
html+=`</h3><p>`
html+= item.content 
html+=`</p></li>`
 }) 
html+=`</ul><script src="`
html+= _data.staticHost + _data.h5Path 
html+=`/js/page/index.js?v=`
html+= _data.version 
html+=`"></script>`
html+=getHtml('foot.html',_data);
html+=``
return html;}
exports._getHtml = _getHtml
