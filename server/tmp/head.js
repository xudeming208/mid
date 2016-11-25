/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/head.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/server/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
let site = _data.site || {};let staticPath = _data.site.staticPath;
html+=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>`
html+= _data.pageTitle || site.pageTitle 
html+=`</title><meta name="description" content="`
html+= _data.pageDescription || site.pageDescription 
html+=`" /><meta name="keywords" content="`
html+= _data.pageKeywords || site.pageKeywords 
html+=`" />`
html+=(function(css){let cssStr ='',base = staticPath;css.forEach(function(src){cssStr += '<link rel="stylesheet" href="'+base+'/css/page/'+src+'.css?v='+site.version+'">'});return cssStr; })(_data._CSSLinks)
html+=`</head><body>`
return html;}
exports._getHtml = _getHtml
