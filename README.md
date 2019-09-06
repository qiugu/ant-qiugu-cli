# Cli for Ant Design Vue
## A simple CLI for Ant Design Vue projects.

npm package
Feature

Based on vue-cli3.0, added a lot of configuration, reduce the duplication of work
* axios config
* ant-design-vue UI framework
* Permission management
* normalize css style
* base page such as login,register
* vue.config.js config

## Usage
Installation

Prerequisites: Node.js (>=6.x, 8.x preferred), npm version 3+ and Git.

```
$ npm install ant-qg-cli -g
```
Optional:
* description: describe your project
* version: input your project version
* author: input your project author
* select config:
  1. according to the need to load config
  2. default roles permission config files
  3. management system login,register component
  4. unit test module

create a Ant Design Vue template

```
$ qg init application
```

Prettier eslint your code

```
$ npm run lint
```

Example:

```
$ cd your application
$ npm run serve
```


