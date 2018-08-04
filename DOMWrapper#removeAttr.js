'use strict';

var support = require( './support/support-get-attribute' );
var _words  = require( './_words' );
var props   = require( './props' );

module.exports = function removeAttr ( keys ) {
  var l = ( keys = _words( keys ) ).length - 1;
  var i, j, element;

  for ( i = this.length - 1; i >= 0; --i ) {
    if ( ( element = this[ i ] ).nodeType !== 1 ) {
      continue;
    }

    for ( j = l; j >= 0; --j ) {
      if ( support ) {
        element.removeAttribute( keys[ j ] );
      } else {
        delete element[ props[ keys[ j ] ] || keys[ j ] ];
      }
    }
  }

  return this;
};
