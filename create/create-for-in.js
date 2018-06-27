'use strict';

var toObject  = require( '../to-object' ),
    baseForIn = require( '../base/base-for-in' );

module.exports = function createForIn ( getKeys, fromRight ) {
  return function ( obj, fun, ctx ) {
    return baseForIn( obj = toObject( obj ), fun, ctx, getKeys( obj ), fromRight );
  };
};
