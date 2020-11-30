# Fuzzing checker

These checkers allow to check default path exposed by an application server.
These checkers based on response status code to validate the application server behaviour.

# Usage

__Syntax__: npm start [fuzzingName] [hostName] [port] [ssl]
* fuzzingName: the fuzzing checker to use
    * apacheFuzzing
    * coldFusionFuzzing
    * commonFuzzing
    * iisFuzzing
    * jBossFuzzing
    * phpFuzzing
    * tomcatFuzzing
* hostName: The application server hostname 
* port: The port number of application server 
* ssl: Flag to indicate if the server used SSL protocol or not

`npm start commonFuzzing testphp.vulnweb.com 80 false`

```
2020-11-30 20:59:54.076 - INFO - ---------------------------------------
2020-11-30 20:59:54.078 - INFO -                 COMMON FUZZING
2020-11-30 20:59:54.079 - INFO - ---------------------------------------
2020-11-30 20:59:54.096 - INFO - Date: 2020-11-30T19:59:54.091Z
2020-11-30 20:59:54.158 - INFO - Host: 'testphp.vulnweb.com'
2020-11-30 20:59:54.222 - INFO - Port: '80'
2020-11-30 20:59:54.226 - INFO - ---------------------------------------
2020-11-30 20:59:54.484 - INFO - ---------------------------------------
2020-11-30 20:59:54.514 - INFO - Execution time: 407 ms
2020-11-30 20:59:54.528 - INFO - Path: '/admin, /images'
2020-11-30 20:59:54.532 - INFO - ---------------------------------------
```