'use strict';

var bar = require('./bar');
var bas = require('bas');

function bigBar() {
  return require('./bar').bar().toUpperCase();
}

function bigRab() {
  return bar.rab().toUpperCase();
}

function bigBas(file) {
  return bas.bas(file).toUpperCase();
}

module.exports = {
  bigBar: bigBar,
  bigRab: bigRab,
  bigBas: bigBas
}
