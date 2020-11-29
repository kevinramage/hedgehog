# HTTP method checker

This checker allow to check HTTP method authorized by an application server.
An application server must disable debug HTTP method like TRACE, DEBUG ...

# Usage

__Syntax__: npm start method [hostName] [port] [path]

`npm start method hack.me 443 /`

```
2020-11-29 16:22:52.621 - INFO - ---------------------------------------
2020-11-29 16:22:52.622 - INFO -                 HTTP METHODS
2020-11-29 16:22:52.623 - INFO - ---------------------------------------
2020-11-29 16:22:52.625 - INFO - Date: 2020-11-29T15:22:52.624Z
2020-11-29 16:22:52.626 - INFO - Host: 'hack.me'
2020-11-29 16:22:52.626 - INFO - Port: '443'
2020-11-29 16:22:52.627 - INFO - Path: '/'
2020-11-29 16:22:52.628 - INFO - HTTP Methods to test: 'OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK, UNLOCK, VERSION-CONTROL, REPORT, CHECKOUT, CHECKIN, UNCHECKOUT, MKWORKSPACE, UPDATE, LABEL, MERGE, BASELINE-CONTROL, MKACTIVITY, ORDERPATCH, ACL, PATCH, SEARCH, ARBITRARY, BCOPY, BDELETE, BMOVE, BPROPFIND, BPROPPATCH, DEBUG, INDEX, NOTIFY, POLL, RPC_IN_DATA, RPC_OUT_DATA, SUBSCRIBE, UNSUBSCRIBE, X-MS-ENUMATTS'
2020-11-29 16:22:52.630 - INFO - ---------------------------------------
2020-11-29 16:22:53.468 - INFO - OPTIONS listening => 200
2020-11-29 16:22:53.600 - INFO - GET listening => 200
2020-11-29 16:22:53.622 - INFO - POST listening => 200
2020-11-29 16:22:53.977 - INFO - ---------------------------------------
2020-11-29 16:22:53.978 - INFO - Execution time: 1355 ms
2020-11-29 16:22:53.979 - INFO - HTTP Methods: 'OPTIONS, GET, POST'
2020-11-29 16:22:53.980 - INFO - ---------------------------------------
```