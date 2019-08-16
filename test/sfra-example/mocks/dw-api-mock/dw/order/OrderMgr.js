var Iterator = require('../util/Iterator');
var Order = require('./Order');

var OrderMgr = function() {};

OrderMgr.searchOrders = function() {
  return new Iterator([new Order()]);
};

module.exports = OrderMgr;
