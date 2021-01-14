# HTTP Request

## Parameters

| Name           | Required | Default | Description
| -------------- | -------- | ------- | -------------------
| url            | Yes      |         | Url to access
| method         | No       | GET     | Method to use for this HTTP Request
| headers        | no       |         | A dictionnary key / value which contains the HTTP headers to sent
| body           | No       | empty   | The HTTP body to send
| proxy          | No       | empty   | Define [proxy](./proxy.MD) to use for this injection

## Example

```yaml
request:
    url: http://testphp.vulnweb.com/userinfo.php
    method: POST
    headers:
      Content-Type: application/x-www-form-urlencoded
    body: uname={{payload}}&pass={{payload}}
```