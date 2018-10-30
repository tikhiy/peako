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

  describe( 'html', function () {
    it( 'works', function () {
      template( '<%- \'"\' + data.value + \'"\' %>' ).render( {
        value: 'universe'
      } ).should.equal( '"universe"' );
    } );
  } );

  describe( 'code', function () {
    it( 'works', function () {
      template( '<% print( \'"\' + data.value + \'"\' ) %>' ).render( {
        value: 'universe'
      } ).should.equal( '"universe"' );
    } );
  } );

  describe( 'comm', function () {
    it( 'works', function () {
      template( '<%# A comment. %>' ).render().should.equal( '' );
    } );
  } );
} );
