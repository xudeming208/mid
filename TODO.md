#TODO
	- 待完成的功能

##ajax请求功能已经完成，还需要完成ajax模板渲染

##weiget

```
weiget
├─banner
│  ├─tpl
│  ├─css
│  └─js
├─banner2
│  ├─tpl
│  ├─css
│  └─js
```

```
<%= requireFn('block/banner.html')({
	'data' : [],
	'config':{},
	'hide_btn':false,
	'_JSstack' : this._JSstack ,'_JSmods' :  this._JSmods
});%>
```

##工程化问题
	- JS的合并压缩
	- CSS的合并


##session


##版本号（或者MD5）的的解决方案


##commonJS，模块化的问题


##eslint


##错误分析和报警


##性能分析


##部署问题