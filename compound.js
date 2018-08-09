'use strict';

module.exports = function compound ( functions ) {
  return function compounded () {
    var value, i, l;

    for ( i = 0, l = functions.length; i < l; ++i ) {
      value = functions[ i ].apply( this, arguments );
    }

    return value;
  };
};
