'use strict';

module.exports = function _textContent ( element ) {
  var children = element.childNodes;
  var result = '';
  var i, l, child, type;

  for ( i = 0, l = children.length; i < l; ++i ) {
    // TEXT_NODE
    if ( ( type = ( child = children[ i ] ).nodeType ) === 3 ) {
      result += child.nodeValue;
    // ELEMENT_NODE
    } else if ( type === 1 ) {
      result += _textContent( child );
    }
  }

  return result;
};
