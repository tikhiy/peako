'use strict';

var support = require( './support/support-define-property' );

var defineProperty, baseDefineProperty, isPrimitive;

if ( support !== 'full' ) {
  isPrimitive        = require( './is-primitive' );
  baseDefineProperty = require( './base/base-define-property' );

  defineProperty = function defineProperty ( object, key, descriptor ) {
    if ( support !== 'not-supported' ) {
      try {
        return Object.defineProperty( object, key, descriptor );
      } catch ( e ) {}
    }

    if ( isPrimitive( object ) ) {
      throw TypeError( 'defineProperty called on non-object' );
    }

    if ( isPrimitive( descriptor ) ) {
      throw TypeError( 'Property description must be an object: ' + descriptor );
    }

    return baseDefineProperty( object, key, descriptor );
  };
} else {
  defineProperty = Object.defineProperty;
}

module.exports = defineProperty;
