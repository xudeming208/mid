/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/head.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/nest/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>`
html+= _data.pageTitle 
html+=`</title><meta name="description" content="`
html+= _data.pageDescription 
html+=`" /><meta name="keywords" content="`
html+= _data.pageKeywords 
html+=`" />`
html+=(function(link ,cssmods){let cssStr ='',version = _data.version,base = _data.staticHost + _data.pcPath + '/css/';if(link.length){link.map(src => {cssStr += '<link rel="stylesheet" href="' + base + src +'.css?' + version + '">'});return cssStr;}if(cssmods.length){cssmods = '~' + cssmods.join('+');cssStr += '<link rel="stylesheet" href="' + base + cssmods + '?' + version + '">';}return cssStr; })(_data._CSSLinks ,_data._CSSmods)
html+=``
 if(_data._CSSstack.length){ 
html+=`<style>`
html+= _data._CSSstack.join("\n"); 
html+=`</style>`
 } 
html+=`<script type="text/javascript" src="`
html+= _data.staticHost + _data.pcPath 
html+=`/js/fml.js?v=`
html+= _data.version 
html+=`"></script><script>fml.setOptions({'sversion' : '`
html+= _data.version 
html+=`','defer' : `
html+= _data.JS_Defer 
html+=`,'modulebase' : '`
html+= _data.staticHost + _data.pcPath 
html+=`' + '/js/'});</script></head><body>`
return html;}
exports._getHtml = _getHtml
