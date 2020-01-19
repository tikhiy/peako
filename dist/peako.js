(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports = DOMWrapper;

var _textContent         = require( '../internal/text-content' );
var _first               = require( '../internal/first' );
var _words               = require( '../internal/words' );

var support              = require( '../support/support-get-attribute' );

var createRemoveProperty = require( '../create/create-remove-prop' );

var baseForEach          = require( '../base/base-for-each' );
var baseForIn            = require( '../base/base-for-in' );

var isArrayLikeObject    = require( '../is-array-like-object' );
var isDOMElement         = require( '../is-dom-element' );
var getElementW          = require( '../get-element-w' );
var getElementH          = require( '../get-element-h' );
var parseHTML            = require( '../parse-html' );
var access               = require( '../access' );
var events               = require( '../events' );

var rselector = /^(?:#([\w-]+)|([\w-]+)|\.([\w-]+))$/;

function DOMWrapper ( selector, context ) {
  var match;
  var list;
  var i;

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
        if ( match && match[ 1 ] ) {
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
  each:       require( './prototype/each' ),
  end:        require( './prototype/end' ),
  eq:         require( './prototype/eq' ),
  find:       require( './prototype/find' ),
  first:      require( './prototype/first' ),
  get:        require( './prototype/get' ),
  last:       require( './prototype/last' ),
  map:        require( './prototype/map' ),
  parent:     require( './prototype/parent' ),
  ready:      require( './prototype/ready' ),
  remove:     require( './prototype/remove' ),
  removeAttr: require( './prototype/removeAttr' ),
  removeProp: require( './prototype/removeProp' ),
  stack:      require( './prototype/stack' ),
  style:      require( './prototype/style' ),
  styles:     require( './prototype/styles' ),
  css:        require( './prototype/css' ),
  constructor: DOMWrapper,
  length: 0,
  _peako: true
};

baseForIn( {
  trigger: 'trigger',
  once:    'on',
  off:     'off',
  on:      'on'
}, function ( name, methodName ) {
  DOMWrapper.prototype[ methodName ] = function ( types, selector, listener, useCapture ) {
    var removeAll = methodName === 'off' && ! arguments.length;
    var once = methodName === 'once';
    var element;
    var i;
    var j;
    var l;

    if ( ! removeAll ) {
      types = _words( types );

      if ( ! types.length ) {
        return this;
      }

      l = types.length;
    }

    // off( types, listener, useCapture )
    // off( types, listener )

    if ( methodName !== 'trigger' && typeof selector === 'function' ) {
      if ( typeof listener !== 'undefined' ) {
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
        events.off( element );
      } else {
        for ( j = 0; j < l; ++j ) {
          events[ name ]( element, types[ j ], selector, listener, useCapture, once );
        }
      }
    }

    return this;
  };

  if ( methodName === 'once' ) {
    var count = 0;

    DOMWrapper.prototype.one = function one () {
      if ( count++ < 1 ) {
        console.log( '"one" is deprecated now. Use "once" instead.' );
      }

      return this.once.apply( this, [].slice.call( arguments ) );
    };
  }
}, void 0, true, [ 'trigger', 'once', 'off', 'on' ] );

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
    var i;
    var l;

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
  text:     'textContent' in document.body ? 'textContent' : _textContent, // eslint-disable-line no-ternary
  html:     'innerHTML'
}, function ( key, methodName ) {
  DOMWrapper.prototype[ methodName ] = function ( value ) {
    var element;
    var i;

    if ( typeof value === 'undefined' ) {
      if ( ! ( element = this[ 0 ] ) || element.nodeType !== 1 ) {
        return null;
      }

      if ( typeof key !== 'function' ) {
        return element[ key ];
      }

      return key( element );
    }

    for ( i = this.length - 1; i >= 0; --i ) {
      if ( ( element = this[ i ] ).nodeType !== 1 ) {
        continue;
      }

      if ( typeof key !== 'function' ) {
        element[ key ] = value;
      } else {
        key( element, value );
      }
    }

    return this;
  };
}, void 0, true, [ 'disabled', 'checked', 'value', 'text', 'html' ] );

( function () {
  var props = require( '../props' );

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

  DOMWrapper.prototype.attr = function attr ( key, value ) {
    return access( this, key, value, _attr );
  };

  function _prop ( element, key, value, chainable ) {
    if ( ! chainable ) {
      return element[ key ];
    }

    element[ key ] = value;
  }

  DOMWrapper.prototype.prop = function prop ( key, value ) {
    return access( this, key, value, _prop );
  };
} )();

( function () {
  var _peakoId = 0;
  var _data = {};

  function _accessData ( element, key, value, chainable ) {
    var attributes;
    var attribute;
    var data;
    var i;
    var l;

    if ( ! element._peakoId ) {
      element._peakoId = ++_peakoId;
    }

    if ( ! ( data = _data[ element._peakoId ] ) ) {
      data = _data[ element._peakoId ] = {}; // eslint-disable-line no-multi-assign

      for ( attributes = element.attributes, i = 0, l = attributes.length; i < l; ++i ) {
        if ( ! ( attribute = attributes[ i ] ).nodeName.indexOf( 'data-' ) ) {
          data[ attribute.nodeName.slice( 5 ) ] = attribute.nodeValue;
        }
      }
    }

    if ( chainable ) {
      data[ key ] = value;
    } else {
      return data[ key ];
    }
  }

  DOMWrapper.prototype.data = function data ( key, value ) {
    return access( this, key, value, _accessData );
  };

  DOMWrapper.prototype.removeData = createRemoveProperty( function _removeData ( element, key ) {
    if ( element._peakoId ) {
      delete _data[ element._peakoId ][ key ];
    }
  } );
} )();

baseForIn( { height: getElementW, width: getElementH }, function ( get, name ) {
  DOMWrapper.prototype[ name ] = function () {
    if ( this[ 0 ] ) {
      return get( this[ 0 ] );
    }

    return null;
  };
}, void 0, true, [ 'height', 'width' ] );

},{"../access":21,"../base/base-for-each":30,"../base/base-for-in":31,"../create/create-remove-prop":62,"../events":70,"../get-element-h":83,"../get-element-w":84,"../internal/first":93,"../internal/text-content":97,"../internal/words":100,"../is-array-like-object":102,"../is-dom-element":105,"../parse-html":133,"../props":138,"../support/support-get-attribute":142,"./prototype/css":2,"./prototype/each":3,"./prototype/end":4,"./prototype/eq":5,"./prototype/find":6,"./prototype/first":7,"./prototype/get":8,"./prototype/last":9,"./prototype/map":10,"./prototype/parent":11,"./prototype/ready":12,"./prototype/remove":13,"./prototype/removeAttr":14,"./prototype/removeProp":15,"./prototype/stack":16,"./prototype/style":17,"./prototype/styles":18}],2:[function(require,module,exports){
'use strict';

var isArray = require( '../../is-array' );

module.exports = function css ( k, v ) {
  if ( isArray( k ) ) {
    return this.styles( k );
  }

  return this.style( k, v );
};

},{"../../is-array":104}],3:[function(require,module,exports){
'use strict';

module.exports = function each ( fun ) {
  var len = this.length;
  var i = 0;

  for ( ; i < len; ++i ) {
    if ( fun.call( this[ i ], i, this[ i ] ) === false ) {
      break;
    }
  }

  return this;
};

},{}],4:[function(require,module,exports){
'use strict';

var DOMWrapper = require( '..' );

module.exports = function end () {
  return this._previous || new DOMWrapper();
};

},{"..":1}],5:[function(require,module,exports){
'use strict';

module.exports = function eq ( index ) {
  return this.stack( this.get( index ) );
};

},{}],6:[function(require,module,exports){
'use strict';

var DOMWrapper = require( '..' );

module.exports = function find ( selector ) {
  return new DOMWrapper( selector, this );
};

},{"..":1}],7:[function(require,module,exports){
'use strict';

module.exports = function first () {
  return this.eq( 0 );
};

},{}],8:[function(require,module,exports){
'use strict';

var clone = require( '../../base/base-clone-array' );

module.exports = function get ( index ) {
  if ( typeof index === 'undefined' ) {
    return clone( this );
  }

  if ( index < 0 ) {
    return this[ this.length + index ];
  }

  return this[ index ];
};

},{"../../base/base-clone-array":27}],9:[function(require,module,exports){
'use strict';

module.exports = function last () {
  return this.eq( -1 );
};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function map ( fun ) {
  var els = this.stack();
  var len = this.length;
  var el;
  var i;

  els.length = this.length;

  for ( i = 0; i < len; ++i ) {
    els[ i ] = fun.call( el = this[ i ], i, el );
  }

  return els;
};

},{}],11:[function(require,module,exports){
'use strict';

var baseIndexOf = require( '../../base/base-index-of' );
var matches     = require( '../../matches-selector' );

module.exports = function parent ( selector ) {
  var elements = this.stack();
  var element;
  var parent;
  var i;
  var l;

  for ( i = 0, l = this.length; i < l; ++i ) {
    parent = ( element = this[ i ] ).nodeType === 1 && element.parentElement;

    if ( parent && baseIndexOf( elements, parent ) < 0 && ( ! selector || matches.call( parent, selector ) ) ) {
      elements[ elements.length++ ] = parent;
    }
  }

  return elements;
};

},{"../../base/base-index-of":34,"../../matches-selector":127}],12:[function(require,module,exports){
'use strict';

var events = require( '../../events' );

module.exports = function ready ( cb ) {
  var doc = this[ 0 ];
  var readyState;

  if ( ! doc || doc.nodeType !== 9 ) {
    return this;
  }

  readyState = doc.readyState;

  if ( doc.attachEvent ? readyState !== 'complete' : readyState === 'loading' ) { // eslint-disable-line no-ternary
    events.on( doc, 'DOMContentLoaded', null, function () {
      cb();
    }, false, true );
  } else {
    cb();
  }

  return this;
};

},{"../../events":70}],13:[function(require,module,exports){
'use strict';

module.exports = function remove () {
  var i = this.length - 1;
  var parentNode;
  var nodeType;

  for ( ; i >= 0; --i ) {
    nodeType = this[ i ].nodeType;

    // eslint-disable-next-line brace-rules/brace-on-same-line
    if ( nodeType !== 1 &&
         nodeType !== 3 &&
         nodeType !== 8 &&
         nodeType !== 9 &&
         nodeType !== 11 ) {
      continue;
    }

    if ( ( parentNode = this[ i ].parentNode ) ) {
      parentNode.removeChild( this[ i ] );
    }
  }

  return this;
};

},{}],14:[function(require,module,exports){
'use strict';

module.exports = require( '../../create/create-remove-prop' )( require( '../../base/base-remove-attr' ) );

},{"../../base/base-remove-attr":38,"../../create/create-remove-prop":62}],15:[function(require,module,exports){
'use strict';

module.exports = require( '../../create/create-remove-prop' )( function _removeProp ( element, key ) {
  delete element[ key ];
} );

},{"../../create/create-remove-prop":62}],16:[function(require,module,exports){
'use strict';

var _first        = require( '../../internal/first' );

var baseCopyArray = require( '../../base/base-copy-array' );

var DOMWrapper    = require( '..' );

module.exports = function stack ( elements ) {
  var wrapper = new DOMWrapper();

  if ( elements ) {
    if ( elements.length ) {
      baseCopyArray( wrapper, elements ).length = elements.length;
    } else {
      _first( wrapper, elements );
    }
  }

  wrapper._previous = wrapper.prevObject = this; // eslint-disable-line no-multi-assign

  return wrapper;
};

},{"..":1,"../../base/base-copy-array":28,"../../internal/first":93}],17:[function(require,module,exports){
'use strict';

var _cssNumbers   = require( '../../internal/css-numbers' );
var _getStyle     = require( '../../internal/get-style' );

var isObjectLike = require( '../../is-object-like' );
var camelize     = require( '../../camelize' );
var access       = require( '../../access' );

module.exports = function style ( key, val ) {
  var px = 'do-not-add';

  // Compute px or add 'px' to `val` now.

  if ( typeof key === 'string' && ! _cssNumbers[ camelize( key ) ] ) {
    if ( typeof val === 'number' ) {
      val += 'px';
    } else if ( typeof val === 'function' ) {
      px = 'got-a-function';
    }
  } else if ( isObjectLike( key ) ) {
    px = 'got-an-object';
  }

  return access( this, key, val, function ( element, key, val, chainable ) {
    if ( element.nodeType !== 1 ) {
      return null;
    }

    key = camelize( key );

    if ( ! chainable ) {
      return _getStyle( element, key );
    }

    if ( typeof val === 'number' && ( px === 'got-a-function' || px === 'got-an-object' && ! _cssNumbers[ key ] ) ) {
      val += 'px';
    }

    element.style[ key ] = val;
  } );
};

},{"../../access":21,"../../camelize":43,"../../internal/css-numbers":92,"../../internal/get-style":94,"../../is-object-like":111}],18:[function(require,module,exports){
'use strict';

var camelize = require( '../../camelize' );

module.exports = function styles ( keys ) {
  var element = this[ 0 ];
  var result = [];
  var computed;
  var value;
  var key;
  var i;
  var l;

  for ( i = 0, l = keys.length; i < l; ++i ) {
    key = keys[ i ];

    if ( ! computed ) {
      value = element.style[ ( key = camelize( key ) ) ];
    }

    if ( ! value ) {
      if ( ! computed ) {
        computed = getComputedStyle( element );
      }

      value = computed.getPropertyValue( key );
    }

    result.push( value );
  }

  return result;
};

},{"../../camelize":43}],19:[function(require,module,exports){
'use strict';

var baseAssign = require( './base/base-assign' );

var isset      = require( './isset' );
var keys       = require( './keys' );

var defaults = [
  'altKey',        'bubbles',        'cancelable',
  'cancelBubble',  'changedTouches', 'ctrlKey',
  'currentTarget', 'detail',         'eventPhase',
  'metaKey',       'pageX',          'pageY',
  'shiftKey',      'view',           'char',
  'charCode',      'key',            'keyCode',
  'button',        'buttons',        'clientX',
  'clientY',       'offsetX',        'offsetY',
  'pointerId',     'pointerType',    'relatedTarget',
  'returnValue',   'screenX',        'screenY',
  'targetTouches', 'toElement',      'touches',
  'isTrusted'
];

function Event ( original, options ) {
  var i;
  var k;

  if ( typeof original === 'object' ) {
    for ( i = defaults.length - 1; i >= 0; --i ) {
      if ( isset( k = defaults[ i ], original ) ) {
        this[ k ] = original[ k ];
      }
    }

    if ( original.target ) {
      if ( original.target.nodeType === 3 ) {
        this.target = original.target.parentNode;
      } else {
        this.target = original.target;
      }
    }

    this.original = this.originalEvent = original; // eslint-disable-line no-multi-assign
    this.which = Event.which( original );
  } else {
    this.isTrusted = false;
  }

  if ( typeof original === 'string' ) {
    this.type = original;
  } else if ( typeof options === 'string' ) {
    this.type = options;
  }

  if ( typeof options === 'object' ) {
    baseAssign( this, options, keys( options ) );
  }
}

Event.prototype = {
  preventDefault: function preventDefault () {
    if ( this.original ) {
      if ( this.original.preventDefault ) {
        this.original.preventDefault();
      } else {
        this.original.returnValue = false;
      }

      this.returnValue = this.original.returnValue;
    }
  },

  stopPropagation: function stopPropagation () {
    if ( this.original ) {
      if ( this.original.stopPropagation ) {
        this.original.stopPropagation();
      } else {
        this.original.cancelBubble = true;
      }

      this.cancelBubble = this.original.cancelBubble;
    }
  },

  constructor: Event
};

Event.which = function which ( event ) {
  if ( event.which ) {
    return event.which;
  }

  if ( ! event.type.indexOf( 'key' ) ) {
    if ( typeof event.charCode !== 'undefined' ) {
      return event.charCode;
    }

    return event.keyCode;
  }

  if ( typeof event.button === 'undefined' || ! /^(?:mouse|pointer|contextmenu|drag|drop)|click/.test( event.type ) ) {
    return null;
  }

  if ( event.button & 1 ) { // eslint-disable-line no-bitwise
    return 1;
  }

  if ( event.button & 2 ) { // eslint-disable-line no-bitwise
    return 3;
  }

  if ( event.button & 4 ) { // eslint-disable-line no-bitwise
    return 2;
  }

  return 0;
};

module.exports = Event;

},{"./base/base-assign":26,"./isset":120,"./keys":124}],20:[function(require,module,exports){
'use strict';

var DOMWrapper = require( './DOMWrapper' );

function _ ( selector, context ) {
  return new DOMWrapper( selector, context );
}

_.fn = _.prototype = DOMWrapper.prototype; // eslint-disable-line no-multi-assign
_.fn.constructor = _;

module.exports = _;

},{"./DOMWrapper":1}],21:[function(require,module,exports){
'use strict';

var DOMWrapper = require( './DOMWrapper' );
var type       = require( './type' );
var keys       = require( './keys' );

function access ( obj, key, val, fn, _noCheck ) {
  var chainable = _noCheck || typeof val !== 'undefined';
  var bulk = key === null || key === 'undefined';
  var len = obj.length;
  var raw = false;
  var e;
  var k;
  var i;
  var l;

  if ( ! _noCheck && type( key ) === 'object' ) {
    for ( i = 0, k = keys( key ), l = k.length; i < l; ++i ) {
      access( obj, k[ i ], key[ k[ i ] ], fn, true );
    }

    chainable = true;
  } else if ( typeof val !== 'undefined' ) {
    if ( typeof val !== 'function' ) {
      raw = true;
    }

    if ( bulk ) {
      if ( raw ) {
        fn.call( obj, val );
        fn = null;
      } else {
        bulk = fn;

        fn = function ( e, key, val ) {
          return bulk.call( new DOMWrapper( e ), val );
        };
      }
    }

    if ( fn ) {
      for ( i = 0; i < len; ++i ) {
        e = obj[ i ];

        if ( raw ) {
          fn( e, key, val, true );
        } else {
          fn( e, key, val.call( e, i, fn( e, key ) ), true );
        }
      }
    }

    chainable = true;
  }

  if ( chainable ) {
    return obj;
  }

  if ( bulk ) {
    return fn.call( obj );
  }

  if ( len ) {
    return fn( obj[ 0 ], key );
  }

  return null;
}

module.exports = access;

},{"./DOMWrapper":1,"./keys":124,"./type":152}],22:[function(require,module,exports){
'use strict';

/**
 * @property {Object} headers
 * @property {number} timeout
 * @property {string} method
 */
module.exports = {

  /**
   * A request headers.
   */
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },

  /**
   * A timeout for cancel a request.
   */
  timeout: 1000 * 60,

  /**
   * A request method: 'GET', 'POST' (others are ignored, instead, 'GET' will be used).
   */
  method: 'GET'
};

},{}],23:[function(require,module,exports){
'use strict';

if ( typeof qs === 'undefined' ) {
  var qs;

  try {
    qs = require( 'qs' );
  } catch ( error ) {}
}

var _options = require( './ajax-options' );
var defaults = require( './defaults' );
var hasOwnProperty = {}.hasOwnProperty;

/**
 * Cross-browser XMLHttpRequest: https://stackoverflow.com/a/2557268
 * @private
 */
function createHTTPRequest () {
  var HTTPFactories; var i;

  HTTPFactories = [
    function () {
      return new XMLHttpRequest();
    },

    function () {
      return new ActiveXObject( 'Msxml3.XMLHTTP' );
    },

    function () {
      return new ActiveXObject( 'Msxml2.XMLHTTP.6.0' );
    },

    function () {
      return new ActiveXObject( 'Msxml2.XMLHTTP.3.0' );
    },

    function () {
      return new ActiveXObject( 'Msxml2.XMLHTTP' );
    },

    function () {
      return new ActiveXObject( 'Microsoft.XMLHTTP' );
    }
  ];

  for ( i = 0; i < HTTPFactories.length; ++i ) {
    try {
      return ( createHTTPRequest = HTTPFactories[ i ] )();
    } catch ( ex ) {}
  }

  throw Error( 'cannot create XMLHttpRequest object' );
}

/**
 * @method peako.ajax
 * @param  {string|object} path              A URL or options.
 * @param  {object}        [options]         An options.
 * @param  {string}        [options.path]    A URL.
 * @param  {string}        [options.method]  A request method. If no present GET or POST will be
 *                                           used.
 * @param  {boolean}       [options.async]   Default to `true` when options specified, or `false`
 *                                           when no options.
 * @param  {function}      [options.success] Will be called when a server respond with 2xx status
 *                                           code.
 * @param  {function}      [options.error]   Will be called when a server respond with other status
 *                                           code or an error occurs while parsing response.
 * @return {string?}                         Returns a response data if a request was synchronous
 *                                                   otherwise `null`.
 * @example <caption>Synchronous (do not use) GET request</caption>
 * var data = ajax('./data.json');
 * @example <caption>Synchronous (do not use) GET request, with callbacks</caption>
 * var data = ajax('./data.json', {
 *   success: success,
 *   async:   false
 * });
 *
 * function success(sameData) {
 *   console.log(sameData);
 * }
 * @example <caption>Asynchronous POST request</caption>
 * function success(response) {
 *   console.log(response);
 * }
 *
 * function error(message) {
 *   console.error(message || this.status + ': ' + this.statusText);
 * }
 *
 * var headers = {
 *   'Content-Type': 'application/json'
 * };
 *
 * var data = {
 *   username: document.forms.signup.elements.username.value,
 *   gender:   document.forms.signup.elements.gender.value
 * }
 *
 * ajax('/api/signup/?step=0', {
 *   headers: headers,
 *   success: success,
 *   error:   error,
 *   data:    data
 * });
 */
function ajax ( path, options ) {
  var timeoutId = null;
  var data = null;
  var xhr = createHTTPRequest();
  var reqContentType;
  var method;
  var async;
  var name;

  // _.ajax( options );
  // async = options.async || true
  if ( typeof path !== 'string' ) {
    options = defaults( _options, path );
    async = ! ( 'async' in options ) || options.async;
    path = options.path;

  // _.ajax( path );
  // async = false
  } else if ( typeof options === 'undefined' || options === null ) {
    options = _options;
    async = false;

  // _.ajax( path, options );
  // async = options.async || true
  } else {
    options = defaults( _options, options );
    async = ! ( 'async' in options ) || options.async;
  }

  xhr.onreadystatechange = function () {
    var resContentType;
    var status;
    var object;
    var error;

    if ( this.readyState !== 4 ) {
      return;
    }

    status = this.status === 1223 // eslint-disable-line no-ternary
      ? 204
      : this.status;

    resContentType = this.getResponseHeader( 'content-type' );

    object = {
      status: status,
      path: path
    };

    data = this.responseText;

    if ( resContentType ) {
      try {
        if ( ! resContentType.indexOf( 'application/json' ) ) {
          data = JSON.parse( data );
        } else if ( ! resContentType.indexOf( 'application/x-www-form-urlencoded' ) ) {
          data = qs.parse( data );
        }
      } catch ( _error ) {
        error = true;
      }
    }

    if ( ! error && status >= 200 && status < 300 ) {
      if ( timeoutId !== null ) {
        clearTimeout( timeoutId );
      }

      if ( options.success ) {
        options.success.call( this, data, object );
      }
    } else if ( options.error ) {
      options.error.call( this, data, object );
    }
  };

  method = options.method;

  if ( typeof method === 'undefined' ) {
    method = 'data' in options // eslint-disable-line no-ternary
      ? 'POST'
      : 'GET';
  }

  xhr.open( method, path, async );

  if ( options.headers ) {
    for ( name in options.headers ) {
      if ( ! hasOwnProperty.call( options.headers, name ) ) {
        continue;
      }

      if ( name.toLowerCase() === 'content-type' ) {
        reqContentType = options.headers[ name ];
      }

      xhr.setRequestHeader( name, options.headers[ name ] );
    }
  }

  if ( async && typeof options.timeout !== 'undefined' && options.timeout !== null ) {
    timeoutId = setTimeout( function () {
      xhr.abort();
    }, options.timeout );
  }

  if ( typeof reqContentType !== 'undefined' && reqContentType !== null && 'data' in options ) {
    if ( ! reqContentType.indexOf( 'application/json' ) ) {
      xhr.send( JSON.stringify( options.data ) );
    } else if ( ! reqContentType.indexOf( 'application/x-www-form-urlencoded' ) ) {
      xhr.send( qs.stringify( options.data ) );
    } else {
      xhr.send( options.data );
    }
  } else {
    xhr.send();
  }

  return data;
}

module.exports = ajax;

},{"./ajax-options":22,"./defaults":66,"qs":"qs"}],24:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-assign' )( require( './keys-in' ) );

},{"./create/create-assign":51,"./keys-in":123}],25:[function(require,module,exports){
'use strict';

module.exports = Object.assign || require( './create/create-assign' )( require( './keys' ) );

},{"./create/create-assign":51,"./keys":124}],26:[function(require,module,exports){
'use strict';

module.exports = function baseAssign ( obj, src, k ) {
  var i;
  var l;

  for ( i = 0, l = k.length; i < l; ++i ) {
    obj[ k[ i ] ] = src[ k[ i ] ];
  }
};

},{}],27:[function(require,module,exports){
'use strict';

var isset = require( '../isset' );

module.exports = function baseCloneArray ( iterable ) {
  var i = iterable.length;
  var clone = Array( i );

  while ( --i >= 0 ) {
    if ( isset( i, iterable ) ) {
      clone[ i ] = iterable[ i ];
    }
  }

  return clone;
};

},{"../isset":120}],28:[function(require,module,exports){
'use strict';

module.exports = function ( target, source ) {
  for ( var i = source.length - 1; i >= 0; --i ) {
    target[ i ] = source[ i ];
  }
};

},{}],29:[function(require,module,exports){
'use strict';

module.exports = function baseExec ( regexp, string ) {
  var result = [];
  var value;

  regexp.lastIndex = 0;

  while ( ( value = regexp.exec( string ) ) ) {
    result.push( value );
  }

  return result;
};

},{}],30:[function(require,module,exports){
'use strict';

var callIteratee = require( '../internal/call-iteratee' );
var isset        = require( '../isset' );

module.exports = function baseForEach ( arr, fn, ctx, fromRight ) {
  var idx;
  var i;
  var j;

  for ( i = -1, j = arr.length - 1; j >= 0; --j ) {
    if ( fromRight ) {
      idx = j;
    } else {
      idx = ++i;
    }

    if ( isset( idx, arr ) && callIteratee( fn, ctx, arr[ idx ], idx, arr ) === false ) {
      break;
    }
  }

  return arr;
};

},{"../internal/call-iteratee":91,"../isset":120}],31:[function(require,module,exports){
'use strict';

var callIteratee = require( '../internal/call-iteratee' );

module.exports = function baseForIn ( obj, fn, ctx, fromRight, keys ) {
  var key;
  var i;
  var j;

  for ( i = -1, j = keys.length - 1; j >= 0; --j ) {
    if ( fromRight ) {
      key = keys[ j ];
    } else {
      key = keys[ ++i ];
    }

    if ( callIteratee( fn, ctx, obj[ key ], key, obj ) === false ) {
      break;
    }
  }

  return obj;
};

},{"../internal/call-iteratee":91}],32:[function(require,module,exports){
'use strict';

var isset = require( '../isset' );

module.exports = function baseGet ( obj, path, off ) {
  var i = 0;
  var l = path.length - off;
  var key;

  for ( ; i < l; ++i ) {
    key = path[ i ];

    if ( isset( key, obj ) ) {
      obj = obj[ key ];
    } else {
      return;
    }
  }

  return obj;
};

},{"../isset":120}],33:[function(require,module,exports){
'use strict';

var isset = require( '../isset' );

module.exports = function baseHas ( obj, path ) {
  var i = 0;
  var l = path.length;
  var key;

  for ( ; i < l; ++i ) {
    key = path[ i ];

    if ( isset( key, obj ) ) {
      obj = obj[ key ];
    } else {
      return false;
    }
  }

  return true;
};

},{"../isset":120}],34:[function(require,module,exports){
'use strict';

// var baseToIndex = require( './base-to-index' );

/**
 * @private
 * @method baseIndexOf
 * @param  {object}  array
 * @param  {any}     value
 * @param  {number?} fromIndex
 * @param  {boolean} fromRight
 * @return {number}
 */
module.exports = function baseIndexOf ( array, value, fromIndex, fromRight ) {
  // if ( typeof fromIndex === 'undefined' ) {
  //   fromIndex = fromRight
  //     ? array.length - 1
  //     : 0;
  // } else {
  //   fromIndex = baseToIndex( fromIndex, array.length );
  // }

  if ( value === value ) {
    // eslint-disable-next-line no-ternary
    return fromRight
      ? Array.prototype.lastIndexOf.call( array, value )
      : Array.prototype.indexOf.call( array, value );
  }

  for ( var l = array.length - 1, i = l; i >= 0; --i ) {
    // eslint-disable-next-line no-ternary
    var index = fromRight
      ? i
      : l - i;

    if ( array[ index ] === value || value !== value && array[ index ] !== array[ index ] ) {
      return index;
    }
  }

  return -1;
};

},{}],35:[function(require,module,exports){
'use strict';

var get = require( './base-get' );

module.exports = function baseInvoke ( object, path, args ) {
  if ( object !== null && typeof object !== 'undefined' ) {
    if ( path.length <= 1 ) {
      return object[ path[ 0 ] ].apply( object, args );
    }

    if ( ( object = get( object, path, 1 ) ) ) {
      return object[ path[ path.length - 1 ] ].apply( object, args );
    }
  }
};

},{"./base-get":32}],36:[function(require,module,exports){
'use strict';

var get = require( './base-get' );

module.exports = function baseProperty ( object, path ) {
  if ( object !== null && typeof object !== 'undefined' ) {
    if ( path.length > 1 ) {
      return get( object, path, 0 );
    }

    return object[ path[ 0 ] ];
  }
};

},{"./base-get":32}],37:[function(require,module,exports){
'use strict';

module.exports = function baseRandom ( lower, upper ) {
  return lower + Math.random() * ( upper - lower );
};

},{}],38:[function(require,module,exports){
'use strict';

var props = require( '../props' );

if ( require( '../support/support-get-attribute' ) ) {
  module.exports = function _removeAttr ( element, key ) {
    element.removeAttribute( key );
  };
} else {
  module.exports = function _removeAttr ( element, key ) {
    delete element[ props[ key ] || key ];
  };
}

},{"../props":138,"../support/support-get-attribute":142}],39:[function(require,module,exports){
'use strict';

var isset = require( '../isset' );

module.exports = function baseSet ( obj, path, val ) {
  var i = 0;
  var l = path.length;
  var key;

  for ( ; i < l; ++i ) {
    key = path[ i ];

    if ( i === l - 1 ) {
      obj = obj[ key ] = val; // eslint-disable-line no-multi-assign
    } else if ( isset( key, obj ) ) {
      obj = obj[ key ];
    } else {
      obj = obj[ key ] = {}; // eslint-disable-line no-multi-assign
    }
  }

  return obj;
};

},{"../isset":120}],40:[function(require,module,exports){
'use strict';

module.exports = function baseValues ( object, keys ) {
  var i = keys.length;
  var values = Array( i );

  while ( --i >= 0 ) {
    values[ i ] = object[ keys[ i ] ];
  }

  return values;
};

},{}],41:[function(require,module,exports){
'use strict';

var _ArgumentException = require( './internal/ArgumentException' );
var defaultTo = require( './default-to' );

module.exports = function before ( n, fn ) {
  var value;

  if ( typeof fn !== 'function' ) {
    throw _ArgumentException( fn, 'a function' );
  }

  n = defaultTo( n, 1 );

  return function () {
    if ( --n >= 0 ) {
      value = fn.apply( this, arguments );
    }

    return value;
  };
};

},{"./default-to":65,"./internal/ArgumentException":90}],42:[function(require,module,exports){
'use strict';

var _processArgs = require( './internal/process-args' );

var _            = require( './placeholder' );

/**
 * Эта расширенная версия стандартного ES5 `Function.bind`, в которой есть поддержка placeholder`ов.
 * @method _.bind
 * @param  {Function} function_   Метод, который надо привязать к контексту (новый this).
 * @param  {any}      thisArg     Контекст (новый this для метода).
 * @param  {...any}   partialArgs Частичные аргументы с {@link _.placeholder}.
 * @return {Function}             Новый, привязанный к новому this метод.
 * @example
 * var bound = _.bind( function_, newThis, _._, '!' );
 */
function bind ( function_, thisArg ) {
  if ( typeof function_ !== 'function' ) {
    throw TypeError( 'in _.bind(), provided "function_" is not a function (' + typeof function_ + ')' );
  }

  var args = arguments;
  var argsLen = args.length;

  // If no partialArgs were provided make a tiny optimization using built-in
  // `Function.bind`.
  if ( argsLen <= 2 ) {
    return Function.prototype.bind.call( function_, thisArg );
  }

  // Skip function_ and thisArg.
  var i = 2;

  // Search for placeholders in the arguments.
  for ( ; i < argsLen; ++i ) {
    if ( args[ i ] === _ ) {
      break;
    }
  }

  // If no placeholders in the partialArgs were provided make a tiny
  // optimization using built-in `Function.bind`.
  if ( i === argsLen ) {
    return Function.prototype.call.apply( Function.prototype.bind, args );
  }

  return function bound () {
    // Call a function with new this (thisArg) and processed arguments.
    return function_.apply( thisArg, _processArgs( args, arguments ) );
  };
}

module.exports = bind;

},{"./internal/process-args":96,"./placeholder":135}],43:[function(require,module,exports){
'use strict';

var upperFirst = require( './upper-first' );

// camelize( 'background-repeat-x' ); // -> 'backgroundRepeatX'

module.exports = function camelize ( string ) {
  var words = string.match( /[0-9a-z]+/gi );
  var result;
  var i;
  var l;

  if ( ! words ) {
    return '';
  }

  result = words[ 0 ].toLowerCase();

  for ( i = 1, l = words.length; i < l; ++i ) {
    result += upperFirst( words[ i ] );
  }

  return result;
};

},{"./upper-first":154}],44:[function(require,module,exports){
'use strict';

var _unescape = require( './internal/unescape' );
var _type     = require( './internal/type' );

var baseExec  = require( './base/base-exec' );

var isKey     = require( './is-key' );
var toKey     = require( './to-key' );

var rProperty = /(^|\.)\s*([_a-z]\w*)\s*|\[\s*((?:-)?(?:\d+|\d*\.\d+)|("|')(([^\\]\\(\\\\)*|[^\4])*)\4)\s*\]/gi;

function stringToPath ( str ) {
  var path = baseExec( rProperty, str );
  var i = path.length - 1;
  var val;

  for ( ; i >= 0; --i ) {
    val = path[ i ];

    // .name
    if ( val[ 2 ] ) {
      path[ i ] = val[ 2 ];
    // [ "" ] || [ '' ]
    } else if ( typeof val[ 5 ] === 'string' ) {
      path[ i ] = _unescape( val[ 5 ] );
    // [ 0 ]
    } else {
      path[ i ] = val[ 3 ];
    }
  }

  return path;
}

function castPath ( val ) {
  var path;
  var i;
  var l;

  if ( isKey( val ) ) {
    return [ toKey( val ) ];
  }

  if ( _type( val ) === 'array' ) {
    path = Array( l = val.length );

    for ( i = l - 1; i >= 0; --i ) {
      path[ i ] = toKey( val[ i ] );
    }
  } else {
    path = stringToPath( '' + val );
  }

  return path;
}

module.exports = castPath;

},{"./base/base-exec":29,"./internal/type":98,"./internal/unescape":99,"./is-key":107,"./to-key":147}],45:[function(require,module,exports){
'use strict';

/**
 * @method peako.clamp
 * @param  {number} value A number to be clamped.
 * @param  {number} lower Lower bound of the clamp.
 * @param  {number} upper Upper bound of the clamp.
 * @return {number}
 */
module.exports = function clamp ( value, lower, upper ) {
  if ( value >= upper ) {
    return upper;
  }

  if ( value <= lower ) {
    return lower;
  }

  return value;
};

},{}],46:[function(require,module,exports){
'use strict';

var getPrototypeOf = require( './get-prototype-of' );
var isObjectLike   = require( './is-object-like' );
var toObject       = require( './to-object' );
var each           = require( './each' );

module.exports = function clone ( deep, target, guard ) {
  var cln;

  if ( typeof target === 'undefined' || guard ) {
    target = deep;
    deep = true;
  }

  cln = Object.create( getPrototypeOf( target = toObject( target ) ) );

  each( target, function ( value, key, target ) {
    if ( value === target ) {
      this[ key ] = this;
    } else if ( deep && isObjectLike( value ) ) {
      this[ key ] = clone( deep, value );
    } else {
      this[ key ] = value;
    }
  }, cln );

  return cln;
};

},{"./each":68,"./get-prototype-of":85,"./is-object-like":111,"./to-object":148}],47:[function(require,module,exports){
'use strict';

var closest = require( './closest' );

module.exports = function closestNode ( e, c ) {
  if ( typeof c === 'string' ) {
    return closest.call( e, c );
  }

  do {
    if ( e === c ) {
      return e;
    }
  } while ( ( e = e.parentNode ) );

  return null;
};

},{"./closest":48}],48:[function(require,module,exports){
'use strict';

var matches = require( './matches-selector' );

var closest;

if ( typeof Element === 'undefined' || ! ( closest = Element.prototype.closest ) ) {
  closest = function closest ( selector ) {
    var element = this;

    do {
      if ( matches.call( element, selector ) ) {
        return element;
      }
    } while ( ( element = element.parentElement ) );

    return null;
  };
}

module.exports = closest;

},{"./matches-selector":127}],49:[function(require,module,exports){
'use strict';

module.exports = function compound ( functions ) {
  return function compounded () {
    var value;
    var i;
    var l;

    for ( i = 0, l = functions.length; i < l; ++i ) {
      value = functions[ i ].apply( this, arguments );
    }

    return value;
  };
};

},{}],50:[function(require,module,exports){
'use strict';

module.exports = {
  ERR: {
    INVALID_ARGS:          'Invalid arguments',
    FUNCTION_EXPECTED:     'Expected a function',
    STRING_EXPECTED:       'Expected a string',
    UNDEFINED_OR_NULL:     'Cannot convert undefined or null to object',
    REDUCE_OF_EMPTY_ARRAY: 'Reduce of empty array with no initial value',
    NO_PATH:               'No path was given'
  },

  MAX_ARRAY_LENGTH: 4294967295,
  MAX_SAFE_INT:     9007199254740991,
  MIN_SAFE_INT:    -9007199254740991,

  DEEP:         1,
  DEEP_KEEP_FN: 2
};

},{}],51:[function(require,module,exports){
'use strict';

var baseAssign = require( '../base/base-assign' );
var ERR        = require( '../constants' ).ERR;

module.exports = function createAssign ( keys ) {
  return function assign ( obj ) {
    var src;
    var l;
    var i;

    if ( obj === null || typeof obj === 'undefined' ) {
      throw TypeError( ERR.UNDEFINED_OR_NULL );
    }

    for ( i = 1, l = arguments.length; i < l; ++i ) {
      src = arguments[ i ];

      if ( src !== null && typeof src !== 'undefined' ) {
        baseAssign( obj, src, keys( src ) );
      }
    }

    return obj;
  };
};

},{"../base/base-assign":26,"../constants":50}],52:[function(require,module,exports){
'use strict';

var baseForEach  = require( '../base/base-for-each' );
var baseForIn    = require( '../base/base-for-in' );
var isArrayLike  = require( '../is-array-like' );
var toObject     = require( '../to-object' );
var iteratee     = require( '../iteratee' ).iteratee;
var keys         = require( '../keys' );

module.exports = function createEach ( fromRight ) {
  return function each ( obj, fn, ctx ) {

    obj = toObject( obj );

    fn  = iteratee( fn );

    if ( isArrayLike( obj ) ) {
      return baseForEach( obj, fn, ctx, fromRight );
    }

    return baseForIn( obj, fn, ctx, fromRight, keys( obj ) );

  };
};

},{"../base/base-for-each":30,"../base/base-for-in":31,"../is-array-like":103,"../iteratee":122,"../keys":124,"../to-object":148}],53:[function(require,module,exports){
'use strict';

module.exports = function createEscape ( regexp, map ) {
  function replacer ( c ) {
    return map[ c ];
  }

  return function escape ( string ) {
    if ( string === null || typeof string === 'undefined' ) {
      return '';
    }

    return ( string += '' ).replace( regexp, replacer );
  };
};

},{}],54:[function(require,module,exports){
'use strict';

var callIteratee = require( '../internal/call-iteratee' );
var toObject     = require( '../to-object' );
var iterable     = require( '../iterable' );
var iteratee     = require( '../iteratee' ).iteratee;
var isset        = require( '../isset' );

module.exports = function createFind ( returnIndex, fromRight ) {
  return function find ( arr, fn, ctx ) {
    var j = ( arr = iterable( toObject( arr ) ) ).length - 1;
    var i = -1;
    var idx;
    var val;

    fn = iteratee( fn );

    for ( ; j >= 0; --j ) {
      if ( fromRight ) {
        idx = j;
      } else {
        idx = ++i;
      }

      val = arr[ idx ];

      if ( isset( idx, arr ) && callIteratee( fn, ctx, val, idx, arr ) ) {
        if ( returnIndex ) {
          return idx;
        }

        return val;
      }
    }

    if ( returnIndex ) {
      return -1;
    }
  };
};

},{"../internal/call-iteratee":91,"../isset":120,"../iterable":121,"../iteratee":122,"../to-object":148}],55:[function(require,module,exports){
'use strict';

var ERR = require( '../constants' ).ERR;

module.exports = function createFirst ( name ) {
  return function ( str ) {
    if ( str === null || typeof str === 'undefined' ) {
      throw TypeError( ERR.UNDEFINED_OR_NULL );
    }

    return ( str += '' ).charAt( 0 )[ name ]() + str.slice( 1 );
  };
};

},{"../constants":50}],56:[function(require,module,exports){
'use strict';

var baseForEach = require( '../base/base-for-each' );
var toObject    = require( '../to-object' );
var iteratee    = require( '../iteratee' ).iteratee;
var iterable    = require( '../iterable' );

module.exports = function createForEach ( fromRight ) {
  return function forEach ( arr, fn, ctx ) {
    return baseForEach( iterable( toObject( arr ) ), iteratee( fn ), ctx, fromRight );
  };
};

},{"../base/base-for-each":30,"../iterable":121,"../iteratee":122,"../to-object":148}],57:[function(require,module,exports){
'use strict';

var baseForIn = require( '../base/base-for-in' );
var toObject  = require( '../to-object' );
var iteratee  = require( '../iteratee' ).iteratee;

module.exports = function createForIn ( keys, fromRight ) {
  return function forIn ( obj, fn, ctx ) {
    return baseForIn( obj = toObject( obj ), iteratee( fn ), ctx, fromRight, keys( obj ) );
  };
};

},{"../base/base-for-in":31,"../iteratee":122,"../to-object":148}],58:[function(require,module,exports){
'use strict';

/**
 * @param {string} name Must be 'Width' or 'Height' (capitalized).
 */
module.exports = function createGetElementDimension ( name ) {
  /**
   * @param {Window|Node} e
   */
  return function ( e ) {
    var v;
    var b;
    var d;

    // if the element is a window

    if ( e.window === e ) {

      // innerWidth and innerHeight includes a scrollbar width, but it is not
      // supported by older browsers

      v = Math.max( e[ 'inner' + name ] || 0, e.document.documentElement[ 'client' + name ] );

    // if the elements is a document

    } else if ( e.nodeType === 9 ) {

      b = e.body;
      d = e.documentElement;

      v = Math.max(
        b[ 'scroll' + name ],
        d[ 'scroll' + name ],
        b[ 'offset' + name ],
        d[ 'offset' + name ],
        b[ 'client' + name ],
        d[ 'client' + name ] );

    } else {
      v = e[ 'client' + name ];
    }

    return v;
  };
};

},{}],59:[function(require,module,exports){
'use strict';

var baseIndexOf = require( '../base/base-index-of' );

var toObject    = require( '../to-object' );

/**
 * @private
 * @method createIndexOf
 * @param  {boolean}  fromRight
 * @return {function}
 */
module.exports = function createIndexOf ( fromRight ) {
  return function indexOf ( array, value, fromIndex ) {
    return baseIndexOf( toObject( array ), value, fromIndex, fromRight );
  };
};

},{"../base/base-index-of":34,"../to-object":148}],60:[function(require,module,exports){
'use strict';

var castPath = require( '../cast-path' );

module.exports = function createPropertyOf ( baseProperty, useArgs ) {
  return function ( object ) {
    var args;

    if ( useArgs ) {
      args = Array.prototype.slice.call( arguments, 1 );
    }

    return function ( path ) {
      if ( ( path = castPath( path ) ).length ) {
        return baseProperty( object, path, args );
      }
    };
  };
};

},{"../cast-path":44}],61:[function(require,module,exports){
'use strict';

var castPath = require( '../cast-path' );
var noop     = require( '../noop' );

module.exports = function createProperty ( baseProperty, useArgs ) {
  return function ( path ) {
    var args;

    if ( ! ( path = castPath( path ) ).length ) {
      return noop;
    }

    if ( useArgs ) {
      args = Array.prototype.slice.call( arguments, 1 );
    }

    return function ( object ) {
      return baseProperty( object, path, args );
    };
  };
};

},{"../cast-path":44,"../noop":131}],62:[function(require,module,exports){
'use strict';

var _words = require( '../internal/words' );

module.exports = function _createRemoveProp ( _removeProp ) {
  return function ( keys ) {
    var element;
    var i;
    var j;

    if ( typeof keys === 'string'  ) {
      keys = _words( keys );
    }

    for ( i = this.length - 1; i >= 0; --i ) {
      if ( ( element = this[ i ] ).nodeType !== 1 ) {
        continue;
      }

      for ( j = keys.length - 1; j >= 0; --j ) {
        _removeProp( element, keys[ j ] );
      }
    }

    return this;
  };
};

},{"../internal/words":100}],63:[function(require,module,exports){
'use strict';

var ERR = require( '../constants' ).ERR;

module.exports = function createTrim ( regexp ) {
  return function trim ( string ) {
    if ( string === null || typeof string === 'undefined' ) {
      throw TypeError( ERR.UNDEFINED_OR_NULL );
    }

    return ( '' + string ).replace( regexp, '' );
  };
};

},{"../constants":50}],64:[function(require,module,exports){
'use strict';

var _ArgumentException = require( './internal/ArgumentException' );

module.exports = function debounce ( maxWait, fn ) {
  var timeoutId = null;

  if ( typeof fn !== 'function' ) {
    throw _ArgumentException( fn, 'a function' );
  }

  function debounced () {
    if ( timeoutId !== null ) {
      clearTimeout( timeoutId );
    }

    if ( arguments.length ) {
      timeoutId = setTimeout.apply( null, [ fn, maxWait ].concat( [].slice.call( arguments ) ) );
    } else {
      timeoutId = setTimeout( fn, maxWait );
    }
  }

  function cancel () {
    if ( timeoutId !== null ) {
      clearTimeout( timeoutId );
      timeoutId = null;
    }
  }

  return {
    debounced: debounced,
    cancel:    cancel
  };
};

},{"./internal/ArgumentException":90}],65:[function(require,module,exports){
'use strict';

module.exports = function defaultTo ( value, defaultValue ) {
  if ( value !== null && typeof value !== 'undefined' && value === value ) {
    return value;
  }

  return defaultValue;
};

},{}],66:[function(require,module,exports){
'use strict';

var mixin = require( './mixin' );

function defaults ( defaults, object ) {
  if ( object ) {
    return mixin( {}, defaults, object );
  }

  return mixin( {}, defaults );
}

module.exports = defaults;

},{"./mixin":130}],67:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-each' )( true );

},{"./create/create-each":52}],68:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-each' )();

},{"./create/create-each":52}],69:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-escape' )( /[<>"'&]/g, {
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&#34;',
  '&': '&amp;'
} );

},{"./create/create-escape":53}],70:[function(require,module,exports){
'use strict';

var closestNode = require( './closest-node' );
var DOMWrapper  = require( './DOMWrapper' );
var Event       = require( './Event' );

var events = {
  items: {},
  types: []
};

var support = typeof self !== 'undefined' && 'addEventListener' in self;

/**
 * @method peako.events.on
 * @param  {Node}     element
 * @param  {string}   type
 * @param  {string?}  selector
 * @param  {function} listener
 * @param  {boolean}  useCapture
 * @param  {boolean}  [once]
 * @return {void}
 * @example
 * _.events.on( document, 'click', '.post__like-button', ( event ) => {
 *   const data = {
 *     id: _( this ).parent( '.post' ).data( 'id' )
 *   }
 *
 *   _.ajax( '/like', { data } )
 * }, false )
 */
exports.on = function on ( element, type, selector, listener, useCapture, once ) {
  var item = {
    useCapture: useCapture,
    listener: listener,
    element: element,
    once: once
  };

  if ( selector ) {
    item.selector = selector;
  }

  if ( support ) {
    item.wrapper = function wrapper ( event, _element ) {
      if ( selector && ! _element && ! ( _element = closestNode( event.target, selector ) ) ) {
        return;
      }

      if ( once ) {
        exports.off( element, type, selector, listener, useCapture );
      }

      listener.call( _element || element, new Event( event ) );
    };

    element.addEventListener( type, item.wrapper, useCapture );
  } else if ( typeof listener === 'function' ) {
    item.wrapper = function wrapper ( event, _element ) {
      if ( selector && ! _element && ! ( _element = closestNode( event.target, selector ) ) ) {
        return;
      }

      if ( type === 'DOMContentLoaded' && element.readyState !== 'complete' ) {
        return;
      }

      if ( once ) {
        exports.off( element, type, selector, listener, useCapture );
      }

      listener.call( _element || element, new Event( event, type ) );
    };

    element.attachEvent( item.IEType = IEType( type ), item.wrapper );
  } else {
    throw TypeError( 'not implemented' );
  }

  if ( events.items[ type ] ) {
    events.items[ type ].push( item );
  } else {
    events.items[ type ] = [ item ];
    events.items[ type ].index = events.types.length;
    events.types.push( type );
  }
};

/**
 * @method peako.events.off
 * @param  {Node}     element
 * @param  {string}   type
 * @param  {string}   selector
 * @param  {function} listener
 * @param  {boolean}  useCapture
 * @return {void}
 */
exports.off = function off ( element, type, selector, listener, useCapture ) {
  var items;
  var item;
  var i;

  if ( type === null || typeof type === 'undefined' ) {
    for ( i = events.types.length - 1; i >= 0; --i ) {
      exports.off( element, events.types[ i ], selector );
    }

    return;
  }

  if ( ! ( items = events.items[ type ] ) ) {
    return;
  }

  for ( i = items.length - 1; i >= 0; --i ) {
    item = items[ i ];

    if ( item.element !== element ||
      typeof listener !== 'undefined' && (
        item.listener !== listener ||
        item.useCapture !== useCapture ||
        // todo: check both item.selector and selector and then compare
        item.selector && item.selector !== selector ) )
    { // eslint-disable-line brace-style
      continue;
    }

    items.splice( i, 1 );

    if ( ! items.length ) {
      events.types.splice( items.index, 1 );
      events.items[ type ] = null;
    }

    if ( support ) {
      element.removeEventListener( type, item.wrapper, item.useCapture );
    } else {
      element.detachEvent( item.IEType, item.wrapper );
    }
  }
};

exports.trigger = function trigger ( element, type, data ) {
  var items = events.items[ type ];
  var closest;
  var item;
  var i;

  if ( ! items ) {
    return;
  }

  for ( i = 0; i < items.length; ++i ) {
    item = items[ i ];

    if ( element ) {
      closest = closestNode( element, item.selector || item.element );
    } else if ( item.selector ) {
      new DOMWrapper( item.selector ).each( ( function ( item ) {
        return function () {
          item.wrapper( createEventWithTarget( type, data, this ), this );
        };
      } )( item ) );

      continue;
    } else {
      closest = item.element;
    }

    if ( closest ) {
      item.wrapper( createEventWithTarget( type, data, element || closest ), closest );
    }
  }
};

exports.copy = function copy ( target, source, deep ) {
  var items;
  var item;
  var type;
  var i;
  var j;
  var l;

  for ( i = events.types.length - 1; i >= 0; --i ) {
    if ( ( items = events.items[ type = events.types[ i ] ] ) ) {
      for ( j = 0, l = items.length; j < l; ++j ) {
        if ( ( item = items[ j ] ).target === source ) {
          exports.on( target, type, null, item.listener, item.useCapture, item.once );
        }
      }
    }
  }

  if ( ! deep ) {
    return;
  }

  target = target.childNodes;
  source = source.childNodes;

  for ( i = target.length - 1; i >= 0; --i ) {
    exports.copy( target[ i ], source[ i ], true );
  }
};

function createEventWithTarget ( type, data, target ) {
  var e = new Event( type, data );
  e.target = target;
  return e;
}

function IEType ( type ) {
  if ( type === 'DOMContentLoaded' ) {
    return 'onreadystatechange';
  }

  return 'on' + type;
}

},{"./DOMWrapper":1,"./Event":19,"./closest-node":47}],71:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( true );

},{"./create/create-find":54}],72:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( true, true );

},{"./create/create-find":54}],73:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( false, true );

},{"./create/create-find":54}],74:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )();

},{"./create/create-find":54}],75:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-each' )( true );

},{"./create/create-for-each":56}],76:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-each' )();

},{"./create/create-for-each":56}],77:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys-in' ), true );

},{"./create/create-for-in":57,"./keys-in":123}],78:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys-in' ) );

},{"./create/create-for-in":57,"./keys-in":123}],79:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys' ), true );

},{"./create/create-for-in":57,"./keys":124}],80:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys' ) );

},{"./create/create-for-in":57,"./keys":124}],81:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

