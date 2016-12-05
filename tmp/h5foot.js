/* /Users/inke/Documents/xdm/tirger/apps/h5/mvc/view/foot.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/nest/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=`<script type="text/javascript" src="`
html+= _data.staticHost + _data.h5Path 
html+=`/js/zepto.js?v=`
html+= _data.version 
html+=`"></script></body></html>`
return html;}
exports._getHtml = _getHtml
