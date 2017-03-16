# TODO
	- 待完成的功能


## 工程化问题
	- CSS的合并（不合并base.css）
	- 是否将公共的JS部分单独引入方便缓存（类似于base.css），比如backTop,popup等，而不只是jQuery
	- JS的合并

## 定义fml.vars的script是否合并，并且放到body后面


## 线上环境，静态资源都传至CDN or 采用Nginx做静态文件服务器


## 根据UA重定向至手机页面或者PC页面

## session


## 版本号（或者MD5）的的解决方案，根据文件内容生成hash（保留8位或者6位长度的hash）；不再暴力的上一次线，静态资源所有的版本号都改变？？？
TOOLS.md5()，文件内容不变，hash也不会变的

```
<%
	let baseCssUrl=this.staticHost + this.pcPath %>/css/base.css;
%>
<link rel="stylesheet" type="text/css" href="<%=baseCssUrl%><%=TOOLS.md5()%>">
```


## commonJS.js，模块化的问题


## eslint


## 错误分析和报警


## 性能分析


## 部署问题