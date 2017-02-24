# mid
	用nodejs开发的一套基于URI的MVC框架，适用于前后端分离项目。

##技术选型
	- 采用nodejs + MVC + 模块加载器 + less

##框架介绍及使用方法
	- 详细查看DOC.md


##Usage
1. sudo npm install -g pm2
2. ~~cd nest~~
3. ~~npm install~~
4. ~~npm run start~~
	* ~~npm run stop~~
	* ~~npm run restart~~
	* ~~npm run logs~~
5. ~~In the browser input **127.0.0.1:8083** or **yourIp:8083**, and then can see the pages~~
    * ~~`The default is open the PC pages, if you want to open the H5 pages, configure config`~~
6. node setup

##Nginx
* 绑定host `host` => sudo vi /etc/hosts，如下：

```
127.0.0.1 h5.fedevot.test.com pc.fedevot.test.com
```
* 安装 `nginx` 然后配置如下：

```
server {
    listen 80;
    server_name *.fedevot.test.com;
    location / {
        proxy_pass http://127.0.0.1:8083;
    }
}
```

**ps:**
	当然你也可以以80端口启动node服务，然后用sudo启动，但是不推荐这样。

#配置文件相关说明

##defaultPage：
	- 表示用真实IP地址（不是127.0.0.1或者localhost）访问的页面（PC or H5）

##defaultMod：
	- 表示默认查找controller的JS文件

##server：
	- 表示的是response headers中的server字段

##apiTimeOut：
	- 表示的访问接口的超时时间

##merge（未完成）：
	- 表示是否合并CSS和JS；生产环境需将merge设为true

##debug(js压缩还未完成)：
	- 此字段为true时：HTML、CSS和JS不压缩，静态资源不缓存（包括内存的缓存及浏览器的缓存）；生产环境需将debug设为false

##FAQ
* 查看DOC.md
* Contact me: `xudeming208@126.com`
