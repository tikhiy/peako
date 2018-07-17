'use strict';

var isNumber = require( './is-number' );

module.exports = function isFinite ( value ) {
  return isNumber( value ) && isFinite( value );
};
