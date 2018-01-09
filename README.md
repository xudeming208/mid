# mid
	- 用nodejs开发的一套基于URI的 MVC 框架，适用于前后端分离项目。
	- 后端渲染；运用nodejs + es6(7) + component + less
	- 采用集群cluster模式（基于PM2）

# MVC示意图
![mvc示意图](https://github.com/xudeming208/mid/blob/master/mvc.gif?raw=true)

# mid流程图
![mid流程图](https://github.com/xudeming208/mid/blob/master/mid.png?raw=true)

# mid-cli
	- mid-cli是mid框架脚手架
	- 默认打开的是H5页, 如果想看PC页，请修改配置
1. sudo npm i -g pm2
2. sudo npm i -g mid-cli --verbose
3. mid-cli init
	- mid-cli -h
	- mid-cli -v

# Usage
详细查看[DOC.md](https://github.com/xudeming208/mid/blob/master/DOC.md)

# Nginx
虽然 Node.js 自身可以直接创建 HTTP(S) 服务，但生产环境不建议直接把 Node 服务可以对外直接访问，而是在前面用 WebServer（如：nginx） 来挡一层，这样有多个好处：

* 可以更好做负载均衡，比如：同一个项目，启动多个端口的服务，用 nginx 做负载
* 静态资源使用 nginx 直接提供服务性能更高（实际中用CDN更好）
* HTTPS(HTTP2) 服务用 nginx 提供性能更高
* Gzip压缩等（注意：图片不要Gzip，因为图片Gzip会变大）
* 反向代理端口与域名
* Nginx更好的日志记录分析
* Nginx缓存

#### 使用Nginx的大致配置：
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
    	proxy_set_header Host               $http_host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_pass http://127.0.0.1:8083;
    }
}
```

**ps:**
	当然你也可以以80端口启动node服务，然后用sudo启动(1024以下端口需要sudo)，但是不推荐这样。

# HTTPS
现代网站强制建议使用 HTTPS 访问，这样可以提供网站内容的安全性，避免内容被劫持、监听、篡改等问题。如果不愿意支付证书的费用，可以使用 Let's Encrypt 提供的免费 SSL/TLS 证书，可以参见文章 [Let's Encrypt](https://imququ.com/post/letsencrypt-certificate.html)，[免费好用的 HTTPS 证书](https://imququ.com/post/letsencrypt-certificate.html)。

# HTTP2
暂时不推荐使用于生产环境

# Config

* defaultPage：
	- 表示用真实IP地址（不是127.0.0.1或者localhost）访问的页面（PC or H5）,默认为H5
* defaultMod：
	- 表示默认查找controller的JS文件
* server：
	- 表示的是response headers中的server字段
* apiTimeOut：
	- 表示访问接口的超时时间
* merge（未完成）：
	- 表示是否合并CSS和JS；
* debug：
	- 此字段为true时：HTML、CSS和JS不压缩，静态资源不缓存（包括内存的缓存及浏览器的缓存）；
* 生产环境：
	- 生产环境下，应该是先merge和compress静态资源，然后传至CDN；

## FAQ
* 查看[DOC.md](https://github.com/xudeming208/mid/blob/master/DOC.md)
* Contact me: `xudeming208@126.com`
