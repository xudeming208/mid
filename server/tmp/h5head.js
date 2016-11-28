/* /Users/inke/Documents/xdm/tirger/apps/h5/mvc/view/head.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/server/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
var site = _data.site || {};var staticPath = _data.site.staticPath;
html+=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>`
html+= _data.pageTitle || site.pageTitle 
html+=`</title><meta name="description" content="`
html+= _data.pageDescription || site.pageDescription 
html+=`" /><meta name="keywords" content="`
html+= _data.pageKeywords || site.pageKeywords 
html+=`" /><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">`
html+=(function(css){var cssStr='',base =staticPath;css.forEach(function(src){cssStr+='<link rel="stylesheet" href="'+base+'/css/page/'+src+'.css?v='+site.version+'">'});return cssStr; })(_data._CSSLinks)
html+=`<script>(function(doc, win) {    var docEl = doc.documentElement,        resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';    function getClientWidth() {        var cw = docEl.clientWidth;        (cw > 750) && (cw = 750);        docEl.style.fontSize = cw / 7.5 + 'px';    }    if (!docEl.addEventListener) return;    win.addEventListener(resizeEvent, getClientWidth, false);    doc.addEventListener('DOMContentLoaded', getClientWidth, false);})(document, window);</script></head><body>`
return html;}
exports._getHtml = _getHtml
