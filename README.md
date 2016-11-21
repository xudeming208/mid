# tirger
nodejs mvc framework

##start frame
1. npm install -g pm2 (If you don't have to install installation, please)
2. cd server
3. npm install (If you find this file have a `node_modules` in a directory, please delete and then execute `npm install`)
3. npm run start
4. In the browser input **127.0.0.1:8083** or **yourIp:8083**, and then can see the pages（`The default is open the PC pages, if you want to open the H5 pages, configure config`）

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

**ps:**
`You can also start the port 80 (sudo start), but is not recommended`

##problem
* If start frame failed, please try `"pm2 delete all"`, then `"npm run start"`
* Contact me: `xudeming208@126.com`
