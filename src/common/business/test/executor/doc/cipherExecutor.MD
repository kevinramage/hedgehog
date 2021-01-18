# Cipher listener

Executor to check the listening ciphers on the server.

## Parameters

| Name         | Required | Description 
| ------------ | -------- | ------------
| type         | Yes      | Must equals to value "CipherListenerExecutor"
| host         | Yes      | Host to check
| port         | Yes      | Port to check

## Example

```yaml
name: Cipher
goal: Check the cipher available
description: The cipher available are XXX
tags:
- server
- ssl
- cipher
test:
  type: CipherListenerExecutor
  host: defendtheweb.net
  port: 443
```