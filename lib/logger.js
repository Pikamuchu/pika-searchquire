'use strict';

var DEBUG = 0;
var INFO = 1;
var WARN = 2;
var ERROR = 3;

function Logger() {
  if (!(this instanceof Logger)) {
    return new Logger();
  }
  if (Logger.hasOwnProperty('singleton')) {
    return Logger.singleton;
  }
  Object.defineProperty(Logger, 'singleton', {
    value: this,
    enumerable: false,
    writable: false,
    configurable: false
  });

  this.logLevel = WARN;
  this.logElapseTime = false;
  this.lastTime;
  this.logFunction = console.log;

  this.setupLog = function (logLevel, logElapseTime, logFunction) {
    if (logLevel !== undefined) {
      this.logLevel = logLevel;
    }
    if (logElapseTime !== undefined) {
      this.logElapseTime = logElapseTime;
    }
    if (logFunction !== undefined) {
      this.logFunction = logFunction;
    }
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
}

module.exports = Logger();
