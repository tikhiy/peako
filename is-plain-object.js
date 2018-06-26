'use strict';

var isObject       = require( './is-object' ),
    getPrototypeOf = require( './get-prototype-of' );

var hasOwnProperty = {}.hasOwnProperty,
    fnToString = hasOwnProperty.toString;

var fnObject = fnToString.call( Object );

module.exports = function isPlainObject ( value ) {
  var prototype;

  if ( ! isObject( value ) ) {
    return false;
  }

  prototype = getPrototypeOf( value );

  return prototype === null ||
    hasOwnProperty.call( prototype, 'constructor' ) &&
    fnToString.call( prototype.constructor ) === fnObject;
};
