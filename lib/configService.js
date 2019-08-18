'use strict';

var path = require('path');

var searchUtils = require('./searchUtils');
var log = require('./logUtils');

var DEFAULT_TYPE = '__default__';

/**
 * Check config parametrizations.
 *
 * @param {string} parentModule - module.parent instance to use
 * @param {object} config - configuration to check
 */
function processConfig(parentModule, config) {
  var searchConfig = processBaseConfig(config, parentModule);

  processConfigModulePaths(config, searchConfig);

  processBaseConfigModulePath(config, searchConfig);

  processConfigModuleStubs(config, searchConfig);

  return searchConfig;
}

function processBaseConfig(config, parentModule) {
  return {
    basePath: config.basePath || '.',
    parentDir: path.dirname(parentModule.filename),
    ignoreModuleNotFoundErrors: config.ignoreModuleNotFoundErrors || true,
    maxSearchModuleIterations: config.maxSearchModuleIterations || 10,
    moduleNotFoundResolution: config.moduleNotFoundResolution || {},
    modulePaths: [],
    moduleStubs: []
  };
}

function processConfigModulePaths(config, searchConfig) {
  if (config.modulePaths) {
    config.modulePaths.forEach(function (configModulePath, index) {
      var modulePath = {
        type: configModulePath.type || ('modulePath' + index),
        basePath: processModuleBasePath(searchConfig.parentDir, configModulePath.basePath || '.'),
        fileSuffix: configModulePath.fileSuffix || '',
        requirePattern: processRequirePattern(configModulePath.requirePattern),
        requirePatternGroup: configModulePath.requirePatternGroup
      };
      searchConfig.modulePaths.push(modulePath);
    });
  }
}

function processBaseConfigModulePath(config, searchConfig) {
  if (config.requirePattern) {
    searchConfig.modulePaths.push({
      type: DEFAULT_TYPE,
      basePath: processModuleBasePath(searchConfig.parentDir, searchConfig.basePath || '.'),
      fileSuffix: config.fileSuffix || '',
      requirePattern: processRequirePattern(config.requirePattern),
      requirePatternGroup: config.requirePatternGroup
    });
  }
}

function processConfigModuleStubs(config, searchConfig) {
  if (config.moduleStubs) {
    config.moduleStubs.forEach(function (configModuleStub, index) {
      var moduleStub = {
        type: configModuleStub.type || ('moduleStub' + index),
        stub: configModuleStub.stub || searchConfig.moduleNotFoundResolution,
        requirePattern: processRequirePattern(configModuleStub.requirePattern),
      };
      searchConfig.moduleStubs.push(moduleStub);
    });
  }
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
  DEFAULT_TYPE: DEFAULT_TYPE,
  processConfig: processConfig
};
