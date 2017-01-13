/* D:\xx\mid\apps\pc\mvc\view\test\test2\test2.html */
let getHtml = require('D:/xx/mid/nest/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=getHtml('test/test.html',_data);
html+=`<div>i am test2</div>`
return html;}
exports._getHtml = _getHtml
