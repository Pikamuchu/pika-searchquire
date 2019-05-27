'use strict'

var Searchquire = require('./lib/searchquire');

delete require.cache[require.resolve(__filename)];

module.exports = new Searchquire(module.parent);
