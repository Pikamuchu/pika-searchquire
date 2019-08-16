var _super = require('./LineItemCtnr');

var Order = function() {};

Order.prototype = new _super();

Order.prototype.getOrderNo = function() {};
Order.prototype.getStatus = function() {};
Order.prototype.setStatus = function() {};
Order.prototype.status = 'OPEN';
Order.prototype.orderNo = '12345678';

module.exports = Order;
