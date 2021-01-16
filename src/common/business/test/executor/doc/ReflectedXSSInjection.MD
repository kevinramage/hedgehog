# SQL AND Injection

Injection to check the proper implementation of HTML page on application.
This kind of injection can be use to steal user cookies

## Parameters

| Name        | Required | Description 
| ----------- | -------- | ------------
| type        | Yes      | Must equals to value "ReflectedXSSInjection"
| requests    | Yes      | [Request array](./request.MD)

The payload variable must be add in request parameters to inject some malicious XSS code (url, headers, body)

## Example

```yaml
name: Reflected XSS Injection
goal: Check the reflected XSS injection
tags:
- injection
- XSS
test:
  type: ReflectedXSSInjection
  requests:
    - url: http://localhost:8081/bodgeit/contact.jsp
      method: POST
      headers:
        Content-Type: application/x-www-form-urlencoded
      body: null=&anticsrf=0.7117213663846246&comments={{payload}}
```