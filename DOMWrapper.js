'use strict';

// export before call recursive require

module.exports = DOMWrapper;

var isArrayLikeObject = require( './is-array-like-object' );

var isDOMElement = require( './is-dom-element' );

var parseHTML = require( './parse-html' );

var regexps = require( './regexps' );

var _first = require( './_first' );

function DOMWrapper ( selector ) {
  var match, list, i;

  // _();

  if ( ! selector ) {
    return;
  }

  // _( window );

  if ( isDOMElement( selector ) ) {
    _first( this, selector );
    return;
  }

  if ( typeof selector === 'string' ) {
    if ( selector.charAt( 0 ) !== '<' ) {
      match = regexps.selector.exec( selector );

      // _( 'a > b + c' );

      if ( ! match || ! document.getElementsByClassName && match[ 3 ] ) {
        list = document.querySelectorAll( selector );

      // _( '#id' );

      } else if ( match[ 1 ] ) {
        if ( ( list = document.getElementById( match[ 1 ] ) ) ) {
          _first( this, list );
        }

        return;

      // _( 'tag' );

      } else if ( match[ 2 ] ) {
        list = document.getElementsByTagName( match[ 2 ] );

      // _( '.class' );

      } else {
        list = document.getElementsByClassName( match[ 3 ] );
      }

    // _( '<div>' );

    } else {
      list = parseHTML( selector );
    }

  // _( [ ... ] );

  } else if ( isArrayLikeObject( selector ) ) {
    list = selector;

  // _( function ( _ ) { ... } );

  } else if ( typeof selector === 'function' ) {
    return new DOMWrapper( document ).ready( selector );
  } else {
    throw TypeError( 'Got unexpected selector: ' + selector + '.' );
  }

  if ( ! list ) {
    return;
  }

  this.length = list.length;

  for ( i = this.length - 1; i >= 0; --i ) {
    this[ i ] = list[ i ];
  }
}

DOMWrapper.prototype = {
  each:   require( './DOMWrapper#each' ),
  end:    require( './DOMWrapper#end' ),
  eq:     require( './DOMWrapper#eq' ),
  first:  require( './DOMWrapper#first' ),
  get:    require( './DOMWrapper#get' ),
  last:   require( './DOMWrapper#last' ),
  map:    require( './DOMWrapper#map' ),
  ready:  require( './DOMWrapper#ready' ),
  remove: require( './DOMWrapper#remove' ),
  stack:  require( './DOMWrapper#stack' ),
  style:  require( './DOMWrapper#style' ),
  styles: require( './DOMWrapper#styles' )
};

module.exports = DOMWrapper;
