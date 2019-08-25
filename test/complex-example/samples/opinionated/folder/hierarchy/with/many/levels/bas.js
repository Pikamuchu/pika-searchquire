'use strict';

var path = require('path')

function bas(file) {
  return path.basename(file);
}

module.exports = {
  bas: bas
}
