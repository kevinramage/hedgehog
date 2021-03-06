# SQL AND Injection

Injection to check the proper implementation of SQL query on application.
This kind of injection will not change the query behaviour but can be use to identify potential injection risk (consultation page)

## Parameters

| Name        | Required | Description 
| ----------- | -------- | ------------
| type        | Yes      | Must equals to value "SQLAndInjection"
| requests    | Yes      | [Requests array](./request.MD)

The payload variable must be add in request parameters to inject some malicious SQL code (url, headers, body)

## Example

```yaml
name: SQL And Injection
goal: Check the SQL AND injection
tags:
- injection
- SQL injection
test:
  type: SQLAndInjection
  requests:
    - url: http://127.0.0.1:8081/bodgeit/search.jsp?q=Th{{payload}}
      method: GET
```