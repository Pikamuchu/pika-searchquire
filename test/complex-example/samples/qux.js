'use strict';

var bar = require('pathAlias/bar');
var baz = require('anotherPathAlias/baz');
var zab = require('./another/opinionated/folder/hierarchy/with/many/levels/zab');
var utils = require('./utils');

function bigBar() {
  return utils.toUpperCase(bar.bar());
}

function bigBaz() {
  return utils.toUpperCase(baz.baz());
}

function bigZab() {
  return utils.toUpperCase(zab.zab());
}

module.exports = {
  bigBar: bigBar,
  bigBaz: bigBaz,
  bigZab: bigZab
}
