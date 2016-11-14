var getHtml=require('/Users/inke/Documents/tirger/server/server/base/render.js').getHtml;
function _getHtml(obj,_data){
let html='';
html+=getHtml(obj,'head.html',_data);
html+=''
var site = _data.site || {};var staticPath = _data.site.staticPath;
html+='<div class="test">'
html+= _data.test 
html+='</div><img src="'
html+= staticPath 
html+='/img/index.png" alt=""><img src="http://inke.com/images/logo_white.png" alt=""><script src="'
html+= staticPath 
html+='/js/page/index.js"></script>'
html+=getHtml(obj,'foot.html',_data);
html+=''
return html;}
exports._getHtml=_getHtml
