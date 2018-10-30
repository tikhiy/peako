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

  describe( 'custom patterns', function () {
    it( 'works', function () {
      var source = '<?php print( data.$universe ); ?>';

      var options = {
        regexps: {
          code: '<\\?php\\s*([^]*?)\\s*\\?>'
        }
      };

      var data = {
        $universe: 'The Universe'
      };

      template( source, options ).render( data ).should.equal( 'The Universe' );
    } );
  } );
} );
