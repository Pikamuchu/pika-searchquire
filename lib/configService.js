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

  processConfigBaseModulePath(config, searchConfig);

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
        pattern: processPattern(configModulePath.pattern),
        patternGroup: configModulePath.patternGroup
      };
      searchConfig.modulePaths.push(modulePath);
    });
  }
}

function processConfigBaseModulePath(config, searchConfig) {
  if (config.baseModulePaths) {
    config.baseModulePaths.forEach(function (configBaseModulePath) {
      var baseModulePath = {
        type: DEFAULT_TYPE,
        basePath: processModuleBasePath(searchConfig.parentDir, searchConfig.basePath || '.'),
        fileSuffix: configBaseModulePath.fileSuffix || '',
        pattern: processPattern(configBaseModulePath.pattern),
        patternGroup: configBaseModulePath.patternGroup
      };
      searchConfig.modulePaths.push(baseModulePath);
    });
  }
}

function processConfigModuleStubs(config, searchConfig) {
  if (config.moduleStubs) {
    if (Array.isArray(config.moduleStubs)) {
      config.moduleStubs.forEach(function (configModuleStub, index) {
        var moduleStub = {
          type: configModuleStub.type || ('moduleStub' + index),
          stub: configModuleStub.stub || searchConfig.moduleNotFoundResolution,
          pattern: processPattern(configModuleStub.pattern),
        };
        searchConfig.moduleStubs.push(moduleStub);
      });
    } else {
      Object.keys(config.moduleStubs).forEach(function(stubPattern, index) {
        var moduleStub = {
          type: ('moduleStub' + index),
          stub: config.moduleStubs[stubPattern] || searchConfig.moduleNotFoundResolution,
          pattern: processPattern(stubPattern),
        };
        searchConfig.moduleStubs.push(moduleStub);
    });
    }
  }
}

function processPattern(configModulePattern) {
  var pattern;
  if (configModulePattern) {
    pattern =
    configModulePattern instanceof RegExp
        ? configModulePattern
        : new RegExp(configModulePattern.replace('.', '\\.').replace('*', '.*'));
  }
  return pattern;
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
