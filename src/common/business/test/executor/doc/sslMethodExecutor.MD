# SSL method listener

Executor to check the listening SSL methods on the server.

## Parameters

| Name         | Required | Description 
| ------------ | -------- | ------------
| type         | Yes      | Must equals to value "SSLMethodExecutor"
| host         | Yes      | Host to check
| port         | Yes      | Port to check

## Example

```yaml
name: SSLMethod
goal: Check the SSL method available
description: The SSL methods available are TLS1.1 and TLS1.2
tags:
- server
- ssl
- ssl method
test:
  type: SSLMethodExecutor
  host: defendtheweb.net
  port: 443
```