# SQL TIME Injection

Injection to check the proper implementation of SQL query on application.
This kind of injection can be to identify an entry point to inject others kind of injection (SQL Boolean OR or SQL Union).

## Parameters

| Name        | Required | Description 
| ----------- | -------- | ------------
| type        | Yes      | Must equals to value "SQLTimeInjection"
| requests    | Yes      | [Request array](./request.MD)

The payload variable must be add in request parameters to inject some malicious SQL code (url, headers, body)

## Example

```yaml
name: Login SQL Time Injection
goal: Check the SQL Time injection on login form
description: The SQL Time injection not worked on login form
tags:
- injection
- SQL injection
test:
  type: SQLTimeInjection
  requests:
    - url: http://testphp.vulnweb.com/userinfo.php
      method: POST
      headers:
        Content-Type: application/x-www-form-urlencoded
      body: uname={{payload}}&pass={{payload}}
```