# Pika Searchquire

[![Version](https://img.shields.io/npm/v/pika-searchquire.svg)](https://npmjs.org/package/pika-searchquire)
[![Build Status](https://img.shields.io/travis/pikamachu/pika-searchquire/master.svg)](https://travis-ci.org/pikamachu/pika-searchquire)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a5d465f487e4f55a8e50e8201cc69b1)](https://www.codacy.com/project/antonio.marin.jimenez/pika-searchquire/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pikamachu/pika-searchquire&amp;utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/pikamachu/pika-searchquire/branch/master/graph/badge.svg)](https://codecov.io/gh/pikamachu/pika-searchquire)

## Introduction

Searches proxyquire dependencies stubs using configurable patterns.

## Installing / Getting started 

To install the package execute:
```
npm install -g searchquire
```

## Usage

```js
import searchquire from 'searchquire';

const resolveSetup = {};

const restoreOriginalModuleLoader = searchquire(resolveSetup);

// Restore the original module loader.
restoreOriginalModuleLoader();
```

See tests for examples



## Developing 
 
### Built With
* [proxyquire](https://github.com/oclif/oclif)

### Folder structure
* root: Contains the README.md, the main configuration to execute the project such as package.json or any other configuration files.
* lib: Contains the source code for application script.
* node_modules: Contains third party JS libraries used in this project

### Setting up Dev

Download the code
```
git clone https://github.com/pikamachu/pika-searchquire.git
cd pika-searchquire
```

Install dependencies
```
bash pika install
```

Run application tests.
```
bash pika test
```

