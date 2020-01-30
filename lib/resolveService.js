'use strict';

var configService = require('./configService');
var searchUtils = require('./searchUtils');
var log = require('./logger');

var FULL_MATCH = 0;
var FIRST_GROUP = 1;

/**
 * Resolves a required module using searchConfig configuration
 *
 * @param {string} requestPath
 * @param {string} requirePath
 * @param {object} searchConfig
 */
function resolveRequiredModule(requestPath, requirePath, searchConfig) {
  if (log.isDebug()) {
    log.debug('    ResolveRequiredModule: start requirePath ' + requirePath + ' from requestPath ' + requestPath);
  }
  var resolvedRequiredModule;
  var modulePathsLength = searchConfig.modulePaths.length;
  for (var i = 0; i < modulePathsLength; i++) {
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
      type: configService.MODULE_DEFAULT_TYPE,
      path: isRelativePath(requirePath) ? getAbsolutePathRelativeToCurrentRequest(requirePath, requestPath) : requirePath
    };
  }
  if (log.isDebug()) {
    log.debug(
      '    ResolveRequiredModule: resolved requirePath ' +
        requirePath +
        ' from requestPath ' +
        requestPath +
        ' with ' +
        resolvedRequiredModule.path
    );
  }
  return resolvedRequiredModule;
}

function getResolvedModulePath(requestPath, requirePath, configModulePath, searchConfig) {
  var resolvedModulePath;
  var processedRequirePath = processRequirePath(requirePath, configModulePath);
  if (processedRequirePath) {
    resolvedModulePath = searchUtils.resolveModule(
      ensureRelativePath(processedRequirePath) + configModulePath.fileSuffix,
      configModulePath.basePath,
      true
    );
  }
  return resolvedModulePath;
}

function processRequirePath(requirePath, configModulePath) {
  var processedRequirePath;
  if (configModulePath.pattern) {
    var match = configModulePath.pattern.exec(requirePath);
    if (match && match.length > 0) {
      if (configModulePath.patternAlias) {
        var fullPath = match[0];
        var pathAlias = match[configModulePath.patternGroup || 1];
        processedRequirePath = fullPath.replace(pathAlias, configModulePath.patternAlias);
      } else {
        var defaultPatternGroup = match.length > 1 ? FIRST_GROUP : FULL_MATCH;
        processedRequirePath = match[configModulePath.patternGroup || defaultPatternGroup];
      }
    }
  } else {
    processedRequirePath = requirePath;
  }
  return processedRequirePath;
}

function ensureRelativePath(path) {
  return isRelativePath(path) ? path : './' + path;
}

function isRelativePath(path) {
  return /^\.{1,2}[\\\/]/.test(path);
}

function getAbsolutePathRelativeToCurrentRequest(requirePath, requestPath) {
  var pathSeparator = requestPath.indexOf('\\') >= 0 ? '\\' : '/';
  return requestPath.substring(0, requestPath.lastIndexOf(pathSeparator) + 1) + requirePath;
}

module.exports = {
  resolveRequiredModule: resolveRequiredModule,
  processRequirePath: processRequirePath
};
