'use strict';

var DEFAULT_LOG_LEVEL = 2;
var LOG_ELAPSE_TIME = false;

var DEBUG = 0;
var INFO = 1;
var WARN = 2;
var ERROR = 3;

var lastTime;

function log(message, level) {
  if (level >= DEFAULT_LOG_LEVEL) {
    var logMessage = message ? message : '';
    logMessage = getTimeMessage(logMessage) + logMessage;
    console.log(logMessage);
  }
}

function getTimeMessage(logMessage) {
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

var startTime, endTime;

function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
}

module.exports = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
};
