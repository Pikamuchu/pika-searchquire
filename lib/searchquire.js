'use strict';

const searchService = require('./searchService');
const searchUtils = require('./searchUtils');

function Searchquire(parent) {
  var self = this;
  var fn = self.load.bind(self);

  this._parent = parent;

  var proto = Searchquire.prototype;
  Object.keys(proto).forEach(function(key) {
    if (searchUtils.isFunction(proto[key])) {
      fn[key] = self[key].bind(self);
    }
  });

  self.fn = fn;
  return fn;
}

Searchquire.prototype.load = function(request, config) {
  return searchService.processModule(request, searchService.processConfig(this._parent, config));
};

module.exports = Searchquire;
