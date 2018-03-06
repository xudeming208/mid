# 框架介绍及使用方法

## 目录
	- apps：项目代码目录，分：H5和PC
	- server：框架nodeJS代码目录
	- logs：日志目录
	- tmp：临时缓存文件目录
	- app.js：动态文件服务器
	- jserver.js：静态文件服务器
	- router.js：框架的路由处理
	- render.js：模板引擎
	- config.json：框架的配置文件

```javascript
mid
|——apps							#项目代码目录
|	|——h5						#h5项目
|	|	|——mvc
|	|	|	|——controller			#controller
|	|	|	|——model			#model
|	|	|	|——view				#模板
|	|	|	|	|——widget		#组件目录
|	|	|——static				#静态文件目录，生成环境CDN or Nginx
|	|	|	|——img 				#image
|	|	|	|——js
|	|	|	|	|——component		#插件JS
|	|	|	|	|——page			#页面的JS
|	|	|	|	|——widget		#组件的JS
|	|	|	|	|——zepto.js
|	|	|	|——less
|	|	|	|	|——component		#插件less
|	|	|	|	|——page			#页面less
|	|	|	|	|——widget		#组件less
|	|	|	|	|——atom.less
|	|	|	|	|——base.less
|	|	|	|	|——font.less
|	|	|	|	|——reset.less
|	|——pc						#pc项目
|	|	|——mvc
|	|	|	|——controller
|	|	|	|——model
|	|	|	|——view
|	|	|	|	|——widget
|	|	|——static
|	|	|	|——img
|	|	|	|——js
|	|	|	|	|——component
|	|	|	|	|——page
|	|	|	|	|——widget
|	|	|	|	|——jquery.js
|	|	|	|——less
|	|	|	|	|——component
|	|	|	|	|——page
|	|	|	|	|——widget
|	|	|	|	|——atom.less
|	|	|	|	|——base.less
|	|	|	|	|——font.less
|	|	|	|	|——reset.less
|	|——favicon.ico 				
|	|——fml.js 					#模块加载器
|——server						#框架代码目录
|	|——base 					#基础模块代码		
|	|	|——ajaxTo.js				#ajax逻辑
|	|	|——cookie.js 		
|	|	|——redirectTo.js			#重定向
|	|	|——render.js				#渲染
|	|	|——watchFile.js				#监听文件变化
|	|	|——...
|	|——config					#配置目录
|	|	|——config.js				#全局变量
|	|	|——config.json				#框架的配置文件
|	|	|——README.md				#配置介绍
|	|——jserver					#静态文件服务器目录
|	|	|——jserver.js				#静态服务器
|	|	|——commonJS.js				#commonJS规范
|	|	|——mime.js 				#Content-Type
|	|——app.js					#入口
|	|——router.js					#路由处理
|——node_modules	
|——logs							#日志目录
|——tmp							#模板引擎缓存文件目录
|——.gitignore					
|——DOC.md 						#框架使用文档
|——package.json
|——pm2.json						#pm2配置
|——README.md						#框架介绍文档	
|——TEST.md						#测试文档	
|——TODO.md						#待完成的功能		
|——MVC.gif						#MVC示意图		
|——MID.png						#MID流程图				
```

## 模板语法
* 后端渲染语法：
	- `<% JS 语法 %>`
	- `<%* 注释，此内容不会被render %>`
	- `<%= 将值写入HTML %>`
	- `<%== 将值转码后写入HTML，主要为了避免XSS攻击 %>`
	- `<%# 导入模板 %>`
* ajax前端渲染语法：
	- `<? JS 语法 ?>`
	- `<?= 将值写入HTML ?>`

## 查看页面渲染数据
	- 在URI后面添加参数server=json即可

## 用法
	可以参考：
		- apps/h5/mvc/controller/index.js
		- apps/h5/mvc/view/index.html
		- apps/h5/static/js/page/index.js
		- apps/h5/static/less/page/index.less

* 编写controller，如在`apps/h5/mvc/controller`目录新建`test.js`，写入：

```javascript
'use strict'

class Test {
	index(arg) {
		Reflect.has(this, arg) ? this[arg]() : this['main']();
	}

	main(arg) {
		let php = {};
		this.getData(php).then(data => {
			data.pageTitle = 'test';
			data._CSSLinks = ['page/test'];
			data.banner = [{
				'href': '#',
				'src': 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2706547558,1569356033&fm=23&gp=0.jpg'
			}, {
				'href': '#',
				'src': 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1935176083,1386170183&fm=23&gp=0.jpg'
			}, {
				'href': '#',
				'src': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1487604818024&di=c54fcd1107050912969a2ddc60a73c0c&imgtype=0&src=http%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz%2FwgYCDpsjxWebKs1iaJrO2tH6Cd7fiaia26BuX1bTzkh6IxJRzBw6hUQ03pxZwjU8AFNJKPsYXDnFGRLYRFYzT7tLQ%2F0'
			}]
			this.render('test.html', data);
		})
	}
}

module.exports = Test;
```

* 编写view，如在`apps/h5/mvc/view`目录新建`test.html`，写入：

```javascript
<%#head.html%>
<p>this is a test page</p>
<p>当前浏览器是：<%= JSON.stringify(UTILS.os.browser) %></p>
<%= requireWidget('widget/banner.html',{
	'model' : this,
	'data':this.banner,
	'class':'widget-banner-test',
	'config':{
		"autoTime":1800
	}
});%>
<% this.useModule( [ 'page/test' ] ) %>
<%#foot.html%>
```

* 编写less，如在`apps/h5/static/less/page`目录新建`test.less`，写入：

```javascript
/*页面都必须引入atom.less，其他的引入根据需求*/
@import "../atom.less";
@import "../widget/banner.less";
body{
	padding:.5rem;
	.f(.5rem);
}
p{
	.l(3)
}

/*以下为覆盖widget的默认样式*/
.widget-banner-test{
	.h(2rem)
}
```

* 编写js，如在`apps/h5/static/js/page`目录新建`test.js`，写入：

```javascript
fml.define("page/test", [], function(require, exports) {
	console.log('test');
});
```


## 启动框架
	1. sudo npm install -g pm2
	2. cd mid
	3. npm install
	4. npm start
	  - npm run log   // 查看日志
	  - npm run debug  // debug模式
	5. 打开浏览器，输入：`127.0.0.1:8083/test`
>如果遇见不能启动，试着kill pm2试下 => sudo pkill -9 pm2


