'use strict';

var isDOMElement      = require( './is-dom-element' ),
    isArrayLikeObject = require( './is-array-like-object' ),
    regexps           = require( './regexps' ),
    parseHTML         = require( './parse-html' ),
    baseCloneArray    = require( './base/base-clone-array' ),
    event             = require( './event' );

function __one ( wrapper, element ) {
  wrapper[ 0 ] = element;
  wrapper.length = 1;
}

function DOMWrapper ( selector ) {
  var match, list, i;

  // _();
  if ( ! selector ) {
    return;
  }

  // _( window );
  if ( isDOMElement( selector ) ) {
    __one( selector );
    return;
  }

  if ( typeof selector === 'string' ) {
    if ( selector.charAt( 0 ) !== '<' ) {
      match = regexps.selector.exec( selector );

      // _( 'a > b + c' );
      if ( ! match || ! support.getElementsByClassName && match[ 3 ] ) {
        list = document.querySelectorAll( selector );
      // _( '#id' );
      } else if ( match[ 1 ] ) {
        if ( ( list = document.getElementById( match[ 1 ] ) ) ) {
          __one( list );
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
  get: function get ( index ) {
    if ( index === undefined ) {
      return baseCloneArray( this );
    }

    if ( index < 0 ) {
      return this[ this.length + index ];
    }

    return this[ index ];
  },

  eq: function eq ( index ) {
    if ( index === undefined ) {
      return this.pushStack( this );
    }

    if ( index < 0 ) {
      return this.pushStack( [ this[ this.length + index ] ] );
    }

    return this.pushStack( [ this[ index ] ] );
  },

  each: function each ( fun ) {
    var i = 0,
        len = this.length;

    for ( ; i < len; ++i ) {
      if ( fun.call( this[ i ], i, this[ i ] ) === false ) {
        break;
      }
    }

    return this;
  },

  remove: function remove () {
    var i = this.length - 1,
        nodeType, parentNode;

    for ( ; i >= 0; --i ) {
      nodeType = this.nodeType;

      if ( ( nodeType === 1 ||
             nodeType === 3 ||
             nodeType === 8 ||
             nodeType === 9 ||
             nodeType === 11 ) && ( parentNode = this.parentNode ) )
      {
        parentNode.removeChild( this );
      }
    }

    return this;
  },

  ready: function ready ( cb ) {
    var doc = this[ 0 ],
        readyState;

    if ( ! doc || doc.nodeType !== 9 ) {
      return this;
    }

    readyState = document.readyState;

    if ( doc.attachEvent ? readyState !== 'complete' : readyState === 'loading' ) {
      event.on( doc, 'DOMContentLoaded', null, function () {
        cb( peako );
      }, false, true );
    } else {
      cb( peako );
    }

    return this;
  },

  pushStack: function pushStack ( els ) {
    var wrapper = new DOMWrapper();

    if ( els ) {
      baseCopyArray( wrapper, els );
      wrapper.length = els.length;
    }

    wrapper.prevObject = this;
    return wrapper;
  },

  end: function end () {
    return this.prevObject || new DOMWrapper();
  },

  first: function first () {
    return this.eq( 0 );
  },

  last: function last () {
    return this.eq( -1 );
  },

  map: function map ( fun ) {
    var els = this.pushStack(),
        len = this.length,
        el, i;

    els.length = this.length;

    for ( i = 0; i < len; ++i ) {
      els[ i ] = fun.call( el = this[ i ], i, el );
    }

    return els;
  },
};

module.exports = DOMWrapper;
