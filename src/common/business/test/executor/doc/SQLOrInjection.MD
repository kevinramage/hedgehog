# SQL OR Injection

Injection to check the proper implementation of SQL query on application.
This kind of injection can be use to by pass access control (login form).

## Parameters

| Name        | Required | Description 
| ----------- | -------- | ------------
| type        | Yes      | Must equals to value "SQLOrInjection"
| request     | Yes      | [Request object](./request.MD)

The payload variable must be add in request parameters to inject some malicious SQL code (url, headers, body)

## Example

```yaml
name: Login SQL Or Injection
goal: Check the SQL OR injection on login form
description: The SQL OR injection not worked on login form
tags:
- injection
- SQL injection
test:
  type: SQLOrInjection
  request:
    url: http://testphp.vulnweb.com/userinfo.php
    method: POST
    headers:
      Content-Type: application/x-www-form-urlencoded
    body: uname={{payload}}&pass={{payload}}
```