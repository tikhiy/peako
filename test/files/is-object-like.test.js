'use strict';

var isObjectLike = require( '../../is-object-like' );

describe( 'peako.isObjectLike', function () {
  it( 'returns "false" for "null"', function () {
    isObjectLike( null ).should.be.false;
  } );

  it( 'returns "true" for built-in objects', function () {
    isObjectLike( Math ).should.be.true;
  } );

  it( 'returns "true" for an object', function () {
    isObjectLike( {} ).should.be.true;
  } );
} );
