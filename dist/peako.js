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
var event                = require( '../event' );

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
        event.off( element );
      } else {
        for ( j = 0; j < l; ++j ) {
          event[ name ]( element, types[ j ], selector, listener, useCapture, once );
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

},{"../access":21,"../base/base-for-each":31,"../base/base-for-in":32,"../create/create-remove-prop":66,"../event":76,"../get-element-h":89,"../get-element-w":90,"../internal/first":98,"../internal/text-content":102,"../internal/words":105,"../is-array-like-object":107,"../is-dom-element":110,"../parse-html":139,"../props":144,"../support/support-get-attribute":149,"./prototype/css":2,"./prototype/each":3,"./prototype/end":4,"./prototype/eq":5,"./prototype/find":6,"./prototype/first":7,"./prototype/get":8,"./prototype/last":9,"./prototype/map":10,"./prototype/parent":11,"./prototype/ready":12,"./prototype/remove":13,"./prototype/removeAttr":14,"./prototype/removeProp":15,"./prototype/stack":16,"./prototype/style":17,"./prototype/styles":18}],2:[function(require,module,exports){
'use strict';

var isArray = require( '../../is-array' );

module.exports = function css ( k, v ) {
  if ( isArray( k ) ) {
    return this.styles( k );
  }

  return this.style( k, v );
};

},{"../../is-array":109}],3:[function(require,module,exports){
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

},{"../../base/base-index-of":35,"../../matches-selector":132}],12:[function(require,module,exports){
'use strict';

var event = require( '../../event' );

module.exports = function ready ( cb ) {
  var doc = this[ 0 ];
  var readyState;

  if ( ! doc || doc.nodeType !== 9 ) {
    return this;
  }

  readyState = doc.readyState;

  if ( doc.attachEvent ? readyState !== 'complete' : readyState === 'loading' ) { // eslint-disable-line no-ternary
    event.on( doc, 'DOMContentLoaded', null, function () {
      cb();
    }, false, true );
  } else {
    cb();
  }

  return this;
};

},{"../../event":76}],13:[function(require,module,exports){
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

},{"../../base/base-remove-attr":40,"../../create/create-remove-prop":66}],15:[function(require,module,exports){
'use strict';

module.exports = require( '../../create/create-remove-prop' )( function _removeProp ( element, key ) {
  delete element[ key ];
} );

},{"../../create/create-remove-prop":66}],16:[function(require,module,exports){
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

},{"..":1,"../../base/base-copy-array":28,"../../internal/first":98}],17:[function(require,module,exports){
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

},{"../../access":21,"../../camelize":46,"../../internal/css-numbers":97,"../../internal/get-style":99,"../../is-object-like":116}],18:[function(require,module,exports){
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

},{"../../camelize":46}],19:[function(require,module,exports){
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

},{"./base/base-assign":26,"./isset":125,"./keys":129}],20:[function(require,module,exports){
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
  var chainable = _noCheck || typeof val === 'undefined';
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

},{"./DOMWrapper":1,"./keys":129,"./type":159}],22:[function(require,module,exports){
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
 *   sex:      document.forms.signup.elements.sex.value
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

},{"./ajax-options":22,"./defaults":70,"qs":"qs"}],24:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-assign' )( require( './keys-in' ) );

},{"./create/create-assign":55,"./keys-in":128}],25:[function(require,module,exports){
'use strict';

module.exports = Object.assign || require( './create/create-assign' )( require( './keys' ) );

},{"./create/create-assign":55,"./keys":129}],26:[function(require,module,exports){
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

},{"../isset":125}],28:[function(require,module,exports){
'use strict';

module.exports = function ( target, source ) {
  for ( var i = source.length - 1; i >= 0; --i ) {
    target[ i ] = source[ i ];
  }
};

},{}],29:[function(require,module,exports){
'use strict';

var isset = require( '../isset' );

var defineGetter = Object.prototype.__defineGetter__;
var defineSetter = Object.prototype.__defineSetter__;

function baseDefineProperty ( object, key, descriptor ) {
  var hasGetter = isset( 'get', descriptor );
  var hasSetter = isset( 'set', descriptor );
  var get;
  var set;

  if ( hasGetter || hasSetter ) {
    if ( hasGetter && typeof( get = descriptor.get ) !== 'function' ) {
      throw TypeError( 'Getter must be a function: ' + get );
    }

    if ( hasSetter && typeof( set = descriptor.set ) !== 'function' ) {
      throw TypeError( 'Setter must be a function: ' + set );
    }

    if ( isset( 'writable', descriptor ) ) {
      throw TypeError( 'Invalid property descriptor. Cannot both specify accessors and a value or writable attribute' );
    }

    if ( defineGetter ) {
      if ( hasGetter ) {
        defineGetter.call( object, key, get );
      }

      if ( hasSetter ) {
        defineSetter.call( object, key, set );
      }
    } else {
      throw Error( 'Cannot define a getter or setter' );
    }
  } else if ( isset( 'value', descriptor ) ) {
    object[ key ] = descriptor.value;
  } else if ( ! isset( key, object ) ) {
    object[ key ] = void 0;
  }

  return object;
}

module.exports = baseDefineProperty;

},{"../isset":125}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
'use strict';

var callIteratee = require( '../call-iteratee' );
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

},{"../call-iteratee":45,"../isset":125}],32:[function(require,module,exports){
'use strict';

var callIteratee = require( '../call-iteratee' );

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

},{"../call-iteratee":45}],33:[function(require,module,exports){
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

},{"../isset":125}],34:[function(require,module,exports){
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

},{"../isset":125}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{"./base-get":33}],37:[function(require,module,exports){
'use strict';

var support     = require( '../support/support-keys' );

var baseIndexOf = require( './base-index-of' );

var hasOwnProperty = Object.prototype.hasOwnProperty;

if ( support === 'has-a-bug' ) {
  var _keys = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'
  ];
}

module.exports = function baseKeys ( object ) {
  var keys = [];
  var key;
  var i;

  for ( key in object ) {
    if ( hasOwnProperty.call( object, key ) ) {
      keys.push( key );
    }
  }

  if ( support === 'has-a-bug' ) {
    for ( i = _keys.length - 1; i >= 0; --i ) {
      if ( baseIndexOf( keys, _keys[ i ] ) < 0 && hasOwnProperty.call( object, _keys[ i ] ) ) {
        keys.push( _keys[ i ] );
      }
    }
  }

  return keys;
};

},{"../support/support-keys":150,"./base-index-of":35}],38:[function(require,module,exports){
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

},{"./base-get":33}],39:[function(require,module,exports){
'use strict';

module.exports = function baseRandom ( lower, upper ) {
  return lower + Math.random() * ( upper - lower );
};

},{}],40:[function(require,module,exports){
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

},{"../props":144,"../support/support-get-attribute":149}],41:[function(require,module,exports){
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

},{"../isset":125}],42:[function(require,module,exports){
'use strict';

module.exports = function baseValues ( object, keys ) {
  var i = keys.length;
  var values = Array( i );

  while ( --i >= 0 ) {
    values[ i ] = object[ keys[ i ] ];
  }

  return values;
};

},{}],43:[function(require,module,exports){
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

},{"./default-to":69,"./internal/ArgumentException":96}],44:[function(require,module,exports){
'use strict';

var _processArgs = require( './internal/process-args' );

var _            = require( './placeholder' );
// constants.PLACEHOLDER is for backward-compability.
var constants    = require( './constants' );

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
    if ( args[ i ] === _ || args[ i ] === constants.PLACEHOLDER ) {
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

},{"./constants":53,"./internal/process-args":101,"./placeholder":141}],45:[function(require,module,exports){
'use strict';

module.exports = function callIteratee ( fn, ctx, val, key, obj ) {
  if ( typeof ctx === 'undefined' ) {
    return fn( val, key, obj );
  }

  return fn.call( ctx, val, key, obj );
};

},{}],46:[function(require,module,exports){
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

},{"./upper-first":161}],47:[function(require,module,exports){
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

},{"./base/base-exec":30,"./internal/type":103,"./internal/unescape":104,"./is-key":112,"./to-key":154}],48:[function(require,module,exports){
'use strict';

module.exports = function clamp ( value, lower, upper ) {
  if ( value >= upper ) {
    return upper;
  }

  if ( value <= lower ) {
    return lower;
  }

  return value;
};

},{}],49:[function(require,module,exports){
'use strict';

var getPrototypeOf = require( './get-prototype-of' );
var isObjectLike   = require( './is-object-like' );
var toObject       = require( './to-object' );
var create         = require( './create' );
var each           = require( './each' );

module.exports = function clone ( deep, target, guard ) {
  var cln;

  if ( typeof target === 'undefined' || guard ) {
    target = deep;
    deep = true;
  }

  cln = create( getPrototypeOf( target = toObject( target ) ) );

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

},{"./create":54,"./each":74,"./get-prototype-of":91,"./is-object-like":116,"./to-object":155}],50:[function(require,module,exports){
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

},{"./closest":51}],51:[function(require,module,exports){
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

},{"./matches-selector":132}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
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
  DEEP_KEEP_FN: 2,

  PLACEHOLDER: {}
};

},{}],54:[function(require,module,exports){
'use strict';

module.exports = Object.create || create;

var defineProperties = require( './define-properties' );
var setPrototypeOf   = require( './set-prototype-of' );
var isPrimitive      = require( './is-primitive' );

function C () {}

function create ( prototype, descriptors ) {
  var object;

  if ( prototype !== null && isPrimitive( prototype ) ) {
    throw TypeError( 'Object prototype may only be an Object or null: ' + prototype );
  }

  C.prototype = prototype;

  object = new C();

  C.prototype = null;

  if ( prototype === null ) {
    setPrototypeOf( object, null );
  }

  if ( arguments.length >= 2 ) {
    defineProperties( object, descriptors );
  }

  return object;
};

},{"./define-properties":71,"./is-primitive":119,"./set-prototype-of":146}],55:[function(require,module,exports){
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

},{"../base/base-assign":26,"../constants":53}],56:[function(require,module,exports){
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

},{"../base/base-for-each":31,"../base/base-for-in":32,"../is-array-like":108,"../iteratee":127,"../keys":129,"../to-object":155}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
'use strict';

var callIteratee = require( '../call-iteratee' );
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

},{"../call-iteratee":45,"../isset":125,"../iterable":126,"../iteratee":127,"../to-object":155}],59:[function(require,module,exports){
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

},{"../constants":53}],60:[function(require,module,exports){
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

},{"../base/base-for-each":31,"../iterable":126,"../iteratee":127,"../to-object":155}],61:[function(require,module,exports){
'use strict';

var baseForIn = require( '../base/base-for-in' );
var toObject  = require( '../to-object' );
var iteratee  = require( '../iteratee' ).iteratee;

module.exports = function createForIn ( keys, fromRight ) {
  return function forIn ( obj, fn, ctx ) {
    return baseForIn( obj = toObject( obj ), iteratee( fn ), ctx, fromRight, keys( obj ) );
  };
};

},{"../base/base-for-in":32,"../iteratee":127,"../to-object":155}],62:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
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

},{"../base/base-index-of":35,"../to-object":155}],64:[function(require,module,exports){
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

},{"../cast-path":47}],65:[function(require,module,exports){
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

},{"../cast-path":47,"../noop":136}],66:[function(require,module,exports){
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

},{"../internal/words":105}],67:[function(require,module,exports){
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

},{"../constants":53}],68:[function(require,module,exports){
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

},{"./internal/ArgumentException":96}],69:[function(require,module,exports){
'use strict';

module.exports = function defaultTo ( value, defaultValue ) {
  if ( value !== null && typeof value !== 'undefined' && value === value ) {
    return value;
  }

  return defaultValue;
};

},{}],70:[function(require,module,exports){
'use strict';

var mixin = require( './mixin' );

function defaults ( defaults, object ) {
  if ( object ) {
    return mixin( {}, defaults, object );
  }

  return mixin( {}, defaults );
}

module.exports = defaults;

},{"./mixin":135}],71:[function(require,module,exports){
'use strict';

var support            = require( './support/support-define-property' );

var baseDefineProperty = require( './base/base-define-property' );

var isPrimitive        = require( './is-primitive' );
var each               = require( './each' );

var defineProperties;

if ( support !== 'full' ) {
  defineProperties = function defineProperties ( object, descriptors ) {
    if ( support !== 'not-supported' ) {
      try {
        return Object.defineProperties( object, descriptors );
      } catch ( e ) {}
    }

    if ( isPrimitive( object ) ) {
      throw TypeError( 'defineProperties called on non-object' );
    }

    if ( isPrimitive( descriptors ) ) {
      throw TypeError( 'Property description must be an object: ' + descriptors );
    }

    each( descriptors, function ( descriptor, key ) {
      if ( isPrimitive( descriptor ) ) {
        throw TypeError( 'Property description must be an object: ' + descriptor );
      }

      baseDefineProperty( this, key, descriptor );
    }, object );

    return object;
  };
} else {
  defineProperties = Object.defineProperties;
}

module.exports = defineProperties;

},{"./base/base-define-property":29,"./each":74,"./is-primitive":119,"./support/support-define-property":148}],72:[function(require,module,exports){
'use strict';

var support            = require( './support/support-define-property' );

var baseDefineProperty = require( './base/base-define-property' );

var isPrimitive        = require( './is-primitive' );

var defineProperty;

if ( support !== 'full' ) {
  defineProperty = function defineProperty ( object, key, descriptor ) {
    if ( support !== 'not-supported' ) {
      try {
        return Object.defineProperty( object, key, descriptor );
      } catch ( e ) {}
    }

    if ( isPrimitive( object ) ) {
      throw TypeError( 'defineProperty called on non-object' );
    }

    if ( isPrimitive( descriptor ) ) {
      throw TypeError( 'Property description must be an object: ' + descriptor );
    }

    return baseDefineProperty( object, key, descriptor );
  };
} else {
  defineProperty = Object.defineProperty;
}

module.exports = defineProperty;

},{"./base/base-define-property":29,"./is-primitive":119,"./support/support-define-property":148}],73:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-each' )( true );

},{"./create/create-each":56}],74:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-each' )();

},{"./create/create-each":56}],75:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-escape' )( /[<>"'&]/g, {
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&#34;',
  '&': '&amp;'
} );

},{"./create/create-escape":57}],76:[function(require,module,exports){
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
 * @method peako.event.on
 * @param  {Node}     element
 * @param  {string}   type
 * @param  {string?}  selector
 * @param  {function} listener
 * @param  {boolean}  useCapture
 * @param  {boolean}  [once]
 * @return {void}
 * @example
 * _.event.on( document, 'click', '.post__like-button', ( event ) => {
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
 * @method peako.event.off
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
      event.off( element, events.types[ i ], selector );
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
          event.on( target, type, null, item.listener, item.useCapture, item.once );
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
    event.copy( target[ i ], source[ i ], true );
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

},{"./DOMWrapper":1,"./Event":19,"./closest-node":50}],77:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( true );

},{"./create/create-find":58}],78:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( true, true );

},{"./create/create-find":58}],79:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( false, true );

},{"./create/create-find":58}],80:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )();

},{"./create/create-find":58}],81:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-each' )( true );

},{"./create/create-for-each":60}],82:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-each' )();

},{"./create/create-for-each":60}],83:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys-in' ), true );

},{"./create/create-for-in":61,"./keys-in":128}],84:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys-in' ) );

},{"./create/create-for-in":61,"./keys-in":128}],85:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys' ), true );

},{"./create/create-for-in":61,"./keys":129}],86:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys' ) );

},{"./create/create-for-in":61,"./keys":129}],87:[function(require,module,exports){
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

},{"./is-object-like":116}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-get-element-dimension' )( 'Height' );

},{"./create/create-get-element-dimension":62}],90:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-get-element-dimension' )( 'Width' );

},{"./create/create-get-element-dimension":62}],91:[function(require,module,exports){
'use strict';

var ERR = require( './constants' ).ERR;

module.exports = Object.getPrototypeOf || function getPrototypeOf ( obj ) {
  var prototype;

  if ( obj === null || typeof obj === 'undefined' ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  prototype = obj.__proto__; // jshint ignore: line

  if ( typeof prototype !== 'undefined' ) {
    return prototype;
  }

  if ( Object.prototype.toString.call( obj.constructor ) === '[object Function]' ) {
    return obj.constructor.prototype;
  }

  return obj;
};

},{"./constants":53}],92:[function(require,module,exports){
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

},{"./base/base-get":33,"./cast-path":47,"./constants":53,"./to-object":155}],93:[function(require,module,exports){
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

},{"./base/base-has":34,"./cast-path":47,"./constants":53,"./isset":125,"./to-object":155}],94:[function(require,module,exports){
'use strict';

module.exports = function identity ( v ) {
  return v;
};

},{}],95:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-index-of' )();

},{"./create/create-index-of":63}],96:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString;

module.exports = function _ArgumentException ( unexpected, expected ) {
  return Error( '"' + toString.call( unexpected ) + '" is not ' + expected );
};

},{}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
'use strict';

module.exports = function _first ( wrapper, element ) {
  wrapper[ 0 ] = element;
  wrapper.length = 1;
};

},{}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
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

},{}],101:[function(require,module,exports){
'use strict';

var _         = require( '../placeholder' );
// constants.PLACEHOLDER is for backward-compability.
var constants = require( '../constants' );

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
    if ( partialArgs[ i ] === _ || partialArgs[ i ] === constants.PLACEHOLDER ) {
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

},{"../constants":53,"../placeholder":141}],102:[function(require,module,exports){
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

},{"../escape":75}],103:[function(require,module,exports){
'use strict';

module.exports = require( './memoize' )( require( '../type' ) );

},{"../type":159,"./memoize":100}],104:[function(require,module,exports){
'use strict';

module.exports = function _unescape ( string ) {
  return string.replace( /\\(\\)?/g, '$1' );
};

},{}],105:[function(require,module,exports){
'use strict';

var _ArgumentException = require( './ArgumentException' );

module.exports = function words ( string ) {
  if ( typeof string !== 'string' ) {
    throw _ArgumentException( string, 'a string' );
  }

  return string.match( /[^\s\uFEFF\xA0]+/g ) || [];
};

},{"./ArgumentException":96}],106:[function(require,module,exports){
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

},{"./keys":129,"./to-object":155}],107:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );
var isLength     = require( './is-length' );
var isWindowLike = require( './is-window-like' );

module.exports = function isArrayLikeObject ( value ) {
  return isObjectLike( value ) && isLength( value.length ) && ! isWindowLike( value );
};

},{"./is-length":113,"./is-object-like":116,"./is-window-like":123}],108:[function(require,module,exports){
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

},{"./is-length":113,"./is-window-like":123}],109:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );
var isLength     = require( './is-length' );

module.exports = Array.isArray || function isArray ( value ) {
  return isObjectLike( value ) &&
    isLength( value.length ) &&
    Object.prototype.toString.call( value ) === '[object Array]';
};

},{"./is-length":113,"./is-object-like":116}],110:[function(require,module,exports){
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

},{"./is-object-like":116,"./is-window-like":123}],111:[function(require,module,exports){
'use strict';

var isNumber = require( './is-number' );

module.exports = function isFinite ( value ) {
  return isNumber( value ) && isFinite( value );
};

},{"./is-number":115}],112:[function(require,module,exports){
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

},{"./internal/type":103}],113:[function(require,module,exports){
'use strict';

var MAX_ARRAY_LENGTH = require( './constants' ).MAX_ARRAY_LENGTH;

module.exports = function isLength ( value ) {
  return typeof value === 'number' &&
    value >= 0 &&
    value <= MAX_ARRAY_LENGTH &&
    value % 1 === 0;
};

},{"./constants":53}],114:[function(require,module,exports){
'use strict';

module.exports = function isNaN ( value ) {
  return value !== value;
};

},{}],115:[function(require,module,exports){
'use strict';

module.exports = function isNumber ( value ) {
  return typeof value === 'number';
};

},{}],116:[function(require,module,exports){
'use strict';

module.exports = function isObjectLike ( value ) {
  return typeof value === 'object' && value !== null;
};

},{}],117:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

var toString = {}.toString;

module.exports = function isObject ( value ) {
  return isObjectLike( value ) && toString.call( value ) === '[object Object]';
};

},{"./is-object-like":116}],118:[function(require,module,exports){
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

},{"./get-prototype-of":91,"./is-object":117}],119:[function(require,module,exports){
'use strict';

module.exports = function isPrimitive ( value ) {
  return ! value || typeof value !== 'object' && typeof value !== 'function';
};

},{}],120:[function(require,module,exports){
'use strict';

var isFinite  = require( './is-finite' );
var constants = require( './constants' );

module.exports = function isSafeInteger ( value ) {
  return isFinite( value ) &&
    value <= constants.MAX_SAFE_INT &&
    value >= constants.MIN_SAFE_INT &&
    value % 1 === 0;
};

},{"./constants":53,"./is-finite":111}],121:[function(require,module,exports){
'use strict';

module.exports = function isString ( value ) {
  return typeof value === 'string';
};

},{}],122:[function(require,module,exports){
'use strict';

var type = require( './type' );

module.exports = function isSymbol ( value ) {
  return type( value ) === 'symbol';
};

},{"./type":159}],123:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

