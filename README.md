# mid
	- 用nodejs开发的一套基于URI的MVC框架，适用于前后端分离项目。
	- 采用nodejs + es6 + MVC + 模块加载器 + 组件 + less

## 框架介绍及使用方法
详细查看[DOC.md](https://github.com/xudeming208/mid/blob/master/DOC.md)


## Usage
1. sudo npm install -g pm2
2. ~~cd nest~~
3. ~~npm install~~
4. ~~npm start~~
	* ~~npm run stop~~
	* ~~npm run restart~~
	* ~~npm run log~~
	* ~~npm run debug~~
5. ~~在浏览器中输入**127.0.0.1:8083** 或者 **yourIp:8083**, 然后就能看见页面了~~
    * ~~`默认打开的是H5页, 如果想看PC页，请修改配置`~~
6. node setup

## Nginx
* 绑定host `host` => sudo vi /etc/hosts，如下：

```javascript
127.0.0.1 h5.fedevot.test.com pc.fedevot.test.com
```
* 安装 `nginx` 然后配置如下：

```javascript
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

## 配置文件相关说明

### defaultPage：
	- 表示用真实IP地址（不是127.0.0.1或者localhost）访问的页面（PC or H5）,默认为H5

### defaultMod：
	- 表示默认查找controller的JS文件

### server：
	- 表示的是response headers中的server字段

### apiTimeOut：
	- 表示访问接口的超时时间

### merge（未完成）：
	- 表示是否合并CSS和JS；

### debug：
	- 此字段为true时：HTML、CSS和JS不压缩，静态资源不缓存（包括内存的缓存及浏览器的缓存）；

### 生产环境：
	- 生产环境下，应该是先merge和compress静态资源，然后传至CDN；
	- 生产环境下，运行npm run build；
	- 开发环境下，运行npm run dev；

## FAQ
* 查看[DOC.md](https://github.com/xudeming208/mid/blob/master/DOC.md)
* Contact me: `xudeming208@126.com`