var wrappers = {
  col:      [ 2, '<table><colgroup>', '</colgroup></table>' ],
  tr:       [ 2, '<table><tbody>', '</tbody></table>' ],
  defaults: [ 0, '', '' ]
};

function append ( fragment, elements ) {
  for ( var i = 0, l = elements.length; i < l; ++i ) {
    fragment.appendChild( elements[ i ] );
  }
}

module.exports = function fragment ( elements, context ) {
  var fragment = context.createDocumentFragment();
  var element;
  var wrapper;
  var tag;
  var div;
  var i;
  var j;
  var l;

  for ( i = 0, l = elements.length; i < l; ++i ) {
    element = elements[ i ];

    if ( isObjectLike( element ) ) {
      if ( 'nodeType' in element ) {
        fragment.appendChild( element );
      } else {
        append( fragment, element );
      }
    } else if ( /<|&#?\w+;/.test( element ) ) {
      if ( ! div ) {
        div = context.createElement( 'div' );
      }

      tag = /<([a-z][^\s>]*)/i.exec( element );

      if ( tag ) {
        wrapper = wrappers[ tag = tag[ 1 ] ] || wrappers[ tag.toLowerCase() ] || wrappers.defaults;
      } else {
        wrapper = wrappers.defaults;
      }

      div.innerHTML = wrapper[ 1 ] + element + wrapper[ 2 ];

      for ( j = wrapper[ 0 ]; j > 0; --j ) {
        div = div.lastChild;
      }

      append( fragment, div.childNodes );
    } else {
      fragment.appendChild( context.createTextNode( element ) );
    }
  }

  if ( div ) {
    div.innerHTML = '';
  }

  return fragment;
};

},{"./is-object-like":111}],82:[function(require,module,exports){
'use strict';

module.exports = function fromPairs ( pairs ) {
  var object = {};
  var i;
  var l;

  for ( i = 0, l = pairs.length; i < l; ++i ) {
    object[ pairs[ i ][ 0 ] ] = pairs[ i ][ 1 ];
  }

  return object;
};

},{}],83:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-get-element-dimension' )( 'Height' );

},{"./create/create-get-element-dimension":58}],84:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-get-element-dimension' )( 'Width' );

},{"./create/create-get-element-dimension":58}],85:[function(require,module,exports){
'use strict';

var ERR = require( './constants' ).ERR;

module.exports = Object.getPrototypeOf || function getPrototypeOf ( obj ) {
  var prototype;

  if ( obj === null || typeof obj === 'undefined' ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  prototype = obj.__proto__;

  if ( typeof prototype !== 'undefined' ) {
    return prototype;
  }

  if ( Object.prototype.toString.call( obj.constructor ) === '[object Function]' ) {
    return obj.constructor.prototype;
  }

  return obj;
};

},{"./constants":50}],86:[function(require,module,exports){
'use strict';

var castPath = require( './cast-path' );
var toObject = require( './to-object' );
var baseGet  = require( './base/base-get' );
var ERR      = require( './constants' ).ERR;

module.exports = function get ( object, path ) {
  var length = ( path = castPath( path ) ).length;

  if ( ! length ) {
    throw Error( ERR.NO_PATH );
  }

  if ( length > 1 ) {
    return baseGet( toObject( object ), path, 0 );
  }

  return toObject( object )[ path[ 0 ] ];
};

},{"./base/base-get":32,"./cast-path":44,"./constants":50,"./to-object":148}],87:[function(require,module,exports){
'use strict';

var castPath = require( './cast-path' );
var toObject = require( './to-object' );
var isset    = require( './isset' );
var baseHas  = require( './base/base-has' );
var ERR      = require( './constants' ).ERR;

module.exports = function has ( obj, path ) {
  var l = ( path = castPath( path ) ).length;

  if ( ! l ) {
    throw Error( ERR.NO_PATH );
  }

  if ( l > 1 ) {
    return baseHas( toObject( obj ), path );
  }

  return isset( toObject( obj ), path[ 0 ] );
};

},{"./base/base-has":33,"./cast-path":44,"./constants":50,"./isset":120,"./to-object":148}],88:[function(require,module,exports){
'use strict';

module.exports = function identity ( v ) {
  return v;
};

},{}],89:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-index-of' )();

},{"./create/create-index-of":59}],90:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString;

module.exports = function _ArgumentException ( unexpected, expected ) {
  return Error( '"' + toString.call( unexpected ) + '" is not ' + expected );
};

},{}],91:[function(require,module,exports){
'use strict';

module.exports = function callIteratee ( fn, ctx, val, key, obj ) {
  if ( typeof ctx === 'undefined' ) {
    return fn( val, key, obj );
  }

  return fn.call( ctx, val, key, obj );
};

},{}],92:[function(require,module,exports){
'use strict';

module.exports = {
  animationIterationCount: true,
  columnCount: true,
  fillOpacity: true,
  flexShrink: true,
  fontWeight: true,
  lineHeight: true,
  flexGrow: true,
  opacity: true,
  orphans: true,
  widows: true,
  zIndex: true,
  order: true,
  zoom: true
};

},{}],93:[function(require,module,exports){
'use strict';

module.exports = function _first ( wrapper, element ) {
  wrapper[ 0 ] = element;
  wrapper.length = 1;
};

},{}],94:[function(require,module,exports){
'use strict';

/**
 * @private
 * @method _getStyle
 * @param  {object}  element
 * @param  {string}  style
 * @param  {object} [computedStyle]
 * @return {string}
 */
module.exports = function _getStyle ( element, style, computedStyle ) {
  return element.style[ style ] ||
    ( computedStyle || getComputedStyle( element ) ).getPropertyValue( style );
};

},{}],95:[function(require,module,exports){
'use strict';

/**
 * @private
 * @method _memoize
 * @param  {function} function_
 * @return {function}
 */
module.exports = function _memoize ( function_ ) {
  var called = false;
  var lastResult;
  var lastValue;

  return function memoized ( value ) {
    switch ( false ) {
      case called:
        called = true;
        // falls through
      case value === lastValue:
        return ( lastResult = function_( ( lastValue = value ) ) );
    }

    return lastResult;
  };
};

},{}],96:[function(require,module,exports){
'use strict';

var _ = require( '../placeholder' );

/**
 * Этот метод возращает один массив аргументов из частичных аргументов с placeholder`ами, и
 * аргументов которые были при вызове.
 * @private
 * @method _processArgs
 * @param  {Array.<any>} partialArgs Частичные аргументы с placeholder`ами ('peako/placeholder').
 * @param  {Array.<any>} args        Аргументы вызова какого-либо метода.
 * @return {Array.<any>}             Обработанные аргументы.
 * @example
 * var args = _processArgs( [ _, '!' ], [ 'John' ] );
 */
function _processArgs ( partialArgs, args ) {
  var result = [];
  var j = -1;
  // Skip function_ and thisArg.
  var i = 2;
  var length = partialArgs.length;

  for ( ; i < length; ++i ) {
    if ( partialArgs[ i ] === _ ) {
      result.push( args[ ++j ] );
    } else {
      result.push( partialArgs[ i ] );
    }
  }

  for ( length = args.length; j < length; ++j ) {
    result.push( args[ j ] );
  }

  return result;
}

module.exports = _processArgs;

},{"../placeholder":135}],97:[function(require,module,exports){
'use strict';

var escape = require( '../escape' );

module.exports = function _textContent ( element, value ) {
  var result = '';
  var children;
  var child;
  var type;
  var i;
  var l;

  if ( typeof value !== 'undefined' ) {
    element.innerHTML = escape( value );
    return;
  }

  for ( i = 0, l = ( children = element.childNodes ).length; i < l; ++i ) {
    // TEXT_NODE
    if ( ( type = ( child = children[ i ] ).nodeType ) === 3 ) {
      result += child.nodeValue;
    // ELEMENT_NODE
    } else if ( type === 1 ) {
      result += _textContent( child );
    }
  }

  return result;
};

},{"../escape":69}],98:[function(require,module,exports){
'use strict';

module.exports = require( './memoize' )( require( '../type' ) );

},{"../type":152,"./memoize":95}],99:[function(require,module,exports){
'use strict';

module.exports = function _unescape ( string ) {
  return string.replace( /\\(\\)?/g, '$1' );
};

},{}],100:[function(require,module,exports){
'use strict';

var _ArgumentException = require( './ArgumentException' );

module.exports = function words ( string ) {
  if ( typeof string !== 'string' ) {
    throw _ArgumentException( string, 'a string' );
  }

  return string.match( /[^\s\uFEFF\xA0]+/g ) || [];
};

},{"./ArgumentException":90}],101:[function(require,module,exports){
'use strict';

var toObject = require( './to-object' );
var keys     = require( './keys' );

module.exports = function invert ( object ) {
  var k = keys( object = toObject( object ) );
  var inverted = {};
  var i;

  for ( i = k.length - 1; i >= 0; --i ) {
    inverted[ k[ i ] ] = object[ k[ i ] ];
  }

  return inverted;
};

},{"./keys":124,"./to-object":148}],102:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );
var isLength     = require( './is-length' );
var isWindowLike = require( './is-window-like' );

