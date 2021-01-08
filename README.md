[![License](https://img.shields.io/badge/license-Apache%202-4EB1BA.svg)](https://github.com/kevinramage/hedgehog/blob/main/LICENSE)
![Build](https://github.com/kevinramage/hedgehog/workflows/build/badge.svg)
![Quality](./.github/current/quality.svg)
![Analyzers](./.github/current/analyzers.svg)


# Hedgehog
A security black box testing tool to analyze your application security and provide feature like security tests to help you to implement integrate security in your industrialization process (DevSecOps)

This tool propose some features like:
* Execute checkers
* Execute security tests
* Analyze requests (NOT READY)
* Navigate through a web application to identify links (web crawler, spider bot) (NOT READY)
* Attack a web application (NOT READY)

The goal to this tool is to be included in development life cycle to identify quickly the security isssue, keep a tracking of these issues and check the non regression of this issue in each releases.

# How it works

For security auditing:
* Use checkers to valide some security points

For DevSecOps implementation:
* Use security tests in your CI pipeline to test new developments or to check non regression

# Installation

To install this tool, git and NodeJS tools are required.
Execute the following statements to install this tool:

```
git clone https://github.com/kevinramage/hedgehog.git
cd hedgehog
npm install
```

# Usage

This tool based on severals importants notions:
* [Checker](./src/checker/README.md)
* [Test runner](./src/common/business/test/README.md)

# Contributions

To consult developper documentation
[Documentation link](./doc/globals.html)

# Issue

To view and create issue, follow this link
[Issue link](https://github.com/kevinramage/hedgehog/issues)