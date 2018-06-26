'use strict';

var isArray = require( './is-array' ),
    isObject = require( './is-object' ),
    isObjectLike = require( './is-object-like' );

var hasOwnProperty = {}.hasOwnProperty;

/**
 * @param {String} key
 * @param {*} val
 * @returns {String}
 * @example
 * param( 'name', 'John' ); // -> 'name=John'
 */
function param ( key, val ) {
  var param = encodeURIComponent( key ) + '=';

  if ( val != null ) {
    param += encodeURIComponent( val );
  }

  return param;
}

function build ( params, obj, prefix ) {
  var key, i, l;

  if ( isArray( obj ) ) {
    for ( i = 0, l = obj.length; i < l; ++i ) {
      if ( /\[\]$/.test( prefix ) ) {
        params.push( param( prefix, obj[ i ] ) );
      } else if ( isObjectLike( obj[ i ] ) ) {
        build( params, obj[ i ], prefix + '[' + i + ']' );
      } else {
        build( params, obj[ i ], prefix + '[]' );
      }
    }
  } else if ( isObject( obj ) ) {
    for ( key in obj ) {
      if ( hasOwnProperty.call( obj, key ) ) {
        build( params, obj[ key ], prefix + '[' + key + ']' );
      }
    }
  } else {
    params.push( param( prefix, obj ) );
  }
}

function urlencode ( data ) {
  var params = [],
      prefix;

  for ( prefix in data ) {
    if ( hasOwnProperty.call( data, prefix ) ) {
      build( params, data[ prefix ], prefix );
    }
  }

  return params.join( '&' );
}

module.exports = urlencode;
