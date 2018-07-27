'use strict';

module.exports = function remove () {
  var i = this.length - 1,
      nodeType, parentNode;

  for ( ; i >= 0; --i ) {
    nodeType = this[ i ].nodeType;

    if ( nodeType !== 1 &&
         nodeType !== 3 &&
         nodeType !== 8 &&
         nodeType !== 9 &&
         nodeType !== 11 )
    {
      continue;
    }

    if ( ( parentNode = this[ i ].parentNode ) ) {
      parentNode.removeChild( this[ i ] );
    }
  }

  return this;
};
