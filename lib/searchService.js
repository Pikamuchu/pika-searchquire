'use strict';

var proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

var configService = require('./configService');
var resolveService = require('./resolveService');
var searchUtils = require('./searchUtils');
var log = require('./logUtils');

var REQUIRE_REGEX = /require\(('|")(.*)('|")\)/;
var REQUIRE_REGEX_GROUP = 2;

/**
 * Resolve request module using config parametrizations.
 *
 * @param {object} parentModule - module.parent instance to use
 * @param {string} request - request path to process
 * @param {object} config - configuration to use
 */
function processModule(parentModule, request, config) {
  var searchConfig = configService.processConfig(parentModule, config);
  return processRequestModule(request, searchConfig, true);
}

function processRequestModule(request, searchConfig) {
  log.debug('ProcessRequestModule: start request ' + request);
  var resolvedRequest;
  var requestPath = searchRequestPath(request, searchConfig);
  if (requestPath) {
    var resolvedModules = processRequestRequiredModules(requestPath, searchConfig);
    log.debug('ProcessRequestModule: resolved request ' + request + ' with proxyquire requestPath ' + requestPath);
    resolvedRequest = proxyquire(requestPath, resolvedModules);
  } else {
    log.debug('ProcessRequestModule: resolved request ' + request + ' with require request ' + request);
    try {
      resolvedRequest = require(request);
    } catch (err) {
      if (searchConfig.ignoreModuleNotFoundErrors) {
        log.warn('Module ' + request + ' not found.');
        resolvedRequest = {};
      } else {
        throw err
      }
    }
  }
  return resolvedRequest;
}

function searchRequestPath(request, searchConfig) {
  var requestPath;
  if (searchUtils.isAbsolutePath(request)) {
    requestPath = searchUtils.resolveModule(request);
  } else {
    requestPath = searchUtils.resolveModule(searchConfig.basePath + '/' + request, searchConfig.parentDir);
  }
  return requestPath;
}

function processRequestRequiredModules(requestPath, searchConfig) {
  var resolvedModules = {};
  var requiredModules = searchRequiredModules(requestPath, searchConfig);
  requiredModules.forEach(requiredModule => {
    resolvedModules[requiredModule.definition] = processRequestModule(requiredModule.path, searchConfig);
  });
  return resolvedModules;
}

function searchRequiredModules(requestPath, searchConfig) {
  var requiredModules = [];
  var requireMatches = searchUtils.findMatchesInFile(requestPath, REQUIRE_REGEX, REQUIRE_REGEX_GROUP);
  requireMatches.forEach(function(requireMatch) {
    log.debug('  Searching required module: ' + requireMatch);
    var resolvedRequiredModule = resolveService.resolveRequiredModule(requestPath, requireMatch, searchConfig);
    if (resolvedRequiredModule) {
      requiredModules.push(resolvedRequiredModule);
    }
  });
  return requiredModules;
}

module.exports = {
  processModule: processModule
};
