/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/test/test2/test2.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/server/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=getHtml('test/test.html',_data);
html+=`<div>i am test2</div>`
return html;}
exports._getHtml = _getHtml
