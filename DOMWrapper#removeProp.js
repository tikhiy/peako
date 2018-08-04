'use strict';

var _words = require( './_words' );

module.exports = function removeProp ( keys ) {
  var l = ( keys = _words( keys ) ).length - 1;
  var i, j, element;

  for ( i = this.length - 1; i >= 0; --i ) {
    element = this[ i ];

    for ( j = l; j >= 0; --j ) {
      delete element[ keys[ j ] ];
    }
  }

  return this;
};
