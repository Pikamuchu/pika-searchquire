'use strict';

var path = require('path');

var searchUtils = require('./searchUtils');
var log = require('./logUtils');

/**
 * Check config parametrizations.
 *
 * @param {string} parentModule - module.parent instance to use
 * @param {object} config - configuration to check
 */
function processConfig(parentModule, config) {
  var searchConfig = {
    basePath: config.basePath || '.',
    parentDir: path.dirname(parentModule.filename),
    ignoreModuleNotFoundErrors: config.ignoreModuleNotFoundErrors || true,
    modulePaths: []
  };
  if (config.modulePaths) {
    config.modulePaths.forEach(function(configModulePath, index) {
      var modulePath = {
        type: configModulePath.type || 'modulePath' + index,
        basePath: processModuleBasePath(searchConfig.parentDir, configModulePath.basePath || '.'),
        fileSuffix: configModulePath.fileSuffix || '',
        requirePattern: processRequirePattern(configModulePath.requirePattern),
        requirePatternGroup: configModulePath.requirePatternGroup
      };
      searchConfig.modulePaths.push(modulePath);
    });
  }
  return searchConfig;
}

function processRequirePattern(configRequirePattern) {
  var requirePattern;
  if (configRequirePattern) {
    requirePattern =
      configRequirePattern instanceof RegExp
        ? configRequirePattern
        : new RegExp(configRequirePattern.replace('.', '\\.').replace('*', '.*'));
  }
  return requirePattern;
}

function processModuleBasePath(configParentDir, configModuleBasePath) {
  return searchUtils.isAbsolutePath(configModuleBasePath)
    ? configModuleBasePath
    : configParentDir + '/' + configModuleBasePath;
}

module.exports = {
  processConfig: processConfig
};
