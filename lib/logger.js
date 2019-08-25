'use strict';

var DEBUG = 0;
var INFO = 1;
var WARN = 2;
var ERROR = 3;

function Logger() {
  this.logLevel = WARN;
  this.logElapseTime = false;
  this.lastTime;
  this.logFunction = console.log;

  this.setupLog = function (logLevel, logElapseTime, logFunction) {
    this.logLevel = logLevel !== undefined ? logLevel : WARN;
    this.logElapseTime = logElapseTime !== undefined ? logElapseTime : false;
    this.lastTime = undefined;
    this.logFunction = logFunction !== undefined ? logFunction : console.log;
  };

  this.log = function (message, level) {
    if (level >= this.logLevel) {
      var logMessage = message || '';
      logMessage = this.getTimeMessage() + logMessage;
      this.logFunction(logMessage);
    }
  };

  this.getTimeMessage = function () {
    var timeMessage = '';
    if (this.logElapseTime) {
      var currentTime = new Date();
      var timeElapsed = this.lastTime ? currentTime - this.lastTime : 0;
      timeMessage = '' + currentTime.toUTCString() + ' (' + timeElapsed + 'ms) ';
      this.lastTime = currentTime;
    }
    return timeMessage;
  };

  this.debug = function (message) {
    this.log('DEBUG ' + message, DEBUG);
  };

  this.info = function (message) {
    this.log(message, INFO);
  };

  this.warn = function (message) {
    this.log(message, WARN);
  };

  this.error = function (message) {
    this.log(message, ERROR);
  };

  this.isDebug = function () {
    return DEBUG >= this.logLevel
  };

  this.isInfo = function () {
    return INFO >= this.logLevel
  };

  this.isWarn = function () {
    return WARN >= this.logLevel
  };

  this.isError = function () {
    return ERROR >= this.logLevel
  };
}

module.exports = new Logger();