module.exports = function isArrayLikeObject ( value ) {
  return isObjectLike( value ) && isLength( value.length ) && ! isWindowLike( value );
};

},{"./is-length":108,"./is-object-like":111,"./is-window-like":118}],103:[function(require,module,exports){
'use strict';

var isLength     = require( './is-length' );
var isWindowLike = require( './is-window-like' );

module.exports = function isArrayLike ( value ) {
  if ( value === null || typeof value === 'undefined' ) {
    return false;
  }

  if ( typeof value === 'object' ) {
    return isLength( value.length ) && ! isWindowLike( value );
  }

  return typeof value === 'string';
};

},{"./is-length":108,"./is-window-like":118}],104:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );
var isLength     = require( './is-length' );

module.exports = Array.isArray || function isArray ( value ) {
  return isObjectLike( value ) &&
    isLength( value.length ) &&
    Object.prototype.toString.call( value ) === '[object Array]';
};

},{"./is-length":108,"./is-object-like":111}],105:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );
var isWindowLike = require( './is-window-like' );

module.exports = function isDOMElement ( value ) {
  var nodeType;

  if ( ! isObjectLike( value ) ) {
    return false;
  }

  if ( isWindowLike( value ) ) {
    return true;
  }

  nodeType = value.nodeType;

  return nodeType === 1 || // ELEMENT_NODE
         nodeType === 3 || // TEXT_NODE
         nodeType === 8 || // COMMENT_NODE
         nodeType === 9 || // DOCUMENT_NODE
         nodeType === 11;  // DOCUMENT_FRAGMENT_NODE
};

},{"./is-object-like":111,"./is-window-like":118}],106:[function(require,module,exports){
'use strict';

var isNumber = require( './is-number' );

module.exports = function isFinite ( value ) {
  return isNumber( value ) && isFinite( value );
};

},{"./is-number":110}],107:[function(require,module,exports){
'use strict';

var _type = require( './internal/type' );

var rDeepKey = /(^|[^\\])(\\\\)*(\.|\[)/;

function isKey ( val ) {
  var type;

  if ( ! val ) {
    return true;
  }

  if ( _type( val ) === 'array' ) {
    return false;
  }

  type = typeof val;

  if ( type === 'number' || type === 'boolean' || _type( val ) === 'symbol' ) {
    return true;
  }

  return ! rDeepKey.test( val );
}

module.exports = isKey;

},{"./internal/type":98}],108:[function(require,module,exports){
'use strict';

var MAX_ARRAY_LENGTH = require( './constants' ).MAX_ARRAY_LENGTH;

module.exports = function isLength ( value ) {
  return typeof value === 'number' &&
    value >= 0 &&
    value <= MAX_ARRAY_LENGTH &&
    value % 1 === 0;
};

},{"./constants":50}],109:[function(require,module,exports){
'use strict';

module.exports = function isNaN ( value ) {
  return value !== value;
};

},{}],110:[function(require,module,exports){
'use strict';

module.exports = function isNumber ( value ) {
  return typeof value === 'number';
};

},{}],111:[function(require,module,exports){
'use strict';

module.exports = function isObjectLike ( value ) {
  return typeof value === 'object' && value !== null;
};

},{}],112:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

var toString = {}.toString;

module.exports = function isObject ( value ) {
  return isObjectLike( value ) && toString.call( value ) === '[object Object]';
};

},{"./is-object-like":111}],113:[function(require,module,exports){
'use strict';

var getPrototypeOf = require( './get-prototype-of' );
var isObject       = require( './is-object' );

var hasOwnProperty = Object.prototype.hasOwnProperty;
var toString = Function.prototype.toString;
var OBJECT = toString.call( Object );

module.exports = function isPlainObject ( v ) {
  var p;
  var c;

  if ( ! isObject( v ) ) {
    return false;
  }

  p = getPrototypeOf( v );

  if ( p === null ) {
    return true;
  }

  if ( ! hasOwnProperty.call( p, 'constructor' ) ) {
    return false;
  }

  c = p.constructor;

  return typeof c === 'function' && toString.call( c ) === OBJECT;
};

},{"./get-prototype-of":85,"./is-object":112}],114:[function(require,module,exports){
'use strict';

module.exports = function isPrimitive ( value ) {
  return ! value || typeof value !== 'object' && typeof value !== 'function';
};

},{}],115:[function(require,module,exports){
'use strict';

var isFinite  = require( './is-finite' );
var constants = require( './constants' );

module.exports = function isSafeInteger ( value ) {
  return isFinite( value ) &&
    value <= constants.MAX_SAFE_INT &&
    value >= constants.MIN_SAFE_INT &&
    value % 1 === 0;
};

},{"./constants":50,"./is-finite":106}],116:[function(require,module,exports){
'use strict';

module.exports = function isString ( value ) {
  return typeof value === 'string';
};

},{}],117:[function(require,module,exports){
'use strict';

var type = require( './type' );

module.exports = function isSymbol ( value ) {
  return type( value ) === 'symbol';
};

},{"./type":152}],118:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

