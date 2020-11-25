# SSL Procotol

## Introduction
This tool will check for a server the SSL protocol enabled or not.
It will check the following procotols:
* SSLv3_method
* TLSv1_method
* TLSv1_1_method
* TLSv1_2_method

## Installation

To use this tool, a node JS is required.
Just clone the repository to install it.
`git clone XXX`

## Usage

To execute this tool, execute npm script the following statement:
`npm run sslProtocol -- -s google.com -p 443`

** usage **
```
Usage: sslProtocolProgram [options]

Check the SSL protocol enabled on a server

Options:
  -s, --serverName <serverName>  Server name to check
  -p, --port <port>              Server port to check (default: "443")
  -V, --version                  output the version number
  -h, --help                     display help for command
```