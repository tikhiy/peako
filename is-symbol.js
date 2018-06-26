'use strict';

var isObjectLike = require( './is-object-like' );

var toString = {}.toString;

module.exports = function isSymbol ( value ) {
  // disable "Invalid typeof value 'symbol' (W122)" (esversion: 3)
  // jshint -W122
  return typeof value === 'symbol' ||
  // jshint +W122
    isObjectLike( value ) &&
    toString.call( value ) === '[object Symbol]';
};
