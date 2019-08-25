'use strict';

var bar = require('pathAlias/bar');
var bas = require('pathAlias/bas');
var utils = require('./utils');

function bigBar() {
  return require('pathAlias/bar').bar().toUpperCase();
}

function bigRab() {
  return bar.rab().toUpperCase();
}

function bigBas(file) {
  return utils.toUpperCase(bas.bas(file));
}

module.exports = {
  bigBar: bigBar,
  bigRab: bigRab,
  bigBas: bigBas
}
