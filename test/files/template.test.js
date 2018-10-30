'use strict';

var template = require( '../../template' );

describe( 'peako.template', function () {
  describe( 'safe', function () {
    it( 'works', function () {
      template( '<%= \'"\' + data.value + \'"\' %>' ).render( {
        value: 'universe'
      } ).should.equal( '&#34;universe&#34;' );
    } );
  } );
} );
