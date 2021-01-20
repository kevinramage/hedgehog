# Method listener

Executor to check the listening methods on the server.

## Parameters

| Name         | Required | Description 
| ------------ | -------- | ------------
| type         | Yes      | Must equals to value "MethodListenerExecutor"
| host         | Yes      | Host to check
| port         | Yes      | Port to check
| path         | Yes      | Path to check
| ssl          | False    | Indicate if the protocol to use is SSL or not

## Example

```yaml
name: Method
goal: Check the method listening
description: Check the method listening
tags:
- server
- method
test:
  type: MethodListenerExecutor
  host: localhost
  port: 8081
  path: "/"
```