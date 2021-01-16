# Proxy

## Parameters

| Name           | Required | Default | Description
| -------------- | -------- | ------- | -------------------
| server         | Yes      |         | Proxy server
| port           | Yes      |         | Proxy port
| username       | No       | Empty   | Proxy user name
| password       | No       | Empty   | Proxy password

## Example

```yaml
request:
  url: http://localhost:8081/bodgeit/contact.jsp
  method: POST
  headers:
    Content-Type: application/x-www-form-urlencoded
  body: null=&anticsrf=0.7117213663846246&comments={{payload}}
  proxy:
      server: localhost
      port: 8866
      username: test
      password: testPWD
```