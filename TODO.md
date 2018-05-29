# TODO
	- 待完成的功能


本地构建（合并压缩等,参考webpack），然后传至网上

## 增加apps文件夹中的代码监听（涉及到router.js监听controller和render监听模板HTML），文件变化重新编译，刷新浏览器即可看到变化

## 线上部署：
	1. 将h5/static/中的JS通过babel转义及压缩 至 h5/src/js
	2. 将less转换成CSS至h5/src/css
	3. 更改配置，指向src目录
	4. 所有的资源上传至cdn，src目录作为回源目录
	5. 通过Nginx反向代理，静态文件服务器


利用webpack/gulp工程化

线上环境参考：https://thinkjs.org/zh-cn/doc/2.2/deploy.html


## 生产环境重启时
	- 最简单的办法可以通过 pm2 restart pm2.json 重启服务，但这种方式会导致服务临时性的中断（重启服务需要时间，重启过程中会导致无法处理用户的请求从而导致服务中断）。如果不想服务中断，那么可以通过发送信号的方式来重启方式，具体命令为：
	`pm2 sendSignal SIGUSR2 pm2.json`
	通过发送 SIGUSR2 信号，pm2 会将这个信号派发给框架，框架主进程捕获到这个信号后，会 fork 一个新的子进程提供服务，然后逐渐将之前的子进程重启，从而达到不中断服务重启的目的。


## 工程化问题
	- 每个页面有俩个CSS，一个base.css，一个页面自身的
	- 将公共的JS部分单独引入方便缓存（类似于base.css），比如backTop,dialog等，而不只是jQuery
	- JS的合并

## 将body标签中的script JS合并并放到body后面




## build.js
	- 压缩HTML、CSS和JS，合并CSS和JS，模拟生产环境
	- npm run build

	- 将配置文件的merge设置为true，debug设置为false

	- 将压缩合并好的CSS和JS保存到某个文件夹，方便传至CDN

## dev.js
	- 不压缩HTML、CSS和JS，不合并CSS和JS，模拟开发环境
	- npm run dev

	- 将配置文件的merge设置为false，debug设置为true


## 根据UA重定向至手机页面或者PC页面

## session


## 版本号（或者MD5）的的解决方案，根据文件内容生成hash（保留8位或者6位长度的hash）；不再暴力的上一次线，静态资源所有的版本号都改变？？？
UTILS.md5()

```javascript
<%
	let baseCssUrl=this.staticHost + this.pcPath %>/css/base.css;
%>
<link rel="stylesheet" type="text/css" href="<%=baseCssUrl%><%=UTILS.md5()%>">
```


## commonJS.js，模块化的问题


## eslint

https://github.com/xudeming208/node-in-debugging
## 实时监控，错误分析和报警（keymetrics，OneAPM，听云，Easy-Monitor等）

## 性能分析工具node-clinic,speedscurve,https://www.cnblogs.com/hustskyking/p/how-to-build-a-https-server.html

## 压测 （压测工具有ab,webbench,siege，wrk等，http://www.tuicool.com/articles/riyMJnu）
loadtest  https://help.aliyun.com/document_detail/64011.html?spm=a2c4g.11186623.6.565.lIf4RW


## 部署问题