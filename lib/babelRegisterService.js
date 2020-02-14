'use strict';

var log = require('./logger');

var BABEL_REGISTER_MODULE = '@babel/register'

function setupRegister(config) {
  var babelRegister = require(BABEL_REGISTER_MODULE);
  if (config) {
    babelRegister.default(config);
  }
  if (!babelRegister) {
    log.warn('Babel register module ' + BABEL_REGISTER_MODULE
      + ' not found. Babel transpilation is not available.');
  }
  return babelRegister;
}

function revertRegister(babelRegister) {
  if (babelRegister) {
    babelRegister.revert();
    delete require.cache[BABEL_REGISTER_MODULE];
  }
}

function compileModule(requestPath) {
  try {
    require(requestPath);
  } catch (e) {}
}

module.exports = {
  setupRegister: setupRegister,
  revertRegister: revertRegister,
  compileModule: compileModule
};
