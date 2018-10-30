'use strict';

var trimEnd = require( '../../trim-end' );

describe( 'peako.trimEnd', function () {
  it( 'works', function () {
    var value = {
      toString: function toString () {
        return ' \t\n\r\n 42 \t\n\r\n ';
      }
    };

    trimEnd( value ).should.equal( ' \t\n\r\n 42' );
  } );
} );
