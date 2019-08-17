'use strict';

var LOG_LEVEL = 2;
var LOG_ELAPSE_TIME = false;

var DEBUG = 0;
var INFO = 1;
var WARN = 2;
var ERROR = 3;

var lastTime;

function log(message, level) {
  if (level >= LOG_LEVEL) {
    var logMessage = message || '';
    logMessage = getTimeMessage() + logMessage;
    console.log(logMessage);
  }
}

function getTimeMessage() {
  var timeMessage = '';
  if (LOG_ELAPSE_TIME) {
    var currentTime = new Date();
    var timeElapsed = lastTime ? currentTime - lastTime : 0;
    timeMessage = '' + currentTime.toUTCString() + ' (' + timeElapsed + 'ms) ';
    lastTime = currentTime;
  }
  return timeMessage;
}

function logDebug(message) {
  log('DEBUG ' + message, DEBUG);
}

function logInfo(message) {
  log(message, INFO);
}

function logWarn(message) {
  log(message, WARN);
}

function logError(message) {
  log(message, ERROR);
}

module.exports = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError
};
