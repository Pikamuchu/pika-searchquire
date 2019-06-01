'use strict';

var searchService = require('./searchService');
var searchUtils = require('./searchUtils');

function Searchquire(parent) {
  var self = this;
  var fn = self.load.bind(self);

  this._parent = parent;

  var proto = Searchquire.prototype;
  Object.keys(proto).forEach(function (key) {
    if (searchUtils.isFunction(proto[key])) {
      fn[key] = self[key].bind(self);
    }
  });

  self.fn = fn;
  return fn;
}

Searchquire.prototype.load = function (request, config) {
  return searchService.processModule(this._parent, request, config);
};

module.exports = Searchquire;
