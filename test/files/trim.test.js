'use strict';

var trim = require( '../../trim' );

describe( 'peako.trim', function () {
  it( 'works', function () {
    var value = {
      toString: function toString () {
        return ' \t\n\r\n 42 \t\n\r\n ';
      }
    };

    trim( value ).should.equal( '42' );
  } );
} );
