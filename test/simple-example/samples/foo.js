var bar = require('./bar')
var path = require('path')
var crypto

function bigBar() {
  // inline require
  return require('./bar').bar().toUpperCase()
}

function bigRab() {
  // module wide require
  return bar.rab().toUpperCase()
}

function bigBas(file) {
  return path.basename(file).toUpperCase()
}

module.exports = {
  bigBar: bigBar,
  bigRab: bigRab,
  bigBas: bigBas
}
