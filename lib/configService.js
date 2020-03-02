'use strict';

var path = require('path');

var searchUtils = require('./searchUtils');
var log = require('./logger');

var MODULE_DEFAULT_TYPE = 'module-default';
var MODULE_PATH_TYPE = 'module-path';
var MODULE_STUB_TYPE = 'module-stub';
var RESERVED_CONFIG_KEYS = [
  'basePath',
  'parentDir',
  'ignoreModuleNotFoundErrors',
  'maxSearchModuleIterations',
  'moduleNotFoundResolution',
  'modulePaths',
  'moduleStubs',
  'enableBabelRegister',
  'babelRegisterConfig',
];

/**
 * Check config parametrizations.
 *
 * @param {string} parentModule - module.parent instance to use
 * @param {object} config - configuration to check
 */
function processConfig(parentModule, config, stubs) {
  var searchConfig = processBaseConfig(config, parentModule);

  processConfigModulePaths(config, searchConfig);

  processConfigBaseModulePath(config, searchConfig);

  processConfigStubs(config, searchConfig);

  if (stubs) {
    processConfigModuleStubs({moduleStubs: stubs}, searchConfig);
  }

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
    moduleStubs: [],
    enableBabelRegister: config.enableBabelRegister || config.babelRegisterConfig,
    babelRegisterConfig: config.babelRegisterConfig,
  };
}

function processConfigModulePaths(config, searchConfig) {
  if (config.modulePaths) {
    config.modulePaths.forEach(function(configModulePath, index) {
      var modulePath = {
        name: configModulePath.name || MODULE_PATH_TYPE + index,
        type: MODULE_PATH_TYPE,
        basePath: processModuleBasePath(searchConfig.parentDir, configModulePath.basePath || '.'),
        fileSuffix: configModulePath.fileSuffix || '',
        pattern: processPattern(configModulePath.pattern),
        patternGroup: configModulePath.patternGroup,
        patternAlias: configModulePath.patternAlias
      };
      searchConfig.modulePaths.push(modulePath);
    });
  }
}

function processConfigBaseModulePath(config, searchConfig) {
  if (config.pattern) {
    searchConfig.pattern = processPattern(config.pattern);
    searchConfig.patternGroup = config.patternGroup;
    searchConfig.patternAlias = config.patternAlias;
    addConfigBaseModulePath(searchConfig, config);
  }
  if (config.baseModulePaths) {
    config.baseModulePaths.forEach(function(configBaseModulePath) {
      addConfigBaseModulePath(searchConfig, configBaseModulePath);
    });
  }
}

function addConfigBaseModulePath(searchConfig, configBaseModulePath) {
  var baseModulePath = {
    name: 'baseModulePath',
    type: MODULE_DEFAULT_TYPE,
    basePath: processModuleBasePath(searchConfig.parentDir, searchConfig.basePath || '.'),
    fileSuffix: configBaseModulePath.fileSuffix || '',
    pattern: processPattern(configBaseModulePath.pattern),
    patternGroup: configBaseModulePath.patternGroup,
    patternAlias: configBaseModulePath.patternAlias
  };
  searchConfig.modulePaths.push(baseModulePath);
}

function processConfigStubs(config, searchConfig) {
  Object.keys(config).forEach(function (stubId, index) {
    if (RESERVED_CONFIG_KEYS.includes(stubId)) {
      return;
    }
    var moduleStub = {
      name: 'configStub' + index,
      type: MODULE_STUB_TYPE,
      id: stubId,
      stub: config[stubId] || searchConfig.moduleNotFoundResolution,
    };
    searchConfig.moduleStubs.push(moduleStub);
  });
}

function processConfigModuleStubs(config, searchConfig) {
  if (config.moduleStubs) {
    if (Array.isArray(config.moduleStubs)) {
      config.moduleStubs.forEach(function(configModuleStub, index) {
        var moduleStub = {
          name: configModuleStub.name || MODULE_STUB_TYPE + index,
          type: MODULE_STUB_TYPE,
          id: configModuleStub.id,
          stub: configModuleStub.stub || searchConfig.moduleNotFoundResolution,
          pattern: processPattern(configModuleStub.pattern)
        };
        searchConfig.moduleStubs.push(moduleStub);
      });
    } else {
      Object.keys(config.moduleStubs).forEach(function(stubId, index) {
        var moduleStub = {
          name: 'moduleStub' + index,
          type: MODULE_STUB_TYPE,
          id: stubId,
          stub: config.moduleStubs[stubId] || searchConfig.moduleNotFoundResolution,
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
        : new RegExp(
            configModulePattern
              .replace('/*', '/.*')
              .replace('./', '\\.\\/')
              .replace('../', '\\.\\.\\/')
              .replace('*/', '\\*\\/')
          );
  }
  return pattern;
}

function processModuleBasePath(configParentDir, configModuleBasePath) {
  return searchUtils.isAbsolutePath(configModuleBasePath)
    ? configModuleBasePath
    : configParentDir + '/' + configModuleBasePath;
}

module.exports = {
  MODULE_DEFAULT_TYPE: MODULE_DEFAULT_TYPE,
  processConfig: processConfig
};
