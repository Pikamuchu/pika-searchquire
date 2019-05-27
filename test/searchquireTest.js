'use strict'

var sinon = require('sinon');
var assert = require('chai').assert;
var searchquire = require('..');

describe('Searchquire tests', function () {
  describe('Resolving foo', function () {

    it('foo is resolved using basePath', function () {
      var foo = searchquire('foo', {
        basePath: './samples'
      });

      assert.isDefined(foo);
    });

    it('foo is resolved using mocks', function () {
      var foo = searchquire('foo', {
        basePath: './samples',
        modulePaths: [{
          basePath: './mocks',
          fileSufix: 'Mock'
        }]
      });

      assert.isDefined(foo);
    });

  });
});
