'use strict';

var toObject = require( './to-object' );
var iterable = require( './iterable' );

module.exports = function sample ( array ) {
  array = iterable( toObject( array ) );
  return array[ Math.floor( Math.random() * array.length ) ];
};
