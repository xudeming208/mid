# 压力测试
  - 仅仅测试mid框架本身，测试的网页为test页（此页请求资源的服务都为mid框架提供，而首页有其他公司接口和图片的访问）
  - 压测硬件：MacBook Pro; 8G内存; I5 2.7GHZ的CPU
  - 测试的工具有ab、wrk，其他的测试工具还有http_load、siege等

### 测试结果
| Tools        | QPS           
| ------------- |-------------|
| ab      | 477.55 |
| ab Nginx     | 225.82 |
| wrk      | 487.47 |
| wrk Nginx      | 349.10 |


# 内存泄漏测试
- 测试工具为`easy-monitor`

![内存泄漏测试](https://github.com/xudeming208/mid/blob/master/memory.jpg?raw=true)


### 压力测试详细结果
#### ab测试工具

```
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

```
/usr/sbin/ab -c 10 -n 10000 http://h5.fedevot.test.com/


This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
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

Document Path:          /test
Document Length:        4674 bytes

Concurrency Level:      10
Time taken for tests:   44.283 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      49390000 bytes
HTML transferred:       46740000 bytes
Requests per second:    225.82 [#/sec] (mean)
Time per request:       44.283 [ms] (mean)
Time per request:       4.428 [ms] (mean, across all concurrent requests)
Transfer rate:          1089.18 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0   10 438.7      0   19629
Processing:     2   34 439.1     16   19634
Waiting:        2   34 439.1     16   19634
Total:          2   44 620.3     16   19641

Percentage of the requests served within a certain time (ms)
  50%     16
  66%     20
  75%     25
  80%     29
  90%     47
  95%     72
  98%    118
  99%    141
 100%  19641 (longest request)
```

### wrk测试工具

```
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

```
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