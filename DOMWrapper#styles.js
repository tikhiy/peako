'use strict';

var camelize = require( './camelize' );

module.exports = function styles ( keys ) {

  var element = this[ 0 ];

  var result = [];

  var i, l, computed, key, val;

  for ( i = 0, l = keys.length; i < l; ++i ) {

    key = keys[ i ];

    if ( ! computed ) {
      val = element.style[ key = camelize( key ) ];
    }

    if ( ! val ) {
      if ( ! computed ) {
        computed = getComputedStyle( element );
      }

      val = computed.getPropertyValue( key );
    }

    result.push( val );

  }

  return result;

};
