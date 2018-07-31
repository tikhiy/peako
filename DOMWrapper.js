'use strict';

// export before call recursive require

module.exports = DOMWrapper;

var isArrayLikeObject = require( './is-array-like-object' ),
    isDOMElement      = require( './is-dom-element' ),
    baseForEach       = require( './base/base-for-each' ),
    baseForIn         = require( './base/base-for-in' ),
    parseHTML         = require( './parse-html' ),
    _first            = require( './_first' ),
    event             = require( './event' );

var undefined; // jshint ignore: line

var rSelector = /^(?:#([\w-]+)|([\w-]+)|\.([\w-]+))$/;

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
      match = rSelector.exec( selector );

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
  styles: require( './DOMWrapper#styles' ),
  css:    require( './DOMWrapper#css' ),
  constructor: DOMWrapper
};

baseForIn( {
  trigger: 'trigger',
  off:     'off',
  one:     'on',
  on:      'on'
}, function ( name, methodName ) {
  DOMWrapper.prototype[ methodName ] = function ( types, selector, listener, useCapture ) {
    var removeAll = name === 'off' && ! arguments.length;

    var one = name === 'one';

    var element, i, j, l;

    if ( ! removeAll ) {
      if ( ! ( types = types.match( /[^\s\uFEFF\xA0]+/g ) ) ) {
        return this;
      }

      l = types.length;
    }

    // off( types, listener, useCapture )
    // off( types, listener )

    if ( name !== 'trigger' && typeof selector === 'function' ) {
      if ( listener != null ) {
        useCapture = listener;
      }

      listener = selector;
      selector = null;
    }

    if ( typeof useCapture === 'undefined' ) {
      useCapture = false;
    }

    for ( i = this.length - 1; i >= 0; --i ) {
      element = this[ i ];

      if ( removeAll ) {
        event.off( element );
      } else {
        for ( j = 0; j < l; ++j ) {
          event[ name ]( element, types[ j ], selector, listener, useCapture, one );
        }
      }
    }

    return this;
  };
}, undefined, true, [ 'trigger', 'off', 'one', 'on' ] );

baseForEach( [
  'blur',        'focus',       'focusin',
  'focusout',    'resize',      'scroll',
  'click',       'dblclick',    'mousedown',
  'mouseup',     'mousemove',   'mouseover',
  'mouseout',    'mouseenter',  'mouseleave',
  'change',      'select',      'submit',
  'keydown',     'keypress',    'keyup',
  'contextmenu', 'touchstart',  'touchmove',
  'touchend',    'touchenter',  'touchleave',
  'touchcancel', 'load'
], function ( eventType ) {
  DOMWrapper.prototype[ eventType ] = function ( arg ) {
    var i, l;

    if ( typeof arg !== 'function' ) {
      return this.trigger( eventType, arg );
    }

    for ( i = 0, l = arguments.length; i < l; ++i ) {
      this.on( eventType, arguments[ i ], false );
    }

    return this;
  };
}, undefined, true );

baseForIn( {
  disabled: 'disabled',
  checked:  'checked',
  value:    'value',
  text:     'textContent' in document.body ? 'textContent' : 'innerText',
  html:     'innerHTML'
}, function ( name, methodName ) {
  DOMWrapper.prototype[ methodName ] = function ( value ) {
    var element, i;

    if ( value == null ) {
      if ( ( element = this[ 0 ] ) && element.nodeType === 1 ) {
        return element[ name ];
      }

      return null;
    }

    for ( i = this.length - 1; i >= 0; --i ) {
      if ( ( element = this[ i ] ).nodeType === 1 ) {
        element[ name ] = value;
      }
    }

    return this;
  };
}, undefined, true, [ 'disabled', 'checked', 'value', 'text', 'html' ] );
