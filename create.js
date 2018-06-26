'use strict';

var isPrimitive      = require( './is-primitive' ),
    setPrototypeOf   = require( './set-prototype-of' ),
    defineProperties = require( './define-properties' );

function Constructor () {}

module.exports = Object.create || function create ( prototype, descriptors ) {
  var object;

  if ( prototype !== null && isPrimitive( prototype ) ) {
    throw TypeError( 'Object prototype may only be an Object or null: ' + prototype );
  }

  Constructor.prototype = prototype;

  object = new Constructor();

  Constructor.prototype = null;

  if ( prototype === null ) {
    setPrototypeOf( object, prototype );
  }

  if ( arguments.length >= 2 ) {
    defineProperties( object, descriptors );
  }

  return object;
};
