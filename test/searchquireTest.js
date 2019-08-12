'use strict'

var sinon = require('sinon');
var assert = require('chai').assert;
var searchquire = require('..');

describe('Searchquire tests', function () {
  describe('Simple example case', function () {

    it('foo is resolved using basePath', function () {
      var foo = searchquire('foo', {
        basePath: './simple-example/samples'
      });

      assert.isDefined(foo);
    });

    it('foo is resolved using mocks folders with file suffix', function () {
      var foo = searchquire('foo', {
        basePath: './simple-example/samples',
        modulePaths: [{
          type: 'mock',
          basePath: './simple-example/mocks',
          fileSuffix: 'Mock.js'
        }]
      });

      assert.isDefined(foo);
      assert.equal(foo.bigBar(), 'BARMOCK');
      assert.equal(foo.bigRab(), 'RABMOCK');
      assert.equal(foo.bigBas('bas'), 'BAS');
    });

  });
});
