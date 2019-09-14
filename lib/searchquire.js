'use strict';

var searchService = require('./searchService');
var searchUtils = require('./searchUtils');

/**
 * Resolve request module using config parametrization.
 *
 * @param {string} request - request path
 * @param {object} config - config to use
 * @return {*} resolved request module.
 */
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

Searchquire.prototype.load = function(request, config, stubs) {
  return searchService.processModule(this._parent, request, config, stubs);
};

module.exports = Searchquire;
