'use strict';

var toObject = require( './to-object' ),
    indexOf = require( './index-of' );

var hasOwnProperty = {}.hasOwnProperty;

var getKeys, support, notEnumerables, fixKeys, baseKeys;

if ( Object.keys ) {
  try {
    support = Object.keys( '' ), 'es2015';
  } catch ( e ) {
    support = 'es5';
  }
} else if ( { toString: null }.propertyIsEnumerable( 'toString' ) ) {
  support = 'not-supported';
} else {
  support = 'has-a-bug';
}

// Base implementation of `Object.keys` polyfill.
if ( support !== 'es2015' ) {
  if ( support === 'not-supported' ) {
    notEnumerables = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ];

    fixKeys = function fixKeys ( keys, object ) {
      var i = notEnumerables.length - 1,
          key;

      for ( ; i >= 0; --i ) {
        key = notEnumerables[ i ];

        if ( indexOf( keys, key ) < 0 && hasOwnProperty.call( object, key ) ) {
          keys.push( key );
        }
      }

      return keys;
    };
  }

  baseKeys = function baseKeys ( object ) {
    var keys = [],
        key;

    for ( key in object ) {
      if ( hasOwnProperty.call( object, key ) ) {
        keys.push( key );
      }
    }

    if ( support !== 'not-supported' ) {
      return keys;
    }

    return fixKeys( keys, object );
  };
}

if ( support !== 'es2015' ) {
  getKeys = function ( val ) {
    return baseKeys( toObject( val ) );
  };
} else {
  getKeys = Object.keys;
}

module.exports = getKeys;
