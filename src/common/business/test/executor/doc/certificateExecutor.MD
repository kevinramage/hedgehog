# Certicate executor

Executor to check the validity of server certificate.

## Parameters

| Name         | Required | Description 
| ------------ | -------- | ------------
| type         | Yes      | Must equals to value "CertificateExecutor"
| host         | Yes      | Host to check
| port         | Yes      | Port to check

## Example

```yaml
name: Certificate
goal: Check certificate issues
description: No certificate issues detected on server
tags:
- server
- ssl
- certificate
test:
  type: CertificateExecutor
  host: defendtheweb.net
  port: 443
```