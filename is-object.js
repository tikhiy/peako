'use strict';

var isObjectLike = require( './is-object-like' );

var toString = {}.toString;

module.exports = function isObject ( value ) {
  return isObjectLike( value ) && toString.call( value ) === '[object Object]';
};
