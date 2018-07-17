'use strict';

var isObjectLike = require( './is-object-like' ),
    isWindowLike = require( './is-window-like' );

module.exports = function isDOMElement ( value ) {
  var nodeType;

  if ( ! isObjectLike( value ) ) {
    return false;
  }

  if ( isWindowLike( value ) ) {
    return true;
  }

  nodeType = value.nodeType;

  return nodeType === 1 || // ELEMENT_NODE
         nodeType === 3 || // TEXT_NODE
         nodeType === 8 || // COMMENT_NODE
         nodeType === 9 || // DOCUMENT_NODE
         nodeType === 11;  // DOCUMENT_FRAGMENT_NODE
};
