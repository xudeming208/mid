/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/foot.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/server/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=`<script type="text/javascript" src="`
html+= _data.staticHost + _data.pcPath 
html+=`/js/jquery.js?v=`
html+= _data.version 
html+=`"></script></body></html>`
return html;}
exports._getHtml = _getHtml
