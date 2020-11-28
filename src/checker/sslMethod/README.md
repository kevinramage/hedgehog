# SSL method checker

This checker allow to check SSL method authorized by an application server.
An application server must propose the last secure SSL method (TLSv1.2, TLSv1.3).
An application server must not propose insecure SSL method (SSLv2, SSLv3).

# Usage

__Syntax__: npm start ssl [hostName] [port]

`npm start ssl hack.me 443`

```
2020-11-28 17:34:22.364 - INFO - ---------------------------------------
2020-11-28 17:34:22.366 - INFO -                 SSL METHODS
2020-11-28 17:34:22.366 - INFO - ---------------------------------------
2020-11-28 17:34:22.369 - INFO - Date: 2020-11-28T16:34:22.367Z
2020-11-28 17:34:22.376 - INFO - Host: 'hack.me'
2020-11-28 17:34:22.389 - INFO - Port: '443'
2020-11-28 17:34:22.391 - INFO - SSL Methods to test: 'SSLv3, TLSv1, TLSv1.1, TLSv1.2, TLSv1.3'
2020-11-28 17:34:22.392 - INFO - ---------------------------------------
2020-11-28 17:34:24.390 - INFO - TLSv1.1 allowed
2020-11-28 17:34:24.420 - INFO - TLSv1 allowed
2020-11-28 17:34:24.433 - INFO - TLSv1.2 allowed
2020-11-28 17:34:24.435 - INFO - ---------------------------------------
2020-11-28 17:34:24.436 - INFO - Execution time: 2070 ms
2020-11-28 17:34:24.438 - INFO - SSL Methods: 'TLSv1, TLSv1.1, TLSv1.2, TLSv1.3 (ECONNRESET)'
2020-11-28 17:34:24.439 - INFO - ---------------------------------------
```