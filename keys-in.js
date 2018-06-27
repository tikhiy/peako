'use strict';

var toObject = require( './to-object' );

module.exports = function getKeysIn ( obj ) {
  var keys = [],
      key;

  obj = toObject( obj );

  for ( key in obj ) {
    keys.push( key );
  }

  return keys;
};
