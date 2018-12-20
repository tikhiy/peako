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

var placeholder  = require( './placeholder' );
// constants.PLACEHOLDER is for backward-compability.
var constants    = require( './constants' );
var indexOf      = require( './index-of' );

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

  // If no partialArgs were provided make a tiny optimization using built-in
  // `Function.bind`.
  if ( arguments.length <= 2 ) {
    return Function.prototype.bind.call( function_, thisArg );
  }

  var partialArgs = Array.prototype.slice.call( arguments, 2 );

  // If no placeholders in the partialArgs were provided make a tiny
  // optimization using built-in `Function.bind`.
  if ( indexOf( partialArgs, placeholder ) < 0 && indexOf( partialArgs, constants.PLACEHOLDER ) < 0 ) {
    return Function.prototype.call.apply( Function.prototype.bind, arguments );
  }

  return function bound () {
    // Call a function with new this (thisArg) and processed arguments.
    return function_.apply( thisArg, _processArgs( partialArgs, arguments ) );
  };
}

module.exports = bind;

},{"./constants":53,"./index-of":95,"./internal/process-args":101,"./placeholder":141}],45:[function(require,module,exports){
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

var placeholder = require( '../placeholder' );
// constants.PLACEHOLDER is for backward-compability.
var constants   = require( '../constants' );

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
  var i;
  var length;

  for ( i = 0, length = partialArgs.length; i < length; ++i ) {
    if ( partialArgs[ i ] === placeholder || partialArgs[ i ] === constants.PLACEHOLDER ) {
      result.push( args[ ++j ] );
    } else {
      result.push( partialArgs[ i ] );
    }
  }

  for ( length = args.length; j < length; ++j ) {
    result.push( args[ i ] );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJET01XcmFwcGVyL2luZGV4LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvY3NzLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZWFjaC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VuZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VxLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZmluZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2ZpcnN0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZ2V0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvbGFzdC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL21hcC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3BhcmVudC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlYWR5LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlQXR0ci5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlbW92ZVByb3AuanMiLCJET01XcmFwcGVyL3Byb3RvdHlwZS9zdGFjay5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3N0eWxlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvc3R5bGVzLmpzIiwiRXZlbnQuanMiLCJfLmpzIiwiYWNjZXNzLmpzIiwiYWpheC1vcHRpb25zLmpzIiwiYWpheC5qcyIsImFzc2lnbi1pbi5qcyIsImFzc2lnbi5qcyIsImJhc2UvYmFzZS1hc3NpZ24uanMiLCJiYXNlL2Jhc2UtY2xvbmUtYXJyYXkuanMiLCJiYXNlL2Jhc2UtY29weS1hcnJheS5qcyIsImJhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHkuanMiLCJiYXNlL2Jhc2UtZXhlYy5qcyIsImJhc2UvYmFzZS1mb3ItZWFjaC5qcyIsImJhc2UvYmFzZS1mb3ItaW4uanMiLCJiYXNlL2Jhc2UtZ2V0LmpzIiwiYmFzZS9iYXNlLWhhcy5qcyIsImJhc2UvYmFzZS1pbmRleC1vZi5qcyIsImJhc2UvYmFzZS1pbnZva2UuanMiLCJiYXNlL2Jhc2Uta2V5cy5qcyIsImJhc2UvYmFzZS1wcm9wZXJ0eS5qcyIsImJhc2UvYmFzZS1yYW5kb20uanMiLCJiYXNlL2Jhc2UtcmVtb3ZlLWF0dHIuanMiLCJiYXNlL2Jhc2Utc2V0LmpzIiwiYmFzZS9iYXNlLXZhbHVlcy5qcyIsImJlZm9yZS5qcyIsImJpbmQuanMiLCJjYWxsLWl0ZXJhdGVlLmpzIiwiY2FtZWxpemUuanMiLCJjYXN0LXBhdGguanMiLCJjbGFtcC5qcyIsImNsb25lLmpzIiwiY2xvc2VzdC1ub2RlLmpzIiwiY2xvc2VzdC5qcyIsImNvbXBvdW5kLmpzIiwiY29uc3RhbnRzLmpzIiwiY3JlYXRlLmpzIiwiY3JlYXRlL2NyZWF0ZS1hc3NpZ24uanMiLCJjcmVhdGUvY3JlYXRlLWVhY2guanMiLCJjcmVhdGUvY3JlYXRlLWVzY2FwZS5qcyIsImNyZWF0ZS9jcmVhdGUtZmluZC5qcyIsImNyZWF0ZS9jcmVhdGUtZmlyc3QuanMiLCJjcmVhdGUvY3JlYXRlLWZvci1lYWNoLmpzIiwiY3JlYXRlL2NyZWF0ZS1mb3ItaW4uanMiLCJjcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbi5qcyIsImNyZWF0ZS9jcmVhdGUtaW5kZXgtb2YuanMiLCJjcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mLmpzIiwiY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS5qcyIsImNyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AuanMiLCJjcmVhdGUvY3JlYXRlLXRyaW0uanMiLCJkZWJvdW5jZS5qcyIsImRlZmF1bHQtdG8uanMiLCJkZWZhdWx0cy5qcyIsImRlZmluZS1wcm9wZXJ0aWVzLmpzIiwiZGVmaW5lLXByb3BlcnR5LmpzIiwiZWFjaC1yaWdodC5qcyIsImVhY2guanMiLCJlc2NhcGUuanMiLCJldmVudC5qcyIsImZpbmQtaW5kZXguanMiLCJmaW5kLWxhc3QtaW5kZXguanMiLCJmaW5kLWxhc3QuanMiLCJmaW5kLmpzIiwiZm9yLWVhY2gtcmlnaHQuanMiLCJmb3ItZWFjaC5qcyIsImZvci1pbi1yaWdodC5qcyIsImZvci1pbi5qcyIsImZvci1vd24tcmlnaHQuanMiLCJmb3Itb3duLmpzIiwiZnJhZ21lbnQuanMiLCJmcm9tLXBhaXJzLmpzIiwiZ2V0LWVsZW1lbnQtaC5qcyIsImdldC1lbGVtZW50LXcuanMiLCJnZXQtcHJvdG90eXBlLW9mLmpzIiwiZ2V0LmpzIiwiaGFzLmpzIiwiaWRlbnRpdHkuanMiLCJpbmRleC1vZi5qcyIsImludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uLmpzIiwiaW50ZXJuYWwvY3NzLW51bWJlcnMuanMiLCJpbnRlcm5hbC9maXJzdC5qcyIsImludGVybmFsL2dldC1zdHlsZS5qcyIsImludGVybmFsL21lbW9pemUuanMiLCJpbnRlcm5hbC9wcm9jZXNzLWFyZ3MuanMiLCJpbnRlcm5hbC90ZXh0LWNvbnRlbnQuanMiLCJpbnRlcm5hbC90eXBlLmpzIiwiaW50ZXJuYWwvdW5lc2NhcGUuanMiLCJpbnRlcm5hbC93b3Jkcy5qcyIsImludmVydC5qcyIsImlzLWFycmF5LWxpa2Utb2JqZWN0LmpzIiwiaXMtYXJyYXktbGlrZS5qcyIsImlzLWFycmF5LmpzIiwiaXMtZG9tLWVsZW1lbnQuanMiLCJpcy1maW5pdGUuanMiLCJpcy1rZXkuanMiLCJpcy1sZW5ndGguanMiLCJpcy1uYW4uanMiLCJpcy1udW1iZXIuanMiLCJpcy1vYmplY3QtbGlrZS5qcyIsImlzLW9iamVjdC5qcyIsImlzLXBsYWluLW9iamVjdC5qcyIsImlzLXByaW1pdGl2ZS5qcyIsImlzLXNhZmUtaW50ZWdlci5qcyIsImlzLXN0cmluZy5qcyIsImlzLXN5bWJvbC5qcyIsImlzLXdpbmRvdy1saWtlLmpzIiwiaXMtd2luZG93LmpzIiwiaXNzZXQuanMiLCJpdGVyYWJsZS5qcyIsIml0ZXJhdGVlLmpzIiwia2V5cy1pbi5qcyIsImtleXMuanMiLCJsYXN0LWluZGV4LW9mLmpzIiwibWF0Y2hlcy1wcm9wZXJ0eS5qcyIsIm1hdGNoZXMtc2VsZWN0b3IuanMiLCJtZXRob2Qtb2YuanMiLCJtZXRob2QuanMiLCJtaXhpbi5qcyIsIm5vb3AuanMiLCJub3cuanMiLCJvbmNlLmpzIiwicGFyc2UtaHRtbC5qcyIsInBlYWtvLmpzIiwicGxhY2Vob2xkZXIuanMiLCJwcm9wZXJ0eS1vZi5qcyIsInByb3BlcnR5LmpzIiwicHJvcHMuanMiLCJyYW5kb20uanMiLCJzZXQtcHJvdG90eXBlLW9mLmpzIiwic2V0LmpzIiwic3VwcG9ydC9zdXBwb3J0LWRlZmluZS1wcm9wZXJ0eS5qcyIsInN1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlLmpzIiwic3VwcG9ydC9zdXBwb3J0LWtleXMuanMiLCJ0ZW1wbGF0ZS5qcyIsInRpbWVyLmpzIiwidGltZXN0YW1wLmpzIiwidG8ta2V5LmpzIiwidG8tb2JqZWN0LmpzIiwidHJpbS1lbmQuanMiLCJ0cmltLXN0YXJ0LmpzIiwidHJpbS5qcyIsInR5cGUuanMiLCJ1bmVzY2FwZS5qcyIsInVwcGVyLWZpcnN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NV3JhcHBlcjtcblxudmFyIF90ZXh0Q29udGVudCAgICAgICAgID0gcmVxdWlyZSggJy4uL2ludGVybmFsL3RleHQtY29udGVudCcgKTtcbnZhciBfZmlyc3QgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC9maXJzdCcgKTtcbnZhciBfd29yZHMgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC93b3JkcycgKTtcblxudmFyIHN1cHBvcnQgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL3N1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlJyApO1xuXG52YXIgY3JlYXRlUmVtb3ZlUHJvcGVydHkgPSByZXF1aXJlKCAnLi4vY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcCcgKTtcblxudmFyIGJhc2VGb3JFYWNoICAgICAgICAgID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItZWFjaCcgKTtcbnZhciBiYXNlRm9ySW4gICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWluJyApO1xuXG52YXIgaXNBcnJheUxpa2VPYmplY3QgICAgPSByZXF1aXJlKCAnLi4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG52YXIgaXNET01FbGVtZW50ICAgICAgICAgPSByZXF1aXJlKCAnLi4vaXMtZG9tLWVsZW1lbnQnICk7XG52YXIgZ2V0RWxlbWVudFcgICAgICAgICAgPSByZXF1aXJlKCAnLi4vZ2V0LWVsZW1lbnQtdycgKTtcbnZhciBnZXRFbGVtZW50SCAgICAgICAgICA9IHJlcXVpcmUoICcuLi9nZXQtZWxlbWVudC1oJyApO1xudmFyIHBhcnNlSFRNTCAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL3BhcnNlLWh0bWwnICk7XG52YXIgYWNjZXNzICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vYWNjZXNzJyApO1xudmFyIGV2ZW50ICAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2V2ZW50JyApO1xuXG52YXIgcnNlbGVjdG9yID0gL14oPzojKFtcXHctXSspfChbXFx3LV0rKXxcXC4oW1xcdy1dKykpJC87XG5cbmZ1bmN0aW9uIERPTVdyYXBwZXIgKCBzZWxlY3RvciwgY29udGV4dCApIHtcbiAgdmFyIG1hdGNoO1xuICB2YXIgbGlzdDtcbiAgdmFyIGk7XG5cbiAgLy8gXygpO1xuXG4gIGlmICggISBzZWxlY3RvciApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBfKCB3aW5kb3cgKTtcblxuICBpZiAoIGlzRE9NRWxlbWVudCggc2VsZWN0b3IgKSApIHtcbiAgICBfZmlyc3QoIHRoaXMsIHNlbGVjdG9yICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnICkge1xuICAgIGlmICggdHlwZW9mIGNvbnRleHQgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgaWYgKCAhIGNvbnRleHQuX3BlYWtvICkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IERPTVdyYXBwZXIoIGNvbnRleHQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCAhIGNvbnRleHRbIDAgXSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0ID0gY29udGV4dFsgMCBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKCBzZWxlY3Rvci5jaGFyQXQoIDAgKSAhPT0gJzwnICkge1xuICAgICAgbWF0Y2ggPSByc2VsZWN0b3IuZXhlYyggc2VsZWN0b3IgKTtcblxuICAgICAgLy8gXyggJ2EgPiBiICsgYycgKTtcbiAgICAgIC8vIF8oICcjaWQnLCAnLmFub3RoZXItZWxlbWVudCcgKVxuXG4gICAgICBpZiAoICEgbWF0Y2ggfHwgISBjb250ZXh0LmdldEVsZW1lbnRCeUlkICYmIG1hdGNoWyAxIF0gfHwgISBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiYgbWF0Y2hbIDMgXSApIHtcbiAgICAgICAgaWYgKCBtYXRjaCAmJiBtYXRjaFsgMSBdICkge1xuICAgICAgICAgIGxpc3QgPSBbIGNvbnRleHQucXVlcnlTZWxlY3Rvciggc2VsZWN0b3IgKSBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3QgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICk7XG4gICAgICAgIH1cblxuICAgICAgLy8gXyggJyNpZCcgKTtcblxuICAgICAgfSBlbHNlIGlmICggbWF0Y2hbIDEgXSApIHtcbiAgICAgICAgaWYgKCAoIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtYXRjaFsgMSBdICkgKSApIHtcbiAgICAgICAgICBfZmlyc3QoIHRoaXMsIGxpc3QgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gXyggJ3RhZycgKTtcblxuICAgICAgfSBlbHNlIGlmICggbWF0Y2hbIDIgXSApIHtcbiAgICAgICAgbGlzdCA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIG1hdGNoWyAyIF0gKTtcblxuICAgICAgLy8gXyggJy5jbGFzcycgKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdCA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggbWF0Y2hbIDMgXSApO1xuICAgICAgfVxuXG4gICAgLy8gXyggJzxkaXY+JyApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3QgPSBwYXJzZUhUTUwoIHNlbGVjdG9yLCBjb250ZXh0ICk7XG4gICAgfVxuXG4gIC8vIF8oIFsgLi4uIF0gKTtcblxuICB9IGVsc2UgaWYgKCBpc0FycmF5TGlrZU9iamVjdCggc2VsZWN0b3IgKSApIHtcbiAgICBsaXN0ID0gc2VsZWN0b3I7XG5cbiAgLy8gXyggZnVuY3Rpb24gKCBfICkgeyAuLi4gfSApO1xuXG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICByZXR1cm4gbmV3IERPTVdyYXBwZXIoIGRvY3VtZW50ICkucmVhZHkoIHNlbGVjdG9yICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnR290IHVuZXhwZWN0ZWQgc2VsZWN0b3I6ICcgKyBzZWxlY3RvciArICcuJyApO1xuICB9XG5cbiAgaWYgKCAhIGxpc3QgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5sZW5ndGggPSBsaXN0Lmxlbmd0aDtcblxuICBmb3IgKCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICB0aGlzWyBpIF0gPSBsaXN0WyBpIF07XG4gIH1cbn1cblxuRE9NV3JhcHBlci5wcm90b3R5cGUgPSB7XG4gIGVhY2g6ICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9lYWNoJyApLFxuICBlbmQ6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZW5kJyApLFxuICBlcTogICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZXEnICksXG4gIGZpbmQ6ICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9maW5kJyApLFxuICBmaXJzdDogICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZmlyc3QnICksXG4gIGdldDogICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9nZXQnICksXG4gIGxhc3Q6ICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9sYXN0JyApLFxuICBtYXA6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvbWFwJyApLFxuICBwYXJlbnQ6ICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvcGFyZW50JyApLFxuICByZWFkeTogICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVhZHknICksXG4gIHJlbW92ZTogICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9yZW1vdmUnICksXG4gIHJlbW92ZUF0dHI6IHJlcXVpcmUoICcuL3Byb3RvdHlwZS9yZW1vdmVBdHRyJyApLFxuICByZW1vdmVQcm9wOiByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVtb3ZlUHJvcCcgKSxcbiAgc3RhY2s6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3N0YWNrJyApLFxuICBzdHlsZTogICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvc3R5bGUnICksXG4gIHN0eWxlczogICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9zdHlsZXMnICksXG4gIGNzczogICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9jc3MnICksXG4gIGNvbnN0cnVjdG9yOiBET01XcmFwcGVyLFxuICBsZW5ndGg6IDAsXG4gIF9wZWFrbzogdHJ1ZVxufTtcblxuYmFzZUZvckluKCB7XG4gIHRyaWdnZXI6ICd0cmlnZ2VyJyxcbiAgb25jZTogICAgJ29uJyxcbiAgb2ZmOiAgICAgJ29mZicsXG4gIG9uOiAgICAgICdvbidcbn0sIGZ1bmN0aW9uICggbmFtZSwgbWV0aG9kTmFtZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIG1ldGhvZE5hbWUgXSA9IGZ1bmN0aW9uICggdHlwZXMsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApIHtcbiAgICB2YXIgcmVtb3ZlQWxsID0gbWV0aG9kTmFtZSA9PT0gJ29mZicgJiYgISBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBvbmNlID0gbWV0aG9kTmFtZSA9PT0gJ29uY2UnO1xuICAgIHZhciBlbGVtZW50O1xuICAgIHZhciBpO1xuICAgIHZhciBqO1xuICAgIHZhciBsO1xuXG4gICAgaWYgKCAhIHJlbW92ZUFsbCApIHtcbiAgICAgIHR5cGVzID0gX3dvcmRzKCB0eXBlcyApO1xuXG4gICAgICBpZiAoICEgdHlwZXMubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbCA9IHR5cGVzLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBvZmYoIHR5cGVzLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApXG4gICAgLy8gb2ZmKCB0eXBlcywgbGlzdGVuZXIgKVxuXG4gICAgaWYgKCBtZXRob2ROYW1lICE9PSAndHJpZ2dlcicgJiYgdHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgaWYgKCB0eXBlb2YgbGlzdGVuZXIgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICB1c2VDYXB0dXJlID0gbGlzdGVuZXI7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVyID0gc2VsZWN0b3I7XG4gICAgICBzZWxlY3RvciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgdXNlQ2FwdHVyZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB1c2VDYXB0dXJlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBlbGVtZW50ID0gdGhpc1sgaSBdO1xuXG4gICAgICBpZiAoIHJlbW92ZUFsbCApIHtcbiAgICAgICAgZXZlbnQub2ZmKCBlbGVtZW50ICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKCBqID0gMDsgaiA8IGw7ICsraiApIHtcbiAgICAgICAgICBldmVudFsgbmFtZSBdKCBlbGVtZW50LCB0eXBlc1sgaiBdLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUsIG9uY2UgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIGlmICggbWV0aG9kTmFtZSA9PT0gJ29uY2UnICkge1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBET01XcmFwcGVyLnByb3RvdHlwZS5vbmUgPSBmdW5jdGlvbiBvbmUgKCkge1xuICAgICAgaWYgKCBjb3VudCsrIDwgMSApIHtcbiAgICAgICAgY29uc29sZS5sb2coICdcIm9uZVwiIGlzIGRlcHJlY2F0ZWQgbm93LiBVc2UgXCJvbmNlXCIgaW5zdGVhZC4nICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm9uY2UuYXBwbHkoIHRoaXMsIFtdLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG4gICAgfTtcbiAgfVxufSwgdm9pZCAwLCB0cnVlLCBbICd0cmlnZ2VyJywgJ29uY2UnLCAnb2ZmJywgJ29uJyBdICk7XG5cbmJhc2VGb3JFYWNoKCBbXG4gICdibHVyJywgICAgICAgICdmb2N1cycsICAgICAgICdmb2N1c2luJyxcbiAgJ2ZvY3Vzb3V0JywgICAgJ3Jlc2l6ZScsICAgICAgJ3Njcm9sbCcsXG4gICdjbGljaycsICAgICAgICdkYmxjbGljaycsICAgICdtb3VzZWRvd24nLFxuICAnbW91c2V1cCcsICAgICAnbW91c2Vtb3ZlJywgICAnbW91c2VvdmVyJyxcbiAgJ21vdXNlb3V0JywgICAgJ21vdXNlZW50ZXInLCAgJ21vdXNlbGVhdmUnLFxuICAnY2hhbmdlJywgICAgICAnc2VsZWN0JywgICAgICAnc3VibWl0JyxcbiAgJ2tleWRvd24nLCAgICAgJ2tleXByZXNzJywgICAgJ2tleXVwJyxcbiAgJ2NvbnRleHRtZW51JywgJ3RvdWNoc3RhcnQnLCAgJ3RvdWNobW92ZScsXG4gICd0b3VjaGVuZCcsICAgICd0b3VjaGVudGVyJywgICd0b3VjaGxlYXZlJyxcbiAgJ3RvdWNoY2FuY2VsJywgJ2xvYWQnXG5dLCBmdW5jdGlvbiAoIGV2ZW50VHlwZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIGV2ZW50VHlwZSBdID0gZnVuY3Rpb24gKCBhcmcgKSB7XG4gICAgdmFyIGk7XG4gICAgdmFyIGw7XG5cbiAgICBpZiAoIHR5cGVvZiBhcmcgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmlnZ2VyKCBldmVudFR5cGUsIGFyZyApO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIHRoaXMub24oIGV2ZW50VHlwZSwgYXJndW1lbnRzWyBpIF0sIGZhbHNlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59LCB2b2lkIDAsIHRydWUgKTtcblxuYmFzZUZvckluKCB7XG4gIGRpc2FibGVkOiAnZGlzYWJsZWQnLFxuICBjaGVja2VkOiAgJ2NoZWNrZWQnLFxuICB2YWx1ZTogICAgJ3ZhbHVlJyxcbiAgdGV4dDogICAgICd0ZXh0Q29udGVudCcgaW4gZG9jdW1lbnQuYm9keSA/ICd0ZXh0Q29udGVudCcgOiBfdGV4dENvbnRlbnQsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICBodG1sOiAgICAgJ2lubmVySFRNTCdcbn0sIGZ1bmN0aW9uICgga2V5LCBtZXRob2ROYW1lICkge1xuICBET01XcmFwcGVyLnByb3RvdHlwZVsgbWV0aG9kTmFtZSBdID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICB2YXIgaTtcblxuICAgIGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIGlmICggISAoIGVsZW1lbnQgPSB0aGlzWyAwIF0gKSB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKCB0eXBlb2Yga2V5ICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICByZXR1cm4gZWxlbWVudFsga2V5IF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXkoIGVsZW1lbnQgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggKCBlbGVtZW50ID0gdGhpc1sgaSBdICkubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICAgIGVsZW1lbnRbIGtleSBdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrZXkoIGVsZW1lbnQsIHZhbHVlICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59LCB2b2lkIDAsIHRydWUsIFsgJ2Rpc2FibGVkJywgJ2NoZWNrZWQnLCAndmFsdWUnLCAndGV4dCcsICdodG1sJyBdICk7XG5cbiggZnVuY3Rpb24gKCkge1xuICB2YXIgcHJvcHMgPSByZXF1aXJlKCAnLi4vcHJvcHMnICk7XG5cbiAgZnVuY3Rpb24gX2F0dHIgKCBlbGVtZW50LCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKSB7XG4gICAgaWYgKCBlbGVtZW50Lm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCBwcm9wc1sga2V5IF0gfHwgISBzdXBwb3J0ICkge1xuICAgICAgcmV0dXJuIF9wcm9wKCBlbGVtZW50LCBwcm9wc1sga2V5IF0gfHwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICk7XG4gICAgfVxuXG4gICAgaWYgKCAhIGNoYWluYWJsZSApIHtcbiAgICAgIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZSgga2V5ICk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoIGtleSwgdmFsdWUgKTtcbiAgfVxuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLmF0dHIgPSBmdW5jdGlvbiBhdHRyICgga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbHVlLCBfYXR0ciApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIF9wcm9wICggZWxlbWVudCwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICkge1xuICAgIGlmICggISBjaGFpbmFibGUgKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFsga2V5IF07XG4gICAgfVxuXG4gICAgZWxlbWVudFsga2V5IF0gPSB2YWx1ZTtcbiAgfVxuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLnByb3AgPSBmdW5jdGlvbiBwcm9wICgga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbHVlLCBfcHJvcCApO1xuICB9O1xufSApKCk7XG5cbiggZnVuY3Rpb24gKCkge1xuICB2YXIgX3BlYWtvSWQgPSAwO1xuICB2YXIgX2RhdGEgPSB7fTtcblxuICBmdW5jdGlvbiBfYWNjZXNzRGF0YSAoIGVsZW1lbnQsIGtleSwgdmFsdWUsIGNoYWluYWJsZSApIHtcbiAgICB2YXIgYXR0cmlidXRlcztcbiAgICB2YXIgYXR0cmlidXRlO1xuICAgIHZhciBkYXRhO1xuICAgIHZhciBpO1xuICAgIHZhciBsO1xuXG4gICAgaWYgKCAhIGVsZW1lbnQuX3BlYWtvSWQgKSB7XG4gICAgICBlbGVtZW50Ll9wZWFrb0lkID0gKytfcGVha29JZDtcbiAgICB9XG5cbiAgICBpZiAoICEgKCBkYXRhID0gX2RhdGFbIGVsZW1lbnQuX3BlYWtvSWQgXSApICkge1xuICAgICAgZGF0YSA9IF9kYXRhWyBlbGVtZW50Ll9wZWFrb0lkIF0gPSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cblxuICAgICAgZm9yICggYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlcywgaSA9IDAsIGwgPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgICAgaWYgKCAhICggYXR0cmlidXRlID0gYXR0cmlidXRlc1sgaSBdICkubm9kZU5hbWUuaW5kZXhPZiggJ2RhdGEtJyApICkge1xuICAgICAgICAgIGRhdGFbIGF0dHJpYnV0ZS5ub2RlTmFtZS5zbGljZSggNSApIF0gPSBhdHRyaWJ1dGUubm9kZVZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCBjaGFpbmFibGUgKSB7XG4gICAgICBkYXRhWyBrZXkgXSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGF0YVsga2V5IF07XG4gICAgfVxuICB9XG5cbiAgRE9NV3JhcHBlci5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uIGRhdGEgKCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhY2Nlc3MoIHRoaXMsIGtleSwgdmFsdWUsIF9hY2Nlc3NEYXRhICk7XG4gIH07XG5cbiAgRE9NV3JhcHBlci5wcm90b3R5cGUucmVtb3ZlRGF0YSA9IGNyZWF0ZVJlbW92ZVByb3BlcnR5KCBmdW5jdGlvbiBfcmVtb3ZlRGF0YSAoIGVsZW1lbnQsIGtleSApIHtcbiAgICBpZiAoIGVsZW1lbnQuX3BlYWtvSWQgKSB7XG4gICAgICBkZWxldGUgX2RhdGFbIGVsZW1lbnQuX3BlYWtvSWQgXVsga2V5IF07XG4gICAgfVxuICB9ICk7XG59ICkoKTtcblxuYmFzZUZvckluKCB7IGhlaWdodDogZ2V0RWxlbWVudFcsIHdpZHRoOiBnZXRFbGVtZW50SCB9LCBmdW5jdGlvbiAoIGdldCwgbmFtZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIG5hbWUgXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHRoaXNbIDAgXSApIHtcbiAgICAgIHJldHVybiBnZXQoIHRoaXNbIDAgXSApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xufSwgdm9pZCAwLCB0cnVlLCBbICdoZWlnaHQnLCAnd2lkdGgnIF0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCAnLi4vLi4vaXMtYXJyYXknICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3NzICggaywgdiApIHtcbiAgaWYgKCBpc0FycmF5KCBrICkgKSB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVzKCBrICk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5zdHlsZSggaywgdiApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlYWNoICggZnVuICkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG4gIHZhciBpID0gMDtcblxuICBmb3IgKCA7IGkgPCBsZW47ICsraSApIHtcbiAgICBpZiAoIGZ1bi5jYWxsKCB0aGlzWyBpIF0sIGksIHRoaXNbIGkgXSApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi4nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5kICgpIHtcbiAgcmV0dXJuIHRoaXMuX3ByZXZpb3VzIHx8IG5ldyBET01XcmFwcGVyKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVxICggaW5kZXggKSB7XG4gIHJldHVybiB0aGlzLnN0YWNrKCB0aGlzLmdldCggaW5kZXggKSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi4nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluZCAoIHNlbGVjdG9yICkge1xuICByZXR1cm4gbmV3IERPTVdyYXBwZXIoIHNlbGVjdG9yLCB0aGlzICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpcnN0ICgpIHtcbiAgcmV0dXJuIHRoaXMuZXEoIDAgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9uZSA9IHJlcXVpcmUoICcuLi8uLi9iYXNlL2Jhc2UtY2xvbmUtYXJyYXknICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0ICggaW5kZXggKSB7XG4gIGlmICggdHlwZW9mIGluZGV4ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gY2xvbmUoIHRoaXMgKTtcbiAgfVxuXG4gIGlmICggaW5kZXggPCAwICkge1xuICAgIHJldHVybiB0aGlzWyB0aGlzLmxlbmd0aCArIGluZGV4IF07XG4gIH1cblxuICByZXR1cm4gdGhpc1sgaW5kZXggXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbGFzdCAoKSB7XG4gIHJldHVybiB0aGlzLmVxKCAtMSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXAgKCBmdW4gKSB7XG4gIHZhciBlbHMgPSB0aGlzLnN0YWNrKCk7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcbiAgdmFyIGVsO1xuICB2YXIgaTtcblxuICBlbHMubGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgZm9yICggaSA9IDA7IGkgPCBsZW47ICsraSApIHtcbiAgICBlbHNbIGkgXSA9IGZ1bi5jYWxsKCBlbCA9IHRoaXNbIGkgXSwgaSwgZWwgKTtcbiAgfVxuXG4gIHJldHVybiBlbHM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCAnLi4vLi4vYmFzZS9iYXNlLWluZGV4LW9mJyApO1xudmFyIG1hdGNoZXMgICAgID0gcmVxdWlyZSggJy4uLy4uL21hdGNoZXMtc2VsZWN0b3InICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyZW50ICggc2VsZWN0b3IgKSB7XG4gIHZhciBlbGVtZW50cyA9IHRoaXMuc3RhY2soKTtcbiAgdmFyIGVsZW1lbnQ7XG4gIHZhciBwYXJlbnQ7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIHBhcmVudCA9ICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlID09PSAxICYmIGVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICAgIGlmICggcGFyZW50ICYmIGJhc2VJbmRleE9mKCBlbGVtZW50cywgcGFyZW50ICkgPCAwICYmICggISBzZWxlY3RvciB8fCBtYXRjaGVzLmNhbGwoIHBhcmVudCwgc2VsZWN0b3IgKSApICkge1xuICAgICAgZWxlbWVudHNbIGVsZW1lbnRzLmxlbmd0aCsrIF0gPSBwYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV2ZW50ID0gcmVxdWlyZSggJy4uLy4uL2V2ZW50JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlYWR5ICggY2IgKSB7XG4gIHZhciBkb2MgPSB0aGlzWyAwIF07XG4gIHZhciByZWFkeVN0YXRlO1xuXG4gIGlmICggISBkb2MgfHwgZG9jLm5vZGVUeXBlICE9PSA5ICkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVhZHlTdGF0ZSA9IGRvYy5yZWFkeVN0YXRlO1xuXG4gIGlmICggZG9jLmF0dGFjaEV2ZW50ID8gcmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJyA6IHJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZXJuYXJ5XG4gICAgZXZlbnQub24oIGRvYywgJ0RPTUNvbnRlbnRMb2FkZWQnLCBudWxsLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjYigpO1xuICAgIH0sIGZhbHNlLCB0cnVlICk7XG4gIH0gZWxzZSB7XG4gICAgY2IoKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmUgKCkge1xuICB2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTtcbiAgdmFyIHBhcmVudE5vZGU7XG4gIHZhciBub2RlVHlwZTtcblxuICBmb3IgKCA7IGkgPj0gMDsgLS1pICkge1xuICAgIG5vZGVUeXBlID0gdGhpc1sgaSBdLm5vZGVUeXBlO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGJyYWNlLXJ1bGVzL2JyYWNlLW9uLXNhbWUtbGluZVxuICAgIGlmICggbm9kZVR5cGUgIT09IDEgJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSAzICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gOCAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDkgJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSAxMSApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICggKCBwYXJlbnROb2RlID0gdGhpc1sgaSBdLnBhcmVudE5vZGUgKSApIHtcbiAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHRoaXNbIGkgXSApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi4vLi4vY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcCcgKSggcmVxdWlyZSggJy4uLy4uL2Jhc2UvYmFzZS1yZW1vdmUtYXR0cicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuLi8uLi9jcmVhdGUvY3JlYXRlLXJlbW92ZS1wcm9wJyApKCBmdW5jdGlvbiBfcmVtb3ZlUHJvcCAoIGVsZW1lbnQsIGtleSApIHtcbiAgZGVsZXRlIGVsZW1lbnRbIGtleSBdO1xufSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2ZpcnN0ICAgICAgICA9IHJlcXVpcmUoICcuLi8uLi9pbnRlcm5hbC9maXJzdCcgKTtcblxudmFyIGJhc2VDb3B5QXJyYXkgPSByZXF1aXJlKCAnLi4vLi4vYmFzZS9iYXNlLWNvcHktYXJyYXknICk7XG5cbnZhciBET01XcmFwcGVyICAgID0gcmVxdWlyZSggJy4uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0YWNrICggZWxlbWVudHMgKSB7XG4gIHZhciB3cmFwcGVyID0gbmV3IERPTVdyYXBwZXIoKTtcblxuICBpZiAoIGVsZW1lbnRzICkge1xuICAgIGlmICggZWxlbWVudHMubGVuZ3RoICkge1xuICAgICAgYmFzZUNvcHlBcnJheSggd3JhcHBlciwgZWxlbWVudHMgKS5sZW5ndGggPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9maXJzdCggd3JhcHBlciwgZWxlbWVudHMgKTtcbiAgICB9XG4gIH1cblxuICB3cmFwcGVyLl9wcmV2aW91cyA9IHdyYXBwZXIucHJldk9iamVjdCA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG5cbiAgcmV0dXJuIHdyYXBwZXI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Nzc051bWJlcnMgICA9IHJlcXVpcmUoICcuLi8uLi9pbnRlcm5hbC9jc3MtbnVtYmVycycgKTtcbnZhciBfZ2V0U3R5bGUgICAgID0gcmVxdWlyZSggJy4uLy4uL2ludGVybmFsL2dldC1zdHlsZScgKTtcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuLi8uLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciBjYW1lbGl6ZSAgICAgPSByZXF1aXJlKCAnLi4vLi4vY2FtZWxpemUnICk7XG52YXIgYWNjZXNzICAgICAgID0gcmVxdWlyZSggJy4uLy4uL2FjY2VzcycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHlsZSAoIGtleSwgdmFsICkge1xuICB2YXIgcHggPSAnZG8tbm90LWFkZCc7XG5cbiAgLy8gQ29tcHV0ZSBweCBvciBhZGQgJ3B4JyB0byBgdmFsYCBub3cuXG5cbiAgaWYgKCB0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyAmJiAhIF9jc3NOdW1iZXJzWyBjYW1lbGl6ZSgga2V5ICkgXSApIHtcbiAgICBpZiAoIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICkge1xuICAgICAgdmFsICs9ICdweCc7XG4gICAgfSBlbHNlIGlmICggdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHB4ID0gJ2dvdC1hLWZ1bmN0aW9uJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoIGlzT2JqZWN0TGlrZSgga2V5ICkgKSB7XG4gICAgcHggPSAnZ290LWFuLW9iamVjdCc7XG4gIH1cblxuICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbCwgZnVuY3Rpb24gKCBlbGVtZW50LCBrZXksIHZhbCwgY2hhaW5hYmxlICkge1xuICAgIGlmICggZWxlbWVudC5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGtleSA9IGNhbWVsaXplKCBrZXkgKTtcblxuICAgIGlmICggISBjaGFpbmFibGUgKSB7XG4gICAgICByZXR1cm4gX2dldFN0eWxlKCBlbGVtZW50LCBrZXkgKTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmICggcHggPT09ICdnb3QtYS1mdW5jdGlvbicgfHwgcHggPT09ICdnb3QtYW4tb2JqZWN0JyAmJiAhIF9jc3NOdW1iZXJzWyBrZXkgXSApICkge1xuICAgICAgdmFsICs9ICdweCc7XG4gICAgfVxuXG4gICAgZWxlbWVudC5zdHlsZVsga2V5IF0gPSB2YWw7XG4gIH0gKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYW1lbGl6ZSA9IHJlcXVpcmUoICcuLi8uLi9jYW1lbGl6ZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHlsZXMgKCBrZXlzICkge1xuICB2YXIgZWxlbWVudCA9IHRoaXNbIDAgXTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgY29tcHV0ZWQ7XG4gIHZhciB2YWx1ZTtcbiAgdmFyIGtleTtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAga2V5ID0ga2V5c1sgaSBdO1xuXG4gICAgaWYgKCAhIGNvbXB1dGVkICkge1xuICAgICAgdmFsdWUgPSBlbGVtZW50LnN0eWxlWyAoIGtleSA9IGNhbWVsaXplKCBrZXkgKSApIF07XG4gICAgfVxuXG4gICAgaWYgKCAhIHZhbHVlICkge1xuICAgICAgaWYgKCAhIGNvbXB1dGVkICkge1xuICAgICAgICBjb21wdXRlZCA9IGdldENvbXB1dGVkU3R5bGUoIGVsZW1lbnQgKTtcbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCBrZXkgKTtcbiAgICB9XG5cbiAgICByZXN1bHQucHVzaCggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUFzc2lnbiA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1hc3NpZ24nICk7XG5cbnZhciBpc3NldCAgICAgID0gcmVxdWlyZSggJy4vaXNzZXQnICk7XG52YXIga2V5cyAgICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG5cbnZhciBkZWZhdWx0cyA9IFtcbiAgJ2FsdEtleScsICAgICAgICAnYnViYmxlcycsICAgICAgICAnY2FuY2VsYWJsZScsXG4gICdjYW5jZWxCdWJibGUnLCAgJ2NoYW5nZWRUb3VjaGVzJywgJ2N0cmxLZXknLFxuICAnY3VycmVudFRhcmdldCcsICdkZXRhaWwnLCAgICAgICAgICdldmVudFBoYXNlJyxcbiAgJ21ldGFLZXknLCAgICAgICAncGFnZVgnLCAgICAgICAgICAncGFnZVknLFxuICAnc2hpZnRLZXknLCAgICAgICd2aWV3JywgICAgICAgICAgICdjaGFyJyxcbiAgJ2NoYXJDb2RlJywgICAgICAna2V5JywgICAgICAgICAgICAna2V5Q29kZScsXG4gICdidXR0b24nLCAgICAgICAgJ2J1dHRvbnMnLCAgICAgICAgJ2NsaWVudFgnLFxuICAnY2xpZW50WScsICAgICAgICdvZmZzZXRYJywgICAgICAgICdvZmZzZXRZJyxcbiAgJ3BvaW50ZXJJZCcsICAgICAncG9pbnRlclR5cGUnLCAgICAncmVsYXRlZFRhcmdldCcsXG4gICdyZXR1cm5WYWx1ZScsICAgJ3NjcmVlblgnLCAgICAgICAgJ3NjcmVlblknLFxuICAndGFyZ2V0VG91Y2hlcycsICd0b0VsZW1lbnQnLCAgICAgICd0b3VjaGVzJyxcbiAgJ2lzVHJ1c3RlZCdcbl07XG5cbmZ1bmN0aW9uIEV2ZW50ICggb3JpZ2luYWwsIG9wdGlvbnMgKSB7XG4gIHZhciBpO1xuICB2YXIgaztcblxuICBpZiAoIHR5cGVvZiBvcmlnaW5hbCA9PT0gJ29iamVjdCcgKSB7XG4gICAgZm9yICggaSA9IGRlZmF1bHRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgaWYgKCBpc3NldCggayA9IGRlZmF1bHRzWyBpIF0sIG9yaWdpbmFsICkgKSB7XG4gICAgICAgIHRoaXNbIGsgXSA9IG9yaWdpbmFsWyBrIF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCBvcmlnaW5hbC50YXJnZXQgKSB7XG4gICAgICBpZiAoIG9yaWdpbmFsLnRhcmdldC5ub2RlVHlwZSA9PT0gMyApIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBvcmlnaW5hbC50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWwudGFyZ2V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3JpZ2luYWwgPSB0aGlzLm9yaWdpbmFsRXZlbnQgPSBvcmlnaW5hbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB0aGlzLndoaWNoID0gRXZlbnQud2hpY2goIG9yaWdpbmFsICk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pc1RydXN0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIG9yaWdpbmFsID09PSAnc3RyaW5nJyApIHtcbiAgICB0aGlzLnR5cGUgPSBvcmlnaW5hbDtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnICkge1xuICAgIHRoaXMudHlwZSA9IG9wdGlvbnM7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyApIHtcbiAgICBiYXNlQXNzaWduKCB0aGlzLCBvcHRpb25zLCBrZXlzKCBvcHRpb25zICkgKTtcbiAgfVxufVxuXG5FdmVudC5wcm90b3R5cGUgPSB7XG4gIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdCAoKSB7XG4gICAgaWYgKCB0aGlzLm9yaWdpbmFsICkge1xuICAgICAgaWYgKCB0aGlzLm9yaWdpbmFsLnByZXZlbnREZWZhdWx0ICkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9yaWdpbmFsLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmV0dXJuVmFsdWUgPSB0aGlzLm9yaWdpbmFsLnJldHVyblZhbHVlO1xuICAgIH1cbiAgfSxcblxuICBzdG9wUHJvcGFnYXRpb246IGZ1bmN0aW9uIHN0b3BQcm9wYWdhdGlvbiAoKSB7XG4gICAgaWYgKCB0aGlzLm9yaWdpbmFsICkge1xuICAgICAgaWYgKCB0aGlzLm9yaWdpbmFsLnN0b3BQcm9wYWdhdGlvbiApIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYW5jZWxCdWJibGUgPSB0aGlzLm9yaWdpbmFsLmNhbmNlbEJ1YmJsZTtcbiAgICB9XG4gIH0sXG5cbiAgY29uc3RydWN0b3I6IEV2ZW50XG59O1xuXG5FdmVudC53aGljaCA9IGZ1bmN0aW9uIHdoaWNoICggZXZlbnQgKSB7XG4gIGlmICggZXZlbnQud2hpY2ggKSB7XG4gICAgcmV0dXJuIGV2ZW50LndoaWNoO1xuICB9XG5cbiAgaWYgKCAhIGV2ZW50LnR5cGUuaW5kZXhPZiggJ2tleScgKSApIHtcbiAgICBpZiAoIHR5cGVvZiBldmVudC5jaGFyQ29kZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICByZXR1cm4gZXZlbnQuY2hhckNvZGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV2ZW50LmtleUNvZGU7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBldmVudC5idXR0b24gPT09ICd1bmRlZmluZWQnIHx8ICEgL14oPzptb3VzZXxwb2ludGVyfGNvbnRleHRtZW51fGRyYWd8ZHJvcCl8Y2xpY2svLnRlc3QoIGV2ZW50LnR5cGUgKSApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICggZXZlbnQuYnV0dG9uICYgMSApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoIGV2ZW50LmJ1dHRvbiAmIDIgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICAgIHJldHVybiAzO1xuICB9XG5cbiAgaWYgKCBldmVudC5idXR0b24gJiA0ICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICByZXR1cm4gMjtcbiAgfVxuXG4gIHJldHVybiAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi9ET01XcmFwcGVyJyApO1xuXG5mdW5jdGlvbiBfICggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG4gIHJldHVybiBuZXcgRE9NV3JhcHBlciggc2VsZWN0b3IsIGNvbnRleHQgKTtcbn1cblxuXy5mbiA9IF8ucHJvdG90eXBlID0gRE9NV3JhcHBlci5wcm90b3R5cGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG5fLmZuLmNvbnN0cnVjdG9yID0gXztcblxubW9kdWxlLmV4cG9ydHMgPSBfO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuL0RPTVdyYXBwZXInICk7XG52YXIgdHlwZSAgICAgICA9IHJlcXVpcmUoICcuL3R5cGUnICk7XG52YXIga2V5cyAgICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG5cbmZ1bmN0aW9uIGFjY2VzcyAoIG9iaiwga2V5LCB2YWwsIGZuLCBfbm9DaGVjayApIHtcbiAgdmFyIGNoYWluYWJsZSA9IF9ub0NoZWNrIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xuICB2YXIgYnVsayA9IGtleSA9PT0gbnVsbCB8fCBrZXkgPT09ICd1bmRlZmluZWQnO1xuICB2YXIgbGVuID0gb2JqLmxlbmd0aDtcbiAgdmFyIHJhdyA9IGZhbHNlO1xuICB2YXIgZTtcbiAgdmFyIGs7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoICEgX25vQ2hlY2sgJiYgdHlwZSgga2V5ICkgPT09ICdvYmplY3QnICkge1xuICAgIGZvciAoIGkgPSAwLCBrID0ga2V5cygga2V5ICksIGwgPSBrLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIGFjY2Vzcyggb2JqLCBrWyBpIF0sIGtleVsga1sgaSBdIF0sIGZuLCB0cnVlICk7XG4gICAgfVxuXG4gICAgY2hhaW5hYmxlID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCB0eXBlb2YgdmFsICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgcmF3ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIGJ1bGsgKSB7XG4gICAgICBpZiAoIHJhdyApIHtcbiAgICAgICAgZm4uY2FsbCggb2JqLCB2YWwgKTtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVsayA9IGZuO1xuXG4gICAgICAgIGZuID0gZnVuY3Rpb24gKCBlLCBrZXksIHZhbCApIHtcbiAgICAgICAgICByZXR1cm4gYnVsay5jYWxsKCBuZXcgRE9NV3JhcHBlciggZSApLCB2YWwgKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIGZuICkge1xuICAgICAgZm9yICggaSA9IDA7IGkgPCBsZW47ICsraSApIHtcbiAgICAgICAgZSA9IG9ialsgaSBdO1xuXG4gICAgICAgIGlmICggcmF3ICkge1xuICAgICAgICAgIGZuKCBlLCBrZXksIHZhbCwgdHJ1ZSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZuKCBlLCBrZXksIHZhbC5jYWxsKCBlLCBpLCBmbiggZSwga2V5ICkgKSwgdHJ1ZSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2hhaW5hYmxlID0gdHJ1ZTtcbiAgfVxuXG4gIGlmICggY2hhaW5hYmxlICkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBpZiAoIGJ1bGsgKSB7XG4gICAgcmV0dXJuIGZuLmNhbGwoIG9iaiApO1xuICB9XG5cbiAgaWYgKCBsZW4gKSB7XG4gICAgcmV0dXJuIGZuKCBvYmpbIDAgXSwga2V5ICk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhY2Nlc3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHByb3BlcnR5IHtPYmplY3R9IGhlYWRlcnNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0aW1lb3V0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gbWV0aG9kXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBBIHJlcXVlc3QgaGVhZGVycy5cbiAgICovXG4gIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCdcbiAgfSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGZvciBjYW5jZWwgYSByZXF1ZXN0LlxuICAgKi9cbiAgdGltZW91dDogMTAwMCAqIDYwLFxuXG4gIC8qKlxuICAgKiBBIHJlcXVlc3QgbWV0aG9kOiAnR0VUJywgJ1BPU1QnIChvdGhlcnMgYXJlIGlnbm9yZWQsIGluc3RlYWQsICdHRVQnIHdpbGwgYmUgdXNlZCkuXG4gICAqL1xuICBtZXRob2Q6ICdHRVQnXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIHR5cGVvZiBxcyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gIHZhciBxcztcblxuICB0cnkge1xuICAgIHFzID0gcmVxdWlyZSggJ3FzJyApO1xuICB9IGNhdGNoICggZXJyb3IgKSB7fVxufVxuXG52YXIgX29wdGlvbnMgPSByZXF1aXJlKCAnLi9hamF4LW9wdGlvbnMnICk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCAnLi9kZWZhdWx0cycgKTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgWE1MSHR0cFJlcXVlc3Q6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTU3MjY4XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjcmVhdGVIVFRQUmVxdWVzdCAoKSB7XG4gIHZhciBIVFRQRmFjdG9yaWVzOyB2YXIgaTtcblxuICBIVFRQRmFjdG9yaWVzID0gW1xuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwzLlhNTEhUVFAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMi5YTUxIVFRQLjYuMCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwyLlhNTEhUVFAuMy4wJyApO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNc3htbDIuWE1MSFRUUCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTWljcm9zb2Z0LlhNTEhUVFAnICk7XG4gICAgfVxuICBdO1xuXG4gIGZvciAoIGkgPSAwOyBpIDwgSFRUUEZhY3Rvcmllcy5sZW5ndGg7ICsraSApIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICggY3JlYXRlSFRUUFJlcXVlc3QgPSBIVFRQRmFjdG9yaWVzWyBpIF0gKSgpO1xuICAgIH0gY2F0Y2ggKCBleCApIHt9XG4gIH1cblxuICB0aHJvdyBFcnJvciggJ2Nhbm5vdCBjcmVhdGUgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0JyApO1xufVxuXG4vKipcbiAqIEBtZXRob2QgcGVha28uYWpheFxuICogQHBhcmFtICB7c3RyaW5nfG9iamVjdH0gcGF0aCAgICAgICAgICAgICAgQSBVUkwgb3Igb3B0aW9ucy5cbiAqIEBwYXJhbSAge29iamVjdH0gICAgICAgIFtvcHRpb25zXSAgICAgICAgIEFuIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICBbb3B0aW9ucy5wYXRoXSAgICBBIFVSTC5cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgIFtvcHRpb25zLm1ldGhvZF0gIEEgcmVxdWVzdCBtZXRob2QuIElmIG5vIHByZXNlbnQgR0VUIG9yIFBPU1Qgd2lsbCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZC5cbiAqIEBwYXJhbSAge2Jvb2xlYW59ICAgICAgIFtvcHRpb25zLmFzeW5jXSAgIERlZmF1bHQgdG8gYHRydWVgIHdoZW4gb3B0aW9ucyBzcGVjaWZpZWQsIG9yIGBmYWxzZWBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gbm8gb3B0aW9ucy5cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgIFtvcHRpb25zLnN1Y2Nlc3NdIFdpbGwgYmUgY2FsbGVkIHdoZW4gYSBzZXJ2ZXIgcmVzcG9uZCB3aXRoIDJ4eCBzdGF0dXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUuXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICBbb3B0aW9ucy5lcnJvcl0gICBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgc2VydmVyIHJlc3BvbmQgd2l0aCBvdGhlciBzdGF0dXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgb3IgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIHBhcnNpbmcgcmVzcG9uc2UuXG4gKiBAcmV0dXJuIHtzdHJpbmc/fSAgICAgICAgICAgICAgICAgICAgICAgICBSZXR1cm5zIGEgcmVzcG9uc2UgZGF0YSBpZiBhIHJlcXVlc3Qgd2FzIHN5bmNocm9ub3VzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyd2lzZSBgbnVsbGAuXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5TeW5jaHJvbm91cyAoZG8gbm90IHVzZSkgR0VUIHJlcXVlc3Q8L2NhcHRpb24+XG4gKiB2YXIgZGF0YSA9IGFqYXgoJy4vZGF0YS5qc29uJyk7XG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5TeW5jaHJvbm91cyAoZG8gbm90IHVzZSkgR0VUIHJlcXVlc3QsIHdpdGggY2FsbGJhY2tzPC9jYXB0aW9uPlxuICogdmFyIGRhdGEgPSBhamF4KCcuL2RhdGEuanNvbicsIHtcbiAqICAgc3VjY2Vzczogc3VjY2VzcyxcbiAqICAgYXN5bmM6ICAgZmFsc2VcbiAqIH0pO1xuICpcbiAqIGZ1bmN0aW9uIHN1Y2Nlc3Moc2FtZURhdGEpIHtcbiAqICAgY29uc29sZS5sb2coc2FtZURhdGEpO1xuICogfVxuICogQGV4YW1wbGUgPGNhcHRpb24+QXN5bmNocm9ub3VzIFBPU1QgcmVxdWVzdDwvY2FwdGlvbj5cbiAqIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAqICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcbiAqICAgY29uc29sZS5lcnJvcihtZXNzYWdlIHx8IHRoaXMuc3RhdHVzICsgJzogJyArIHRoaXMuc3RhdHVzVGV4dCk7XG4gKiB9XG4gKlxuICogdmFyIGhlYWRlcnMgPSB7XG4gKiAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAqIH07XG4gKlxuICogdmFyIGRhdGEgPSB7XG4gKiAgIHVzZXJuYW1lOiBkb2N1bWVudC5mb3Jtcy5zaWdudXAuZWxlbWVudHMudXNlcm5hbWUudmFsdWUsXG4gKiAgIHNleDogICAgICBkb2N1bWVudC5mb3Jtcy5zaWdudXAuZWxlbWVudHMuc2V4LnZhbHVlXG4gKiB9XG4gKlxuICogYWpheCgnL2FwaS9zaWdudXAvP3N0ZXA9MCcsIHtcbiAqICAgaGVhZGVyczogaGVhZGVycyxcbiAqICAgc3VjY2Vzczogc3VjY2VzcyxcbiAqICAgZXJyb3I6ICAgZXJyb3IsXG4gKiAgIGRhdGE6ICAgIGRhdGFcbiAqIH0pO1xuICovXG5mdW5jdGlvbiBhamF4ICggcGF0aCwgb3B0aW9ucyApIHtcbiAgdmFyIHRpbWVvdXRJZCA9IG51bGw7XG4gIHZhciBkYXRhID0gbnVsbDtcbiAgdmFyIHhociA9IGNyZWF0ZUhUVFBSZXF1ZXN0KCk7XG4gIHZhciByZXFDb250ZW50VHlwZTtcbiAgdmFyIG1ldGhvZDtcbiAgdmFyIGFzeW5jO1xuICB2YXIgbmFtZTtcblxuICAvLyBfLmFqYXgoIG9wdGlvbnMgKTtcbiAgLy8gYXN5bmMgPSBvcHRpb25zLmFzeW5jIHx8IHRydWVcbiAgaWYgKCB0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycgKSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzKCBfb3B0aW9ucywgcGF0aCApO1xuICAgIGFzeW5jID0gISAoICdhc3luYycgaW4gb3B0aW9ucyApIHx8IG9wdGlvbnMuYXN5bmM7XG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aDtcblxuICAvLyBfLmFqYXgoIHBhdGggKTtcbiAgLy8gYXN5bmMgPSBmYWxzZVxuICB9IGVsc2UgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucyA9PT0gbnVsbCApIHtcbiAgICBvcHRpb25zID0gX29wdGlvbnM7XG4gICAgYXN5bmMgPSBmYWxzZTtcblxuICAvLyBfLmFqYXgoIHBhdGgsIG9wdGlvbnMgKTtcbiAgLy8gYXN5bmMgPSBvcHRpb25zLmFzeW5jIHx8IHRydWVcbiAgfSBlbHNlIHtcbiAgICBvcHRpb25zID0gZGVmYXVsdHMoIF9vcHRpb25zLCBvcHRpb25zICk7XG4gICAgYXN5bmMgPSAhICggJ2FzeW5jJyBpbiBvcHRpb25zICkgfHwgb3B0aW9ucy5hc3luYztcbiAgfVxuXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc0NvbnRlbnRUeXBlO1xuICAgIHZhciBzdGF0dXM7XG4gICAgdmFyIG9iamVjdDtcbiAgICB2YXIgZXJyb3I7XG5cbiAgICBpZiAoIHRoaXMucmVhZHlTdGF0ZSAhPT0gNCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdGF0dXMgPSB0aGlzLnN0YXR1cyA9PT0gMTIyMyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgICAgID8gMjA0XG4gICAgICA6IHRoaXMuc3RhdHVzO1xuXG4gICAgcmVzQ29udGVudFR5cGUgPSB0aGlzLmdldFJlc3BvbnNlSGVhZGVyKCAnY29udGVudC10eXBlJyApO1xuXG4gICAgb2JqZWN0ID0ge1xuICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICBwYXRoOiBwYXRoXG4gICAgfTtcblxuICAgIGRhdGEgPSB0aGlzLnJlc3BvbnNlVGV4dDtcblxuICAgIGlmICggcmVzQ29udGVudFR5cGUgKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoICEgcmVzQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL2pzb24nICkgKSB7XG4gICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoIGRhdGEgKTtcbiAgICAgICAgfSBlbHNlIGlmICggISByZXNDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyApICkge1xuICAgICAgICAgIGRhdGEgPSBxcy5wYXJzZSggZGF0YSApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggX2Vycm9yICkge1xuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCAhIGVycm9yICYmIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwICkge1xuICAgICAgaWYgKCB0aW1lb3V0SWQgIT09IG51bGwgKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgICB9XG5cbiAgICAgIGlmICggb3B0aW9ucy5zdWNjZXNzICkge1xuICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuY2FsbCggdGhpcywgZGF0YSwgb2JqZWN0ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICggb3B0aW9ucy5lcnJvciApIHtcbiAgICAgIG9wdGlvbnMuZXJyb3IuY2FsbCggdGhpcywgZGF0YSwgb2JqZWN0ICk7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kO1xuXG4gIGlmICggdHlwZW9mIG1ldGhvZCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgbWV0aG9kID0gJ2RhdGEnIGluIG9wdGlvbnMgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZXJuYXJ5XG4gICAgICA/ICdQT1NUJ1xuICAgICAgOiAnR0VUJztcbiAgfVxuXG4gIHhoci5vcGVuKCBtZXRob2QsIHBhdGgsIGFzeW5jICk7XG5cbiAgaWYgKCBvcHRpb25zLmhlYWRlcnMgKSB7XG4gICAgZm9yICggbmFtZSBpbiBvcHRpb25zLmhlYWRlcnMgKSB7XG4gICAgICBpZiAoICEgaGFzT3duUHJvcGVydHkuY2FsbCggb3B0aW9ucy5oZWFkZXJzLCBuYW1lICkgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScgKSB7XG4gICAgICAgIHJlcUNvbnRlbnRUeXBlID0gb3B0aW9ucy5oZWFkZXJzWyBuYW1lIF07XG4gICAgICB9XG5cbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBuYW1lLCBvcHRpb25zLmhlYWRlcnNbIG5hbWUgXSApO1xuICAgIH1cbiAgfVxuXG4gIGlmICggYXN5bmMgJiYgdHlwZW9mIG9wdGlvbnMudGltZW91dCAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0aW9ucy50aW1lb3V0ICE9PSBudWxsICkge1xuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgIHhoci5hYm9ydCgpO1xuICAgIH0sIG9wdGlvbnMudGltZW91dCApO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgcmVxQ29udGVudFR5cGUgIT09ICd1bmRlZmluZWQnICYmIHJlcUNvbnRlbnRUeXBlICE9PSBudWxsICYmICdkYXRhJyBpbiBvcHRpb25zICkge1xuICAgIGlmICggISByZXFDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24vanNvbicgKSApIHtcbiAgICAgIHhoci5zZW5kKCBKU09OLnN0cmluZ2lmeSggb3B0aW9ucy5kYXRhICkgKTtcbiAgICB9IGVsc2UgaWYgKCAhIHJlcUNvbnRlbnRUeXBlLmluZGV4T2YoICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnICkgKSB7XG4gICAgICB4aHIuc2VuZCggcXMuc3RyaW5naWZ5KCBvcHRpb25zLmRhdGEgKSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB4aHIuc2VuZCggb3B0aW9ucy5kYXRhICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHhoci5zZW5kKCk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhamF4O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtYXNzaWduJyApKCByZXF1aXJlKCAnLi9rZXlzLWluJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWFzc2lnbicgKSggcmVxdWlyZSggJy4va2V5cycgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VBc3NpZ24gKCBvYmosIHNyYywgayApIHtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gay5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgb2JqWyBrWyBpIF0gXSA9IHNyY1sga1sgaSBdIF07XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlQ2xvbmVBcnJheSAoIGl0ZXJhYmxlICkge1xuICB2YXIgaSA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgdmFyIGNsb25lID0gQXJyYXkoIGkgKTtcblxuICB3aGlsZSAoIC0taSA+PSAwICkge1xuICAgIGlmICggaXNzZXQoIGksIGl0ZXJhYmxlICkgKSB7XG4gICAgICBjbG9uZVsgaSBdID0gaXRlcmFibGVbIGkgXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2xvbmU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdGFyZ2V0LCBzb3VyY2UgKSB7XG4gIGZvciAoIHZhciBpID0gc291cmNlLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIHRhcmdldFsgaSBdID0gc291cmNlWyBpIF07XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxudmFyIGRlZmluZUdldHRlciA9IE9iamVjdC5wcm90b3R5cGUuX19kZWZpbmVHZXR0ZXJfXztcbnZhciBkZWZpbmVTZXR0ZXIgPSBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lU2V0dGVyX187XG5cbmZ1bmN0aW9uIGJhc2VEZWZpbmVQcm9wZXJ0eSAoIG9iamVjdCwga2V5LCBkZXNjcmlwdG9yICkge1xuICB2YXIgaGFzR2V0dGVyID0gaXNzZXQoICdnZXQnLCBkZXNjcmlwdG9yICk7XG4gIHZhciBoYXNTZXR0ZXIgPSBpc3NldCggJ3NldCcsIGRlc2NyaXB0b3IgKTtcbiAgdmFyIGdldDtcbiAgdmFyIHNldDtcblxuICBpZiAoIGhhc0dldHRlciB8fCBoYXNTZXR0ZXIgKSB7XG4gICAgaWYgKCBoYXNHZXR0ZXIgJiYgdHlwZW9mKCBnZXQgPSBkZXNjcmlwdG9yLmdldCApICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnR2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbjogJyArIGdldCApO1xuICAgIH1cblxuICAgIGlmICggaGFzU2V0dGVyICYmIHR5cGVvZiggc2V0ID0gZGVzY3JpcHRvci5zZXQgKSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ1NldHRlciBtdXN0IGJlIGEgZnVuY3Rpb246ICcgKyBzZXQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGlzc2V0KCAnd3JpdGFibGUnLCBkZXNjcmlwdG9yICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdJbnZhbGlkIHByb3BlcnR5IGRlc2NyaXB0b3IuIENhbm5vdCBib3RoIHNwZWNpZnkgYWNjZXNzb3JzIGFuZCBhIHZhbHVlIG9yIHdyaXRhYmxlIGF0dHJpYnV0ZScgKTtcbiAgICB9XG5cbiAgICBpZiAoIGRlZmluZUdldHRlciApIHtcbiAgICAgIGlmICggaGFzR2V0dGVyICkge1xuICAgICAgICBkZWZpbmVHZXR0ZXIuY2FsbCggb2JqZWN0LCBrZXksIGdldCApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIGhhc1NldHRlciApIHtcbiAgICAgICAgZGVmaW5lU2V0dGVyLmNhbGwoIG9iamVjdCwga2V5LCBzZXQgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRXJyb3IoICdDYW5ub3QgZGVmaW5lIGEgZ2V0dGVyIG9yIHNldHRlcicgKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIGlzc2V0KCAndmFsdWUnLCBkZXNjcmlwdG9yICkgKSB7XG4gICAgb2JqZWN0WyBrZXkgXSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gIH0gZWxzZSBpZiAoICEgaXNzZXQoIGtleSwgb2JqZWN0ICkgKSB7XG4gICAgb2JqZWN0WyBrZXkgXSA9IHZvaWQgMDtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZURlZmluZVByb3BlcnR5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VFeGVjICggcmVnZXhwLCBzdHJpbmcgKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIHZhbHVlO1xuXG4gIHJlZ2V4cC5sYXN0SW5kZXggPSAwO1xuXG4gIHdoaWxlICggKCB2YWx1ZSA9IHJlZ2V4cC5leGVjKCBzdHJpbmcgKSApICkge1xuICAgIHJlc3VsdC5wdXNoKCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcbnZhciBpc3NldCAgICAgICAgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUZvckVhY2ggKCBhcnIsIGZuLCBjdHgsIGZyb21SaWdodCApIHtcbiAgdmFyIGlkeDtcbiAgdmFyIGk7XG4gIHZhciBqO1xuXG4gIGZvciAoIGkgPSAtMSwgaiA9IGFyci5sZW5ndGggLSAxOyBqID49IDA7IC0taiApIHtcbiAgICBpZiAoIGZyb21SaWdodCApIHtcbiAgICAgIGlkeCA9IGo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkeCA9ICsraTtcbiAgICB9XG5cbiAgICBpZiAoIGlzc2V0KCBpZHgsIGFyciApICYmIGNhbGxJdGVyYXRlZSggZm4sIGN0eCwgYXJyWyBpZHggXSwgaWR4LCBhcnIgKSA9PT0gZmFsc2UgKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJyO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbGxJdGVyYXRlZSA9IHJlcXVpcmUoICcuLi9jYWxsLWl0ZXJhdGVlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VGb3JJbiAoIG9iaiwgZm4sIGN0eCwgZnJvbVJpZ2h0LCBrZXlzICkge1xuICB2YXIga2V5O1xuICB2YXIgaTtcbiAgdmFyIGo7XG5cbiAgZm9yICggaSA9IC0xLCBqID0ga2V5cy5sZW5ndGggLSAxOyBqID49IDA7IC0taiApIHtcbiAgICBpZiAoIGZyb21SaWdodCApIHtcbiAgICAgIGtleSA9IGtleXNbIGogXTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5ID0ga2V5c1sgKytpIF07XG4gICAgfVxuXG4gICAgaWYgKCBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIG9ialsga2V5IF0sIGtleSwgb2JqICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlR2V0ICggb2JqLCBwYXRoLCBvZmYgKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGwgPSBwYXRoLmxlbmd0aCAtIG9mZjtcbiAgdmFyIGtleTtcblxuICBmb3IgKCA7IGkgPCBsOyArK2kgKSB7XG4gICAga2V5ID0gcGF0aFsgaSBdO1xuXG4gICAgaWYgKCBpc3NldCgga2V5LCBvYmogKSApIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzc2V0ID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VIYXMgKCBvYmosIHBhdGggKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGwgPSBwYXRoLmxlbmd0aDtcbiAgdmFyIGtleTtcblxuICBmb3IgKCA7IGkgPCBsOyArK2kgKSB7XG4gICAga2V5ID0gcGF0aFsgaSBdO1xuXG4gICAgaWYgKCBpc3NldCgga2V5LCBvYmogKSApIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIHZhciBiYXNlVG9JbmRleCA9IHJlcXVpcmUoICcuL2Jhc2UtdG8taW5kZXgnICk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgYmFzZUluZGV4T2ZcbiAqIEBwYXJhbSAge29iamVjdH0gIGFycmF5XG4gKiBAcGFyYW0gIHthbnl9ICAgICB2YWx1ZVxuICogQHBhcmFtICB7bnVtYmVyP30gZnJvbUluZGV4XG4gKiBAcGFyYW0gIHtib29sZWFufSBmcm9tUmlnaHRcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlSW5kZXhPZiAoIGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQgKSB7XG4gIC8vIGlmICggdHlwZW9mIGZyb21JbmRleCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gIC8vICAgZnJvbUluZGV4ID0gZnJvbVJpZ2h0XG4gIC8vICAgICA/IGFycmF5Lmxlbmd0aCAtIDFcbiAgLy8gICAgIDogMDtcbiAgLy8gfSBlbHNlIHtcbiAgLy8gICBmcm9tSW5kZXggPSBiYXNlVG9JbmRleCggZnJvbUluZGV4LCBhcnJheS5sZW5ndGggKTtcbiAgLy8gfVxuXG4gIGlmICggdmFsdWUgPT09IHZhbHVlICkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10ZXJuYXJ5XG4gICAgcmV0dXJuIGZyb21SaWdodFxuICAgICAgPyBBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbCggYXJyYXksIHZhbHVlIClcbiAgICAgIDogQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbCggYXJyYXksIHZhbHVlICk7XG4gIH1cblxuICBmb3IgKCB2YXIgbCA9IGFycmF5Lmxlbmd0aCAtIDEsIGkgPSBsOyBpID49IDA7IC0taSApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGVybmFyeVxuICAgIHZhciBpbmRleCA9IGZyb21SaWdodFxuICAgICAgPyBpXG4gICAgICA6IGwgLSBpO1xuXG4gICAgaWYgKCBhcnJheVsgaW5kZXggXSA9PT0gdmFsdWUgfHwgdmFsdWUgIT09IHZhbHVlICYmIGFycmF5WyBpbmRleCBdICE9PSBhcnJheVsgaW5kZXggXSApIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0ID0gcmVxdWlyZSggJy4vYmFzZS1nZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUludm9rZSAoIG9iamVjdCwgcGF0aCwgYXJncyApIHtcbiAgaWYgKCBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCBwYXRoLmxlbmd0aCA8PSAxICkge1xuICAgICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgMCBdIF0uYXBwbHkoIG9iamVjdCwgYXJncyApO1xuICAgIH1cblxuICAgIGlmICggKCBvYmplY3QgPSBnZXQoIG9iamVjdCwgcGF0aCwgMSApICkgKSB7XG4gICAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyBwYXRoLmxlbmd0aCAtIDEgXSBdLmFwcGx5KCBvYmplY3QsIGFyZ3MgKTtcbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0ICAgICA9IHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQta2V5cycgKTtcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4vYmFzZS1pbmRleC1vZicgKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuaWYgKCBzdXBwb3J0ID09PSAnaGFzLWEtYnVnJyApIHtcbiAgdmFyIF9rZXlzID0gW1xuICAgICd0b1N0cmluZycsXG4gICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAndmFsdWVPZicsXG4gICAgJ2hhc093blByb3BlcnR5JyxcbiAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgICAnY29uc3RydWN0b3InXG4gIF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUtleXMgKCBvYmplY3QgKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciBrZXk7XG4gIHZhciBpO1xuXG4gIGZvciAoIGtleSBpbiBvYmplY3QgKSB7XG4gICAgaWYgKCBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3QsIGtleSApICkge1xuICAgICAga2V5cy5wdXNoKCBrZXkgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIHN1cHBvcnQgPT09ICdoYXMtYS1idWcnICkge1xuICAgIGZvciAoIGkgPSBfa2V5cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggYmFzZUluZGV4T2YoIGtleXMsIF9rZXlzWyBpIF0gKSA8IDAgJiYgaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0LCBfa2V5c1sgaSBdICkgKSB7XG4gICAgICAgIGtleXMucHVzaCggX2tleXNbIGkgXSApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldCA9IHJlcXVpcmUoICcuL2Jhc2UtZ2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VQcm9wZXJ0eSAoIG9iamVjdCwgcGF0aCApIHtcbiAgaWYgKCBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCBwYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICByZXR1cm4gZ2V0KCBvYmplY3QsIHBhdGgsIDAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyAwIF0gXTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlUmFuZG9tICggbG93ZXIsIHVwcGVyICkge1xuICByZXR1cm4gbG93ZXIgKyBNYXRoLnJhbmRvbSgpICogKCB1cHBlciAtIGxvd2VyICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvcHMgPSByZXF1aXJlKCAnLi4vcHJvcHMnICk7XG5cbmlmICggcmVxdWlyZSggJy4uL3N1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlJyApICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9yZW1vdmVBdHRyICggZWxlbWVudCwga2V5ICkge1xuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCBrZXkgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3JlbW92ZUF0dHIgKCBlbGVtZW50LCBrZXkgKSB7XG4gICAgZGVsZXRlIGVsZW1lbnRbIHByb3BzWyBrZXkgXSB8fCBrZXkgXTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzc2V0ID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VTZXQgKCBvYmosIHBhdGgsIHZhbCApIHtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IHBhdGgubGVuZ3RoO1xuICB2YXIga2V5O1xuXG4gIGZvciAoIDsgaSA8IGw7ICsraSApIHtcbiAgICBrZXkgPSBwYXRoWyBpIF07XG5cbiAgICBpZiAoIGkgPT09IGwgLSAxICkge1xuICAgICAgb2JqID0gb2JqWyBrZXkgXSA9IHZhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB9IGVsc2UgaWYgKCBpc3NldCgga2V5LCBvYmogKSApIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF0gPSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlVmFsdWVzICggb2JqZWN0LCBrZXlzICkge1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB2YXIgdmFsdWVzID0gQXJyYXkoIGkgKTtcblxuICB3aGlsZSAoIC0taSA+PSAwICkge1xuICAgIHZhbHVlc1sgaSBdID0gb2JqZWN0WyBrZXlzWyBpIF0gXTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG52YXIgZGVmYXVsdFRvID0gcmVxdWlyZSggJy4vZGVmYXVsdC10bycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiZWZvcmUgKCBuLCBmbiApIHtcbiAgdmFyIHZhbHVlO1xuXG4gIGlmICggdHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggZm4sICdhIGZ1bmN0aW9uJyApO1xuICB9XG5cbiAgbiA9IGRlZmF1bHRUbyggbiwgMSApO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCAtLW4gPj0gMCApIHtcbiAgICAgIHZhbHVlID0gZm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfcHJvY2Vzc0FyZ3MgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC9wcm9jZXNzLWFyZ3MnICk7XG5cbnZhciBwbGFjZWhvbGRlciAgPSByZXF1aXJlKCAnLi9wbGFjZWhvbGRlcicgKTtcbi8vIGNvbnN0YW50cy5QTEFDRUhPTERFUiBpcyBmb3IgYmFja3dhcmQtY29tcGFiaWxpdHkuXG52YXIgY29uc3RhbnRzICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApO1xudmFyIGluZGV4T2YgICAgICA9IHJlcXVpcmUoICcuL2luZGV4LW9mJyApO1xuXG4vKipcbiAqINCt0YLQsCDRgNCw0YHRiNC40YDQtdC90L3QsNGPINCy0LXRgNGB0LjRjyDRgdGC0LDQvdC00LDRgNGC0L3QvtCz0L4gRVM1IGBGdW5jdGlvbi5iaW5kYCwg0LIg0LrQvtGC0L7RgNC+0Lkg0LXRgdGC0Ywg0L/QvtC00LTQtdGA0LbQutCwIHBsYWNlaG9sZGVyYNC+0LIuXG4gKiBAbWV0aG9kIF8uYmluZFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZ1bmN0aW9uXyAgINCc0LXRgtC+0LQsINC60L7RgtC+0YDRi9C5INC90LDQtNC+INC/0YDQuNCy0Y/Qt9Cw0YLRjCDQuiDQutC+0L3RgtC10LrRgdGC0YMgKNC90L7QstGL0LkgdGhpcykuXG4gKiBAcGFyYW0gIHthbnl9ICAgICAgdGhpc0FyZyAgICAg0JrQvtC90YLQtdC60YHRgiAo0L3QvtCy0YvQuSB0aGlzINC00LvRjyDQvNC10YLQvtC00LApLlxuICogQHBhcmFtICB7Li4uYW55fSAgIHBhcnRpYWxBcmdzINCn0LDRgdGC0LjRh9C90YvQtSDQsNGA0LPRg9C80LXQvdGC0Ysg0YEge0BsaW5rIF8ucGxhY2Vob2xkZXJ9LlxuICogQHJldHVybiB7RnVuY3Rpb259ICAgICAgICAgICAgINCd0L7QstGL0LksINC/0YDQuNCy0Y/Qt9Cw0L3QvdGL0Lkg0Log0L3QvtCy0L7QvNGDIHRoaXMg0LzQtdGC0L7QtC5cbiAqIEBleGFtcGxlXG4gKiB2YXIgYm91bmQgPSBfLmJpbmQoIGZ1bmN0aW9uXywgbmV3VGhpcywgXy5fLCAnIScgKTtcbiAqL1xuZnVuY3Rpb24gYmluZCAoIGZ1bmN0aW9uXywgdGhpc0FyZyApIHtcbiAgaWYgKCB0eXBlb2YgZnVuY3Rpb25fICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHRocm93IFR5cGVFcnJvciggJ2luIF8uYmluZCgpLCBwcm92aWRlZCBcImZ1bmN0aW9uX1wiIGlzIG5vdCBhIGZ1bmN0aW9uICgnICsgdHlwZW9mIGZ1bmN0aW9uXyArICcpJyApO1xuICB9XG5cbiAgLy8gSWYgbm8gcGFydGlhbEFyZ3Mgd2VyZSBwcm92aWRlZCBtYWtlIGEgdGlueSBvcHRpbWl6YXRpb24gdXNpbmcgYnVpbHQtaW5cbiAgLy8gYEZ1bmN0aW9uLmJpbmRgLlxuICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPD0gMiApIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbCggZnVuY3Rpb25fLCB0aGlzQXJnICk7XG4gIH1cblxuICB2YXIgcGFydGlhbEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAyICk7XG5cbiAgLy8gSWYgbm8gcGxhY2Vob2xkZXJzIGluIHRoZSBwYXJ0aWFsQXJncyB3ZXJlIHByb3ZpZGVkIG1ha2UgYSB0aW55XG4gIC8vIG9wdGltaXphdGlvbiB1c2luZyBidWlsdC1pbiBgRnVuY3Rpb24uYmluZGAuXG4gIGlmICggaW5kZXhPZiggcGFydGlhbEFyZ3MsIHBsYWNlaG9sZGVyICkgPCAwICYmIGluZGV4T2YoIHBhcnRpYWxBcmdzLCBjb25zdGFudHMuUExBQ0VIT0xERVIgKSA8IDAgKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsLmFwcGx5KCBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCwgYXJndW1lbnRzICk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gYm91bmQgKCkge1xuICAgIC8vIENhbGwgYSBmdW5jdGlvbiB3aXRoIG5ldyB0aGlzICh0aGlzQXJnKSBhbmQgcHJvY2Vzc2VkIGFyZ3VtZW50cy5cbiAgICByZXR1cm4gZnVuY3Rpb25fLmFwcGx5KCB0aGlzQXJnLCBfcHJvY2Vzc0FyZ3MoIHBhcnRpYWxBcmdzLCBhcmd1bWVudHMgKSApO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FsbEl0ZXJhdGVlICggZm4sIGN0eCwgdmFsLCBrZXksIG9iaiApIHtcbiAgaWYgKCB0eXBlb2YgY3R4ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gZm4oIHZhbCwga2V5LCBvYmogKTtcbiAgfVxuXG4gIHJldHVybiBmbi5jYWxsKCBjdHgsIHZhbCwga2V5LCBvYmogKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1cHBlckZpcnN0ID0gcmVxdWlyZSggJy4vdXBwZXItZmlyc3QnICk7XG5cbi8vIGNhbWVsaXplKCAnYmFja2dyb3VuZC1yZXBlYXQteCcgKTsgLy8gLT4gJ2JhY2tncm91bmRSZXBlYXRYJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplICggc3RyaW5nICkge1xuICB2YXIgd29yZHMgPSBzdHJpbmcubWF0Y2goIC9bMC05YS16XSsvZ2kgKTtcbiAgdmFyIHJlc3VsdDtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggISB3b3JkcyApIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXN1bHQgPSB3b3Jkc1sgMCBdLnRvTG93ZXJDYXNlKCk7XG5cbiAgZm9yICggaSA9IDEsIGwgPSB3b3Jkcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgcmVzdWx0ICs9IHVwcGVyRmlyc3QoIHdvcmRzWyBpIF0gKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3VuZXNjYXBlID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdW5lc2NhcGUnICk7XG52YXIgX3R5cGUgICAgID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdHlwZScgKTtcblxudmFyIGJhc2VFeGVjICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1leGVjJyApO1xuXG52YXIgaXNLZXkgICAgID0gcmVxdWlyZSggJy4vaXMta2V5JyApO1xudmFyIHRvS2V5ICAgICA9IHJlcXVpcmUoICcuL3RvLWtleScgKTtcblxudmFyIHJQcm9wZXJ0eSA9IC8oXnxcXC4pXFxzKihbX2Etel1cXHcqKVxccyp8XFxbXFxzKigoPzotKT8oPzpcXGQrfFxcZCpcXC5cXGQrKXwoXCJ8JykoKFteXFxcXF1cXFxcKFxcXFxcXFxcKSp8W15cXDRdKSopXFw0KVxccypcXF0vZ2k7XG5cbmZ1bmN0aW9uIHN0cmluZ1RvUGF0aCAoIHN0ciApIHtcbiAgdmFyIHBhdGggPSBiYXNlRXhlYyggclByb3BlcnR5LCBzdHIgKTtcbiAgdmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7XG4gIHZhciB2YWw7XG5cbiAgZm9yICggOyBpID49IDA7IC0taSApIHtcbiAgICB2YWwgPSBwYXRoWyBpIF07XG5cbiAgICAvLyAubmFtZVxuICAgIGlmICggdmFsWyAyIF0gKSB7XG4gICAgICBwYXRoWyBpIF0gPSB2YWxbIDIgXTtcbiAgICAvLyBbIFwiXCIgXSB8fCBbICcnIF1cbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsWyA1IF0gPT09ICdzdHJpbmcnICkge1xuICAgICAgcGF0aFsgaSBdID0gX3VuZXNjYXBlKCB2YWxbIDUgXSApO1xuICAgIC8vIFsgMCBdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdGhbIGkgXSA9IHZhbFsgMyBdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBjYXN0UGF0aCAoIHZhbCApIHtcbiAgdmFyIHBhdGg7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoIGlzS2V5KCB2YWwgKSApIHtcbiAgICByZXR1cm4gWyB0b0tleSggdmFsICkgXTtcbiAgfVxuXG4gIGlmICggX3R5cGUoIHZhbCApID09PSAnYXJyYXknICkge1xuICAgIHBhdGggPSBBcnJheSggbCA9IHZhbC5sZW5ndGggKTtcblxuICAgIGZvciAoIGkgPSBsIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBwYXRoWyBpIF0gPSB0b0tleSggdmFsWyBpIF0gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHN0cmluZ1RvUGF0aCggJycgKyB2YWwgKTtcbiAgfVxuXG4gIHJldHVybiBwYXRoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RQYXRoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsYW1wICggdmFsdWUsIGxvd2VyLCB1cHBlciApIHtcbiAgaWYgKCB2YWx1ZSA+PSB1cHBlciApIHtcbiAgICByZXR1cm4gdXBwZXI7XG4gIH1cblxuICBpZiAoIHZhbHVlIDw9IGxvd2VyICkge1xuICAgIHJldHVybiBsb3dlcjtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoICcuL2dldC1wcm90b3R5cGUtb2YnICk7XG52YXIgaXNPYmplY3RMaWtlICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciB0b09iamVjdCAgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoICcuL2NyZWF0ZScgKTtcbnZhciBlYWNoICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvbmUgKCBkZWVwLCB0YXJnZXQsIGd1YXJkICkge1xuICB2YXIgY2xuO1xuXG4gIGlmICggdHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgfHwgZ3VhcmQgKSB7XG4gICAgdGFyZ2V0ID0gZGVlcDtcbiAgICBkZWVwID0gdHJ1ZTtcbiAgfVxuXG4gIGNsbiA9IGNyZWF0ZSggZ2V0UHJvdG90eXBlT2YoIHRhcmdldCA9IHRvT2JqZWN0KCB0YXJnZXQgKSApICk7XG5cbiAgZWFjaCggdGFyZ2V0LCBmdW5jdGlvbiAoIHZhbHVlLCBrZXksIHRhcmdldCApIHtcbiAgICBpZiAoIHZhbHVlID09PSB0YXJnZXQgKSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IHRoaXM7XG4gICAgfSBlbHNlIGlmICggZGVlcCAmJiBpc09iamVjdExpa2UoIHZhbHVlICkgKSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IGNsb25lKCBkZWVwLCB2YWx1ZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IHZhbHVlO1xuICAgIH1cbiAgfSwgY2xuICk7XG5cbiAgcmV0dXJuIGNsbjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9zZXN0ID0gcmVxdWlyZSggJy4vY2xvc2VzdCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9zZXN0Tm9kZSAoIGUsIGMgKSB7XG4gIGlmICggdHlwZW9mIGMgPT09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiBjbG9zZXN0LmNhbGwoIGUsIGMgKTtcbiAgfVxuXG4gIGRvIHtcbiAgICBpZiAoIGUgPT09IGMgKSB7XG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIH0gd2hpbGUgKCAoIGUgPSBlLnBhcmVudE5vZGUgKSApO1xuXG4gIHJldHVybiBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1hdGNoZXMgPSByZXF1aXJlKCAnLi9tYXRjaGVzLXNlbGVjdG9yJyApO1xuXG52YXIgY2xvc2VzdDtcblxuaWYgKCB0eXBlb2YgRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgISAoIGNsb3Nlc3QgPSBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ICkgKSB7XG4gIGNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0ICggc2VsZWN0b3IgKSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCBtYXRjaGVzLmNhbGwoIGVsZW1lbnQsIHNlbGVjdG9yICkgKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCAoIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQgKSApO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvc2VzdDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3VuZCAoIGZ1bmN0aW9ucyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbXBvdW5kZWQgKCkge1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGZvciAoIGkgPSAwLCBsID0gZnVuY3Rpb25zLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIHZhbHVlID0gZnVuY3Rpb25zWyBpIF0uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBFUlI6IHtcbiAgICBJTlZBTElEX0FSR1M6ICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50cycsXG4gICAgRlVOQ1RJT05fRVhQRUNURUQ6ICAgICAnRXhwZWN0ZWQgYSBmdW5jdGlvbicsXG4gICAgU1RSSU5HX0VYUEVDVEVEOiAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcnLFxuICAgIFVOREVGSU5FRF9PUl9OVUxMOiAgICAgJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcsXG4gICAgUkVEVUNFX09GX0VNUFRZX0FSUkFZOiAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScsXG4gICAgTk9fUEFUSDogICAgICAgICAgICAgICAnTm8gcGF0aCB3YXMgZ2l2ZW4nXG4gIH0sXG5cbiAgTUFYX0FSUkFZX0xFTkdUSDogNDI5NDk2NzI5NSxcbiAgTUFYX1NBRkVfSU5UOiAgICAgOTAwNzE5OTI1NDc0MDk5MSxcbiAgTUlOX1NBRkVfSU5UOiAgICAtOTAwNzE5OTI1NDc0MDk5MSxcblxuICBERUVQOiAgICAgICAgIDEsXG4gIERFRVBfS0VFUF9GTjogMixcblxuICBQTEFDRUhPTERFUjoge31cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBjcmVhdGU7XG5cbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSggJy4vZGVmaW5lLXByb3BlcnRpZXMnICk7XG52YXIgc2V0UHJvdG90eXBlT2YgICA9IHJlcXVpcmUoICcuL3NldC1wcm90b3R5cGUtb2YnICk7XG52YXIgaXNQcmltaXRpdmUgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcblxuZnVuY3Rpb24gQyAoKSB7fVxuXG5mdW5jdGlvbiBjcmVhdGUgKCBwcm90b3R5cGUsIGRlc2NyaXB0b3JzICkge1xuICB2YXIgb2JqZWN0O1xuXG4gIGlmICggcHJvdG90eXBlICE9PSBudWxsICYmIGlzUHJpbWl0aXZlKCBwcm90b3R5cGUgKSApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoICdPYmplY3QgcHJvdG90eXBlIG1heSBvbmx5IGJlIGFuIE9iamVjdCBvciBudWxsOiAnICsgcHJvdG90eXBlICk7XG4gIH1cblxuICBDLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcblxuICBvYmplY3QgPSBuZXcgQygpO1xuXG4gIEMucHJvdG90eXBlID0gbnVsbDtcblxuICBpZiAoIHByb3RvdHlwZSA9PT0gbnVsbCApIHtcbiAgICBzZXRQcm90b3R5cGVPZiggb2JqZWN0LCBudWxsICk7XG4gIH1cblxuICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPj0gMiApIHtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKCBvYmplY3QsIGRlc2NyaXB0b3JzICk7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VBc3NpZ24gPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWFzc2lnbicgKTtcbnZhciBFUlIgICAgICAgID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlQXNzaWduICgga2V5cyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGFzc2lnbiAoIG9iaiApIHtcbiAgICB2YXIgc3JjO1xuICAgIHZhciBsO1xuICAgIHZhciBpO1xuXG4gICAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSAxLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIHNyYyA9IGFyZ3VtZW50c1sgaSBdO1xuXG4gICAgICBpZiAoIHNyYyAhPT0gbnVsbCAmJiB0eXBlb2Ygc3JjICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgYmFzZUFzc2lnbiggb2JqLCBzcmMsIGtleXMoIHNyYyApICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlRm9yRWFjaCAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1lYWNoJyApO1xudmFyIGJhc2VGb3JJbiAgICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWluJyApO1xudmFyIGlzQXJyYXlMaWtlICA9IHJlcXVpcmUoICcuLi9pcy1hcnJheS1saWtlJyApO1xudmFyIHRvT2JqZWN0ICAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmF0ZWUgICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xudmFyIGtleXMgICAgICAgICA9IHJlcXVpcmUoICcuLi9rZXlzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVhY2ggKCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBlYWNoICggb2JqLCBmbiwgY3R4ICkge1xuXG4gICAgb2JqID0gdG9PYmplY3QoIG9iaiApO1xuXG4gICAgZm4gID0gaXRlcmF0ZWUoIGZuICk7XG5cbiAgICBpZiAoIGlzQXJyYXlMaWtlKCBvYmogKSApIHtcbiAgICAgIHJldHVybiBiYXNlRm9yRWFjaCggb2JqLCBmbiwgY3R4LCBmcm9tUmlnaHQgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZUZvckluKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCwga2V5cyggb2JqICkgKTtcblxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFc2NhcGUgKCByZWdleHAsIG1hcCApIHtcbiAgZnVuY3Rpb24gcmVwbGFjZXIgKCBjICkge1xuICAgIHJldHVybiBtYXBbIGMgXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBlc2NhcGUgKCBzdHJpbmcgKSB7XG4gICAgaWYgKCBzdHJpbmcgPT09IG51bGwgfHwgdHlwZW9mIHN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuICggc3RyaW5nICs9ICcnICkucmVwbGFjZSggcmVnZXhwLCByZXBsYWNlciApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbGxJdGVyYXRlZSA9IHJlcXVpcmUoICcuLi9jYWxsLWl0ZXJhdGVlJyApO1xudmFyIHRvT2JqZWN0ICAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmFibGUgICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhYmxlJyApO1xudmFyIGl0ZXJhdGVlICAgICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcbnZhciBpc3NldCAgICAgICAgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRmluZCAoIHJldHVybkluZGV4LCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmaW5kICggYXJyLCBmbiwgY3R4ICkge1xuICAgIHZhciBqID0gKCBhcnIgPSBpdGVyYWJsZSggdG9PYmplY3QoIGFyciApICkgKS5sZW5ndGggLSAxO1xuICAgIHZhciBpID0gLTE7XG4gICAgdmFyIGlkeDtcbiAgICB2YXIgdmFsO1xuXG4gICAgZm4gPSBpdGVyYXRlZSggZm4gKTtcblxuICAgIGZvciAoIDsgaiA+PSAwOyAtLWogKSB7XG4gICAgICBpZiAoIGZyb21SaWdodCApIHtcbiAgICAgICAgaWR4ID0gajtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlkeCA9ICsraTtcbiAgICAgIH1cblxuICAgICAgdmFsID0gYXJyWyBpZHggXTtcblxuICAgICAgaWYgKCBpc3NldCggaWR4LCBhcnIgKSAmJiBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIHZhbCwgaWR4LCBhcnIgKSApIHtcbiAgICAgICAgaWYgKCByZXR1cm5JbmRleCApIHtcbiAgICAgICAgICByZXR1cm4gaWR4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIHJldHVybkluZGV4ICkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGaXJzdCAoIG5hbWUgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIHN0ciApIHtcbiAgICBpZiAoIHN0ciA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gICAgfVxuXG4gICAgcmV0dXJuICggc3RyICs9ICcnICkuY2hhckF0KCAwIClbIG5hbWUgXSgpICsgc3RyLnNsaWNlKCAxICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUZvckVhY2ggPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1lYWNoJyApO1xudmFyIHRvT2JqZWN0ICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcbnZhciBpdGVyYXRlZSAgICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcbnZhciBpdGVyYWJsZSAgICA9IHJlcXVpcmUoICcuLi9pdGVyYWJsZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGb3JFYWNoICggZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9yRWFjaCAoIGFyciwgZm4sIGN0eCApIHtcbiAgICByZXR1cm4gYmFzZUZvckVhY2goIGl0ZXJhYmxlKCB0b09iamVjdCggYXJyICkgKSwgaXRlcmF0ZWUoIGZuICksIGN0eCwgZnJvbVJpZ2h0ICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUZvckluID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItaW4nICk7XG52YXIgdG9PYmplY3QgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcbnZhciBpdGVyYXRlZSAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRm9ySW4gKCBrZXlzLCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb3JJbiAoIG9iaiwgZm4sIGN0eCApIHtcbiAgICByZXR1cm4gYmFzZUZvckluKCBvYmogPSB0b09iamVjdCggb2JqICksIGl0ZXJhdGVlKCBmbiApLCBjdHgsIGZyb21SaWdodCwga2V5cyggb2JqICkgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTXVzdCBiZSAnV2lkdGgnIG9yICdIZWlnaHQnIChjYXBpdGFsaXplZCkuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlR2V0RWxlbWVudERpbWVuc2lvbiAoIG5hbWUgKSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1dpbmRvd3xOb2RlfSBlXG4gICAqL1xuICByZXR1cm4gZnVuY3Rpb24gKCBlICkge1xuICAgIHZhciB2O1xuICAgIHZhciBiO1xuICAgIHZhciBkO1xuXG4gICAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgYSB3aW5kb3dcblxuICAgIGlmICggZS53aW5kb3cgPT09IGUgKSB7XG5cbiAgICAgIC8vIGlubmVyV2lkdGggYW5kIGlubmVySGVpZ2h0IGluY2x1ZGVzIGEgc2Nyb2xsYmFyIHdpZHRoLCBidXQgaXQgaXMgbm90XG4gICAgICAvLyBzdXBwb3J0ZWQgYnkgb2xkZXIgYnJvd3NlcnNcblxuICAgICAgdiA9IE1hdGgubWF4KCBlWyAnaW5uZXInICsgbmFtZSBdIHx8IDAsIGUuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50WyAnY2xpZW50JyArIG5hbWUgXSApO1xuXG4gICAgLy8gaWYgdGhlIGVsZW1lbnRzIGlzIGEgZG9jdW1lbnRcblxuICAgIH0gZWxzZSBpZiAoIGUubm9kZVR5cGUgPT09IDkgKSB7XG5cbiAgICAgIGIgPSBlLmJvZHk7XG4gICAgICBkID0gZS5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgIHYgPSBNYXRoLm1heChcbiAgICAgICAgYlsgJ3Njcm9sbCcgKyBuYW1lIF0sXG4gICAgICAgIGRbICdzY3JvbGwnICsgbmFtZSBdLFxuICAgICAgICBiWyAnb2Zmc2V0JyArIG5hbWUgXSxcbiAgICAgICAgZFsgJ29mZnNldCcgKyBuYW1lIF0sXG4gICAgICAgIGJbICdjbGllbnQnICsgbmFtZSBdLFxuICAgICAgICBkWyAnY2xpZW50JyArIG5hbWUgXSApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHYgPSBlWyAnY2xpZW50JyArIG5hbWUgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdjtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtaW5kZXgtb2YnICk7XG5cbnZhciB0b09iamVjdCAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgY3JlYXRlSW5kZXhPZlxuICogQHBhcmFtICB7Ym9vbGVhbn0gIGZyb21SaWdodFxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlSW5kZXhPZiAoIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGluZGV4T2YgKCBhcnJheSwgdmFsdWUsIGZyb21JbmRleCApIHtcbiAgICByZXR1cm4gYmFzZUluZGV4T2YoIHRvT2JqZWN0KCBhcnJheSApLCB2YWx1ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuLi9jYXN0LXBhdGgnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUHJvcGVydHlPZiAoIGJhc2VQcm9wZXJ0eSwgdXNlQXJncyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggb2JqZWN0ICkge1xuICAgIHZhciBhcmdzO1xuXG4gICAgaWYgKCB1c2VBcmdzICkge1xuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgICAgaWYgKCAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gYmFzZVByb3BlcnR5KCBvYmplY3QsIHBhdGgsIGFyZ3MgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4uL2Nhc3QtcGF0aCcgKTtcbnZhciBub29wICAgICA9IHJlcXVpcmUoICcuLi9ub29wJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVByb3BlcnR5ICggYmFzZVByb3BlcnR5LCB1c2VBcmdzICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgIHZhciBhcmdzO1xuXG4gICAgaWYgKCAhICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGggKSB7XG4gICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG5cbiAgICBpZiAoIHVzZUFyZ3MgKSB7XG4gICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoIG9iamVjdCApIHtcbiAgICAgIHJldHVybiBiYXNlUHJvcGVydHkoIG9iamVjdCwgcGF0aCwgYXJncyApO1xuICAgIH07XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3dvcmRzID0gcmVxdWlyZSggJy4uL2ludGVybmFsL3dvcmRzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jcmVhdGVSZW1vdmVQcm9wICggX3JlbW92ZVByb3AgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIGtleXMgKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG4gICAgdmFyIGo7XG5cbiAgICBpZiAoIHR5cGVvZiBrZXlzID09PSAnc3RyaW5nJyAgKSB7XG4gICAgICBrZXlzID0gX3dvcmRzKCBrZXlzICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZm9yICggaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgICAgIF9yZW1vdmVQcm9wKCBlbGVtZW50LCBrZXlzWyBqIF0gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVUcmltICggcmVnZXhwICkge1xuICByZXR1cm4gZnVuY3Rpb24gdHJpbSAoIHN0cmluZyApIHtcbiAgICBpZiAoIHN0cmluZyA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyaW5nID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gICAgfVxuXG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS5yZXBsYWNlKCByZWdleHAsICcnICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UgKCBtYXhXYWl0LCBmbiApIHtcbiAgdmFyIHRpbWVvdXRJZCA9IG51bGw7XG5cbiAgaWYgKCB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicgKSB7XG4gICAgdGhyb3cgX0FyZ3VtZW50RXhjZXB0aW9uKCBmbiwgJ2EgZnVuY3Rpb24nICk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgIGlmICggdGltZW91dElkICE9PSBudWxsICkge1xuICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SWQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0LmFwcGx5KCBudWxsLCBbIGZuLCBtYXhXYWl0IF0uY29uY2F0KCBbXS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoIGZuLCBtYXhXYWl0ICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsICgpIHtcbiAgICBpZiAoIHRpbWVvdXRJZCAhPT0gbnVsbCApIHtcbiAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgICB0aW1lb3V0SWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVib3VuY2VkOiBkZWJvdW5jZWQsXG4gICAgY2FuY2VsOiAgICBjYW5jZWxcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmYXVsdFRvICggdmFsdWUsIGRlZmF1bHRWYWx1ZSApIHtcbiAgaWYgKCB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSB2YWx1ZSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1peGluID0gcmVxdWlyZSggJy4vbWl4aW4nICk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRzICggZGVmYXVsdHMsIG9iamVjdCApIHtcbiAgaWYgKCBvYmplY3QgKSB7XG4gICAgcmV0dXJuIG1peGluKCB7fSwgZGVmYXVsdHMsIG9iamVjdCApO1xuICB9XG5cbiAgcmV0dXJuIG1peGluKCB7fSwgZGVmYXVsdHMgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1cHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3N1cHBvcnQvc3VwcG9ydC1kZWZpbmUtcHJvcGVydHknICk7XG5cbnZhciBiYXNlRGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgaXNQcmltaXRpdmUgICAgICAgID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xudmFyIGVhY2ggICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gnICk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0aWVzO1xuXG5pZiAoIHN1cHBvcnQgIT09ICdmdWxsJyApIHtcbiAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMgKCBvYmplY3QsIGRlc2NyaXB0b3JzICkge1xuICAgIGlmICggc3VwcG9ydCAhPT0gJ25vdC1zdXBwb3J0ZWQnICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBvYmplY3QsIGRlc2NyaXB0b3JzICk7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG4gICAgfVxuXG4gICAgaWYgKCBpc1ByaW1pdGl2ZSggb2JqZWN0ICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdkZWZpbmVQcm9wZXJ0aWVzIGNhbGxlZCBvbiBub24tb2JqZWN0JyApO1xuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIGRlc2NyaXB0b3JzICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogJyArIGRlc2NyaXB0b3JzICk7XG4gICAgfVxuXG4gICAgZWFjaCggZGVzY3JpcHRvcnMsIGZ1bmN0aW9uICggZGVzY3JpcHRvciwga2V5ICkge1xuICAgICAgaWYgKCBpc1ByaW1pdGl2ZSggZGVzY3JpcHRvciApICkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogJyArIGRlc2NyaXB0b3IgKTtcbiAgICAgIH1cblxuICAgICAgYmFzZURlZmluZVByb3BlcnR5KCB0aGlzLCBrZXksIGRlc2NyaXB0b3IgKTtcbiAgICB9LCBvYmplY3QgKTtcblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59IGVsc2Uge1xuICBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydGllcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1cHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3N1cHBvcnQvc3VwcG9ydC1kZWZpbmUtcHJvcGVydHknICk7XG5cbnZhciBiYXNlRGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgaXNQcmltaXRpdmUgICAgICAgID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xuXG52YXIgZGVmaW5lUHJvcGVydHk7XG5cbmlmICggc3VwcG9ydCAhPT0gJ2Z1bGwnICkge1xuICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5ICggb2JqZWN0LCBrZXksIGRlc2NyaXB0b3IgKSB7XG4gICAgaWYgKCBzdXBwb3J0ICE9PSAnbm90LXN1cHBvcnRlZCcgKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIG9iamVjdCApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3QnICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc1ByaW1pdGl2ZSggZGVzY3JpcHRvciApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICcgKyBkZXNjcmlwdG9yICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VEZWZpbmVQcm9wZXJ0eSggb2JqZWN0LCBrZXksIGRlc2NyaXB0b3IgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnR5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZWFjaCcgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZWFjaCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZXNjYXBlJyApKCAvWzw+XCInJl0vZywge1xuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gIFwiJ1wiOiAnJiMzOTsnLFxuICAnXCInOiAnJiMzNDsnLFxuICAnJic6ICcmYW1wOydcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb3Nlc3ROb2RlID0gcmVxdWlyZSggJy4vY2xvc2VzdC1ub2RlJyApO1xudmFyIERPTVdyYXBwZXIgID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbnZhciBFdmVudCAgICAgICA9IHJlcXVpcmUoICcuL0V2ZW50JyApO1xuXG52YXIgZXZlbnRzID0ge1xuICBpdGVtczoge30sXG4gIHR5cGVzOiBbXVxufTtcblxudmFyIHN1cHBvcnQgPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2FkZEV2ZW50TGlzdGVuZXInIGluIHNlbGY7XG5cbi8qKlxuICogQG1ldGhvZCBwZWFrby5ldmVudC5vblxuICogQHBhcmFtICB7Tm9kZX0gICAgIGVsZW1lbnRcbiAqIEBwYXJhbSAge3N0cmluZ30gICB0eXBlXG4gKiBAcGFyYW0gIHtzdHJpbmc/fSAgc2VsZWN0b3JcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICogQHBhcmFtICB7Ym9vbGVhbn0gIHVzZUNhcHR1cmVcbiAqIEBwYXJhbSAge2Jvb2xlYW59ICBbb25jZV1cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKiBAZXhhbXBsZVxuICogXy5ldmVudC5vbiggZG9jdW1lbnQsICdjbGljaycsICcucG9zdF9fbGlrZS1idXR0b24nLCAoIGV2ZW50ICkgPT4ge1xuICogICBjb25zdCBkYXRhID0ge1xuICogICAgIGlkOiBfKCB0aGlzICkucGFyZW50KCAnLnBvc3QnICkuZGF0YSggJ2lkJyApXG4gKiAgIH1cbiAqXG4gKiAgIF8uYWpheCggJy9saWtlJywgeyBkYXRhIH0gKVxuICogfSwgZmFsc2UgKVxuICovXG5leHBvcnRzLm9uID0gZnVuY3Rpb24gb24gKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUsIG9uY2UgKSB7XG4gIHZhciBpdGVtID0ge1xuICAgIHVzZUNhcHR1cmU6IHVzZUNhcHR1cmUsXG4gICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgb25jZTogb25jZVxuICB9O1xuXG4gIGlmICggc2VsZWN0b3IgKSB7XG4gICAgaXRlbS5zZWxlY3RvciA9IHNlbGVjdG9yO1xuICB9XG5cbiAgaWYgKCBzdXBwb3J0ICkge1xuICAgIGl0ZW0ud3JhcHBlciA9IGZ1bmN0aW9uIHdyYXBwZXIgKCBldmVudCwgX2VsZW1lbnQgKSB7XG4gICAgICBpZiAoIHNlbGVjdG9yICYmICEgX2VsZW1lbnQgJiYgISAoIF9lbGVtZW50ID0gY2xvc2VzdE5vZGUoIGV2ZW50LnRhcmdldCwgc2VsZWN0b3IgKSApICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggb25jZSApIHtcbiAgICAgICAgZXhwb3J0cy5vZmYoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lci5jYWxsKCBfZWxlbWVudCB8fCBlbGVtZW50LCBuZXcgRXZlbnQoIGV2ZW50ICkgKTtcbiAgICB9O1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBpdGVtLndyYXBwZXIsIHVzZUNhcHR1cmUgKTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nICkge1xuICAgIGl0ZW0ud3JhcHBlciA9IGZ1bmN0aW9uIHdyYXBwZXIgKCBldmVudCwgX2VsZW1lbnQgKSB7XG4gICAgICBpZiAoIHNlbGVjdG9yICYmICEgX2VsZW1lbnQgJiYgISAoIF9lbGVtZW50ID0gY2xvc2VzdE5vZGUoIGV2ZW50LnRhcmdldCwgc2VsZWN0b3IgKSApICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZSA9PT0gJ0RPTUNvbnRlbnRMb2FkZWQnICYmIGVsZW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJyApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9uY2UgKSB7XG4gICAgICAgIGV4cG9ydHMub2ZmKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKTtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXIuY2FsbCggX2VsZW1lbnQgfHwgZWxlbWVudCwgbmV3IEV2ZW50KCBldmVudCwgdHlwZSApICk7XG4gICAgfTtcblxuICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoIGl0ZW0uSUVUeXBlID0gSUVUeXBlKCB0eXBlICksIGl0ZW0ud3JhcHBlciApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFR5cGVFcnJvciggJ25vdCBpbXBsZW1lbnRlZCcgKTtcbiAgfVxuXG4gIGlmICggZXZlbnRzLml0ZW1zWyB0eXBlIF0gKSB7XG4gICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0ucHVzaCggaXRlbSApO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5pdGVtc1sgdHlwZSBdID0gWyBpdGVtIF07XG4gICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0uaW5kZXggPSBldmVudHMudHlwZXMubGVuZ3RoO1xuICAgIGV2ZW50cy50eXBlcy5wdXNoKCB0eXBlICk7XG4gIH1cbn07XG5cbi8qKlxuICogQG1ldGhvZCBwZWFrby5ldmVudC5vZmZcbiAqIEBwYXJhbSAge05vZGV9ICAgICBlbGVtZW50XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgdHlwZVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHNlbGVjdG9yXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gbGlzdGVuZXJcbiAqIEBwYXJhbSAge2Jvb2xlYW59ICB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5leHBvcnRzLm9mZiA9IGZ1bmN0aW9uIG9mZiAoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApIHtcbiAgdmFyIGl0ZW1zO1xuICB2YXIgaXRlbTtcbiAgdmFyIGk7XG5cbiAgaWYgKCB0eXBlID09PSBudWxsIHx8IHR5cGVvZiB0eXBlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICBmb3IgKCBpID0gZXZlbnRzLnR5cGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgZXZlbnQub2ZmKCBlbGVtZW50LCBldmVudHMudHlwZXNbIGkgXSwgc2VsZWN0b3IgKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoICEgKCBpdGVtcyA9IGV2ZW50cy5pdGVtc1sgdHlwZSBdICkgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggaSA9IGl0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGl0ZW0gPSBpdGVtc1sgaSBdO1xuXG4gICAgaWYgKCBpdGVtLmVsZW1lbnQgIT09IGVsZW1lbnQgfHxcbiAgICAgIHR5cGVvZiBsaXN0ZW5lciAhPT0gJ3VuZGVmaW5lZCcgJiYgKFxuICAgICAgICBpdGVtLmxpc3RlbmVyICE9PSBsaXN0ZW5lciB8fFxuICAgICAgICBpdGVtLnVzZUNhcHR1cmUgIT09IHVzZUNhcHR1cmUgfHxcbiAgICAgICAgLy8gdG9kbzogY2hlY2sgYm90aCBpdGVtLnNlbGVjdG9yIGFuZCBzZWxlY3RvciBhbmQgdGhlbiBjb21wYXJlXG4gICAgICAgIGl0ZW0uc2VsZWN0b3IgJiYgaXRlbS5zZWxlY3RvciAhPT0gc2VsZWN0b3IgKSApXG4gICAgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGJyYWNlLXN0eWxlXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpdGVtcy5zcGxpY2UoIGksIDEgKTtcblxuICAgIGlmICggISBpdGVtcy5sZW5ndGggKSB7XG4gICAgICBldmVudHMudHlwZXMuc3BsaWNlKCBpdGVtcy5pbmRleCwgMSApO1xuICAgICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICggc3VwcG9ydCApIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgaXRlbS53cmFwcGVyLCBpdGVtLnVzZUNhcHR1cmUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5kZXRhY2hFdmVudCggaXRlbS5JRVR5cGUsIGl0ZW0ud3JhcHBlciApO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy50cmlnZ2VyID0gZnVuY3Rpb24gdHJpZ2dlciAoIGVsZW1lbnQsIHR5cGUsIGRhdGEgKSB7XG4gIHZhciBpdGVtcyA9IGV2ZW50cy5pdGVtc1sgdHlwZSBdO1xuICB2YXIgY2xvc2VzdDtcbiAgdmFyIGl0ZW07XG4gIHZhciBpO1xuXG4gIGlmICggISBpdGVtcyApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpICkge1xuICAgIGl0ZW0gPSBpdGVtc1sgaSBdO1xuXG4gICAgaWYgKCBlbGVtZW50ICkge1xuICAgICAgY2xvc2VzdCA9IGNsb3Nlc3ROb2RlKCBlbGVtZW50LCBpdGVtLnNlbGVjdG9yIHx8IGl0ZW0uZWxlbWVudCApO1xuICAgIH0gZWxzZSBpZiAoIGl0ZW0uc2VsZWN0b3IgKSB7XG4gICAgICBuZXcgRE9NV3JhcHBlciggaXRlbS5zZWxlY3RvciApLmVhY2goICggZnVuY3Rpb24gKCBpdGVtICkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGl0ZW0ud3JhcHBlciggY3JlYXRlRXZlbnRXaXRoVGFyZ2V0KCB0eXBlLCBkYXRhLCB0aGlzICksIHRoaXMgKTtcbiAgICAgICAgfTtcbiAgICAgIH0gKSggaXRlbSApICk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zZXN0ID0gaXRlbS5lbGVtZW50O1xuICAgIH1cblxuICAgIGlmICggY2xvc2VzdCApIHtcbiAgICAgIGl0ZW0ud3JhcHBlciggY3JlYXRlRXZlbnRXaXRoVGFyZ2V0KCB0eXBlLCBkYXRhLCBlbGVtZW50IHx8IGNsb3Nlc3QgKSwgY2xvc2VzdCApO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5jb3B5ID0gZnVuY3Rpb24gY29weSAoIHRhcmdldCwgc291cmNlLCBkZWVwICkge1xuICB2YXIgaXRlbXM7XG4gIHZhciBpdGVtO1xuICB2YXIgdHlwZTtcbiAgdmFyIGk7XG4gIHZhciBqO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gZXZlbnRzLnR5cGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGlmICggKCBpdGVtcyA9IGV2ZW50cy5pdGVtc1sgdHlwZSA9IGV2ZW50cy50eXBlc1sgaSBdIF0gKSApIHtcbiAgICAgIGZvciAoIGogPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBqIDwgbDsgKytqICkge1xuICAgICAgICBpZiAoICggaXRlbSA9IGl0ZW1zWyBqIF0gKS50YXJnZXQgPT09IHNvdXJjZSApIHtcbiAgICAgICAgICBldmVudC5vbiggdGFyZ2V0LCB0eXBlLCBudWxsLCBpdGVtLmxpc3RlbmVyLCBpdGVtLnVzZUNhcHR1cmUsIGl0ZW0ub25jZSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKCAhIGRlZXAgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGFyZ2V0ID0gdGFyZ2V0LmNoaWxkTm9kZXM7XG4gIHNvdXJjZSA9IHNvdXJjZS5jaGlsZE5vZGVzO1xuXG4gIGZvciAoIGkgPSB0YXJnZXQubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgZXZlbnQuY29weSggdGFyZ2V0WyBpIF0sIHNvdXJjZVsgaSBdLCB0cnVlICk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50V2l0aFRhcmdldCAoIHR5cGUsIGRhdGEsIHRhcmdldCApIHtcbiAgdmFyIGUgPSBuZXcgRXZlbnQoIHR5cGUsIGRhdGEgKTtcbiAgZS50YXJnZXQgPSB0YXJnZXQ7XG4gIHJldHVybiBlO1xufVxuXG5mdW5jdGlvbiBJRVR5cGUgKCB0eXBlICkge1xuICBpZiAoIHR5cGUgPT09ICdET01Db250ZW50TG9hZGVkJyApIHtcbiAgICByZXR1cm4gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gIH1cblxuICByZXR1cm4gJ29uJyArIHR5cGU7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCB0cnVlLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCBmYWxzZSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWVhY2gnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1lYWNoJyApKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMtaW4nICksIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1pbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMnICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xuXG52YXIgd3JhcHBlcnMgPSB7XG4gIGNvbDogICAgICBbIDIsICc8dGFibGU+PGNvbGdyb3VwPicsICc8L2NvbGdyb3VwPjwvdGFibGU+JyBdLFxuICB0cjogICAgICAgWyAyLCAnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPicgXSxcbiAgZGVmYXVsdHM6IFsgMCwgJycsICcnIF1cbn07XG5cbmZ1bmN0aW9uIGFwcGVuZCAoIGZyYWdtZW50LCBlbGVtZW50cyApIHtcbiAgZm9yICggdmFyIGkgPSAwLCBsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50c1sgaSBdICk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmcmFnbWVudCAoIGVsZW1lbnRzLCBjb250ZXh0ICkge1xuICB2YXIgZnJhZ21lbnQgPSBjb250ZXh0LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGVsZW1lbnQ7XG4gIHZhciB3cmFwcGVyO1xuICB2YXIgdGFnO1xuICB2YXIgZGl2O1xuICB2YXIgaTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50c1sgaSBdO1xuXG4gICAgaWYgKCBpc09iamVjdExpa2UoIGVsZW1lbnQgKSApIHtcbiAgICAgIGlmICggJ25vZGVUeXBlJyBpbiBlbGVtZW50ICkge1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggZWxlbWVudCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwZW5kKCBmcmFnbWVudCwgZWxlbWVudCApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIC88fCYjP1xcdys7Ly50ZXN0KCBlbGVtZW50ICkgKSB7XG4gICAgICBpZiAoICEgZGl2ICkge1xuICAgICAgICBkaXYgPSBjb250ZXh0LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICB9XG5cbiAgICAgIHRhZyA9IC88KFthLXpdW15cXHM+XSopL2kuZXhlYyggZWxlbWVudCApO1xuXG4gICAgICBpZiAoIHRhZyApIHtcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzWyB0YWcgPSB0YWdbIDEgXSBdIHx8IHdyYXBwZXJzWyB0YWcudG9Mb3dlckNhc2UoKSBdIHx8IHdyYXBwZXJzLmRlZmF1bHRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzLmRlZmF1bHRzO1xuICAgICAgfVxuXG4gICAgICBkaXYuaW5uZXJIVE1MID0gd3JhcHBlclsgMSBdICsgZWxlbWVudCArIHdyYXBwZXJbIDIgXTtcblxuICAgICAgZm9yICggaiA9IHdyYXBwZXJbIDAgXTsgaiA+IDA7IC0taiApIHtcbiAgICAgICAgZGl2ID0gZGl2Lmxhc3RDaGlsZDtcbiAgICAgIH1cblxuICAgICAgYXBwZW5kKCBmcmFnbWVudCwgZGl2LmNoaWxkTm9kZXMgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGNvbnRleHQuY3JlYXRlVGV4dE5vZGUoIGVsZW1lbnQgKSApO1xuICAgIH1cbiAgfVxuXG4gIGlmICggZGl2ICkge1xuICAgIGRpdi5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIHJldHVybiBmcmFnbWVudDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZnJvbVBhaXJzICggcGFpcnMgKSB7XG4gIHZhciBvYmplY3QgPSB7fTtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gcGFpcnMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIG9iamVjdFsgcGFpcnNbIGkgXVsgMCBdIF0gPSBwYWlyc1sgaSBdWyAxIF07XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbicgKSggJ0hlaWdodCcgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbicgKSggJ1dpZHRoJyApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YgKCBvYmogKSB7XG4gIHZhciBwcm90b3R5cGU7XG5cbiAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgfVxuXG4gIHByb3RvdHlwZSA9IG9iai5fX3Byb3RvX187IC8vIGpzaGludCBpZ25vcmU6IGxpbmVcblxuICBpZiAoIHR5cGVvZiBwcm90b3R5cGUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBwcm90b3R5cGU7XG4gIH1cblxuICBpZiAoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggb2JqLmNvbnN0cnVjdG9yICkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgKSB7XG4gICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4vY2FzdC1wYXRoJyApO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGJhc2VHZXQgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWdldCcgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0ICggb2JqZWN0LCBwYXRoICkge1xuICB2YXIgbGVuZ3RoID0gKCBwYXRoID0gY2FzdFBhdGgoIHBhdGggKSApLmxlbmd0aDtcblxuICBpZiAoICEgbGVuZ3RoICkge1xuICAgIHRocm93IEVycm9yKCBFUlIuTk9fUEFUSCApO1xuICB9XG5cbiAgaWYgKCBsZW5ndGggPiAxICkge1xuICAgIHJldHVybiBiYXNlR2V0KCB0b09iamVjdCggb2JqZWN0ICksIHBhdGgsIDAgKTtcbiAgfVxuXG4gIHJldHVybiB0b09iamVjdCggb2JqZWN0IClbIHBhdGhbIDAgXSBdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4vY2FzdC1wYXRoJyApO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGlzc2V0ICAgID0gcmVxdWlyZSggJy4vaXNzZXQnICk7XG52YXIgYmFzZUhhcyAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtaGFzJyApO1xudmFyIEVSUiAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXMgKCBvYmosIHBhdGggKSB7XG4gIHZhciBsID0gKCBwYXRoID0gY2FzdFBhdGgoIHBhdGggKSApLmxlbmd0aDtcblxuICBpZiAoICEgbCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIGlmICggbCA+IDEgKSB7XG4gICAgcmV0dXJuIGJhc2VIYXMoIHRvT2JqZWN0KCBvYmogKSwgcGF0aCApO1xuICB9XG5cbiAgcmV0dXJuIGlzc2V0KCB0b09iamVjdCggb2JqICksIHBhdGhbIDAgXSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpZGVudGl0eSAoIHYgKSB7XG4gIHJldHVybiB2O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWluZGV4LW9mJyApKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX0FyZ3VtZW50RXhjZXB0aW9uICggdW5leHBlY3RlZCwgZXhwZWN0ZWQgKSB7XG4gIHJldHVybiBFcnJvciggJ1wiJyArIHRvU3RyaW5nLmNhbGwoIHVuZXhwZWN0ZWQgKSArICdcIiBpcyBub3QgJyArIGV4cGVjdGVkICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYW5pbWF0aW9uSXRlcmF0aW9uQ291bnQ6IHRydWUsXG4gIGNvbHVtbkNvdW50OiB0cnVlLFxuICBmaWxsT3BhY2l0eTogdHJ1ZSxcbiAgZmxleFNocmluazogdHJ1ZSxcbiAgZm9udFdlaWdodDogdHJ1ZSxcbiAgbGluZUhlaWdodDogdHJ1ZSxcbiAgZmxleEdyb3c6IHRydWUsXG4gIG9wYWNpdHk6IHRydWUsXG4gIG9ycGhhbnM6IHRydWUsXG4gIHdpZG93czogdHJ1ZSxcbiAgekluZGV4OiB0cnVlLFxuICBvcmRlcjogdHJ1ZSxcbiAgem9vbTogdHJ1ZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZmlyc3QgKCB3cmFwcGVyLCBlbGVtZW50ICkge1xuICB3cmFwcGVyWyAwIF0gPSBlbGVtZW50O1xuICB3cmFwcGVyLmxlbmd0aCA9IDE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIF9nZXRTdHlsZVxuICogQHBhcmFtICB7b2JqZWN0fSAgZWxlbWVudFxuICogQHBhcmFtICB7c3RyaW5nfSAgc3R5bGVcbiAqIEBwYXJhbSAge29iamVjdH0gW2NvbXB1dGVkU3R5bGVdXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2dldFN0eWxlICggZWxlbWVudCwgc3R5bGUsIGNvbXB1dGVkU3R5bGUgKSB7XG4gIHJldHVybiBlbGVtZW50LnN0eWxlWyBzdHlsZSBdIHx8XG4gICAgKCBjb21wdXRlZFN0eWxlIHx8IGdldENvbXB1dGVkU3R5bGUoIGVsZW1lbnQgKSApLmdldFByb3BlcnR5VmFsdWUoIHN0eWxlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIF9tZW1vaXplXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gZnVuY3Rpb25fXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfbWVtb2l6ZSAoIGZ1bmN0aW9uXyApIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuICB2YXIgbGFzdFJlc3VsdDtcbiAgdmFyIGxhc3RWYWx1ZTtcblxuICByZXR1cm4gZnVuY3Rpb24gbWVtb2l6ZWQgKCB2YWx1ZSApIHtcbiAgICBzd2l0Y2ggKCBmYWxzZSApIHtcbiAgICAgIGNhc2UgY2FsbGVkOlxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAvLyBmYWxscyB0aHJvdWdoXG4gICAgICBjYXNlIHZhbHVlID09PSBsYXN0VmFsdWU6XG4gICAgICAgIHJldHVybiAoIGxhc3RSZXN1bHQgPSBmdW5jdGlvbl8oICggbGFzdFZhbHVlID0gdmFsdWUgKSApICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhc3RSZXN1bHQ7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGxhY2Vob2xkZXIgPSByZXF1aXJlKCAnLi4vcGxhY2Vob2xkZXInICk7XG4vLyBjb25zdGFudHMuUExBQ0VIT0xERVIgaXMgZm9yIGJhY2t3YXJkLWNvbXBhYmlsaXR5LlxudmFyIGNvbnN0YW50cyAgID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKTtcblxuLyoqXG4gKiDQrdGC0L7RgiDQvNC10YLQvtC0INCy0L7Qt9GA0LDRidCw0LXRgiDQvtC00LjQvSDQvNCw0YHRgdC40LIg0LDRgNCz0YPQvNC10L3RgtC+0LIg0LjQtyDRh9Cw0YHRgtC40YfQvdGL0YUg0LDRgNCz0YPQvNC10L3RgtC+0LIg0YEgcGxhY2Vob2xkZXJg0LDQvNC4LCDQuFxuICog0LDRgNCz0YPQvNC10L3RgtC+0LIg0LrQvtGC0L7RgNGL0LUg0LHRi9C70Lgg0L/RgNC4INCy0YvQt9C+0LLQtS5cbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIF9wcm9jZXNzQXJnc1xuICogQHBhcmFtICB7QXJyYXkuPGFueT59IHBhcnRpYWxBcmdzINCn0LDRgdGC0LjRh9C90YvQtSDQsNGA0LPRg9C80LXQvdGC0Ysg0YEgcGxhY2Vob2xkZXJg0LDQvNC4ICgncGVha28vcGxhY2Vob2xkZXInKS5cbiAqIEBwYXJhbSAge0FycmF5Ljxhbnk+fSBhcmdzICAgICAgICDQkNGA0LPRg9C80LXQvdGC0Ysg0LLRi9C30L7QstCwINC60LDQutC+0LPQvi3Qu9C40LHQviDQvNC10YLQvtC00LAuXG4gKiBAcmV0dXJuIHtBcnJheS48YW55Pn0gICAgICAgICAgICAg0J7QsdGA0LDQsdC+0YLQsNC90L3Ri9C1INCw0YDQs9GD0LzQtdC90YLRiy5cbiAqIEBleGFtcGxlXG4gKiB2YXIgYXJncyA9IF9wcm9jZXNzQXJncyggWyBfLCAnIScgXSwgWyAnSm9obicgXSApO1xuICovXG5mdW5jdGlvbiBfcHJvY2Vzc0FyZ3MgKCBwYXJ0aWFsQXJncywgYXJncyApIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaiA9IC0xO1xuICB2YXIgaTtcbiAgdmFyIGxlbmd0aDtcblxuICBmb3IgKCBpID0gMCwgbGVuZ3RoID0gcGFydGlhbEFyZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kgKSB7XG4gICAgaWYgKCBwYXJ0aWFsQXJnc1sgaSBdID09PSBwbGFjZWhvbGRlciB8fCBwYXJ0aWFsQXJnc1sgaSBdID09PSBjb25zdGFudHMuUExBQ0VIT0xERVIgKSB7XG4gICAgICByZXN1bHQucHVzaCggYXJnc1sgKytqIF0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goIHBhcnRpYWxBcmdzWyBpIF0gKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKCBsZW5ndGggPSBhcmdzLmxlbmd0aDsgaiA8IGxlbmd0aDsgKytqICkge1xuICAgIHJlc3VsdC5wdXNoKCBhcmdzWyBpIF0gKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3Byb2Nlc3NBcmdzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXNjYXBlID0gcmVxdWlyZSggJy4uL2VzY2FwZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfdGV4dENvbnRlbnQgKCBlbGVtZW50LCB2YWx1ZSApIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgY2hpbGRyZW47XG4gIHZhciBjaGlsZDtcbiAgdmFyIHR5cGU7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBlc2NhcGUoIHZhbHVlICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggaSA9IDAsIGwgPSAoIGNoaWxkcmVuID0gZWxlbWVudC5jaGlsZE5vZGVzICkubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIC8vIFRFWFRfTk9ERVxuICAgIGlmICggKCB0eXBlID0gKCBjaGlsZCA9IGNoaWxkcmVuWyBpIF0gKS5ub2RlVHlwZSApID09PSAzICkge1xuICAgICAgcmVzdWx0ICs9IGNoaWxkLm5vZGVWYWx1ZTtcbiAgICAvLyBFTEVNRU5UX05PREVcbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAxICkge1xuICAgICAgcmVzdWx0ICs9IF90ZXh0Q29udGVudCggY2hpbGQgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9tZW1vaXplJyApKCByZXF1aXJlKCAnLi4vdHlwZScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF91bmVzY2FwZSAoIHN0cmluZyApIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKCAvXFxcXChcXFxcKT8vZywgJyQxJyApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdvcmRzICggc3RyaW5nICkge1xuICBpZiAoIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggc3RyaW5nLCAnYSBzdHJpbmcnICk7XG4gIH1cblxuICByZXR1cm4gc3RyaW5nLm1hdGNoKCAvW15cXHNcXHVGRUZGXFx4QTBdKy9nICkgfHwgW107XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIga2V5cyAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGludmVydCAoIG9iamVjdCApIHtcbiAgdmFyIGsgPSBrZXlzKCBvYmplY3QgPSB0b09iamVjdCggb2JqZWN0ICkgKTtcbiAgdmFyIGludmVydGVkID0ge307XG4gIHZhciBpO1xuXG4gIGZvciAoIGkgPSBrLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGludmVydGVkWyBrWyBpIF0gXSA9IG9iamVjdFsga1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gaW52ZXJ0ZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNMZW5ndGggICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xudmFyIGlzV2luZG93TGlrZSA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgaXNMZW5ndGgoIHZhbHVlLmxlbmd0aCApICYmICEgaXNXaW5kb3dMaWtlKCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTGVuZ3RoICAgICA9IHJlcXVpcmUoICcuL2lzLWxlbmd0aCcgKTtcbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIHZhbHVlICkge1xuICBpZiAoIHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICkge1xuICAgIHJldHVybiBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiYgISBpc1dpbmRvd0xpa2UoIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciBpc0xlbmd0aCAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiZcbiAgICBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiZcbiAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHZhbHVlICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNET01FbGVtZW50ICggdmFsdWUgKSB7XG4gIHZhciBub2RlVHlwZTtcblxuICBpZiAoICEgaXNPYmplY3RMaWtlKCB2YWx1ZSApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICggaXNXaW5kb3dMaWtlKCB2YWx1ZSApICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbm9kZVR5cGUgPSB2YWx1ZS5ub2RlVHlwZTtcblxuICByZXR1cm4gbm9kZVR5cGUgPT09IDEgfHwgLy8gRUxFTUVOVF9OT0RFXG4gICAgICAgICBub2RlVHlwZSA9PT0gMyB8fCAvLyBURVhUX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSA4IHx8IC8vIENPTU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDkgfHwgLy8gRE9DVU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDExOyAgLy8gRE9DVU1FTlRfRlJBR01FTlRfTk9ERVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTnVtYmVyID0gcmVxdWlyZSggJy4vaXMtbnVtYmVyJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRmluaXRlICggdmFsdWUgKSB7XG4gIHJldHVybiBpc051bWJlciggdmFsdWUgKSAmJiBpc0Zpbml0ZSggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZSA9IHJlcXVpcmUoICcuL2ludGVybmFsL3R5cGUnICk7XG5cbnZhciByRGVlcEtleSA9IC8oXnxbXlxcXFxdKShcXFxcXFxcXCkqKFxcLnxcXFspLztcblxuZnVuY3Rpb24gaXNLZXkgKCB2YWwgKSB7XG4gIHZhciB0eXBlO1xuXG4gIGlmICggISB2YWwgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoIF90eXBlKCB2YWwgKSA9PT0gJ2FycmF5JyApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0eXBlID0gdHlwZW9mIHZhbDtcblxuICBpZiAoIHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJyB8fCBfdHlwZSggdmFsICkgPT09ICdzeW1ib2wnICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuICEgckRlZXBLZXkudGVzdCggdmFsICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLk1BWF9BUlJBWV9MRU5HVEg7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNMZW5ndGggKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+PSAwICYmXG4gICAgdmFsdWUgPD0gTUFYX0FSUkFZX0xFTkdUSCAmJlxuICAgIHZhbHVlICUgMSA9PT0gMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNOYU4gKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNOdW1iZXIgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3QgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSggdmFsdWUgKSAmJiB0b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBPYmplY3RdJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoICcuL2dldC1wcm90b3R5cGUtb2YnICk7XG52YXIgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QnICk7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgT0JKRUNUID0gdG9TdHJpbmcuY2FsbCggT2JqZWN0ICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdCAoIHYgKSB7XG4gIHZhciBwO1xuICB2YXIgYztcblxuICBpZiAoICEgaXNPYmplY3QoIHYgKSApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwID0gZ2V0UHJvdG90eXBlT2YoIHYgKTtcblxuICBpZiAoIHAgPT09IG51bGwgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoICEgaGFzT3duUHJvcGVydHkuY2FsbCggcCwgJ2NvbnN0cnVjdG9yJyApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGMgPSBwLmNvbnN0cnVjdG9yO1xuXG4gIHJldHVybiB0eXBlb2YgYyA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKCBjICkgPT09IE9CSkVDVDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNQcmltaXRpdmUgKCB2YWx1ZSApIHtcbiAgcmV0dXJuICEgdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNGaW5pdGUgID0gcmVxdWlyZSggJy4vaXMtZmluaXRlJyApO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyICggdmFsdWUgKSB7XG4gIHJldHVybiBpc0Zpbml0ZSggdmFsdWUgKSAmJlxuICAgIHZhbHVlIDw9IGNvbnN0YW50cy5NQVhfU0FGRV9JTlQgJiZcbiAgICB2YWx1ZSA+PSBjb25zdGFudHMuTUlOX1NBRkVfSU5UICYmXG4gICAgdmFsdWUgJSAxID09PSAwO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N0cmluZyAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlID0gcmVxdWlyZSggJy4vdHlwZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N5bWJvbCAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZSggdmFsdWUgKSA9PT0gJ3N5bWJvbCc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaW5kb3dMaWtlICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgdmFsdWUud2luZG93ID09PSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaW5kb3cgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzV2luZG93TGlrZSggdmFsdWUgKSAmJiB0b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBXaW5kb3ddJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNzZXQgKCBrZXksIG9iaiApIHtcbiAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBvYmpbIGtleSBdICE9PSAndW5kZWZpbmVkJyB8fCBrZXkgaW4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VWYWx1ZXMgICAgICAgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLXZhbHVlcycgKTtcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG52YXIga2V5cyAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGl0ZXJhYmxlICggdmFsdWUgKSB7XG4gIGlmICggaXNBcnJheUxpa2VPYmplY3QoIHZhbHVlICkgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCggJycgKTtcbiAgfVxuXG4gIHJldHVybiBiYXNlVmFsdWVzKCB2YWx1ZSwga2V5cyggdmFsdWUgKSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG52YXIgbWF0Y2hlc1Byb3BlcnR5ICAgPSByZXF1aXJlKCAnLi9tYXRjaGVzLXByb3BlcnR5JyApO1xudmFyIHByb3BlcnR5ICAgICAgICAgID0gcmVxdWlyZSggJy4vcHJvcGVydHknICk7XG5cbmV4cG9ydHMuaXRlcmF0ZWUgPSBmdW5jdGlvbiBpdGVyYXRlZSAoIHZhbHVlICkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpZiAoIGlzQXJyYXlMaWtlT2JqZWN0KCB2YWx1ZSApICkge1xuICAgIHJldHVybiBtYXRjaGVzUHJvcGVydHkoIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gcHJvcGVydHkoIHZhbHVlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0S2V5c0luICggb2JqICkge1xuICB2YXIga2V5cyA9IFtdO1xuICB2YXIga2V5O1xuXG4gIG9iaiA9IHRvT2JqZWN0KCBvYmogKTtcblxuICBmb3IgKCBrZXkgaW4gb2JqICkge1xuICAgIGtleXMucHVzaCgga2V5ICk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlS2V5cyA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1rZXlzJyApO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIHN1cHBvcnQgID0gcmVxdWlyZSggJy4vc3VwcG9ydC9zdXBwb3J0LWtleXMnICk7XG5cbmlmICggc3VwcG9ydCAhPT0gJ2VzMjAxNScgKSB7XG4gIHZhciBfa2V5cztcblxuICAvKipcbiAgICogKyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICtcbiAgICogfCBJIHRlc3RlZCB0aGUgZnVuY3Rpb25zIHdpdGggc3RyaW5nWzIwNDhdIChhbiBhcnJheSBvZiBzdHJpbmdzKSBhbmQgaGFkIHxcbiAgICogfCB0aGlzIHJlc3VsdHMgaW4gTm9kZS5qcyAodjguMTAuMCk6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICogKyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICtcbiAgICogfCBiYXNlS2V5cyB4IDEwLDY3NCBvcHMvc2VjIMKxMC4yMyUgKDk0IHJ1bnMgc2FtcGxlZCkgICAgICAgICAgICAgICAgICAgICB8XG4gICAqIHwgT2JqZWN0LmtleXMgeCAyMiwxNDcgb3BzL3NlYyDCsTAuMjMlICg5NSBydW5zIHNhbXBsZWQpICAgICAgICAgICAgICAgICAgfFxuICAgKiB8IEZhc3Rlc3QgaXMgXCJPYmplY3Qua2V5c1wiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAqICsgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSArXG4gICAqL1xuXG4gIGlmICggc3VwcG9ydCA9PT0gJ2VzNScgKSB7XG4gICAgX2tleXMgPSBPYmplY3Qua2V5cztcbiAgfSBlbHNlIHtcbiAgICBfa2V5cyA9IGJhc2VLZXlzO1xuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXlzICggdiApIHtcbiAgICByZXR1cm4gX2tleXMoIHRvT2JqZWN0KCB2ICkgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1pbmRleC1vZicgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgZ2V0ICAgICAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtZ2V0JyApO1xudmFyIEVSUiAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXRjaGVzUHJvcGVydHkgKCBwcm9wZXJ0eSApIHtcbiAgdmFyIHBhdGggID0gY2FzdFBhdGgoIHByb3BlcnR5WyAwIF0gKTtcbiAgdmFyIHZhbHVlID0gcHJvcGVydHlbIDEgXTtcblxuICBpZiAoICEgcGF0aC5sZW5ndGggKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCBvYmplY3QgKSB7XG4gICAgaWYgKCBvYmplY3QgPT09IG51bGwgfHwgdHlwZW9mIG9iamVjdCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCBwYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICByZXR1cm4gZ2V0KCBvYmplY3QsIHBhdGgsIDAgKSA9PT0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgMCBdIF0gPT09IHZhbHVlO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWluZGV4LW9mJyApO1xuXG52YXIgbWF0Y2hlcztcblxuaWYgKCB0eXBlb2YgRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgISAoIG1hdGNoZXMgPSBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzIHx8IEVsZW1lbnQucHJvdG90eXBlLm9NYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUubW96TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciApICkge1xuICBtYXRjaGVzID0gZnVuY3Rpb24gbWF0Y2hlcyAoIHNlbGVjdG9yICkge1xuICAgIGlmICggL14jW1xcd1xcLV0rJC8udGVzdCggc2VsZWN0b3IgKz0gJycgKSApIHtcbiAgICAgIHJldHVybiAnIycgKyB0aGlzLmlkID09PSBzZWxlY3RvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZUluZGV4T2YoIHRoaXMub3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApLCB0aGlzICkgPj0gMDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHktb2YnICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1pbnZva2UnICksIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5JyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtaW52b2tlJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtZW1vaXplICAgICAgID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvbWVtb2l6ZScgKTtcblxudmFyIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCAnLi9pcy1wbGFpbi1vYmplY3QnICk7XG52YXIgdG9PYmplY3QgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBrZXlzICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcbnZhciBpc0FycmF5ICAgICAgID0gbWVtb2l6ZSggcmVxdWlyZSggJy4vaXMtYXJyYXknICkgKTtcblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLm1peGluXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICBbZGVlcD10cnVlXVxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgdGFyZ2V0XG4gKiBAcGFyYW0gIHsuLi5vYmplY3Q/fSBvYmplY3RcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtaXhpbiAoIGRlZXAsIHRhcmdldCApIHtcbiAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaSA9IDI7XG4gIHZhciBvYmplY3Q7XG4gIHZhciBzb3VyY2U7XG4gIHZhciB2YWx1ZTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuICB2YXIgaztcblxuICBpZiAoIHR5cGVvZiBkZWVwICE9PSAnYm9vbGVhbicgKSB7XG4gICAgdGFyZ2V0ID0gZGVlcDtcbiAgICBkZWVwID0gdHJ1ZTtcbiAgICBpID0gMTtcbiAgfVxuXG4gIHRhcmdldCA9IHRvT2JqZWN0KCB0YXJnZXQgKTtcblxuICBmb3IgKCA7IGkgPCBhcmdzTGVuZ3RoOyArK2kgKSB7XG4gICAgb2JqZWN0ID0gYXJndW1lbnRzWyBpIF07XG5cbiAgICBpZiAoICEgb2JqZWN0ICkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yICggayA9IGtleXMoIG9iamVjdCApLCBqID0gMCwgbCA9IGsubGVuZ3RoOyBqIDwgbDsgKytqICkge1xuICAgICAgdmFsdWUgPSBvYmplY3RbIGtbIGogXSBdO1xuXG4gICAgICBpZiAoIGRlZXAgJiYgaXNQbGFpbk9iamVjdCggdmFsdWUgKSB8fCBpc0FycmF5KCB2YWx1ZSApICkge1xuICAgICAgICBzb3VyY2UgPSB0YXJnZXRbIGtbIGogXSBdO1xuXG4gICAgICAgIGlmICggaXNBcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgICBpZiAoICEgaXNBcnJheSggc291cmNlICkgKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCAhIGlzUGxhaW5PYmplY3QoIHNvdXJjZSApICkge1xuICAgICAgICAgICAgc291cmNlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0WyBrWyBqIF0gXSA9IG1peGluKCB0cnVlLCBzb3VyY2UsIHZhbHVlICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbIGtbIGogXSBdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9vcCAoKSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBicmFjZS1ydWxlcy9icmFjZS1vbi1zYW1lLWxpbmVcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbiBub3cgKCkge1xuICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmVmb3JlID0gcmVxdWlyZSggJy4vYmVmb3JlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9uY2UgKCB0YXJnZXQgKSB7XG4gIHJldHVybiBiZWZvcmUoIDEsIHRhcmdldCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VDbG9uZUFycmF5ID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWNsb25lLWFycmF5JyApO1xuXG52YXIgZnJhZ21lbnQgICAgICAgPSByZXF1aXJlKCAnLi9mcmFnbWVudCcgKTtcblxuLyoqXG4gKiBAbWV0aG9kIF8ucGFyc2VIVE1MXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgIHN0cmluZ1xuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtBcnJheS48RWxlbWVudD59XG4gKiBAZXhhbXBsZVxuICogdmFyIGVsZW1lbnRzID0gXy5wYXJzZUhUTUwoICc8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwic3VibWl0XCIgLz4nICk7XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIVE1MICggc3RyaW5nLCBjb250ZXh0ICkge1xuICBpZiAoIC9eKD86PChbXFx3LV0rKT48XFwvW1xcdy1dKz58PChbXFx3LV0rKSg/OlxccypcXC8pPz4pJC8udGVzdCggc3RyaW5nICkgKSB7XG4gICAgcmV0dXJuIFsgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggUmVnRXhwLiQxIHx8IFJlZ0V4cC4kMiApIF07XG4gIH1cblxuICByZXR1cm4gYmFzZUNsb25lQXJyYXkoIGZyYWdtZW50KCBbIHN0cmluZyBdLCBjb250ZXh0IHx8IGRvY3VtZW50ICkuY2hpbGROb2RlcyApO1xufTtcbiIsIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggVmxhZGlzbGF2IFRpa2hpeSAoU0lMRU5UKVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cHM6Ly9naXRodWIuY29tL3Rpa2hpeS9wZWFrb1xuICovXG5cbi8qIVxuICogQmFzZWQgb24galF1ZXJ5ICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeVxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmVcbiAqIEJhc2VkIG9uIExvZGFzaCAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2hcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5hbWVzcGFjZSBwZWFrb1xuICovXG52YXIgcGVha287XG5cbmlmICggdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyApIHtcbiAgcGVha28gPSByZXF1aXJlKCAnLi9fJyApO1xuICBwZWFrby5ET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbn0gZWxzZSB7XG4gIHBlYWtvID0gZnVuY3Rpb24gcGVha28gKCkge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYnJhY2UtcnVsZXMvYnJhY2Utb24tc2FtZS1saW5lXG59XG5cbnBlYWtvLmFqYXggICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYWpheCcgKTtcbnBlYWtvLmFzc2lnbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYXNzaWduJyApO1xucGVha28uYXNzaWduSW4gICAgICAgICAgPSByZXF1aXJlKCAnLi9hc3NpZ24taW4nICk7XG5wZWFrby5jbG9uZSAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Nsb25lJyApO1xucGVha28uY3JlYXRlICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jcmVhdGUnICk7XG5wZWFrby5kZWZhdWx0cyAgICAgICAgICA9IHJlcXVpcmUoICcuL2RlZmF1bHRzJyApO1xucGVha28uZGVmaW5lUHJvcGVydHkgICAgPSByZXF1aXJlKCAnLi9kZWZpbmUtcHJvcGVydHknICk7XG5wZWFrby5kZWZpbmVQcm9wZXJ0aWVzICA9IHJlcXVpcmUoICcuL2RlZmluZS1wcm9wZXJ0aWVzJyApO1xucGVha28uZWFjaCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoJyApO1xucGVha28uZWFjaFJpZ2h0ICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoLXJpZ2h0JyApO1xucGVha28uZ2V0UHJvdG90eXBlT2YgICAgPSByZXF1aXJlKCAnLi9nZXQtcHJvdG90eXBlLW9mJyApO1xucGVha28uaW5kZXhPZiAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pbmRleC1vZicgKTtcbnBlYWtvLmlzQXJyYXkgICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtYXJyYXknICk7XG5wZWFrby5pc0FycmF5TGlrZSAgICAgICA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2UnICk7XG5wZWFrby5pc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xucGVha28uaXNET01FbGVtZW50ICAgICAgPSByZXF1aXJlKCAnLi9pcy1kb20tZWxlbWVudCcgKTtcbnBlYWtvLmlzTGVuZ3RoICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xucGVha28uaXNPYmplY3QgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QnICk7XG5wZWFrby5pc09iamVjdExpa2UgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xucGVha28uaXNQbGFpbk9iamVjdCAgICAgPSByZXF1aXJlKCAnLi9pcy1wbGFpbi1vYmplY3QnICk7XG5wZWFrby5pc1ByaW1pdGl2ZSAgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnBlYWtvLmlzU3ltYm9sICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtc3ltYm9sJyApO1xucGVha28uaXNTdHJpbmcgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1zdHJpbmcnICk7XG5wZWFrby5pc1dpbmRvdyAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdycgKTtcbnBlYWtvLmlzV2luZG93TGlrZSAgICAgID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5wZWFrby5pc051bWJlciAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLW51bWJlcicgKTtcbnBlYWtvLmlzTmFOICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbmFuJyApO1xucGVha28uaXNTYWZlSW50ZWdlciAgICAgPSByZXF1aXJlKCAnLi9pcy1zYWZlLWludGVnZXInICk7XG5wZWFrby5pc0Zpbml0ZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLWZpbml0ZScgKTtcbnBlYWtvLmtleXMgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcbnBlYWtvLmtleXNJbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cy1pbicgKTtcbnBlYWtvLmxhc3RJbmRleE9mICAgICAgID0gcmVxdWlyZSggJy4vbGFzdC1pbmRleC1vZicgKTtcbnBlYWtvLm1peGluICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbWl4aW4nICk7XG5wZWFrby5ub29wICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL25vb3AnICk7XG5wZWFrby5wcm9wZXJ0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5JyApO1xucGVha28ucHJvcGVydHlPZiAgICAgICAgPSByZXF1aXJlKCAnLi9wcm9wZXJ0eS1vZicgKTtcbnBlYWtvLm1ldGhvZCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbWV0aG9kJyApO1xucGVha28ubWV0aG9kT2YgICAgICAgICAgPSByZXF1aXJlKCAnLi9tZXRob2Qtb2YnICk7XG5wZWFrby5zZXRQcm90b3R5cGVPZiAgICA9IHJlcXVpcmUoICcuL3NldC1wcm90b3R5cGUtb2YnICk7XG5wZWFrby50b09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnBlYWtvLnR5cGUgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdHlwZScgKTtcbnBlYWtvLmZvckVhY2ggICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLWVhY2gnICk7XG5wZWFrby5mb3JFYWNoUmlnaHQgICAgICA9IHJlcXVpcmUoICcuL2Zvci1lYWNoLXJpZ2h0JyApO1xucGVha28uZm9ySW4gICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9mb3ItaW4nICk7XG5wZWFrby5mb3JJblJpZ2h0ICAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1pbi1yaWdodCcgKTtcbnBlYWtvLmZvck93biAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLW93bicgKTtcbnBlYWtvLmZvck93blJpZ2h0ICAgICAgID0gcmVxdWlyZSggJy4vZm9yLW93bi1yaWdodCcgKTtcbnBlYWtvLmJlZm9yZSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYmVmb3JlJyApO1xucGVha28ub25jZSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9vbmNlJyApO1xucGVha28uZGVmYXVsdFRvICAgICAgICAgPSByZXF1aXJlKCAnLi9kZWZhdWx0LXRvJyApO1xucGVha28udGltZXIgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90aW1lcicgKTtcbnBlYWtvLnRpbWVzdGFtcCAgICAgICAgID0gcmVxdWlyZSggJy4vdGltZXN0YW1wJyApO1xucGVha28ubm93ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9ub3cnICk7XG5wZWFrby5jbGFtcCAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NsYW1wJyApO1xucGVha28uYmluZCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9iaW5kJyApO1xucGVha28udHJpbSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90cmltJyApO1xucGVha28udHJpbUVuZCAgICAgICAgICAgPSByZXF1aXJlKCAnLi90cmltLWVuZCcgKTtcbnBlYWtvLnRyaW1TdGFydCAgICAgICAgID0gcmVxdWlyZSggJy4vdHJpbS1zdGFydCcgKTtcbnBlYWtvLmZpbmQgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZCcgKTtcbnBlYWtvLmZpbmRJbmRleCAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZC1pbmRleCcgKTtcbnBlYWtvLmZpbmRMYXN0ICAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZC1sYXN0JyApO1xucGVha28uZmluZExhc3RJbmRleCAgICAgPSByZXF1aXJlKCAnLi9maW5kLWxhc3QtaW5kZXgnICk7XG5wZWFrby5oYXMgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2hhcycgKTtcbnBlYWtvLmdldCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZ2V0JyApO1xucGVha28uc2V0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zZXQnICk7XG5wZWFrby5pdGVyYXRlZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2l0ZXJhdGVlJyApO1xucGVha28uaWRlbnRpdHkgICAgICAgICAgPSByZXF1aXJlKCAnLi9pZGVudGl0eScgKTtcbnBlYWtvLmVzY2FwZSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZXNjYXBlJyApO1xucGVha28udW5lc2NhcGUgICAgICAgICAgPSByZXF1aXJlKCAnLi91bmVzY2FwZScgKTtcbnBlYWtvLnJhbmRvbSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vcmFuZG9tJyApO1xucGVha28uZnJvbVBhaXJzICAgICAgICAgPSByZXF1aXJlKCAnLi9mcm9tLXBhaXJzJyApO1xucGVha28uY29uc3RhbnRzICAgICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICk7XG5wZWFrby50ZW1wbGF0ZSAgICAgICAgICA9IHJlcXVpcmUoICcuL3RlbXBsYXRlJyApO1xucGVha28uaW52ZXJ0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pbnZlcnQnICk7XG5wZWFrby5jb21wb3VuZCAgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbXBvdW5kJyApO1xucGVha28uZGVib3VuY2UgICAgICAgICAgPSByZXF1aXJlKCAnLi9kZWJvdW5jZScgKTtcblxuaWYgKCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gIHNlbGYucGVha28gPSBzZWxmLl8gPSBwZWFrbzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwZWFrbztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbWVtYmVyIHtvYmplY3R9IF8ucGxhY2Vob2xkZXJcbiAqL1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBtZXRob2QgXy5wcm9wZXJ0eU9mXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgb2JqZWN0XG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBleGFtcGxlXG4gKiB2YXIgb2JqZWN0ID0ge1xuICogICB4OiA0MixcbiAqICAgeTogMFxuICogfTtcbiAqXG4gKiBbICd4JywgJ3knIF0ubWFwKCBfLnByb3BlcnR5T2YoIG9iamVjdCApICk7IC8vIC0+IFsgNDIsIDAgXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHktb2YnICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1wcm9wZXJ0eScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBtZXRob2QgXy5wcm9wZXJ0eVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHBhdGhcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICogQGV4YW1wbGVcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7IG5hbWU6ICdKYW1lcycgfSxcbiAqICAgeyBuYW1lOiAnSm9obicgfVxuICogXTtcbiAqXG4gKiBvYmplY3RzLm1hcCggXy5wcm9wZXJ0eSggJ25hbWUnICkgKTsgLy8gLT4gWyAnSmFtZXMnLCAnSm9obicgXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHknICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1wcm9wZXJ0eScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2NsYXNzJzogJ2NsYXNzTmFtZScsXG4gICdmb3InOiAgICdodG1sRm9yJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VSYW5kb20gPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtcmFuZG9tJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJhbmRvbSAoIGxvd2VyLCB1cHBlciwgZmxvYXRpbmcgKSB7XG5cbiAgLy8gXy5yYW5kb20oKTtcblxuICBpZiAoIHR5cGVvZiBsb3dlciA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZmxvYXRpbmcgPSBmYWxzZTtcbiAgICB1cHBlciA9IDE7XG4gICAgbG93ZXIgPSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgdXBwZXIgPT09ICd1bmRlZmluZWQnICkge1xuXG4gICAgLy8gXy5yYW5kb20oIGZsb2F0aW5nICk7XG5cbiAgICBpZiAoIHR5cGVvZiBsb3dlciA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgZmxvYXRpbmcgPSBsb3dlcjtcbiAgICAgIHVwcGVyID0gMTtcblxuICAgIC8vIF8ucmFuZG9tKCB1cHBlciApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGZsb2F0aW5nID0gZmFsc2U7XG4gICAgICB1cHBlciA9IGxvd2VyO1xuICAgIH1cblxuICAgIGxvd2VyID0gMDtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGZsb2F0aW5nID09PSAndW5kZWZpbmVkJyApIHtcblxuICAgIC8vIF8ucmFuZG9tKCB1cHBlciwgZmxvYXRpbmcgKTtcblxuICAgIGlmICggdHlwZW9mIHVwcGVyID09PSAnYm9vbGVhbicgKSB7XG4gICAgICBmbG9hdGluZyA9IHVwcGVyO1xuICAgICAgdXBwZXIgPSBsb3dlcjtcbiAgICAgIGxvd2VyID0gMDtcblxuICAgIC8vIF8ucmFuZG9tKCBsb3dlciwgdXBwZXIgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBmbG9hdGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICggZmxvYXRpbmcgfHwgbG93ZXIgJSAxIHx8IHVwcGVyICUgMSApIHtcbiAgICByZXR1cm4gYmFzZVJhbmRvbSggbG93ZXIsIHVwcGVyICk7XG4gIH1cblxuICByZXR1cm4gTWF0aC5yb3VuZCggYmFzZVJhbmRvbSggbG93ZXIsIHVwcGVyICkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1ByaW1pdGl2ZSA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnZhciBFUlIgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mICggdGFyZ2V0LCBwcm90b3R5cGUgKSB7XG4gIGlmICggdGFyZ2V0ID09PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnICkge1xuICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gIH1cblxuICBpZiAoIHByb3RvdHlwZSAhPT0gbnVsbCAmJiBpc1ByaW1pdGl2ZSggcHJvdG90eXBlICkgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogJyArIHByb3RvdHlwZSApO1xuICB9XG5cbiAgaWYgKCAnX19wcm90b19fJyBpbiB0YXJnZXQgKSB7XG4gICAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTsgLy8ganNoaW50IGlnbm9yZTogbGluZVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBiYXNlU2V0ICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1zZXQnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldCAoIG9iaiwgcGF0aCwgdmFsICkge1xuICB2YXIgbCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGwgKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGwgPiAxICkge1xuICAgIHJldHVybiBiYXNlU2V0KCB0b09iamVjdCggb2JqICksIHBhdGgsIHZhbCApO1xuICB9XG5cbiAgcmV0dXJuICggdG9PYmplY3QoIG9iaiApWyBwYXRoWyAwIF0gXSA9IHZhbCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1cHBvcnQ7XG5cbmZ1bmN0aW9uIHRlc3QgKCB0YXJnZXQgKSB7XG4gIHRyeSB7XG4gICAgaWYgKCAnJyBpbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHRhcmdldCwgJycsIHt9ICkgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKCBlICkge31cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmlmICggdGVzdCgge30gKSApIHtcbiAgc3VwcG9ydCA9ICdmdWxsJztcbn0gZWxzZSBpZiAoIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdGVzdCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICkgKSApIHtcbiAgc3VwcG9ydCA9ICdkb20nO1xufSBlbHNlIHtcbiAgc3VwcG9ydCA9ICdub3Qtc3VwcG9ydGVkJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuXG50cnkge1xuICBpZiAoIHNwYW4uc2V0QXR0cmlidXRlKCAneCcsICd5JyApLCBzcGFuLmdldEF0dHJpYnV0ZSggJ3gnICkgPT09ICd5JyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZXF1ZW5jZXNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbnVsbDtcbiAgfVxufSBjYXRjaCAoIGVycm9yICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xufVxuXG5zcGFuID0gbnVsbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1cHBvcnQ7XG5cbmlmICggT2JqZWN0LmtleXMgKSB7XG4gIHRyeSB7XG4gICAgc3VwcG9ydCA9IE9iamVjdC5rZXlzKCAnJyApLCAnZXMyMDE1JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnMsIG5vLXNlcXVlbmNlc1xuICB9IGNhdGNoICggZXJyb3IgKSB7XG4gICAgc3VwcG9ydCA9ICdlczUnO1xuICB9XG59IGVsc2UgaWYgKCB7IHRvU3RyaW5nOiBudWxsIH0ucHJvcGVydHlJc0VudW1lcmFibGUoICd0b1N0cmluZycgKSApIHtcbiAgc3VwcG9ydCA9ICdoYXMtYS1idWcnO1xufSBlbHNlIHtcbiAgc3VwcG9ydCA9ICdub3Qtc3VwcG9ydGVkJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXNjYXBlICA9IHJlcXVpcmUoICcuL2VzY2FwZScgKTtcblxudmFyIHJlZ2V4cHMgPSB7XG4gIHNhZmU6ICc8XFxcXCU9XFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPicsXG4gIGh0bWw6ICc8XFxcXCUtXFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPicsXG4gIGNvbW06IFwiJycnKFteXSo/KScnJ1wiLFxuICBjb2RlOiAnPFxcXFwlXFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPidcbn07XG5cbmZ1bmN0aW9uIHJlcGxhY2VyICggbWF0Y2gsIHNhZmUsIGh0bWwsIGNvZGUgKSB7XG4gIGlmICggdHlwZW9mIHNhZmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIicrX2UoXCIgKyBzYWZlLnJlcGxhY2UoIC9cXFxcbi9nLCAnXFxuJyApICsgXCIpKydcIjtcbiAgfVxuXG4gIGlmICggdHlwZW9mIGh0bWwgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIicrKFwiICsgaHRtbC5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiKSsnXCI7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBjb2RlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gXCInO1wiICsgY29kZS5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiO19yKz0nXCI7XG4gIH1cblxuICAvLyBjb21tZW50IGlzIG1hdGNoZWQgLSBkbyBub3RoaW5nXG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLnRlbXBsYXRlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHNvdXJjZSAgICAgICAgICAgIFRoZSB0ZW1wbGF0ZSBzb3VyY2UuXG4gKiBAcGFyYW0gIHtvYmplY3R9IFtvcHRpb25zXSAgICAgICAgIEFuIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtvYmplY3R9IFtvcHRpb25zLnJlZ2V4cHNdIEN1c3RvbSBwYXR0ZXJucy5cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgICAgICAgQW4gb2JqZWN0IHdpdGggYHJlbmRlcmAgbWV0aG9kLlxuICogQGV4YW1wbGVcbiAqIHZhciB0ZW1wbGF0ZSA9IHBlYWtvLnRlbXBsYXRlKGBcbiAqICAgJycnIEEgaHRtbC1zYWZlIG91dHB1dC4gJycnXG4gKiAgIDx0aXRsZT48JT0gZGF0YS51c2VybmFtZSAlPjwvdGl0bGU+XG4gKiAgICcnJyBBIGJsb2NrIG9mIGNvZGUuICcnJ1xuICogICA8JSBmb3IgKCB2YXIgaSA9IDA7IGkgPCA1OyBpICs9IDEgKSB7XG4gKiAgICAgLy8gVGhlIFwicHJpbnRcIiBmdW5jdGlvbi5cbiAqICAgICBwcmludCggaSApO1xuICogICB9ICU+XG4gKiBgKTtcbiAqIHZhciBodG1sID0gdGVtcGxhdGUucmVuZGVyKCB7IHVzZXJuYW1lOiAnSm9obicgfSApO1xuICogLy8gLT4gJ1xcbiAgXFxuICA8dGl0bGU+Sm9objwvdGl0bGU+XFxuICBcXG4gIDAxMjM0XFxuJ1xuICovXG5mdW5jdGlvbiB0ZW1wbGF0ZSAoIHNvdXJjZSwgb3B0aW9ucyApIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgcmVnZXhwO1xuICB2YXIgcmVuZGVyXztcblxuICBpZiAoICEgb3B0aW9ucyApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBmdW5jdGlvbiBnZXQgKCBrZXkgKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMucmVnZXhwcyAmJiBvcHRpb25zLnJlZ2V4cHNbIGtleSBdIHx8IHJlZ2V4cHNbIGtleSBdO1xuICB9XG5cbiAgcmVnZXhwID0gUmVnRXhwKFxuICAgIGdldCggJ3NhZmUnICkgKyAnfCcgK1xuICAgIGdldCggJ2h0bWwnICkgKyAnfCcgK1xuICAgIGdldCggJ2NvZGUnICkgKyAnfCcgK1xuICAgIGdldCggJ2NvbW0nICksICdnJyApO1xuXG4gIGlmICggb3B0aW9ucy53aXRoICkge1xuICAgIHJlc3VsdCArPSAnd2l0aChkYXRhfHx7fSl7JztcbiAgfVxuXG4gIGlmICggb3B0aW9ucy5wcmludCAhPT0gbnVsbCApIHtcbiAgICByZXN1bHQgKz0gJ2Z1bmN0aW9uICcgKyAoIG9wdGlvbnMucHJpbnQgfHwgJ3ByaW50JyApICsgXCIoKXtfcis9QXJyYXkucHJvdG90eXBlLmpvaW4uY2FsbChhcmd1bWVudHMsJycpO31cIjtcbiAgfVxuXG4gIHJlc3VsdCArPSBcInZhciBfcj0nXCI7XG5cbiAgcmVzdWx0ICs9IHNvdXJjZVxuICAgIC5yZXBsYWNlKCAvXFxuL2csICdcXFxcbicgKVxuICAgIC5yZXBsYWNlKCByZWdleHAsIHJlcGxhY2VyICk7XG5cbiAgcmVzdWx0ICs9IFwiJztcIjtcblxuICBpZiAoIG9wdGlvbnMud2l0aCApIHtcbiAgICByZXN1bHQgKz0gJ30nO1xuICB9XG5cbiAgcmVzdWx0ICs9ICdyZXR1cm4gX3I7JztcblxuICByZW5kZXJfID0gRnVuY3Rpb24oICdkYXRhJywgJ19lJywgcmVzdWx0ICk7XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlciAoIGRhdGEgKSB7XG4gICAgICByZXR1cm4gcmVuZGVyXy5jYWxsKCB0aGlzLCBkYXRhLCBlc2NhcGUgKTtcbiAgICB9LFxuXG4gICAgcmVzdWx0OiByZXN1bHQsXG4gICAgc291cmNlOiBzb3VyY2VcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcbiIsIi8qKlxuICogQmFzZWQgb24gRXJpayBNw7ZsbGVyIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbDpcbiAqXG4gKiBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzEgd2hpY2ggZGVyaXZlZCBmcm9tXG4gKiBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuICogaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuICpcbiAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuXG4gKiBGaXhlcyBmcm9tIFBhdWwgSXJpc2gsIFRpbm8gWmlqZGVsLCBBbmRyZXcgTWFvLCBLbGVtZW4gU2xhdmnEjSwgRGFyaXVzIEJhY29uLlxuICpcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGltZXN0YW1wID0gcmVxdWlyZSggJy4vdGltZXN0YW1wJyApO1xuXG52YXIgcmVxdWVzdEFGO1xudmFyIGNhbmNlbEFGO1xuXG5pZiAoIHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyApIHtcbiAgY2FuY2VsQUYgPSBzZWxmLmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYud2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICByZXF1ZXN0QUYgPSBzZWxmLnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG59XG5cbnZhciBub1JlcXVlc3RBbmltYXRpb25GcmFtZSA9ICEgcmVxdWVzdEFGIHx8ICEgY2FuY2VsQUYgfHxcbiAgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgL2lQKGFkfGhvbmV8b2QpLipPU1xcczYvLnRlc3QoIG5hdmlnYXRvci51c2VyQWdlbnQgKTtcblxuaWYgKCBub1JlcXVlc3RBbmltYXRpb25GcmFtZSApIHtcbiAgdmFyIGxhc3RSZXF1ZXN0VGltZSA9IDA7XG4gIHZhciBmcmFtZUR1cmF0aW9uICAgPSAxMDAwIC8gNjA7XG5cbiAgZXhwb3J0cy5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdCAoIGFuaW1hdGUgKSB7XG4gICAgdmFyIG5vdyAgICAgICAgICAgICA9IHRpbWVzdGFtcCgpO1xuICAgIHZhciBuZXh0UmVxdWVzdFRpbWUgPSBNYXRoLm1heCggbGFzdFJlcXVlc3RUaW1lICsgZnJhbWVEdXJhdGlvbiwgbm93ICk7XG5cbiAgICByZXR1cm4gc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgbGFzdFJlcXVlc3RUaW1lID0gbmV4dFJlcXVlc3RUaW1lO1xuICAgICAgYW5pbWF0ZSggbm93ICk7XG4gICAgfSwgbmV4dFJlcXVlc3RUaW1lIC0gbm93ICk7XG4gIH07XG5cbiAgZXhwb3J0cy5jYW5jZWwgPSBjbGVhclRpbWVvdXQ7XG59IGVsc2Uge1xuICBleHBvcnRzLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0ICggYW5pbWF0ZSApIHtcbiAgICByZXR1cm4gcmVxdWVzdEFGKCBhbmltYXRlICk7XG4gIH07XG5cbiAgZXhwb3J0cy5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwgKCBpZCApIHtcbiAgICByZXR1cm4gY2FuY2VsQUYoIGlkICk7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBub3cgPSByZXF1aXJlKCAnLi9ub3cnICk7XG52YXIgbmF2aWdhdG9yU3RhcnQ7XG5cbmlmICggdHlwZW9mIHBlcmZvcm1hbmNlID09PSAndW5kZWZpbmVkJyB8fCAhIHBlcmZvcm1hbmNlLm5vdyApIHtcbiAgbmF2aWdhdG9yU3RhcnQgPSBub3coKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRpbWVzdGFtcCAoKSB7XG4gICAgcmV0dXJuIG5vdygpIC0gbmF2aWdhdG9yU3RhcnQ7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRpbWVzdGFtcCAoKSB7XG4gICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3VuZXNjYXBlID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdW5lc2NhcGUnICk7XG5cbnZhciBpc1N5bWJvbCAgPSByZXF1aXJlKCAnLi9pcy1zeW1ib2wnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiBfdW5lc2NhcGUoIHZhbHVlICk7XG4gIH1cblxuICBpZiAoIGlzU3ltYm9sKCB2YWx1ZSApICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHZhciBrZXkgPSAnJyArIHZhbHVlO1xuXG4gIGlmICgga2V5ID09PSAnMCcgJiYgMSAvIHZhbHVlID09PSAtSW5maW5pdHkgKSB7XG4gICAgcmV0dXJuICctMCc7XG4gIH1cblxuICByZXR1cm4gX3VuZXNjYXBlKCBrZXkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvT2JqZWN0ICggdmFsdWUgKSB7XG4gIGlmICggdmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdCggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggU3RyaW5nLnByb3RvdHlwZS50cmltRW5kICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW1FbmQgKCBzdHJpbmcgKSB7XG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS50cmltRW5kKCk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL1tcXHNcXHVGRUZGXFx4QTBdKyQvICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggU3RyaW5nLnByb3RvdHlwZS50cmltU3RhcnQgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJpbVN0YXJ0ICggc3RyaW5nICkge1xuICAgIHJldHVybiAoICcnICsgc3RyaW5nICkudHJpbVN0YXJ0KCk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL15bXFxzXFx1RkVGRlxceEEwXSsvICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggU3RyaW5nLnByb3RvdHlwZS50cmltICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW0gKCBzdHJpbmcgKSB7XG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS50cmltKCk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC8gKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZSA9IHJlcXVpcmUoICcuL2NyZWF0ZScgKTtcblxudmFyIGNhY2hlID0gY3JlYXRlKCBudWxsICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHlwZSAoIHZhbHVlICkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWU7XG4gIH1cblxuICBpZiAoIHZhbHVlID09PSBudWxsICkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cblxuICB2YXIgc3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2YWx1ZSApO1xuXG4gIGlmICggISBjYWNoZVsgc3RyaW5nIF0gKSB7XG4gICAgY2FjaGVbIHN0cmluZyBdID0gc3RyaW5nLnNsaWNlKCA4LCAtMSApLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICByZXR1cm4gY2FjaGVbIHN0cmluZyBdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVzY2FwZScgKSggLyYoPzpsdHxndHwjMzR8IzM5fGFtcCk7L2csIHtcbiAgJyZsdDsnOiAgJzwnLFxuICAnJmd0Oyc6ICAnPicsXG4gICcmIzM0Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiLFxuICAnJmFtcDsnOiAnJidcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpcnN0JyApKCAndG9VcHBlckNhc2UnICk7XG4iXX0=
