# Config

* defaultMod：
	- 表示默认查找controller的JS文件
* server：
	- 表示的是response headers中的server字段
* apiTimeOut：
	- 表示访问接口的超时时间
* merge（未完成）：
	- 表示是否合并CSS和JS；
* debug：
	- 此字段为true时：HTML、CSS和JS不压缩，静态资源不缓存;
* 生产环境：
	- 生产环境下，应先将less编译、JS压缩传至cdn or Nginx，如果更改HTML的引入路径即可；这时不需要此静态文件服务器了