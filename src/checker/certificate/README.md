# Certificate checker

This checker allow to check application  server certificate.
This checker check the common name validation.
This checker check the certificate expiration.

# Usage

__Syntax__: npm start certificate [hostName] [port]

`npm start certificate www.ssl.com 443`

```
2020-12-03 19:59:22.378 - INFO - ---------------------------------------
2020-12-03 19:59:22.381 - INFO -                 CertificateChecker
2020-12-03 19:59:22.383 - INFO - ---------------------------------------
2020-12-03 19:59:22.396 - INFO - Date: 2020-12-03T18:59:22.390Z
2020-12-03 19:59:22.436 - INFO - Host: 'www.ssl.com'
2020-12-03 19:59:22.438 - INFO - Port: '443'
2020-12-03 19:59:22.441 - INFO - ---------------------------------------
2020-12-03 19:59:23.289 - INFO - ---------------------------------------
2020-12-03 19:59:23.290 - INFO - Execution time: 910 ms
2020-12-03 19:59:23.290 - INFO - Certification chain
2020-12-03 19:59:23.292 - INFO - * Certum Trusted Network CA
2020-12-03 19:59:23.292 - INFO - *   SSL.com EV Root Certification Authority RSA R2
2020-12-03 19:59:23.294 - INFO - *     SSL.com EV SSL Intermediate CA RSA R3
2020-12-03 19:59:23.295 - INFO - *       www.ssl.com
2020-12-03 19:59:23.295 - INFO - Expiration: 'NOT EXPIRED'
2020-12-03 19:59:23.303 - INFO - Common name: 'VALID'
2020-12-03 19:59:23.305 - INFO - ---------------------------------------
```