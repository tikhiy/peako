'use strict';

var support     = require( '../support/support-keys' );

var baseIndexOf = require( './base-index-of' );

var hasOwnProperty = Object.prototype.hasOwnProperty;

if ( support === 'has-a-bug' ) {
  var _keys = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'
  ];
}

module.exports = function baseKeys ( object ) {
  var keys = [];
  var key;
  var i;

  for ( key in object ) {
    if ( hasOwnProperty.call( object, key ) ) {
      keys.push( key );
    }
  }

  if ( support === 'has-a-bug' ) {
    for ( i = _keys.length - 1; i >= 0; --i ) {
      if ( baseIndexOf( keys, _keys[ i ] ) < 0 && hasOwnProperty.call( object, _keys[ i ] ) ) {
        keys.push( _keys[ i ] );
      }
    }
  }

  return keys;
};
