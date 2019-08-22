'use strict';

var Module = require('module');
var resolve = require('resolve');
var LineByLine = require('n-readlines');

var log = require('./logger');

/**
 * Check if obj is a function.
 *
 * @param {*} obj - instance to check
 * @returns {boolean} true if object is a function
 */
function isFunction(obj) {
  return obj && {}.toString.call(obj) === '[object Function]';
}

/**
 * Check if path is absolute.
 *
 * @param {*} obj - instance to check
 * @returns {boolean} true if path is absolute
 */
function isAbsolutePath(path) {
  return /^(?:[A-Za-z]:)?\\/.test(path);
}

/**
 * return all file lines that matches the pattern.
 *
 * @param {File} file - file to use
 * @param {string} string - string to use in simple check
 * @param {RegExp} pattern - pattern to use
 * @param {number} group - match group to return
 * @returns {Array<string>} pattern matches on file
 */
function findMatchesInFile(file, string, pattern, group) {
  var matches = [];
  try {
    var liner = new LineByLine(file);
    var line;
    while ((line = liner.next())) {
      if (line.indexOf(string) !== -1) {
        var match = pattern.exec(line);
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
}

/**
 * Search module path for requestPath and baseDir.
 *
 * @param {string} requestPath - request path to use
 * @param {string} baseDir - base dir to use
 * @param {boolean} useSimpleSearch - don't search on additional module paths
 */
function resolveModule(requestPath, baseDir, useSimpleSearch) {
  var options = {
    basedir: baseDir,
    extensions: Object.keys(require.extensions),
    paths: useSimpleSearch ? [] : Module.globalPaths,
    moduleDirectory: useSimpleSearch ? [] : 'node_modules'
  };
  try {
    return resolve.sync(requestPath, options);
  } catch (err) {
    log.debug('    ResolveModule: ' + err);
  }
}

module.exports = {
  isFunction: isFunction,
  isAbsolutePath: isAbsolutePath,
  findMatchesInFile: findMatchesInFile,
  resolveModule: resolveModule
};
