# Test runner

Test runner propose solutions to check the security of new development or the non regression of key features.
This solution propose a set a tests to check:
* injections
* application configuration
* server configuration

## How use it

Write the security test in YAML format with a specific format (Check Syntax section for more information).
Run the test with the following testRunner "npm start testRunner myFileName.yml"

Example:
```
npm start testRunner .\integration\actif\injection\SQLOrInjection.yaml
```

## Parameters

| Name        | Required | Description 
| ----------- | -------- | ------------
| name        | Yes      | Test name
| goal        | No       | Goal of the test
| description | No       | Test description
| tags        | No       | Test tags
| test        | Yes      | The code of the test (Depends of the type of test)


## Type of tests

We can find three kind of test:

* injections
    * [SQL OR Injection](./executor/doc/SQLOrInjection.MD)
    * [SQL AND Injection](./executor/doc/SQLAndInjection.MD)
    * [SQL UNION Injection](./executor/doc/SQLUnionInjection.MD)
    * [SQL TIME Injection](./executor/doc/SQLTimeInjection.MD)
    * [Reflected XSS Injection](./executor/doc/ReflectedXSSInjection.MD)
* application configuration
* server configuration
    * [Port Listener Executor](./executor/doc/portListenerExecutor.MD)