module.exports = function isWindowLike ( value ) {
  return isObjectLike( value ) && value.window === value;
};

},{"./is-object-like":111}],119:[function(require,module,exports){
'use strict';

var isWindowLike = require( './is-window-like' );

var toString = {}.toString;

module.exports = function isWindow ( value ) {
  return isWindowLike( value ) && toString.call( value ) === '[object Window]';
};

},{"./is-window-like":118}],120:[function(require,module,exports){
'use strict';

module.exports = function isset ( key, obj ) {
  if ( obj === null || typeof obj === 'undefined' ) {
    return false;
  }

  return typeof obj[ key ] !== 'undefined' || key in obj;
};

},{}],121:[function(require,module,exports){
'use strict';

var baseValues        = require( './base/base-values' );

var isArrayLikeObject = require( './is-array-like-object' );
var keys              = require( './keys' );

module.exports = function iterable ( value ) {
  if ( isArrayLikeObject( value ) ) {
    return value;
  }

  if ( typeof value === 'string' ) {
    return value.split( '' );
  }

  return baseValues( value, keys( value ) );
};

},{"./base/base-values":40,"./is-array-like-object":102,"./keys":124}],122:[function(require,module,exports){
'use strict';

var isArrayLikeObject = require( './is-array-like-object' );
var matchesProperty   = require( './matches-property' );
var property          = require( './property' );

exports.iteratee = function iteratee ( value ) {
  if ( typeof value === 'function' ) {
    return value;
  }

  if ( isArrayLikeObject( value ) ) {
    return matchesProperty( value );
  }

  return property( value );
};

},{"./is-array-like-object":102,"./matches-property":126,"./property":137}],123:[function(require,module,exports){
'use strict';

var toObject = require( './to-object' );

module.exports = function getKeysIn ( obj ) {
  var keys = [];
  var key;

  obj = toObject( obj );

  for ( key in obj ) {
    keys.push( key );
  }

  return keys;
};

},{"./to-object":148}],124:[function(require,module,exports){
'use strict';

var support  = require( './support/support-keys' );

var toObject = require( './to-object' );

if ( support !== 'es2015' ) {
  module.exports = function keys ( value ) {
    return Object.keys( toObject( value ) );
  };
} else {
  module.exports = Object.keys;
}

},{"./support/support-keys":143,"./to-object":148}],125:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-index-of' )( true );

},{"./create/create-index-of":59}],126:[function(require,module,exports){
'use strict';

var castPath = require( './cast-path' );
var get      = require( './base/base-get' );
var ERR      = require( './constants' ).ERR;

module.exports = function matchesProperty ( property ) {
  var path  = castPath( property[ 0 ] );
  var value = property[ 1 ];

  if ( ! path.length ) {
    throw Error( ERR.NO_PATH );
  }

  return function ( object ) {
    if ( object === null || typeof object === 'undefined' ) {
      return false;
    }

    if ( path.length > 1 ) {
      return get( object, path, 0 ) === value;
    }

    return object[ path[ 0 ] ] === value;
  };
};

},{"./base/base-get":32,"./cast-path":44,"./constants":50}],127:[function(require,module,exports){
'use strict';

var baseIndexOf = require( './base/base-index-of' );

var matches;

if ( typeof Element === 'undefined' || ! ( matches = Element.prototype.matches || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector ) ) {
  matches = function matches ( selector ) {
    if ( /^#[\w\-]+$/.test( selector += '' ) ) {
      return '#' + this.id === selector;
    }

    return baseIndexOf( this.ownerDocument.querySelectorAll( selector ), this ) >= 0;
  };
}

module.exports = matches;

},{"./base/base-index-of":34}],128:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property-of' )( require( './base/base-invoke' ), true );

},{"./base/base-invoke":35,"./create/create-property-of":60}],129:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property' )( require( './base/base-invoke' ), true );

},{"./base/base-invoke":35,"./create/create-property":61}],130:[function(require,module,exports){
'use strict';

var memoize       = require( './internal/memoize' );

var isPlainObject = require( './is-plain-object' );
var toObject      = require( './to-object' );
var keys          = require( './keys' );
var isArray       = memoize( require( './is-array' ) );

/**
 * @method peako.mixin
 * @param  {boolean}    [deep=true]
 * @param  {object}     target
 * @param  {...object?} object
 * @return {object}
 */
module.exports = function mixin ( deep, target ) {
  var argsLength = arguments.length;
  var i = 2;
  var object;
  var source;
  var value;
  var j;
  var l;
  var k;

  if ( typeof deep !== 'boolean' ) {
    target = deep;
    deep = true;
    i = 1;
  }

  target = toObject( target );

  for ( ; i < argsLength; ++i ) {
    object = arguments[ i ];

    if ( ! object ) {
      continue;
    }

    for ( k = keys( object ), j = 0, l = k.length; j < l; ++j ) {
      value = object[ k[ j ] ];

      if ( deep && isPlainObject( value ) || isArray( value ) ) {
        source = target[ k[ j ] ];

        if ( isArray( value ) ) {
          if ( ! isArray( source ) ) {
            source = [];
          }
        } else {
          if ( ! isPlainObject( source ) ) {
            source = {};
          }
        }

        target[ k[ j ] ] = mixin( true, source, value );
      } else {
        target[ k[ j ] ] = value;
      }
    }
  }

  return target;
};

},{"./internal/memoize":95,"./is-array":104,"./is-plain-object":113,"./keys":124,"./to-object":148}],131:[function(require,module,exports){
'use strict';

module.exports = function noop () {}; // eslint-disable-line brace-rules/brace-on-same-line

},{}],132:[function(require,module,exports){
'use strict';

var before = require( './before' );

module.exports = function once ( target ) {
  return before( 1, target );
};

},{"./before":41}],133:[function(require,module,exports){
'use strict';

var baseCloneArray = require( './base/base-clone-array' );

var fragment       = require( './fragment' );

/**
 * @method _.parseHTML
 * @param  {string}          string
 * @param  {object}          context
 * @return {Array.<Element>}
 * @example
 * var elements = _.parseHTML( '<input type="submit" value="submit" />' );
 */
module.exports = function parseHTML ( string, context ) {
  if ( /^(?:<([\w-]+)><\/[\w-]+>|<([\w-]+)(?:\s*\/)?>)$/.test( string ) ) {
    return [ document.createElement( RegExp.$1 || RegExp.$2 ) ];
  }

  return baseCloneArray( fragment( [ string ], context || document ).childNodes );
};

},{"./base/base-clone-array":27,"./fragment":81}],134:[function(require,module,exports){
/*!
 * Copyright (c) 2017-2018 Vladislav Tikhiy (SILENT)
 * Released under the MIT license.
 * https://github.com/tikhiy/peako
 */

/*!
 * Based on jQuery        https://github.com/jquery/jquery
 * Based on Underscore.js https://github.com/jashkenas/underscore
 * Based on Lodash        https://github.com/lodash/lodash
 */

'use strict';

/**
 * @namespace peako
 */
var peako;

if ( typeof document !== 'undefined' ) {
  peako = require( './_' );
  peako.DOMWrapper = require( './DOMWrapper' );
} else {
  peako = function peako () {}; // eslint-disable-line brace-rules/brace-on-same-line
}

peako.ajax              = require( './ajax' );
peako.assign            = require( './assign' );
peako.assignIn          = require( './assign-in' );
peako.clone             = require( './clone' );
peako.defaults          = require( './defaults' );
peako.each              = require( './each' );
peako.eachRight         = require( './each-right' );
peako.getPrototypeOf    = require( './get-prototype-of' );
peako.indexOf           = require( './index-of' );
peako.isArray           = require( './is-array' );
peako.isArrayLike       = require( './is-array-like' );
peako.isArrayLikeObject = require( './is-array-like-object' );
peako.isDOMElement      = require( './is-dom-element' );
peako.isLength          = require( './is-length' );
peako.isObject          = require( './is-object' );
peako.isObjectLike      = require( './is-object-like' );
peako.isPlainObject     = require( './is-plain-object' );
peako.isPrimitive       = require( './is-primitive' );
peako.isSymbol          = require( './is-symbol' );
peako.isString          = require( './is-string' );
peako.isWindow          = require( './is-window' );
peako.isWindowLike      = require( './is-window-like' );
peako.isNumber          = require( './is-number' );
peako.isNaN             = require( './is-nan' );
peako.isSafeInteger     = require( './is-safe-integer' );
peako.isFinite          = require( './is-finite' );
peako.keys              = require( './keys' );
peako.keysIn            = require( './keys-in' );
peako.lastIndexOf       = require( './last-index-of' );
peako.mixin             = require( './mixin' );
peako.noop              = require( './noop' );
peako.property          = require( './property' );
peako.propertyOf        = require( './property-of' );
peako.method            = require( './method' );
peako.methodOf          = require( './method-of' );
peako.setPrototypeOf    = require( './set-prototype-of' );
peako.toObject          = require( './to-object' );
peako.type              = require( './type' );
peako.forEach           = require( './for-each' );
peako.forEachRight      = require( './for-each-right' );
peako.forIn             = require( './for-in' );
peako.forInRight        = require( './for-in-right' );
peako.forOwn            = require( './for-own' );
peako.forOwnRight       = require( './for-own-right' );
peako.before            = require( './before' );
peako.once              = require( './once' );
peako.defaultTo         = require( './default-to' );
peako.timer             = require( './timer' );
peako.timestamp         = require( './timestamp' );
peako.clamp             = require( './clamp' );
peako.bind              = require( './bind' );
peako.trim              = require( './trim' );
peako.trimEnd           = require( './trim-end' );
peako.trimStart         = require( './trim-start' );
peako.find              = require( './find' );
peako.findIndex         = require( './find-index' );
peako.findLast          = require( './find-last' );
peako.findLastIndex     = require( './find-last-index' );
peako.has               = require( './has' );
peako.get               = require( './get' );
peako.set               = require( './set' );
peako.iteratee          = require( './iteratee' );
peako.identity          = require( './identity' );
peako.escape            = require( './escape' );
peako.unescape          = require( './unescape' );
peako.random            = require( './random' );
peako.fromPairs         = require( './from-pairs' );
peako.constants         = require( './constants' );
peako.template          = require( './template' );
peako.invert            = require( './invert' );
peako.compound          = require( './compound' );
peako.debounce          = require( './debounce' );

if ( typeof self !== 'undefined' ) {
  self.peako = self._ = peako; // eslint-disable-line no-multi-assign
}

module.exports = peako;

},{"./DOMWrapper":1,"./_":20,"./ajax":23,"./assign":25,"./assign-in":24,"./before":41,"./bind":42,"./clamp":45,"./clone":46,"./compound":49,"./constants":50,"./debounce":64,"./default-to":65,"./defaults":66,"./each":68,"./each-right":67,"./escape":69,"./find":74,"./find-index":71,"./find-last":73,"./find-last-index":72,"./for-each":76,"./for-each-right":75,"./for-in":78,"./for-in-right":77,"./for-own":80,"./for-own-right":79,"./from-pairs":82,"./get":86,"./get-prototype-of":85,"./has":87,"./identity":88,"./index-of":89,"./invert":101,"./is-array":104,"./is-array-like":103,"./is-array-like-object":102,"./is-dom-element":105,"./is-finite":106,"./is-length":108,"./is-nan":109,"./is-number":110,"./is-object":112,"./is-object-like":111,"./is-plain-object":113,"./is-primitive":114,"./is-safe-integer":115,"./is-string":116,"./is-symbol":117,"./is-window":119,"./is-window-like":118,"./iteratee":122,"./keys":124,"./keys-in":123,"./last-index-of":125,"./method":129,"./method-of":128,"./mixin":130,"./noop":131,"./once":132,"./property":137,"./property-of":136,"./random":139,"./set":141,"./set-prototype-of":140,"./template":144,"./timer":145,"./timestamp":146,"./to-object":148,"./trim":151,"./trim-end":149,"./trim-start":150,"./type":152,"./unescape":153}],135:[function(require,module,exports){
'use strict';

/**
 * @member {object} _.placeholder
 */

},{}],136:[function(require,module,exports){
'use strict';

/**
 * @method _.propertyOf
 * @param  {object}   object
 * @return {function}
 * @example
 * var object = {
 *   x: 42,
 *   y: 0
 * };
 *
 * [ 'x', 'y' ].map( _.propertyOf( object ) ); // -> [ 42, 0 ]
 */
module.exports = require( './create/create-property-of' )( require( './base/base-property' ) );

},{"./base/base-property":36,"./create/create-property-of":60}],137:[function(require,module,exports){
'use strict';

/**
 * @method _.property
 * @param  {string}   path
 * @return {function}
 * @example
 * var objects = [
 *   { name: 'James' },
 *   { name: 'John' }
 * ];
 *
 * objects.map( _.property( 'name' ) ); // -> [ 'James', 'John' ]
 */
module.exports = require( './create/create-property' )( require( './base/base-property' ) );

},{"./base/base-property":36,"./create/create-property":61}],138:[function(require,module,exports){
'use strict';

module.exports = {
  'class': 'className',
  'for':   'htmlFor'
};

},{}],139:[function(require,module,exports){
'use strict';

var baseRandom = require( './base/base-random' );

module.exports = function random ( lower, upper, floating ) {

  // _.random();

  if ( typeof lower === 'undefined' ) {
    floating = false;
    upper = 1;
    lower = 0;
  } else if ( typeof upper === 'undefined' ) {

    // _.random( floating );

    if ( typeof lower === 'boolean' ) {
      floating = lower;
      upper = 1;

    // _.random( upper );

    } else {
      floating = false;
      upper = lower;
    }

    lower = 0;
  } else if ( typeof floating === 'undefined' ) {

    // _.random( upper, floating );

    if ( typeof upper === 'boolean' ) {
      floating = upper;
      upper = lower;
      lower = 0;

    // _.random( lower, upper );

    } else {
      floating = false;
    }
  }

  if ( floating || lower % 1 || upper % 1 ) {
    return baseRandom( lower, upper );
  }

  return Math.round( baseRandom( lower, upper ) );
};

},{"./base/base-random":37}],140:[function(require,module,exports){
'use strict';

var isPrimitive = require( './is-primitive' );
var ERR         = require( './constants' ).ERR;

module.exports = Object.setPrototypeOf || function setPrototypeOf ( target, prototype ) {
  if ( target === null || typeof target === 'undefined' ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  if ( prototype !== null && isPrimitive( prototype ) ) {
    throw TypeError( 'Object prototype may only be an Object or null: ' + prototype );
  }

  if ( '__proto__' in target ) {
    target.__proto__ = prototype;
  }

  return target;
};

},{"./constants":50,"./is-primitive":114}],141:[function(require,module,exports){
'use strict';

var castPath = require( './cast-path' );
var toObject = require( './to-object' );
var baseSet  = require( './base/base-set' );
var ERR      = require( './constants' ).ERR;

module.exports = function set ( obj, path, val ) {
  var l = ( path = castPath( path ) ).length;

  if ( ! l ) {
    throw Error( ERR.NO_PATH );
  }

  if ( l > 1 ) {
    return baseSet( toObject( obj ), path, val );
  }

  return ( toObject( obj )[ path[ 0 ] ] = val );
};

},{"./base/base-set":39,"./cast-path":44,"./constants":50,"./to-object":148}],142:[function(require,module,exports){
'use strict';

var span = document.createElement( 'span' );

try {
  if ( span.setAttribute( 'x', 'y' ), span.getAttribute( 'x' ) === 'y' ) { // eslint-disable-line no-sequences
    module.exports = true;
  } else {
    throw null;
  }
} catch ( error ) {
  module.exports = false;
}

span = null;

},{}],143:[function(require,module,exports){
'use strict';

try {
  module.exports = Object.keys( '' ), 'es2015'; // eslint-disable-line no-unused-expressions, no-sequences
} catch ( error ) {
  module.exports = 'es5';
}

},{}],144:[function(require,module,exports){
'use strict';

var escape  = require( './escape' );

var regexps = {
  safe: '<\\%=\\s*([^]*?)\\s*\\%>',
  html: '<\\%-\\s*([^]*?)\\s*\\%>',
  comm: "'''([^]*?)'''",
  code: '<\\%\\s*([^]*?)\\s*\\%>'
};

function replacer ( match, safe, html, comm, code ) {
  if ( typeof safe !== 'undefined' ) {
    return "'+_e(" + safe.replace( /\\n/g, '\n' ) + ")+'";
  }

  if ( typeof html !== 'undefined' ) {
    return "'+(" + html.replace( /\\n/g, '\n' ) + ")+'";
  }

  if ( typeof code !== 'undefined' ) {
    return "';" + code.replace( /\\n/g, '\n' ) + ";_r+='";
  }

  // comment is matched - do nothing
  return '';
}

/**
 * @method peako.template
 * @param  {string} source            The template source.
 * @param  {object} [options]         An options.
 * @param  {object} [options.regexps] Custom patterns.
 * @return {object}                   An object with `render` method.
 * @example
 * var template = peako.template(`
 *   ''' A html-safe output. '''
 *   <title><%= data.username %></title>
 *   ''' A block of code. '''
 *   <% for ( var i = 0; i < 5; i += 1 ) {
 *     // The "print" function.
 *     print( i );
 *   } %>
 * `);
 * var html = template.render( { username: 'John' } );
 * // -> '\n  \n  <title>John</title>\n  \n  01234\n'
 */
function template ( source, options ) {
  var result = '';
  var regexp;
  var render_;

  if ( ! options ) {
    options = {};
  }

  function get ( key ) {
    return options.regexps && options.regexps[ key ] || regexps[ key ];
  }

  regexp = RegExp(
    get( 'safe' ) + '|' +
    get( 'html' ) + '|' +
    get( 'comm' ) + '|' +
    get( 'code' ), 'g' );

  if ( options.with ) {
    result += 'with(data||{}){';
  }

  if ( options.print !== null ) {
    result += 'function ' + ( options.print || 'print' ) + "(){_r+=Array.prototype.join.call(arguments,'');}";
  }

  result += "var _r='";

  result += source
    .replace( /\n/g, '\\n' )
    .replace( regexp, replacer );

  result += "';";

  if ( options.with ) {
    result += '}';
  }

  result += 'return _r;';

  render_ = Function( 'data', '_e', result );

  return {
    render: function render ( data ) {
      return render_.call( this, data, escape );
    },

    result: result,
    source: source
  };
}

module.exports = template;

},{"./escape":69}],145:[function(require,module,exports){
/**
 * Based on Erik Möller requestAnimationFrame polyfill:
 *
 * Adapted from https://gist.github.com/paulirish/1579671 which derived from
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 *
 * requestAnimationFrame polyfill by Erik Möller.
 * Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon.
 *
 * MIT license
 */

'use strict';

var timestamp = require( './timestamp' );

var requestAF;
var cancelAF;

if ( typeof self !== 'undefined' ) {
  cancelAF = self.cancelAnimationFrame ||
    self.webkitCancelAnimationFrame ||
    self.webkitCancelRequestAnimationFrame ||
    self.mozCancelAnimationFrame ||
    self.mozCancelRequestAnimationFrame;
  requestAF = self.requestAnimationFrame ||
    self.webkitRequestAnimationFrame ||
    self.mozRequestAnimationFrame;
}

var noRequestAnimationFrame = ! requestAF || ! cancelAF ||
  typeof navigator !== 'undefined' && /iP(ad|hone|od).*OS\s6/.test( navigator.userAgent );

if ( noRequestAnimationFrame ) {
  var lastRequestTime = 0;
  var frameDuration   = 1000 / 60;

  exports.request = function request ( animate ) {
    var now             = timestamp();
    var nextRequestTime = Math.max( lastRequestTime + frameDuration, now );

    return setTimeout( function () {
      lastRequestTime = nextRequestTime;
      animate( now );
    }, nextRequestTime - now );
  };

  exports.cancel = clearTimeout;
} else {
  exports.request = function request ( animate ) {
    return requestAF( animate );
  };

  exports.cancel = function cancel ( id ) {
    return cancelAF( id );
  };
}

},{"./timestamp":146}],146:[function(require,module,exports){
'use strict';

var navigatorStart;

if ( typeof performance === 'undefined' || ! performance.now ) {
  navigatorStart = Date.now();

  module.exports = function timestamp () {
    return Date.now() - navigatorStart;
  };
} else {
  module.exports = function timestamp () {
    return performance.now();
  };
}

},{}],147:[function(require,module,exports){
'use strict';

var _unescape = require( './internal/unescape' );

var isSymbol  = require( './is-symbol' );

module.exports = function ( value ) {
  if ( typeof value === 'string' ) {
    return _unescape( value );
  }

  if ( isSymbol( value ) ) {
    return value;
  }

  var key = '' + value;

  if ( key === '0' && 1 / value === -Infinity ) {
    return '-0';
  }

  return _unescape( key );
};

},{"./internal/unescape":99,"./is-symbol":117}],148:[function(require,module,exports){
'use strict';

var ERR = require( './constants' ).ERR;

module.exports = function toObject ( value ) {
  if ( value === null || typeof value === 'undefined' ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  return Object( value );
};

},{"./constants":50}],149:[function(require,module,exports){
'use strict';

if ( String.prototype.trimEnd ) {
  module.exports = function trimEnd ( string ) {
    return ( '' + string ).trimEnd();
  };
} else {
  module.exports = require( './create/create-trim' )( /[\s\uFEFF\xA0]+$/ );
}

},{"./create/create-trim":63}],150:[function(require,module,exports){
'use strict';

if ( String.prototype.trimStart ) {
  module.exports = function trimStart ( string ) {
    return ( '' + string ).trimStart();
  };
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+/ );
}

},{"./create/create-trim":63}],151:[function(require,module,exports){
'use strict';

if ( String.prototype.trim ) {
  module.exports = function trim ( string ) {
    return ( '' + string ).trim();
  };
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/ );
}

},{"./create/create-trim":63}],152:[function(require,module,exports){
'use strict';

var cache = Object.create( null );

module.exports = function type ( value ) {
  if ( typeof value !== 'object' && typeof value !== 'function' ) {
    return typeof value;
  }

  if ( value === null ) {
    return 'null';
  }

  var string = Object.prototype.toString.call( value );

  if ( ! cache[ string ] ) {
    cache[ string ] = string.slice( 8, -1 ).toLowerCase();
  }

  return cache[ string ];
};

},{}],153:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-escape' )( /&(?:lt|gt|#34|#39|amp);/g, {
  '&lt;':  '<',
  '&gt;':  '>',
  '&#34;': '"',
  '&#39;': "'",
  '&amp;': '&'
} );

},{"./create/create-escape":53}],154:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-first' )( 'toUpperCase' );

},{"./create/create-first":55}]},{},[134])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJET01XcmFwcGVyL2luZGV4LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvY3NzLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZWFjaC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VuZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VxLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZmluZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2ZpcnN0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZ2V0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvbGFzdC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL21hcC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3BhcmVudC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlYWR5LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlQXR0ci5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlbW92ZVByb3AuanMiLCJET01XcmFwcGVyL3Byb3RvdHlwZS9zdGFjay5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3N0eWxlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvc3R5bGVzLmpzIiwiRXZlbnQuanMiLCJfLmpzIiwiYWNjZXNzLmpzIiwiYWpheC1vcHRpb25zLmpzIiwiYWpheC5qcyIsImFzc2lnbi1pbi5qcyIsImFzc2lnbi5qcyIsImJhc2UvYmFzZS1hc3NpZ24uanMiLCJiYXNlL2Jhc2UtY2xvbmUtYXJyYXkuanMiLCJiYXNlL2Jhc2UtY29weS1hcnJheS5qcyIsImJhc2UvYmFzZS1leGVjLmpzIiwiYmFzZS9iYXNlLWZvci1lYWNoLmpzIiwiYmFzZS9iYXNlLWZvci1pbi5qcyIsImJhc2UvYmFzZS1nZXQuanMiLCJiYXNlL2Jhc2UtaGFzLmpzIiwiYmFzZS9iYXNlLWluZGV4LW9mLmpzIiwiYmFzZS9iYXNlLWludm9rZS5qcyIsImJhc2UvYmFzZS1wcm9wZXJ0eS5qcyIsImJhc2UvYmFzZS1yYW5kb20uanMiLCJiYXNlL2Jhc2UtcmVtb3ZlLWF0dHIuanMiLCJiYXNlL2Jhc2Utc2V0LmpzIiwiYmFzZS9iYXNlLXZhbHVlcy5qcyIsImJlZm9yZS5qcyIsImJpbmQuanMiLCJjYW1lbGl6ZS5qcyIsImNhc3QtcGF0aC5qcyIsImNsYW1wLmpzIiwiY2xvbmUuanMiLCJjbG9zZXN0LW5vZGUuanMiLCJjbG9zZXN0LmpzIiwiY29tcG91bmQuanMiLCJjb25zdGFudHMuanMiLCJjcmVhdGUvY3JlYXRlLWFzc2lnbi5qcyIsImNyZWF0ZS9jcmVhdGUtZWFjaC5qcyIsImNyZWF0ZS9jcmVhdGUtZXNjYXBlLmpzIiwiY3JlYXRlL2NyZWF0ZS1maW5kLmpzIiwiY3JlYXRlL2NyZWF0ZS1maXJzdC5qcyIsImNyZWF0ZS9jcmVhdGUtZm9yLWVhY2guanMiLCJjcmVhdGUvY3JlYXRlLWZvci1pbi5qcyIsImNyZWF0ZS9jcmVhdGUtZ2V0LWVsZW1lbnQtZGltZW5zaW9uLmpzIiwiY3JlYXRlL2NyZWF0ZS1pbmRleC1vZi5qcyIsImNyZWF0ZS9jcmVhdGUtcHJvcGVydHktb2YuanMiLCJjcmVhdGUvY3JlYXRlLXByb3BlcnR5LmpzIiwiY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcC5qcyIsImNyZWF0ZS9jcmVhdGUtdHJpbS5qcyIsImRlYm91bmNlLmpzIiwiZGVmYXVsdC10by5qcyIsImRlZmF1bHRzLmpzIiwiZWFjaC1yaWdodC5qcyIsImVhY2guanMiLCJlc2NhcGUuanMiLCJldmVudHMuanMiLCJmaW5kLWluZGV4LmpzIiwiZmluZC1sYXN0LWluZGV4LmpzIiwiZmluZC1sYXN0LmpzIiwiZmluZC5qcyIsImZvci1lYWNoLXJpZ2h0LmpzIiwiZm9yLWVhY2guanMiLCJmb3ItaW4tcmlnaHQuanMiLCJmb3ItaW4uanMiLCJmb3Itb3duLXJpZ2h0LmpzIiwiZm9yLW93bi5qcyIsImZyYWdtZW50LmpzIiwiZnJvbS1wYWlycy5qcyIsImdldC1lbGVtZW50LWguanMiLCJnZXQtZWxlbWVudC13LmpzIiwiZ2V0LXByb3RvdHlwZS1vZi5qcyIsImdldC5qcyIsImhhcy5qcyIsImlkZW50aXR5LmpzIiwiaW5kZXgtb2YuanMiLCJpbnRlcm5hbC9Bcmd1bWVudEV4Y2VwdGlvbi5qcyIsImludGVybmFsL2NhbGwtaXRlcmF0ZWUuanMiLCJpbnRlcm5hbC9jc3MtbnVtYmVycy5qcyIsImludGVybmFsL2ZpcnN0LmpzIiwiaW50ZXJuYWwvZ2V0LXN0eWxlLmpzIiwiaW50ZXJuYWwvbWVtb2l6ZS5qcyIsImludGVybmFsL3Byb2Nlc3MtYXJncy5qcyIsImludGVybmFsL3RleHQtY29udGVudC5qcyIsImludGVybmFsL3R5cGUuanMiLCJpbnRlcm5hbC91bmVzY2FwZS5qcyIsImludGVybmFsL3dvcmRzLmpzIiwiaW52ZXJ0LmpzIiwiaXMtYXJyYXktbGlrZS1vYmplY3QuanMiLCJpcy1hcnJheS1saWtlLmpzIiwiaXMtYXJyYXkuanMiLCJpcy1kb20tZWxlbWVudC5qcyIsImlzLWZpbml0ZS5qcyIsImlzLWtleS5qcyIsImlzLWxlbmd0aC5qcyIsImlzLW5hbi5qcyIsImlzLW51bWJlci5qcyIsImlzLW9iamVjdC1saWtlLmpzIiwiaXMtb2JqZWN0LmpzIiwiaXMtcGxhaW4tb2JqZWN0LmpzIiwiaXMtcHJpbWl0aXZlLmpzIiwiaXMtc2FmZS1pbnRlZ2VyLmpzIiwiaXMtc3RyaW5nLmpzIiwiaXMtc3ltYm9sLmpzIiwiaXMtd2luZG93LWxpa2UuanMiLCJpcy13aW5kb3cuanMiLCJpc3NldC5qcyIsIml0ZXJhYmxlLmpzIiwiaXRlcmF0ZWUuanMiLCJrZXlzLWluLmpzIiwia2V5cy5qcyIsImxhc3QtaW5kZXgtb2YuanMiLCJtYXRjaGVzLXByb3BlcnR5LmpzIiwibWF0Y2hlcy1zZWxlY3Rvci5qcyIsIm1ldGhvZC1vZi5qcyIsIm1ldGhvZC5qcyIsIm1peGluLmpzIiwibm9vcC5qcyIsIm9uY2UuanMiLCJwYXJzZS1odG1sLmpzIiwicGVha28uanMiLCJwbGFjZWhvbGRlci5qcyIsInByb3BlcnR5LW9mLmpzIiwicHJvcGVydHkuanMiLCJwcm9wcy5qcyIsInJhbmRvbS5qcyIsInNldC1wcm90b3R5cGUtb2YuanMiLCJzZXQuanMiLCJzdXBwb3J0L3N1cHBvcnQtZ2V0LWF0dHJpYnV0ZS5qcyIsInN1cHBvcnQvc3VwcG9ydC1rZXlzLmpzIiwidGVtcGxhdGUuanMiLCJ0aW1lci5qcyIsInRpbWVzdGFtcC5qcyIsInRvLWtleS5qcyIsInRvLW9iamVjdC5qcyIsInRyaW0tZW5kLmpzIiwidHJpbS1zdGFydC5qcyIsInRyaW0uanMiLCJ0eXBlLmpzIiwidW5lc2NhcGUuanMiLCJ1cHBlci1maXJzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBET01XcmFwcGVyO1xuXG52YXIgX3RleHRDb250ZW50ICAgICAgICAgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvdGV4dC1jb250ZW50JyApO1xudmFyIF9maXJzdCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2ludGVybmFsL2ZpcnN0JyApO1xudmFyIF93b3JkcyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2ludGVybmFsL3dvcmRzJyApO1xuXG52YXIgc3VwcG9ydCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vc3VwcG9ydC9zdXBwb3J0LWdldC1hdHRyaWJ1dGUnICk7XG5cbnZhciBjcmVhdGVSZW1vdmVQcm9wZXJ0eSA9IHJlcXVpcmUoICcuLi9jcmVhdGUvY3JlYXRlLXJlbW92ZS1wcm9wJyApO1xuXG52YXIgYmFzZUZvckVhY2ggICAgICAgICAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1lYWNoJyApO1xudmFyIGJhc2VGb3JJbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItaW4nICk7XG5cbnZhciBpc0FycmF5TGlrZU9iamVjdCAgICA9IHJlcXVpcmUoICcuLi9pcy1hcnJheS1saWtlLW9iamVjdCcgKTtcbnZhciBpc0RPTUVsZW1lbnQgICAgICAgICA9IHJlcXVpcmUoICcuLi9pcy1kb20tZWxlbWVudCcgKTtcbnZhciBnZXRFbGVtZW50VyAgICAgICAgICA9IHJlcXVpcmUoICcuLi9nZXQtZWxlbWVudC13JyApO1xudmFyIGdldEVsZW1lbnRIICAgICAgICAgID0gcmVxdWlyZSggJy4uL2dldC1lbGVtZW50LWgnICk7XG52YXIgcGFyc2VIVE1MICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vcGFyc2UtaHRtbCcgKTtcbnZhciBhY2Nlc3MgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9hY2Nlc3MnICk7XG52YXIgZXZlbnRzICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vZXZlbnRzJyApO1xuXG52YXIgcnNlbGVjdG9yID0gL14oPzojKFtcXHctXSspfChbXFx3LV0rKXxcXC4oW1xcdy1dKykpJC87XG5cbmZ1bmN0aW9uIERPTVdyYXBwZXIgKCBzZWxlY3RvciwgY29udGV4dCApIHtcbiAgdmFyIG1hdGNoO1xuICB2YXIgbGlzdDtcbiAgdmFyIGk7XG5cbiAgLy8gXygpO1xuXG4gIGlmICggISBzZWxlY3RvciApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBfKCB3aW5kb3cgKTtcblxuICBpZiAoIGlzRE9NRWxlbWVudCggc2VsZWN0b3IgKSApIHtcbiAgICBfZmlyc3QoIHRoaXMsIHNlbGVjdG9yICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnICkge1xuICAgIGlmICggdHlwZW9mIGNvbnRleHQgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgaWYgKCAhIGNvbnRleHQuX3BlYWtvICkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IERPTVdyYXBwZXIoIGNvbnRleHQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCAhIGNvbnRleHRbIDAgXSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0ID0gY29udGV4dFsgMCBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKCBzZWxlY3Rvci5jaGFyQXQoIDAgKSAhPT0gJzwnICkge1xuICAgICAgbWF0Y2ggPSByc2VsZWN0b3IuZXhlYyggc2VsZWN0b3IgKTtcblxuICAgICAgLy8gXyggJ2EgPiBiICsgYycgKTtcbiAgICAgIC8vIF8oICcjaWQnLCAnLmFub3RoZXItZWxlbWVudCcgKVxuXG4gICAgICBpZiAoICEgbWF0Y2ggfHwgISBjb250ZXh0LmdldEVsZW1lbnRCeUlkICYmIG1hdGNoWyAxIF0gfHwgISBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiYgbWF0Y2hbIDMgXSApIHtcbiAgICAgICAgaWYgKCBtYXRjaCAmJiBtYXRjaFsgMSBdICkge1xuICAgICAgICAgIGxpc3QgPSBbIGNvbnRleHQucXVlcnlTZWxlY3Rvciggc2VsZWN0b3IgKSBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3QgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICk7XG4gICAgICAgIH1cblxuICAgICAgLy8gXyggJyNpZCcgKTtcblxuICAgICAgfSBlbHNlIGlmICggbWF0Y2hbIDEgXSApIHtcbiAgICAgICAgaWYgKCAoIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtYXRjaFsgMSBdICkgKSApIHtcbiAgICAgICAgICBfZmlyc3QoIHRoaXMsIGxpc3QgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gXyggJ3RhZycgKTtcblxuICAgICAgfSBlbHNlIGlmICggbWF0Y2hbIDIgXSApIHtcbiAgICAgICAgbGlzdCA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIG1hdGNoWyAyIF0gKTtcblxuICAgICAgLy8gXyggJy5jbGFzcycgKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdCA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggbWF0Y2hbIDMgXSApO1xuICAgICAgfVxuXG4gICAgLy8gXyggJzxkaXY+JyApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3QgPSBwYXJzZUhUTUwoIHNlbGVjdG9yLCBjb250ZXh0ICk7XG4gICAgfVxuXG4gIC8vIF8oIFsgLi4uIF0gKTtcblxuICB9IGVsc2UgaWYgKCBpc0FycmF5TGlrZU9iamVjdCggc2VsZWN0b3IgKSApIHtcbiAgICBsaXN0ID0gc2VsZWN0b3I7XG5cbiAgLy8gXyggZnVuY3Rpb24gKCBfICkgeyAuLi4gfSApO1xuXG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICByZXR1cm4gbmV3IERPTVdyYXBwZXIoIGRvY3VtZW50ICkucmVhZHkoIHNlbGVjdG9yICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnR290IHVuZXhwZWN0ZWQgc2VsZWN0b3I6ICcgKyBzZWxlY3RvciArICcuJyApO1xuICB9XG5cbiAgaWYgKCAhIGxpc3QgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5sZW5ndGggPSBsaXN0Lmxlbmd0aDtcblxuICBmb3IgKCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICB0aGlzWyBpIF0gPSBsaXN0WyBpIF07XG4gIH1cbn1cblxuRE9NV3JhcHBlci5wcm90b3R5cGUgPSB7XG4gIGVhY2g6ICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9lYWNoJyApLFxuICBlbmQ6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZW5kJyApLFxuICBlcTogICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZXEnICksXG4gIGZpbmQ6ICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9maW5kJyApLFxuICBmaXJzdDogICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZmlyc3QnICksXG4gIGdldDogICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9nZXQnICksXG4gIGxhc3Q6ICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9sYXN0JyApLFxuICBtYXA6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvbWFwJyApLFxuICBwYXJlbnQ6ICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvcGFyZW50JyApLFxuICByZWFkeTogICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVhZHknICksXG4gIHJlbW92ZTogICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9yZW1vdmUnICksXG4gIHJlbW92ZUF0dHI6IHJlcXVpcmUoICcuL3Byb3RvdHlwZS9yZW1vdmVBdHRyJyApLFxuICByZW1vdmVQcm9wOiByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVtb3ZlUHJvcCcgKSxcbiAgc3RhY2s6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3N0YWNrJyApLFxuICBzdHlsZTogICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvc3R5bGUnICksXG4gIHN0eWxlczogICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9zdHlsZXMnICksXG4gIGNzczogICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9jc3MnICksXG4gIGNvbnN0cnVjdG9yOiBET01XcmFwcGVyLFxuICBsZW5ndGg6IDAsXG4gIF9wZWFrbzogdHJ1ZVxufTtcblxuYmFzZUZvckluKCB7XG4gIHRyaWdnZXI6ICd0cmlnZ2VyJyxcbiAgb25jZTogICAgJ29uJyxcbiAgb2ZmOiAgICAgJ29mZicsXG4gIG9uOiAgICAgICdvbidcbn0sIGZ1bmN0aW9uICggbmFtZSwgbWV0aG9kTmFtZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIG1ldGhvZE5hbWUgXSA9IGZ1bmN0aW9uICggdHlwZXMsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApIHtcbiAgICB2YXIgcmVtb3ZlQWxsID0gbWV0aG9kTmFtZSA9PT0gJ29mZicgJiYgISBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBvbmNlID0gbWV0aG9kTmFtZSA9PT0gJ29uY2UnO1xuICAgIHZhciBlbGVtZW50O1xuICAgIHZhciBpO1xuICAgIHZhciBqO1xuICAgIHZhciBsO1xuXG4gICAgaWYgKCAhIHJlbW92ZUFsbCApIHtcbiAgICAgIHR5cGVzID0gX3dvcmRzKCB0eXBlcyApO1xuXG4gICAgICBpZiAoICEgdHlwZXMubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbCA9IHR5cGVzLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBvZmYoIHR5cGVzLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApXG4gICAgLy8gb2ZmKCB0eXBlcywgbGlzdGVuZXIgKVxuXG4gICAgaWYgKCBtZXRob2ROYW1lICE9PSAndHJpZ2dlcicgJiYgdHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgaWYgKCB0eXBlb2YgbGlzdGVuZXIgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICB1c2VDYXB0dXJlID0gbGlzdGVuZXI7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVyID0gc2VsZWN0b3I7XG4gICAgICBzZWxlY3RvciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgdXNlQ2FwdHVyZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB1c2VDYXB0dXJlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBlbGVtZW50ID0gdGhpc1sgaSBdO1xuXG4gICAgICBpZiAoIHJlbW92ZUFsbCApIHtcbiAgICAgICAgZXZlbnRzLm9mZiggZWxlbWVudCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICggaiA9IDA7IGogPCBsOyArK2ogKSB7XG4gICAgICAgICAgZXZlbnRzWyBuYW1lIF0oIGVsZW1lbnQsIHR5cGVzWyBqIF0sIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSwgb25jZSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgaWYgKCBtZXRob2ROYW1lID09PSAnb25jZScgKSB7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIERPTVdyYXBwZXIucHJvdG90eXBlLm9uZSA9IGZ1bmN0aW9uIG9uZSAoKSB7XG4gICAgICBpZiAoIGNvdW50KysgPCAxICkge1xuICAgICAgICBjb25zb2xlLmxvZyggJ1wib25lXCIgaXMgZGVwcmVjYXRlZCBub3cuIFVzZSBcIm9uY2VcIiBpbnN0ZWFkLicgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub25jZS5hcHBseSggdGhpcywgW10uc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbiAgICB9O1xuICB9XG59LCB2b2lkIDAsIHRydWUsIFsgJ3RyaWdnZXInLCAnb25jZScsICdvZmYnLCAnb24nIF0gKTtcblxuYmFzZUZvckVhY2goIFtcbiAgJ2JsdXInLCAgICAgICAgJ2ZvY3VzJywgICAgICAgJ2ZvY3VzaW4nLFxuICAnZm9jdXNvdXQnLCAgICAncmVzaXplJywgICAgICAnc2Nyb2xsJyxcbiAgJ2NsaWNrJywgICAgICAgJ2RibGNsaWNrJywgICAgJ21vdXNlZG93bicsXG4gICdtb3VzZXVwJywgICAgICdtb3VzZW1vdmUnLCAgICdtb3VzZW92ZXInLFxuICAnbW91c2VvdXQnLCAgICAnbW91c2VlbnRlcicsICAnbW91c2VsZWF2ZScsXG4gICdjaGFuZ2UnLCAgICAgICdzZWxlY3QnLCAgICAgICdzdWJtaXQnLFxuICAna2V5ZG93bicsICAgICAna2V5cHJlc3MnLCAgICAna2V5dXAnLFxuICAnY29udGV4dG1lbnUnLCAndG91Y2hzdGFydCcsICAndG91Y2htb3ZlJyxcbiAgJ3RvdWNoZW5kJywgICAgJ3RvdWNoZW50ZXInLCAgJ3RvdWNobGVhdmUnLFxuICAndG91Y2hjYW5jZWwnLCAnbG9hZCdcbl0sIGZ1bmN0aW9uICggZXZlbnRUeXBlICkge1xuICBET01XcmFwcGVyLnByb3RvdHlwZVsgZXZlbnRUeXBlIF0gPSBmdW5jdGlvbiAoIGFyZyApIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGlmICggdHlwZW9mIGFyZyAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJldHVybiB0aGlzLnRyaWdnZXIoIGV2ZW50VHlwZSwgYXJnICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgdGhpcy5vbiggZXZlbnRUeXBlLCBhcmd1bWVudHNbIGkgXSwgZmFsc2UgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0sIHZvaWQgMCwgdHJ1ZSApO1xuXG5iYXNlRm9ySW4oIHtcbiAgZGlzYWJsZWQ6ICdkaXNhYmxlZCcsXG4gIGNoZWNrZWQ6ICAnY2hlY2tlZCcsXG4gIHZhbHVlOiAgICAndmFsdWUnLFxuICB0ZXh0OiAgICAgJ3RleHRDb250ZW50JyBpbiBkb2N1bWVudC5ib2R5ID8gJ3RleHRDb250ZW50JyA6IF90ZXh0Q29udGVudCwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZXJuYXJ5XG4gIGh0bWw6ICAgICAnaW5uZXJIVE1MJ1xufSwgZnVuY3Rpb24gKCBrZXksIG1ldGhvZE5hbWUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBtZXRob2ROYW1lIF0gPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICAgIHZhciBlbGVtZW50O1xuICAgIHZhciBpO1xuXG4gICAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgaWYgKCAhICggZWxlbWVudCA9IHRoaXNbIDAgXSApIHx8IGVsZW1lbnQubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50WyBrZXkgXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleSggZWxlbWVudCApO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgaWYgKCAoIGVsZW1lbnQgPSB0aGlzWyBpIF0gKS5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgZWxlbWVudFsga2V5IF0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGtleSggZWxlbWVudCwgdmFsdWUgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0sIHZvaWQgMCwgdHJ1ZSwgWyAnZGlzYWJsZWQnLCAnY2hlY2tlZCcsICd2YWx1ZScsICd0ZXh0JywgJ2h0bWwnIF0gKTtcblxuKCBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcm9wcyA9IHJlcXVpcmUoICcuLi9wcm9wcycgKTtcblxuICBmdW5jdGlvbiBfYXR0ciAoIGVsZW1lbnQsIGtleSwgdmFsdWUsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoIGVsZW1lbnQubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIHByb3BzWyBrZXkgXSB8fCAhIHN1cHBvcnQgKSB7XG4gICAgICByZXR1cm4gX3Byb3AoIGVsZW1lbnQsIHByb3BzWyBrZXkgXSB8fCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKTtcbiAgICB9XG5cbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCBrZXkgKTtcbiAgICB9XG5cbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgga2V5LCB2YWx1ZSApO1xuICB9XG5cbiAgRE9NV3JhcHBlci5wcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uIGF0dHIgKCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhY2Nlc3MoIHRoaXMsIGtleSwgdmFsdWUsIF9hdHRyICk7XG4gIH07XG5cbiAgZnVuY3Rpb24gX3Byb3AgKCBlbGVtZW50LCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKSB7XG4gICAgaWYgKCAhIGNoYWluYWJsZSApIHtcbiAgICAgIHJldHVybiBlbGVtZW50WyBrZXkgXTtcbiAgICB9XG5cbiAgICBlbGVtZW50WyBrZXkgXSA9IHZhbHVlO1xuICB9XG5cbiAgRE9NV3JhcHBlci5wcm90b3R5cGUucHJvcCA9IGZ1bmN0aW9uIHByb3AgKCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhY2Nlc3MoIHRoaXMsIGtleSwgdmFsdWUsIF9wcm9wICk7XG4gIH07XG59ICkoKTtcblxuKCBmdW5jdGlvbiAoKSB7XG4gIHZhciBfcGVha29JZCA9IDA7XG4gIHZhciBfZGF0YSA9IHt9O1xuXG4gIGZ1bmN0aW9uIF9hY2Nlc3NEYXRhICggZWxlbWVudCwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICkge1xuICAgIHZhciBhdHRyaWJ1dGVzO1xuICAgIHZhciBhdHRyaWJ1dGU7XG4gICAgdmFyIGRhdGE7XG4gICAgdmFyIGk7XG4gICAgdmFyIGw7XG5cbiAgICBpZiAoICEgZWxlbWVudC5fcGVha29JZCApIHtcbiAgICAgIGVsZW1lbnQuX3BlYWtvSWQgPSArK19wZWFrb0lkO1xuICAgIH1cblxuICAgIGlmICggISAoIGRhdGEgPSBfZGF0YVsgZWxlbWVudC5fcGVha29JZCBdICkgKSB7XG4gICAgICBkYXRhID0gX2RhdGFbIGVsZW1lbnQuX3BlYWtvSWQgXSA9IHt9OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuXG4gICAgICBmb3IgKCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzLCBpID0gMCwgbCA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgICBpZiAoICEgKCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzWyBpIF0gKS5ub2RlTmFtZS5pbmRleE9mKCAnZGF0YS0nICkgKSB7XG4gICAgICAgICAgZGF0YVsgYXR0cmlidXRlLm5vZGVOYW1lLnNsaWNlKCA1ICkgXSA9IGF0dHJpYnV0ZS5ub2RlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIGNoYWluYWJsZSApIHtcbiAgICAgIGRhdGFbIGtleSBdID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYXRhWyBrZXkgXTtcbiAgICB9XG4gIH1cblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24gZGF0YSAoIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWx1ZSwgX2FjY2Vzc0RhdGEgKTtcbiAgfTtcblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5yZW1vdmVEYXRhID0gY3JlYXRlUmVtb3ZlUHJvcGVydHkoIGZ1bmN0aW9uIF9yZW1vdmVEYXRhICggZWxlbWVudCwga2V5ICkge1xuICAgIGlmICggZWxlbWVudC5fcGVha29JZCApIHtcbiAgICAgIGRlbGV0ZSBfZGF0YVsgZWxlbWVudC5fcGVha29JZCBdWyBrZXkgXTtcbiAgICB9XG4gIH0gKTtcbn0gKSgpO1xuXG5iYXNlRm9ySW4oIHsgaGVpZ2h0OiBnZXRFbGVtZW50Vywgd2lkdGg6IGdldEVsZW1lbnRIIH0sIGZ1bmN0aW9uICggZ2V0LCBuYW1lICkge1xuICBET01XcmFwcGVyLnByb3RvdHlwZVsgbmFtZSBdID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICggdGhpc1sgMCBdICkge1xuICAgICAgcmV0dXJuIGdldCggdGhpc1sgMCBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59LCB2b2lkIDAsIHRydWUsIFsgJ2hlaWdodCcsICd3aWR0aCcgXSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoICcuLi8uLi9pcy1hcnJheScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjc3MgKCBrLCB2ICkge1xuICBpZiAoIGlzQXJyYXkoIGsgKSApIHtcbiAgICByZXR1cm4gdGhpcy5zdHlsZXMoIGsgKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLnN0eWxlKCBrLCB2ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVhY2ggKCBmdW4gKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuXG4gIGZvciAoIDsgaSA8IGxlbjsgKytpICkge1xuICAgIGlmICggZnVuLmNhbGwoIHRoaXNbIGkgXSwgaSwgdGhpc1sgaSBdICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuLicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmQgKCkge1xuICByZXR1cm4gdGhpcy5fcHJldmlvdXMgfHwgbmV3IERPTVdyYXBwZXIoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXEgKCBpbmRleCApIHtcbiAgcmV0dXJuIHRoaXMuc3RhY2soIHRoaXMuZ2V0KCBpbmRleCApICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuLicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5kICggc2VsZWN0b3IgKSB7XG4gIHJldHVybiBuZXcgRE9NV3JhcHBlciggc2VsZWN0b3IsIHRoaXMgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmlyc3QgKCkge1xuICByZXR1cm4gdGhpcy5lcSggMCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb25lID0gcmVxdWlyZSggJy4uLy4uL2Jhc2UvYmFzZS1jbG9uZS1hcnJheScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXQgKCBpbmRleCApIHtcbiAgaWYgKCB0eXBlb2YgaW5kZXggPT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBjbG9uZSggdGhpcyApO1xuICB9XG5cbiAgaWYgKCBpbmRleCA8IDAgKSB7XG4gICAgcmV0dXJuIHRoaXNbIHRoaXMubGVuZ3RoICsgaW5kZXggXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzWyBpbmRleCBdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsYXN0ICgpIHtcbiAgcmV0dXJuIHRoaXMuZXEoIC0xICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hcCAoIGZ1biApIHtcbiAgdmFyIGVscyA9IHRoaXMuc3RhY2soKTtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xuICB2YXIgZWw7XG4gIHZhciBpO1xuXG4gIGVscy5sZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICBmb3IgKCBpID0gMDsgaSA8IGxlbjsgKytpICkge1xuICAgIGVsc1sgaSBdID0gZnVuLmNhbGwoIGVsID0gdGhpc1sgaSBdLCBpLCBlbCApO1xuICB9XG5cbiAgcmV0dXJuIGVscztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuLi8uLi9iYXNlL2Jhc2UtaW5kZXgtb2YnICk7XG52YXIgbWF0Y2hlcyAgICAgPSByZXF1aXJlKCAnLi4vLi4vbWF0Y2hlcy1zZWxlY3RvcicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJlbnQgKCBzZWxlY3RvciApIHtcbiAgdmFyIGVsZW1lbnRzID0gdGhpcy5zdGFjaygpO1xuICB2YXIgZWxlbWVudDtcbiAgdmFyIHBhcmVudDtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgcGFyZW50ID0gKCBlbGVtZW50ID0gdGhpc1sgaSBdICkubm9kZVR5cGUgPT09IDEgJiYgZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgaWYgKCBwYXJlbnQgJiYgYmFzZUluZGV4T2YoIGVsZW1lbnRzLCBwYXJlbnQgKSA8IDAgJiYgKCAhIHNlbGVjdG9yIHx8IG1hdGNoZXMuY2FsbCggcGFyZW50LCBzZWxlY3RvciApICkgKSB7XG4gICAgICBlbGVtZW50c1sgZWxlbWVudHMubGVuZ3RoKysgXSA9IHBhcmVudDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudHM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXZlbnRzID0gcmVxdWlyZSggJy4uLy4uL2V2ZW50cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZWFkeSAoIGNiICkge1xuICB2YXIgZG9jID0gdGhpc1sgMCBdO1xuICB2YXIgcmVhZHlTdGF0ZTtcblxuICBpZiAoICEgZG9jIHx8IGRvYy5ub2RlVHlwZSAhPT0gOSApIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlYWR5U3RhdGUgPSBkb2MucmVhZHlTdGF0ZTtcblxuICBpZiAoIGRvYy5hdHRhY2hFdmVudCA/IHJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScgOiByZWFkeVN0YXRlID09PSAnbG9hZGluZycgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICAgIGV2ZW50cy5vbiggZG9jLCAnRE9NQ29udGVudExvYWRlZCcsIG51bGwsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNiKCk7XG4gICAgfSwgZmFsc2UsIHRydWUgKTtcbiAgfSBlbHNlIHtcbiAgICBjYigpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlbW92ZSAoKSB7XG4gIHZhciBpID0gdGhpcy5sZW5ndGggLSAxO1xuICB2YXIgcGFyZW50Tm9kZTtcbiAgdmFyIG5vZGVUeXBlO1xuXG4gIGZvciAoIDsgaSA+PSAwOyAtLWkgKSB7XG4gICAgbm9kZVR5cGUgPSB0aGlzWyBpIF0ubm9kZVR5cGU7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgYnJhY2UtcnVsZXMvYnJhY2Utb24tc2FtZS1saW5lXG4gICAgaWYgKCBub2RlVHlwZSAhPT0gMSAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDMgJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSA4ICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gOSAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDExICkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKCAoIHBhcmVudE5vZGUgPSB0aGlzWyBpIF0ucGFyZW50Tm9kZSApICkge1xuICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggdGhpc1sgaSBdICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuLi8uLi9jcmVhdGUvY3JlYXRlLXJlbW92ZS1wcm9wJyApKCByZXF1aXJlKCAnLi4vLi4vYmFzZS9iYXNlLXJlbW92ZS1hdHRyJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4uLy4uL2NyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AnICkoIGZ1bmN0aW9uIF9yZW1vdmVQcm9wICggZWxlbWVudCwga2V5ICkge1xuICBkZWxldGUgZWxlbWVudFsga2V5IF07XG59ICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZmlyc3QgICAgICAgID0gcmVxdWlyZSggJy4uLy4uL2ludGVybmFsL2ZpcnN0JyApO1xuXG52YXIgYmFzZUNvcHlBcnJheSA9IHJlcXVpcmUoICcuLi8uLi9iYXNlL2Jhc2UtY29weS1hcnJheScgKTtcblxudmFyIERPTVdyYXBwZXIgICAgPSByZXF1aXJlKCAnLi4nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RhY2sgKCBlbGVtZW50cyApIHtcbiAgdmFyIHdyYXBwZXIgPSBuZXcgRE9NV3JhcHBlcigpO1xuXG4gIGlmICggZWxlbWVudHMgKSB7XG4gICAgaWYgKCBlbGVtZW50cy5sZW5ndGggKSB7XG4gICAgICBiYXNlQ29weUFycmF5KCB3cmFwcGVyLCBlbGVtZW50cyApLmxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgX2ZpcnN0KCB3cmFwcGVyLCBlbGVtZW50cyApO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBwZXIuX3ByZXZpb3VzID0gd3JhcHBlci5wcmV2T2JqZWN0ID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cblxuICByZXR1cm4gd3JhcHBlcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY3NzTnVtYmVycyAgID0gcmVxdWlyZSggJy4uLy4uL2ludGVybmFsL2Nzcy1udW1iZXJzJyApO1xudmFyIF9nZXRTdHlsZSAgICAgPSByZXF1aXJlKCAnLi4vLi4vaW50ZXJuYWwvZ2V0LXN0eWxlJyApO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4uLy4uL2lzLW9iamVjdC1saWtlJyApO1xudmFyIGNhbWVsaXplICAgICA9IHJlcXVpcmUoICcuLi8uLi9jYW1lbGl6ZScgKTtcbnZhciBhY2Nlc3MgICAgICAgPSByZXF1aXJlKCAnLi4vLi4vYWNjZXNzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlICgga2V5LCB2YWwgKSB7XG4gIHZhciBweCA9ICdkby1ub3QtYWRkJztcblxuICAvLyBDb21wdXRlIHB4IG9yIGFkZCAncHgnIHRvIGB2YWxgIG5vdy5cblxuICBpZiAoIHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmICEgX2Nzc051bWJlcnNbIGNhbWVsaXplKCBrZXkgKSBdICkge1xuICAgIGlmICggdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgKSB7XG4gICAgICB2YWwgKz0gJ3B4JztcbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgcHggPSAnZ290LWEtZnVuY3Rpb24nO1xuICAgIH1cbiAgfSBlbHNlIGlmICggaXNPYmplY3RMaWtlKCBrZXkgKSApIHtcbiAgICBweCA9ICdnb3QtYW4tb2JqZWN0JztcbiAgfVxuXG4gIHJldHVybiBhY2Nlc3MoIHRoaXMsIGtleSwgdmFsLCBmdW5jdGlvbiAoIGVsZW1lbnQsIGtleSwgdmFsLCBjaGFpbmFibGUgKSB7XG4gICAgaWYgKCBlbGVtZW50Lm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAga2V5ID0gY2FtZWxpemUoIGtleSApO1xuXG4gICAgaWYgKCAhIGNoYWluYWJsZSApIHtcbiAgICAgIHJldHVybiBfZ2V0U3R5bGUoIGVsZW1lbnQsIGtleSApO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgJiYgKCBweCA9PT0gJ2dvdC1hLWZ1bmN0aW9uJyB8fCBweCA9PT0gJ2dvdC1hbi1vYmplY3QnICYmICEgX2Nzc051bWJlcnNbIGtleSBdICkgKSB7XG4gICAgICB2YWwgKz0gJ3B4JztcbiAgICB9XG5cbiAgICBlbGVtZW50LnN0eWxlWyBrZXkgXSA9IHZhbDtcbiAgfSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbWVsaXplID0gcmVxdWlyZSggJy4uLy4uL2NhbWVsaXplJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlcyAoIGtleXMgKSB7XG4gIHZhciBlbGVtZW50ID0gdGhpc1sgMCBdO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBjb21wdXRlZDtcbiAgdmFyIHZhbHVlO1xuICB2YXIga2V5O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBrZXkgPSBrZXlzWyBpIF07XG5cbiAgICBpZiAoICEgY29tcHV0ZWQgKSB7XG4gICAgICB2YWx1ZSA9IGVsZW1lbnQuc3R5bGVbICgga2V5ID0gY2FtZWxpemUoIGtleSApICkgXTtcbiAgICB9XG5cbiAgICBpZiAoICEgdmFsdWUgKSB7XG4gICAgICBpZiAoICEgY29tcHV0ZWQgKSB7XG4gICAgICAgIGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbWVudCApO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoIGtleSApO1xuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlQXNzaWduID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWFzc2lnbicgKTtcblxudmFyIGlzc2V0ICAgICAgPSByZXF1aXJlKCAnLi9pc3NldCcgKTtcbnZhciBrZXlzICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxudmFyIGRlZmF1bHRzID0gW1xuICAnYWx0S2V5JywgICAgICAgICdidWJibGVzJywgICAgICAgICdjYW5jZWxhYmxlJyxcbiAgJ2NhbmNlbEJ1YmJsZScsICAnY2hhbmdlZFRvdWNoZXMnLCAnY3RybEtleScsXG4gICdjdXJyZW50VGFyZ2V0JywgJ2RldGFpbCcsICAgICAgICAgJ2V2ZW50UGhhc2UnLFxuICAnbWV0YUtleScsICAgICAgICdwYWdlWCcsICAgICAgICAgICdwYWdlWScsXG4gICdzaGlmdEtleScsICAgICAgJ3ZpZXcnLCAgICAgICAgICAgJ2NoYXInLFxuICAnY2hhckNvZGUnLCAgICAgICdrZXknLCAgICAgICAgICAgICdrZXlDb2RlJyxcbiAgJ2J1dHRvbicsICAgICAgICAnYnV0dG9ucycsICAgICAgICAnY2xpZW50WCcsXG4gICdjbGllbnRZJywgICAgICAgJ29mZnNldFgnLCAgICAgICAgJ29mZnNldFknLFxuICAncG9pbnRlcklkJywgICAgICdwb2ludGVyVHlwZScsICAgICdyZWxhdGVkVGFyZ2V0JyxcbiAgJ3JldHVyblZhbHVlJywgICAnc2NyZWVuWCcsICAgICAgICAnc2NyZWVuWScsXG4gICd0YXJnZXRUb3VjaGVzJywgJ3RvRWxlbWVudCcsICAgICAgJ3RvdWNoZXMnLFxuICAnaXNUcnVzdGVkJ1xuXTtcblxuZnVuY3Rpb24gRXZlbnQgKCBvcmlnaW5hbCwgb3B0aW9ucyApIHtcbiAgdmFyIGk7XG4gIHZhciBrO1xuXG4gIGlmICggdHlwZW9mIG9yaWdpbmFsID09PSAnb2JqZWN0JyApIHtcbiAgICBmb3IgKCBpID0gZGVmYXVsdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoIGlzc2V0KCBrID0gZGVmYXVsdHNbIGkgXSwgb3JpZ2luYWwgKSApIHtcbiAgICAgICAgdGhpc1sgayBdID0gb3JpZ2luYWxbIGsgXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIG9yaWdpbmFsLnRhcmdldCApIHtcbiAgICAgIGlmICggb3JpZ2luYWwudGFyZ2V0Lm5vZGVUeXBlID09PSAzICkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsLnRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBvcmlnaW5hbC50YXJnZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5hbCA9IHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuICAgIHRoaXMud2hpY2ggPSBFdmVudC53aGljaCggb3JpZ2luYWwgKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmlzVHJ1c3RlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygb3JpZ2luYWwgPT09ICdzdHJpbmcnICkge1xuICAgIHRoaXMudHlwZSA9IG9yaWdpbmFsO1xuICB9IGVsc2UgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgKSB7XG4gICAgdGhpcy50eXBlID0gb3B0aW9ucztcbiAgfVxuXG4gIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICkge1xuICAgIGJhc2VBc3NpZ24oIHRoaXMsIG9wdGlvbnMsIGtleXMoIG9wdGlvbnMgKSApO1xuICB9XG59XG5cbkV2ZW50LnByb3RvdHlwZSA9IHtcbiAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0ICgpIHtcbiAgICBpZiAoIHRoaXMub3JpZ2luYWwgKSB7XG4gICAgICBpZiAoIHRoaXMub3JpZ2luYWwucHJldmVudERlZmF1bHQgKSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHRoaXMub3JpZ2luYWwucmV0dXJuVmFsdWU7XG4gICAgfVxuICB9LFxuXG4gIHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uICgpIHtcbiAgICBpZiAoIHRoaXMub3JpZ2luYWwgKSB7XG4gICAgICBpZiAoIHRoaXMub3JpZ2luYWwuc3RvcFByb3BhZ2F0aW9uICkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IHRoaXMub3JpZ2luYWwuY2FuY2VsQnViYmxlO1xuICAgIH1cbiAgfSxcblxuICBjb25zdHJ1Y3RvcjogRXZlbnRcbn07XG5cbkV2ZW50LndoaWNoID0gZnVuY3Rpb24gd2hpY2ggKCBldmVudCApIHtcbiAgaWYgKCBldmVudC53aGljaCApIHtcbiAgICByZXR1cm4gZXZlbnQud2hpY2g7XG4gIH1cblxuICBpZiAoICEgZXZlbnQudHlwZS5pbmRleE9mKCAna2V5JyApICkge1xuICAgIGlmICggdHlwZW9mIGV2ZW50LmNoYXJDb2RlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHJldHVybiBldmVudC5jaGFyQ29kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXZlbnQua2V5Q29kZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIGV2ZW50LmJ1dHRvbiA9PT0gJ3VuZGVmaW5lZCcgfHwgISAvXig/Om1vdXNlfHBvaW50ZXJ8Y29udGV4dG1lbnV8ZHJhZ3xkcm9wKXxjbGljay8udGVzdCggZXZlbnQudHlwZSApICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCBldmVudC5idXR0b24gJiAxICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmICggZXZlbnQuYnV0dG9uICYgMiApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG4gICAgcmV0dXJuIDM7XG4gIH1cblxuICBpZiAoIGV2ZW50LmJ1dHRvbiAmIDQgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICAgIHJldHVybiAyO1xuICB9XG5cbiAgcmV0dXJuIDA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuL0RPTVdyYXBwZXInICk7XG5cbmZ1bmN0aW9uIF8gKCBzZWxlY3RvciwgY29udGV4dCApIHtcbiAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBzZWxlY3RvciwgY29udGV4dCApO1xufVxuXG5fLmZuID0gXy5wcm90b3R5cGUgPSBET01XcmFwcGVyLnByb3RvdHlwZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbl8uZm4uY29uc3RydWN0b3IgPSBfO1xuXG5tb2R1bGUuZXhwb3J0cyA9IF87XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbnZhciB0eXBlICAgICAgID0gcmVxdWlyZSggJy4vdHlwZScgKTtcbnZhciBrZXlzICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxuZnVuY3Rpb24gYWNjZXNzICggb2JqLCBrZXksIHZhbCwgZm4sIF9ub0NoZWNrICkge1xuICB2YXIgY2hhaW5hYmxlID0gX25vQ2hlY2sgfHwgdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCc7XG4gIHZhciBidWxrID0ga2V5ID09PSBudWxsIHx8IGtleSA9PT0gJ3VuZGVmaW5lZCc7XG4gIHZhciBsZW4gPSBvYmoubGVuZ3RoO1xuICB2YXIgcmF3ID0gZmFsc2U7XG4gIHZhciBlO1xuICB2YXIgaztcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggISBfbm9DaGVjayAmJiB0eXBlKCBrZXkgKSA9PT0gJ29iamVjdCcgKSB7XG4gICAgZm9yICggaSA9IDAsIGsgPSBrZXlzKCBrZXkgKSwgbCA9IGsubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgYWNjZXNzKCBvYmosIGtbIGkgXSwga2V5WyBrWyBpIF0gXSwgZm4sIHRydWUgKTtcbiAgICB9XG5cbiAgICBjaGFpbmFibGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICBpZiAoIHR5cGVvZiB2YWwgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByYXcgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICggYnVsayApIHtcbiAgICAgIGlmICggcmF3ICkge1xuICAgICAgICBmbi5jYWxsKCBvYmosIHZhbCApO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWxrID0gZm47XG5cbiAgICAgICAgZm4gPSBmdW5jdGlvbiAoIGUsIGtleSwgdmFsICkge1xuICAgICAgICAgIHJldHVybiBidWxrLmNhbGwoIG5ldyBET01XcmFwcGVyKCBlICksIHZhbCApO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggZm4gKSB7XG4gICAgICBmb3IgKCBpID0gMDsgaSA8IGxlbjsgKytpICkge1xuICAgICAgICBlID0gb2JqWyBpIF07XG5cbiAgICAgICAgaWYgKCByYXcgKSB7XG4gICAgICAgICAgZm4oIGUsIGtleSwgdmFsLCB0cnVlICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm4oIGUsIGtleSwgdmFsLmNhbGwoIGUsIGksIGZuKCBlLCBrZXkgKSApLCB0cnVlICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFpbmFibGUgPSB0cnVlO1xuICB9XG5cbiAgaWYgKCBjaGFpbmFibGUgKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGlmICggYnVsayApIHtcbiAgICByZXR1cm4gZm4uY2FsbCggb2JqICk7XG4gIH1cblxuICBpZiAoIGxlbiApIHtcbiAgICByZXR1cm4gZm4oIG9ialsgMCBdLCBrZXkgKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFjY2VzcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJvcGVydHkge09iamVjdH0gaGVhZGVyc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHRpbWVvdXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRob2RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIEEgcmVxdWVzdCBoZWFkZXJzLlxuICAgKi9cbiAgaGVhZGVyczoge1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04J1xuICB9LFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgZm9yIGNhbmNlbCBhIHJlcXVlc3QuXG4gICAqL1xuICB0aW1lb3V0OiAxMDAwICogNjAsXG5cbiAgLyoqXG4gICAqIEEgcmVxdWVzdCBtZXRob2Q6ICdHRVQnLCAnUE9TVCcgKG90aGVycyBhcmUgaWdub3JlZCwgaW5zdGVhZCwgJ0dFVCcgd2lsbCBiZSB1c2VkKS5cbiAgICovXG4gIG1ldGhvZDogJ0dFVCdcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggdHlwZW9mIHFzID09PSAndW5kZWZpbmVkJyApIHtcbiAgdmFyIHFzO1xuXG4gIHRyeSB7XG4gICAgcXMgPSByZXF1aXJlKCAncXMnICk7XG4gIH0gY2F0Y2ggKCBlcnJvciApIHt9XG59XG5cbnZhciBfb3B0aW9ucyA9IHJlcXVpcmUoICcuL2FqYXgtb3B0aW9ucycgKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoICcuL2RlZmF1bHRzJyApO1xudmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3Jvc3MtYnJvd3NlciBYTUxIdHRwUmVxdWVzdDogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI1NTcyNjhcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUhUVFBSZXF1ZXN0ICgpIHtcbiAgdmFyIEhUVFBGYWN0b3JpZXM7IHZhciBpO1xuXG4gIEhUVFBGYWN0b3JpZXMgPSBbXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNc3htbDMuWE1MSFRUUCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwyLlhNTEhUVFAuNi4wJyApO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNc3htbDIuWE1MSFRUUC4zLjAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMi5YTUxIVFRQJyApO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNaWNyb3NvZnQuWE1MSFRUUCcgKTtcbiAgICB9XG4gIF07XG5cbiAgZm9yICggaSA9IDA7IGkgPCBIVFRQRmFjdG9yaWVzLmxlbmd0aDsgKytpICkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKCBjcmVhdGVIVFRQUmVxdWVzdCA9IEhUVFBGYWN0b3JpZXNbIGkgXSApKCk7XG4gICAgfSBjYXRjaCAoIGV4ICkge31cbiAgfVxuXG4gIHRocm93IEVycm9yKCAnY2Fubm90IGNyZWF0ZSBYTUxIdHRwUmVxdWVzdCBvYmplY3QnICk7XG59XG5cbi8qKlxuICogQG1ldGhvZCBwZWFrby5hamF4XG4gKiBAcGFyYW0gIHtzdHJpbmd8b2JqZWN0fSBwYXRoICAgICAgICAgICAgICBBIFVSTCBvciBvcHRpb25zLlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgW29wdGlvbnNdICAgICAgICAgQW4gb3B0aW9ucy5cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgIFtvcHRpb25zLnBhdGhdICAgIEEgVVJMLlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgW29wdGlvbnMubWV0aG9kXSAgQSByZXF1ZXN0IG1ldGhvZC4gSWYgbm8gcHJlc2VudCBHRVQgb3IgUE9TVCB3aWxsIGJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkLlxuICogQHBhcmFtICB7Ym9vbGVhbn0gICAgICAgW29wdGlvbnMuYXN5bmNdICAgRGVmYXVsdCB0byBgdHJ1ZWAgd2hlbiBvcHRpb25zIHNwZWNpZmllZCwgb3IgYGZhbHNlYFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiBubyBvcHRpb25zLlxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgW29wdGlvbnMuc3VjY2Vzc10gV2lsbCBiZSBjYWxsZWQgd2hlbiBhIHNlcnZlciByZXNwb25kIHdpdGggMnh4IHN0YXR1c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZS5cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgIFtvcHRpb25zLmVycm9yXSAgIFdpbGwgYmUgY2FsbGVkIHdoZW4gYSBzZXJ2ZXIgcmVzcG9uZCB3aXRoIG90aGVyIHN0YXR1c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSBvciBhbiBlcnJvciBvY2N1cnMgd2hpbGUgcGFyc2luZyByZXNwb25zZS5cbiAqIEByZXR1cm4ge3N0cmluZz99ICAgICAgICAgICAgICAgICAgICAgICAgIFJldHVybnMgYSByZXNwb25zZSBkYXRhIGlmIGEgcmVxdWVzdCB3YXMgc3luY2hyb25vdXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJ3aXNlIGBudWxsYC5cbiAqIEBleGFtcGxlIDxjYXB0aW9uPlN5bmNocm9ub3VzIChkbyBub3QgdXNlKSBHRVQgcmVxdWVzdDwvY2FwdGlvbj5cbiAqIHZhciBkYXRhID0gYWpheCgnLi9kYXRhLmpzb24nKTtcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlN5bmNocm9ub3VzIChkbyBub3QgdXNlKSBHRVQgcmVxdWVzdCwgd2l0aCBjYWxsYmFja3M8L2NhcHRpb24+XG4gKiB2YXIgZGF0YSA9IGFqYXgoJy4vZGF0YS5qc29uJywge1xuICogICBzdWNjZXNzOiBzdWNjZXNzLFxuICogICBhc3luYzogICBmYWxzZVxuICogfSk7XG4gKlxuICogZnVuY3Rpb24gc3VjY2VzcyhzYW1lRGF0YSkge1xuICogICBjb25zb2xlLmxvZyhzYW1lRGF0YSk7XG4gKiB9XG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Bc3luY2hyb25vdXMgUE9TVCByZXF1ZXN0PC9jYXB0aW9uPlxuICogZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICogICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xuICogICBjb25zb2xlLmVycm9yKG1lc3NhZ2UgfHwgdGhpcy5zdGF0dXMgKyAnOiAnICsgdGhpcy5zdGF0dXNUZXh0KTtcbiAqIH1cbiAqXG4gKiB2YXIgaGVhZGVycyA9IHtcbiAqICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICogfTtcbiAqXG4gKiB2YXIgZGF0YSA9IHtcbiAqICAgdXNlcm5hbWU6IGRvY3VtZW50LmZvcm1zLnNpZ251cC5lbGVtZW50cy51c2VybmFtZS52YWx1ZSxcbiAqICAgZ2VuZGVyOiAgIGRvY3VtZW50LmZvcm1zLnNpZ251cC5lbGVtZW50cy5nZW5kZXIudmFsdWVcbiAqIH1cbiAqXG4gKiBhamF4KCcvYXBpL3NpZ251cC8/c3RlcD0wJywge1xuICogICBoZWFkZXJzOiBoZWFkZXJzLFxuICogICBzdWNjZXNzOiBzdWNjZXNzLFxuICogICBlcnJvcjogICBlcnJvcixcbiAqICAgZGF0YTogICAgZGF0YVxuICogfSk7XG4gKi9cbmZ1bmN0aW9uIGFqYXggKCBwYXRoLCBvcHRpb25zICkge1xuICB2YXIgdGltZW91dElkID0gbnVsbDtcbiAgdmFyIGRhdGEgPSBudWxsO1xuICB2YXIgeGhyID0gY3JlYXRlSFRUUFJlcXVlc3QoKTtcbiAgdmFyIHJlcUNvbnRlbnRUeXBlO1xuICB2YXIgbWV0aG9kO1xuICB2YXIgYXN5bmM7XG4gIHZhciBuYW1lO1xuXG4gIC8vIF8uYWpheCggb3B0aW9ucyApO1xuICAvLyBhc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgdHJ1ZVxuICBpZiAoIHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJyApIHtcbiAgICBvcHRpb25zID0gZGVmYXVsdHMoIF9vcHRpb25zLCBwYXRoICk7XG4gICAgYXN5bmMgPSAhICggJ2FzeW5jJyBpbiBvcHRpb25zICkgfHwgb3B0aW9ucy5hc3luYztcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoO1xuXG4gIC8vIF8uYWpheCggcGF0aCApO1xuICAvLyBhc3luYyA9IGZhbHNlXG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zID09PSBudWxsICkge1xuICAgIG9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICBhc3luYyA9IGZhbHNlO1xuXG4gIC8vIF8uYWpheCggcGF0aCwgb3B0aW9ucyApO1xuICAvLyBhc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgdHJ1ZVxuICB9IGVsc2Uge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0cyggX29wdGlvbnMsIG9wdGlvbnMgKTtcbiAgICBhc3luYyA9ICEgKCAnYXN5bmMnIGluIG9wdGlvbnMgKSB8fCBvcHRpb25zLmFzeW5jO1xuICB9XG5cbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzQ29udGVudFR5cGU7XG4gICAgdmFyIHN0YXR1cztcbiAgICB2YXIgb2JqZWN0O1xuICAgIHZhciBlcnJvcjtcblxuICAgIGlmICggdGhpcy5yZWFkeVN0YXRlICE9PSA0ICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN0YXR1cyA9IHRoaXMuc3RhdHVzID09PSAxMjIzIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICAgICAgPyAyMDRcbiAgICAgIDogdGhpcy5zdGF0dXM7XG5cbiAgICByZXNDb250ZW50VHlwZSA9IHRoaXMuZ2V0UmVzcG9uc2VIZWFkZXIoICdjb250ZW50LXR5cGUnICk7XG5cbiAgICBvYmplY3QgPSB7XG4gICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgIHBhdGg6IHBhdGhcbiAgICB9O1xuXG4gICAgZGF0YSA9IHRoaXMucmVzcG9uc2VUZXh0O1xuXG4gICAgaWYgKCByZXNDb250ZW50VHlwZSApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICggISByZXNDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24vanNvbicgKSApIHtcbiAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSggZGF0YSApO1xuICAgICAgICB9IGVsc2UgaWYgKCAhIHJlc0NvbnRlbnRUeXBlLmluZGV4T2YoICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnICkgKSB7XG4gICAgICAgICAgZGF0YSA9IHFzLnBhcnNlKCBkYXRhICk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBfZXJyb3IgKSB7XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoICEgZXJyb3IgJiYgc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgKSB7XG4gICAgICBpZiAoIHRpbWVvdXRJZCAhPT0gbnVsbCApIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SWQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBvcHRpb25zLnN1Y2Nlc3MgKSB7XG4gICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5jYWxsKCB0aGlzLCBkYXRhLCBvYmplY3QgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCBvcHRpb25zLmVycm9yICkge1xuICAgICAgb3B0aW9ucy5lcnJvci5jYWxsKCB0aGlzLCBkYXRhLCBvYmplY3QgKTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG5cbiAgaWYgKCB0eXBlb2YgbWV0aG9kID09PSAndW5kZWZpbmVkJyApIHtcbiAgICBtZXRob2QgPSAnZGF0YScgaW4gb3B0aW9ucyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgICAgID8gJ1BPU1QnXG4gICAgICA6ICdHRVQnO1xuICB9XG5cbiAgeGhyLm9wZW4oIG1ldGhvZCwgcGF0aCwgYXN5bmMgKTtcblxuICBpZiAoIG9wdGlvbnMuaGVhZGVycyApIHtcbiAgICBmb3IgKCBuYW1lIGluIG9wdGlvbnMuaGVhZGVycyApIHtcbiAgICAgIGlmICggISBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBvcHRpb25zLmhlYWRlcnMsIG5hbWUgKSApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICggbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJyApIHtcbiAgICAgICAgcmVxQ29udGVudFR5cGUgPSBvcHRpb25zLmhlYWRlcnNbIG5hbWUgXTtcbiAgICAgIH1cblxuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoIG5hbWUsIG9wdGlvbnMuaGVhZGVyc1sgbmFtZSBdICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCBhc3luYyAmJiB0eXBlb2Ygb3B0aW9ucy50aW1lb3V0ICE9PSAndW5kZWZpbmVkJyAmJiBvcHRpb25zLnRpbWVvdXQgIT09IG51bGwgKSB7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgeGhyLmFib3J0KCk7XG4gICAgfSwgb3B0aW9ucy50aW1lb3V0ICk7XG4gIH1cblxuICBpZiAoIHR5cGVvZiByZXFDb250ZW50VHlwZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVxQ29udGVudFR5cGUgIT09IG51bGwgJiYgJ2RhdGEnIGluIG9wdGlvbnMgKSB7XG4gICAgaWYgKCAhIHJlcUNvbnRlbnRUeXBlLmluZGV4T2YoICdhcHBsaWNhdGlvbi9qc29uJyApICkge1xuICAgICAgeGhyLnNlbmQoIEpTT04uc3RyaW5naWZ5KCBvcHRpb25zLmRhdGEgKSApO1xuICAgIH0gZWxzZSBpZiAoICEgcmVxQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgKSApIHtcbiAgICAgIHhoci5zZW5kKCBxcy5zdHJpbmdpZnkoIG9wdGlvbnMuZGF0YSApICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHhoci5zZW5kKCBvcHRpb25zLmRhdGEgKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgeGhyLnNlbmQoKTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFqYXg7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1hc3NpZ24nICkoIHJlcXVpcmUoICcuL2tleXMtaW4nICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtYXNzaWduJyApKCByZXF1aXJlKCAnLi9rZXlzJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUFzc2lnbiAoIG9iaiwgc3JjLCBrICkge1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSBrLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBvYmpbIGtbIGkgXSBdID0gc3JjWyBrWyBpIF0gXTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzc2V0ID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VDbG9uZUFycmF5ICggaXRlcmFibGUgKSB7XG4gIHZhciBpID0gaXRlcmFibGUubGVuZ3RoO1xuICB2YXIgY2xvbmUgPSBBcnJheSggaSApO1xuXG4gIHdoaWxlICggLS1pID49IDAgKSB7XG4gICAgaWYgKCBpc3NldCggaSwgaXRlcmFibGUgKSApIHtcbiAgICAgIGNsb25lWyBpIF0gPSBpdGVyYWJsZVsgaSBdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjbG9uZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB0YXJnZXQsIHNvdXJjZSApIHtcbiAgZm9yICggdmFyIGkgPSBzb3VyY2UubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgdGFyZ2V0WyBpIF0gPSBzb3VyY2VbIGkgXTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRXhlYyAoIHJlZ2V4cCwgc3RyaW5nICkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciB2YWx1ZTtcblxuICByZWdleHAubGFzdEluZGV4ID0gMDtcblxuICB3aGlsZSAoICggdmFsdWUgPSByZWdleHAuZXhlYyggc3RyaW5nICkgKSApIHtcbiAgICByZXN1bHQucHVzaCggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEl0ZXJhdGVlID0gcmVxdWlyZSggJy4uL2ludGVybmFsL2NhbGwtaXRlcmF0ZWUnICk7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VGb3JFYWNoICggYXJyLCBmbiwgY3R4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciBpO1xuICB2YXIgajtcblxuICBmb3IgKCBpID0gLTEsIGogPSBhcnIubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBpZHggPSBqO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZHggPSArK2k7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggaWR4LCBhcnIgKSAmJiBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIGFyclsgaWR4IF0sIGlkeCwgYXJyICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFycjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvY2FsbC1pdGVyYXRlZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRm9ySW4gKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCwga2V5cyApIHtcbiAgdmFyIGtleTtcbiAgdmFyIGk7XG4gIHZhciBqO1xuXG4gIGZvciAoIGkgPSAtMSwgaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBrZXkgPSBrZXlzWyBqIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IGtleXNbICsraSBdO1xuICAgIH1cblxuICAgIGlmICggY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCBvYmpbIGtleSBdLCBrZXksIG9iaiApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUdldCAoIG9iaiwgcGF0aCwgb2ZmICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGggLSBvZmY7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlSGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGg7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB2YXIgYmFzZVRvSW5kZXggPSByZXF1aXJlKCAnLi9iYXNlLXRvLWluZGV4JyApO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIGJhc2VJbmRleE9mXG4gKiBAcGFyYW0gIHtvYmplY3R9ICBhcnJheVxuICogQHBhcmFtICB7YW55fSAgICAgdmFsdWVcbiAqIEBwYXJhbSAge251bWJlcj99IGZyb21JbmRleFxuICogQHBhcmFtICB7Ym9vbGVhbn0gZnJvbVJpZ2h0XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUluZGV4T2YgKCBhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgZnJvbVJpZ2h0ICkge1xuICAvLyBpZiAoIHR5cGVvZiBmcm9tSW5kZXggPT09ICd1bmRlZmluZWQnICkge1xuICAvLyAgIGZyb21JbmRleCA9IGZyb21SaWdodFxuICAvLyAgICAgPyBhcnJheS5sZW5ndGggLSAxXG4gIC8vICAgICA6IDA7XG4gIC8vIH0gZWxzZSB7XG4gIC8vICAgZnJvbUluZGV4ID0gYmFzZVRvSW5kZXgoIGZyb21JbmRleCwgYXJyYXkubGVuZ3RoICk7XG4gIC8vIH1cblxuICBpZiAoIHZhbHVlID09PSB2YWx1ZSApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGVybmFyeVxuICAgIHJldHVybiBmcm9tUmlnaHRcbiAgICAgID8gQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoIGFycmF5LCB2YWx1ZSApXG4gICAgICA6IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoIGFycmF5LCB2YWx1ZSApO1xuICB9XG5cbiAgZm9yICggdmFyIGwgPSBhcnJheS5sZW5ndGggLSAxLCBpID0gbDsgaSA+PSAwOyAtLWkgKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRlcm5hcnlcbiAgICB2YXIgaW5kZXggPSBmcm9tUmlnaHRcbiAgICAgID8gaVxuICAgICAgOiBsIC0gaTtcblxuICAgIGlmICggYXJyYXlbIGluZGV4IF0gPT09IHZhbHVlIHx8IHZhbHVlICE9PSB2YWx1ZSAmJiBhcnJheVsgaW5kZXggXSAhPT0gYXJyYXlbIGluZGV4IF0gKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldCA9IHJlcXVpcmUoICcuL2Jhc2UtZ2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VJbnZva2UgKCBvYmplY3QsIHBhdGgsIGFyZ3MgKSB7XG4gIGlmICggb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggcGF0aC5sZW5ndGggPD0gMSApIHtcbiAgICAgIHJldHVybiBvYmplY3RbIHBhdGhbIDAgXSBdLmFwcGx5KCBvYmplY3QsIGFyZ3MgKTtcbiAgICB9XG5cbiAgICBpZiAoICggb2JqZWN0ID0gZ2V0KCBvYmplY3QsIHBhdGgsIDEgKSApICkge1xuICAgICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgcGF0aC5sZW5ndGggLSAxIF0gXS5hcHBseSggb2JqZWN0LCBhcmdzICk7XG4gICAgfVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0ID0gcmVxdWlyZSggJy4vYmFzZS1nZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVByb3BlcnR5ICggb2JqZWN0LCBwYXRoICkge1xuICBpZiAoIG9iamVjdCAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqZWN0ICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICBpZiAoIHBhdGgubGVuZ3RoID4gMSApIHtcbiAgICAgIHJldHVybiBnZXQoIG9iamVjdCwgcGF0aCwgMCApO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3RbIHBhdGhbIDAgXSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VSYW5kb20gKCBsb3dlciwgdXBwZXIgKSB7XG4gIHJldHVybiBsb3dlciArIE1hdGgucmFuZG9tKCkgKiAoIHVwcGVyIC0gbG93ZXIgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwcm9wcyA9IHJlcXVpcmUoICcuLi9wcm9wcycgKTtcblxuaWYgKCByZXF1aXJlKCAnLi4vc3VwcG9ydC9zdXBwb3J0LWdldC1hdHRyaWJ1dGUnICkgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3JlbW92ZUF0dHIgKCBlbGVtZW50LCBrZXkgKSB7XG4gICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoIGtleSApO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfcmVtb3ZlQXR0ciAoIGVsZW1lbnQsIGtleSApIHtcbiAgICBkZWxldGUgZWxlbWVudFsgcHJvcHNbIGtleSBdIHx8IGtleSBdO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVNldCAoIG9iaiwgcGF0aCwgdmFsICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGg7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaSA9PT0gbCAtIDEgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdID0gdmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuICAgIH0gZWxzZSBpZiAoIGlzc2V0KCBrZXksIG9iaiApICkge1xuICAgICAgb2JqID0gb2JqWyBrZXkgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqID0gb2JqWyBrZXkgXSA9IHt9OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VWYWx1ZXMgKCBvYmplY3QsIGtleXMgKSB7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHZhciB2YWx1ZXMgPSBBcnJheSggaSApO1xuXG4gIHdoaWxlICggLS1pID49IDAgKSB7XG4gICAgdmFsdWVzWyBpIF0gPSBvYmplY3RbIGtleXNbIGkgXSBdO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfQXJndW1lbnRFeGNlcHRpb24gPSByZXF1aXJlKCAnLi9pbnRlcm5hbC9Bcmd1bWVudEV4Y2VwdGlvbicgKTtcbnZhciBkZWZhdWx0VG8gPSByZXF1aXJlKCAnLi9kZWZhdWx0LXRvJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlZm9yZSAoIG4sIGZuICkge1xuICB2YXIgdmFsdWU7XG5cbiAgaWYgKCB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicgKSB7XG4gICAgdGhyb3cgX0FyZ3VtZW50RXhjZXB0aW9uKCBmbiwgJ2EgZnVuY3Rpb24nICk7XG4gIH1cblxuICBuID0gZGVmYXVsdFRvKCBuLCAxICk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIC0tbiA+PSAwICkge1xuICAgICAgdmFsdWUgPSBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9jZXNzQXJncyA9IHJlcXVpcmUoICcuL2ludGVybmFsL3Byb2Nlc3MtYXJncycgKTtcblxudmFyIF8gICAgICAgICAgICA9IHJlcXVpcmUoICcuL3BsYWNlaG9sZGVyJyApO1xuXG4vKipcbiAqINCt0YLQsCDRgNCw0YHRiNC40YDQtdC90L3QsNGPINCy0LXRgNGB0LjRjyDRgdGC0LDQvdC00LDRgNGC0L3QvtCz0L4gRVM1IGBGdW5jdGlvbi5iaW5kYCwg0LIg0LrQvtGC0L7RgNC+0Lkg0LXRgdGC0Ywg0L/QvtC00LTQtdGA0LbQutCwIHBsYWNlaG9sZGVyYNC+0LIuXG4gKiBAbWV0aG9kIF8uYmluZFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZ1bmN0aW9uXyAgINCc0LXRgtC+0LQsINC60L7RgtC+0YDRi9C5INC90LDQtNC+INC/0YDQuNCy0Y/Qt9Cw0YLRjCDQuiDQutC+0L3RgtC10LrRgdGC0YMgKNC90L7QstGL0LkgdGhpcykuXG4gKiBAcGFyYW0gIHthbnl9ICAgICAgdGhpc0FyZyAgICAg0JrQvtC90YLQtdC60YHRgiAo0L3QvtCy0YvQuSB0aGlzINC00LvRjyDQvNC10YLQvtC00LApLlxuICogQHBhcmFtICB7Li4uYW55fSAgIHBhcnRpYWxBcmdzINCn0LDRgdGC0LjRh9C90YvQtSDQsNGA0LPRg9C80LXQvdGC0Ysg0YEge0BsaW5rIF8ucGxhY2Vob2xkZXJ9LlxuICogQHJldHVybiB7RnVuY3Rpb259ICAgICAgICAgICAgINCd0L7QstGL0LksINC/0YDQuNCy0Y/Qt9Cw0L3QvdGL0Lkg0Log0L3QvtCy0L7QvNGDIHRoaXMg0LzQtdGC0L7QtC5cbiAqIEBleGFtcGxlXG4gKiB2YXIgYm91bmQgPSBfLmJpbmQoIGZ1bmN0aW9uXywgbmV3VGhpcywgXy5fLCAnIScgKTtcbiAqL1xuZnVuY3Rpb24gYmluZCAoIGZ1bmN0aW9uXywgdGhpc0FyZyApIHtcbiAgaWYgKCB0eXBlb2YgZnVuY3Rpb25fICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHRocm93IFR5cGVFcnJvciggJ2luIF8uYmluZCgpLCBwcm92aWRlZCBcImZ1bmN0aW9uX1wiIGlzIG5vdCBhIGZ1bmN0aW9uICgnICsgdHlwZW9mIGZ1bmN0aW9uXyArICcpJyApO1xuICB9XG5cbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBhcmdzTGVuID0gYXJncy5sZW5ndGg7XG5cbiAgLy8gSWYgbm8gcGFydGlhbEFyZ3Mgd2VyZSBwcm92aWRlZCBtYWtlIGEgdGlueSBvcHRpbWl6YXRpb24gdXNpbmcgYnVpbHQtaW5cbiAgLy8gYEZ1bmN0aW9uLmJpbmRgLlxuICBpZiAoIGFyZ3NMZW4gPD0gMiApIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbCggZnVuY3Rpb25fLCB0aGlzQXJnICk7XG4gIH1cblxuICAvLyBTa2lwIGZ1bmN0aW9uXyBhbmQgdGhpc0FyZy5cbiAgdmFyIGkgPSAyO1xuXG4gIC8vIFNlYXJjaCBmb3IgcGxhY2Vob2xkZXJzIGluIHRoZSBhcmd1bWVudHMuXG4gIGZvciAoIDsgaSA8IGFyZ3NMZW47ICsraSApIHtcbiAgICBpZiAoIGFyZ3NbIGkgXSA9PT0gXyApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIElmIG5vIHBsYWNlaG9sZGVycyBpbiB0aGUgcGFydGlhbEFyZ3Mgd2VyZSBwcm92aWRlZCBtYWtlIGEgdGlueVxuICAvLyBvcHRpbWl6YXRpb24gdXNpbmcgYnVpbHQtaW4gYEZ1bmN0aW9uLmJpbmRgLlxuICBpZiAoIGkgPT09IGFyZ3NMZW4gKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsLmFwcGx5KCBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCwgYXJncyApO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kICgpIHtcbiAgICAvLyBDYWxsIGEgZnVuY3Rpb24gd2l0aCBuZXcgdGhpcyAodGhpc0FyZykgYW5kIHByb2Nlc3NlZCBhcmd1bWVudHMuXG4gICAgcmV0dXJuIGZ1bmN0aW9uXy5hcHBseSggdGhpc0FyZywgX3Byb2Nlc3NBcmdzKCBhcmdzLCBhcmd1bWVudHMgKSApO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1cHBlckZpcnN0ID0gcmVxdWlyZSggJy4vdXBwZXItZmlyc3QnICk7XG5cbi8vIGNhbWVsaXplKCAnYmFja2dyb3VuZC1yZXBlYXQteCcgKTsgLy8gLT4gJ2JhY2tncm91bmRSZXBlYXRYJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplICggc3RyaW5nICkge1xuICB2YXIgd29yZHMgPSBzdHJpbmcubWF0Y2goIC9bMC05YS16XSsvZ2kgKTtcbiAgdmFyIHJlc3VsdDtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggISB3b3JkcyApIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXN1bHQgPSB3b3Jkc1sgMCBdLnRvTG93ZXJDYXNlKCk7XG5cbiAgZm9yICggaSA9IDEsIGwgPSB3b3Jkcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgcmVzdWx0ICs9IHVwcGVyRmlyc3QoIHdvcmRzWyBpIF0gKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3VuZXNjYXBlID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdW5lc2NhcGUnICk7XG52YXIgX3R5cGUgICAgID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdHlwZScgKTtcblxudmFyIGJhc2VFeGVjICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1leGVjJyApO1xuXG52YXIgaXNLZXkgICAgID0gcmVxdWlyZSggJy4vaXMta2V5JyApO1xudmFyIHRvS2V5ICAgICA9IHJlcXVpcmUoICcuL3RvLWtleScgKTtcblxudmFyIHJQcm9wZXJ0eSA9IC8oXnxcXC4pXFxzKihbX2Etel1cXHcqKVxccyp8XFxbXFxzKigoPzotKT8oPzpcXGQrfFxcZCpcXC5cXGQrKXwoXCJ8JykoKFteXFxcXF1cXFxcKFxcXFxcXFxcKSp8W15cXDRdKSopXFw0KVxccypcXF0vZ2k7XG5cbmZ1bmN0aW9uIHN0cmluZ1RvUGF0aCAoIHN0ciApIHtcbiAgdmFyIHBhdGggPSBiYXNlRXhlYyggclByb3BlcnR5LCBzdHIgKTtcbiAgdmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7XG4gIHZhciB2YWw7XG5cbiAgZm9yICggOyBpID49IDA7IC0taSApIHtcbiAgICB2YWwgPSBwYXRoWyBpIF07XG5cbiAgICAvLyAubmFtZVxuICAgIGlmICggdmFsWyAyIF0gKSB7XG4gICAgICBwYXRoWyBpIF0gPSB2YWxbIDIgXTtcbiAgICAvLyBbIFwiXCIgXSB8fCBbICcnIF1cbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsWyA1IF0gPT09ICdzdHJpbmcnICkge1xuICAgICAgcGF0aFsgaSBdID0gX3VuZXNjYXBlKCB2YWxbIDUgXSApO1xuICAgIC8vIFsgMCBdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdGhbIGkgXSA9IHZhbFsgMyBdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBjYXN0UGF0aCAoIHZhbCApIHtcbiAgdmFyIHBhdGg7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoIGlzS2V5KCB2YWwgKSApIHtcbiAgICByZXR1cm4gWyB0b0tleSggdmFsICkgXTtcbiAgfVxuXG4gIGlmICggX3R5cGUoIHZhbCApID09PSAnYXJyYXknICkge1xuICAgIHBhdGggPSBBcnJheSggbCA9IHZhbC5sZW5ndGggKTtcblxuICAgIGZvciAoIGkgPSBsIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBwYXRoWyBpIF0gPSB0b0tleSggdmFsWyBpIF0gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHN0cmluZ1RvUGF0aCggJycgKyB2YWwgKTtcbiAgfVxuXG4gIHJldHVybiBwYXRoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RQYXRoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBtZXRob2QgcGVha28uY2xhbXBcbiAqIEBwYXJhbSAge251bWJlcn0gdmFsdWUgQSBudW1iZXIgdG8gYmUgY2xhbXBlZC5cbiAqIEBwYXJhbSAge251bWJlcn0gbG93ZXIgTG93ZXIgYm91bmQgb2YgdGhlIGNsYW1wLlxuICogQHBhcmFtICB7bnVtYmVyfSB1cHBlciBVcHBlciBib3VuZCBvZiB0aGUgY2xhbXAuXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xhbXAgKCB2YWx1ZSwgbG93ZXIsIHVwcGVyICkge1xuICBpZiAoIHZhbHVlID49IHVwcGVyICkge1xuICAgIHJldHVybiB1cHBlcjtcbiAgfVxuXG4gIGlmICggdmFsdWUgPD0gbG93ZXIgKSB7XG4gICAgcmV0dXJuIGxvd2VyO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSggJy4vZ2V0LXByb3RvdHlwZS1vZicgKTtcbnZhciBpc09iamVjdExpa2UgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xudmFyIHRvT2JqZWN0ICAgICAgID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGVhY2ggICAgICAgICAgID0gcmVxdWlyZSggJy4vZWFjaCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9uZSAoIGRlZXAsIHRhcmdldCwgZ3VhcmQgKSB7XG4gIHZhciBjbG47XG5cbiAgaWYgKCB0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyB8fCBndWFyZCApIHtcbiAgICB0YXJnZXQgPSBkZWVwO1xuICAgIGRlZXAgPSB0cnVlO1xuICB9XG5cbiAgY2xuID0gT2JqZWN0LmNyZWF0ZSggZ2V0UHJvdG90eXBlT2YoIHRhcmdldCA9IHRvT2JqZWN0KCB0YXJnZXQgKSApICk7XG5cbiAgZWFjaCggdGFyZ2V0LCBmdW5jdGlvbiAoIHZhbHVlLCBrZXksIHRhcmdldCApIHtcbiAgICBpZiAoIHZhbHVlID09PSB0YXJnZXQgKSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IHRoaXM7XG4gICAgfSBlbHNlIGlmICggZGVlcCAmJiBpc09iamVjdExpa2UoIHZhbHVlICkgKSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IGNsb25lKCBkZWVwLCB2YWx1ZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IHZhbHVlO1xuICAgIH1cbiAgfSwgY2xuICk7XG5cbiAgcmV0dXJuIGNsbjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9zZXN0ID0gcmVxdWlyZSggJy4vY2xvc2VzdCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9zZXN0Tm9kZSAoIGUsIGMgKSB7XG4gIGlmICggdHlwZW9mIGMgPT09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiBjbG9zZXN0LmNhbGwoIGUsIGMgKTtcbiAgfVxuXG4gIGRvIHtcbiAgICBpZiAoIGUgPT09IGMgKSB7XG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIH0gd2hpbGUgKCAoIGUgPSBlLnBhcmVudE5vZGUgKSApO1xuXG4gIHJldHVybiBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1hdGNoZXMgPSByZXF1aXJlKCAnLi9tYXRjaGVzLXNlbGVjdG9yJyApO1xuXG52YXIgY2xvc2VzdDtcblxuaWYgKCB0eXBlb2YgRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgISAoIGNsb3Nlc3QgPSBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ICkgKSB7XG4gIGNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0ICggc2VsZWN0b3IgKSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCBtYXRjaGVzLmNhbGwoIGVsZW1lbnQsIHNlbGVjdG9yICkgKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCAoIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQgKSApO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvc2VzdDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3VuZCAoIGZ1bmN0aW9ucyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbXBvdW5kZWQgKCkge1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGZvciAoIGkgPSAwLCBsID0gZnVuY3Rpb25zLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIHZhbHVlID0gZnVuY3Rpb25zWyBpIF0uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBFUlI6IHtcbiAgICBJTlZBTElEX0FSR1M6ICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50cycsXG4gICAgRlVOQ1RJT05fRVhQRUNURUQ6ICAgICAnRXhwZWN0ZWQgYSBmdW5jdGlvbicsXG4gICAgU1RSSU5HX0VYUEVDVEVEOiAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcnLFxuICAgIFVOREVGSU5FRF9PUl9OVUxMOiAgICAgJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcsXG4gICAgUkVEVUNFX09GX0VNUFRZX0FSUkFZOiAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScsXG4gICAgTk9fUEFUSDogICAgICAgICAgICAgICAnTm8gcGF0aCB3YXMgZ2l2ZW4nXG4gIH0sXG5cbiAgTUFYX0FSUkFZX0xFTkdUSDogNDI5NDk2NzI5NSxcbiAgTUFYX1NBRkVfSU5UOiAgICAgOTAwNzE5OTI1NDc0MDk5MSxcbiAgTUlOX1NBRkVfSU5UOiAgICAtOTAwNzE5OTI1NDc0MDk5MSxcblxuICBERUVQOiAgICAgICAgIDEsXG4gIERFRVBfS0VFUF9GTjogMlxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VBc3NpZ24gPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWFzc2lnbicgKTtcbnZhciBFUlIgICAgICAgID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlQXNzaWduICgga2V5cyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGFzc2lnbiAoIG9iaiApIHtcbiAgICB2YXIgc3JjO1xuICAgIHZhciBsO1xuICAgIHZhciBpO1xuXG4gICAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSAxLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIHNyYyA9IGFyZ3VtZW50c1sgaSBdO1xuXG4gICAgICBpZiAoIHNyYyAhPT0gbnVsbCAmJiB0eXBlb2Ygc3JjICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgYmFzZUFzc2lnbiggb2JqLCBzcmMsIGtleXMoIHNyYyApICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlRm9yRWFjaCAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1lYWNoJyApO1xudmFyIGJhc2VGb3JJbiAgICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWluJyApO1xudmFyIGlzQXJyYXlMaWtlICA9IHJlcXVpcmUoICcuLi9pcy1hcnJheS1saWtlJyApO1xudmFyIHRvT2JqZWN0ICAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmF0ZWUgICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xudmFyIGtleXMgICAgICAgICA9IHJlcXVpcmUoICcuLi9rZXlzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVhY2ggKCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBlYWNoICggb2JqLCBmbiwgY3R4ICkge1xuXG4gICAgb2JqID0gdG9PYmplY3QoIG9iaiApO1xuXG4gICAgZm4gID0gaXRlcmF0ZWUoIGZuICk7XG5cbiAgICBpZiAoIGlzQXJyYXlMaWtlKCBvYmogKSApIHtcbiAgICAgIHJldHVybiBiYXNlRm9yRWFjaCggb2JqLCBmbiwgY3R4LCBmcm9tUmlnaHQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZUZvckluKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCwga2V5cyggb2JqICkgKTtcblxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFc2NhcGUgKCByZWdleHAsIG1hcCApIHtcbiAgZnVuY3Rpb24gcmVwbGFjZXIgKCBjICkge1xuICAgIHJldHVybiBtYXBbIGMgXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBlc2NhcGUgKCBzdHJpbmcgKSB7XG4gICAgaWYgKCBzdHJpbmcgPT09IG51bGwgfHwgdHlwZW9mIHN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuICggc3RyaW5nICs9ICcnICkucmVwbGFjZSggcmVnZXhwLCByZXBsYWNlciApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbGxJdGVyYXRlZSA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC9jYWxsLWl0ZXJhdGVlJyApO1xudmFyIHRvT2JqZWN0ICAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmFibGUgICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhYmxlJyApO1xudmFyIGl0ZXJhdGVlICAgICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcbnZhciBpc3NldCAgICAgICAgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRmluZCAoIHJldHVybkluZGV4LCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmaW5kICggYXJyLCBmbiwgY3R4ICkge1xuICAgIHZhciBqID0gKCBhcnIgPSBpdGVyYWJsZSggdG9PYmplY3QoIGFyciApICkgKS5sZW5ndGggLSAxO1xuICAgIHZhciBpID0gLTE7XG4gICAgdmFyIGlkeDtcbiAgICB2YXIgdmFsO1xuXG4gICAgZm4gPSBpdGVyYXRlZSggZm4gKTtcblxuICAgIGZvciAoIDsgaiA+PSAwOyAtLWogKSB7XG4gICAgICBpZiAoIGZyb21SaWdodCApIHtcbiAgICAgICAgaWR4ID0gajtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlkeCA9ICsraTtcbiAgICAgIH1cblxuICAgICAgdmFsID0gYXJyWyBpZHggXTtcblxuICAgICAgaWYgKCBpc3NldCggaWR4LCBhcnIgKSAmJiBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIHZhbCwgaWR4LCBhcnIgKSApIHtcbiAgICAgICAgaWYgKCByZXR1cm5JbmRleCApIHtcbiAgICAgICAgICByZXR1cm4gaWR4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIHJldHVybkluZGV4ICkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGaXJzdCAoIG5hbWUgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIHN0ciApIHtcbiAgICBpZiAoIHN0ciA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gICAgfVxuXG4gICAgcmV0dXJuICggc3RyICs9ICcnICkuY2hhckF0KCAwIClbIG5hbWUgXSgpICsgc3RyLnNsaWNlKCAxICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUZvckVhY2ggPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1lYWNoJyApO1xudmFyIHRvT2JqZWN0ICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcbnZhciBpdGVyYXRlZSAgICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcbnZhciBpdGVyYWJsZSAgICA9IHJlcXVpcmUoICcuLi9pdGVyYWJsZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGb3JFYWNoICggZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9yRWFjaCAoIGFyciwgZm4sIGN0eCApIHtcbiAgICByZXR1cm4gYmFzZUZvckVhY2goIGl0ZXJhYmxlKCB0b09iamVjdCggYXJyICkgKSwgaXRlcmF0ZWUoIGZuICksIGN0eCwgZnJvbVJpZ2h0ICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUZvckluID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItaW4nICk7XG52YXIgdG9PYmplY3QgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcbnZhciBpdGVyYXRlZSAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRm9ySW4gKCBrZXlzLCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb3JJbiAoIG9iaiwgZm4sIGN0eCApIHtcbiAgICByZXR1cm4gYmFzZUZvckluKCBvYmogPSB0b09iamVjdCggb2JqICksIGl0ZXJhdGVlKCBmbiApLCBjdHgsIGZyb21SaWdodCwga2V5cyggb2JqICkgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTXVzdCBiZSAnV2lkdGgnIG9yICdIZWlnaHQnIChjYXBpdGFsaXplZCkuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlR2V0RWxlbWVudERpbWVuc2lvbiAoIG5hbWUgKSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1dpbmRvd3xOb2RlfSBlXG4gICAqL1xuICByZXR1cm4gZnVuY3Rpb24gKCBlICkge1xuICAgIHZhciB2O1xuICAgIHZhciBiO1xuICAgIHZhciBkO1xuXG4gICAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgYSB3aW5kb3dcblxuICAgIGlmICggZS53aW5kb3cgPT09IGUgKSB7XG5cbiAgICAgIC8vIGlubmVyV2lkdGggYW5kIGlubmVySGVpZ2h0IGluY2x1ZGVzIGEgc2Nyb2xsYmFyIHdpZHRoLCBidXQgaXQgaXMgbm90XG4gICAgICAvLyBzdXBwb3J0ZWQgYnkgb2xkZXIgYnJvd3NlcnNcblxuICAgICAgdiA9IE1hdGgubWF4KCBlWyAnaW5uZXInICsgbmFtZSBdIHx8IDAsIGUuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50WyAnY2xpZW50JyArIG5hbWUgXSApO1xuXG4gICAgLy8gaWYgdGhlIGVsZW1lbnRzIGlzIGEgZG9jdW1lbnRcblxuICAgIH0gZWxzZSBpZiAoIGUubm9kZVR5cGUgPT09IDkgKSB7XG5cbiAgICAgIGIgPSBlLmJvZHk7XG4gICAgICBkID0gZS5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgIHYgPSBNYXRoLm1heChcbiAgICAgICAgYlsgJ3Njcm9sbCcgKyBuYW1lIF0sXG4gICAgICAgIGRbICdzY3JvbGwnICsgbmFtZSBdLFxuICAgICAgICBiWyAnb2Zmc2V0JyArIG5hbWUgXSxcbiAgICAgICAgZFsgJ29mZnNldCcgKyBuYW1lIF0sXG4gICAgICAgIGJbICdjbGllbnQnICsgbmFtZSBdLFxuICAgICAgICBkWyAnY2xpZW50JyArIG5hbWUgXSApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHYgPSBlWyAnY2xpZW50JyArIG5hbWUgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdjtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtaW5kZXgtb2YnICk7XG5cbnZhciB0b09iamVjdCAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgY3JlYXRlSW5kZXhPZlxuICogQHBhcmFtICB7Ym9vbGVhbn0gIGZyb21SaWdodFxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlSW5kZXhPZiAoIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGluZGV4T2YgKCBhcnJheSwgdmFsdWUsIGZyb21JbmRleCApIHtcbiAgICByZXR1cm4gYmFzZUluZGV4T2YoIHRvT2JqZWN0KCBhcnJheSApLCB2YWx1ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuLi9jYXN0LXBhdGgnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUHJvcGVydHlPZiAoIGJhc2VQcm9wZXJ0eSwgdXNlQXJncyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggb2JqZWN0ICkge1xuICAgIHZhciBhcmdzO1xuXG4gICAgaWYgKCB1c2VBcmdzICkge1xuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgICAgaWYgKCAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gYmFzZVByb3BlcnR5KCBvYmplY3QsIHBhdGgsIGFyZ3MgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4uL2Nhc3QtcGF0aCcgKTtcbnZhciBub29wICAgICA9IHJlcXVpcmUoICcuLi9ub29wJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVByb3BlcnR5ICggYmFzZVByb3BlcnR5LCB1c2VBcmdzICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgIHZhciBhcmdzO1xuXG4gICAgaWYgKCAhICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGggKSB7XG4gICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG5cbiAgICBpZiAoIHVzZUFyZ3MgKSB7XG4gICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoIG9iamVjdCApIHtcbiAgICAgIHJldHVybiBiYXNlUHJvcGVydHkoIG9iamVjdCwgcGF0aCwgYXJncyApO1xuICAgIH07XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3dvcmRzID0gcmVxdWlyZSggJy4uL2ludGVybmFsL3dvcmRzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jcmVhdGVSZW1vdmVQcm9wICggX3JlbW92ZVByb3AgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIGtleXMgKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG4gICAgdmFyIGo7XG5cbiAgICBpZiAoIHR5cGVvZiBrZXlzID09PSAnc3RyaW5nJyAgKSB7XG4gICAgICBrZXlzID0gX3dvcmRzKCBrZXlzICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZm9yICggaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgICAgIF9yZW1vdmVQcm9wKCBlbGVtZW50LCBrZXlzWyBqIF0gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVUcmltICggcmVnZXhwICkge1xuICByZXR1cm4gZnVuY3Rpb24gdHJpbSAoIHN0cmluZyApIHtcbiAgICBpZiAoIHN0cmluZyA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyaW5nID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gICAgfVxuXG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS5yZXBsYWNlKCByZWdleHAsICcnICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UgKCBtYXhXYWl0LCBmbiApIHtcbiAgdmFyIHRpbWVvdXRJZCA9IG51bGw7XG5cbiAgaWYgKCB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicgKSB7XG4gICAgdGhyb3cgX0FyZ3VtZW50RXhjZXB0aW9uKCBmbiwgJ2EgZnVuY3Rpb24nICk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgIGlmICggdGltZW91dElkICE9PSBudWxsICkge1xuICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SWQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0LmFwcGx5KCBudWxsLCBbIGZuLCBtYXhXYWl0IF0uY29uY2F0KCBbXS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoIGZuLCBtYXhXYWl0ICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsICgpIHtcbiAgICBpZiAoIHRpbWVvdXRJZCAhPT0gbnVsbCApIHtcbiAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgICB0aW1lb3V0SWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVib3VuY2VkOiBkZWJvdW5jZWQsXG4gICAgY2FuY2VsOiAgICBjYW5jZWxcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmYXVsdFRvICggdmFsdWUsIGRlZmF1bHRWYWx1ZSApIHtcbiAgaWYgKCB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSB2YWx1ZSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1peGluID0gcmVxdWlyZSggJy4vbWl4aW4nICk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRzICggZGVmYXVsdHMsIG9iamVjdCApIHtcbiAgaWYgKCBvYmplY3QgKSB7XG4gICAgcmV0dXJuIG1peGluKCB7fSwgZGVmYXVsdHMsIG9iamVjdCApO1xuICB9XG5cbiAgcmV0dXJuIG1peGluKCB7fSwgZGVmYXVsdHMgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVhY2gnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVhY2gnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVzY2FwZScgKSggL1s8PlwiJyZdL2csIHtcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICBcIidcIjogJyYjMzk7JyxcbiAgJ1wiJzogJyYjMzQ7JyxcbiAgJyYnOiAnJmFtcDsnXG59ICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9zZXN0Tm9kZSA9IHJlcXVpcmUoICcuL2Nsb3Nlc3Qtbm9kZScgKTtcbnZhciBET01XcmFwcGVyICA9IHJlcXVpcmUoICcuL0RPTVdyYXBwZXInICk7XG52YXIgRXZlbnQgICAgICAgPSByZXF1aXJlKCAnLi9FdmVudCcgKTtcblxudmFyIGV2ZW50cyA9IHtcbiAgaXRlbXM6IHt9LFxuICB0eXBlczogW11cbn07XG5cbnZhciBzdXBwb3J0ID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmICdhZGRFdmVudExpc3RlbmVyJyBpbiBzZWxmO1xuXG4vKipcbiAqIEBtZXRob2QgcGVha28uZXZlbnRzLm9uXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgZWxlbWVudFxuICogQHBhcmFtICB7c3RyaW5nfSAgIHR5cGVcbiAqIEBwYXJhbSAge3N0cmluZz99ICBzZWxlY3RvclxuICogQHBhcmFtICB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gKiBAcGFyYW0gIHtib29sZWFufSAgdXNlQ2FwdHVyZVxuICogQHBhcmFtICB7Ym9vbGVhbn0gIFtvbmNlXVxuICogQHJldHVybiB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiBfLmV2ZW50cy5vbiggZG9jdW1lbnQsICdjbGljaycsICcucG9zdF9fbGlrZS1idXR0b24nLCAoIGV2ZW50ICkgPT4ge1xuICogICBjb25zdCBkYXRhID0ge1xuICogICAgIGlkOiBfKCB0aGlzICkucGFyZW50KCAnLnBvc3QnICkuZGF0YSggJ2lkJyApXG4gKiAgIH1cbiAqXG4gKiAgIF8uYWpheCggJy9saWtlJywgeyBkYXRhIH0gKVxuICogfSwgZmFsc2UgKVxuICovXG5leHBvcnRzLm9uID0gZnVuY3Rpb24gb24gKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUsIG9uY2UgKSB7XG4gIHZhciBpdGVtID0ge1xuICAgIHVzZUNhcHR1cmU6IHVzZUNhcHR1cmUsXG4gICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgb25jZTogb25jZVxuICB9O1xuXG4gIGlmICggc2VsZWN0b3IgKSB7XG4gICAgaXRlbS5zZWxlY3RvciA9IHNlbGVjdG9yO1xuICB9XG5cbiAgaWYgKCBzdXBwb3J0ICkge1xuICAgIGl0ZW0ud3JhcHBlciA9IGZ1bmN0aW9uIHdyYXBwZXIgKCBldmVudCwgX2VsZW1lbnQgKSB7XG4gICAgICBpZiAoIHNlbGVjdG9yICYmICEgX2VsZW1lbnQgJiYgISAoIF9lbGVtZW50ID0gY2xvc2VzdE5vZGUoIGV2ZW50LnRhcmdldCwgc2VsZWN0b3IgKSApICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggb25jZSApIHtcbiAgICAgICAgZXhwb3J0cy5vZmYoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lci5jYWxsKCBfZWxlbWVudCB8fCBlbGVtZW50LCBuZXcgRXZlbnQoIGV2ZW50ICkgKTtcbiAgICB9O1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBpdGVtLndyYXBwZXIsIHVzZUNhcHR1cmUgKTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nICkge1xuICAgIGl0ZW0ud3JhcHBlciA9IGZ1bmN0aW9uIHdyYXBwZXIgKCBldmVudCwgX2VsZW1lbnQgKSB7XG4gICAgICBpZiAoIHNlbGVjdG9yICYmICEgX2VsZW1lbnQgJiYgISAoIF9lbGVtZW50ID0gY2xvc2VzdE5vZGUoIGV2ZW50LnRhcmdldCwgc2VsZWN0b3IgKSApICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZSA9PT0gJ0RPTUNvbnRlbnRMb2FkZWQnICYmIGVsZW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJyApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9uY2UgKSB7XG4gICAgICAgIGV4cG9ydHMub2ZmKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKTtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXIuY2FsbCggX2VsZW1lbnQgfHwgZWxlbWVudCwgbmV3IEV2ZW50KCBldmVudCwgdHlwZSApICk7XG4gICAgfTtcblxuICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoIGl0ZW0uSUVUeXBlID0gSUVUeXBlKCB0eXBlICksIGl0ZW0ud3JhcHBlciApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFR5cGVFcnJvciggJ25vdCBpbXBsZW1lbnRlZCcgKTtcbiAgfVxuXG4gIGlmICggZXZlbnRzLml0ZW1zWyB0eXBlIF0gKSB7XG4gICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0ucHVzaCggaXRlbSApO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5pdGVtc1sgdHlwZSBdID0gWyBpdGVtIF07XG4gICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0uaW5kZXggPSBldmVudHMudHlwZXMubGVuZ3RoO1xuICAgIGV2ZW50cy50eXBlcy5wdXNoKCB0eXBlICk7XG4gIH1cbn07XG5cbi8qKlxuICogQG1ldGhvZCBwZWFrby5ldmVudHMub2ZmXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgZWxlbWVudFxuICogQHBhcmFtICB7c3RyaW5nfSAgIHR5cGVcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzZWxlY3RvclxuICogQHBhcmFtICB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gKiBAcGFyYW0gIHtib29sZWFufSAgdXNlQ2FwdHVyZVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0cy5vZmYgPSBmdW5jdGlvbiBvZmYgKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG4gIHZhciBpdGVtcztcbiAgdmFyIGl0ZW07XG4gIHZhciBpO1xuXG4gIGlmICggdHlwZSA9PT0gbnVsbCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZm9yICggaSA9IGV2ZW50cy50eXBlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGV4cG9ydHMub2ZmKCBlbGVtZW50LCBldmVudHMudHlwZXNbIGkgXSwgc2VsZWN0b3IgKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoICEgKCBpdGVtcyA9IGV2ZW50cy5pdGVtc1sgdHlwZSBdICkgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggaSA9IGl0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGl0ZW0gPSBpdGVtc1sgaSBdO1xuXG4gICAgaWYgKCBpdGVtLmVsZW1lbnQgIT09IGVsZW1lbnQgfHxcbiAgICAgIHR5cGVvZiBsaXN0ZW5lciAhPT0gJ3VuZGVmaW5lZCcgJiYgKFxuICAgICAgICBpdGVtLmxpc3RlbmVyICE9PSBsaXN0ZW5lciB8fFxuICAgICAgICBpdGVtLnVzZUNhcHR1cmUgIT09IHVzZUNhcHR1cmUgfHxcbiAgICAgICAgLy8gdG9kbzogY2hlY2sgYm90aCBpdGVtLnNlbGVjdG9yIGFuZCBzZWxlY3RvciBhbmQgdGhlbiBjb21wYXJlXG4gICAgICAgIGl0ZW0uc2VsZWN0b3IgJiYgaXRlbS5zZWxlY3RvciAhPT0gc2VsZWN0b3IgKSApXG4gICAgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGJyYWNlLXN0eWxlXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpdGVtcy5zcGxpY2UoIGksIDEgKTtcblxuICAgIGlmICggISBpdGVtcy5sZW5ndGggKSB7XG4gICAgICBldmVudHMudHlwZXMuc3BsaWNlKCBpdGVtcy5pbmRleCwgMSApO1xuICAgICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICggc3VwcG9ydCApIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgaXRlbS53cmFwcGVyLCBpdGVtLnVzZUNhcHR1cmUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5kZXRhY2hFdmVudCggaXRlbS5JRVR5cGUsIGl0ZW0ud3JhcHBlciApO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy50cmlnZ2VyID0gZnVuY3Rpb24gdHJpZ2dlciAoIGVsZW1lbnQsIHR5cGUsIGRhdGEgKSB7XG4gIHZhciBpdGVtcyA9IGV2ZW50cy5pdGVtc1sgdHlwZSBdO1xuICB2YXIgY2xvc2VzdDtcbiAgdmFyIGl0ZW07XG4gIHZhciBpO1xuXG4gIGlmICggISBpdGVtcyApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpICkge1xuICAgIGl0ZW0gPSBpdGVtc1sgaSBdO1xuXG4gICAgaWYgKCBlbGVtZW50ICkge1xuICAgICAgY2xvc2VzdCA9IGNsb3Nlc3ROb2RlKCBlbGVtZW50LCBpdGVtLnNlbGVjdG9yIHx8IGl0ZW0uZWxlbWVudCApO1xuICAgIH0gZWxzZSBpZiAoIGl0ZW0uc2VsZWN0b3IgKSB7XG4gICAgICBuZXcgRE9NV3JhcHBlciggaXRlbS5zZWxlY3RvciApLmVhY2goICggZnVuY3Rpb24gKCBpdGVtICkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGl0ZW0ud3JhcHBlciggY3JlYXRlRXZlbnRXaXRoVGFyZ2V0KCB0eXBlLCBkYXRhLCB0aGlzICksIHRoaXMgKTtcbiAgICAgICAgfTtcbiAgICAgIH0gKSggaXRlbSApICk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zZXN0ID0gaXRlbS5lbGVtZW50O1xuICAgIH1cblxuICAgIGlmICggY2xvc2VzdCApIHtcbiAgICAgIGl0ZW0ud3JhcHBlciggY3JlYXRlRXZlbnRXaXRoVGFyZ2V0KCB0eXBlLCBkYXRhLCBlbGVtZW50IHx8IGNsb3Nlc3QgKSwgY2xvc2VzdCApO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5jb3B5ID0gZnVuY3Rpb24gY29weSAoIHRhcmdldCwgc291cmNlLCBkZWVwICkge1xuICB2YXIgaXRlbXM7XG4gIHZhciBpdGVtO1xuICB2YXIgdHlwZTtcbiAgdmFyIGk7XG4gIHZhciBqO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gZXZlbnRzLnR5cGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGlmICggKCBpdGVtcyA9IGV2ZW50cy5pdGVtc1sgdHlwZSA9IGV2ZW50cy50eXBlc1sgaSBdIF0gKSApIHtcbiAgICAgIGZvciAoIGogPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBqIDwgbDsgKytqICkge1xuICAgICAgICBpZiAoICggaXRlbSA9IGl0ZW1zWyBqIF0gKS50YXJnZXQgPT09IHNvdXJjZSApIHtcbiAgICAgICAgICBleHBvcnRzLm9uKCB0YXJnZXQsIHR5cGUsIG51bGwsIGl0ZW0ubGlzdGVuZXIsIGl0ZW0udXNlQ2FwdHVyZSwgaXRlbS5vbmNlICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoICEgZGVlcCApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0YXJnZXQgPSB0YXJnZXQuY2hpbGROb2RlcztcbiAgc291cmNlID0gc291cmNlLmNoaWxkTm9kZXM7XG5cbiAgZm9yICggaSA9IHRhcmdldC5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBleHBvcnRzLmNvcHkoIHRhcmdldFsgaSBdLCBzb3VyY2VbIGkgXSwgdHJ1ZSApO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFdpdGhUYXJnZXQgKCB0eXBlLCBkYXRhLCB0YXJnZXQgKSB7XG4gIHZhciBlID0gbmV3IEV2ZW50KCB0eXBlLCBkYXRhICk7XG4gIGUudGFyZ2V0ID0gdGFyZ2V0O1xuICByZXR1cm4gZTtcbn1cblxuZnVuY3Rpb24gSUVUeXBlICggdHlwZSApIHtcbiAgaWYgKCB0eXBlID09PSAnRE9NQ29udGVudExvYWRlZCcgKSB7XG4gICAgcmV0dXJuICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICB9XG5cbiAgcmV0dXJuICdvbicgKyB0eXBlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggdHJ1ZSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggZmFsc2UsIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpbmQnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1lYWNoJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItZWFjaCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzLWluJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMtaW4nICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1pbicgKSggcmVxdWlyZSggJy4va2V5cycgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcblxudmFyIHdyYXBwZXJzID0ge1xuICBjb2w6ICAgICAgWyAyLCAnPHRhYmxlPjxjb2xncm91cD4nLCAnPC9jb2xncm91cD48L3RhYmxlPicgXSxcbiAgdHI6ICAgICAgIFsgMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nIF0sXG4gIGRlZmF1bHRzOiBbIDAsICcnLCAnJyBdXG59O1xuXG5mdW5jdGlvbiBhcHBlbmQgKCBmcmFnbWVudCwgZWxlbWVudHMgKSB7XG4gIGZvciAoIHZhciBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggZWxlbWVudHNbIGkgXSApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZnJhZ21lbnQgKCBlbGVtZW50cywgY29udGV4dCApIHtcbiAgdmFyIGZyYWdtZW50ID0gY29udGV4dC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBlbGVtZW50O1xuICB2YXIgd3JhcHBlcjtcbiAgdmFyIHRhZztcbiAgdmFyIGRpdjtcbiAgdmFyIGk7XG4gIHZhciBqO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudHNbIGkgXTtcblxuICAgIGlmICggaXNPYmplY3RMaWtlKCBlbGVtZW50ICkgKSB7XG4gICAgICBpZiAoICdub2RlVHlwZScgaW4gZWxlbWVudCApIHtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGVsZW1lbnQgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGVuZCggZnJhZ21lbnQsIGVsZW1lbnQgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCAvPHwmIz9cXHcrOy8udGVzdCggZWxlbWVudCApICkge1xuICAgICAgaWYgKCAhIGRpdiApIHtcbiAgICAgICAgZGl2ID0gY29udGV4dC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgfVxuXG4gICAgICB0YWcgPSAvPChbYS16XVteXFxzPl0qKS9pLmV4ZWMoIGVsZW1lbnQgKTtcblxuICAgICAgaWYgKCB0YWcgKSB7XG4gICAgICAgIHdyYXBwZXIgPSB3cmFwcGVyc1sgdGFnID0gdGFnWyAxIF0gXSB8fCB3cmFwcGVyc1sgdGFnLnRvTG93ZXJDYXNlKCkgXSB8fCB3cmFwcGVycy5kZWZhdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyYXBwZXIgPSB3cmFwcGVycy5kZWZhdWx0cztcbiAgICAgIH1cblxuICAgICAgZGl2LmlubmVySFRNTCA9IHdyYXBwZXJbIDEgXSArIGVsZW1lbnQgKyB3cmFwcGVyWyAyIF07XG5cbiAgICAgIGZvciAoIGogPSB3cmFwcGVyWyAwIF07IGogPiAwOyAtLWogKSB7XG4gICAgICAgIGRpdiA9IGRpdi5sYXN0Q2hpbGQ7XG4gICAgICB9XG5cbiAgICAgIGFwcGVuZCggZnJhZ21lbnQsIGRpdi5jaGlsZE5vZGVzICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBjb250ZXh0LmNyZWF0ZVRleHROb2RlKCBlbGVtZW50ICkgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGRpdiApIHtcbiAgICBkaXYuaW5uZXJIVE1MID0gJyc7XG4gIH1cblxuICByZXR1cm4gZnJhZ21lbnQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZyb21QYWlycyAoIHBhaXJzICkge1xuICB2YXIgb2JqZWN0ID0ge307XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IHBhaXJzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBvYmplY3RbIHBhaXJzWyBpIF1bIDAgXSBdID0gcGFpcnNbIGkgXVsgMSBdO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1nZXQtZWxlbWVudC1kaW1lbnNpb24nICkoICdIZWlnaHQnICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1nZXQtZWxlbWVudC1kaW1lbnNpb24nICkoICdXaWR0aCcgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUiA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mICggb2JqICkge1xuICB2YXIgcHJvdG90eXBlO1xuXG4gIGlmICggb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICkge1xuICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gIH1cblxuICBwcm90b3R5cGUgPSBvYmouX19wcm90b19fO1xuXG4gIGlmICggdHlwZW9mIHByb3RvdHlwZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIHByb3RvdHlwZTtcbiAgfVxuXG4gIGlmICggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCBvYmouY29uc3RydWN0b3IgKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyApIHtcbiAgICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgYmFzZUdldCAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtZ2V0JyApO1xudmFyIEVSUiAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXQgKCBvYmplY3QsIHBhdGggKSB7XG4gIHZhciBsZW5ndGggPSAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoO1xuXG4gIGlmICggISBsZW5ndGggKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGxlbmd0aCA+IDEgKSB7XG4gICAgcmV0dXJuIGJhc2VHZXQoIHRvT2JqZWN0KCBvYmplY3QgKSwgcGF0aCwgMCApO1xuICB9XG5cbiAgcmV0dXJuIHRvT2JqZWN0KCBvYmplY3QgKVsgcGF0aFsgMCBdIF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgaXNzZXQgICAgPSByZXF1aXJlKCAnLi9pc3NldCcgKTtcbnZhciBiYXNlSGFzICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1oYXMnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhcyAoIG9iaiwgcGF0aCApIHtcbiAgdmFyIGwgPSAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoO1xuXG4gIGlmICggISBsICkge1xuICAgIHRocm93IEVycm9yKCBFUlIuTk9fUEFUSCApO1xuICB9XG5cbiAgaWYgKCBsID4gMSApIHtcbiAgICByZXR1cm4gYmFzZUhhcyggdG9PYmplY3QoIG9iaiApLCBwYXRoICk7XG4gIH1cblxuICByZXR1cm4gaXNzZXQoIHRvT2JqZWN0KCBvYmogKSwgcGF0aFsgMCBdICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlkZW50aXR5ICggdiApIHtcbiAgcmV0dXJuIHY7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtaW5kZXgtb2YnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfQXJndW1lbnRFeGNlcHRpb24gKCB1bmV4cGVjdGVkLCBleHBlY3RlZCApIHtcbiAgcmV0dXJuIEVycm9yKCAnXCInICsgdG9TdHJpbmcuY2FsbCggdW5leHBlY3RlZCApICsgJ1wiIGlzIG5vdCAnICsgZXhwZWN0ZWQgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FsbEl0ZXJhdGVlICggZm4sIGN0eCwgdmFsLCBrZXksIG9iaiApIHtcbiAgaWYgKCB0eXBlb2YgY3R4ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gZm4oIHZhbCwga2V5LCBvYmogKTtcbiAgfVxuXG4gIHJldHVybiBmbi5jYWxsKCBjdHgsIHZhbCwga2V5LCBvYmogKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogdHJ1ZSxcbiAgY29sdW1uQ291bnQ6IHRydWUsXG4gIGZpbGxPcGFjaXR5OiB0cnVlLFxuICBmbGV4U2hyaW5rOiB0cnVlLFxuICBmb250V2VpZ2h0OiB0cnVlLFxuICBsaW5lSGVpZ2h0OiB0cnVlLFxuICBmbGV4R3JvdzogdHJ1ZSxcbiAgb3BhY2l0eTogdHJ1ZSxcbiAgb3JwaGFuczogdHJ1ZSxcbiAgd2lkb3dzOiB0cnVlLFxuICB6SW5kZXg6IHRydWUsXG4gIG9yZGVyOiB0cnVlLFxuICB6b29tOiB0cnVlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9maXJzdCAoIHdyYXBwZXIsIGVsZW1lbnQgKSB7XG4gIHdyYXBwZXJbIDAgXSA9IGVsZW1lbnQ7XG4gIHdyYXBwZXIubGVuZ3RoID0gMTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgX2dldFN0eWxlXG4gKiBAcGFyYW0gIHtvYmplY3R9ICBlbGVtZW50XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICBzdHlsZVxuICogQHBhcmFtICB7b2JqZWN0fSBbY29tcHV0ZWRTdHlsZV1cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZ2V0U3R5bGUgKCBlbGVtZW50LCBzdHlsZSwgY29tcHV0ZWRTdHlsZSApIHtcbiAgcmV0dXJuIGVsZW1lbnQuc3R5bGVbIHN0eWxlIF0gfHxcbiAgICAoIGNvbXB1dGVkU3R5bGUgfHwgZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbWVudCApICkuZ2V0UHJvcGVydHlWYWx1ZSggc3R5bGUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgX21lbW9pemVcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBmdW5jdGlvbl9cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9tZW1vaXplICggZnVuY3Rpb25fICkge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG4gIHZhciBsYXN0UmVzdWx0O1xuICB2YXIgbGFzdFZhbHVlO1xuXG4gIHJldHVybiBmdW5jdGlvbiBtZW1vaXplZCAoIHZhbHVlICkge1xuICAgIHN3aXRjaCAoIGZhbHNlICkge1xuICAgICAgY2FzZSBjYWxsZWQ6XG4gICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgIC8vIGZhbGxzIHRocm91Z2hcbiAgICAgIGNhc2UgdmFsdWUgPT09IGxhc3RWYWx1ZTpcbiAgICAgICAgcmV0dXJuICggbGFzdFJlc3VsdCA9IGZ1bmN0aW9uXyggKCBsYXN0VmFsdWUgPSB2YWx1ZSApICkgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGFzdFJlc3VsdDtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSggJy4uL3BsYWNlaG9sZGVyJyApO1xuXG4vKipcbiAqINCt0YLQvtGCINC80LXRgtC+0LQg0LLQvtC30YDQsNGJ0LDQtdGCINC+0LTQuNC9INC80LDRgdGB0LjQsiDQsNGA0LPRg9C80LXQvdGC0L7QsiDQuNC3INGH0LDRgdGC0LjRh9C90YvRhSDQsNGA0LPRg9C80LXQvdGC0L7QsiDRgSBwbGFjZWhvbGRlcmDQsNC80LgsINC4XG4gKiDQsNGA0LPRg9C80LXQvdGC0L7QsiDQutC+0YLQvtGA0YvQtSDQsdGL0LvQuCDQv9GA0Lgg0LLRi9C30L7QstC1LlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgX3Byb2Nlc3NBcmdzXG4gKiBAcGFyYW0gIHtBcnJheS48YW55Pn0gcGFydGlhbEFyZ3Mg0KfQsNGB0YLQuNGH0L3Ri9C1INCw0YDQs9GD0LzQtdC90YLRiyDRgSBwbGFjZWhvbGRlcmDQsNC80LggKCdwZWFrby9wbGFjZWhvbGRlcicpLlxuICogQHBhcmFtICB7QXJyYXkuPGFueT59IGFyZ3MgICAgICAgINCQ0YDQs9GD0LzQtdC90YLRiyDQstGL0LfQvtCy0LAg0LrQsNC60L7Qs9C+LdC70LjQsdC+INC80LXRgtC+0LTQsC5cbiAqIEByZXR1cm4ge0FycmF5Ljxhbnk+fSAgICAgICAgICAgICDQntCx0YDQsNCx0L7RgtCw0L3QvdGL0LUg0LDRgNCz0YPQvNC10L3RgtGLLlxuICogQGV4YW1wbGVcbiAqIHZhciBhcmdzID0gX3Byb2Nlc3NBcmdzKCBbIF8sICchJyBdLCBbICdKb2huJyBdICk7XG4gKi9cbmZ1bmN0aW9uIF9wcm9jZXNzQXJncyAoIHBhcnRpYWxBcmdzLCBhcmdzICkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBqID0gLTE7XG4gIC8vIFNraXAgZnVuY3Rpb25fIGFuZCB0aGlzQXJnLlxuICB2YXIgaSA9IDI7XG4gIHZhciBsZW5ndGggPSBwYXJ0aWFsQXJncy5sZW5ndGg7XG5cbiAgZm9yICggOyBpIDwgbGVuZ3RoOyArK2kgKSB7XG4gICAgaWYgKCBwYXJ0aWFsQXJnc1sgaSBdID09PSBfICkge1xuICAgICAgcmVzdWx0LnB1c2goIGFyZ3NbICsraiBdICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKCBwYXJ0aWFsQXJnc1sgaSBdICk7XG4gICAgfVxuICB9XG5cbiAgZm9yICggbGVuZ3RoID0gYXJncy5sZW5ndGg7IGogPCBsZW5ndGg7ICsraiApIHtcbiAgICByZXN1bHQucHVzaCggYXJnc1sgaiBdICk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9wcm9jZXNzQXJncztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVzY2FwZSA9IHJlcXVpcmUoICcuLi9lc2NhcGUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3RleHRDb250ZW50ICggZWxlbWVudCwgdmFsdWUgKSB7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgdmFyIGNoaWxkcmVuO1xuICB2YXIgY2hpbGQ7XG4gIHZhciB0eXBlO1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgaWYgKCB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZXNjYXBlKCB2YWx1ZSApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSAwLCBsID0gKCBjaGlsZHJlbiA9IGVsZW1lbnQuY2hpbGROb2RlcyApLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAvLyBURVhUX05PREVcbiAgICBpZiAoICggdHlwZSA9ICggY2hpbGQgPSBjaGlsZHJlblsgaSBdICkubm9kZVR5cGUgKSA9PT0gMyApIHtcbiAgICAgIHJlc3VsdCArPSBjaGlsZC5ub2RlVmFsdWU7XG4gICAgLy8gRUxFTUVOVF9OT0RFXG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gMSApIHtcbiAgICAgIHJlc3VsdCArPSBfdGV4dENvbnRlbnQoIGNoaWxkICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vbWVtb2l6ZScgKSggcmVxdWlyZSggJy4uL3R5cGUnICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfdW5lc2NhcGUgKCBzdHJpbmcgKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSggL1xcXFwoXFxcXCk/L2csICckMScgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfQXJndW1lbnRFeGNlcHRpb24gPSByZXF1aXJlKCAnLi9Bcmd1bWVudEV4Y2VwdGlvbicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3b3JkcyAoIHN0cmluZyApIHtcbiAgaWYgKCB0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJyApIHtcbiAgICB0aHJvdyBfQXJndW1lbnRFeGNlcHRpb24oIHN0cmluZywgJ2Egc3RyaW5nJyApO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZy5tYXRjaCggL1teXFxzXFx1RkVGRlxceEEwXSsvZyApIHx8IFtdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGtleXMgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbnZlcnQgKCBvYmplY3QgKSB7XG4gIHZhciBrID0ga2V5cyggb2JqZWN0ID0gdG9PYmplY3QoIG9iamVjdCApICk7XG4gIHZhciBpbnZlcnRlZCA9IHt9O1xuICB2YXIgaTtcblxuICBmb3IgKCBpID0gay5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBpbnZlcnRlZFsga1sgaSBdIF0gPSBvYmplY3RbIGtbIGkgXSBdO1xuICB9XG5cbiAgcmV0dXJuIGludmVydGVkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xudmFyIGlzTGVuZ3RoICAgICA9IHJlcXVpcmUoICcuL2lzLWxlbmd0aCcgKTtcbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCAoIHZhbHVlICkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKCB2YWx1ZSApICYmIGlzTGVuZ3RoKCB2YWx1ZS5sZW5ndGggKSAmJiAhIGlzV2luZG93TGlrZSggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0xlbmd0aCAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcnJheUxpa2UgKCB2YWx1ZSApIHtcbiAgaWYgKCB2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyApIHtcbiAgICByZXR1cm4gaXNMZW5ndGgoIHZhbHVlLmxlbmd0aCApICYmICEgaXNXaW5kb3dMaWtlKCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNMZW5ndGggICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheSAoIHZhbHVlICkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKCB2YWx1ZSApICYmXG4gICAgaXNMZW5ndGgoIHZhbHVlLmxlbmd0aCApICYmXG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xudmFyIGlzV2luZG93TGlrZSA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRE9NRWxlbWVudCAoIHZhbHVlICkge1xuICB2YXIgbm9kZVR5cGU7XG5cbiAgaWYgKCAhIGlzT2JqZWN0TGlrZSggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIGlzV2luZG93TGlrZSggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG5vZGVUeXBlID0gdmFsdWUubm9kZVR5cGU7XG5cbiAgcmV0dXJuIG5vZGVUeXBlID09PSAxIHx8IC8vIEVMRU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDMgfHwgLy8gVEVYVF9OT0RFXG4gICAgICAgICBub2RlVHlwZSA9PT0gOCB8fCAvLyBDT01NRU5UX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSA5IHx8IC8vIERPQ1VNRU5UX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSAxMTsgIC8vIERPQ1VNRU5UX0ZSQUdNRU5UX05PREVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc051bWJlciA9IHJlcXVpcmUoICcuL2lzLW51bWJlcicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Zpbml0ZSAoIHZhbHVlICkge1xuICByZXR1cm4gaXNOdW1iZXIoIHZhbHVlICkgJiYgaXNGaW5pdGUoIHZhbHVlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3R5cGUgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC90eXBlJyApO1xuXG52YXIgckRlZXBLZXkgPSAvKF58W15cXFxcXSkoXFxcXFxcXFwpKihcXC58XFxbKS87XG5cbmZ1bmN0aW9uIGlzS2V5ICggdmFsICkge1xuICB2YXIgdHlwZTtcblxuICBpZiAoICEgdmFsICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCBfdHlwZSggdmFsICkgPT09ICdhcnJheScgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHlwZSA9IHR5cGVvZiB2YWw7XG5cbiAgaWYgKCB0eXBlID09PSAnbnVtYmVyJyB8fCB0eXBlID09PSAnYm9vbGVhbicgfHwgX3R5cGUoIHZhbCApID09PSAnc3ltYm9sJyApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiAhIHJEZWVwS2V5LnRlc3QoIHZhbCApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTUFYX0FSUkFZX0xFTkdUSCA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5NQVhfQVJSQVlfTEVOR1RIO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTGVuZ3RoICggdmFsdWUgKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPj0gMCAmJlxuICAgIHZhbHVlIDw9IE1BWF9BUlJBWV9MRU5HVEggJiZcbiAgICB2YWx1ZSAlIDEgPT09IDA7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTmFOICggdmFsdWUgKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTnVtYmVyICggdmFsdWUgKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc09iamVjdExpa2UgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5cbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgdG9TdHJpbmcuY2FsbCggdmFsdWUgKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCAnLi9nZXQtcHJvdG90eXBlLW9mJyApO1xudmFyIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0JyApO1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIE9CSkVDVCA9IHRvU3RyaW5nLmNhbGwoIE9iamVjdCApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QgKCB2ICkge1xuICB2YXIgcDtcbiAgdmFyIGM7XG5cbiAgaWYgKCAhIGlzT2JqZWN0KCB2ICkgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcCA9IGdldFByb3RvdHlwZU9mKCB2ICk7XG5cbiAgaWYgKCBwID09PSBudWxsICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCAhIGhhc093blByb3BlcnR5LmNhbGwoIHAsICdjb25zdHJ1Y3RvcicgKSApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjID0gcC5jb25zdHJ1Y3RvcjtcblxuICByZXR1cm4gdHlwZW9mIGMgPT09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCggYyApID09PSBPQkpFQ1Q7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzUHJpbWl0aXZlICggdmFsdWUgKSB7XG4gIHJldHVybiAhIHZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzRmluaXRlICA9IHJlcXVpcmUoICcuL2lzLWZpbml0ZScgKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTYWZlSW50ZWdlciAoIHZhbHVlICkge1xuICByZXR1cm4gaXNGaW5pdGUoIHZhbHVlICkgJiZcbiAgICB2YWx1ZSA8PSBjb25zdGFudHMuTUFYX1NBRkVfSU5UICYmXG4gICAgdmFsdWUgPj0gY29uc3RhbnRzLk1JTl9TQUZFX0lOVCAmJlxuICAgIHZhbHVlICUgMSA9PT0gMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTdHJpbmcgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZSA9IHJlcXVpcmUoICcuL3R5cGUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTeW1ib2wgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGUoIHZhbHVlICkgPT09ICdzeW1ib2wnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzV2luZG93TGlrZSAoIHZhbHVlICkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKCB2YWx1ZSApICYmIHZhbHVlLndpbmRvdyA9PT0gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzV2luZG93ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc1dpbmRvd0xpa2UoIHZhbHVlICkgJiYgdG9TdHJpbmcuY2FsbCggdmFsdWUgKSA9PT0gJ1tvYmplY3QgV2luZG93XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzc2V0ICgga2V5LCBvYmogKSB7XG4gIGlmICggb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0eXBlb2Ygb2JqWyBrZXkgXSAhPT0gJ3VuZGVmaW5lZCcgfHwga2V5IGluIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlVmFsdWVzICAgICAgICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS12YWx1ZXMnICk7XG5cbnZhciBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xudmFyIGtleXMgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpdGVyYWJsZSAoIHZhbHVlICkge1xuICBpZiAoIGlzQXJyYXlMaWtlT2JqZWN0KCB2YWx1ZSApICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gdmFsdWUuc3BsaXQoICcnICk7XG4gIH1cblxuICByZXR1cm4gYmFzZVZhbHVlcyggdmFsdWUsIGtleXMoIHZhbHVlICkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xudmFyIG1hdGNoZXNQcm9wZXJ0eSAgID0gcmVxdWlyZSggJy4vbWF0Y2hlcy1wcm9wZXJ0eScgKTtcbnZhciBwcm9wZXJ0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5JyApO1xuXG5leHBvcnRzLml0ZXJhdGVlID0gZnVuY3Rpb24gaXRlcmF0ZWUgKCB2YWx1ZSApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKCBpc0FycmF5TGlrZU9iamVjdCggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gbWF0Y2hlc1Byb3BlcnR5KCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHByb3BlcnR5KCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEtleXNJbiAoIG9iaiApIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIGtleTtcblxuICBvYmogPSB0b09iamVjdCggb2JqICk7XG5cbiAgZm9yICgga2V5IGluIG9iaiApIHtcbiAgICBrZXlzLnB1c2goIGtleSApO1xuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydCAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQta2V5cycgKTtcblxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xuXG5pZiAoIHN1cHBvcnQgIT09ICdlczIwMTUnICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtleXMgKCB2YWx1ZSApIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoIHRvT2JqZWN0KCB2YWx1ZSApICk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtaW5kZXgtb2YnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4vY2FzdC1wYXRoJyApO1xudmFyIGdldCAgICAgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWdldCcgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWF0Y2hlc1Byb3BlcnR5ICggcHJvcGVydHkgKSB7XG4gIHZhciBwYXRoICA9IGNhc3RQYXRoKCBwcm9wZXJ0eVsgMCBdICk7XG4gIHZhciB2YWx1ZSA9IHByb3BlcnR5WyAxIF07XG5cbiAgaWYgKCAhIHBhdGgubGVuZ3RoICkge1xuICAgIHRocm93IEVycm9yKCBFUlIuTk9fUEFUSCApO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICggb2JqZWN0ICkge1xuICAgIGlmICggb2JqZWN0ID09PSBudWxsIHx8IHR5cGVvZiBvYmplY3QgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggcGF0aC5sZW5ndGggPiAxICkge1xuICAgICAgcmV0dXJuIGdldCggb2JqZWN0LCBwYXRoLCAwICkgPT09IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3RbIHBhdGhbIDAgXSBdID09PSB2YWx1ZTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1pbmRleC1vZicgKTtcblxudmFyIG1hdGNoZXM7XG5cbmlmICggdHlwZW9mIEVsZW1lbnQgPT09ICd1bmRlZmluZWQnIHx8ICEgKCBtYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyB8fCBFbGVtZW50LnByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgKSApIHtcbiAgbWF0Y2hlcyA9IGZ1bmN0aW9uIG1hdGNoZXMgKCBzZWxlY3RvciApIHtcbiAgICBpZiAoIC9eI1tcXHdcXC1dKyQvLnRlc3QoIHNlbGVjdG9yICs9ICcnICkgKSB7XG4gICAgICByZXR1cm4gJyMnICsgdGhpcy5pZCA9PT0gc2VsZWN0b3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VJbmRleE9mKCB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKSwgdGhpcyApID49IDA7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mJyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtaW52b2tlJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eScgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLWludm9rZScgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWVtb2l6ZSAgICAgICA9IHJlcXVpcmUoICcuL2ludGVybmFsL21lbW9pemUnICk7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtcGxhaW4tb2JqZWN0JyApO1xudmFyIHRvT2JqZWN0ICAgICAgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIga2V5cyAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG52YXIgaXNBcnJheSAgICAgICA9IG1lbW9pemUoIHJlcXVpcmUoICcuL2lzLWFycmF5JyApICk7XG5cbi8qKlxuICogQG1ldGhvZCBwZWFrby5taXhpblxuICogQHBhcmFtICB7Ym9vbGVhbn0gICAgW2RlZXA9dHJ1ZV1cbiAqIEBwYXJhbSAge29iamVjdH0gICAgIHRhcmdldFxuICogQHBhcmFtICB7Li4ub2JqZWN0P30gb2JqZWN0XG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWl4aW4gKCBkZWVwLCB0YXJnZXQgKSB7XG4gIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGkgPSAyO1xuICB2YXIgb2JqZWN0O1xuICB2YXIgc291cmNlO1xuICB2YXIgdmFsdWU7XG4gIHZhciBqO1xuICB2YXIgbDtcbiAgdmFyIGs7XG5cbiAgaWYgKCB0eXBlb2YgZGVlcCAhPT0gJ2Jvb2xlYW4nICkge1xuICAgIHRhcmdldCA9IGRlZXA7XG4gICAgZGVlcCA9IHRydWU7XG4gICAgaSA9IDE7XG4gIH1cblxuICB0YXJnZXQgPSB0b09iamVjdCggdGFyZ2V0ICk7XG5cbiAgZm9yICggOyBpIDwgYXJnc0xlbmd0aDsgKytpICkge1xuICAgIG9iamVjdCA9IGFyZ3VtZW50c1sgaSBdO1xuXG4gICAgaWYgKCAhIG9iamVjdCApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAoIGsgPSBrZXlzKCBvYmplY3QgKSwgaiA9IDAsIGwgPSBrLmxlbmd0aDsgaiA8IGw7ICsraiApIHtcbiAgICAgIHZhbHVlID0gb2JqZWN0WyBrWyBqIF0gXTtcblxuICAgICAgaWYgKCBkZWVwICYmIGlzUGxhaW5PYmplY3QoIHZhbHVlICkgfHwgaXNBcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgc291cmNlID0gdGFyZ2V0WyBrWyBqIF0gXTtcblxuICAgICAgICBpZiAoIGlzQXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgICAgaWYgKCAhIGlzQXJyYXkoIHNvdXJjZSApICkge1xuICAgICAgICAgICAgc291cmNlID0gW107XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICggISBpc1BsYWluT2JqZWN0KCBzb3VyY2UgKSApIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldFsga1sgaiBdIF0gPSBtaXhpbiggdHJ1ZSwgc291cmNlLCB2YWx1ZSApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0WyBrWyBqIF0gXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vb3AgKCkge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYnJhY2UtcnVsZXMvYnJhY2Utb24tc2FtZS1saW5lXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiZWZvcmUgPSByZXF1aXJlKCAnLi9iZWZvcmUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZSAoIHRhcmdldCApIHtcbiAgcmV0dXJuIGJlZm9yZSggMSwgdGFyZ2V0ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUNsb25lQXJyYXkgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtY2xvbmUtYXJyYXknICk7XG5cbnZhciBmcmFnbWVudCAgICAgICA9IHJlcXVpcmUoICcuL2ZyYWdtZW50JyApO1xuXG4vKipcbiAqIEBtZXRob2QgXy5wYXJzZUhUTUxcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgc3RyaW5nXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge0FycmF5LjxFbGVtZW50Pn1cbiAqIEBleGFtcGxlXG4gKiB2YXIgZWxlbWVudHMgPSBfLnBhcnNlSFRNTCggJzxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJzdWJtaXRcIiAvPicgKTtcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhUTUwgKCBzdHJpbmcsIGNvbnRleHQgKSB7XG4gIGlmICggL14oPzo8KFtcXHctXSspPjxcXC9bXFx3LV0rPnw8KFtcXHctXSspKD86XFxzKlxcLyk/PikkLy50ZXN0KCBzdHJpbmcgKSApIHtcbiAgICByZXR1cm4gWyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBSZWdFeHAuJDEgfHwgUmVnRXhwLiQyICkgXTtcbiAgfVxuXG4gIHJldHVybiBiYXNlQ2xvbmVBcnJheSggZnJhZ21lbnQoIFsgc3RyaW5nIF0sIGNvbnRleHQgfHwgZG9jdW1lbnQgKS5jaGlsZE5vZGVzICk7XG59O1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBWbGFkaXNsYXYgVGlraGl5IChTSUxFTlQpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdGlraGl5L3BlYWtvXG4gKi9cblxuLyohXG4gKiBCYXNlZCBvbiBqUXVlcnkgICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZVxuICogQmFzZWQgb24gTG9kYXNoICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmFtZXNwYWNlIHBlYWtvXG4gKi9cbnZhciBwZWFrbztcblxuaWYgKCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICkge1xuICBwZWFrbyA9IHJlcXVpcmUoICcuL18nICk7XG4gIHBlYWtvLkRPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi9ET01XcmFwcGVyJyApO1xufSBlbHNlIHtcbiAgcGVha28gPSBmdW5jdGlvbiBwZWFrbyAoKSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBicmFjZS1ydWxlcy9icmFjZS1vbi1zYW1lLWxpbmVcbn1cblxucGVha28uYWpheCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9hamF4JyApO1xucGVha28uYXNzaWduICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9hc3NpZ24nICk7XG5wZWFrby5hc3NpZ25JbiAgICAgICAgICA9IHJlcXVpcmUoICcuL2Fzc2lnbi1pbicgKTtcbnBlYWtvLmNsb25lICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xvbmUnICk7XG5wZWFrby5kZWZhdWx0cyAgICAgICAgICA9IHJlcXVpcmUoICcuL2RlZmF1bHRzJyApO1xucGVha28uZWFjaCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoJyApO1xucGVha28uZWFjaFJpZ2h0ICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoLXJpZ2h0JyApO1xucGVha28uZ2V0UHJvdG90eXBlT2YgICAgPSByZXF1aXJlKCAnLi9nZXQtcHJvdG90eXBlLW9mJyApO1xucGVha28uaW5kZXhPZiAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pbmRleC1vZicgKTtcbnBlYWtvLmlzQXJyYXkgICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtYXJyYXknICk7XG5wZWFrby5pc0FycmF5TGlrZSAgICAgICA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2UnICk7XG5wZWFrby5pc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xucGVha28uaXNET01FbGVtZW50ICAgICAgPSByZXF1aXJlKCAnLi9pcy1kb20tZWxlbWVudCcgKTtcbnBlYWtvLmlzTGVuZ3RoICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xucGVha28uaXNPYmplY3QgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QnICk7XG5wZWFrby5pc09iamVjdExpa2UgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xucGVha28uaXNQbGFpbk9iamVjdCAgICAgPSByZXF1aXJlKCAnLi9pcy1wbGFpbi1vYmplY3QnICk7XG5wZWFrby5pc1ByaW1pdGl2ZSAgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnBlYWtvLmlzU3ltYm9sICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtc3ltYm9sJyApO1xucGVha28uaXNTdHJpbmcgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1zdHJpbmcnICk7XG5wZWFrby5pc1dpbmRvdyAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdycgKTtcbnBlYWtvLmlzV2luZG93TGlrZSAgICAgID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5wZWFrby5pc051bWJlciAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLW51bWJlcicgKTtcbnBlYWtvLmlzTmFOICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbmFuJyApO1xucGVha28uaXNTYWZlSW50ZWdlciAgICAgPSByZXF1aXJlKCAnLi9pcy1zYWZlLWludGVnZXInICk7XG5wZWFrby5pc0Zpbml0ZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLWZpbml0ZScgKTtcbnBlYWtvLmtleXMgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcbnBlYWtvLmtleXNJbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cy1pbicgKTtcbnBlYWtvLmxhc3RJbmRleE9mICAgICAgID0gcmVxdWlyZSggJy4vbGFzdC1pbmRleC1vZicgKTtcbnBlYWtvLm1peGluICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbWl4aW4nICk7XG5wZWFrby5ub29wICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL25vb3AnICk7XG5wZWFrby5wcm9wZXJ0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5JyApO1xucGVha28ucHJvcGVydHlPZiAgICAgICAgPSByZXF1aXJlKCAnLi9wcm9wZXJ0eS1vZicgKTtcbnBlYWtvLm1ldGhvZCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbWV0aG9kJyApO1xucGVha28ubWV0aG9kT2YgICAgICAgICAgPSByZXF1aXJlKCAnLi9tZXRob2Qtb2YnICk7XG5wZWFrby5zZXRQcm90b3R5cGVPZiAgICA9IHJlcXVpcmUoICcuL3NldC1wcm90b3R5cGUtb2YnICk7XG5wZWFrby50b09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnBlYWtvLnR5cGUgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdHlwZScgKTtcbnBlYWtvLmZvckVhY2ggICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLWVhY2gnICk7XG5wZWFrby5mb3JFYWNoUmlnaHQgICAgICA9IHJlcXVpcmUoICcuL2Zvci1lYWNoLXJpZ2h0JyApO1xucGVha28uZm9ySW4gICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9mb3ItaW4nICk7XG5wZWFrby5mb3JJblJpZ2h0ICAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1pbi1yaWdodCcgKTtcbnBlYWtvLmZvck93biAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLW93bicgKTtcbnBlYWtvLmZvck93blJpZ2h0ICAgICAgID0gcmVxdWlyZSggJy4vZm9yLW93bi1yaWdodCcgKTtcbnBlYWtvLmJlZm9yZSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYmVmb3JlJyApO1xucGVha28ub25jZSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9vbmNlJyApO1xucGVha28uZGVmYXVsdFRvICAgICAgICAgPSByZXF1aXJlKCAnLi9kZWZhdWx0LXRvJyApO1xucGVha28udGltZXIgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90aW1lcicgKTtcbnBlYWtvLnRpbWVzdGFtcCAgICAgICAgID0gcmVxdWlyZSggJy4vdGltZXN0YW1wJyApO1xucGVha28uY2xhbXAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jbGFtcCcgKTtcbnBlYWtvLmJpbmQgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYmluZCcgKTtcbnBlYWtvLnRyaW0gICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdHJpbScgKTtcbnBlYWtvLnRyaW1FbmQgICAgICAgICAgID0gcmVxdWlyZSggJy4vdHJpbS1lbmQnICk7XG5wZWFrby50cmltU3RhcnQgICAgICAgICA9IHJlcXVpcmUoICcuL3RyaW0tc3RhcnQnICk7XG5wZWFrby5maW5kICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2ZpbmQnICk7XG5wZWFrby5maW5kSW5kZXggICAgICAgICA9IHJlcXVpcmUoICcuL2ZpbmQtaW5kZXgnICk7XG5wZWFrby5maW5kTGFzdCAgICAgICAgICA9IHJlcXVpcmUoICcuL2ZpbmQtbGFzdCcgKTtcbnBlYWtvLmZpbmRMYXN0SW5kZXggICAgID0gcmVxdWlyZSggJy4vZmluZC1sYXN0LWluZGV4JyApO1xucGVha28uaGFzICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9oYXMnICk7XG5wZWFrby5nZXQgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2dldCcgKTtcbnBlYWtvLnNldCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vc2V0JyApO1xucGVha28uaXRlcmF0ZWUgICAgICAgICAgPSByZXF1aXJlKCAnLi9pdGVyYXRlZScgKTtcbnBlYWtvLmlkZW50aXR5ICAgICAgICAgID0gcmVxdWlyZSggJy4vaWRlbnRpdHknICk7XG5wZWFrby5lc2NhcGUgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VzY2FwZScgKTtcbnBlYWtvLnVuZXNjYXBlICAgICAgICAgID0gcmVxdWlyZSggJy4vdW5lc2NhcGUnICk7XG5wZWFrby5yYW5kb20gICAgICAgICAgICA9IHJlcXVpcmUoICcuL3JhbmRvbScgKTtcbnBlYWtvLmZyb21QYWlycyAgICAgICAgID0gcmVxdWlyZSggJy4vZnJvbS1wYWlycycgKTtcbnBlYWtvLmNvbnN0YW50cyAgICAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApO1xucGVha28udGVtcGxhdGUgICAgICAgICAgPSByZXF1aXJlKCAnLi90ZW1wbGF0ZScgKTtcbnBlYWtvLmludmVydCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaW52ZXJ0JyApO1xucGVha28uY29tcG91bmQgICAgICAgICAgPSByZXF1aXJlKCAnLi9jb21wb3VuZCcgKTtcbnBlYWtvLmRlYm91bmNlICAgICAgICAgID0gcmVxdWlyZSggJy4vZGVib3VuY2UnICk7XG5cbmlmICggdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICkge1xuICBzZWxmLnBlYWtvID0gc2VsZi5fID0gcGVha287IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGVha287XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG1lbWJlciB7b2JqZWN0fSBfLnBsYWNlaG9sZGVyXG4gKi9cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbWV0aG9kIF8ucHJvcGVydHlPZlxuICogQHBhcmFtICB7b2JqZWN0fSAgIG9iamVjdFxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKiBAZXhhbXBsZVxuICogdmFyIG9iamVjdCA9IHtcbiAqICAgeDogNDIsXG4gKiAgIHk6IDBcbiAqIH07XG4gKlxuICogWyAneCcsICd5JyBdLm1hcCggXy5wcm9wZXJ0eU9mKCBvYmplY3QgKSApOyAvLyAtPiBbIDQyLCAwIF1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mJyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtcHJvcGVydHknICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbWV0aG9kIF8ucHJvcGVydHlcbiAqIEBwYXJhbSAge3N0cmluZ30gICBwYXRoXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBleGFtcGxlXG4gKiB2YXIgb2JqZWN0cyA9IFtcbiAqICAgeyBuYW1lOiAnSmFtZXMnIH0sXG4gKiAgIHsgbmFtZTogJ0pvaG4nIH1cbiAqIF07XG4gKlxuICogb2JqZWN0cy5tYXAoIF8ucHJvcGVydHkoICduYW1lJyApICk7IC8vIC0+IFsgJ0phbWVzJywgJ0pvaG4nIF1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5JyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtcHJvcGVydHknICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICdjbGFzcyc6ICdjbGFzc05hbWUnLFxuICAnZm9yJzogICAnaHRtbEZvcidcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlUmFuZG9tID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLXJhbmRvbScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByYW5kb20gKCBsb3dlciwgdXBwZXIsIGZsb2F0aW5nICkge1xuXG4gIC8vIF8ucmFuZG9tKCk7XG5cbiAgaWYgKCB0eXBlb2YgbG93ZXIgPT09ICd1bmRlZmluZWQnICkge1xuICAgIGZsb2F0aW5nID0gZmFsc2U7XG4gICAgdXBwZXIgPSAxO1xuICAgIGxvd2VyID0gMDtcbiAgfSBlbHNlIGlmICggdHlwZW9mIHVwcGVyID09PSAndW5kZWZpbmVkJyApIHtcblxuICAgIC8vIF8ucmFuZG9tKCBmbG9hdGluZyApO1xuXG4gICAgaWYgKCB0eXBlb2YgbG93ZXIgPT09ICdib29sZWFuJyApIHtcbiAgICAgIGZsb2F0aW5nID0gbG93ZXI7XG4gICAgICB1cHBlciA9IDE7XG5cbiAgICAvLyBfLnJhbmRvbSggdXBwZXIgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBmbG9hdGluZyA9IGZhbHNlO1xuICAgICAgdXBwZXIgPSBsb3dlcjtcbiAgICB9XG5cbiAgICBsb3dlciA9IDA7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBmbG9hdGluZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cbiAgICAvLyBfLnJhbmRvbSggdXBwZXIsIGZsb2F0aW5nICk7XG5cbiAgICBpZiAoIHR5cGVvZiB1cHBlciA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgZmxvYXRpbmcgPSB1cHBlcjtcbiAgICAgIHVwcGVyID0gbG93ZXI7XG4gICAgICBsb3dlciA9IDA7XG5cbiAgICAvLyBfLnJhbmRvbSggbG93ZXIsIHVwcGVyICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgZmxvYXRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGZsb2F0aW5nIHx8IGxvd2VyICUgMSB8fCB1cHBlciAlIDEgKSB7XG4gICAgcmV0dXJuIGJhc2VSYW5kb20oIGxvd2VyLCB1cHBlciApO1xuICB9XG5cbiAgcmV0dXJuIE1hdGgucm91bmQoIGJhc2VSYW5kb20oIGxvd2VyLCB1cHBlciApICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNQcmltaXRpdmUgPSByZXF1aXJlKCAnLi9pcy1wcmltaXRpdmUnICk7XG52YXIgRVJSICAgICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZiAoIHRhcmdldCwgcHJvdG90eXBlICkge1xuICBpZiAoIHRhcmdldCA9PT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICB9XG5cbiAgaWYgKCBwcm90b3R5cGUgIT09IG51bGwgJiYgaXNQcmltaXRpdmUoIHByb3RvdHlwZSApICkge1xuICAgIHRocm93IFR5cGVFcnJvciggJ09iamVjdCBwcm90b3R5cGUgbWF5IG9ubHkgYmUgYW4gT2JqZWN0IG9yIG51bGw6ICcgKyBwcm90b3R5cGUgKTtcbiAgfVxuXG4gIGlmICggJ19fcHJvdG9fXycgaW4gdGFyZ2V0ICkge1xuICAgIHRhcmdldC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4vY2FzdC1wYXRoJyApO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGJhc2VTZXQgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLXNldCcgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0ICggb2JqLCBwYXRoLCB2YWwgKSB7XG4gIHZhciBsID0gKCBwYXRoID0gY2FzdFBhdGgoIHBhdGggKSApLmxlbmd0aDtcblxuICBpZiAoICEgbCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIGlmICggbCA+IDEgKSB7XG4gICAgcmV0dXJuIGJhc2VTZXQoIHRvT2JqZWN0KCBvYmogKSwgcGF0aCwgdmFsICk7XG4gIH1cblxuICByZXR1cm4gKCB0b09iamVjdCggb2JqIClbIHBhdGhbIDAgXSBdID0gdmFsICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuXG50cnkge1xuICBpZiAoIHNwYW4uc2V0QXR0cmlidXRlKCAneCcsICd5JyApLCBzcGFuLmdldEF0dHJpYnV0ZSggJ3gnICkgPT09ICd5JyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZXF1ZW5jZXNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbnVsbDtcbiAgfVxufSBjYXRjaCAoIGVycm9yICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xufVxuXG5zcGFuID0gbnVsbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudHJ5IHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyggJycgKSwgJ2VzMjAxNSc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zLCBuby1zZXF1ZW5jZXNcbn0gY2F0Y2ggKCBlcnJvciApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSAnZXM1Jztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVzY2FwZSAgPSByZXF1aXJlKCAnLi9lc2NhcGUnICk7XG5cbnZhciByZWdleHBzID0ge1xuICBzYWZlOiAnPFxcXFwlPVxcXFxzKihbXl0qPylcXFxccypcXFxcJT4nLFxuICBodG1sOiAnPFxcXFwlLVxcXFxzKihbXl0qPylcXFxccypcXFxcJT4nLFxuICBjb21tOiBcIicnJyhbXl0qPyknJydcIixcbiAgY29kZTogJzxcXFxcJVxcXFxzKihbXl0qPylcXFxccypcXFxcJT4nXG59O1xuXG5mdW5jdGlvbiByZXBsYWNlciAoIG1hdGNoLCBzYWZlLCBodG1sLCBjb21tLCBjb2RlICkge1xuICBpZiAoIHR5cGVvZiBzYWZlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gXCInK19lKFwiICsgc2FmZS5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiKSsnXCI7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBodG1sICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gXCInKyhcIiArIGh0bWwucmVwbGFjZSggL1xcXFxuL2csICdcXG4nICkgKyBcIikrJ1wiO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgY29kZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIFwiJztcIiArIGNvZGUucmVwbGFjZSggL1xcXFxuL2csICdcXG4nICkgKyBcIjtfcis9J1wiO1xuICB9XG5cbiAgLy8gY29tbWVudCBpcyBtYXRjaGVkIC0gZG8gbm90aGluZ1xuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogQG1ldGhvZCBwZWFrby50ZW1wbGF0ZVxuICogQHBhcmFtICB7c3RyaW5nfSBzb3VyY2UgICAgICAgICAgICBUaGUgdGVtcGxhdGUgc291cmNlLlxuICogQHBhcmFtICB7b2JqZWN0fSBbb3B0aW9uc10gICAgICAgICBBbiBvcHRpb25zLlxuICogQHBhcmFtICB7b2JqZWN0fSBbb3B0aW9ucy5yZWdleHBzXSBDdXN0b20gcGF0dGVybnMuXG4gKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgIEFuIG9iamVjdCB3aXRoIGByZW5kZXJgIG1ldGhvZC5cbiAqIEBleGFtcGxlXG4gKiB2YXIgdGVtcGxhdGUgPSBwZWFrby50ZW1wbGF0ZShgXG4gKiAgICcnJyBBIGh0bWwtc2FmZSBvdXRwdXQuICcnJ1xuICogICA8dGl0bGU+PCU9IGRhdGEudXNlcm5hbWUgJT48L3RpdGxlPlxuICogICAnJycgQSBibG9jayBvZiBjb2RlLiAnJydcbiAqICAgPCUgZm9yICggdmFyIGkgPSAwOyBpIDwgNTsgaSArPSAxICkge1xuICogICAgIC8vIFRoZSBcInByaW50XCIgZnVuY3Rpb24uXG4gKiAgICAgcHJpbnQoIGkgKTtcbiAqICAgfSAlPlxuICogYCk7XG4gKiB2YXIgaHRtbCA9IHRlbXBsYXRlLnJlbmRlciggeyB1c2VybmFtZTogJ0pvaG4nIH0gKTtcbiAqIC8vIC0+ICdcXG4gIFxcbiAgPHRpdGxlPkpvaG48L3RpdGxlPlxcbiAgXFxuICAwMTIzNFxcbidcbiAqL1xuZnVuY3Rpb24gdGVtcGxhdGUgKCBzb3VyY2UsIG9wdGlvbnMgKSB7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgdmFyIHJlZ2V4cDtcbiAgdmFyIHJlbmRlcl87XG5cbiAgaWYgKCAhIG9wdGlvbnMgKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0ICgga2V5ICkge1xuICAgIHJldHVybiBvcHRpb25zLnJlZ2V4cHMgJiYgb3B0aW9ucy5yZWdleHBzWyBrZXkgXSB8fCByZWdleHBzWyBrZXkgXTtcbiAgfVxuXG4gIHJlZ2V4cCA9IFJlZ0V4cChcbiAgICBnZXQoICdzYWZlJyApICsgJ3wnICtcbiAgICBnZXQoICdodG1sJyApICsgJ3wnICtcbiAgICBnZXQoICdjb21tJyApICsgJ3wnICtcbiAgICBnZXQoICdjb2RlJyApLCAnZycgKTtcblxuICBpZiAoIG9wdGlvbnMud2l0aCApIHtcbiAgICByZXN1bHQgKz0gJ3dpdGgoZGF0YXx8e30peyc7XG4gIH1cblxuICBpZiAoIG9wdGlvbnMucHJpbnQgIT09IG51bGwgKSB7XG4gICAgcmVzdWx0ICs9ICdmdW5jdGlvbiAnICsgKCBvcHRpb25zLnByaW50IHx8ICdwcmludCcgKSArIFwiKCl7X3IrPUFycmF5LnByb3RvdHlwZS5qb2luLmNhbGwoYXJndW1lbnRzLCcnKTt9XCI7XG4gIH1cblxuICByZXN1bHQgKz0gXCJ2YXIgX3I9J1wiO1xuXG4gIHJlc3VsdCArPSBzb3VyY2VcbiAgICAucmVwbGFjZSggL1xcbi9nLCAnXFxcXG4nIClcbiAgICAucmVwbGFjZSggcmVnZXhwLCByZXBsYWNlciApO1xuXG4gIHJlc3VsdCArPSBcIic7XCI7XG5cbiAgaWYgKCBvcHRpb25zLndpdGggKSB7XG4gICAgcmVzdWx0ICs9ICd9JztcbiAgfVxuXG4gIHJlc3VsdCArPSAncmV0dXJuIF9yOyc7XG5cbiAgcmVuZGVyXyA9IEZ1bmN0aW9uKCAnZGF0YScsICdfZScsIHJlc3VsdCApO1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKCBkYXRhICkge1xuICAgICAgcmV0dXJuIHJlbmRlcl8uY2FsbCggdGhpcywgZGF0YSwgZXNjYXBlICk7XG4gICAgfSxcblxuICAgIHJlc3VsdDogcmVzdWx0LFxuICAgIHNvdXJjZTogc291cmNlXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG4iLCIvKipcbiAqIEJhc2VkIG9uIEVyaWsgTcO2bGxlciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGw6XG4gKlxuICogQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxIHdoaWNoIGRlcml2ZWQgZnJvbVxuICogaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiAqIGh0dHA6Ly9teS5vcGVyYS5jb20vZW1vbGxlci9ibG9nLzIwMTEvMTIvMjAvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1lci1hbmltYXRpbmdcbiAqXG4gKiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyLlxuICogRml4ZXMgZnJvbSBQYXVsIElyaXNoLCBUaW5vIFppamRlbCwgQW5kcmV3IE1hbywgS2xlbWVuIFNsYXZpxI0sIERhcml1cyBCYWNvbi5cbiAqXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHRpbWVzdGFtcCA9IHJlcXVpcmUoICcuL3RpbWVzdGFtcCcgKTtcblxudmFyIHJlcXVlc3RBRjtcbnZhciBjYW5jZWxBRjtcblxuaWYgKCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gIGNhbmNlbEFGID0gc2VsZi5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgcmVxdWVzdEFGID0gc2VsZi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xufVxuXG52YXIgbm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAhIHJlcXVlc3RBRiB8fCAhIGNhbmNlbEFGIHx8XG4gIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIC9pUChhZHxob25lfG9kKS4qT1NcXHM2Ly50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICk7XG5cbmlmICggbm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKSB7XG4gIHZhciBsYXN0UmVxdWVzdFRpbWUgPSAwO1xuICB2YXIgZnJhbWVEdXJhdGlvbiAgID0gMTAwMCAvIDYwO1xuXG4gIGV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QgKCBhbmltYXRlICkge1xuICAgIHZhciBub3cgICAgICAgICAgICAgPSB0aW1lc3RhbXAoKTtcbiAgICB2YXIgbmV4dFJlcXVlc3RUaW1lID0gTWF0aC5tYXgoIGxhc3RSZXF1ZXN0VGltZSArIGZyYW1lRHVyYXRpb24sIG5vdyApO1xuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxhc3RSZXF1ZXN0VGltZSA9IG5leHRSZXF1ZXN0VGltZTtcbiAgICAgIGFuaW1hdGUoIG5vdyApO1xuICAgIH0sIG5leHRSZXF1ZXN0VGltZSAtIG5vdyApO1xuICB9O1xuXG4gIGV4cG9ydHMuY2FuY2VsID0gY2xlYXJUaW1lb3V0O1xufSBlbHNlIHtcbiAgZXhwb3J0cy5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdCAoIGFuaW1hdGUgKSB7XG4gICAgcmV0dXJuIHJlcXVlc3RBRiggYW5pbWF0ZSApO1xuICB9O1xuXG4gIGV4cG9ydHMuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsICggaWQgKSB7XG4gICAgcmV0dXJuIGNhbmNlbEFGKCBpZCApO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmF2aWdhdG9yU3RhcnQ7XG5cbmlmICggdHlwZW9mIHBlcmZvcm1hbmNlID09PSAndW5kZWZpbmVkJyB8fCAhIHBlcmZvcm1hbmNlLm5vdyApIHtcbiAgbmF2aWdhdG9yU3RhcnQgPSBEYXRlLm5vdygpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGltZXN0YW1wICgpIHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG5hdmlnYXRvclN0YXJ0O1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0aW1lc3RhbXAgKCkge1xuICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF91bmVzY2FwZSA9IHJlcXVpcmUoICcuL2ludGVybmFsL3VuZXNjYXBlJyApO1xuXG52YXIgaXNTeW1ib2wgID0gcmVxdWlyZSggJy4vaXMtc3ltYm9sJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gX3VuZXNjYXBlKCB2YWx1ZSApO1xuICB9XG5cbiAgaWYgKCBpc1N5bWJvbCggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICB2YXIga2V5ID0gJycgKyB2YWx1ZTtcblxuICBpZiAoIGtleSA9PT0gJzAnICYmIDEgLyB2YWx1ZSA9PT0gLUluZmluaXR5ICkge1xuICAgIHJldHVybiAnLTAnO1xuICB9XG5cbiAgcmV0dXJuIF91bmVzY2FwZSgga2V5ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b09iamVjdCAoIHZhbHVlICkge1xuICBpZiAoIHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QoIHZhbHVlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbUVuZCApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmltRW5kICggc3RyaW5nICkge1xuICAgIHJldHVybiAoICcnICsgc3RyaW5nICkudHJpbUVuZCgpO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXRyaW0nICkoIC9bXFxzXFx1RkVGRlxceEEwXSskLyApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbVN0YXJ0ICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW1TdGFydCAoIHN0cmluZyApIHtcbiAgICByZXR1cm4gKCAnJyArIHN0cmluZyApLnRyaW1TdGFydCgpO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXRyaW0nICkoIC9eW1xcc1xcdUZFRkZcXHhBMF0rLyApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbSApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmltICggc3RyaW5nICkge1xuICAgIHJldHVybiAoICcnICsgc3RyaW5nICkudHJpbSgpO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXRyaW0nICkoIC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWNoZSA9IE9iamVjdC5jcmVhdGUoIG51bGwgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0eXBlICggdmFsdWUgKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbiAgfVxuXG4gIGlmICggdmFsdWUgPT09IG51bGwgKSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuXG4gIHZhciBzdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHZhbHVlICk7XG5cbiAgaWYgKCAhIGNhY2hlWyBzdHJpbmcgXSApIHtcbiAgICBjYWNoZVsgc3RyaW5nIF0gPSBzdHJpbmcuc2xpY2UoIDgsIC0xICkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHJldHVybiBjYWNoZVsgc3RyaW5nIF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZXNjYXBlJyApKCAvJig/Omx0fGd0fCMzNHwjMzl8YW1wKTsvZywge1xuICAnJmx0Oyc6ICAnPCcsXG4gICcmZ3Q7JzogICc+JyxcbiAgJyYjMzQ7JzogJ1wiJyxcbiAgJyYjMzk7JzogXCInXCIsXG4gICcmYW1wOyc6ICcmJ1xufSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmlyc3QnICkoICd0b1VwcGVyQ2FzZScgKTtcbiJdfQ==
