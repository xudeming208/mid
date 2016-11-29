/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/head.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/server/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>`
html+= _data.pageTitle 
html+=`</title><meta name="description" content="`
html+= _data.pageDescription 
html+=`" /><meta name="keywords" content="`
html+= _data.pageKeywords 
html+=`" />`
html+=(function(css){let cssStr ='',base = _data.staticPath;css.forEach(function(src){cssStr += '<link rel="stylesheet" href="'+base+'/css/page/'+src+'.css?v='+_data.version+'">'});return cssStr; })(_data._CSSLinks)
html+=`<script type="text/javascript" src="`
html+= _data.staticPath 
html+=`/js/fml.js?v=`
html+= _data.version 
html+=`"></script></head><body>`
return html;}
exports._getHtml = _getHtml
