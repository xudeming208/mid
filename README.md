# mid
nodejs mvc framework

##start framework
1. sudo npm install -g pm2
2. cd nest
3. npm install
4. npm run start
5. In the browser input **127.0.0.1:8083** or **yourIp:8083**, and then can see the pages
    * `The default is open the PC pages, if you want to open the H5 pages, configure config`

***
**ps:**
You can also clone setup.js and then `node setup`

##Nginx
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

**ps:**
`You can also start the port 80 (sudo start), but is not recommended`

##problem
* Contact me: `xudeming208@126.com`
