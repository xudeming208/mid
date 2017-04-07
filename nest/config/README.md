# 配置文件相关说明

## defaultPage：
	- 表示用真实IP地址（不是127.0.0.1或者localhost）访问的页面（PC or H5）,默认为H5

## defaultMod：
	- 表示默认查找controller的JS文件

## server：
	- 表示的是response headers中的server字段

## apiTimeOut：
	- 表示访问接口的超时时间

## merge（未完成）：
	- 表示是否合并CSS和JS；生产环境需将merge设为true

## debug：
	- 此字段为true时：HTML、CSS和JS不压缩，静态资源不缓存（包括内存的缓存及浏览器的缓存）；生产环境需将debug设为false
	- 生产环境注意处理favicon.ico