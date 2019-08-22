'use strict'

var Searchquire = require('./searchquire');

delete require.cache[require.resolve(__filename)];

module.exports = new Searchquire(module.parent);
