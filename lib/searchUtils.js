'use strict';

function isFunction(obj) {
  return obj && {}.toString.call(obj) === '[object Function]';
}

module.exports = {
  isFunction: isFunction
};
