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

var rselector = /^(?:#([\w-]+)|([\w-]+)|\.([\w-]+))$/;

function DOMWrapper ( selector, context ) {
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
    if ( typeof context !== 'undefined' ) {
      if ( ! context._peako ) {
        context = new DOMWrapper( context );
      }

      if ( ! context[ 0 ] ) {
        return;
      }

      context = context[ 0 ];
    } else {
      context = document;
    }

    if ( selector.charAt( 0 ) !== '<' ) {
      match = rselector.exec( selector );

      // _( 'a > b + c' );
      // _( '#id', '.another-element' )

      if ( ! match || ! context.getElementById && match[ 1 ] || ! context.getElementsByClassName && match[ 3 ] ) {
        if ( match[ 1 ] ) {
          list = [ context.querySelector( selector ) ];
        } else {
          list = context.querySelectorAll( selector );
        }

      // _( '#id' );

      } else if ( match[ 1 ] ) {
        if ( ( list = context.getElementById( match[ 1 ] ) ) ) {
          _first( this, list );
        }

        return;

      // _( 'tag' );

      } else if ( match[ 2 ] ) {
        list = context.getElementsByTagName( match[ 2 ] );

      // _( '.class' );

      } else {
        list = context.getElementsByClassName( match[ 3 ] );
      }

    // _( '<div>' );

    } else {
      list = parseHTML( selector, context );
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
  each:       require( './DOMWrapper#each' ),
  end:        require( './DOMWrapper#end' ),
  eq:         require( './DOMWrapper#eq' ),
  find:       require( './DOMWrapper#find' ),
  first:      require( './DOMWrapper#first' ),
  get:        require( './DOMWrapper#get' ),
  last:       require( './DOMWrapper#last' ),
  map:        require( './DOMWrapper#map' ),
  parent:     require( './DOMWrapper#parent' ),
  ready:      require( './DOMWrapper#ready' ),
  remove:     require( './DOMWrapper#remove' ),
  removeAttr: require( './DOMWrapper#removeAttr' ),
  removeProp: require( './DOMWrapper#removeProp' ),
  stack:      require( './DOMWrapper#stack' ),
  style:      require( './DOMWrapper#style' ),
  styles:     require( './DOMWrapper#styles' ),
  css:        require( './DOMWrapper#css' ),
  constructor: DOMWrapper,
  length: 0,
  _peako: true
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
}, void 0, true, [ 'trigger', 'off', 'one', 'on' ] );

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
}, void 0, true );

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
}, void 0, true, [ 'disabled', 'checked', 'value', 'text', 'html' ] );

( function () {
  var support = require( './support/support-get-attribute' );
  var access  = require( './access' );
  var props   = require( './props' );

  function _attr ( element, key, value, chainable ) {
    if ( element.nodeType !== 1 ) {
      return null;
    }

    if ( props[ key ] || ! support ) {
      return _prop( element, props[ key ] || key, value, chainable );
    }

    if ( ! chainable ) {
      return element.getAttribute( key );
    }

    element.setAttribute( key, value );
  }

  function _prop ( element, key, value, chainable ) {
    if ( ! chainable ) {
      return element[ key ];
    }

    element[ key ] = value;
  }

  DOMWrapper.prototype.attr = function attr ( key, value ) {
    return access( this, _attr, key, value, typeof value !== 'undefined' );
  };

  DOMWrapper.prototype.prop = function prop ( key, value ) {
    return access( this, _prop, key, value, typeof value !== 'undefined' );
  };
} )();

baseForIn( { height: require( './get-element-h' ), width: require( './get-element-w' ) }, function ( get, name ) {
  DOMWrapper.prototype[ name ] = function () {
    if ( arguments.length ) {
      throw Error( '_().' + name + "( value ) is deprecated now. use _().style( '" + name + "', value ) instead" );
    }

    if ( this[ 0 ] ) {
      return get( this[ 0 ] );
    }

    return null;
  };
}, void 0, true, [ 'height', 'width' ] );
