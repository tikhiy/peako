'use strict';

var has = require( '../has' );

module.exports = function baseAccessor ( object, path, offset, value, setValue ) {
  var i = 0,
      len = path.length - offset,
      key, hasPath, last;

  if ( setValue ) {
    last = len - 1;
  }

  for ( ; i < len; ++i ) {
    hasPath = has( key = path[ i ], object );

    if ( setValue ) {
      if ( i === last ) {
        object = object[ key ] = value;
      } else if ( hasPath ) {
        object = object[ key ];
      } else {
        object = object[ key ] = {};
      }
    } else if ( hasPath ) {
      object = object[ key ];
    } else {
      return;
    }
  }

  return object;
};
