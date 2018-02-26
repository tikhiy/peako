
/* jshint esversion: 3, unused: true, undef: true */
/* global _, document, prettyPrint */

;( function ( window, undefined ) {

'use strict';

// if document.location is
// '%lalala%/docs/peako.js.html#line-1234'
// and document.location.hash is
// '#line-1234'
// then selected_line is
// 'line-1234'
var selected_line = document.location.hash.slice( 1 );

prettyPrint();

_( '.prettyprint.source.linenums li' ).each( function ( i, line ) {
  if ( selected_line === ( this.id = 'line-' + ( i + 1 ) ) ) {
    window.setTimeout( function () {
      _( line ).removeClass( 'selected' );
    }, 5000 );

    this.className += ' selected';
    this.scrollIntoView();
  }
} );

} )( this );
