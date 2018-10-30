'use strict';

var trimStart = require( '../../trim-start' );

describe( 'peako.trimStart', function () {
  it( 'works', function () {
    var value = {
      toString: function toString () {
        return ' \t\n\r\n 42 \t\n\r\n ';
      }
    };

    trimStart( value ).should.equal( '42 \t\n\r\n ' );
  } );
} );
