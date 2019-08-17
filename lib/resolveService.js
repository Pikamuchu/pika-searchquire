'use strict';

var searchUtils = require('./searchUtils');
var log = require('./logUtils');

/**
 * Resolves a required module using searchConfig configuration
 *
 * @param {string} requestPath
 * @param {string} requirePath
 * @param {object} searchConfig
 */
function resolveRequiredModule(requestPath, requirePath, searchConfig) {
  log.debug('    ResolveRequiredModule: start requirePath ' + requirePath + ' from requestPath ' + requestPath);
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
  log.debug(
    '    ResolveRequiredModule: resolved requirePath ' +
      requirePath +
      ' from requestPath ' +
      requestPath +
      ' with ' +
      resolvedRequiredModule.path
  );
  return resolvedRequiredModule;
}

function getResolvedModulePath(requestPath, requirePath, configModulePath, searchConfig) {
  var resolvedModulePath;
  var processedRequirePath = processRequirePath(configModulePath, requirePath);
  if (processedRequirePath) {
    resolvedModulePath = searchUtils.resolveModule(
      ensureRelativePath(processedRequirePath) + configModulePath.fileSuffix,
      configModulePath.basePath,
      true
    );
  }
  return resolvedModulePath;
}

function processRequirePath(configModulePath, requirePath) {
  var processedRequirePath;
  if (configModulePath.requirePattern) {
    var match = configModulePath.requirePattern.exec(requirePath);
    if (match && match.length > 0) {
      processedRequirePath = match[configModulePath.requirePatternGroup || 0];
    }
  } else {
    processedRequirePath = requirePath;
  }
  return processedRequirePath;
}

function ensureRelativePath(path) {
  return /^\.{1,2}[\\\/]/.test(path) ? path : './' + path;
}

module.exports = {
  resolveRequiredModule: resolveRequiredModule
};
