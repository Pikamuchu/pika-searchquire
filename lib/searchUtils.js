'use strict';

var Module = require('module');
var resolve = require('resolve');
var lineByLine = require('n-readlines');

var log = require('./logUtils');

function isFunction(obj) {
  return obj && {}.toString.call(obj) === '[object Function]';
}

function findMatchesInFile(file, pattern, group) {
  var matches = [];
  try {
    var liner = new lineByLine(file), line;
    while (line = liner.next()) {
      if (pattern.test(line)) {
        var match = pattern.exec(line)
        if (match && match.length >= group) {
          var matchGroup = match[group];
          if (matchGroup && matches.indexOf(matchGroup) === -1) {
            matches.push(matchGroup);
          }
        }
      }
    }
  } catch (err) {
    console.log('Error: ' + err);
  }
  return matches;
};

function resolveModule(requestPath, baseDir, useSimpleSearch) {
  var options = {
    basedir: baseDir,
    extensions: useSimpleSearch ? [] : Object.keys(require.extensions),
    paths: useSimpleSearch ? [] : Module.globalPaths,
    moduleDirectory: useSimpleSearch ? null : 'node_modules'
  }
  try {
    return resolve.sync(requestPath, options);
  } catch (err) {
    log.debug('resolveModule: ' + err);
  }
}

module.exports = {
  isFunction: isFunction,
  findMatchesInFile: findMatchesInFile,
  resolveModule: resolveModule
};
