'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;
var searchquire = require('..');

describe('Searchquire tests', function() {
  describe('Simple example case', function() {
    it('bar is resolved using basePath', function() {
      var bar = searchquire('bar', {
        basePath: './simple-example/samples'
      });

      assert.isDefined(bar);
      assert.equal(bar.bar(), 'bar');
      assert.equal(bar.rab(), 'rab');
    });

    it('foo is resolved using mocks folders with file suffix', function() {
      var foo = searchquire('foo', {
        basePath: './simple-example/samples',
        modulePaths: [
          {
            type: 'mock',
            basePath: './simple-example/mocks',
            fileSuffix: 'Mock.js'
          }
        ]
      });

      assert.isDefined(foo);
      assert.equal(foo.bigBar(), 'BARMOCK');
      assert.equal(foo.bigRab(), 'RABMOCK');
      assert.equal(foo.bigBas('bas'), 'BAS');
    });

    it('foo is resolved using mocks folders with file suffix and a string require pattern.', function() {
      var foo = searchquire('foo', {
        basePath: './simple-example/samples',
        modulePaths: [
          {
            type: 'mock',
            basePath: './simple-example/mocks',
            fileSuffix: 'Mock',
            requirePattern: './*'
          }
        ]
      });

      assert.isDefined(foo);
      assert.equal(foo.bigBar(), 'BARMOCK');
      assert.equal(foo.bigRab(), 'RABMOCK');
      assert.equal(foo.bigBas('bas'), 'BAS');
    });

    it('foo is resolved using config stubs', function() {
      var foo = searchquire('foo', {
        basePath: './simple-example/samples',
        moduleStubs: [
          {
            type: 'pathStub',
            requirePattern: 'path',
            stub: {
              basename: function() {
                return 'BASSTUB';
              }
            }
          }
        ]
      });

      assert.isDefined(foo);
      assert.equal(foo.bigBar(), 'BAR');
      assert.equal(foo.bigRab(), 'RAB');
      assert.equal(foo.bigBas('bas'), 'BASSTUB');
    });
  });

  describe('SFRA example case', function() {
    var dwApiMockConfig = {
      basePath: './sfra-example/mocks/dw-api-mock'
    };
    var cartridgeScriptConfig = {
      basePath: './sfra-example/project/cartridges/storefront/cartridge',
      modulePaths: [
        {
          type: 'storefront-mock',
          basePath: './sfra-example/mocks/storefront-mock',
          fileSuffix: 'Mock',
          requirePattern: /^\*\/cartridge\/(.*)/,
          requirePatternGroup: 1
        },
        {
          type: 'dw-mock',
          basePath: './sfra-example/mocks/dw-api-mock',
          requirePattern: 'dw/*'
        }
      ]
    };

    it('orderHelpers is resolved using mocks folders with file suffix and require patterns', function() {
      var CustomerMock = searchquire('dw/customer/Customer', dwApiMockConfig);
      var orderHelpersTest = searchquire('scripts/order/orderHelpers', cartridgeScriptConfig);

      var customer = new CustomerMock();

      var orders = orderHelpersTest.getOrders(customer);

      assert.isDefined(orders);
    });
  });
});
