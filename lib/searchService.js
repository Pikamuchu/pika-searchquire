'use strict';

var proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

var configService = require('./configService');
var resolveService = require('./resolveService');
var stubService = require('./stubService');
var babelRegisterService = require('./babelRegisterService');
var searchUtils = require('./searchUtils');
var log = require('./logger');

var REQUIRE_STRING = 'require';
var REQUIRE_REGEX = /require\s*\(['"`]([^`"']+?)[`'"]\)/;
var REQUIRE_REGEX_GROUP = 1;

var IMPORT_STRING = 'import';
var IMPORT_REGEX = /import\s+.+\s+from\s+['"`]([^`"']+?)['"`]/;
var IMPORT_REGEX_GROUP = 1;

/**
 * Resolve request module using config parametrizations.
 *
 * @param {object} parentModule - module.parent instance to use
 * @param {string} request - request path to process
 * @param {object} config - configuration to use
 * @param {object} stubs - (optional) additional stubs to use
 */
function processModule(parentModule, request, config, stubs) {
  log.setupLog(config.logLevel, config.logElapseTime);
  var searchConfig = configService.processConfig(parentModule, config, stubs);
  var processRequest = resolveService.processRequirePath(request, searchConfig) || request;

  var babelRegister;
  if (searchConfig.useBabelRegister) {
    babelRegister = babelRegisterService.setupRegister(searchConfig.babelRegisterConfig);
  }

  logProcessModule(request, processRequest, searchConfig);
  var processedModule = processRequestModule(processRequest, searchConfig, configService.MODULE_DEFAULT_TYPE, 0);

  if (searchConfig.useBabelRegister && babelRegister) {
    babelRegisterService.revertRegister(babelRegister)
  }

  return processedModule;
}

function processRequestModule(request, searchConfig, type, iteration, definition) {
  if (iteration > searchConfig.maxSearchModuleIterations) {
    log.warn(
      'Max search module iterations (maxSearchModuleIterations) reached ' +
        iteration +
        '. Module not found resolution (moduleNotFoundResolution) returned.'
    );
    return searchConfig.moduleNotFoundResolution;
  }

  if (log.isDebug()) {
    log.debug('ProcessRequestModule(' + iteration + '): start request ' + request + ' type ' + type);
  }

  var resolvedRequest = processRequestUsingStubs(request, searchConfig, iteration, definition);

  if (!resolvedRequest) {
    resolvedRequest = processRequestUsingProxyquire(request, searchConfig, type, iteration, definition);
  }

  if (!resolvedRequest) {
    resolvedRequest = processRequestUsingRequire(request, searchConfig, iteration, definition);
    addResolvedRequestToStubs(resolvedRequest, request, definition, searchConfig);
  }

  return resolvedRequest;
}

function processRequestUsingStubs(request, searchConfig, iteration, definition) {
  var requestDefinition = definition || request;
  var resolvedRequest = stubService.searchModuleStub(requestDefinition, searchConfig);
  logProcessRequestUsingStubs(resolvedRequest, iteration, requestDefinition);
  return resolvedRequest;
}

function processRequestUsingProxyquire(request, searchConfig, type, iteration, definition) {
  var resolvedRequest;
  var requestPath;
  if (type === configService.MODULE_DEFAULT_TYPE) {
    requestPath = searchRequestPath(request, searchConfig);
  }
  if (requestPath) {
    var resolvedModules = processRequestRequiredModules(requestPath, searchConfig, iteration + 1);
    if (searchConfig.useBabelRegister) {
      // Forcing dependency compilation outside proxyquire for better performance
      require(requestPath);
    }
    resolvedRequest = proxyquire(requestPath, resolvedModules);
    logProcessRequestUsingProxyquire(iteration, definition, request, requestPath);
  }
  return resolvedRequest;
}

function processRequestUsingRequire(request, searchConfig, iteration, definition) {
  var resolvedRequest;
  try {
    resolvedRequest = require(request);
    logProcessRequestUsingRequire(iteration, definition, request);
  } catch (err) {
    if (searchConfig.ignoreModuleNotFoundErrors) {
      log.warn('Module ' + request + ' not found. Module not found resolution (moduleNotFoundResolution) returned. ' + err);
      resolvedRequest = searchConfig.moduleNotFoundResolution;
    } else {
      throw err;
    }
  }
  return resolvedRequest;
}

function addResolvedRequestToStubs(resolvedRequest, request, definition, searchConfig) {
  var isResolvedStub = request !== definition;
  if (isResolvedStub) {
    var requestDefinition = definition || request;
    stubService.addModuleStub(resolvedRequest, requestDefinition, searchConfig);
  }
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
      iteration,
      requiredModule.definition
    );
  });
  return resolvedModules;
}

function searchRequiredModules(requestPath, searchConfig) {
  var requiredModules = [];
  var requireMatches = searchUtils.findMatchesInFile(requestPath, REQUIRE_STRING, REQUIRE_REGEX, REQUIRE_REGEX_GROUP);
  requireMatches = requireMatches.concat(searchUtils.findMatchesInFile(requestPath, IMPORT_STRING, IMPORT_REGEX, IMPORT_REGEX_GROUP));
  requireMatches.forEach(function(requireMatch) {
    log.debug('  Searching required module: ' + requireMatch);
    var resolvedRequiredModule = resolveService.resolveRequiredModule(requestPath, requireMatch, searchConfig);
    if (resolvedRequiredModule) {
      requiredModules.push(resolvedRequiredModule);
    }
  });
  return requiredModules;
}

function logProcessModule(request, processRequest, searchConfig) {
  if (log.isInfo()) {
    log.info('ProcessModule: resolving request ' + request + ' processRequest ' + processRequest);
  }
  if (log.isDebug()) {
    log.debug('searchConfig: ' + JSON.stringify(searchConfig, undefined, 2));
  }
}

function logProcessRequestUsingStubs(resolvedRequest, iteration, requestDefinition) {
  if (resolvedRequest && log.isInfo()) {
    log.info('ProcessRequestModule(' + iteration + '): ' + requestDefinition + ' resolved with config module stub.');
  }
}

function logProcessRequestUsingProxyquire(iteration, definition, request, requestPath) {
  if (log.isInfo()) {
    log.info('ProcessRequestModule(' + iteration + '): ' + (definition || request) + ' resolved with proxyquire ' + requestPath);
  }
}

function logProcessRequestUsingRequire(iteration, definition, request) {
  if (log.isInfo()) {
    log.info('ProcessRequestModule(' + iteration + '): ' + (definition || request) + ' resolved with require ' + request);
  }
}

module.exports = {
  processModule: processModule
};
