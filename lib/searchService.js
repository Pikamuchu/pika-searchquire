'use strict';

const Module = require('module');
const path = require('path');
const resolve = require('resolve');
const proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

function processConfig(parentModule, config) {
  config.parentPath = path.dirname(parentModule.filename);
  return config;
}

function processModule(request, config) {
  var resolvedModules = {};
  var requestPath = searchRequestPath(request, config);
  var requiredModules = searchRequiredModules(request, config);
  requiredModules.forEach(requiredModule => {
    resolvedModules[requiredModule.definition] = resolveModule(requiredModule.definition, config.parentPath);
  });
  return proxyquire(requestPath, resolvedModules);
}

function searchRequestPath(request, config) {
  return resolveModule(config.basePath + "/" + request, config.parentPath);
}

function searchRequiredModules(request, config) {
  const requiredModules = [];
  //resolveModule(requiredModule.definition, config.basePath);
  return requiredModules;
}

function resolveModule(requestPath, basePath) {
  try {
    return resolve.sync(requestPath, {
      basedir: basePath,
      extensions: Object.keys(require.extensions),
      paths: Module.globalPaths
    });
  } catch (err) {
    // Trying to resolve using path
    // Module._resolveFilename(request, this._parent);
    return path.resolve(path.dirname(basePath), requestPath);
  }
}

module.exports = {
  processConfig: processConfig,
  processModule: processModule
};
