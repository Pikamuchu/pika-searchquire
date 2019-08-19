'use strict';

function getCustomerNo(currentCustomer) {
  return currentCustomer.profile.customerNo;
}

module.exports = {
  getCustomerNo: getCustomerNo
};