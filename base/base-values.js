'use strict';

module.exports = function baseValues ( object, keys ) {
  var i = keys.length,
      values = Array( i-- );

  for ( ; i >= 0; --i ) {
    values[ i ] = object[ keys[ i ] ];
  }

  return values;
};
