# Port listener

Executor to check the listening ports on the server.

## Parameters

| Name         | Required | Description 
| ------------ | -------- | ------------
| type         | Yes      | Must equals to value "PortListenerExecutor"
| host         | Yes      | Host to check
| portsToCheck | Yes      | An object (min/max) to check a port list
| validPorts   | Yes      | An integer list of valid ports

## Example

```yaml
name: Port
goal: Check the server port available
description: The server listen only on 80
tags:
- server
- port
test:
  type: PortListenerExecutor
  server: localhost
  portsToCheck:
    min: 1
    max: 1023
  validPorts:
  - 80
```