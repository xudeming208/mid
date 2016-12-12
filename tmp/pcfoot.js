/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/foot.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/nest/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+= (function(link , jsmods){let str = '';let version = _data.version;let base = _data.staticHost + _data.pcPath + '/js/';if (link.length) {!link.includes('jquery') && link.unshift('jquery');link.map(src => {str += '<script src="' + base + src + '.js?' + version + '"></script>';});return str;}if (jsmods.length) {!jsmods.includes('jquery') && jsmods.unshift('jquery');jsmods = '~' + jsmods.join('+');str += '<script  src="' + base + jsmods + '?' + version + '"></script>';}return str;})(_data._JSLinks ,_data._JSmods) 
html+=`<script>`
 if (_data._JSstack.length) { 
html+=``
html+= _data._JSstack.join(";\n"); 
html+=``
 }if (_data.JS_Defer) { 
html+=`    ;fml.iLoad();`
}
html+=`</script></body></html>`
return html;}
exports._getHtml = _getHtml
