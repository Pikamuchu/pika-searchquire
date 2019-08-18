'use strict';

var proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

var configService = require('./configService');
var resolveService = require('./resolveService');
var stubService = require('./stubService');
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
  return processRequestModule(request, searchConfig, configService.DEFAULT_TYPE, 0);
}

function processRequestModule(request, searchConfig, type, iteration) {
  if (iteration > searchConfig.maxSearchModuleIterations) {
    log.warn(
      'Max search module iterations (maxSearchModuleIterations) reached ' +
        iteration +
        '. Module not found resolution (moduleNotFoundResolution) returned.'
    );
    return searchConfig.moduleNotFoundResolution;
  }

  log.info('ProcessRequestModule(' + iteration + '): start request ' + request + ' type ' + type);

  var resolvedRequest = processRequestUsingStubs(request, searchConfig, type, iteration);

  if (!resolvedRequest) {
    resolvedRequest = processRequestUsingProxyquire(request, searchConfig, type, iteration);
  }

  if (!resolvedRequest) {
    resolvedRequest = processRequestUsingRequire(request, searchConfig, iteration);
  }

  return resolvedRequest;
}

function processRequestUsingStubs(request, searchConfig, type, iteration) {
  var resolvedRequest = stubService.searchModuleStub(request, searchConfig);
  if (resolvedRequest) {
    log.info('ProcessRequestModule(' + iteration + '): resolved request ' + request + ' with config module stub.');
  }
  return resolvedRequest;
}

function processRequestUsingProxyquire(request, searchConfig, type, iteration) {
  var resolvedRequest;
  var requestPath;
  if (type === configService.DEFAULT_TYPE) {
    requestPath = searchRequestPath(request, searchConfig);
  }
  if (requestPath) {
    var resolvedModules = processRequestRequiredModules(requestPath, searchConfig, iteration + 1);
    resolvedRequest = proxyquire(requestPath, resolvedModules);
    log.info(
      'ProcessRequestModule(' +
        iteration +
        '): resolved request ' +
        request +
        ' with proxyquire requestPath ' +
        requestPath
    );
  }
  return resolvedRequest;
}

function processRequestUsingRequire(request, searchConfig, iteration) {
  var resolvedRequest;
  try {
    resolvedRequest = require(request);
    log.info(
      'ProcessRequestModule(' + iteration + '): resolved request ' + request + ' with require request ' + request
    );
  } catch (err) {
    if (searchConfig.ignoreModuleNotFoundErrors) {
      log.warn('Module ' + request + ' not found. Module not found resolution (moduleNotFoundResolution) returned.');
      resolvedRequest = searchConfig.moduleNotFoundResolution;
    } else {
      throw err;
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

function processRequestRequiredModules(requestPath, searchConfig, iteration) {
  var resolvedModules = {};
  var requiredModules = searchRequiredModules(requestPath, searchConfig);
  requiredModules.forEach(requiredModule => {
    resolvedModules[requiredModule.definition] = processRequestModule(
      requiredModule.path,
      searchConfig,
      requiredModule.type,
      iteration
    );
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
