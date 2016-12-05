/* /Users/inke/Documents/xdm/tirger/apps/h5/mvc/view/head.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/nest/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>`
html+= _data.pageTitle 
html+=`</title><meta name="description" content="`
html+= _data.pageDescription 
html+=`" /><meta name="keywords" content="`
html+= _data.pageKeywords 
html+=`" /><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black"/><meta content="telephone=no" name="format-detection"/><link rel="dns-prefetch" href="//img.inke.cn/">`
html+=(function(css){var cssStr ='',base = _data.staticHost + _data.h5Path;css.forEach(function(src){cssStr+='<link rel="stylesheet" href="'+base+'/css/page/'+src+'.css?v='+_data.version+'">'});return cssStr; })(_data._CSSLinks)
html+=`<script>(function(doc, win) {    var docEl = doc.documentElement,        resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';    function getClientWidth() {        var cw = docEl.clientWidth;        (cw > 750) && (cw = 750);        docEl.style.fontSize = cw / 7.5 + 'px';    }    if (!docEl.addEventListener) return;    win.addEventListener(resizeEvent, getClientWidth, false);    doc.addEventListener('DOMContentLoaded', getClientWidth, false);})(document, window);</script><script type="text/javascript" src="`
html+= _data.staticHost + _data.h5Path 
html+=`/js/fml.js?v=`
html+= _data.version 
html+=`"></script></head><body>`
return html;}
exports._getHtml = _getHtml
