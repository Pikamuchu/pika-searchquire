'use strict';

var DEFAULT_LOG_LEVEL = 2;

var DEBUG = 0;
var INFO = 1;
var WARN = 2;
var ERROR = 3;

function log(message, level) {
  if (level >= DEFAULT_LOG_LEVEL) {
    console.log(message);
  }
}

function logDebug(message) {
  log('DEBUG ' + message, DEBUG)
}

function logInfo(message) {
  log(message, INFO)
}

function logWarn(message) {
  log(message, WARN)
}

function logError(message) {
  log(message, ERROR)
}

module.exports = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
};
