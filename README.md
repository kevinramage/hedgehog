[![License](https://img.shields.io/badge/license-Apache%202-4EB1BA.svg)](https://github.com/kevinramage/hedgehog/blob/main/LICENSE)
![Build](https://github.com/kevinramage/hedgehog/workflows/build/badge.svg)
![Quality](./.github/current/quality.svg)
![Analyzers](./.github/current/analyzers.svg)


# Hedgehog
A security black box testing tool to analyze your application security 

This tool propose some features like:
* Analyze requests (NOT READY)
* Navigate through a web application to identify links (web crawler, spider bot) (NOT READY)
* Attack a web application (NOT READY)
* Execute checkers (NOT READY)

The goal to this tool is to be included in development life cycle to identify quickly the security isssue, keep a tracking of these issues and check the non regression of this issue in each releases.

# How it works

Include it in your CI / CD pipeline to:
* Collect data during the integration testing
Use this tool as proxy of your integration testing
The tool will analyze requests, identify server technology and identify application misconfiguration
It will propose an attack plan to identify potentials issues

* Run the tool to attack your web application
From an an attack plan, a security check list and a defect list, select some attacks to process and run it

# Installation

To install this tool, git and NodeJS tools are required.
Execute the following statements to install this tool:

```
git clone https://github.com/kevinramage/hedgehog.git
cd hedgehog
npm install
```

# Usage

This tool based on two importants notions SYSTEM and CHECKER.
[System link](./src/system/README.md)
[Checker link](./src/checker/README.md)

# Contributions

To consult developper documentation
[Documentation link](./doc/globals.html)

# Issue

To view and create issue, follow this link
[Issue link](https://github.com/kevinramage/hedgehog/issues)