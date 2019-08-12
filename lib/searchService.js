'use strict';

var path = require('path');
var proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

var searchUtils = require('./searchUtils');
var log = require('./logUtils');

var REQUIRE_REGEX = /require\(('|")(.*)('|")\)/;
var REQUIRE_REGEX_GROUP = 2;

function processModule(parentModule, request, config) {
  var searchConfig = processConfig(parentModule, config);
  return processRequestModule(request, searchConfig);
}

function processConfig(parentModule, config) {
  var searchConfig = Object.assign({ modulePaths: [] }, config);
  searchConfig.basePath = config.basePath || '.';
  searchConfig.parentDir = path.dirname(parentModule.filename);
  return searchConfig;
}

function processRequestModule(request, searchConfig) {
  var resolvedRequest;
  var requestPath = searchRequestPath(request, searchConfig);
  if (requestPath) {
    var resolvedModules = processRequestRequiredModules(requestPath, searchConfig);
    resolvedRequest = proxyquire(requestPath, resolvedModules);
  } else {
    resolvedRequest = require(request);
  }
  return resolvedRequest;
}

function searchRequestPath(request, searchConfig) {
  return searchUtils.resolveModule(searchConfig.basePath + '/' + request, searchConfig.parentDir);
}

function processRequestRequiredModules(requestPath, searchConfig) {
  var resolvedModules = {};
  log.debug('Processing request: ' + requestPath);
  var requiredModules = searchRequiredModules(requestPath, searchConfig);
  requiredModules.forEach(requiredModule => {
    log.debug('Processing request required module: ' + JSON.stringify(requiredModule, undefined, 2));
    resolvedModules[requiredModule.definition] = processRequestModule(requiredModule.path, searchConfig);
  });
  return resolvedModules;
}

function searchRequiredModules(requestPath, searchConfig) {
  var requiredModules = [];
  var requireMatches = searchUtils.findMatchesInFile(requestPath, REQUIRE_REGEX, REQUIRE_REGEX_GROUP);
  requireMatches.forEach(function(requireMatch) {
    log.debug('Searching required module: ' + requireMatch);
    var resolvedRequiredModule = resolveRequiredModule(requestPath, requireMatch, searchConfig);
    if (resolvedRequiredModule) {
      requiredModules.push(resolvedRequiredModule);
    }
  });
  return requiredModules;
}

function resolveRequiredModule(requestPath, requirePath, searchConfig) {
  var resolvedRequiredModule;
  var length = searchConfig.modulePaths.length;
  for (var i = 0; i < length; i++) {
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
    resolvedRequiredModule = {
      definition: requirePath,
      type: 'default',
      path: requirePath
    };
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
