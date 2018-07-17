'use strict';

var before = require( './before' );

module.exports = function once ( target ) {
  return before( 1, target );
};
