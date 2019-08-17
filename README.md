# Pika Searchquire

[![Version](https://img.shields.io/npm/v/searchquire.svg)](https://npmjs.org/package/pika-searchquire)
[![Build Status](https://img.shields.io/travis/pikamachu/pika-searchquire/master.svg)](https://travis-ci.org/pikamachu/pika-searchquire)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a5d465f487e4f55a8e50e8201cc69b1)](https://www.codacy.com/project/antonio.marin.jimenez/pika-searchquire/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pikamachu/pika-searchquire&amp;utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/pikamachu/pika-searchquire/branch/master/graph/badge.svg)](https://codecov.io/gh/pikamachu/pika-searchquire)

## Introduction

Searchquire easily allows to override scripts dependencies during testing using configurable search patterns to locate reusable stubs and mocks.

## Installing / Getting started

To install the package execute:

```shell
npm install searchquire --save-dev
```

## Usage

### Javascript scripts

Resolve a module using a basePath where module is found as parameter.

```js
import searchquire from 'searchquire';

var foo = searchquire('foo', {
  basePath: './simple-example/samples'
});
```

Resolve a module using a mock location to resolve dependencies.

```js
import searchquire from 'searchquire';

var foo = searchquire('foo', {
  basePath: './simple-example/samples',
  modulePaths: [{
    type: 'mock',
    basePath: './simple-example/mocks',
    fileSuffix: 'Mock.js'
  }]
});
```

Resolve a module using a mock location to resolve dependencies with a string require pattern.

```js
import searchquire from 'searchquire';

var foo = searchquire('foo', {
  basePath: './simple-example/samples',
  modulePaths: [{
    type: 'mock',
    basePath: './simple-example/mocks',
    fileSuffix: 'Mock',
    requirePattern: './*'
  }]
});
```

See tests for more examples and details.

### Saleforce Commerce Cloud SFRA scripts

Resolve a cartridge script using mocks folders with file suffix and require patterns for cartridge scripts and dw api.

```js
import searchquire from 'searchquire';

var customerMock = searchquire('dw/customer/Customer', {
  basePath: './sfra-example/mocks/dw-api-mock'
};

var orderHelpersTest = searchquire('scripts/order/orderHelpers', {
  basePath: './sfra-example/project/cartridges/storefront/cartridge',
  modulePaths: [
    {
      type: 'storefront-mock',
      basePath: './sfra-example/mocks/storefront-mock',
      fileSuffix: 'Mock',
      requirePattern: /^\*\/cartridge\/(.*)/,
      requirePatternGroup: 1
    },
    {
      type: 'dw-mock',
      basePath: './sfra-example/mocks/dw-api-mock',
      requirePattern: 'dw/*'
    }
  ]
};
```

See tests for more examples and details.

## Developing

### Built with

* [n-readlines](https://github.com/nacholibre/node-readlines)
* [proxyquire](https://github.com/thlorenz/proxyquire)
* [resolve](https://github.com/browserify/resolve)

### Folder structure

* root: Contains the README.md, the main configuration to execute the project such as package.json or any other configuration files.
* lib: Contains the source code for application script.
* test: Contains library tests and examples.
* node_modules: Contains third party JS libraries used in this project

### Setting up Dev

Download the code

```shell
git clone https://github.com/pikamachu/pika-searchquire.git
cd pika-searchquire
```

Install dependencies

```shell
bash pika install
```

Run application tests.

```shell
bash pika test
```