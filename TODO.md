# TODO
	- 待完成的功能


利用webpack工程化

线上环境参考：https://thinkjs.org/zh-cn/doc/2.2/deploy.html


## 工程化问题
	- 每个页面有俩个CSS，一个base.css，一个页面自身的
	- 将公共的JS部分单独引入方便缓存（类似于base.css），比如backTop,dialog等，而不只是jQuery
	- JS的合并

## 将body标签中的script JS合并并放到body后面


## 线上环境，静态资源都传至CDN or 采用Nginx做静态文件服务器
## 线上环境，更改config.json文件中的staticHost为CDN地址，开发环境和线上环境的config.json文件不一样
## build.js  &&  dev.js


## 根据UA重定向至手机页面或者PC页面

## session


## 版本号（或者MD5）的的解决方案，根据文件内容生成hash（保留8位或者6位长度的hash）；不再暴力的上一次线，静态资源所有的版本号都改变？？？
UTILS.md5()，文件内容不变，hash也不会变的

```javascript
<%
	let baseCssUrl=this.staticHost + this.pcPath %>/css/base.css;
%>
<link rel="stylesheet" type="text/css" href="<%=baseCssUrl%><%=UTILS.md5()%>">
```


## commonJS.js，模块化的问题


## eslint


## 实时监控，错误分析和报警（keymetrics，OneAPM，听云，Easy-Monitor等）


## 性能分析 （压测工具有ab,webbench,siege，wrk等，http://www.tuicool.com/articles/riyMJnu）


## 部署问题