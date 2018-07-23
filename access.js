'use strict';

var DOMWrapper = require( './DOMWrapper' ),
    type       = require( './type' ),
    keys       = require( './keys' );

var undefined; // jshint ignore: line

function access ( obj, fn, key, val, chainable, ifEmptyVal, raw ) {
  var bulk = key == null;

  var len = obj.length;

  var i, k, l, e;

  if ( type( key ) === 'object' ) {
    for ( i = 0, k = keys( key ), l = k.length; i < l; ++i ) {
      access( obj, fn, k[ i ], key[ k[ i ] ], true, ifEmptyVal, raw );
    }

    chainable = true;
  } else if ( typeof val !== 'undefined' ) {
    if ( typeof val !== 'function' ) {
      raw = true;
    }

    if ( bulk ) {
      if ( raw ) {
        fn.call( obj, val );
        fn = null;
      } else {
        bulk = fn;

        fn = function ( e, key, val ) {
          return bulk.call( new DOMWrapper( e ), val );
        };
      }
    }

    if ( fn ) {
      for ( i = 0; i < len; ++i ) {
        e = obj[ i ];

        if ( raw ) {
          fn( e, key, val, true );
        } else {
          fn( e, key, val.call( e, i, fn( e, key ) ), true );
        }
      }
    }

    chainable = true;
  }

  if ( chainable ) {
    return obj;
  }

  if ( bulk ) {
    return fn.call( obj );
  }

  if ( len ) {
    return fn( obj[ 0 ], key );
  }

  return ifEmptyVal;
}

module.exports = access;
