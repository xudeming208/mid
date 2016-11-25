/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/index.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/server/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=getHtml('head.html',_data);
html+=``
let site = _data.site || {};let staticPath = _data.site.staticPath;
html+=`<div class="test">`
html+= _data.test 
html+=` world</div><img src="`
html+= staticPath 
html+=`/img/index.png" alt=""><img src="//www.baidu.com/img/bd_logo1.png" alt=""><ul>`
 _data.arr.forEach(function(item){ 
html+=`<li><h3>`
html+= item.title 
html+=`</h3><p>`
html+= item.content 
html+=`</p></li>`
 }) 
html+=`</ul><script src="`
html+= staticPath 
html+=`/js/page/index.js`
html+= site.version 
html+=`"></script>`
html+=getHtml('foot.html',_data);
html+=``
return html;}
exports._getHtml = _getHtml
