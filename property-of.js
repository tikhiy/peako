'use strict';

/**
 * @method _.propertyOf
 * @param  {object}   object
 * @return {function}
 * @example
 * var object = {
 *   x: 42,
 *   y: 0
 * };
 *
 * [ 'x', 'y' ].map( _.propertyOf( object ) ); // -> [ 42, 0 ]
 */
module.exports = require( './create/create-property-of' )( require( './base/base-property' ) );
