/* /Users/inke/Documents/xdm/tirger/apps/pc/mvc/view/index.html */
let getHtml = require('/Users/inke/Documents/xdm/tirger/server/server/base/render.js').getHtml;
let _getHtml = _data => {
let html='';
html+=getHtml('head.html',_data);
html+=`
`

	var testData = {
		's':'pc'
	}

html+=`
<div class="test">`
html+= _data.test 
html+=` world</div>
<div>`
html+= testData.s 
html+=`</div>
<img src="`
html+= _data.staticHost + _data.pcPath 
html+=`/img/index.png" alt="">
<img src="`
html+= _data.staticHost + _data.pcPath 
html+=`/img/test/test.jpg" alt="">
`
html+=getHtml('test/test.html',_data);
html+=`
<img src="//www.baidu.com/img/bd_logo1.png" alt="">
`
html+=getHtml('test/test2/test2.html',_data);
html+=`
<video id="bgvideo" width="100%" height="100%" controls src="http://app.inke.com/inke/v/video.mp4" loop="" >您的浏览器不支持video标签，建议更新浏览器版本</video>
<ul>
	`
 _data.arr.forEach(function(item){ 
html+=`
		<li>
			<h3>`
html+= item.title 
html+=`</h3>
			<p>`
html+= item.content 
html+=`</p>
		</li>
	`
 }) 
html+=`
</ul>
<script src="`
html+= _data.staticHost + _data.pcPath 
html+=`/js/page/index.js?v=`
html+= _data.version 
html+=`"></script>
<script src="`
html+= _data.staticHost + _data.pcPath 
html+=`/js/page/test/test.js?v=`
html+= _data.version 
html+=`"></script>
`
html+=getHtml('foot.html',_data);
html+=``
return html;}
exports._getHtml = _getHtml
