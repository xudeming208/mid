var getHtml=require('/Users/inke/Documents/tirger/server/server/base/render.js').getHtml;
function _getHtml(obj,_data){
let html='';
var site = _data.site || {};var staticPath = _data.site.staticPath;
html+='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>'
html+= _data.pageTitle || site.pageTitle 
html+='</title><meta name="description" content="'
html+= _data.pageDescription || site.pageDescription 
html+='" /><meta name="keywords" content="'
html+= _data.pageKeywords || site.pageKeywords 
html+='" />'
html+=(function(css){var cssStr='',base =staticPath;css.forEach(function(src){cssStr+='<link rel="stylesheet" href="'+base+'/css/page/'+src+'.css">'});return cssStr; })(_data._CSSLinks)
html+='</head><body>'
return html;}
exports._getHtml=_getHtml