module.exports = function isWindowLike ( value ) {
  return isObjectLike( value ) && value.window === value;
};

},{"./is-object-like":116}],124:[function(require,module,exports){
'use strict';

var isWindowLike = require( './is-window-like' );

var toString = {}.toString;

module.exports = function isWindow ( value ) {
  return isWindowLike( value ) && toString.call( value ) === '[object Window]';
};

},{"./is-window-like":123}],125:[function(require,module,exports){
'use strict';

module.exports = function isset ( key, obj ) {
  if ( obj === null || typeof obj === 'undefined' ) {
    return false;
  }

  return typeof obj[ key ] !== 'undefined' || key in obj;
};

},{}],126:[function(require,module,exports){
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

},{"./base/base-values":42,"./is-array-like-object":107,"./keys":129}],127:[function(require,module,exports){
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

},{"./is-array-like-object":107,"./matches-property":131,"./property":143}],128:[function(require,module,exports){
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

},{"./to-object":155}],129:[function(require,module,exports){
'use strict';

var baseKeys = require( './base/base-keys' );
var toObject = require( './to-object' );
var support  = require( './support/support-keys' );

if ( support !== 'es2015' ) {
  var _keys;

  /**
   * + ---------------------------------------------------------------------- +
   * | I tested the functions with string[2048] (an array of strings) and had |
   * | this results in Node.js (v8.10.0):                                     |
   * + ---------------------------------------------------------------------- +
   * | baseKeys x 10,674 ops/sec ±0.23% (94 runs sampled)                     |
   * | Object.keys x 22,147 ops/sec ±0.23% (95 runs sampled)                  |
   * | Fastest is "Object.keys"                                               |
   * + ---------------------------------------------------------------------- +
   */

  if ( support === 'es5' ) {
    _keys = Object.keys;
  } else {
    _keys = baseKeys;
  }

  module.exports = function keys ( v ) {
    return _keys( toObject( v ) );
  };
} else {
  module.exports = Object.keys;
}

},{"./base/base-keys":37,"./support/support-keys":150,"./to-object":155}],130:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-index-of' )( true );

},{"./create/create-index-of":63}],131:[function(require,module,exports){
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

},{"./base/base-get":33,"./cast-path":47,"./constants":53}],132:[function(require,module,exports){
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

},{"./base/base-index-of":35}],133:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property-of' )( require( './base/base-invoke' ), true );

},{"./base/base-invoke":36,"./create/create-property-of":64}],134:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property' )( require( './base/base-invoke' ), true );

},{"./base/base-invoke":36,"./create/create-property":65}],135:[function(require,module,exports){
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

},{"./internal/memoize":100,"./is-array":109,"./is-plain-object":118,"./keys":129,"./to-object":155}],136:[function(require,module,exports){
'use strict';

module.exports = function noop () {}; // eslint-disable-line brace-rules/brace-on-same-line

},{}],137:[function(require,module,exports){
'use strict';

module.exports = Date.now || function now () {
  return new Date().getTime();
};

},{}],138:[function(require,module,exports){
'use strict';

var before = require( './before' );

module.exports = function once ( target ) {
  return before( 1, target );
};

},{"./before":43}],139:[function(require,module,exports){
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

},{"./base/base-clone-array":27,"./fragment":87}],140:[function(require,module,exports){
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
peako.create            = require( './create' );
peako.defaults          = require( './defaults' );
peako.defineProperty    = require( './define-property' );
peako.defineProperties  = require( './define-properties' );
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
peako.now               = require( './now' );
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

},{"./DOMWrapper":1,"./_":20,"./ajax":23,"./assign":25,"./assign-in":24,"./before":43,"./bind":44,"./clamp":48,"./clone":49,"./compound":52,"./constants":53,"./create":54,"./debounce":68,"./default-to":69,"./defaults":70,"./define-properties":71,"./define-property":72,"./each":74,"./each-right":73,"./escape":75,"./find":80,"./find-index":77,"./find-last":79,"./find-last-index":78,"./for-each":82,"./for-each-right":81,"./for-in":84,"./for-in-right":83,"./for-own":86,"./for-own-right":85,"./from-pairs":88,"./get":92,"./get-prototype-of":91,"./has":93,"./identity":94,"./index-of":95,"./invert":106,"./is-array":109,"./is-array-like":108,"./is-array-like-object":107,"./is-dom-element":110,"./is-finite":111,"./is-length":113,"./is-nan":114,"./is-number":115,"./is-object":117,"./is-object-like":116,"./is-plain-object":118,"./is-primitive":119,"./is-safe-integer":120,"./is-string":121,"./is-symbol":122,"./is-window":124,"./is-window-like":123,"./iteratee":127,"./keys":129,"./keys-in":128,"./last-index-of":130,"./method":134,"./method-of":133,"./mixin":135,"./noop":136,"./now":137,"./once":138,"./property":143,"./property-of":142,"./random":145,"./set":147,"./set-prototype-of":146,"./template":151,"./timer":152,"./timestamp":153,"./to-object":155,"./trim":158,"./trim-end":156,"./trim-start":157,"./type":159,"./unescape":160}],141:[function(require,module,exports){
'use strict';

/**
 * @member {object} _.placeholder
 */

},{}],142:[function(require,module,exports){
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

},{"./base/base-property":38,"./create/create-property-of":64}],143:[function(require,module,exports){
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

},{"./base/base-property":38,"./create/create-property":65}],144:[function(require,module,exports){
'use strict';

module.exports = {
  'class': 'className',
  'for':   'htmlFor'
};

},{}],145:[function(require,module,exports){
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

},{"./base/base-random":39}],146:[function(require,module,exports){
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
    target.__proto__ = prototype; // jshint ignore: line
  }

  return target;
};

},{"./constants":53,"./is-primitive":119}],147:[function(require,module,exports){
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

},{"./base/base-set":41,"./cast-path":47,"./constants":53,"./to-object":155}],148:[function(require,module,exports){
'use strict';

var support;

function test ( target ) {
  try {
    if ( '' in Object.defineProperty( target, '', {} ) ) {
      return true;
    }
  } catch ( e ) {}

  return false;
}

if ( test( {} ) ) {
  support = 'full';
} else if ( typeof document !== 'undefined' && test( document.createElement( 'span' ) ) ) {
  support = 'dom';
} else {
  support = 'not-supported';
}

module.exports = support;

},{}],149:[function(require,module,exports){
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

},{}],150:[function(require,module,exports){
'use strict';

var support;

if ( Object.keys ) {
  try {
    support = Object.keys( '' ), 'es2015'; // eslint-disable-line no-unused-expressions, no-sequences
  } catch ( error ) {
    support = 'es5';
  }
} else if ( { toString: null }.propertyIsEnumerable( 'toString' ) ) {
  support = 'has-a-bug';
} else {
  support = 'not-supported';
}

module.exports = support;

},{}],151:[function(require,module,exports){
'use strict';

var escape  = require( './escape' );

var regexps = {
  safe: '<\\%=\\s*([^]*?)\\s*\\%>',
  html: '<\\%-\\s*([^]*?)\\s*\\%>',
  comm: "'''([^]*?)'''",
  code: '<\\%\\s*([^]*?)\\s*\\%>'
};

function replacer ( match, safe, html, code ) {
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
    get( 'code' ) + '|' +
    get( 'comm' ), 'g' );

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

},{"./escape":75}],152:[function(require,module,exports){
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

},{"./timestamp":153}],153:[function(require,module,exports){
'use strict';

var now = require( './now' );
var navigatorStart;

if ( typeof performance === 'undefined' || ! performance.now ) {
  navigatorStart = now();

  module.exports = function timestamp () {
    return now() - navigatorStart;
  };
} else {
  module.exports = function timestamp () {
    return performance.now();
  };
}

},{"./now":137}],154:[function(require,module,exports){
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

},{"./internal/unescape":104,"./is-symbol":122}],155:[function(require,module,exports){
'use strict';

var ERR = require( './constants' ).ERR;

module.exports = function toObject ( value ) {
  if ( value === null || typeof value === 'undefined' ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  return Object( value );
};

},{"./constants":53}],156:[function(require,module,exports){
'use strict';

if ( String.prototype.trimEnd ) {
  module.exports = function trimEnd ( string ) {
    return ( '' + string ).trimEnd();
  };
} else {
  module.exports = require( './create/create-trim' )( /[\s\uFEFF\xA0]+$/ );
}

},{"./create/create-trim":67}],157:[function(require,module,exports){
'use strict';

if ( String.prototype.trimStart ) {
  module.exports = function trimStart ( string ) {
    return ( '' + string ).trimStart();
  };
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+/ );
}

},{"./create/create-trim":67}],158:[function(require,module,exports){
'use strict';

if ( String.prototype.trim ) {
  module.exports = function trim ( string ) {
    return ( '' + string ).trim();
  };
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/ );
}

},{"./create/create-trim":67}],159:[function(require,module,exports){
'use strict';

var create = require( './create' );

var cache = create( null );

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

},{"./create":54}],160:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-escape' )( /&(?:lt|gt|#34|#39|amp);/g, {
  '&lt;':  '<',
  '&gt;':  '>',
  '&#34;': '"',
  '&#39;': "'",
  '&amp;': '&'
} );

},{"./create/create-escape":57}],161:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-first' )( 'toUpperCase' );

},{"./create/create-first":59}]},{},[140])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJET01XcmFwcGVyL2luZGV4LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvY3NzLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZWFjaC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VuZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VxLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZmluZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2ZpcnN0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZ2V0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvbGFzdC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL21hcC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3BhcmVudC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlYWR5LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlQXR0ci5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlbW92ZVByb3AuanMiLCJET01XcmFwcGVyL3Byb3RvdHlwZS9zdGFjay5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3N0eWxlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvc3R5bGVzLmpzIiwiRXZlbnQuanMiLCJfLmpzIiwiYWNjZXNzLmpzIiwiYWpheC1vcHRpb25zLmpzIiwiYWpheC5qcyIsImFzc2lnbi1pbi5qcyIsImFzc2lnbi5qcyIsImJhc2UvYmFzZS1hc3NpZ24uanMiLCJiYXNlL2Jhc2UtY2xvbmUtYXJyYXkuanMiLCJiYXNlL2Jhc2UtY29weS1hcnJheS5qcyIsImJhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHkuanMiLCJiYXNlL2Jhc2UtZXhlYy5qcyIsImJhc2UvYmFzZS1mb3ItZWFjaC5qcyIsImJhc2UvYmFzZS1mb3ItaW4uanMiLCJiYXNlL2Jhc2UtZ2V0LmpzIiwiYmFzZS9iYXNlLWhhcy5qcyIsImJhc2UvYmFzZS1pbmRleC1vZi5qcyIsImJhc2UvYmFzZS1pbnZva2UuanMiLCJiYXNlL2Jhc2Uta2V5cy5qcyIsImJhc2UvYmFzZS1wcm9wZXJ0eS5qcyIsImJhc2UvYmFzZS1yYW5kb20uanMiLCJiYXNlL2Jhc2UtcmVtb3ZlLWF0dHIuanMiLCJiYXNlL2Jhc2Utc2V0LmpzIiwiYmFzZS9iYXNlLXZhbHVlcy5qcyIsImJlZm9yZS5qcyIsImJpbmQuanMiLCJjYWxsLWl0ZXJhdGVlLmpzIiwiY2FtZWxpemUuanMiLCJjYXN0LXBhdGguanMiLCJjbGFtcC5qcyIsImNsb25lLmpzIiwiY2xvc2VzdC1ub2RlLmpzIiwiY2xvc2VzdC5qcyIsImNvbXBvdW5kLmpzIiwiY29uc3RhbnRzLmpzIiwiY3JlYXRlLmpzIiwiY3JlYXRlL2NyZWF0ZS1hc3NpZ24uanMiLCJjcmVhdGUvY3JlYXRlLWVhY2guanMiLCJjcmVhdGUvY3JlYXRlLWVzY2FwZS5qcyIsImNyZWF0ZS9jcmVhdGUtZmluZC5qcyIsImNyZWF0ZS9jcmVhdGUtZmlyc3QuanMiLCJjcmVhdGUvY3JlYXRlLWZvci1lYWNoLmpzIiwiY3JlYXRlL2NyZWF0ZS1mb3ItaW4uanMiLCJjcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbi5qcyIsImNyZWF0ZS9jcmVhdGUtaW5kZXgtb2YuanMiLCJjcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mLmpzIiwiY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS5qcyIsImNyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AuanMiLCJjcmVhdGUvY3JlYXRlLXRyaW0uanMiLCJkZWJvdW5jZS5qcyIsImRlZmF1bHQtdG8uanMiLCJkZWZhdWx0cy5qcyIsImRlZmluZS1wcm9wZXJ0aWVzLmpzIiwiZGVmaW5lLXByb3BlcnR5LmpzIiwiZWFjaC1yaWdodC5qcyIsImVhY2guanMiLCJlc2NhcGUuanMiLCJldmVudC5qcyIsImZpbmQtaW5kZXguanMiLCJmaW5kLWxhc3QtaW5kZXguanMiLCJmaW5kLWxhc3QuanMiLCJmaW5kLmpzIiwiZm9yLWVhY2gtcmlnaHQuanMiLCJmb3ItZWFjaC5qcyIsImZvci1pbi1yaWdodC5qcyIsImZvci1pbi5qcyIsImZvci1vd24tcmlnaHQuanMiLCJmb3Itb3duLmpzIiwiZnJhZ21lbnQuanMiLCJmcm9tLXBhaXJzLmpzIiwiZ2V0LWVsZW1lbnQtaC5qcyIsImdldC1lbGVtZW50LXcuanMiLCJnZXQtcHJvdG90eXBlLW9mLmpzIiwiZ2V0LmpzIiwiaGFzLmpzIiwiaWRlbnRpdHkuanMiLCJpbmRleC1vZi5qcyIsImludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uLmpzIiwiaW50ZXJuYWwvY3NzLW51bWJlcnMuanMiLCJpbnRlcm5hbC9maXJzdC5qcyIsImludGVybmFsL2dldC1zdHlsZS5qcyIsImludGVybmFsL21lbW9pemUuanMiLCJpbnRlcm5hbC9wcm9jZXNzLWFyZ3MuanMiLCJpbnRlcm5hbC90ZXh0LWNvbnRlbnQuanMiLCJpbnRlcm5hbC90eXBlLmpzIiwiaW50ZXJuYWwvdW5lc2NhcGUuanMiLCJpbnRlcm5hbC93b3Jkcy5qcyIsImludmVydC5qcyIsImlzLWFycmF5LWxpa2Utb2JqZWN0LmpzIiwiaXMtYXJyYXktbGlrZS5qcyIsImlzLWFycmF5LmpzIiwiaXMtZG9tLWVsZW1lbnQuanMiLCJpcy1maW5pdGUuanMiLCJpcy1rZXkuanMiLCJpcy1sZW5ndGguanMiLCJpcy1uYW4uanMiLCJpcy1udW1iZXIuanMiLCJpcy1vYmplY3QtbGlrZS5qcyIsImlzLW9iamVjdC5qcyIsImlzLXBsYWluLW9iamVjdC5qcyIsImlzLXByaW1pdGl2ZS5qcyIsImlzLXNhZmUtaW50ZWdlci5qcyIsImlzLXN0cmluZy5qcyIsImlzLXN5bWJvbC5qcyIsImlzLXdpbmRvdy1saWtlLmpzIiwiaXMtd2luZG93LmpzIiwiaXNzZXQuanMiLCJpdGVyYWJsZS5qcyIsIml0ZXJhdGVlLmpzIiwia2V5cy1pbi5qcyIsImtleXMuanMiLCJsYXN0LWluZGV4LW9mLmpzIiwibWF0Y2hlcy1wcm9wZXJ0eS5qcyIsIm1hdGNoZXMtc2VsZWN0b3IuanMiLCJtZXRob2Qtb2YuanMiLCJtZXRob2QuanMiLCJtaXhpbi5qcyIsIm5vb3AuanMiLCJub3cuanMiLCJvbmNlLmpzIiwicGFyc2UtaHRtbC5qcyIsInBlYWtvLmpzIiwicGxhY2Vob2xkZXIuanMiLCJwcm9wZXJ0eS1vZi5qcyIsInByb3BlcnR5LmpzIiwicHJvcHMuanMiLCJyYW5kb20uanMiLCJzZXQtcHJvdG90eXBlLW9mLmpzIiwic2V0LmpzIiwic3VwcG9ydC9zdXBwb3J0LWRlZmluZS1wcm9wZXJ0eS5qcyIsInN1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlLmpzIiwic3VwcG9ydC9zdXBwb3J0LWtleXMuanMiLCJ0ZW1wbGF0ZS5qcyIsInRpbWVyLmpzIiwidGltZXN0YW1wLmpzIiwidG8ta2V5LmpzIiwidG8tb2JqZWN0LmpzIiwidHJpbS1lbmQuanMiLCJ0cmltLXN0YXJ0LmpzIiwidHJpbS5qcyIsInR5cGUuanMiLCJ1bmVzY2FwZS5qcyIsInVwcGVyLWZpcnN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTVdyYXBwZXI7XG5cbnZhciBfdGV4dENvbnRlbnQgICAgICAgICA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC90ZXh0LWNvbnRlbnQnICk7XG52YXIgX2ZpcnN0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvZmlyc3QnICk7XG52YXIgX3dvcmRzICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvd29yZHMnICk7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQtZ2V0LWF0dHJpYnV0ZScgKTtcblxudmFyIGNyZWF0ZVJlbW92ZVByb3BlcnR5ID0gcmVxdWlyZSggJy4uL2NyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AnICk7XG5cbnZhciBiYXNlRm9yRWFjaCAgICAgICAgICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWVhY2gnICk7XG52YXIgYmFzZUZvckluICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1pbicgKTtcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ICAgID0gcmVxdWlyZSggJy4uL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xudmFyIGlzRE9NRWxlbWVudCAgICAgICAgID0gcmVxdWlyZSggJy4uL2lzLWRvbS1lbGVtZW50JyApO1xudmFyIGdldEVsZW1lbnRXICAgICAgICAgID0gcmVxdWlyZSggJy4uL2dldC1lbGVtZW50LXcnICk7XG52YXIgZ2V0RWxlbWVudEggICAgICAgICAgPSByZXF1aXJlKCAnLi4vZ2V0LWVsZW1lbnQtaCcgKTtcbnZhciBwYXJzZUhUTUwgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9wYXJzZS1odG1sJyApO1xudmFyIGFjY2VzcyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2FjY2VzcycgKTtcbnZhciBldmVudCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9ldmVudCcgKTtcblxudmFyIHJzZWxlY3RvciA9IC9eKD86IyhbXFx3LV0rKXwoW1xcdy1dKyl8XFwuKFtcXHctXSspKSQvO1xuXG5mdW5jdGlvbiBET01XcmFwcGVyICggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG4gIHZhciBtYXRjaDtcbiAgdmFyIGxpc3Q7XG4gIHZhciBpO1xuXG4gIC8vIF8oKTtcblxuICBpZiAoICEgc2VsZWN0b3IgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gXyggd2luZG93ICk7XG5cbiAgaWYgKCBpc0RPTUVsZW1lbnQoIHNlbGVjdG9yICkgKSB7XG4gICAgX2ZpcnN0KCB0aGlzLCBzZWxlY3RvciApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyApIHtcbiAgICBpZiAoIHR5cGVvZiBjb250ZXh0ICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIGlmICggISBjb250ZXh0Ll9wZWFrbyApIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBET01XcmFwcGVyKCBjb250ZXh0ICk7XG4gICAgICB9XG5cbiAgICAgIGlmICggISBjb250ZXh0WyAwIF0gKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29udGV4dCA9IGNvbnRleHRbIDAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGV4dCA9IGRvY3VtZW50O1xuICAgIH1cblxuICAgIGlmICggc2VsZWN0b3IuY2hhckF0KCAwICkgIT09ICc8JyApIHtcbiAgICAgIG1hdGNoID0gcnNlbGVjdG9yLmV4ZWMoIHNlbGVjdG9yICk7XG5cbiAgICAgIC8vIF8oICdhID4gYiArIGMnICk7XG4gICAgICAvLyBfKCAnI2lkJywgJy5hbm90aGVyLWVsZW1lbnQnIClcblxuICAgICAgaWYgKCAhIG1hdGNoIHx8ICEgY29udGV4dC5nZXRFbGVtZW50QnlJZCAmJiBtYXRjaFsgMSBdIHx8ICEgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIG1hdGNoWyAzIF0gKSB7XG4gICAgICAgIGlmICggbWF0Y2ggJiYgbWF0Y2hbIDEgXSApIHtcbiAgICAgICAgICBsaXN0ID0gWyBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoIHNlbGVjdG9yICkgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaXN0ID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApO1xuICAgICAgICB9XG5cbiAgICAgIC8vIF8oICcjaWQnICk7XG5cbiAgICAgIH0gZWxzZSBpZiAoIG1hdGNoWyAxIF0gKSB7XG4gICAgICAgIGlmICggKCBsaXN0ID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggbWF0Y2hbIDEgXSApICkgKSB7XG4gICAgICAgICAgX2ZpcnN0KCB0aGlzLCBsaXN0ICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIF8oICd0YWcnICk7XG5cbiAgICAgIH0gZWxzZSBpZiAoIG1hdGNoWyAyIF0gKSB7XG4gICAgICAgIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBtYXRjaFsgMiBdICk7XG5cbiAgICAgIC8vIF8oICcuY2xhc3MnICk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIG1hdGNoWyAzIF0gKTtcbiAgICAgIH1cblxuICAgIC8vIF8oICc8ZGl2PicgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0ID0gcGFyc2VIVE1MKCBzZWxlY3RvciwgY29udGV4dCApO1xuICAgIH1cblxuICAvLyBfKCBbIC4uLiBdICk7XG5cbiAgfSBlbHNlIGlmICggaXNBcnJheUxpa2VPYmplY3QoIHNlbGVjdG9yICkgKSB7XG4gICAgbGlzdCA9IHNlbGVjdG9yO1xuXG4gIC8vIF8oIGZ1bmN0aW9uICggXyApIHsgLi4uIH0gKTtcblxuICB9IGVsc2UgaWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBkb2N1bWVudCApLnJlYWR5KCBzZWxlY3RvciApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFR5cGVFcnJvciggJ0dvdCB1bmV4cGVjdGVkIHNlbGVjdG9yOiAnICsgc2VsZWN0b3IgKyAnLicgKTtcbiAgfVxuXG4gIGlmICggISBsaXN0ICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMubGVuZ3RoID0gbGlzdC5sZW5ndGg7XG5cbiAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgdGhpc1sgaSBdID0gbGlzdFsgaSBdO1xuICB9XG59XG5cbkRPTVdyYXBwZXIucHJvdG90eXBlID0ge1xuICBlYWNoOiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZWFjaCcgKSxcbiAgZW5kOiAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2VuZCcgKSxcbiAgZXE6ICAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2VxJyApLFxuICBmaW5kOiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZmluZCcgKSxcbiAgZmlyc3Q6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2ZpcnN0JyApLFxuICBnZXQ6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZ2V0JyApLFxuICBsYXN0OiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvbGFzdCcgKSxcbiAgbWFwOiAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL21hcCcgKSxcbiAgcGFyZW50OiAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3BhcmVudCcgKSxcbiAgcmVhZHk6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3JlYWR5JyApLFxuICByZW1vdmU6ICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVtb3ZlJyApLFxuICByZW1vdmVBdHRyOiByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVtb3ZlQXR0cicgKSxcbiAgcmVtb3ZlUHJvcDogcmVxdWlyZSggJy4vcHJvdG90eXBlL3JlbW92ZVByb3AnICksXG4gIHN0YWNrOiAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9zdGFjaycgKSxcbiAgc3R5bGU6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3N0eWxlJyApLFxuICBzdHlsZXM6ICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvc3R5bGVzJyApLFxuICBjc3M6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvY3NzJyApLFxuICBjb25zdHJ1Y3RvcjogRE9NV3JhcHBlcixcbiAgbGVuZ3RoOiAwLFxuICBfcGVha286IHRydWVcbn07XG5cbmJhc2VGb3JJbigge1xuICB0cmlnZ2VyOiAndHJpZ2dlcicsXG4gIG9uY2U6ICAgICdvbicsXG4gIG9mZjogICAgICdvZmYnLFxuICBvbjogICAgICAnb24nXG59LCBmdW5jdGlvbiAoIG5hbWUsIG1ldGhvZE5hbWUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBtZXRob2ROYW1lIF0gPSBmdW5jdGlvbiAoIHR5cGVzLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG4gICAgdmFyIHJlbW92ZUFsbCA9IG1ldGhvZE5hbWUgPT09ICdvZmYnICYmICEgYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgb25jZSA9IG1ldGhvZE5hbWUgPT09ICdvbmNlJztcbiAgICB2YXIgZWxlbWVudDtcbiAgICB2YXIgaTtcbiAgICB2YXIgajtcbiAgICB2YXIgbDtcblxuICAgIGlmICggISByZW1vdmVBbGwgKSB7XG4gICAgICB0eXBlcyA9IF93b3JkcyggdHlwZXMgKTtcblxuICAgICAgaWYgKCAhIHR5cGVzLmxlbmd0aCApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGwgPSB0eXBlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gb2ZmKCB0eXBlcywgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKVxuICAgIC8vIG9mZiggdHlwZXMsIGxpc3RlbmVyIClcblxuICAgIGlmICggbWV0aG9kTmFtZSAhPT0gJ3RyaWdnZXInICYmIHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIGlmICggdHlwZW9mIGxpc3RlbmVyICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgdXNlQ2FwdHVyZSA9IGxpc3RlbmVyO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lciA9IHNlbGVjdG9yO1xuICAgICAgc2VsZWN0b3IgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIHVzZUNhcHR1cmUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdXNlQ2FwdHVyZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgZWxlbWVudCA9IHRoaXNbIGkgXTtcblxuICAgICAgaWYgKCByZW1vdmVBbGwgKSB7XG4gICAgICAgIGV2ZW50Lm9mZiggZWxlbWVudCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICggaiA9IDA7IGogPCBsOyArK2ogKSB7XG4gICAgICAgICAgZXZlbnRbIG5hbWUgXSggZWxlbWVudCwgdHlwZXNbIGogXSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlLCBvbmNlICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBpZiAoIG1ldGhvZE5hbWUgPT09ICdvbmNlJyApIHtcbiAgICB2YXIgY291bnQgPSAwO1xuXG4gICAgRE9NV3JhcHBlci5wcm90b3R5cGUub25lID0gZnVuY3Rpb24gb25lICgpIHtcbiAgICAgIGlmICggY291bnQrKyA8IDEgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCAnXCJvbmVcIiBpcyBkZXByZWNhdGVkIG5vdy4gVXNlIFwib25jZVwiIGluc3RlYWQuJyApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5vbmNlLmFwcGx5KCB0aGlzLCBbXS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xuICAgIH07XG4gIH1cbn0sIHZvaWQgMCwgdHJ1ZSwgWyAndHJpZ2dlcicsICdvbmNlJywgJ29mZicsICdvbicgXSApO1xuXG5iYXNlRm9yRWFjaCggW1xuICAnYmx1cicsICAgICAgICAnZm9jdXMnLCAgICAgICAnZm9jdXNpbicsXG4gICdmb2N1c291dCcsICAgICdyZXNpemUnLCAgICAgICdzY3JvbGwnLFxuICAnY2xpY2snLCAgICAgICAnZGJsY2xpY2snLCAgICAnbW91c2Vkb3duJyxcbiAgJ21vdXNldXAnLCAgICAgJ21vdXNlbW92ZScsICAgJ21vdXNlb3ZlcicsXG4gICdtb3VzZW91dCcsICAgICdtb3VzZWVudGVyJywgICdtb3VzZWxlYXZlJyxcbiAgJ2NoYW5nZScsICAgICAgJ3NlbGVjdCcsICAgICAgJ3N1Ym1pdCcsXG4gICdrZXlkb3duJywgICAgICdrZXlwcmVzcycsICAgICdrZXl1cCcsXG4gICdjb250ZXh0bWVudScsICd0b3VjaHN0YXJ0JywgICd0b3VjaG1vdmUnLFxuICAndG91Y2hlbmQnLCAgICAndG91Y2hlbnRlcicsICAndG91Y2hsZWF2ZScsXG4gICd0b3VjaGNhbmNlbCcsICdsb2FkJ1xuXSwgZnVuY3Rpb24gKCBldmVudFR5cGUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBldmVudFR5cGUgXSA9IGZ1bmN0aW9uICggYXJnICkge1xuICAgIHZhciBpO1xuICAgIHZhciBsO1xuXG4gICAgaWYgKCB0eXBlb2YgYXJnICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgcmV0dXJuIHRoaXMudHJpZ2dlciggZXZlbnRUeXBlLCBhcmcgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICB0aGlzLm9uKCBldmVudFR5cGUsIGFyZ3VtZW50c1sgaSBdLCBmYWxzZSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSwgdm9pZCAwLCB0cnVlICk7XG5cbmJhc2VGb3JJbigge1xuICBkaXNhYmxlZDogJ2Rpc2FibGVkJyxcbiAgY2hlY2tlZDogICdjaGVja2VkJyxcbiAgdmFsdWU6ICAgICd2YWx1ZScsXG4gIHRleHQ6ICAgICAndGV4dENvbnRlbnQnIGluIGRvY3VtZW50LmJvZHkgPyAndGV4dENvbnRlbnQnIDogX3RleHRDb250ZW50LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgaHRtbDogICAgICdpbm5lckhUTUwnXG59LCBmdW5jdGlvbiAoIGtleSwgbWV0aG9kTmFtZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIG1ldGhvZE5hbWUgXSA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICBpZiAoICEgKCBlbGVtZW50ID0gdGhpc1sgMCBdICkgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRbIGtleSBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5KCBlbGVtZW50ICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCB0eXBlb2Yga2V5ICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICBlbGVtZW50WyBrZXkgXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAga2V5KCBlbGVtZW50LCB2YWx1ZSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSwgdm9pZCAwLCB0cnVlLCBbICdkaXNhYmxlZCcsICdjaGVja2VkJywgJ3ZhbHVlJywgJ3RleHQnLCAnaHRtbCcgXSApO1xuXG4oIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByb3BzID0gcmVxdWlyZSggJy4uL3Byb3BzJyApO1xuXG4gIGZ1bmN0aW9uIF9hdHRyICggZWxlbWVudCwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICkge1xuICAgIGlmICggZWxlbWVudC5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICggcHJvcHNbIGtleSBdIHx8ICEgc3VwcG9ydCApIHtcbiAgICAgIHJldHVybiBfcHJvcCggZWxlbWVudCwgcHJvcHNbIGtleSBdIHx8IGtleSwgdmFsdWUsIGNoYWluYWJsZSApO1xuICAgIH1cblxuICAgIGlmICggISBjaGFpbmFibGUgKSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoIGtleSApO1xuICAgIH1cblxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCBrZXksIHZhbHVlICk7XG4gIH1cblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gYXR0ciAoIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWx1ZSwgX2F0dHIgKTtcbiAgfTtcblxuICBmdW5jdGlvbiBfcHJvcCAoIGVsZW1lbnQsIGtleSwgdmFsdWUsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRbIGtleSBdO1xuICAgIH1cblxuICAgIGVsZW1lbnRbIGtleSBdID0gdmFsdWU7XG4gIH1cblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5wcm9wID0gZnVuY3Rpb24gcHJvcCAoIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWx1ZSwgX3Byb3AgKTtcbiAgfTtcbn0gKSgpO1xuXG4oIGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9wZWFrb0lkID0gMDtcbiAgdmFyIF9kYXRhID0ge307XG5cbiAgZnVuY3Rpb24gX2FjY2Vzc0RhdGEgKCBlbGVtZW50LCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKSB7XG4gICAgdmFyIGF0dHJpYnV0ZXM7XG4gICAgdmFyIGF0dHJpYnV0ZTtcbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGlmICggISBlbGVtZW50Ll9wZWFrb0lkICkge1xuICAgICAgZWxlbWVudC5fcGVha29JZCA9ICsrX3BlYWtvSWQ7XG4gICAgfVxuXG4gICAgaWYgKCAhICggZGF0YSA9IF9kYXRhWyBlbGVtZW50Ll9wZWFrb0lkIF0gKSApIHtcbiAgICAgIGRhdGEgPSBfZGF0YVsgZWxlbWVudC5fcGVha29JZCBdID0ge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG5cbiAgICAgIGZvciAoIGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXMsIGkgPSAwLCBsID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICAgIGlmICggISAoIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbIGkgXSApLm5vZGVOYW1lLmluZGV4T2YoICdkYXRhLScgKSApIHtcbiAgICAgICAgICBkYXRhWyBhdHRyaWJ1dGUubm9kZU5hbWUuc2xpY2UoIDUgKSBdID0gYXR0cmlidXRlLm5vZGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggY2hhaW5hYmxlICkge1xuICAgICAgZGF0YVsga2V5IF0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRhdGFbIGtleSBdO1xuICAgIH1cbiAgfVxuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbiBkYXRhICgga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbHVlLCBfYWNjZXNzRGF0YSApO1xuICB9O1xuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLnJlbW92ZURhdGEgPSBjcmVhdGVSZW1vdmVQcm9wZXJ0eSggZnVuY3Rpb24gX3JlbW92ZURhdGEgKCBlbGVtZW50LCBrZXkgKSB7XG4gICAgaWYgKCBlbGVtZW50Ll9wZWFrb0lkICkge1xuICAgICAgZGVsZXRlIF9kYXRhWyBlbGVtZW50Ll9wZWFrb0lkIF1bIGtleSBdO1xuICAgIH1cbiAgfSApO1xufSApKCk7XG5cbmJhc2VGb3JJbiggeyBoZWlnaHQ6IGdldEVsZW1lbnRXLCB3aWR0aDogZ2V0RWxlbWVudEggfSwgZnVuY3Rpb24gKCBnZXQsIG5hbWUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBuYW1lIF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCB0aGlzWyAwIF0gKSB7XG4gICAgICByZXR1cm4gZ2V0KCB0aGlzWyAwIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn0sIHZvaWQgMCwgdHJ1ZSwgWyAnaGVpZ2h0JywgJ3dpZHRoJyBdICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5ID0gcmVxdWlyZSggJy4uLy4uL2lzLWFycmF5JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNzcyAoIGssIHYgKSB7XG4gIGlmICggaXNBcnJheSggayApICkge1xuICAgIHJldHVybiB0aGlzLnN0eWxlcyggayApO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuc3R5bGUoIGssIHYgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZWFjaCAoIGZ1biApIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG5cbiAgZm9yICggOyBpIDwgbGVuOyArK2kgKSB7XG4gICAgaWYgKCBmdW4uY2FsbCggdGhpc1sgaSBdLCBpLCB0aGlzWyBpIF0gKSA9PT0gZmFsc2UgKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuZCAoKSB7XG4gIHJldHVybiB0aGlzLl9wcmV2aW91cyB8fCBuZXcgRE9NV3JhcHBlcigpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlcSAoIGluZGV4ICkge1xuICByZXR1cm4gdGhpcy5zdGFjayggdGhpcy5nZXQoIGluZGV4ICkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbmQgKCBzZWxlY3RvciApIHtcbiAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBzZWxlY3RvciwgdGhpcyApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaXJzdCAoKSB7XG4gIHJldHVybiB0aGlzLmVxKCAwICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xvbmUgPSByZXF1aXJlKCAnLi4vLi4vYmFzZS9iYXNlLWNsb25lLWFycmF5JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldCAoIGluZGV4ICkge1xuICBpZiAoIHR5cGVvZiBpbmRleCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGNsb25lKCB0aGlzICk7XG4gIH1cblxuICBpZiAoIGluZGV4IDwgMCApIHtcbiAgICByZXR1cm4gdGhpc1sgdGhpcy5sZW5ndGggKyBpbmRleCBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXNbIGluZGV4IF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxhc3QgKCkge1xuICByZXR1cm4gdGhpcy5lcSggLTEgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFwICggZnVuICkge1xuICB2YXIgZWxzID0gdGhpcy5zdGFjaygpO1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG4gIHZhciBlbDtcbiAgdmFyIGk7XG5cbiAgZWxzLmxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gIGZvciAoIGkgPSAwOyBpIDwgbGVuOyArK2kgKSB7XG4gICAgZWxzWyBpIF0gPSBmdW4uY2FsbCggZWwgPSB0aGlzWyBpIF0sIGksIGVsICk7XG4gIH1cblxuICByZXR1cm4gZWxzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4uLy4uL2Jhc2UvYmFzZS1pbmRleC1vZicgKTtcbnZhciBtYXRjaGVzICAgICA9IHJlcXVpcmUoICcuLi8uLi9tYXRjaGVzLXNlbGVjdG9yJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcmVudCAoIHNlbGVjdG9yICkge1xuICB2YXIgZWxlbWVudHMgPSB0aGlzLnN0YWNrKCk7XG4gIHZhciBlbGVtZW50O1xuICB2YXIgcGFyZW50O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBwYXJlbnQgPSAoIGVsZW1lbnQgPSB0aGlzWyBpIF0gKS5ub2RlVHlwZSA9PT0gMSAmJiBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICBpZiAoIHBhcmVudCAmJiBiYXNlSW5kZXhPZiggZWxlbWVudHMsIHBhcmVudCApIDwgMCAmJiAoICEgc2VsZWN0b3IgfHwgbWF0Y2hlcy5jYWxsKCBwYXJlbnQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgIGVsZW1lbnRzWyBlbGVtZW50cy5sZW5ndGgrKyBdID0gcGFyZW50O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBldmVudCA9IHJlcXVpcmUoICcuLi8uLi9ldmVudCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZWFkeSAoIGNiICkge1xuICB2YXIgZG9jID0gdGhpc1sgMCBdO1xuICB2YXIgcmVhZHlTdGF0ZTtcblxuICBpZiAoICEgZG9jIHx8IGRvYy5ub2RlVHlwZSAhPT0gOSApIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlYWR5U3RhdGUgPSBkb2MucmVhZHlTdGF0ZTtcblxuICBpZiAoIGRvYy5hdHRhY2hFdmVudCA/IHJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScgOiByZWFkeVN0YXRlID09PSAnbG9hZGluZycgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICAgIGV2ZW50Lm9uKCBkb2MsICdET01Db250ZW50TG9hZGVkJywgbnVsbCwgZnVuY3Rpb24gKCkge1xuICAgICAgY2IoKTtcbiAgICB9LCBmYWxzZSwgdHJ1ZSApO1xuICB9IGVsc2Uge1xuICAgIGNiKCk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVtb3ZlICgpIHtcbiAgdmFyIGkgPSB0aGlzLmxlbmd0aCAtIDE7XG4gIHZhciBwYXJlbnROb2RlO1xuICB2YXIgbm9kZVR5cGU7XG5cbiAgZm9yICggOyBpID49IDA7IC0taSApIHtcbiAgICBub2RlVHlwZSA9IHRoaXNbIGkgXS5ub2RlVHlwZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBicmFjZS1ydWxlcy9icmFjZS1vbi1zYW1lLWxpbmVcbiAgICBpZiAoIG5vZGVUeXBlICE9PSAxICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gMyAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDggJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSA5ICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gMTEgKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoICggcGFyZW50Tm9kZSA9IHRoaXNbIGkgXS5wYXJlbnROb2RlICkgKSB7XG4gICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzWyBpIF0gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4uLy4uL2NyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AnICkoIHJlcXVpcmUoICcuLi8uLi9iYXNlL2Jhc2UtcmVtb3ZlLWF0dHInICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi4vLi4vY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcCcgKSggZnVuY3Rpb24gX3JlbW92ZVByb3AgKCBlbGVtZW50LCBrZXkgKSB7XG4gIGRlbGV0ZSBlbGVtZW50WyBrZXkgXTtcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9maXJzdCAgICAgICAgPSByZXF1aXJlKCAnLi4vLi4vaW50ZXJuYWwvZmlyc3QnICk7XG5cbnZhciBiYXNlQ29weUFycmF5ID0gcmVxdWlyZSggJy4uLy4uL2Jhc2UvYmFzZS1jb3B5LWFycmF5JyApO1xuXG52YXIgRE9NV3JhcHBlciAgICA9IHJlcXVpcmUoICcuLicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdGFjayAoIGVsZW1lbnRzICkge1xuICB2YXIgd3JhcHBlciA9IG5ldyBET01XcmFwcGVyKCk7XG5cbiAgaWYgKCBlbGVtZW50cyApIHtcbiAgICBpZiAoIGVsZW1lbnRzLmxlbmd0aCApIHtcbiAgICAgIGJhc2VDb3B5QXJyYXkoIHdyYXBwZXIsIGVsZW1lbnRzICkubGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZmlyc3QoIHdyYXBwZXIsIGVsZW1lbnRzICk7XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlci5fcHJldmlvdXMgPSB3cmFwcGVyLnByZXZPYmplY3QgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuXG4gIHJldHVybiB3cmFwcGVyO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jc3NOdW1iZXJzICAgPSByZXF1aXJlKCAnLi4vLi4vaW50ZXJuYWwvY3NzLW51bWJlcnMnICk7XG52YXIgX2dldFN0eWxlICAgICA9IHJlcXVpcmUoICcuLi8uLi9pbnRlcm5hbC9nZXQtc3R5bGUnICk7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi4vLi4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgY2FtZWxpemUgICAgID0gcmVxdWlyZSggJy4uLy4uL2NhbWVsaXplJyApO1xudmFyIGFjY2VzcyAgICAgICA9IHJlcXVpcmUoICcuLi8uLi9hY2Nlc3MnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGUgKCBrZXksIHZhbCApIHtcbiAgdmFyIHB4ID0gJ2RvLW5vdC1hZGQnO1xuXG4gIC8vIENvbXB1dGUgcHggb3IgYWRkICdweCcgdG8gYHZhbGAgbm93LlxuXG4gIGlmICggdHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYgISBfY3NzTnVtYmVyc1sgY2FtZWxpemUoIGtleSApIF0gKSB7XG4gICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyApIHtcbiAgICAgIHZhbCArPSAncHgnO1xuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICBweCA9ICdnb3QtYS1mdW5jdGlvbic7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc09iamVjdExpa2UoIGtleSApICkge1xuICAgIHB4ID0gJ2dvdC1hbi1vYmplY3QnO1xuICB9XG5cbiAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWwsIGZ1bmN0aW9uICggZWxlbWVudCwga2V5LCB2YWwsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoIGVsZW1lbnQubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBrZXkgPSBjYW1lbGl6ZSgga2V5ICk7XG5cbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIF9nZXRTdHlsZSggZWxlbWVudCwga2V5ICk7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiAoIHB4ID09PSAnZ290LWEtZnVuY3Rpb24nIHx8IHB4ID09PSAnZ290LWFuLW9iamVjdCcgJiYgISBfY3NzTnVtYmVyc1sga2V5IF0gKSApIHtcbiAgICAgIHZhbCArPSAncHgnO1xuICAgIH1cblxuICAgIGVsZW1lbnQuc3R5bGVbIGtleSBdID0gdmFsO1xuICB9ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FtZWxpemUgPSByZXF1aXJlKCAnLi4vLi4vY2FtZWxpemUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGVzICgga2V5cyApIHtcbiAgdmFyIGVsZW1lbnQgPSB0aGlzWyAwIF07XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGNvbXB1dGVkO1xuICB2YXIgdmFsdWU7XG4gIHZhciBrZXk7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IGtleXNbIGkgXTtcblxuICAgIGlmICggISBjb21wdXRlZCApIHtcbiAgICAgIHZhbHVlID0gZWxlbWVudC5zdHlsZVsgKCBrZXkgPSBjYW1lbGl6ZSgga2V5ICkgKSBdO1xuICAgIH1cblxuICAgIGlmICggISB2YWx1ZSApIHtcbiAgICAgIGlmICggISBjb21wdXRlZCApIHtcbiAgICAgICAgY29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlKCBlbGVtZW50ICk7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgga2V5ICk7XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2goIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VBc3NpZ24gPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtYXNzaWduJyApO1xuXG52YXIgaXNzZXQgICAgICA9IHJlcXVpcmUoICcuL2lzc2V0JyApO1xudmFyIGtleXMgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG52YXIgZGVmYXVsdHMgPSBbXG4gICdhbHRLZXknLCAgICAgICAgJ2J1YmJsZXMnLCAgICAgICAgJ2NhbmNlbGFibGUnLFxuICAnY2FuY2VsQnViYmxlJywgICdjaGFuZ2VkVG91Y2hlcycsICdjdHJsS2V5JyxcbiAgJ2N1cnJlbnRUYXJnZXQnLCAnZGV0YWlsJywgICAgICAgICAnZXZlbnRQaGFzZScsXG4gICdtZXRhS2V5JywgICAgICAgJ3BhZ2VYJywgICAgICAgICAgJ3BhZ2VZJyxcbiAgJ3NoaWZ0S2V5JywgICAgICAndmlldycsICAgICAgICAgICAnY2hhcicsXG4gICdjaGFyQ29kZScsICAgICAgJ2tleScsICAgICAgICAgICAgJ2tleUNvZGUnLFxuICAnYnV0dG9uJywgICAgICAgICdidXR0b25zJywgICAgICAgICdjbGllbnRYJyxcbiAgJ2NsaWVudFknLCAgICAgICAnb2Zmc2V0WCcsICAgICAgICAnb2Zmc2V0WScsXG4gICdwb2ludGVySWQnLCAgICAgJ3BvaW50ZXJUeXBlJywgICAgJ3JlbGF0ZWRUYXJnZXQnLFxuICAncmV0dXJuVmFsdWUnLCAgICdzY3JlZW5YJywgICAgICAgICdzY3JlZW5ZJyxcbiAgJ3RhcmdldFRvdWNoZXMnLCAndG9FbGVtZW50JywgICAgICAndG91Y2hlcycsXG4gICdpc1RydXN0ZWQnXG5dO1xuXG5mdW5jdGlvbiBFdmVudCAoIG9yaWdpbmFsLCBvcHRpb25zICkge1xuICB2YXIgaTtcbiAgdmFyIGs7XG5cbiAgaWYgKCB0eXBlb2Ygb3JpZ2luYWwgPT09ICdvYmplY3QnICkge1xuICAgIGZvciAoIGkgPSBkZWZhdWx0cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggaXNzZXQoIGsgPSBkZWZhdWx0c1sgaSBdLCBvcmlnaW5hbCApICkge1xuICAgICAgICB0aGlzWyBrIF0gPSBvcmlnaW5hbFsgayBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggb3JpZ2luYWwudGFyZ2V0ICkge1xuICAgICAgaWYgKCBvcmlnaW5hbC50YXJnZXQubm9kZVR5cGUgPT09IDMgKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWwudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsLnRhcmdldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9yaWdpbmFsID0gdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG4gICAgdGhpcy53aGljaCA9IEV2ZW50LndoaWNoKCBvcmlnaW5hbCApO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuaXNUcnVzdGVkID0gZmFsc2U7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBvcmlnaW5hbCA9PT0gJ3N0cmluZycgKSB7XG4gICAgdGhpcy50eXBlID0gb3JpZ2luYWw7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyApIHtcbiAgICB0aGlzLnR5cGUgPSBvcHRpb25zO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgKSB7XG4gICAgYmFzZUFzc2lnbiggdGhpcywgb3B0aW9ucywga2V5cyggb3B0aW9ucyApICk7XG4gIH1cbn1cblxuRXZlbnQucHJvdG90eXBlID0ge1xuICBwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24gcHJldmVudERlZmF1bHQgKCkge1xuICAgIGlmICggdGhpcy5vcmlnaW5hbCApIHtcbiAgICAgIGlmICggdGhpcy5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJldHVyblZhbHVlID0gdGhpcy5vcmlnaW5hbC5yZXR1cm5WYWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24gKCkge1xuICAgIGlmICggdGhpcy5vcmlnaW5hbCApIHtcbiAgICAgIGlmICggdGhpcy5vcmlnaW5hbC5zdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9yaWdpbmFsLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FuY2VsQnViYmxlID0gdGhpcy5vcmlnaW5hbC5jYW5jZWxCdWJibGU7XG4gICAgfVxuICB9LFxuXG4gIGNvbnN0cnVjdG9yOiBFdmVudFxufTtcblxuRXZlbnQud2hpY2ggPSBmdW5jdGlvbiB3aGljaCAoIGV2ZW50ICkge1xuICBpZiAoIGV2ZW50LndoaWNoICkge1xuICAgIHJldHVybiBldmVudC53aGljaDtcbiAgfVxuXG4gIGlmICggISBldmVudC50eXBlLmluZGV4T2YoICdrZXknICkgKSB7XG4gICAgaWYgKCB0eXBlb2YgZXZlbnQuY2hhckNvZGUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuIGV2ZW50LmNoYXJDb2RlO1xuICAgIH1cblxuICAgIHJldHVybiBldmVudC5rZXlDb2RlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgZXZlbnQuYnV0dG9uID09PSAndW5kZWZpbmVkJyB8fCAhIC9eKD86bW91c2V8cG9pbnRlcnxjb250ZXh0bWVudXxkcmFnfGRyb3ApfGNsaWNrLy50ZXN0KCBldmVudC50eXBlICkgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIGV2ZW50LmJ1dHRvbiAmIDEgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKCBldmVudC5idXR0b24gJiAyICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIGlmICggZXZlbnQuYnV0dG9uICYgNCApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG4gICAgcmV0dXJuIDI7XG4gIH1cblxuICByZXR1cm4gMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcblxuZnVuY3Rpb24gXyAoIHNlbGVjdG9yLCBjb250ZXh0ICkge1xuICByZXR1cm4gbmV3IERPTVdyYXBwZXIoIHNlbGVjdG9yLCBjb250ZXh0ICk7XG59XG5cbl8uZm4gPSBfLnByb3RvdHlwZSA9IERPTVdyYXBwZXIucHJvdG90eXBlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuXy5mbi5jb25zdHJ1Y3RvciA9IF87XG5cbm1vZHVsZS5leHBvcnRzID0gXztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi9ET01XcmFwcGVyJyApO1xudmFyIHR5cGUgICAgICAgPSByZXF1aXJlKCAnLi90eXBlJyApO1xudmFyIGtleXMgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5mdW5jdGlvbiBhY2Nlc3MgKCBvYmosIGtleSwgdmFsLCBmbiwgX25vQ2hlY2sgKSB7XG4gIHZhciBjaGFpbmFibGUgPSBfbm9DaGVjayB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbiAgdmFyIGJ1bGsgPSBrZXkgPT09IG51bGwgfHwga2V5ID09PSAndW5kZWZpbmVkJztcbiAgdmFyIGxlbiA9IG9iai5sZW5ndGg7XG4gIHZhciByYXcgPSBmYWxzZTtcbiAgdmFyIGU7XG4gIHZhciBrO1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgaWYgKCAhIF9ub0NoZWNrICYmIHR5cGUoIGtleSApID09PSAnb2JqZWN0JyApIHtcbiAgICBmb3IgKCBpID0gMCwgayA9IGtleXMoIGtleSApLCBsID0gay5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICBhY2Nlc3MoIG9iaiwga1sgaSBdLCBrZXlbIGtbIGkgXSBdLCBmbiwgdHJ1ZSApO1xuICAgIH1cblxuICAgIGNoYWluYWJsZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggdHlwZW9mIHZhbCAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJhdyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCBidWxrICkge1xuICAgICAgaWYgKCByYXcgKSB7XG4gICAgICAgIGZuLmNhbGwoIG9iaiwgdmFsICk7XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1bGsgPSBmbjtcblxuICAgICAgICBmbiA9IGZ1bmN0aW9uICggZSwga2V5LCB2YWwgKSB7XG4gICAgICAgICAgcmV0dXJuIGJ1bGsuY2FsbCggbmV3IERPTVdyYXBwZXIoIGUgKSwgdmFsICk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCBmbiApIHtcbiAgICAgIGZvciAoIGkgPSAwOyBpIDwgbGVuOyArK2kgKSB7XG4gICAgICAgIGUgPSBvYmpbIGkgXTtcblxuICAgICAgICBpZiAoIHJhdyApIHtcbiAgICAgICAgICBmbiggZSwga2V5LCB2YWwsIHRydWUgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmbiggZSwga2V5LCB2YWwuY2FsbCggZSwgaSwgZm4oIGUsIGtleSApICksIHRydWUgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNoYWluYWJsZSA9IHRydWU7XG4gIH1cblxuICBpZiAoIGNoYWluYWJsZSApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgaWYgKCBidWxrICkge1xuICAgIHJldHVybiBmbi5jYWxsKCBvYmogKTtcbiAgfVxuXG4gIGlmICggbGVuICkge1xuICAgIHJldHVybiBmbiggb2JqWyAwIF0sIGtleSApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWNjZXNzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoZWFkZXJzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGltZW91dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGhvZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogQSByZXF1ZXN0IGhlYWRlcnMuXG4gICAqL1xuICBoZWFkZXJzOiB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnXG4gIH0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBmb3IgY2FuY2VsIGEgcmVxdWVzdC5cbiAgICovXG4gIHRpbWVvdXQ6IDEwMDAgKiA2MCxcblxuICAvKipcbiAgICogQSByZXF1ZXN0IG1ldGhvZDogJ0dFVCcsICdQT1NUJyAob3RoZXJzIGFyZSBpZ25vcmVkLCBpbnN0ZWFkLCAnR0VUJyB3aWxsIGJlIHVzZWQpLlxuICAgKi9cbiAgbWV0aG9kOiAnR0VUJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKCB0eXBlb2YgcXMgPT09ICd1bmRlZmluZWQnICkge1xuICB2YXIgcXM7XG5cbiAgdHJ5IHtcbiAgICBxcyA9IHJlcXVpcmUoICdxcycgKTtcbiAgfSBjYXRjaCAoIGVycm9yICkge31cbn1cblxudmFyIF9vcHRpb25zID0gcmVxdWlyZSggJy4vYWpheC1vcHRpb25zJyApO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSggJy4vZGVmYXVsdHMnICk7XG52YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcm9zcy1icm93c2VyIFhNTEh0dHBSZXF1ZXN0OiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjU1NzI2OFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSFRUUFJlcXVlc3QgKCkge1xuICB2YXIgSFRUUEZhY3RvcmllczsgdmFyIGk7XG5cbiAgSFRUUEZhY3RvcmllcyA9IFtcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMy5YTUxIVFRQJyApO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNc3htbDIuWE1MSFRUUC42LjAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMi5YTUxIVFRQLjMuMCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwyLlhNTEhUVFAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01pY3Jvc29mdC5YTUxIVFRQJyApO1xuICAgIH1cbiAgXTtcblxuICBmb3IgKCBpID0gMDsgaSA8IEhUVFBGYWN0b3JpZXMubGVuZ3RoOyArK2kgKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoIGNyZWF0ZUhUVFBSZXF1ZXN0ID0gSFRUUEZhY3Rvcmllc1sgaSBdICkoKTtcbiAgICB9IGNhdGNoICggZXggKSB7fVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoICdjYW5ub3QgY3JlYXRlIFhNTEh0dHBSZXF1ZXN0IG9iamVjdCcgKTtcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLmFqYXhcbiAqIEBwYXJhbSAge3N0cmluZ3xvYmplY3R9IHBhdGggICAgICAgICAgICAgIEEgVVJMIG9yIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICBbb3B0aW9uc10gICAgICAgICBBbiBvcHRpb25zLlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgW29wdGlvbnMucGF0aF0gICAgQSBVUkwuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICBbb3B0aW9ucy5tZXRob2RdICBBIHJlcXVlc3QgbWV0aG9kLiBJZiBubyBwcmVzZW50IEdFVCBvciBQT1NUIHdpbGwgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQuXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICAgICBbb3B0aW9ucy5hc3luY10gICBEZWZhdWx0IHRvIGB0cnVlYCB3aGVuIG9wdGlvbnMgc3BlY2lmaWVkLCBvciBgZmFsc2VgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG5vIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICBbb3B0aW9ucy5zdWNjZXNzXSBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgc2VydmVyIHJlc3BvbmQgd2l0aCAyeHggc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLlxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgW29wdGlvbnMuZXJyb3JdICAgV2lsbCBiZSBjYWxsZWQgd2hlbiBhIHNlcnZlciByZXNwb25kIHdpdGggb3RoZXIgc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlIG9yIGFuIGVycm9yIG9jY3VycyB3aGlsZSBwYXJzaW5nIHJlc3BvbnNlLlxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgICAgICAgICAgUmV0dXJucyBhIHJlc3BvbnNlIGRhdGEgaWYgYSByZXF1ZXN0IHdhcyBzeW5jaHJvbm91c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcndpc2UgYG51bGxgLlxuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0PC9jYXB0aW9uPlxuICogdmFyIGRhdGEgPSBhamF4KCcuL2RhdGEuanNvbicpO1xuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0LCB3aXRoIGNhbGxiYWNrczwvY2FwdGlvbj5cbiAqIHZhciBkYXRhID0gYWpheCgnLi9kYXRhLmpzb24nLCB7XG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGFzeW5jOiAgIGZhbHNlXG4gKiB9KTtcbiAqXG4gKiBmdW5jdGlvbiBzdWNjZXNzKHNhbWVEYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKHNhbWVEYXRhKTtcbiAqIH1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPkFzeW5jaHJvbm91cyBQT1NUIHJlcXVlc3Q8L2NhcHRpb24+XG4gKiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gKiAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSB8fCB0aGlzLnN0YXR1cyArICc6ICcgKyB0aGlzLnN0YXR1c1RleHQpO1xuICogfVxuICpcbiAqIHZhciBoZWFkZXJzID0ge1xuICogICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gKiB9O1xuICpcbiAqIHZhciBkYXRhID0ge1xuICogICB1c2VybmFtZTogZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnVzZXJuYW1lLnZhbHVlLFxuICogICBzZXg6ICAgICAgZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnNleC52YWx1ZVxuICogfVxuICpcbiAqIGFqYXgoJy9hcGkvc2lnbnVwLz9zdGVwPTAnLCB7XG4gKiAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGVycm9yOiAgIGVycm9yLFxuICogICBkYXRhOiAgICBkYXRhXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gYWpheCAoIHBhdGgsIG9wdGlvbnMgKSB7XG4gIHZhciB0aW1lb3V0SWQgPSBudWxsO1xuICB2YXIgZGF0YSA9IG51bGw7XG4gIHZhciB4aHIgPSBjcmVhdGVIVFRQUmVxdWVzdCgpO1xuICB2YXIgcmVxQ29udGVudFR5cGU7XG4gIHZhciBtZXRob2Q7XG4gIHZhciBhc3luYztcbiAgdmFyIG5hbWU7XG5cbiAgLy8gXy5hamF4KCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIGlmICggdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnICkge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0cyggX29wdGlvbnMsIHBhdGggKTtcbiAgICBhc3luYyA9ICEgKCAnYXN5bmMnIGluIG9wdGlvbnMgKSB8fCBvcHRpb25zLmFzeW5jO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGg7XG5cbiAgLy8gXy5hamF4KCBwYXRoICk7XG4gIC8vIGFzeW5jID0gZmFsc2VcbiAgfSBlbHNlIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMgPT09IG51bGwgKSB7XG4gICAgb3B0aW9ucyA9IF9vcHRpb25zO1xuICAgIGFzeW5jID0gZmFsc2U7XG5cbiAgLy8gXy5hamF4KCBwYXRoLCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzKCBfb3B0aW9ucywgb3B0aW9ucyApO1xuICAgIGFzeW5jID0gISAoICdhc3luYycgaW4gb3B0aW9ucyApIHx8IG9wdGlvbnMuYXN5bmM7XG4gIH1cblxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXNDb250ZW50VHlwZTtcbiAgICB2YXIgc3RhdHVzO1xuICAgIHZhciBvYmplY3Q7XG4gICAgdmFyIGVycm9yO1xuXG4gICAgaWYgKCB0aGlzLnJlYWR5U3RhdGUgIT09IDQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3RhdHVzID0gdGhpcy5zdGF0dXMgPT09IDEyMjMgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZXJuYXJ5XG4gICAgICA/IDIwNFxuICAgICAgOiB0aGlzLnN0YXR1cztcblxuICAgIHJlc0NvbnRlbnRUeXBlID0gdGhpcy5nZXRSZXNwb25zZUhlYWRlciggJ2NvbnRlbnQtdHlwZScgKTtcblxuICAgIG9iamVjdCA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgcGF0aDogcGF0aFxuICAgIH07XG5cbiAgICBkYXRhID0gdGhpcy5yZXNwb25zZVRleHQ7XG5cbiAgICBpZiAoIHJlc0NvbnRlbnRUeXBlICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCAhIHJlc0NvbnRlbnRUeXBlLmluZGV4T2YoICdhcHBsaWNhdGlvbi9qc29uJyApICkge1xuICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgICAgIH0gZWxzZSBpZiAoICEgcmVzQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgKSApIHtcbiAgICAgICAgICBkYXRhID0gcXMucGFyc2UoIGRhdGEgKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIF9lcnJvciApIHtcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggISBlcnJvciAmJiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCApIHtcbiAgICAgIGlmICggdGltZW91dElkICE9PSBudWxsICkge1xuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJZCApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9wdGlvbnMuc3VjY2VzcyApIHtcbiAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmNhbGwoIHRoaXMsIGRhdGEsIG9iamVjdCApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIG9wdGlvbnMuZXJyb3IgKSB7XG4gICAgICBvcHRpb25zLmVycm9yLmNhbGwoIHRoaXMsIGRhdGEsIG9iamVjdCApO1xuICAgIH1cbiAgfTtcblxuICBtZXRob2QgPSBvcHRpb25zLm1ldGhvZDtcblxuICBpZiAoIHR5cGVvZiBtZXRob2QgPT09ICd1bmRlZmluZWQnICkge1xuICAgIG1ldGhvZCA9ICdkYXRhJyBpbiBvcHRpb25zIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICAgICAgPyAnUE9TVCdcbiAgICAgIDogJ0dFVCc7XG4gIH1cblxuICB4aHIub3BlbiggbWV0aG9kLCBwYXRoLCBhc3luYyApO1xuXG4gIGlmICggb3B0aW9ucy5oZWFkZXJzICkge1xuICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucy5oZWFkZXJzICkge1xuICAgICAgaWYgKCAhIGhhc093blByb3BlcnR5LmNhbGwoIG9wdGlvbnMuaGVhZGVycywgbmFtZSApICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnICkge1xuICAgICAgICByZXFDb250ZW50VHlwZSA9IG9wdGlvbnMuaGVhZGVyc1sgbmFtZSBdO1xuICAgICAgfVxuXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggbmFtZSwgb3B0aW9ucy5oZWFkZXJzWyBuYW1lIF0gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGFzeW5jICYmIHR5cGVvZiBvcHRpb25zLnRpbWVvdXQgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMudGltZW91dCAhPT0gbnVsbCApIHtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICB4aHIuYWJvcnQoKTtcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQgKTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHJlcUNvbnRlbnRUeXBlICE9PSAndW5kZWZpbmVkJyAmJiByZXFDb250ZW50VHlwZSAhPT0gbnVsbCAmJiAnZGF0YScgaW4gb3B0aW9ucyApIHtcbiAgICBpZiAoICEgcmVxQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL2pzb24nICkgKSB7XG4gICAgICB4aHIuc2VuZCggSlNPTi5zdHJpbmdpZnkoIG9wdGlvbnMuZGF0YSApICk7XG4gICAgfSBlbHNlIGlmICggISByZXFDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyApICkge1xuICAgICAgeGhyLnNlbmQoIHFzLnN0cmluZ2lmeSggb3B0aW9ucy5kYXRhICkgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLnNlbmQoIG9wdGlvbnMuZGF0YSApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWFzc2lnbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1hc3NpZ24nICkoIHJlcXVpcmUoICcuL2tleXMnICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlQXNzaWduICggb2JqLCBzcmMsIGsgKSB7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGsubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIG9ialsga1sgaSBdIF0gPSBzcmNbIGtbIGkgXSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUNsb25lQXJyYXkgKCBpdGVyYWJsZSApIHtcbiAgdmFyIGkgPSBpdGVyYWJsZS5sZW5ndGg7XG4gIHZhciBjbG9uZSA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICBpZiAoIGlzc2V0KCBpLCBpdGVyYWJsZSApICkge1xuICAgICAgY2xvbmVbIGkgXSA9IGl0ZXJhYmxlWyBpIF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNsb25lO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHRhcmdldCwgc291cmNlICkge1xuICBmb3IgKCB2YXIgaSA9IHNvdXJjZS5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICB0YXJnZXRbIGkgXSA9IHNvdXJjZVsgaSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbnZhciBkZWZpbmVHZXR0ZXIgPSBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG52YXIgZGVmaW5lU2V0dGVyID0gT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZVNldHRlcl9fO1xuXG5mdW5jdGlvbiBiYXNlRGVmaW5lUHJvcGVydHkgKCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApIHtcbiAgdmFyIGhhc0dldHRlciA9IGlzc2V0KCAnZ2V0JywgZGVzY3JpcHRvciApO1xuICB2YXIgaGFzU2V0dGVyID0gaXNzZXQoICdzZXQnLCBkZXNjcmlwdG9yICk7XG4gIHZhciBnZXQ7XG4gIHZhciBzZXQ7XG5cbiAgaWYgKCBoYXNHZXR0ZXIgfHwgaGFzU2V0dGVyICkge1xuICAgIGlmICggaGFzR2V0dGVyICYmIHR5cGVvZiggZ2V0ID0gZGVzY3JpcHRvci5nZXQgKSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ0dldHRlciBtdXN0IGJlIGEgZnVuY3Rpb246ICcgKyBnZXQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGhhc1NldHRlciAmJiB0eXBlb2YoIHNldCA9IGRlc2NyaXB0b3Iuc2V0ICkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uOiAnICsgc2V0ICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggJ3dyaXRhYmxlJywgZGVzY3JpcHRvciApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnSW52YWxpZCBwcm9wZXJ0eSBkZXNjcmlwdG9yLiBDYW5ub3QgYm90aCBzcGVjaWZ5IGFjY2Vzc29ycyBhbmQgYSB2YWx1ZSBvciB3cml0YWJsZSBhdHRyaWJ1dGUnICk7XG4gICAgfVxuXG4gICAgaWYgKCBkZWZpbmVHZXR0ZXIgKSB7XG4gICAgICBpZiAoIGhhc0dldHRlciApIHtcbiAgICAgICAgZGVmaW5lR2V0dGVyLmNhbGwoIG9iamVjdCwga2V5LCBnZXQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBoYXNTZXR0ZXIgKSB7XG4gICAgICAgIGRlZmluZVNldHRlci5jYWxsKCBvYmplY3QsIGtleSwgc2V0ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKCAnQ2Fubm90IGRlZmluZSBhIGdldHRlciBvciBzZXR0ZXInICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc3NldCggJ3ZhbHVlJywgZGVzY3JpcHRvciApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICB9IGVsc2UgaWYgKCAhIGlzc2V0KCBrZXksIG9iamVjdCApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSB2b2lkIDA7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VEZWZpbmVQcm9wZXJ0eTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRXhlYyAoIHJlZ2V4cCwgc3RyaW5nICkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciB2YWx1ZTtcblxuICByZWdleHAubGFzdEluZGV4ID0gMDtcblxuICB3aGlsZSAoICggdmFsdWUgPSByZWdleHAuZXhlYyggc3RyaW5nICkgKSApIHtcbiAgICByZXN1bHQucHVzaCggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEl0ZXJhdGVlID0gcmVxdWlyZSggJy4uL2NhbGwtaXRlcmF0ZWUnICk7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VGb3JFYWNoICggYXJyLCBmbiwgY3R4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciBpO1xuICB2YXIgajtcblxuICBmb3IgKCBpID0gLTEsIGogPSBhcnIubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBpZHggPSBqO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZHggPSArK2k7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggaWR4LCBhcnIgKSAmJiBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIGFyclsgaWR4IF0sIGlkeCwgYXJyICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFycjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRm9ySW4gKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCwga2V5cyApIHtcbiAgdmFyIGtleTtcbiAgdmFyIGk7XG4gIHZhciBqO1xuXG4gIGZvciAoIGkgPSAtMSwgaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBrZXkgPSBrZXlzWyBqIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IGtleXNbICsraSBdO1xuICAgIH1cblxuICAgIGlmICggY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCBvYmpbIGtleSBdLCBrZXksIG9iaiApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUdldCAoIG9iaiwgcGF0aCwgb2ZmICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGggLSBvZmY7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlSGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGg7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB2YXIgYmFzZVRvSW5kZXggPSByZXF1aXJlKCAnLi9iYXNlLXRvLWluZGV4JyApO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIGJhc2VJbmRleE9mXG4gKiBAcGFyYW0gIHtvYmplY3R9ICBhcnJheVxuICogQHBhcmFtICB7YW55fSAgICAgdmFsdWVcbiAqIEBwYXJhbSAge251bWJlcj99IGZyb21JbmRleFxuICogQHBhcmFtICB7Ym9vbGVhbn0gZnJvbVJpZ2h0XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUluZGV4T2YgKCBhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgZnJvbVJpZ2h0ICkge1xuICAvLyBpZiAoIHR5cGVvZiBmcm9tSW5kZXggPT09ICd1bmRlZmluZWQnICkge1xuICAvLyAgIGZyb21JbmRleCA9IGZyb21SaWdodFxuICAvLyAgICAgPyBhcnJheS5sZW5ndGggLSAxXG4gIC8vICAgICA6IDA7XG4gIC8vIH0gZWxzZSB7XG4gIC8vICAgZnJvbUluZGV4ID0gYmFzZVRvSW5kZXgoIGZyb21JbmRleCwgYXJyYXkubGVuZ3RoICk7XG4gIC8vIH1cblxuICBpZiAoIHZhbHVlID09PSB2YWx1ZSApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGVybmFyeVxuICAgIHJldHVybiBmcm9tUmlnaHRcbiAgICAgID8gQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoIGFycmF5LCB2YWx1ZSApXG4gICAgICA6IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoIGFycmF5LCB2YWx1ZSApO1xuICB9XG5cbiAgZm9yICggdmFyIGwgPSBhcnJheS5sZW5ndGggLSAxLCBpID0gbDsgaSA+PSAwOyAtLWkgKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRlcm5hcnlcbiAgICB2YXIgaW5kZXggPSBmcm9tUmlnaHRcbiAgICAgID8gaVxuICAgICAgOiBsIC0gaTtcblxuICAgIGlmICggYXJyYXlbIGluZGV4IF0gPT09IHZhbHVlIHx8IHZhbHVlICE9PSB2YWx1ZSAmJiBhcnJheVsgaW5kZXggXSAhPT0gYXJyYXlbIGluZGV4IF0gKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldCA9IHJlcXVpcmUoICcuL2Jhc2UtZ2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VJbnZva2UgKCBvYmplY3QsIHBhdGgsIGFyZ3MgKSB7XG4gIGlmICggb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggcGF0aC5sZW5ndGggPD0gMSApIHtcbiAgICAgIHJldHVybiBvYmplY3RbIHBhdGhbIDAgXSBdLmFwcGx5KCBvYmplY3QsIGFyZ3MgKTtcbiAgICB9XG5cbiAgICBpZiAoICggb2JqZWN0ID0gZ2V0KCBvYmplY3QsIHBhdGgsIDEgKSApICkge1xuICAgICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgcGF0aC5sZW5ndGggLSAxIF0gXS5hcHBseSggb2JqZWN0LCBhcmdzICk7XG4gICAgfVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydCAgICAgPSByZXF1aXJlKCAnLi4vc3VwcG9ydC9zdXBwb3J0LWtleXMnICk7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuL2Jhc2UtaW5kZXgtb2YnICk7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmlmICggc3VwcG9ydCA9PT0gJ2hhcy1hLWJ1ZycgKSB7XG4gIHZhciBfa2V5cyA9IFtcbiAgICAndG9TdHJpbmcnLFxuICAgICd0b0xvY2FsZVN0cmluZycsXG4gICAgJ3ZhbHVlT2YnLFxuICAgICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICAgJ2NvbnN0cnVjdG9yJ1xuICBdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VLZXlzICggb2JqZWN0ICkge1xuICB2YXIga2V5cyA9IFtdO1xuICB2YXIga2V5O1xuICB2YXIgaTtcblxuICBmb3IgKCBrZXkgaW4gb2JqZWN0ICkge1xuICAgIGlmICggaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0LCBrZXkgKSApIHtcbiAgICAgIGtleXMucHVzaCgga2V5ICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCBzdXBwb3J0ID09PSAnaGFzLWEtYnVnJyApIHtcbiAgICBmb3IgKCBpID0gX2tleXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoIGJhc2VJbmRleE9mKCBrZXlzLCBfa2V5c1sgaSBdICkgPCAwICYmIGhhc093blByb3BlcnR5LmNhbGwoIG9iamVjdCwgX2tleXNbIGkgXSApICkge1xuICAgICAgICBrZXlzLnB1c2goIF9rZXlzWyBpIF0gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZXQgPSByZXF1aXJlKCAnLi9iYXNlLWdldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlUHJvcGVydHkgKCBvYmplY3QsIHBhdGggKSB7XG4gIGlmICggb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggcGF0aC5sZW5ndGggPiAxICkge1xuICAgICAgcmV0dXJuIGdldCggb2JqZWN0LCBwYXRoLCAwICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgMCBdIF07XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVJhbmRvbSAoIGxvd2VyLCB1cHBlciApIHtcbiAgcmV0dXJuIGxvd2VyICsgTWF0aC5yYW5kb20oKSAqICggdXBwZXIgLSBsb3dlciApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHByb3BzID0gcmVxdWlyZSggJy4uL3Byb3BzJyApO1xuXG5pZiAoIHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQtZ2V0LWF0dHJpYnV0ZScgKSApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfcmVtb3ZlQXR0ciAoIGVsZW1lbnQsIGtleSApIHtcbiAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgga2V5ICk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9yZW1vdmVBdHRyICggZWxlbWVudCwga2V5ICkge1xuICAgIGRlbGV0ZSBlbGVtZW50WyBwcm9wc1sga2V5IF0gfHwga2V5IF07XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlU2V0ICggb2JqLCBwYXRoLCB2YWwgKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGwgPSBwYXRoLmxlbmd0aDtcbiAgdmFyIGtleTtcblxuICBmb3IgKCA7IGkgPCBsOyArK2kgKSB7XG4gICAga2V5ID0gcGF0aFsgaSBdO1xuXG4gICAgaWYgKCBpID09PSBsIC0gMSApIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF0gPSB2YWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG4gICAgfSBlbHNlIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdID0ge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVZhbHVlcyAoIG9iamVjdCwga2V5cyApIHtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICB2YWx1ZXNbIGkgXSA9IG9iamVjdFsga2V5c1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL2ludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xudmFyIGRlZmF1bHRUbyA9IHJlcXVpcmUoICcuL2RlZmF1bHQtdG8nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVmb3JlICggbiwgZm4gKSB7XG4gIHZhciB2YWx1ZTtcblxuICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICB0aHJvdyBfQXJndW1lbnRFeGNlcHRpb24oIGZuLCAnYSBmdW5jdGlvbicgKTtcbiAgfVxuXG4gIG4gPSBkZWZhdWx0VG8oIG4sIDEgKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICggLS1uID49IDAgKSB7XG4gICAgICB2YWx1ZSA9IGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3Byb2Nlc3NBcmdzID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvcHJvY2Vzcy1hcmdzJyApO1xuXG52YXIgXyAgICAgICAgICAgID0gcmVxdWlyZSggJy4vcGxhY2Vob2xkZXInICk7XG4vLyBjb25zdGFudHMuUExBQ0VIT0xERVIgaXMgZm9yIGJhY2t3YXJkLWNvbXBhYmlsaXR5LlxudmFyIGNvbnN0YW50cyAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcblxuLyoqXG4gKiDQrdGC0LAg0YDQsNGB0YjQuNGA0LXQvdC90LDRjyDQstC10YDRgdC40Y8g0YHRgtCw0L3QtNCw0YDRgtC90L7Qs9C+IEVTNSBgRnVuY3Rpb24uYmluZGAsINCyINC60L7RgtC+0YDQvtC5INC10YHRgtGMINC/0L7QtNC00LXRgNC20LrQsCBwbGFjZWhvbGRlcmDQvtCyLlxuICogQG1ldGhvZCBfLmJpbmRcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmdW5jdGlvbl8gICDQnNC10YLQvtC0LCDQutC+0YLQvtGA0YvQuSDQvdCw0LTQviDQv9GA0LjQstGP0LfQsNGC0Ywg0Log0LrQvtC90YLQtdC60YHRgtGDICjQvdC+0LLRi9C5IHRoaXMpLlxuICogQHBhcmFtICB7YW55fSAgICAgIHRoaXNBcmcgICAgINCa0L7QvdGC0LXQutGB0YIgKNC90L7QstGL0LkgdGhpcyDQtNC70Y8g0LzQtdGC0L7QtNCwKS5cbiAqIEBwYXJhbSAgey4uLmFueX0gICBwYXJ0aWFsQXJncyDQp9Cw0YHRgtC40YfQvdGL0LUg0LDRgNCz0YPQvNC10L3RgtGLINGBIHtAbGluayBfLnBsYWNlaG9sZGVyfS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAgICAgICAgICAgICDQndC+0LLRi9C5LCDQv9GA0LjQstGP0LfQsNC90L3Ri9C5INC6INC90L7QstC+0LzRgyB0aGlzINC80LXRgtC+0LQuXG4gKiBAZXhhbXBsZVxuICogdmFyIGJvdW5kID0gXy5iaW5kKCBmdW5jdGlvbl8sIG5ld1RoaXMsIF8uXywgJyEnICk7XG4gKi9cbmZ1bmN0aW9uIGJpbmQgKCBmdW5jdGlvbl8sIHRoaXNBcmcgKSB7XG4gIGlmICggdHlwZW9mIGZ1bmN0aW9uXyAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoICdpbiBfLmJpbmQoKSwgcHJvdmlkZWQgXCJmdW5jdGlvbl9cIiBpcyBub3QgYSBmdW5jdGlvbiAoJyArIHR5cGVvZiBmdW5jdGlvbl8gKyAnKScgKTtcbiAgfVxuXG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgYXJnc0xlbiA9IGFyZ3MubGVuZ3RoO1xuXG4gIC8vIElmIG5vIHBhcnRpYWxBcmdzIHdlcmUgcHJvdmlkZWQgbWFrZSBhIHRpbnkgb3B0aW1pemF0aW9uIHVzaW5nIGJ1aWx0LWluXG4gIC8vIGBGdW5jdGlvbi5iaW5kYC5cbiAgaWYgKCBhcmdzTGVuIDw9IDIgKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwoIGZ1bmN0aW9uXywgdGhpc0FyZyApO1xuICB9XG5cbiAgLy8gU2tpcCBmdW5jdGlvbl8gYW5kIHRoaXNBcmcuXG4gIHZhciBpID0gMjtcblxuICAvLyBTZWFyY2ggZm9yIHBsYWNlaG9sZGVycyBpbiB0aGUgYXJndW1lbnRzLlxuICBmb3IgKCA7IGkgPCBhcmdzTGVuOyArK2kgKSB7XG4gICAgaWYgKCBhcmdzWyBpIF0gPT09IF8gfHwgYXJnc1sgaSBdID09PSBjb25zdGFudHMuUExBQ0VIT0xERVIgKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBJZiBubyBwbGFjZWhvbGRlcnMgaW4gdGhlIHBhcnRpYWxBcmdzIHdlcmUgcHJvdmlkZWQgbWFrZSBhIHRpbnlcbiAgLy8gb3B0aW1pemF0aW9uIHVzaW5nIGJ1aWx0LWluIGBGdW5jdGlvbi5iaW5kYC5cbiAgaWYgKCBpID09PSBhcmdzTGVuICkge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbC5hcHBseSggRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQsIGFyZ3MgKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBib3VuZCAoKSB7XG4gICAgLy8gQ2FsbCBhIGZ1bmN0aW9uIHdpdGggbmV3IHRoaXMgKHRoaXNBcmcpIGFuZCBwcm9jZXNzZWQgYXJndW1lbnRzLlxuICAgIHJldHVybiBmdW5jdGlvbl8uYXBwbHkoIHRoaXNBcmcsIF9wcm9jZXNzQXJncyggYXJncywgYXJndW1lbnRzICkgKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbGxJdGVyYXRlZSAoIGZuLCBjdHgsIHZhbCwga2V5LCBvYmogKSB7XG4gIGlmICggdHlwZW9mIGN0eCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZuKCB2YWwsIGtleSwgb2JqICk7XG4gIH1cblxuICByZXR1cm4gZm4uY2FsbCggY3R4LCB2YWwsIGtleSwgb2JqICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXBwZXJGaXJzdCA9IHJlcXVpcmUoICcuL3VwcGVyLWZpcnN0JyApO1xuXG4vLyBjYW1lbGl6ZSggJ2JhY2tncm91bmQtcmVwZWF0LXgnICk7IC8vIC0+ICdiYWNrZ3JvdW5kUmVwZWF0WCdcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYW1lbGl6ZSAoIHN0cmluZyApIHtcbiAgdmFyIHdvcmRzID0gc3RyaW5nLm1hdGNoKCAvWzAtOWEtel0rL2dpICk7XG4gIHZhciByZXN1bHQ7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoICEgd29yZHMgKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmVzdWx0ID0gd29yZHNbIDAgXS50b0xvd2VyQ2FzZSgpO1xuXG4gIGZvciAoIGkgPSAxLCBsID0gd29yZHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIHJlc3VsdCArPSB1cHBlckZpcnN0KCB3b3Jkc1sgaSBdICk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF91bmVzY2FwZSA9IHJlcXVpcmUoICcuL2ludGVybmFsL3VuZXNjYXBlJyApO1xudmFyIF90eXBlICAgICA9IHJlcXVpcmUoICcuL2ludGVybmFsL3R5cGUnICk7XG5cbnZhciBiYXNlRXhlYyAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtZXhlYycgKTtcblxudmFyIGlzS2V5ICAgICA9IHJlcXVpcmUoICcuL2lzLWtleScgKTtcbnZhciB0b0tleSAgICAgPSByZXF1aXJlKCAnLi90by1rZXknICk7XG5cbnZhciByUHJvcGVydHkgPSAvKF58XFwuKVxccyooW19hLXpdXFx3KilcXHMqfFxcW1xccyooKD86LSk/KD86XFxkK3xcXGQqXFwuXFxkKyl8KFwifCcpKChbXlxcXFxdXFxcXChcXFxcXFxcXCkqfFteXFw0XSkqKVxcNClcXHMqXFxdL2dpO1xuXG5mdW5jdGlvbiBzdHJpbmdUb1BhdGggKCBzdHIgKSB7XG4gIHZhciBwYXRoID0gYmFzZUV4ZWMoIHJQcm9wZXJ0eSwgc3RyICk7XG4gIHZhciBpID0gcGF0aC5sZW5ndGggLSAxO1xuICB2YXIgdmFsO1xuXG4gIGZvciAoIDsgaSA+PSAwOyAtLWkgKSB7XG4gICAgdmFsID0gcGF0aFsgaSBdO1xuXG4gICAgLy8gLm5hbWVcbiAgICBpZiAoIHZhbFsgMiBdICkge1xuICAgICAgcGF0aFsgaSBdID0gdmFsWyAyIF07XG4gICAgLy8gWyBcIlwiIF0gfHwgWyAnJyBdXG4gICAgfSBlbHNlIGlmICggdHlwZW9mIHZhbFsgNSBdID09PSAnc3RyaW5nJyApIHtcbiAgICAgIHBhdGhbIGkgXSA9IF91bmVzY2FwZSggdmFsWyA1IF0gKTtcbiAgICAvLyBbIDAgXVxuICAgIH0gZWxzZSB7XG4gICAgICBwYXRoWyBpIF0gPSB2YWxbIDMgXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gY2FzdFBhdGggKCB2YWwgKSB7XG4gIHZhciBwYXRoO1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgaWYgKCBpc0tleSggdmFsICkgKSB7XG4gICAgcmV0dXJuIFsgdG9LZXkoIHZhbCApIF07XG4gIH1cblxuICBpZiAoIF90eXBlKCB2YWwgKSA9PT0gJ2FycmF5JyApIHtcbiAgICBwYXRoID0gQXJyYXkoIGwgPSB2YWwubGVuZ3RoICk7XG5cbiAgICBmb3IgKCBpID0gbCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgcGF0aFsgaSBdID0gdG9LZXkoIHZhbFsgaSBdICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBhdGggPSBzdHJpbmdUb1BhdGgoICcnICsgdmFsICk7XG4gIH1cblxuICByZXR1cm4gcGF0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0UGF0aDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbGFtcCAoIHZhbHVlLCBsb3dlciwgdXBwZXIgKSB7XG4gIGlmICggdmFsdWUgPj0gdXBwZXIgKSB7XG4gICAgcmV0dXJuIHVwcGVyO1xuICB9XG5cbiAgaWYgKCB2YWx1ZSA8PSBsb3dlciApIHtcbiAgICByZXR1cm4gbG93ZXI7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCAnLi9nZXQtcHJvdG90eXBlLW9mJyApO1xudmFyIGlzT2JqZWN0TGlrZSAgID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgdG9PYmplY3QgICAgICAgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCAnLi9jcmVhdGUnICk7XG52YXIgZWFjaCAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsb25lICggZGVlcCwgdGFyZ2V0LCBndWFyZCApIHtcbiAgdmFyIGNsbjtcblxuICBpZiAoIHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnIHx8IGd1YXJkICkge1xuICAgIHRhcmdldCA9IGRlZXA7XG4gICAgZGVlcCA9IHRydWU7XG4gIH1cblxuICBjbG4gPSBjcmVhdGUoIGdldFByb3RvdHlwZU9mKCB0YXJnZXQgPSB0b09iamVjdCggdGFyZ2V0ICkgKSApO1xuXG4gIGVhY2goIHRhcmdldCwgZnVuY3Rpb24gKCB2YWx1ZSwga2V5LCB0YXJnZXQgKSB7XG4gICAgaWYgKCB2YWx1ZSA9PT0gdGFyZ2V0ICkge1xuICAgICAgdGhpc1sga2V5IF0gPSB0aGlzO1xuICAgIH0gZWxzZSBpZiAoIGRlZXAgJiYgaXNPYmplY3RMaWtlKCB2YWx1ZSApICkge1xuICAgICAgdGhpc1sga2V5IF0gPSBjbG9uZSggZGVlcCwgdmFsdWUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc1sga2V5IF0gPSB2YWx1ZTtcbiAgICB9XG4gIH0sIGNsbiApO1xuXG4gIHJldHVybiBjbG47XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xvc2VzdCA9IHJlcXVpcmUoICcuL2Nsb3Nlc3QnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvc2VzdE5vZGUgKCBlLCBjICkge1xuICBpZiAoIHR5cGVvZiBjID09PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gY2xvc2VzdC5jYWxsKCBlLCBjICk7XG4gIH1cblxuICBkbyB7XG4gICAgaWYgKCBlID09PSBjICkge1xuICAgICAgcmV0dXJuIGU7XG4gICAgfVxuICB9IHdoaWxlICggKCBlID0gZS5wYXJlbnROb2RlICkgKTtcblxuICByZXR1cm4gbnVsbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtYXRjaGVzID0gcmVxdWlyZSggJy4vbWF0Y2hlcy1zZWxlY3RvcicgKTtcblxudmFyIGNsb3Nlc3Q7XG5cbmlmICggdHlwZW9mIEVsZW1lbnQgPT09ICd1bmRlZmluZWQnIHx8ICEgKCBjbG9zZXN0ID0gRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCApICkge1xuICBjbG9zZXN0ID0gZnVuY3Rpb24gY2xvc2VzdCAoIHNlbGVjdG9yICkge1xuICAgIHZhciBlbGVtZW50ID0gdGhpcztcblxuICAgIGRvIHtcbiAgICAgIGlmICggbWF0Y2hlcy5jYWxsKCBlbGVtZW50LCBzZWxlY3RvciApICkge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9IHdoaWxlICggKCBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50ICkgKTtcblxuICAgIHJldHVybiBudWxsO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb3Nlc3Q7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG91bmQgKCBmdW5jdGlvbnMgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjb21wb3VuZGVkICgpIHtcbiAgICB2YXIgdmFsdWU7XG4gICAgdmFyIGk7XG4gICAgdmFyIGw7XG5cbiAgICBmb3IgKCBpID0gMCwgbCA9IGZ1bmN0aW9ucy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICB2YWx1ZSA9IGZ1bmN0aW9uc1sgaSBdLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRVJSOiB7XG4gICAgSU5WQUxJRF9BUkdTOiAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudHMnLFxuICAgIEZVTkNUSU9OX0VYUEVDVEVEOiAgICAgJ0V4cGVjdGVkIGEgZnVuY3Rpb24nLFxuICAgIFNUUklOR19FWFBFQ1RFRDogICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nJyxcbiAgICBVTkRFRklORURfT1JfTlVMTDogICAgICdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnLFxuICAgIFJFRFVDRV9PRl9FTVBUWV9BUlJBWTogJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnLFxuICAgIE5PX1BBVEg6ICAgICAgICAgICAgICAgJ05vIHBhdGggd2FzIGdpdmVuJ1xuICB9LFxuXG4gIE1BWF9BUlJBWV9MRU5HVEg6IDQyOTQ5NjcyOTUsXG4gIE1BWF9TQUZFX0lOVDogICAgIDkwMDcxOTkyNTQ3NDA5OTEsXG4gIE1JTl9TQUZFX0lOVDogICAgLTkwMDcxOTkyNTQ3NDA5OTEsXG5cbiAgREVFUDogICAgICAgICAxLFxuICBERUVQX0tFRVBfRk46IDIsXG5cbiAgUExBQ0VIT0xERVI6IHt9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgY3JlYXRlO1xuXG52YXIgZGVmaW5lUHJvcGVydGllcyA9IHJlcXVpcmUoICcuL2RlZmluZS1wcm9wZXJ0aWVzJyApO1xudmFyIHNldFByb3RvdHlwZU9mICAgPSByZXF1aXJlKCAnLi9zZXQtcHJvdG90eXBlLW9mJyApO1xudmFyIGlzUHJpbWl0aXZlICAgICAgPSByZXF1aXJlKCAnLi9pcy1wcmltaXRpdmUnICk7XG5cbmZ1bmN0aW9uIEMgKCkge31cblxuZnVuY3Rpb24gY3JlYXRlICggcHJvdG90eXBlLCBkZXNjcmlwdG9ycyApIHtcbiAgdmFyIG9iamVjdDtcblxuICBpZiAoIHByb3RvdHlwZSAhPT0gbnVsbCAmJiBpc1ByaW1pdGl2ZSggcHJvdG90eXBlICkgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogJyArIHByb3RvdHlwZSApO1xuICB9XG5cbiAgQy5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG5cbiAgb2JqZWN0ID0gbmV3IEMoKTtcblxuICBDLnByb3RvdHlwZSA9IG51bGw7XG5cbiAgaWYgKCBwcm90b3R5cGUgPT09IG51bGwgKSB7XG4gICAgc2V0UHJvdG90eXBlT2YoIG9iamVjdCwgbnVsbCApO1xuICB9XG5cbiAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID49IDIgKSB7XG4gICAgZGVmaW5lUHJvcGVydGllcyggb2JqZWN0LCBkZXNjcmlwdG9ycyApO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlQXNzaWduID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1hc3NpZ24nICk7XG52YXIgRVJSICAgICAgICA9IHJlcXVpcmUoICcuLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbiAoIGtleXMgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBhc3NpZ24gKCBvYmogKSB7XG4gICAgdmFyIHNyYztcbiAgICB2YXIgbDtcbiAgICB2YXIgaTtcblxuICAgIGlmICggb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gMSwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICBzcmMgPSBhcmd1bWVudHNbIGkgXTtcblxuICAgICAgaWYgKCBzcmMgIT09IG51bGwgJiYgdHlwZW9mIHNyYyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIGJhc2VBc3NpZ24oIG9iaiwgc3JjLCBrZXlzKCBzcmMgKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUZvckVhY2ggID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItZWFjaCcgKTtcbnZhciBiYXNlRm9ySW4gICAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1pbicgKTtcbnZhciBpc0FycmF5TGlrZSAgPSByZXF1aXJlKCAnLi4vaXMtYXJyYXktbGlrZScgKTtcbnZhciB0b09iamVjdCAgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhdGVlICAgICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcbnZhciBrZXlzICAgICAgICAgPSByZXF1aXJlKCAnLi4va2V5cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFYWNoICggZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZWFjaCAoIG9iaiwgZm4sIGN0eCApIHtcblxuICAgIG9iaiA9IHRvT2JqZWN0KCBvYmogKTtcblxuICAgIGZuICA9IGl0ZXJhdGVlKCBmbiApO1xuXG4gICAgaWYgKCBpc0FycmF5TGlrZSggb2JqICkgKSB7XG4gICAgICByZXR1cm4gYmFzZUZvckVhY2goIG9iaiwgZm4sIGN0eCwgZnJvbVJpZ2h0ICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VGb3JJbiggb2JqLCBmbiwgY3R4LCBmcm9tUmlnaHQsIGtleXMoIG9iaiApICk7XG5cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXNjYXBlICggcmVnZXhwLCBtYXAgKSB7XG4gIGZ1bmN0aW9uIHJlcGxhY2VyICggYyApIHtcbiAgICByZXR1cm4gbWFwWyBjIF07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gZXNjYXBlICggc3RyaW5nICkge1xuICAgIGlmICggc3RyaW5nID09PSBudWxsIHx8IHR5cGVvZiBzdHJpbmcgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiAoIHN0cmluZyArPSAnJyApLnJlcGxhY2UoIHJlZ2V4cCwgcmVwbGFjZXIgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcbnZhciB0b09iamVjdCAgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhYmxlICAgICA9IHJlcXVpcmUoICcuLi9pdGVyYWJsZScgKTtcbnZhciBpdGVyYXRlZSAgICAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZpbmQgKCByZXR1cm5JbmRleCwgZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZmluZCAoIGFyciwgZm4sIGN0eCApIHtcbiAgICB2YXIgaiA9ICggYXJyID0gaXRlcmFibGUoIHRvT2JqZWN0KCBhcnIgKSApICkubGVuZ3RoIC0gMTtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHZhciBpZHg7XG4gICAgdmFyIHZhbDtcblxuICAgIGZuID0gaXRlcmF0ZWUoIGZuICk7XG5cbiAgICBmb3IgKCA7IGogPj0gMDsgLS1qICkge1xuICAgICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICAgIGlkeCA9IGo7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZHggPSArK2k7XG4gICAgICB9XG5cbiAgICAgIHZhbCA9IGFyclsgaWR4IF07XG5cbiAgICAgIGlmICggaXNzZXQoIGlkeCwgYXJyICkgJiYgY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCB2YWwsIGlkeCwgYXJyICkgKSB7XG4gICAgICAgIGlmICggcmV0dXJuSW5kZXggKSB7XG4gICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCByZXR1cm5JbmRleCApIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRmlyc3QgKCBuYW1lICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBzdHIgKSB7XG4gICAgaWYgKCBzdHIgPT09IG51bGwgfHwgdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICAgIH1cblxuICAgIHJldHVybiAoIHN0ciArPSAnJyApLmNoYXJBdCggMCApWyBuYW1lIF0oKSArIHN0ci5zbGljZSggMSApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VGb3JFYWNoID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItZWFjaCcgKTtcbnZhciB0b09iamVjdCAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmF0ZWUgICAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG52YXIgaXRlcmFibGUgICAgPSByZXF1aXJlKCAnLi4vaXRlcmFibGUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRm9yRWFjaCAoIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvckVhY2ggKCBhcnIsIGZuLCBjdHggKSB7XG4gICAgcmV0dXJuIGJhc2VGb3JFYWNoKCBpdGVyYWJsZSggdG9PYmplY3QoIGFyciApICksIGl0ZXJhdGVlKCBmbiApLCBjdHgsIGZyb21SaWdodCApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VGb3JJbiA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWluJyApO1xudmFyIHRvT2JqZWN0ICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmF0ZWUgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZvckluICgga2V5cywgZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9ySW4gKCBvYmosIGZuLCBjdHggKSB7XG4gICAgcmV0dXJuIGJhc2VGb3JJbiggb2JqID0gdG9PYmplY3QoIG9iaiApLCBpdGVyYXRlZSggZm4gKSwgY3R4LCBmcm9tUmlnaHQsIGtleXMoIG9iaiApICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE11c3QgYmUgJ1dpZHRoJyBvciAnSGVpZ2h0JyAoY2FwaXRhbGl6ZWQpLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUdldEVsZW1lbnREaW1lbnNpb24gKCBuYW1lICkge1xuICAvKipcbiAgICogQHBhcmFtIHtXaW5kb3d8Tm9kZX0gZVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uICggZSApIHtcbiAgICB2YXIgdjtcbiAgICB2YXIgYjtcbiAgICB2YXIgZDtcblxuICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgd2luZG93XG5cbiAgICBpZiAoIGUud2luZG93ID09PSBlICkge1xuXG4gICAgICAvLyBpbm5lcldpZHRoIGFuZCBpbm5lckhlaWdodCBpbmNsdWRlcyBhIHNjcm9sbGJhciB3aWR0aCwgYnV0IGl0IGlzIG5vdFxuICAgICAgLy8gc3VwcG9ydGVkIGJ5IG9sZGVyIGJyb3dzZXJzXG5cbiAgICAgIHYgPSBNYXRoLm1heCggZVsgJ2lubmVyJyArIG5hbWUgXSB8fCAwLCBlLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFsgJ2NsaWVudCcgKyBuYW1lIF0gKTtcblxuICAgIC8vIGlmIHRoZSBlbGVtZW50cyBpcyBhIGRvY3VtZW50XG5cbiAgICB9IGVsc2UgaWYgKCBlLm5vZGVUeXBlID09PSA5ICkge1xuXG4gICAgICBiID0gZS5ib2R5O1xuICAgICAgZCA9IGUuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICB2ID0gTWF0aC5tYXgoXG4gICAgICAgIGJbICdzY3JvbGwnICsgbmFtZSBdLFxuICAgICAgICBkWyAnc2Nyb2xsJyArIG5hbWUgXSxcbiAgICAgICAgYlsgJ29mZnNldCcgKyBuYW1lIF0sXG4gICAgICAgIGRbICdvZmZzZXQnICsgbmFtZSBdLFxuICAgICAgICBiWyAnY2xpZW50JyArIG5hbWUgXSxcbiAgICAgICAgZFsgJ2NsaWVudCcgKyBuYW1lIF0gKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB2ID0gZVsgJ2NsaWVudCcgKyBuYW1lIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHY7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWluZGV4LW9mJyApO1xuXG52YXIgdG9PYmplY3QgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIGNyZWF0ZUluZGV4T2ZcbiAqIEBwYXJhbSAge2Jvb2xlYW59ICBmcm9tUmlnaHRcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUluZGV4T2YgKCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpbmRleE9mICggYXJyYXksIHZhbHVlLCBmcm9tSW5kZXggKSB7XG4gICAgcmV0dXJuIGJhc2VJbmRleE9mKCB0b09iamVjdCggYXJyYXkgKSwgdmFsdWUsIGZyb21JbmRleCwgZnJvbVJpZ2h0ICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi4vY2FzdC1wYXRoJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVByb3BlcnR5T2YgKCBiYXNlUHJvcGVydHksIHVzZUFyZ3MgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIG9iamVjdCApIHtcbiAgICB2YXIgYXJncztcblxuICAgIGlmICggdXNlQXJncyApIHtcbiAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICggcGF0aCApIHtcbiAgICAgIGlmICggKCBwYXRoID0gY2FzdFBhdGgoIHBhdGggKSApLmxlbmd0aCApIHtcbiAgICAgICAgcmV0dXJuIGJhc2VQcm9wZXJ0eSggb2JqZWN0LCBwYXRoLCBhcmdzICk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuLi9jYXN0LXBhdGgnICk7XG52YXIgbm9vcCAgICAgPSByZXF1aXJlKCAnLi4vbm9vcCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQcm9wZXJ0eSAoIGJhc2VQcm9wZXJ0eSwgdXNlQXJncyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggcGF0aCApIHtcbiAgICB2YXIgYXJncztcblxuICAgIGlmICggISAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoICkge1xuICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuXG4gICAgaWYgKCB1c2VBcmdzICkge1xuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCBvYmplY3QgKSB7XG4gICAgICByZXR1cm4gYmFzZVByb3BlcnR5KCBvYmplY3QsIHBhdGgsIGFyZ3MgKTtcbiAgICB9O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF93b3JkcyA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC93b3JkcycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY3JlYXRlUmVtb3ZlUHJvcCAoIF9yZW1vdmVQcm9wICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBrZXlzICkge1xuICAgIHZhciBlbGVtZW50O1xuICAgIHZhciBpO1xuICAgIHZhciBqO1xuXG4gICAgaWYgKCB0eXBlb2Yga2V5cyA9PT0gJ3N0cmluZycgICkge1xuICAgICAga2V5cyA9IF93b3Jkcygga2V5cyApO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgaWYgKCAoIGVsZW1lbnQgPSB0aGlzWyBpIF0gKS5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGZvciAoIGogPSBrZXlzLmxlbmd0aCAtIDE7IGogPj0gMDsgLS1qICkge1xuICAgICAgICBfcmVtb3ZlUHJvcCggZWxlbWVudCwga2V5c1sgaiBdICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVHJpbSAoIHJlZ2V4cCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRyaW0gKCBzdHJpbmcgKSB7XG4gICAgaWYgKCBzdHJpbmcgPT09IG51bGwgfHwgdHlwZW9mIHN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICAgIH1cblxuICAgIHJldHVybiAoICcnICsgc3RyaW5nICkucmVwbGFjZSggcmVnZXhwLCAnJyApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL2ludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlICggbWF4V2FpdCwgZm4gKSB7XG4gIHZhciB0aW1lb3V0SWQgPSBudWxsO1xuXG4gIGlmICggdHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggZm4sICdhIGZ1bmN0aW9uJyApO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkICgpIHtcbiAgICBpZiAoIHRpbWVvdXRJZCAhPT0gbnVsbCApIHtcbiAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgfVxuXG4gICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoICkge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dC5hcHBseSggbnVsbCwgWyBmbiwgbWF4V2FpdCBdLmNvbmNhdCggW10uc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCBmbiwgbWF4V2FpdCApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XG4gICAgaWYgKCB0aW1lb3V0SWQgIT09IG51bGwgKSB7XG4gICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJZCApO1xuICAgICAgdGltZW91dElkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRlYm91bmNlZDogZGVib3VuY2VkLFxuICAgIGNhbmNlbDogICAgY2FuY2VsXG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmF1bHRUbyAoIHZhbHVlLCBkZWZhdWx0VmFsdWUgKSB7XG4gIGlmICggdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gdmFsdWUgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtaXhpbiA9IHJlcXVpcmUoICcuL21peGluJyApO1xuXG5mdW5jdGlvbiBkZWZhdWx0cyAoIGRlZmF1bHRzLCBvYmplY3QgKSB7XG4gIGlmICggb2JqZWN0ICkge1xuICAgIHJldHVybiBtaXhpbigge30sIGRlZmF1bHRzLCBvYmplY3QgKTtcbiAgfVxuXG4gIHJldHVybiBtaXhpbigge30sIGRlZmF1bHRzICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgYmFzZURlZmluZVByb3BlcnR5ID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWRlZmluZS1wcm9wZXJ0eScgKTtcblxudmFyIGlzUHJpbWl0aXZlICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnZhciBlYWNoICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoJyApO1xuXG52YXIgZGVmaW5lUHJvcGVydGllcztcblxuaWYgKCBzdXBwb3J0ICE9PSAnZnVsbCcgKSB7XG4gIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzICggb2JqZWN0LCBkZXNjcmlwdG9ycyApIHtcbiAgICBpZiAoIHN1cHBvcnQgIT09ICdub3Qtc3VwcG9ydGVkJyApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggb2JqZWN0LCBkZXNjcmlwdG9ycyApO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIG9iamVjdCApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnZGVmaW5lUHJvcGVydGllcyBjYWxsZWQgb24gbm9uLW9iamVjdCcgKTtcbiAgICB9XG5cbiAgICBpZiAoIGlzUHJpbWl0aXZlKCBkZXNjcmlwdG9ycyApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICcgKyBkZXNjcmlwdG9ycyApO1xuICAgIH1cblxuICAgIGVhY2goIGRlc2NyaXB0b3JzLCBmdW5jdGlvbiAoIGRlc2NyaXB0b3IsIGtleSApIHtcbiAgICAgIGlmICggaXNQcmltaXRpdmUoIGRlc2NyaXB0b3IgKSApIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICcgKyBkZXNjcmlwdG9yICk7XG4gICAgICB9XG5cbiAgICAgIGJhc2VEZWZpbmVQcm9wZXJ0eSggdGhpcywga2V5LCBkZXNjcmlwdG9yICk7XG4gICAgfSwgb2JqZWN0ICk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufSBlbHNlIHtcbiAgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnRpZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgYmFzZURlZmluZVByb3BlcnR5ID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWRlZmluZS1wcm9wZXJ0eScgKTtcblxudmFyIGlzUHJpbWl0aXZlICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcblxudmFyIGRlZmluZVByb3BlcnR5O1xuXG5pZiAoIHN1cHBvcnQgIT09ICdmdWxsJyApIHtcbiAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSAoIG9iamVjdCwga2V5LCBkZXNjcmlwdG9yICkge1xuICAgIGlmICggc3VwcG9ydCAhPT0gJ25vdC1zdXBwb3J0ZWQnICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqZWN0LCBrZXksIGRlc2NyaXB0b3IgKTtcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cbiAgICB9XG5cbiAgICBpZiAoIGlzUHJpbWl0aXZlKCBvYmplY3QgKSApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ2RlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0JyApO1xuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIGRlc2NyaXB0b3IgKSApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ1Byb3BlcnR5IGRlc2NyaXB0aW9uIG11c3QgYmUgYW4gb2JqZWN0OiAnICsgZGVzY3JpcHRvciApO1xuICAgIH1cblxuICAgIHJldHVybiBiYXNlRGVmaW5lUHJvcGVydHkoIG9iamVjdCwga2V5LCBkZXNjcmlwdG9yICk7XG4gIH07XG59IGVsc2Uge1xuICBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVhY2gnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVhY2gnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVzY2FwZScgKSggL1s8PlwiJyZdL2csIHtcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICBcIidcIjogJyYjMzk7JyxcbiAgJ1wiJzogJyYjMzQ7JyxcbiAgJyYnOiAnJmFtcDsnXG59ICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9zZXN0Tm9kZSA9IHJlcXVpcmUoICcuL2Nsb3Nlc3Qtbm9kZScgKTtcbnZhciBET01XcmFwcGVyICA9IHJlcXVpcmUoICcuL0RPTVdyYXBwZXInICk7XG52YXIgRXZlbnQgICAgICAgPSByZXF1aXJlKCAnLi9FdmVudCcgKTtcblxudmFyIGV2ZW50cyA9IHtcbiAgaXRlbXM6IHt9LFxuICB0eXBlczogW11cbn07XG5cbnZhciBzdXBwb3J0ID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmICdhZGRFdmVudExpc3RlbmVyJyBpbiBzZWxmO1xuXG4vKipcbiAqIEBtZXRob2QgcGVha28uZXZlbnQub25cbiAqIEBwYXJhbSAge05vZGV9ICAgICBlbGVtZW50XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgdHlwZVxuICogQHBhcmFtICB7c3RyaW5nP30gIHNlbGVjdG9yXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gbGlzdGVuZXJcbiAqIEBwYXJhbSAge2Jvb2xlYW59ICB1c2VDYXB0dXJlXG4gKiBAcGFyYW0gIHtib29sZWFufSAgW29uY2VdXG4gKiBAcmV0dXJuIHt2b2lkfVxuICogQGV4YW1wbGVcbiAqIF8uZXZlbnQub24oIGRvY3VtZW50LCAnY2xpY2snLCAnLnBvc3RfX2xpa2UtYnV0dG9uJywgKCBldmVudCApID0+IHtcbiAqICAgY29uc3QgZGF0YSA9IHtcbiAqICAgICBpZDogXyggdGhpcyApLnBhcmVudCggJy5wb3N0JyApLmRhdGEoICdpZCcgKVxuICogICB9XG4gKlxuICogICBfLmFqYXgoICcvbGlrZScsIHsgZGF0YSB9IClcbiAqIH0sIGZhbHNlIClcbiAqL1xuZXhwb3J0cy5vbiA9IGZ1bmN0aW9uIG9uICggZWxlbWVudCwgdHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlLCBvbmNlICkge1xuICB2YXIgaXRlbSA9IHtcbiAgICB1c2VDYXB0dXJlOiB1c2VDYXB0dXJlLFxuICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgIG9uY2U6IG9uY2VcbiAgfTtcblxuICBpZiAoIHNlbGVjdG9yICkge1xuICAgIGl0ZW0uc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgfVxuXG4gIGlmICggc3VwcG9ydCApIHtcbiAgICBpdGVtLndyYXBwZXIgPSBmdW5jdGlvbiB3cmFwcGVyICggZXZlbnQsIF9lbGVtZW50ICkge1xuICAgICAgaWYgKCBzZWxlY3RvciAmJiAhIF9lbGVtZW50ICYmICEgKCBfZWxlbWVudCA9IGNsb3Nlc3ROb2RlKCBldmVudC50YXJnZXQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9uY2UgKSB7XG4gICAgICAgIGV4cG9ydHMub2ZmKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKTtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXIuY2FsbCggX2VsZW1lbnQgfHwgZWxlbWVudCwgbmV3IEV2ZW50KCBldmVudCApICk7XG4gICAgfTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgaXRlbS53cmFwcGVyLCB1c2VDYXB0dXJlICk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICBpdGVtLndyYXBwZXIgPSBmdW5jdGlvbiB3cmFwcGVyICggZXZlbnQsIF9lbGVtZW50ICkge1xuICAgICAgaWYgKCBzZWxlY3RvciAmJiAhIF9lbGVtZW50ICYmICEgKCBfZWxlbWVudCA9IGNsb3Nlc3ROb2RlKCBldmVudC50YXJnZXQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIHR5cGUgPT09ICdET01Db250ZW50TG9hZGVkJyAmJiBlbGVtZW50LnJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCBvbmNlICkge1xuICAgICAgICBleHBvcnRzLm9mZiggZWxlbWVudCwgdHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICk7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVyLmNhbGwoIF9lbGVtZW50IHx8IGVsZW1lbnQsIG5ldyBFdmVudCggZXZlbnQsIHR5cGUgKSApO1xuICAgIH07XG5cbiAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCBpdGVtLklFVHlwZSA9IElFVHlwZSggdHlwZSApLCBpdGVtLndyYXBwZXIgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoICdub3QgaW1wbGVtZW50ZWQnICk7XG4gIH1cblxuICBpZiAoIGV2ZW50cy5pdGVtc1sgdHlwZSBdICkge1xuICAgIGV2ZW50cy5pdGVtc1sgdHlwZSBdLnB1c2goIGl0ZW0gKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHMuaXRlbXNbIHR5cGUgXSA9IFsgaXRlbSBdO1xuICAgIGV2ZW50cy5pdGVtc1sgdHlwZSBdLmluZGV4ID0gZXZlbnRzLnR5cGVzLmxlbmd0aDtcbiAgICBldmVudHMudHlwZXMucHVzaCggdHlwZSApO1xuICB9XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGVha28uZXZlbnQub2ZmXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgZWxlbWVudFxuICogQHBhcmFtICB7c3RyaW5nfSAgIHR5cGVcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzZWxlY3RvclxuICogQHBhcmFtICB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gKiBAcGFyYW0gIHtib29sZWFufSAgdXNlQ2FwdHVyZVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0cy5vZmYgPSBmdW5jdGlvbiBvZmYgKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG4gIHZhciBpdGVtcztcbiAgdmFyIGl0ZW07XG4gIHZhciBpO1xuXG4gIGlmICggdHlwZSA9PT0gbnVsbCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZm9yICggaSA9IGV2ZW50cy50eXBlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGV2ZW50Lm9mZiggZWxlbWVudCwgZXZlbnRzLnR5cGVzWyBpIF0sIHNlbGVjdG9yICk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCAhICggaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgXSApICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSBpdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBpdGVtID0gaXRlbXNbIGkgXTtcblxuICAgIGlmICggaXRlbS5lbGVtZW50ICE9PSBlbGVtZW50IHx8XG4gICAgICB0eXBlb2YgbGlzdGVuZXIgIT09ICd1bmRlZmluZWQnICYmIChcbiAgICAgICAgaXRlbS5saXN0ZW5lciAhPT0gbGlzdGVuZXIgfHxcbiAgICAgICAgaXRlbS51c2VDYXB0dXJlICE9PSB1c2VDYXB0dXJlIHx8XG4gICAgICAgIC8vIHRvZG86IGNoZWNrIGJvdGggaXRlbS5zZWxlY3RvciBhbmQgc2VsZWN0b3IgYW5kIHRoZW4gY29tcGFyZVxuICAgICAgICBpdGVtLnNlbGVjdG9yICYmIGl0ZW0uc2VsZWN0b3IgIT09IHNlbGVjdG9yICkgKVxuICAgIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBicmFjZS1zdHlsZVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaXRlbXMuc3BsaWNlKCBpLCAxICk7XG5cbiAgICBpZiAoICEgaXRlbXMubGVuZ3RoICkge1xuICAgICAgZXZlbnRzLnR5cGVzLnNwbGljZSggaXRlbXMuaW5kZXgsIDEgKTtcbiAgICAgIGV2ZW50cy5pdGVtc1sgdHlwZSBdID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIHN1cHBvcnQgKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGl0ZW0ud3JhcHBlciwgaXRlbS51c2VDYXB0dXJlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuZGV0YWNoRXZlbnQoIGl0ZW0uSUVUeXBlLCBpdGVtLndyYXBwZXIgKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMudHJpZ2dlciA9IGZ1bmN0aW9uIHRyaWdnZXIgKCBlbGVtZW50LCB0eXBlLCBkYXRhICkge1xuICB2YXIgaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgXTtcbiAgdmFyIGNsb3Nlc3Q7XG4gIHZhciBpdGVtO1xuICB2YXIgaTtcblxuICBpZiAoICEgaXRlbXMgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSApIHtcbiAgICBpdGVtID0gaXRlbXNbIGkgXTtcblxuICAgIGlmICggZWxlbWVudCApIHtcbiAgICAgIGNsb3Nlc3QgPSBjbG9zZXN0Tm9kZSggZWxlbWVudCwgaXRlbS5zZWxlY3RvciB8fCBpdGVtLmVsZW1lbnQgKTtcbiAgICB9IGVsc2UgaWYgKCBpdGVtLnNlbGVjdG9yICkge1xuICAgICAgbmV3IERPTVdyYXBwZXIoIGl0ZW0uc2VsZWN0b3IgKS5lYWNoKCAoIGZ1bmN0aW9uICggaXRlbSApIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpdGVtLndyYXBwZXIoIGNyZWF0ZUV2ZW50V2l0aFRhcmdldCggdHlwZSwgZGF0YSwgdGhpcyApLCB0aGlzICk7XG4gICAgICAgIH07XG4gICAgICB9ICkoIGl0ZW0gKSApO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xvc2VzdCA9IGl0ZW0uZWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAoIGNsb3Nlc3QgKSB7XG4gICAgICBpdGVtLndyYXBwZXIoIGNyZWF0ZUV2ZW50V2l0aFRhcmdldCggdHlwZSwgZGF0YSwgZWxlbWVudCB8fCBjbG9zZXN0ICksIGNsb3Nlc3QgKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMuY29weSA9IGZ1bmN0aW9uIGNvcHkgKCB0YXJnZXQsIHNvdXJjZSwgZGVlcCApIHtcbiAgdmFyIGl0ZW1zO1xuICB2YXIgaXRlbTtcbiAgdmFyIHR5cGU7XG4gIHZhciBpO1xuICB2YXIgajtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IGV2ZW50cy50eXBlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBpZiAoICggaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgPSBldmVudHMudHlwZXNbIGkgXSBdICkgKSB7XG4gICAgICBmb3IgKCBqID0gMCwgbCA9IGl0ZW1zLmxlbmd0aDsgaiA8IGw7ICsraiApIHtcbiAgICAgICAgaWYgKCAoIGl0ZW0gPSBpdGVtc1sgaiBdICkudGFyZ2V0ID09PSBzb3VyY2UgKSB7XG4gICAgICAgICAgZXZlbnQub24oIHRhcmdldCwgdHlwZSwgbnVsbCwgaXRlbS5saXN0ZW5lciwgaXRlbS51c2VDYXB0dXJlLCBpdGVtLm9uY2UgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICggISBkZWVwICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldCA9IHRhcmdldC5jaGlsZE5vZGVzO1xuICBzb3VyY2UgPSBzb3VyY2UuY2hpbGROb2RlcztcblxuICBmb3IgKCBpID0gdGFyZ2V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGV2ZW50LmNvcHkoIHRhcmdldFsgaSBdLCBzb3VyY2VbIGkgXSwgdHJ1ZSApO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFdpdGhUYXJnZXQgKCB0eXBlLCBkYXRhLCB0YXJnZXQgKSB7XG4gIHZhciBlID0gbmV3IEV2ZW50KCB0eXBlLCBkYXRhICk7XG4gIGUudGFyZ2V0ID0gdGFyZ2V0O1xuICByZXR1cm4gZTtcbn1cblxuZnVuY3Rpb24gSUVUeXBlICggdHlwZSApIHtcbiAgaWYgKCB0eXBlID09PSAnRE9NQ29udGVudExvYWRlZCcgKSB7XG4gICAgcmV0dXJuICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICB9XG5cbiAgcmV0dXJuICdvbicgKyB0eXBlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggdHJ1ZSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggZmFsc2UsIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpbmQnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1lYWNoJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItZWFjaCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzLWluJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMtaW4nICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1pbicgKSggcmVxdWlyZSggJy4va2V5cycgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcblxudmFyIHdyYXBwZXJzID0ge1xuICBjb2w6ICAgICAgWyAyLCAnPHRhYmxlPjxjb2xncm91cD4nLCAnPC9jb2xncm91cD48L3RhYmxlPicgXSxcbiAgdHI6ICAgICAgIFsgMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nIF0sXG4gIGRlZmF1bHRzOiBbIDAsICcnLCAnJyBdXG59O1xuXG5mdW5jdGlvbiBhcHBlbmQgKCBmcmFnbWVudCwgZWxlbWVudHMgKSB7XG4gIGZvciAoIHZhciBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggZWxlbWVudHNbIGkgXSApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZnJhZ21lbnQgKCBlbGVtZW50cywgY29udGV4dCApIHtcbiAgdmFyIGZyYWdtZW50ID0gY29udGV4dC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBlbGVtZW50O1xuICB2YXIgd3JhcHBlcjtcbiAgdmFyIHRhZztcbiAgdmFyIGRpdjtcbiAgdmFyIGk7XG4gIHZhciBqO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudHNbIGkgXTtcblxuICAgIGlmICggaXNPYmplY3RMaWtlKCBlbGVtZW50ICkgKSB7XG4gICAgICBpZiAoICdub2RlVHlwZScgaW4gZWxlbWVudCApIHtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGVsZW1lbnQgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGVuZCggZnJhZ21lbnQsIGVsZW1lbnQgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCAvPHwmIz9cXHcrOy8udGVzdCggZWxlbWVudCApICkge1xuICAgICAgaWYgKCAhIGRpdiApIHtcbiAgICAgICAgZGl2ID0gY29udGV4dC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgfVxuXG4gICAgICB0YWcgPSAvPChbYS16XVteXFxzPl0qKS9pLmV4ZWMoIGVsZW1lbnQgKTtcblxuICAgICAgaWYgKCB0YWcgKSB7XG4gICAgICAgIHdyYXBwZXIgPSB3cmFwcGVyc1sgdGFnID0gdGFnWyAxIF0gXSB8fCB3cmFwcGVyc1sgdGFnLnRvTG93ZXJDYXNlKCkgXSB8fCB3cmFwcGVycy5kZWZhdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyYXBwZXIgPSB3cmFwcGVycy5kZWZhdWx0cztcbiAgICAgIH1cblxuICAgICAgZGl2LmlubmVySFRNTCA9IHdyYXBwZXJbIDEgXSArIGVsZW1lbnQgKyB3cmFwcGVyWyAyIF07XG5cbiAgICAgIGZvciAoIGogPSB3cmFwcGVyWyAwIF07IGogPiAwOyAtLWogKSB7XG4gICAgICAgIGRpdiA9IGRpdi5sYXN0Q2hpbGQ7XG4gICAgICB9XG5cbiAgICAgIGFwcGVuZCggZnJhZ21lbnQsIGRpdi5jaGlsZE5vZGVzICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBjb250ZXh0LmNyZWF0ZVRleHROb2RlKCBlbGVtZW50ICkgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGRpdiApIHtcbiAgICBkaXYuaW5uZXJIVE1MID0gJyc7XG4gIH1cblxuICByZXR1cm4gZnJhZ21lbnQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZyb21QYWlycyAoIHBhaXJzICkge1xuICB2YXIgb2JqZWN0ID0ge307XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IHBhaXJzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBvYmplY3RbIHBhaXJzWyBpIF1bIDAgXSBdID0gcGFpcnNbIGkgXVsgMSBdO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1nZXQtZWxlbWVudC1kaW1lbnNpb24nICkoICdIZWlnaHQnICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1nZXQtZWxlbWVudC1kaW1lbnNpb24nICkoICdXaWR0aCcgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUiA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mICggb2JqICkge1xuICB2YXIgcHJvdG90eXBlO1xuXG4gIGlmICggb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICkge1xuICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gIH1cblxuICBwcm90b3R5cGUgPSBvYmouX19wcm90b19fOyAvLyBqc2hpbnQgaWdub3JlOiBsaW5lXG5cbiAgaWYgKCB0eXBlb2YgcHJvdG90eXBlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gcHJvdG90eXBlO1xuICB9XG5cbiAgaWYgKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIG9iai5jb25zdHJ1Y3RvciApID09PSAnW29iamVjdCBGdW5jdGlvbl0nICkge1xuICAgIHJldHVybiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBiYXNlR2V0ICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1nZXQnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldCAoIG9iamVjdCwgcGF0aCApIHtcbiAgdmFyIGxlbmd0aCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGxlbmd0aCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIGlmICggbGVuZ3RoID4gMSApIHtcbiAgICByZXR1cm4gYmFzZUdldCggdG9PYmplY3QoIG9iamVjdCApLCBwYXRoLCAwICk7XG4gIH1cblxuICByZXR1cm4gdG9PYmplY3QoIG9iamVjdCApWyBwYXRoWyAwIF0gXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBpc3NldCAgICA9IHJlcXVpcmUoICcuL2lzc2V0JyApO1xudmFyIGJhc2VIYXMgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWhhcycgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgbCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGwgKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGwgPiAxICkge1xuICAgIHJldHVybiBiYXNlSGFzKCB0b09iamVjdCggb2JqICksIHBhdGggKTtcbiAgfVxuXG4gIHJldHVybiBpc3NldCggdG9PYmplY3QoIG9iaiApLCBwYXRoWyAwIF0gKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaWRlbnRpdHkgKCB2ICkge1xuICByZXR1cm4gdjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1pbmRleC1vZicgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9Bcmd1bWVudEV4Y2VwdGlvbiAoIHVuZXhwZWN0ZWQsIGV4cGVjdGVkICkge1xuICByZXR1cm4gRXJyb3IoICdcIicgKyB0b1N0cmluZy5jYWxsKCB1bmV4cGVjdGVkICkgKyAnXCIgaXMgbm90ICcgKyBleHBlY3RlZCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiB0cnVlLFxuICBjb2x1bW5Db3VudDogdHJ1ZSxcbiAgZmlsbE9wYWNpdHk6IHRydWUsXG4gIGZsZXhTaHJpbms6IHRydWUsXG4gIGZvbnRXZWlnaHQ6IHRydWUsXG4gIGxpbmVIZWlnaHQ6IHRydWUsXG4gIGZsZXhHcm93OiB0cnVlLFxuICBvcGFjaXR5OiB0cnVlLFxuICBvcnBoYW5zOiB0cnVlLFxuICB3aWRvd3M6IHRydWUsXG4gIHpJbmRleDogdHJ1ZSxcbiAgb3JkZXI6IHRydWUsXG4gIHpvb206IHRydWVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2ZpcnN0ICggd3JhcHBlciwgZWxlbWVudCApIHtcbiAgd3JhcHBlclsgMCBdID0gZWxlbWVudDtcbiAgd3JhcHBlci5sZW5ndGggPSAxO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQG1ldGhvZCBfZ2V0U3R5bGVcbiAqIEBwYXJhbSAge29iamVjdH0gIGVsZW1lbnRcbiAqIEBwYXJhbSAge3N0cmluZ30gIHN0eWxlXG4gKiBAcGFyYW0gIHtvYmplY3R9IFtjb21wdXRlZFN0eWxlXVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9nZXRTdHlsZSAoIGVsZW1lbnQsIHN0eWxlLCBjb21wdXRlZFN0eWxlICkge1xuICByZXR1cm4gZWxlbWVudC5zdHlsZVsgc3R5bGUgXSB8fFxuICAgICggY29tcHV0ZWRTdHlsZSB8fCBnZXRDb21wdXRlZFN0eWxlKCBlbGVtZW50ICkgKS5nZXRQcm9wZXJ0eVZhbHVlKCBzdHlsZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQG1ldGhvZCBfbWVtb2l6ZVxuICogQHBhcmFtICB7ZnVuY3Rpb259IGZ1bmN0aW9uX1xuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX21lbW9pemUgKCBmdW5jdGlvbl8gKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgdmFyIGxhc3RSZXN1bHQ7XG4gIHZhciBsYXN0VmFsdWU7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIG1lbW9pemVkICggdmFsdWUgKSB7XG4gICAgc3dpdGNoICggZmFsc2UgKSB7XG4gICAgICBjYXNlIGNhbGxlZDpcbiAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gZmFsbHMgdGhyb3VnaFxuICAgICAgY2FzZSB2YWx1ZSA9PT0gbGFzdFZhbHVlOlxuICAgICAgICByZXR1cm4gKCBsYXN0UmVzdWx0ID0gZnVuY3Rpb25fKCAoIGxhc3RWYWx1ZSA9IHZhbHVlICkgKSApO1xuICAgIH1cblxuICAgIHJldHVybiBsYXN0UmVzdWx0O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gICAgICAgICA9IHJlcXVpcmUoICcuLi9wbGFjZWhvbGRlcicgKTtcbi8vIGNvbnN0YW50cy5QTEFDRUhPTERFUiBpcyBmb3IgYmFja3dhcmQtY29tcGFiaWxpdHkuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKTtcblxuLyoqXG4gKiDQrdGC0L7RgiDQvNC10YLQvtC0INCy0L7Qt9GA0LDRidCw0LXRgiDQvtC00LjQvSDQvNCw0YHRgdC40LIg0LDRgNCz0YPQvNC10L3RgtC+0LIg0LjQtyDRh9Cw0YHRgtC40YfQvdGL0YUg0LDRgNCz0YPQvNC10L3RgtC+0LIg0YEgcGxhY2Vob2xkZXJg0LDQvNC4LCDQuFxuICog0LDRgNCz0YPQvNC10L3RgtC+0LIg0LrQvtGC0L7RgNGL0LUg0LHRi9C70Lgg0L/RgNC4INCy0YvQt9C+0LLQtS5cbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIF9wcm9jZXNzQXJnc1xuICogQHBhcmFtICB7QXJyYXkuPGFueT59IHBhcnRpYWxBcmdzINCn0LDRgdGC0LjRh9C90YvQtSDQsNGA0LPRg9C80LXQvdGC0Ysg0YEgcGxhY2Vob2xkZXJg0LDQvNC4ICgncGVha28vcGxhY2Vob2xkZXInKS5cbiAqIEBwYXJhbSAge0FycmF5Ljxhbnk+fSBhcmdzICAgICAgICDQkNGA0LPRg9C80LXQvdGC0Ysg0LLRi9C30L7QstCwINC60LDQutC+0LPQvi3Qu9C40LHQviDQvNC10YLQvtC00LAuXG4gKiBAcmV0dXJuIHtBcnJheS48YW55Pn0gICAgICAgICAgICAg0J7QsdGA0LDQsdC+0YLQsNC90L3Ri9C1INCw0YDQs9GD0LzQtdC90YLRiy5cbiAqIEBleGFtcGxlXG4gKiB2YXIgYXJncyA9IF9wcm9jZXNzQXJncyggWyBfLCAnIScgXSwgWyAnSm9obicgXSApO1xuICovXG5mdW5jdGlvbiBfcHJvY2Vzc0FyZ3MgKCBwYXJ0aWFsQXJncywgYXJncyApIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaiA9IC0xO1xuICAvLyBTa2lwIGZ1bmN0aW9uXyBhbmQgdGhpc0FyZy5cbiAgdmFyIGkgPSAyO1xuICB2YXIgbGVuZ3RoID0gcGFydGlhbEFyZ3MubGVuZ3RoO1xuXG4gIGZvciAoIDsgaSA8IGxlbmd0aDsgKytpICkge1xuICAgIGlmICggcGFydGlhbEFyZ3NbIGkgXSA9PT0gXyB8fCBwYXJ0aWFsQXJnc1sgaSBdID09PSBjb25zdGFudHMuUExBQ0VIT0xERVIgKSB7XG4gICAgICByZXN1bHQucHVzaCggYXJnc1sgKytqIF0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goIHBhcnRpYWxBcmdzWyBpIF0gKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKCBsZW5ndGggPSBhcmdzLmxlbmd0aDsgaiA8IGxlbmd0aDsgKytqICkge1xuICAgIHJlc3VsdC5wdXNoKCBhcmdzWyBqIF0gKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3Byb2Nlc3NBcmdzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXNjYXBlID0gcmVxdWlyZSggJy4uL2VzY2FwZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfdGV4dENvbnRlbnQgKCBlbGVtZW50LCB2YWx1ZSApIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgY2hpbGRyZW47XG4gIHZhciBjaGlsZDtcbiAgdmFyIHR5cGU7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBlc2NhcGUoIHZhbHVlICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggaSA9IDAsIGwgPSAoIGNoaWxkcmVuID0gZWxlbWVudC5jaGlsZE5vZGVzICkubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIC8vIFRFWFRfTk9ERVxuICAgIGlmICggKCB0eXBlID0gKCBjaGlsZCA9IGNoaWxkcmVuWyBpIF0gKS5ub2RlVHlwZSApID09PSAzICkge1xuICAgICAgcmVzdWx0ICs9IGNoaWxkLm5vZGVWYWx1ZTtcbiAgICAvLyBFTEVNRU5UX05PREVcbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAxICkge1xuICAgICAgcmVzdWx0ICs9IF90ZXh0Q29udGVudCggY2hpbGQgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9tZW1vaXplJyApKCByZXF1aXJlKCAnLi4vdHlwZScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF91bmVzY2FwZSAoIHN0cmluZyApIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKCAvXFxcXChcXFxcKT8vZywgJyQxJyApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdvcmRzICggc3RyaW5nICkge1xuICBpZiAoIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggc3RyaW5nLCAnYSBzdHJpbmcnICk7XG4gIH1cblxuICByZXR1cm4gc3RyaW5nLm1hdGNoKCAvW15cXHNcXHVGRUZGXFx4QTBdKy9nICkgfHwgW107XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIga2V5cyAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGludmVydCAoIG9iamVjdCApIHtcbiAgdmFyIGsgPSBrZXlzKCBvYmplY3QgPSB0b09iamVjdCggb2JqZWN0ICkgKTtcbiAgdmFyIGludmVydGVkID0ge307XG4gIHZhciBpO1xuXG4gIGZvciAoIGkgPSBrLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGludmVydGVkWyBrWyBpIF0gXSA9IG9iamVjdFsga1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gaW52ZXJ0ZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNMZW5ndGggICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xudmFyIGlzV2luZG93TGlrZSA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgaXNMZW5ndGgoIHZhbHVlLmxlbmd0aCApICYmICEgaXNXaW5kb3dMaWtlKCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTGVuZ3RoICAgICA9IHJlcXVpcmUoICcuL2lzLWxlbmd0aCcgKTtcbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIHZhbHVlICkge1xuICBpZiAoIHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICkge1xuICAgIHJldHVybiBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiYgISBpc1dpbmRvd0xpa2UoIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciBpc0xlbmd0aCAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiZcbiAgICBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiZcbiAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHZhbHVlICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNET01FbGVtZW50ICggdmFsdWUgKSB7XG4gIHZhciBub2RlVHlwZTtcblxuICBpZiAoICEgaXNPYmplY3RMaWtlKCB2YWx1ZSApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICggaXNXaW5kb3dMaWtlKCB2YWx1ZSApICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbm9kZVR5cGUgPSB2YWx1ZS5ub2RlVHlwZTtcblxuICByZXR1cm4gbm9kZVR5cGUgPT09IDEgfHwgLy8gRUxFTUVOVF9OT0RFXG4gICAgICAgICBub2RlVHlwZSA9PT0gMyB8fCAvLyBURVhUX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSA4IHx8IC8vIENPTU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDkgfHwgLy8gRE9DVU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDExOyAgLy8gRE9DVU1FTlRfRlJBR01FTlRfTk9ERVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTnVtYmVyID0gcmVxdWlyZSggJy4vaXMtbnVtYmVyJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRmluaXRlICggdmFsdWUgKSB7XG4gIHJldHVybiBpc051bWJlciggdmFsdWUgKSAmJiBpc0Zpbml0ZSggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZSA9IHJlcXVpcmUoICcuL2ludGVybmFsL3R5cGUnICk7XG5cbnZhciByRGVlcEtleSA9IC8oXnxbXlxcXFxdKShcXFxcXFxcXCkqKFxcLnxcXFspLztcblxuZnVuY3Rpb24gaXNLZXkgKCB2YWwgKSB7XG4gIHZhciB0eXBlO1xuXG4gIGlmICggISB2YWwgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoIF90eXBlKCB2YWwgKSA9PT0gJ2FycmF5JyApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0eXBlID0gdHlwZW9mIHZhbDtcblxuICBpZiAoIHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJyB8fCBfdHlwZSggdmFsICkgPT09ICdzeW1ib2wnICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuICEgckRlZXBLZXkudGVzdCggdmFsICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLk1BWF9BUlJBWV9MRU5HVEg7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNMZW5ndGggKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+PSAwICYmXG4gICAgdmFsdWUgPD0gTUFYX0FSUkFZX0xFTkdUSCAmJlxuICAgIHZhbHVlICUgMSA9PT0gMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNOYU4gKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNOdW1iZXIgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3QgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSggdmFsdWUgKSAmJiB0b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBPYmplY3RdJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoICcuL2dldC1wcm90b3R5cGUtb2YnICk7XG52YXIgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QnICk7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgT0JKRUNUID0gdG9TdHJpbmcuY2FsbCggT2JqZWN0ICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdCAoIHYgKSB7XG4gIHZhciBwO1xuICB2YXIgYztcblxuICBpZiAoICEgaXNPYmplY3QoIHYgKSApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwID0gZ2V0UHJvdG90eXBlT2YoIHYgKTtcblxuICBpZiAoIHAgPT09IG51bGwgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoICEgaGFzT3duUHJvcGVydHkuY2FsbCggcCwgJ2NvbnN0cnVjdG9yJyApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGMgPSBwLmNvbnN0cnVjdG9yO1xuXG4gIHJldHVybiB0eXBlb2YgYyA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKCBjICkgPT09IE9CSkVDVDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNQcmltaXRpdmUgKCB2YWx1ZSApIHtcbiAgcmV0dXJuICEgdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNGaW5pdGUgID0gcmVxdWlyZSggJy4vaXMtZmluaXRlJyApO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyICggdmFsdWUgKSB7XG4gIHJldHVybiBpc0Zpbml0ZSggdmFsdWUgKSAmJlxuICAgIHZhbHVlIDw9IGNvbnN0YW50cy5NQVhfU0FGRV9JTlQgJiZcbiAgICB2YWx1ZSA+PSBjb25zdGFudHMuTUlOX1NBRkVfSU5UICYmXG4gICAgdmFsdWUgJSAxID09PSAwO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N0cmluZyAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlID0gcmVxdWlyZSggJy4vdHlwZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N5bWJvbCAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZSggdmFsdWUgKSA9PT0gJ3N5bWJvbCc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaW5kb3dMaWtlICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgdmFsdWUud2luZG93ID09PSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaW5kb3cgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzV2luZG93TGlrZSggdmFsdWUgKSAmJiB0b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBXaW5kb3ddJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNzZXQgKCBrZXksIG9iaiApIHtcbiAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBvYmpbIGtleSBdICE9PSAndW5kZWZpbmVkJyB8fCBrZXkgaW4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VWYWx1ZXMgICAgICAgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLXZhbHVlcycgKTtcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG52YXIga2V5cyAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGl0ZXJhYmxlICggdmFsdWUgKSB7XG4gIGlmICggaXNBcnJheUxpa2VPYmplY3QoIHZhbHVlICkgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCggJycgKTtcbiAgfVxuXG4gIHJldHVybiBiYXNlVmFsdWVzKCB2YWx1ZSwga2V5cyggdmFsdWUgKSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG52YXIgbWF0Y2hlc1Byb3BlcnR5ICAgPSByZXF1aXJlKCAnLi9tYXRjaGVzLXByb3BlcnR5JyApO1xudmFyIHByb3BlcnR5ICAgICAgICAgID0gcmVxdWlyZSggJy4vcHJvcGVydHknICk7XG5cbmV4cG9ydHMuaXRlcmF0ZWUgPSBmdW5jdGlvbiBpdGVyYXRlZSAoIHZhbHVlICkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpZiAoIGlzQXJyYXlMaWtlT2JqZWN0KCB2YWx1ZSApICkge1xuICAgIHJldHVybiBtYXRjaGVzUHJvcGVydHkoIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gcHJvcGVydHkoIHZhbHVlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0S2V5c0luICggb2JqICkge1xuICB2YXIga2V5cyA9IFtdO1xuICB2YXIga2V5O1xuXG4gIG9iaiA9IHRvT2JqZWN0KCBvYmogKTtcblxuICBmb3IgKCBrZXkgaW4gb2JqICkge1xuICAgIGtleXMucHVzaCgga2V5ICk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlS2V5cyA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1rZXlzJyApO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIHN1cHBvcnQgID0gcmVxdWlyZSggJy4vc3VwcG9ydC9zdXBwb3J0LWtleXMnICk7XG5cbmlmICggc3VwcG9ydCAhPT0gJ2VzMjAxNScgKSB7XG4gIHZhciBfa2V5cztcblxuICAvKipcbiAgICogKyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICtcbiAgICogfCBJIHRlc3RlZCB0aGUgZnVuY3Rpb25zIHdpdGggc3RyaW5nWzIwNDhdIChhbiBhcnJheSBvZiBzdHJpbmdzKSBhbmQgaGFkIHxcbiAgICogfCB0aGlzIHJlc3VsdHMgaW4gTm9kZS5qcyAodjguMTAuMCk6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICogKyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICtcbiAgICogfCBiYXNlS2V5cyB4IDEwLDY3NCBvcHMvc2VjIMKxMC4yMyUgKDk0IHJ1bnMgc2FtcGxlZCkgICAgICAgICAgICAgICAgICAgICB8XG4gICAqIHwgT2JqZWN0LmtleXMgeCAyMiwxNDcgb3BzL3NlYyDCsTAuMjMlICg5NSBydW5zIHNhbXBsZWQpICAgICAgICAgICAgICAgICAgfFxuICAgKiB8IEZhc3Rlc3QgaXMgXCJPYmplY3Qua2V5c1wiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAqICsgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSArXG4gICAqL1xuXG4gIGlmICggc3VwcG9ydCA9PT0gJ2VzNScgKSB7XG4gICAgX2tleXMgPSBPYmplY3Qua2V5cztcbiAgfSBlbHNlIHtcbiAgICBfa2V5cyA9IGJhc2VLZXlzO1xuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXlzICggdiApIHtcbiAgICByZXR1cm4gX2tleXMoIHRvT2JqZWN0KCB2ICkgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1pbmRleC1vZicgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgZ2V0ICAgICAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtZ2V0JyApO1xudmFyIEVSUiAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXRjaGVzUHJvcGVydHkgKCBwcm9wZXJ0eSApIHtcbiAgdmFyIHBhdGggID0gY2FzdFBhdGgoIHByb3BlcnR5WyAwIF0gKTtcbiAgdmFyIHZhbHVlID0gcHJvcGVydHlbIDEgXTtcblxuICBpZiAoICEgcGF0aC5sZW5ndGggKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCBvYmplY3QgKSB7XG4gICAgaWYgKCBvYmplY3QgPT09IG51bGwgfHwgdHlwZW9mIG9iamVjdCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCBwYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICByZXR1cm4gZ2V0KCBvYmplY3QsIHBhdGgsIDAgKSA9PT0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgMCBdIF0gPT09IHZhbHVlO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWluZGV4LW9mJyApO1xuXG52YXIgbWF0Y2hlcztcblxuaWYgKCB0eXBlb2YgRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgISAoIG1hdGNoZXMgPSBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzIHx8IEVsZW1lbnQucHJvdG90eXBlLm9NYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUubW96TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciApICkge1xuICBtYXRjaGVzID0gZnVuY3Rpb24gbWF0Y2hlcyAoIHNlbGVjdG9yICkge1xuICAgIGlmICggL14jW1xcd1xcLV0rJC8udGVzdCggc2VsZWN0b3IgKz0gJycgKSApIHtcbiAgICAgIHJldHVybiAnIycgKyB0aGlzLmlkID09PSBzZWxlY3RvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZUluZGV4T2YoIHRoaXMub3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApLCB0aGlzICkgPj0gMDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHktb2YnICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1pbnZva2UnICksIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5JyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtaW52b2tlJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtZW1vaXplICAgICAgID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvbWVtb2l6ZScgKTtcblxudmFyIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCAnLi9pcy1wbGFpbi1vYmplY3QnICk7XG52YXIgdG9PYmplY3QgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBrZXlzICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcbnZhciBpc0FycmF5ICAgICAgID0gbWVtb2l6ZSggcmVxdWlyZSggJy4vaXMtYXJyYXknICkgKTtcblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLm1peGluXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICBbZGVlcD10cnVlXVxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgdGFyZ2V0XG4gKiBAcGFyYW0gIHsuLi5vYmplY3Q/fSBvYmplY3RcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtaXhpbiAoIGRlZXAsIHRhcmdldCApIHtcbiAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaSA9IDI7XG4gIHZhciBvYmplY3Q7XG4gIHZhciBzb3VyY2U7XG4gIHZhciB2YWx1ZTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuICB2YXIgaztcblxuICBpZiAoIHR5cGVvZiBkZWVwICE9PSAnYm9vbGVhbicgKSB7XG4gICAgdGFyZ2V0ID0gZGVlcDtcbiAgICBkZWVwID0gdHJ1ZTtcbiAgICBpID0gMTtcbiAgfVxuXG4gIHRhcmdldCA9IHRvT2JqZWN0KCB0YXJnZXQgKTtcblxuICBmb3IgKCA7IGkgPCBhcmdzTGVuZ3RoOyArK2kgKSB7XG4gICAgb2JqZWN0ID0gYXJndW1lbnRzWyBpIF07XG5cbiAgICBpZiAoICEgb2JqZWN0ICkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yICggayA9IGtleXMoIG9iamVjdCApLCBqID0gMCwgbCA9IGsubGVuZ3RoOyBqIDwgbDsgKytqICkge1xuICAgICAgdmFsdWUgPSBvYmplY3RbIGtbIGogXSBdO1xuXG4gICAgICBpZiAoIGRlZXAgJiYgaXNQbGFpbk9iamVjdCggdmFsdWUgKSB8fCBpc0FycmF5KCB2YWx1ZSApICkge1xuICAgICAgICBzb3VyY2UgPSB0YXJnZXRbIGtbIGogXSBdO1xuXG4gICAgICAgIGlmICggaXNBcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgICBpZiAoICEgaXNBcnJheSggc291cmNlICkgKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCAhIGlzUGxhaW5PYmplY3QoIHNvdXJjZSApICkge1xuICAgICAgICAgICAgc291cmNlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0WyBrWyBqIF0gXSA9IG1peGluKCB0cnVlLCBzb3VyY2UsIHZhbHVlICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbIGtbIGogXSBdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9vcCAoKSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBicmFjZS1ydWxlcy9icmFjZS1vbi1zYW1lLWxpbmVcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbiBub3cgKCkge1xuICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmVmb3JlID0gcmVxdWlyZSggJy4vYmVmb3JlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9uY2UgKCB0YXJnZXQgKSB7XG4gIHJldHVybiBiZWZvcmUoIDEsIHRhcmdldCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VDbG9uZUFycmF5ID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWNsb25lLWFycmF5JyApO1xuXG52YXIgZnJhZ21lbnQgICAgICAgPSByZXF1aXJlKCAnLi9mcmFnbWVudCcgKTtcblxuLyoqXG4gKiBAbWV0aG9kIF8ucGFyc2VIVE1MXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgIHN0cmluZ1xuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtBcnJheS48RWxlbWVudD59XG4gKiBAZXhhbXBsZVxuICogdmFyIGVsZW1lbnRzID0gXy5wYXJzZUhUTUwoICc8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwic3VibWl0XCIgLz4nICk7XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIVE1MICggc3RyaW5nLCBjb250ZXh0ICkge1xuICBpZiAoIC9eKD86PChbXFx3LV0rKT48XFwvW1xcdy1dKz58PChbXFx3LV0rKSg/OlxccypcXC8pPz4pJC8udGVzdCggc3RyaW5nICkgKSB7XG4gICAgcmV0dXJuIFsgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggUmVnRXhwLiQxIHx8IFJlZ0V4cC4kMiApIF07XG4gIH1cblxuICByZXR1cm4gYmFzZUNsb25lQXJyYXkoIGZyYWdtZW50KCBbIHN0cmluZyBdLCBjb250ZXh0IHx8IGRvY3VtZW50ICkuY2hpbGROb2RlcyApO1xufTtcbiIsIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggVmxhZGlzbGF2IFRpa2hpeSAoU0lMRU5UKVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cHM6Ly9naXRodWIuY29tL3Rpa2hpeS9wZWFrb1xuICovXG5cbi8qIVxuICogQmFzZWQgb24galF1ZXJ5ICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeVxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmVcbiAqIEJhc2VkIG9uIExvZGFzaCAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2hcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5hbWVzcGFjZSBwZWFrb1xuICovXG52YXIgcGVha287XG5cbmlmICggdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyApIHtcbiAgcGVha28gPSByZXF1aXJlKCAnLi9fJyApO1xuICBwZWFrby5ET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbn0gZWxzZSB7XG4gIHBlYWtvID0gZnVuY3Rpb24gcGVha28gKCkge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYnJhY2UtcnVsZXMvYnJhY2Utb24tc2FtZS1saW5lXG59XG5cbnBlYWtvLmFqYXggICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYWpheCcgKTtcbnBlYWtvLmFzc2lnbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYXNzaWduJyApO1xucGVha28uYXNzaWduSW4gICAgICAgICAgPSByZXF1aXJlKCAnLi9hc3NpZ24taW4nICk7XG5wZWFrby5jbG9uZSAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Nsb25lJyApO1xucGVha28uY3JlYXRlICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jcmVhdGUnICk7XG5wZWFrby5kZWZhdWx0cyAgICAgICAgICA9IHJlcXVpcmUoICcuL2RlZmF1bHRzJyApO1xucGVha28uZGVmaW5lUHJvcGVydHkgICAgPSByZXF1aXJlKCAnLi9kZWZpbmUtcHJvcGVydHknICk7XG5wZWFrby5kZWZpbmVQcm9wZXJ0aWVzICA9IHJlcXVpcmUoICcuL2RlZmluZS1wcm9wZXJ0aWVzJyApO1xucGVha28uZWFjaCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoJyApO1xucGVha28uZWFjaFJpZ2h0ICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoLXJpZ2h0JyApO1xucGVha28uZ2V0UHJvdG90eXBlT2YgICAgPSByZXF1aXJlKCAnLi9nZXQtcHJvdG90eXBlLW9mJyApO1xucGVha28uaW5kZXhPZiAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pbmRleC1vZicgKTtcbnBlYWtvLmlzQXJyYXkgICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtYXJyYXknICk7XG5wZWFrby5pc0FycmF5TGlrZSAgICAgICA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2UnICk7XG5wZWFrby5pc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xucGVha28uaXNET01FbGVtZW50ICAgICAgPSByZXF1aXJlKCAnLi9pcy1kb20tZWxlbWVudCcgKTtcbnBlYWtvLmlzTGVuZ3RoICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xucGVha28uaXNPYmplY3QgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QnICk7XG5wZWFrby5pc09iamVjdExpa2UgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xucGVha28uaXNQbGFpbk9iamVjdCAgICAgPSByZXF1aXJlKCAnLi9pcy1wbGFpbi1vYmplY3QnICk7XG5wZWFrby5pc1ByaW1pdGl2ZSAgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnBlYWtvLmlzU3ltYm9sICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtc3ltYm9sJyApO1xucGVha28uaXNTdHJpbmcgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1zdHJpbmcnICk7XG5wZWFrby5pc1dpbmRvdyAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdycgKTtcbnBlYWtvLmlzV2luZG93TGlrZSAgICAgID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5wZWFrby5pc051bWJlciAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLW51bWJlcicgKTtcbnBlYWtvLmlzTmFOICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbmFuJyApO1xucGVha28uaXNTYWZlSW50ZWdlciAgICAgPSByZXF1aXJlKCAnLi9pcy1zYWZlLWludGVnZXInICk7XG5wZWFrby5pc0Zpbml0ZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLWZpbml0ZScgKTtcbnBlYWtvLmtleXMgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcbnBlYWtvLmtleXNJbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cy1pbicgKTtcbnBlYWtvLmxhc3RJbmRleE9mICAgICAgID0gcmVxdWlyZSggJy4vbGFzdC1pbmRleC1vZicgKTtcbnBlYWtvLm1peGluICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbWl4aW4nICk7XG5wZWFrby5ub29wICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL25vb3AnICk7XG5wZWFrby5wcm9wZXJ0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5JyApO1xucGVha28ucHJvcGVydHlPZiAgICAgICAgPSByZXF1aXJlKCAnLi9wcm9wZXJ0eS1vZicgKTtcbnBlYWtvLm1ldGhvZCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbWV0aG9kJyApO1xucGVha28ubWV0aG9kT2YgICAgICAgICAgPSByZXF1aXJlKCAnLi9tZXRob2Qtb2YnICk7XG5wZWFrby5zZXRQcm90b3R5cGVPZiAgICA9IHJlcXVpcmUoICcuL3NldC1wcm90b3R5cGUtb2YnICk7XG5wZWFrby50b09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnBlYWtvLnR5cGUgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdHlwZScgKTtcbnBlYWtvLmZvckVhY2ggICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLWVhY2gnICk7XG5wZWFrby5mb3JFYWNoUmlnaHQgICAgICA9IHJlcXVpcmUoICcuL2Zvci1lYWNoLXJpZ2h0JyApO1xucGVha28uZm9ySW4gICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9mb3ItaW4nICk7XG5wZWFrby5mb3JJblJpZ2h0ICAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1pbi1yaWdodCcgKTtcbnBlYWtvLmZvck93biAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLW93bicgKTtcbnBlYWtvLmZvck93blJpZ2h0ICAgICAgID0gcmVxdWlyZSggJy4vZm9yLW93bi1yaWdodCcgKTtcbnBlYWtvLmJlZm9yZSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYmVmb3JlJyApO1xucGVha28ub25jZSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9vbmNlJyApO1xucGVha28uZGVmYXVsdFRvICAgICAgICAgPSByZXF1aXJlKCAnLi9kZWZhdWx0LXRvJyApO1xucGVha28udGltZXIgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90aW1lcicgKTtcbnBlYWtvLnRpbWVzdGFtcCAgICAgICAgID0gcmVxdWlyZSggJy4vdGltZXN0YW1wJyApO1xucGVha28ubm93ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9ub3cnICk7XG5wZWFrby5jbGFtcCAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NsYW1wJyApO1xucGVha28uYmluZCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9iaW5kJyApO1xucGVha28udHJpbSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90cmltJyApO1xucGVha28udHJpbUVuZCAgICAgICAgICAgPSByZXF1aXJlKCAnLi90cmltLWVuZCcgKTtcbnBlYWtvLnRyaW1TdGFydCAgICAgICAgID0gcmVxdWlyZSggJy4vdHJpbS1zdGFydCcgKTtcbnBlYWtvLmZpbmQgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZCcgKTtcbnBlYWtvLmZpbmRJbmRleCAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZC1pbmRleCcgKTtcbnBlYWtvLmZpbmRMYXN0ICAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZC1sYXN0JyApO1xucGVha28uZmluZExhc3RJbmRleCAgICAgPSByZXF1aXJlKCAnLi9maW5kLWxhc3QtaW5kZXgnICk7XG5wZWFrby5oYXMgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2hhcycgKTtcbnBlYWtvLmdldCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZ2V0JyApO1xucGVha28uc2V0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zZXQnICk7XG5wZWFrby5pdGVyYXRlZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2l0ZXJhdGVlJyApO1xucGVha28uaWRlbnRpdHkgICAgICAgICAgPSByZXF1aXJlKCAnLi9pZGVudGl0eScgKTtcbnBlYWtvLmVzY2FwZSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZXNjYXBlJyApO1xucGVha28udW5lc2NhcGUgICAgICAgICAgPSByZXF1aXJlKCAnLi91bmVzY2FwZScgKTtcbnBlYWtvLnJhbmRvbSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vcmFuZG9tJyApO1xucGVha28uZnJvbVBhaXJzICAgICAgICAgPSByZXF1aXJlKCAnLi9mcm9tLXBhaXJzJyApO1xucGVha28uY29uc3RhbnRzICAgICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICk7XG5wZWFrby50ZW1wbGF0ZSAgICAgICAgICA9IHJlcXVpcmUoICcuL3RlbXBsYXRlJyApO1xucGVha28uaW52ZXJ0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pbnZlcnQnICk7XG5wZWFrby5jb21wb3VuZCAgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbXBvdW5kJyApO1xucGVha28uZGVib3VuY2UgICAgICAgICAgPSByZXF1aXJlKCAnLi9kZWJvdW5jZScgKTtcblxuaWYgKCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gIHNlbGYucGVha28gPSBzZWxmLl8gPSBwZWFrbzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwZWFrbztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbWVtYmVyIHtvYmplY3R9IF8ucGxhY2Vob2xkZXJcbiAqL1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBtZXRob2QgXy5wcm9wZXJ0eU9mXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgb2JqZWN0XG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBleGFtcGxlXG4gKiB2YXIgb2JqZWN0ID0ge1xuICogICB4OiA0MixcbiAqICAgeTogMFxuICogfTtcbiAqXG4gKiBbICd4JywgJ3knIF0ubWFwKCBfLnByb3BlcnR5T2YoIG9iamVjdCApICk7IC8vIC0+IFsgNDIsIDAgXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHktb2YnICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1wcm9wZXJ0eScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBtZXRob2QgXy5wcm9wZXJ0eVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHBhdGhcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICogQGV4YW1wbGVcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7IG5hbWU6ICdKYW1lcycgfSxcbiAqICAgeyBuYW1lOiAnSm9obicgfVxuICogXTtcbiAqXG4gKiBvYmplY3RzLm1hcCggXy5wcm9wZXJ0eSggJ25hbWUnICkgKTsgLy8gLT4gWyAnSmFtZXMnLCAnSm9obicgXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHknICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1wcm9wZXJ0eScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2NsYXNzJzogJ2NsYXNzTmFtZScsXG4gICdmb3InOiAgICdodG1sRm9yJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VSYW5kb20gPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtcmFuZG9tJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJhbmRvbSAoIGxvd2VyLCB1cHBlciwgZmxvYXRpbmcgKSB7XG5cbiAgLy8gXy5yYW5kb20oKTtcblxuICBpZiAoIHR5cGVvZiBsb3dlciA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZmxvYXRpbmcgPSBmYWxzZTtcbiAgICB1cHBlciA9IDE7XG4gICAgbG93ZXIgPSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgdXBwZXIgPT09ICd1bmRlZmluZWQnICkge1xuXG4gICAgLy8gXy5yYW5kb20oIGZsb2F0aW5nICk7XG5cbiAgICBpZiAoIHR5cGVvZiBsb3dlciA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgZmxvYXRpbmcgPSBsb3dlcjtcbiAgICAgIHVwcGVyID0gMTtcblxuICAgIC8vIF8ucmFuZG9tKCB1cHBlciApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGZsb2F0aW5nID0gZmFsc2U7XG4gICAgICB1cHBlciA9IGxvd2VyO1xuICAgIH1cblxuICAgIGxvd2VyID0gMDtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGZsb2F0aW5nID09PSAndW5kZWZpbmVkJyApIHtcblxuICAgIC8vIF8ucmFuZG9tKCB1cHBlciwgZmxvYXRpbmcgKTtcblxuICAgIGlmICggdHlwZW9mIHVwcGVyID09PSAnYm9vbGVhbicgKSB7XG4gICAgICBmbG9hdGluZyA9IHVwcGVyO1xuICAgICAgdXBwZXIgPSBsb3dlcjtcbiAgICAgIGxvd2VyID0gMDtcblxuICAgIC8vIF8ucmFuZG9tKCBsb3dlciwgdXBwZXIgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBmbG9hdGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICggZmxvYXRpbmcgfHwgbG93ZXIgJSAxIHx8IHVwcGVyICUgMSApIHtcbiAgICByZXR1cm4gYmFzZVJhbmRvbSggbG93ZXIsIHVwcGVyICk7XG4gIH1cblxuICByZXR1cm4gTWF0aC5yb3VuZCggYmFzZVJhbmRvbSggbG93ZXIsIHVwcGVyICkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1ByaW1pdGl2ZSA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnZhciBFUlIgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mICggdGFyZ2V0LCBwcm90b3R5cGUgKSB7XG4gIGlmICggdGFyZ2V0ID09PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnICkge1xuICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gIH1cblxuICBpZiAoIHByb3RvdHlwZSAhPT0gbnVsbCAmJiBpc1ByaW1pdGl2ZSggcHJvdG90eXBlICkgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogJyArIHByb3RvdHlwZSApO1xuICB9XG5cbiAgaWYgKCAnX19wcm90b19fJyBpbiB0YXJnZXQgKSB7XG4gICAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTsgLy8ganNoaW50IGlnbm9yZTogbGluZVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBiYXNlU2V0ICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1zZXQnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldCAoIG9iaiwgcGF0aCwgdmFsICkge1xuICB2YXIgbCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGwgKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGwgPiAxICkge1xuICAgIHJldHVybiBiYXNlU2V0KCB0b09iamVjdCggb2JqICksIHBhdGgsIHZhbCApO1xuICB9XG5cbiAgcmV0dXJuICggdG9PYmplY3QoIG9iaiApWyBwYXRoWyAwIF0gXSA9IHZhbCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1cHBvcnQ7XG5cbmZ1bmN0aW9uIHRlc3QgKCB0YXJnZXQgKSB7XG4gIHRyeSB7XG4gICAgaWYgKCAnJyBpbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHRhcmdldCwgJycsIHt9ICkgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKCBlICkge31cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmlmICggdGVzdCgge30gKSApIHtcbiAgc3VwcG9ydCA9ICdmdWxsJztcbn0gZWxzZSBpZiAoIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdGVzdCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICkgKSApIHtcbiAgc3VwcG9ydCA9ICdkb20nO1xufSBlbHNlIHtcbiAgc3VwcG9ydCA9ICdub3Qtc3VwcG9ydGVkJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuXG50cnkge1xuICBpZiAoIHNwYW4uc2V0QXR0cmlidXRlKCAneCcsICd5JyApLCBzcGFuLmdldEF0dHJpYnV0ZSggJ3gnICkgPT09ICd5JyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZXF1ZW5jZXNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbnVsbDtcbiAgfVxufSBjYXRjaCAoIGVycm9yICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xufVxuXG5zcGFuID0gbnVsbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1cHBvcnQ7XG5cbmlmICggT2JqZWN0LmtleXMgKSB7XG4gIHRyeSB7XG4gICAgc3VwcG9ydCA9IE9iamVjdC5rZXlzKCAnJyApLCAnZXMyMDE1JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnMsIG5vLXNlcXVlbmNlc1xuICB9IGNhdGNoICggZXJyb3IgKSB7XG4gICAgc3VwcG9ydCA9ICdlczUnO1xuICB9XG59IGVsc2UgaWYgKCB7IHRvU3RyaW5nOiBudWxsIH0ucHJvcGVydHlJc0VudW1lcmFibGUoICd0b1N0cmluZycgKSApIHtcbiAgc3VwcG9ydCA9ICdoYXMtYS1idWcnO1xufSBlbHNlIHtcbiAgc3VwcG9ydCA9ICdub3Qtc3VwcG9ydGVkJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXNjYXBlICA9IHJlcXVpcmUoICcuL2VzY2FwZScgKTtcblxudmFyIHJlZ2V4cHMgPSB7XG4gIHNhZmU6ICc8XFxcXCU9XFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPicsXG4gIGh0bWw6ICc8XFxcXCUtXFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPicsXG4gIGNvbW06IFwiJycnKFteXSo/KScnJ1wiLFxuICBjb2RlOiAnPFxcXFwlXFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPidcbn07XG5cbmZ1bmN0aW9uIHJlcGxhY2VyICggbWF0Y2gsIHNhZmUsIGh0bWwsIGNvZGUgKSB7XG4gIGlmICggdHlwZW9mIHNhZmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIicrX2UoXCIgKyBzYWZlLnJlcGxhY2UoIC9cXFxcbi9nLCAnXFxuJyApICsgXCIpKydcIjtcbiAgfVxuXG4gIGlmICggdHlwZW9mIGh0bWwgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIicrKFwiICsgaHRtbC5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiKSsnXCI7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBjb2RlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gXCInO1wiICsgY29kZS5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiO19yKz0nXCI7XG4gIH1cblxuICAvLyBjb21tZW50IGlzIG1hdGNoZWQgLSBkbyBub3RoaW5nXG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLnRlbXBsYXRlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHNvdXJjZSAgICAgICAgICAgIFRoZSB0ZW1wbGF0ZSBzb3VyY2UuXG4gKiBAcGFyYW0gIHtvYmplY3R9IFtvcHRpb25zXSAgICAgICAgIEFuIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtvYmplY3R9IFtvcHRpb25zLnJlZ2V4cHNdIEN1c3RvbSBwYXR0ZXJucy5cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgICAgICAgQW4gb2JqZWN0IHdpdGggYHJlbmRlcmAgbWV0aG9kLlxuICogQGV4YW1wbGVcbiAqIHZhciB0ZW1wbGF0ZSA9IHBlYWtvLnRlbXBsYXRlKGBcbiAqICAgJycnIEEgaHRtbC1zYWZlIG91dHB1dC4gJycnXG4gKiAgIDx0aXRsZT48JT0gZGF0YS51c2VybmFtZSAlPjwvdGl0bGU+XG4gKiAgICcnJyBBIGJsb2NrIG9mIGNvZGUuICcnJ1xuICogICA8JSBmb3IgKCB2YXIgaSA9IDA7IGkgPCA1OyBpICs9IDEgKSB7XG4gKiAgICAgLy8gVGhlIFwicHJpbnRcIiBmdW5jdGlvbi5cbiAqICAgICBwcmludCggaSApO1xuICogICB9ICU+XG4gKiBgKTtcbiAqIHZhciBodG1sID0gdGVtcGxhdGUucmVuZGVyKCB7IHVzZXJuYW1lOiAnSm9obicgfSApO1xuICogLy8gLT4gJ1xcbiAgXFxuICA8dGl0bGU+Sm9objwvdGl0bGU+XFxuICBcXG4gIDAxMjM0XFxuJ1xuICovXG5mdW5jdGlvbiB0ZW1wbGF0ZSAoIHNvdXJjZSwgb3B0aW9ucyApIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgcmVnZXhwO1xuICB2YXIgcmVuZGVyXztcblxuICBpZiAoICEgb3B0aW9ucyApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBmdW5jdGlvbiBnZXQgKCBrZXkgKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMucmVnZXhwcyAmJiBvcHRpb25zLnJlZ2V4cHNbIGtleSBdIHx8IHJlZ2V4cHNbIGtleSBdO1xuICB9XG5cbiAgcmVnZXhwID0gUmVnRXhwKFxuICAgIGdldCggJ3NhZmUnICkgKyAnfCcgK1xuICAgIGdldCggJ2h0bWwnICkgKyAnfCcgK1xuICAgIGdldCggJ2NvZGUnICkgKyAnfCcgK1xuICAgIGdldCggJ2NvbW0nICksICdnJyApO1xuXG4gIGlmICggb3B0aW9ucy53aXRoICkge1xuICAgIHJlc3VsdCArPSAnd2l0aChkYXRhfHx7fSl7JztcbiAgfVxuXG4gIGlmICggb3B0aW9ucy5wcmludCAhPT0gbnVsbCApIHtcbiAgICByZXN1bHQgKz0gJ2Z1bmN0aW9uICcgKyAoIG9wdGlvbnMucHJpbnQgfHwgJ3ByaW50JyApICsgXCIoKXtfcis9QXJyYXkucHJvdG90eXBlLmpvaW4uY2FsbChhcmd1bWVudHMsJycpO31cIjtcbiAgfVxuXG4gIHJlc3VsdCArPSBcInZhciBfcj0nXCI7XG5cbiAgcmVzdWx0ICs9IHNvdXJjZVxuICAgIC5yZXBsYWNlKCAvXFxuL2csICdcXFxcbicgKVxuICAgIC5yZXBsYWNlKCByZWdleHAsIHJlcGxhY2VyICk7XG5cbiAgcmVzdWx0ICs9IFwiJztcIjtcblxuICBpZiAoIG9wdGlvbnMud2l0aCApIHtcbiAgICByZXN1bHQgKz0gJ30nO1xuICB9XG5cbiAgcmVzdWx0ICs9ICdyZXR1cm4gX3I7JztcblxuICByZW5kZXJfID0gRnVuY3Rpb24oICdkYXRhJywgJ19lJywgcmVzdWx0ICk7XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlciAoIGRhdGEgKSB7XG4gICAgICByZXR1cm4gcmVuZGVyXy5jYWxsKCB0aGlzLCBkYXRhLCBlc2NhcGUgKTtcbiAgICB9LFxuXG4gICAgcmVzdWx0OiByZXN1bHQsXG4gICAgc291cmNlOiBzb3VyY2VcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcbiIsIi8qKlxuICogQmFzZWQgb24gRXJpayBNw7ZsbGVyIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbDpcbiAqXG4gKiBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzEgd2hpY2ggZGVyaXZlZCBmcm9tXG4gKiBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuICogaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuICpcbiAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuXG4gKiBGaXhlcyBmcm9tIFBhdWwgSXJpc2gsIFRpbm8gWmlqZGVsLCBBbmRyZXcgTWFvLCBLbGVtZW4gU2xhdmnEjSwgRGFyaXVzIEJhY29uLlxuICpcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGltZXN0YW1wID0gcmVxdWlyZSggJy4vdGltZXN0YW1wJyApO1xuXG52YXIgcmVxdWVzdEFGO1xudmFyIGNhbmNlbEFGO1xuXG5pZiAoIHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyApIHtcbiAgY2FuY2VsQUYgPSBzZWxmLmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYud2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICByZXF1ZXN0QUYgPSBzZWxmLnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG59XG5cbnZhciBub1JlcXVlc3RBbmltYXRpb25GcmFtZSA9ICEgcmVxdWVzdEFGIHx8ICEgY2FuY2VsQUYgfHxcbiAgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgL2lQKGFkfGhvbmV8b2QpLipPU1xcczYvLnRlc3QoIG5hdmlnYXRvci51c2VyQWdlbnQgKTtcblxuaWYgKCBub1JlcXVlc3RBbmltYXRpb25GcmFtZSApIHtcbiAgdmFyIGxhc3RSZXF1ZXN0VGltZSA9IDA7XG4gIHZhciBmcmFtZUR1cmF0aW9uICAgPSAxMDAwIC8gNjA7XG5cbiAgZXhwb3J0cy5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdCAoIGFuaW1hdGUgKSB7XG4gICAgdmFyIG5vdyAgICAgICAgICAgICA9IHRpbWVzdGFtcCgpO1xuICAgIHZhciBuZXh0UmVxdWVzdFRpbWUgPSBNYXRoLm1heCggbGFzdFJlcXVlc3RUaW1lICsgZnJhbWVEdXJhdGlvbiwgbm93ICk7XG5cbiAgICByZXR1cm4gc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgbGFzdFJlcXVlc3RUaW1lID0gbmV4dFJlcXVlc3RUaW1lO1xuICAgICAgYW5pbWF0ZSggbm93ICk7XG4gICAgfSwgbmV4dFJlcXVlc3RUaW1lIC0gbm93ICk7XG4gIH07XG5cbiAgZXhwb3J0cy5jYW5jZWwgPSBjbGVhclRpbWVvdXQ7XG59IGVsc2Uge1xuICBleHBvcnRzLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0ICggYW5pbWF0ZSApIHtcbiAgICByZXR1cm4gcmVxdWVzdEFGKCBhbmltYXRlICk7XG4gIH07XG5cbiAgZXhwb3J0cy5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwgKCBpZCApIHtcbiAgICByZXR1cm4gY2FuY2VsQUYoIGlkICk7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBub3cgPSByZXF1aXJlKCAnLi9ub3cnICk7XG52YXIgbmF2aWdhdG9yU3RhcnQ7XG5cbmlmICggdHlwZW9mIHBlcmZvcm1hbmNlID09PSAndW5kZWZpbmVkJyB8fCAhIHBlcmZvcm1hbmNlLm5vdyApIHtcbiAgbmF2aWdhdG9yU3RhcnQgPSBub3coKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRpbWVzdGFtcCAoKSB7XG4gICAgcmV0dXJuIG5vdygpIC0gbmF2aWdhdG9yU3RhcnQ7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRpbWVzdGFtcCAoKSB7XG4gICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3VuZXNjYXBlID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdW5lc2NhcGUnICk7XG5cbnZhciBpc1N5bWJvbCAgPSByZXF1aXJlKCAnLi9pcy1zeW1ib2wnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiBfdW5lc2NhcGUoIHZhbHVlICk7XG4gIH1cblxuICBpZiAoIGlzU3ltYm9sKCB2YWx1ZSApICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHZhciBrZXkgPSAnJyArIHZhbHVlO1xuXG4gIGlmICgga2V5ID09PSAnMCcgJiYgMSAvIHZhbHVlID09PSAtSW5maW5pdHkgKSB7XG4gICAgcmV0dXJuICctMCc7XG4gIH1cblxuICByZXR1cm4gX3VuZXNjYXBlKCBrZXkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvT2JqZWN0ICggdmFsdWUgKSB7XG4gIGlmICggdmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdCggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggU3RyaW5nLnByb3RvdHlwZS50cmltRW5kICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW1FbmQgKCBzdHJpbmcgKSB7XG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS50cmltRW5kKCk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL1tcXHNcXHVGRUZGXFx4QTBdKyQvICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggU3RyaW5nLnByb3RvdHlwZS50cmltU3RhcnQgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJpbVN0YXJ0ICggc3RyaW5nICkge1xuICAgIHJldHVybiAoICcnICsgc3RyaW5nICkudHJpbVN0YXJ0KCk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL15bXFxzXFx1RkVGRlxceEEwXSsvICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggU3RyaW5nLnByb3RvdHlwZS50cmltICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW0gKCBzdHJpbmcgKSB7XG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS50cmltKCk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC8gKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZSA9IHJlcXVpcmUoICcuL2NyZWF0ZScgKTtcblxudmFyIGNhY2hlID0gY3JlYXRlKCBudWxsICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHlwZSAoIHZhbHVlICkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWU7XG4gIH1cblxuICBpZiAoIHZhbHVlID09PSBudWxsICkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cblxuICB2YXIgc3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2YWx1ZSApO1xuXG4gIGlmICggISBjYWNoZVsgc3RyaW5nIF0gKSB7XG4gICAgY2FjaGVbIHN0cmluZyBdID0gc3RyaW5nLnNsaWNlKCA4LCAtMSApLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICByZXR1cm4gY2FjaGVbIHN0cmluZyBdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVzY2FwZScgKSggLyYoPzpsdHxndHwjMzR8IzM5fGFtcCk7L2csIHtcbiAgJyZsdDsnOiAgJzwnLFxuICAnJmd0Oyc6ICAnPicsXG4gICcmIzM0Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiLFxuICAnJmFtcDsnOiAnJidcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpcnN0JyApKCAndG9VcHBlckNhc2UnICk7XG4iXX0=
