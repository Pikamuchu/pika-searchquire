'use strict';

var DEFAULT_LOG_LEVEL = 0;

var DEBUG = 0;
var INFO = 1;
var WARN = 2;
var ERROR = 3;

function log(message, level, config) {
  if (level >= DEFAULT_LOG_LEVEL) {
    console.log(message);
  }
}

function logDebug(message, config) {
  log(message, DEBUG, config)
}

function logInfo(message, config) {
  log(message, INFO, config)
}

function logWarn(message, config) {
  log(message, WARN, config)
}

function logError(message, config) {
  log(message, ERROR, config)
}

module.exports = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
};
