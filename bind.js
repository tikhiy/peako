'use strict';

var _ArgumentException = require( './internal/ArgumentException' );

var placeholder        = require( './placeholder' );
var constants          = require( './constants' );
var indexOf            = require( './index-of' );

// Function::bind() polyfill.

var _bind = Function.prototype.bind || function bind ( c ) {
  var f = this;
  var a;

  if ( arguments.length <= 2 ) {
    return function bound () {
      return f.apply( c, arguments );
    };
  }

  a = Array.prototype.slice.call( arguments, 1 );

  return function bound () {
    return f.apply( c, a.concat( Array.prototype.slice.call( arguments ) ) );
  };
};

/**
 * @private
 * @param {Array} p The partial arguments.
 * @param {Array} a The arguments.
 * @returns {Array} A processed arguments.
 */
function process ( p, a ) {
  var r = [];
  var j = -1;
  var i;
  var l;

  for ( i = 0, l = p.length; i < l; ++i ) {
    if ( p[ i ] === placeholder || p[ i ] === constants.PLACEHOLDER ) {
      r.push( a[ ++j ] );
    } else {
      r.push( p[ i ] );
    }
  }

  for ( l = a.length; j < l; ++j ) {
    r.push( a[ i ] );
  }

  return r;
}

/**
 * @param  {function} f The target function that should be bound.
 * @param  {*}        c The new context for the target function.
 * @param  {...*}     p The partial arguments, may contain _.placeholder.
 * @return {function}
 * @example
 * var _    = require( 'peako/placeholder' );
 * var bind = require( 'peako/bind' );

 * function weirdFunction ( x, y ) {
 *   return this[ x ] + this[ y ];
 * }
 *
 * var context = {
 *   x: 42,
 *   y: 1
 * };
 *
 * var boundFunction = bind( weirdFunction, context, _, 'y' );
 *
 * boundFunction( 'x' ); // -> 43
 */
module.exports = function bind ( f, c ) {
  var p;

  if ( typeof f !== 'function' ) {
    throw _ArgumentException( f, 'a function' );
  }

  // no partial arguments were provided

  if ( arguments.length <= 2 ) {
    return _bind.call( f, c );
  }

  p = Array.prototype.slice.call( arguments, 2 );

  // no placeholders in the partial arguments

  if ( indexOf( p, placeholder ) < 0 && indexOf( p, constants.PLACEHOLDER ) < 0 ) {
    return Function.prototype.call.apply( _bind, arguments );
  }

  return function bound () {
    return f.apply( c, process( p, arguments ) );
  };
};
