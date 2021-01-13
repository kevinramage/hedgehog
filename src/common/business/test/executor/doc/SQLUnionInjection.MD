# SQL UNION Injection

Injection to check the proper implementation of SQL query on application.
This kind of injection can be to collect data. You can collect all data present in database.

## Parameters

| Name        | Required | Description 
| ----------- | -------- | ------------
| type        | Yes      | Must equals to value "SQLUnionInjection"
| request     | Yes      | [Request object](./request.MD)

The payload variable must be add in request parameters to inject some malicious SQL code (url, headers, body)

## Example

```yaml
name: SQL Union Injection
goal: Check the SQL Union injection
tags:
- injection
- SQL injection
test:
  type: SQLUnionInjection
  request:
    url: http://127.0.0.1:8081/bodgeit/search.jsp?q={{payload}}
    method: GET
```