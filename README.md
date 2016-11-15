# tirger
nodejs mvc frame

##start frame
1. npm install -g pm2
2. cd server
3. npm install 
3. npm run start
4. In the browser input 127.0.0.1:8083 or yourIp:8083, and then can see the pages（The default is open the PC pages, if you want to open the H5 pages, configure config）

##How to use the domain name?
* bind `host` => sudo vi /etc/hosts，like this：

```
127.0.0.1 h5.fedevot.test.com pc.fedevot.test.com
```
* install `nginx` and config，like this：

```
server {
    listen 80;
    server_name *.fedevot.test.com;
    location / {
        proxy_pass http://127.0.0.1:8083;
    }
}
```

##problem
* If start frame failed, please try "pm2 delete all", then "npm run start"
* Contact me: xudeming208@126.com
