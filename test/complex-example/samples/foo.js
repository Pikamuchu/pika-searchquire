var bar = require('pathAlias/bar')
var bas = require('pathAlias/bas')

function bigBar() {
  return require('pathAlias/bar').bar().toUpperCase()
}

function bigRab() {
  return bar.rab().toUpperCase()
}

function bigBas(file) {
  return bas.bas(file).toUpperCase()
}

module.exports = {
  bigBar: bigBar,
  bigRab: bigRab,
  bigBas: bigBas
}
