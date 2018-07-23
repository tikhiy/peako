'use strict';

var isset = require( '../isset' );

module.exports = function baseHas ( obj, path ) {
  var l = path.length,
      i = 0,
      key;

  for ( ; i < l; ++i ) {
    key = path[ i ];

    if ( isset( key, obj ) ) {
      obj = obj[ key ];
    } else {
      return false;
    }
  }

  return true;
};
