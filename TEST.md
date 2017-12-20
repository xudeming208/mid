# 压力测试
  - 仅仅测试mid框架本身，测试的网页为test页（请求资源的服务都为mid框架提供），因为首页有其他公司接口和图片的访问
  - 压测硬件：MacBook Pro; 8G内存; I5 2.7GHZ的CPU
  - 测试的工具有ab、wrk

## 测试结果

### ab测试工具

```javascript
/usr/sbin/ab -c 10 -n 10000 http://127.0.0.1:8083/


This is ApacheBench, Version 2.3 <$Revision: 1796539 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 127.0.0.1 (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        MID
Server Hostname:        127.0.0.1
Server Port:            8083

Document Path:          /
Document Length:        4780 bytes

Concurrency Level:      10
Time taken for tests:   20.940 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      50420000 bytes
HTML transferred:       47800000 bytes
Requests per second:    477.55 [#/sec] (mean)
Time per request:       20.940 [ms] (mean)
Time per request:       2.094 [ms] (mean, across all concurrent requests)
Transfer rate:          2351.40 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0      12
Processing:     3   21  18.3     15     218
Waiting:        3   20  18.1     14     218
Total:          3   21  18.3     15     218

Percentage of the requests served within a certain time (ms)
  50%     15
  66%     19
  75%     23
  80%     26
  90%     39
  95%     56
  98%     79
  99%    102
 100%    218 (longest request)
```

##### 通过Nginx代理后的测试结果：

```javascript
/usr/sbin/ab -c 10 -n 10000 http://h5.fedevot.test.com/


This is ApacheBench, Version 2.3 <$Revision: 1796539 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking h5.fedevot.test.com (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        nginx/1.10.3
Server Hostname:        h5.fedevot.test.com
Server Port:            80

Document Path:          /
Document Length:        20 bytes

Concurrency Level:      10
Time taken for tests:   41.826 seconds
Complete requests:      10000
Failed requests:        9999
   (Connect: 0, Receive: 0, Length: 9999, Exceptions: 0)
Non-2xx responses:      1
Total transferred:      50445149 bytes
HTML transferred:       47795240 bytes
Requests per second:    239.09 [#/sec] (mean)
Time per request:       41.826 [ms] (mean)
Time per request:       4.183 [ms] (mean, across all concurrent requests)
Transfer rate:          1177.81 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    9 349.0      0   13198
Processing:     3   32 231.2     17   13241
Waiting:        3   32 231.2     17   13241
Total:          3   42 418.1     18   13242

Percentage of the requests served within a certain time (ms)
  50%     18
  66%     22
  75%     28
  80%     33
  90%     58
  95%     92
  98%    137
  99%    151
 100%  13242 (longest request)
```

### wrk测试工具

```javascript
./wrk -t12 -c1000 -d60s --latency http://192.168.120.96:8083/


Running 1m test @ http://192.168.120.96:8083/
  12 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   648.44ms  264.58ms   2.00s    62.86%
    Req/Sec    53.38     52.26   380.00     84.26%
  Latency Distribution
     50%  633.33ms
     75%  844.48ms
     90%    1.02s
     99%    1.22s
  29297 requests in 1.00m, 142.16MB read
  Socket errors: connect 0, read 960, write 30, timeout 587
Requests/sec:    487.47
Transfer/sec:      2.37MB
```

##### 通过Nginx代理后的测试结果：

```javascript
./wrk -t12 -c1000 -d60s --latency http://h5.fedevot.test.com/


Running 1m test @ http://h5.fedevot.test.com/
  12 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   473.54ms  504.87ms   2.00s    81.30%
    Req/Sec    44.68    153.14     5.13k    99.05%
  Latency Distribution
     50%  297.23ms
     75%  806.78ms
     90%    1.29s
     99%    1.78s
  20974 requests in 1.00m, 75.75MB read
  Socket errors: connect 0, read 24481, write 0, timeout 1652
  Non-2xx or 3xx responses: 5790
Requests/sec:    349.10
Transfer/sec:      1.26MB
```