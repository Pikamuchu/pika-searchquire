'use strict';

var path = require('path');
var proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

var searchUtils = require('./searchUtils');
var log = require('./logUtils');

var REQUIRE_REGEX = /require\(('|")(.*)('|")\)/;
var REQUIRE_REGEX_GROUP = 2;

function processConfig(parentModule, config) {
  var searchConfig = Object.assign({ modulePaths: [], moduleMocks: [] }, config);
  searchConfig.basePath = config.basePath || '.';
  searchConfig.parentDir = path.dirname(parentModule.filename);
  return searchConfig;
}

function processModule(parentModule, request, config) {
  var resolvedModules = {};
  var searchConfig = processConfig(parentModule, config);
  var requestPath = searchRequestPath(request, searchConfig);
  var requiredModules = searchRequiredModules(requestPath, searchConfig);
  requiredModules.forEach(requiredModule => {
    resolvedModules[requiredModule.definition] = require(searchUtils.resolveModule(
      requiredModule.path,
      searchConfig.parentDir
    ));
  });
  return proxyquire(requestPath, resolvedModules);
}

function searchRequestPath(request, searchConfig) {
  return searchUtils.resolveModule(searchConfig.basePath + '/' + request, searchConfig.parentDir);
}

function searchRequiredModules(requestPath, searchConfig) {
  var requiredModules = [];
  var requireMatches = searchUtils.findMatchesInFile(requestPath, REQUIRE_REGEX, REQUIRE_REGEX_GROUP);
  requireMatches.forEach(function(requireMatch) {
    var resolvedRequiredModule = resolveRequiredModule(requestPath, requireMatch, searchConfig);
    if (resolvedRequiredModule) {
      requiredModules.push(resolvedRequiredModule);
    }
  });
  return requiredModules;
}

function resolveRequiredModule(requestPath, requirePath, searchConfig) {
  var resolvedRequiredModule;
  var length = searchConfig.modulePaths.length,
    i;
  for (i = 0; i < length; i++) {
    var configModulePath = searchConfig.modulePaths[i];
    var resolvedModulePath = getResolvedModulePath(requestPath, requirePath, configModulePath, searchConfig);
    if (resolvedModulePath) {
      resolvedRequiredModule = {
        definition: requirePath,
        type: configModulePath.type,
        path: resolvedModulePath
      };
      break;
    }
  }
  if (!resolvedRequiredModule) {
    var defaultResolvedModulePath = searchUtils.resolveModule(
      requirePath,
      path.dirname(requestPath)
    );
    if (defaultResolvedModulePath) {
      resolvedRequiredModule = {
        definition: requirePath,
        type: 'default',
        path: defaultResolvedModulePath
      };
    }
  }
  return resolvedRequiredModule;
}

function getResolvedModulePath(requestPath, requirePath, configModulePath, searchConfig) {
  return searchUtils.resolveModule(
    requirePath + configModulePath.fileSuffix,
    searchConfig.parentDir + cleanPath(configModulePath.basePath)
  );
}

function cleanPath(str) {
  return str.replace(/\.[\/\\]/, '/');
}

module.exports = {
  processConfig: processConfig,
  processModule: processModule
};
