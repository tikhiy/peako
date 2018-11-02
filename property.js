'use strict';

/**
 * @method _.property
 * @param  {string}   path
 * @return {function}
 * @example
 * var objects = [
 *   { name: 'James' },
 *   { name: 'John' }
 * ];
 *
 * objects.map( _.property( 'name' ) ); // -> [ 'James', 'John' ]
 */
module.exports = require( './create/create-property' )( require( './base/base-property' ) );
