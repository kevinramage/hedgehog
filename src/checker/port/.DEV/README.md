# Port Listener

## Introduction
This tool will check for a server ports opened or not.
It tool can be used to check a list of ports or a port interval. 

## Installation

To use this tool, a node JS is required.
Just clone the repository to install it.
`git clone XXX`

## Usage

To execute this tool, execute npm script the following statement:
`npm run sslProtocol -- -s hackyourselffirst.troyhunt.com -p 1-3389`
`npm run sslProtocol -- -s hackyourselffirst.troyhunt.com -p 80`
`npm run sslProtocol -- -s hackyourselffirst.troyhunt.com -p 22,80,8080,443`

** usage **
```
Usage: portsListenerProgram [options]

Check the port opened on a server

Options:
  -s, --serverName <serverName>  Server name to check
  -p, --port <port>              Server ports to check: simple port | list ports to check | port interval (default:    
                                 "1-3389")
  -V, --version                  output the version number
  -h, --help                     display help for command
```