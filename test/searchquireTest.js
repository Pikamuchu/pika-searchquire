'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;
var searchquire = require('..');

describe('Searchquire tests', function() {
  describe('Simple example case', function() {
    var bar = searchquire('bar', {
      basePath: './simple-example/samples'
    });

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

    it('bar is resolved using basePath', function() {
      assert.isDefined(bar);
      assert.equal(bar.bar(), 'bar');
      assert.equal(bar.rab(), 'rab');
    });

    it('foo is resolved using mocks folders with file suffix', function() {
      assert.isDefined(foo);
      assert.equal(foo.bigBar(), 'BARMOCK');
      assert.equal(foo.bigRab(), 'RABMOCK');
      assert.equal(foo.bigBas('bas'), 'BAS');
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

    var customerMock = searchquire('dw/customer/Customer', dwApiMockConfig);
    var orderHelpersTest = searchquire('scripts/order/orderHelpers', cartridgeScriptConfig);

    it('orderHelpers is resolved using mocks folders with file suffix and require patterns', function() {
      var customer = new customerMock();

      var orders = orderHelpersTest.getOrders(customer);

      assert.isDefined(orders);
    });
  });
});
