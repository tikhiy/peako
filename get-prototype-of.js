'use strict';

var getType = require( './type' ),
    ERR     = require( './constants' ).ERR;

module.exports = Object.getPrototypeOf || function getPrototypeOf ( obj ) {
  var prototype;

  if ( obj == null ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  // jshint proto: true
  prototype = obj.__proto__;
  // jshint proto: false

  if ( prototype !== undefined ) {
    return prototype;
  }

  if ( getType( obj.constructor ) === 'function' ) {
    return obj.constructor.prototype;
  }

  return obj;
};
