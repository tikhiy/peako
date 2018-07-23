'use strict';

var isset = require( '../isset' );

module.exports = function baseSet ( obj, path, val ) {
  var l = path.length,
      i = 0,
      key;

  for ( ; i < l; ++i ) {
    key = path[ i ];

    if ( i === l - 1 ) {
      obj = obj[ key ] = val;
    } else if ( isset( key, obj ) ) {
      obj = obj[ key ];
    } else {
      obj = obj[ key ] = {};
    }
  }

  return obj;
};
