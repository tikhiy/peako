'use strict';

function peako () {}

peako.ajax             = require( './ajax' );
peako.urlencode        = require( './urlencode' );
peako.clone            = require( './clone' );
peako.create           = require( './create' );
peako.defaults         = require( './defaults' );
peako.defineProperties = require( './define-properties' );
peako.each             = require( './each' );
peako.eachRight        = require( './each-right' );
peako.getPrototypeOf   = require( './get-prototype-of' );
peako.indexOf          = require( './index-of' );
peako.isArray          = require( './is-array' );
peako.isArrayLike      = require( './is-array-like' );
peako.isLength         = require( './is-length' );
peako.isObject         = require( './is-object' );
peako.isObjectLike     = require( './is-object-like' );
peako.isPlainObject    = require( './is-plain-object' );
peako.isPrimitive      = require( './is-primitive' );
peako.isSymbol         = require( './is-symbol' );
peako.isWindowLike     = require( './is-window-like' );
peako.keys             = require( './keys' );
peako.keysIn           = require( './keys-in' );
peako.lastIndexOf      = require( './last-index-of' );
peako.mixin            = require( './mixin' );
peako.noop             = require( './noop' );
peako.property         = require( './property' );
peako.setPrototypeOf   = require( './set-prototype-of' );
peako.toObject         = require( './to-object' );
peako.type             = require( './type' );
peako.forEach          = require( './for-each' );
peako.forEachRight     = require( './for-each-right' );
peako.forIn            = require( './for-in' );
peako.forInRight       = require( './for-in-right' );
peako.forOwn           = require( './for-own' );
peako.forOwnRight      = require( './for-own-right' );

module.exports = require( './root' ).peako = peako;
