'use strict';

module.exports = function baseValues ( obj, keys ) {
  var i = keys.length,
      values = Array( i-- );

  for ( ; i >= 0; --i ) {
    values[ i ] = obj[ keys[ i ] ];
  }

  return values;
};
