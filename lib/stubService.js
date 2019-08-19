'use strict';

/**
 * Search a required module using searchConfig moduleStubs configuration
 *
 * @param {string} requestStub
 * @param {object} searchConfig
 */
function searchModuleStub(requestStub, searchConfig) {
  var resolvedModuleStub;
  if (searchConfig.moduleStubs) {
    var moduleStubsLength = searchConfig.moduleStubs.length;
    for (var i = 0; i < moduleStubsLength; i++) {
      var configModuleStub = searchConfig.moduleStubs[i];
      var resolvedModuleStub = getResolvedModuleStub(requestStub, configModuleStub);
      if (resolvedModuleStub) {
        break;
      }
    }
  }
  return resolvedModuleStub;
}

function getResolvedModuleStub(requireStub, configModuleStub) {
  var resolvedModuleStub;
  if (configModuleStub.pattern && configModuleStub.pattern.test(requireStub)) {
    resolvedModuleStub = configModuleStub.stub;
  }
  return resolvedModuleStub;
}

module.exports = {
  searchModuleStub: searchModuleStub
};
