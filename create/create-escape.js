'use strict';

module.exports = function createEscape ( regexp, map ) {
  function replacer ( c ) {
    return map[ c ];
  }

  return function escape ( string ) {
    if ( string == null ) {
      return '';
    }

    return ( string += '' ).replace( regexp, replacer );
  };
};
