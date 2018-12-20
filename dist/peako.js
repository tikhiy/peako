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

},{"../access":21,"../base/base-for-each":31,"../base/base-for-in":32,"../create/create-remove-prop":66,"../event":76,"../get-element-h":89,"../get-element-w":90,"../internal/first":98,"../internal/text-content":101,"../internal/words":104,"../is-array-like-object":106,"../is-dom-element":109,"../parse-html":138,"../props":143,"../support/support-get-attribute":148,"./prototype/css":2,"./prototype/each":3,"./prototype/end":4,"./prototype/eq":5,"./prototype/find":6,"./prototype/first":7,"./prototype/get":8,"./prototype/last":9,"./prototype/map":10,"./prototype/parent":11,"./prototype/ready":12,"./prototype/remove":13,"./prototype/removeAttr":14,"./prototype/removeProp":15,"./prototype/stack":16,"./prototype/style":17,"./prototype/styles":18}],2:[function(require,module,exports){
'use strict';

var isArray = require( '../../is-array' );

module.exports = function css ( k, v ) {
  if ( isArray( k ) ) {
    return this.styles( k );
  }

  return this.style( k, v );
};

},{"../../is-array":108}],3:[function(require,module,exports){
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

},{"../../base/base-index-of":35,"../../matches-selector":131}],12:[function(require,module,exports){
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

},{"../../access":21,"../../camelize":46,"../../internal/css-numbers":97,"../../internal/get-style":99,"../../is-object-like":115}],18:[function(require,module,exports){
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

},{"./base/base-assign":26,"./isset":124,"./keys":128}],20:[function(require,module,exports){
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

},{"./DOMWrapper":1,"./keys":128,"./type":158}],22:[function(require,module,exports){
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

},{"./create/create-assign":55,"./keys-in":127}],25:[function(require,module,exports){
'use strict';

module.exports = Object.assign || require( './create/create-assign' )( require( './keys' ) );

},{"./create/create-assign":55,"./keys":128}],26:[function(require,module,exports){
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

},{"../isset":124}],28:[function(require,module,exports){
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

},{"../isset":124}],30:[function(require,module,exports){
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

},{"../call-iteratee":45,"../isset":124}],32:[function(require,module,exports){
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

},{"../isset":124}],34:[function(require,module,exports){
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

},{"../isset":124}],35:[function(require,module,exports){
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

},{"../support/support-keys":149,"./base-index-of":35}],38:[function(require,module,exports){
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

},{"../props":143,"../support/support-get-attribute":148}],41:[function(require,module,exports){
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

},{"../isset":124}],42:[function(require,module,exports){
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

var _ArgumentException = require( './internal/ArgumentException' );

var placeholder        = require( './placeholder' );
var constants          = require( './constants' );
var indexOf            = require( './index-of' );

// Function::bind() polyfill.

var _bind = Function.prototype.bind || function bind ( c ) {
  var f = this;
  var a;

  if ( arguments.length <= 2 ) {
    return function bound () {
      return f.apply( c, arguments );
    };
  }

  a = Array.prototype.slice.call( arguments, 1 );

  return function bound () {
    return f.apply( c, a.concat( Array.prototype.slice.call( arguments ) ) );
  };
};

/**
 * @private
 * @param {Array} p The partial arguments.
 * @param {Array} a The arguments.
 * @returns {Array} A processed arguments.
 */
function process ( p, a ) {
  var r = [];
  var j = -1;
  var i;
  var l;

  for ( i = 0, l = p.length; i < l; ++i ) {
    if ( p[ i ] === placeholder || p[ i ] === constants.PLACEHOLDER ) {
      r.push( a[ ++j ] );
    } else {
      r.push( p[ i ] );
    }
  }

  for ( l = a.length; j < l; ++j ) {
    r.push( a[ i ] );
  }

  return r;
}

/**
 * @param  {function} f The target function that should be bound.
 * @param  {*}        c The new context for the target function.
 * @param  {...*}     p The partial arguments, may contain _.placeholder.
 * @return {function}
 * @example
 * var _    = require( 'peako/placeholder' );
 * var bind = require( 'peako/bind' );

 * function weirdFunction ( x, y ) {
 *   return this[ x ] + this[ y ];
 * }
 *
 * var context = {
 *   x: 42,
 *   y: 1
 * };
 *
 * var boundFunction = bind( weirdFunction, context, _, 'y' );
 *
 * boundFunction( 'x' ); // -> 43
 */
module.exports = function bind ( f, c ) {
  var p;

  if ( typeof f !== 'function' ) {
    throw _ArgumentException( f, 'a function' );
  }

  // no partial arguments were provided

  if ( arguments.length <= 2 ) {
    return _bind.call( f, c );
  }

  p = Array.prototype.slice.call( arguments, 2 );

  // no placeholders in the partial arguments

  if ( indexOf( p, placeholder ) < 0 && indexOf( p, constants.PLACEHOLDER ) < 0 ) {
    return Function.prototype.call.apply( _bind, arguments );
  }

  return function bound () {
    return f.apply( c, process( p, arguments ) );
  };
};

},{"./constants":53,"./index-of":95,"./internal/ArgumentException":96,"./placeholder":140}],45:[function(require,module,exports){
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

},{"./upper-first":160}],47:[function(require,module,exports){
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

},{"./base/base-exec":30,"./internal/type":102,"./internal/unescape":103,"./is-key":111,"./to-key":153}],48:[function(require,module,exports){
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

},{"./create":54,"./each":74,"./get-prototype-of":91,"./is-object-like":115,"./to-object":154}],50:[function(require,module,exports){
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

},{"./matches-selector":131}],52:[function(require,module,exports){
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

var setPrototypeOf = require( './set-prototype-of' );

var isPrimitive = require( './is-primitive' );

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

},{"./define-properties":71,"./is-primitive":118,"./set-prototype-of":145}],55:[function(require,module,exports){
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

},{"../base/base-for-each":31,"../base/base-for-in":32,"../is-array-like":107,"../iteratee":126,"../keys":128,"../to-object":154}],57:[function(require,module,exports){
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

},{"../call-iteratee":45,"../isset":124,"../iterable":125,"../iteratee":126,"../to-object":154}],59:[function(require,module,exports){
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

},{"../base/base-for-each":31,"../iterable":125,"../iteratee":126,"../to-object":154}],61:[function(require,module,exports){
'use strict';

var baseForIn = require( '../base/base-for-in' );
var toObject  = require( '../to-object' );
var iteratee  = require( '../iteratee' ).iteratee;

module.exports = function createForIn ( keys, fromRight ) {
  return function forIn ( obj, fn, ctx ) {
    return baseForIn( obj = toObject( obj ), iteratee( fn ), ctx, fromRight, keys( obj ) );
  };
};

},{"../base/base-for-in":32,"../iteratee":126,"../to-object":154}],62:[function(require,module,exports){
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

},{"../base/base-index-of":35,"../to-object":154}],64:[function(require,module,exports){
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

},{"../cast-path":47,"../noop":135}],66:[function(require,module,exports){
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

},{"../internal/words":104}],67:[function(require,module,exports){
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

},{"./mixin":134}],71:[function(require,module,exports){
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

},{"./base/base-define-property":29,"./each":74,"./is-primitive":118,"./support/support-define-property":147}],72:[function(require,module,exports){
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

},{"./base/base-define-property":29,"./is-primitive":118,"./support/support-define-property":147}],73:[function(require,module,exports){
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

},{"./create/create-for-in":61,"./keys-in":127}],84:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys-in' ) );

},{"./create/create-for-in":61,"./keys-in":127}],85:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys' ), true );

},{"./create/create-for-in":61,"./keys":128}],86:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys' ) );

},{"./create/create-for-in":61,"./keys":128}],87:[function(require,module,exports){
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

},{"./is-object-like":115}],88:[function(require,module,exports){
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

},{"./base/base-get":33,"./cast-path":47,"./constants":53,"./to-object":154}],93:[function(require,module,exports){
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

},{"./base/base-has":34,"./cast-path":47,"./constants":53,"./isset":124,"./to-object":154}],94:[function(require,module,exports){
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

},{"../escape":75}],102:[function(require,module,exports){
'use strict';

module.exports = require( './memoize' )( require( '../type' ) );

},{"../type":158,"./memoize":100}],103:[function(require,module,exports){
'use strict';

module.exports = function _unescape ( string ) {
  return string.replace( /\\(\\)?/g, '$1' );
};

},{}],104:[function(require,module,exports){
'use strict';

var _ArgumentException = require( './ArgumentException' );

module.exports = function words ( string ) {
  if ( typeof string !== 'string' ) {
    throw _ArgumentException( string, 'a string' );
  }

  return string.match( /[^\s\uFEFF\xA0]+/g ) || [];
};

},{"./ArgumentException":96}],105:[function(require,module,exports){
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

},{"./keys":128,"./to-object":154}],106:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );
var isLength     = require( './is-length' );
var isWindowLike = require( './is-window-like' );

module.exports = function isArrayLikeObject ( value ) {
  return isObjectLike( value ) && isLength( value.length ) && ! isWindowLike( value );
};

},{"./is-length":112,"./is-object-like":115,"./is-window-like":122}],107:[function(require,module,exports){
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

},{"./is-length":112,"./is-window-like":122}],108:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );
var isLength     = require( './is-length' );

module.exports = Array.isArray || function isArray ( value ) {
  return isObjectLike( value ) &&
    isLength( value.length ) &&
    Object.prototype.toString.call( value ) === '[object Array]';
};

},{"./is-length":112,"./is-object-like":115}],109:[function(require,module,exports){
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

},{"./is-object-like":115,"./is-window-like":122}],110:[function(require,module,exports){
'use strict';

var isNumber = require( './is-number' );

module.exports = function isFinite ( value ) {
  return isNumber( value ) && isFinite( value );
};

},{"./is-number":114}],111:[function(require,module,exports){
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

},{"./internal/type":102}],112:[function(require,module,exports){
'use strict';

var MAX_ARRAY_LENGTH = require( './constants' ).MAX_ARRAY_LENGTH;

module.exports = function isLength ( value ) {
  return typeof value === 'number' &&
    value >= 0 &&
    value <= MAX_ARRAY_LENGTH &&
    value % 1 === 0;
};

},{"./constants":53}],113:[function(require,module,exports){
'use strict';

module.exports = function isNaN ( value ) {
  return value !== value;
};

},{}],114:[function(require,module,exports){
'use strict';

module.exports = function isNumber ( value ) {
  return typeof value === 'number';
};

},{}],115:[function(require,module,exports){
'use strict';

module.exports = function isObjectLike ( value ) {
  return typeof value === 'object' && value !== null;
};

},{}],116:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

var toString = {}.toString;

module.exports = function isObject ( value ) {
  return isObjectLike( value ) && toString.call( value ) === '[object Object]';
};

},{"./is-object-like":115}],117:[function(require,module,exports){
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

},{"./get-prototype-of":91,"./is-object":116}],118:[function(require,module,exports){
'use strict';

module.exports = function isPrimitive ( value ) {
  return ! value || typeof value !== 'object' && typeof value !== 'function';
};

},{}],119:[function(require,module,exports){
'use strict';

var isFinite  = require( './is-finite' );
var constants = require( './constants' );

module.exports = function isSafeInteger ( value ) {
  return isFinite( value ) &&
    value <= constants.MAX_SAFE_INT &&
    value >= constants.MIN_SAFE_INT &&
    value % 1 === 0;
};

},{"./constants":53,"./is-finite":110}],120:[function(require,module,exports){
'use strict';

module.exports = function isString ( value ) {
  return typeof value === 'string';
};

},{}],121:[function(require,module,exports){
'use strict';

var type = require( './type' );

module.exports = function isSymbol ( value ) {
  return type( value ) === 'symbol';
};

},{"./type":158}],122:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

module.exports = function isWindowLike ( value ) {
  return isObjectLike( value ) && value.window === value;
};

},{"./is-object-like":115}],123:[function(require,module,exports){
'use strict';

var isWindowLike = require( './is-window-like' );

var toString = {}.toString;

module.exports = function isWindow ( value ) {
  return isWindowLike( value ) && toString.call( value ) === '[object Window]';
};

},{"./is-window-like":122}],124:[function(require,module,exports){
'use strict';

module.exports = function isset ( key, obj ) {
  if ( obj === null || typeof obj === 'undefined' ) {
    return false;
  }

  return typeof obj[ key ] !== 'undefined' || key in obj;
};

},{}],125:[function(require,module,exports){
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

},{"./base/base-values":42,"./is-array-like-object":106,"./keys":128}],126:[function(require,module,exports){
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

},{"./is-array-like-object":106,"./matches-property":130,"./property":142}],127:[function(require,module,exports){
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

},{"./to-object":154}],128:[function(require,module,exports){
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

},{"./base/base-keys":37,"./support/support-keys":149,"./to-object":154}],129:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-index-of' )( true );

},{"./create/create-index-of":63}],130:[function(require,module,exports){
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

},{"./base/base-get":33,"./cast-path":47,"./constants":53}],131:[function(require,module,exports){
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

},{"./base/base-index-of":35}],132:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property-of' )( require( './base/base-invoke' ), true );

},{"./base/base-invoke":36,"./create/create-property-of":64}],133:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property' )( require( './base/base-invoke' ), true );

},{"./base/base-invoke":36,"./create/create-property":65}],134:[function(require,module,exports){
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

},{"./internal/memoize":100,"./is-array":108,"./is-plain-object":117,"./keys":128,"./to-object":154}],135:[function(require,module,exports){
'use strict';

module.exports = function noop () {}; // eslint-disable-line brace-rules/brace-on-same-line

},{}],136:[function(require,module,exports){
'use strict';

module.exports = Date.now || function now () {
  return new Date().getTime();
};

},{}],137:[function(require,module,exports){
'use strict';

var before = require( './before' );

module.exports = function once ( target ) {
  return before( 1, target );
};

},{"./before":43}],138:[function(require,module,exports){
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

},{"./base/base-clone-array":27,"./fragment":87}],139:[function(require,module,exports){
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

},{"./DOMWrapper":1,"./_":20,"./ajax":23,"./assign":25,"./assign-in":24,"./before":43,"./bind":44,"./clamp":48,"./clone":49,"./compound":52,"./constants":53,"./create":54,"./debounce":68,"./default-to":69,"./defaults":70,"./define-properties":71,"./define-property":72,"./each":74,"./each-right":73,"./escape":75,"./find":80,"./find-index":77,"./find-last":79,"./find-last-index":78,"./for-each":82,"./for-each-right":81,"./for-in":84,"./for-in-right":83,"./for-own":86,"./for-own-right":85,"./from-pairs":88,"./get":92,"./get-prototype-of":91,"./has":93,"./identity":94,"./index-of":95,"./invert":105,"./is-array":108,"./is-array-like":107,"./is-array-like-object":106,"./is-dom-element":109,"./is-finite":110,"./is-length":112,"./is-nan":113,"./is-number":114,"./is-object":116,"./is-object-like":115,"./is-plain-object":117,"./is-primitive":118,"./is-safe-integer":119,"./is-string":120,"./is-symbol":121,"./is-window":123,"./is-window-like":122,"./iteratee":126,"./keys":128,"./keys-in":127,"./last-index-of":129,"./method":133,"./method-of":132,"./mixin":134,"./noop":135,"./now":136,"./once":137,"./property":142,"./property-of":141,"./random":144,"./set":146,"./set-prototype-of":145,"./template":150,"./timer":151,"./timestamp":152,"./to-object":154,"./trim":157,"./trim-end":155,"./trim-start":156,"./type":158,"./unescape":159}],140:[function(require,module,exports){
'use strict';

/**
 * @member {object} _.placeholder
 */

},{}],141:[function(require,module,exports){
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

},{"./base/base-property":38,"./create/create-property-of":64}],142:[function(require,module,exports){
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

},{"./base/base-property":38,"./create/create-property":65}],143:[function(require,module,exports){
'use strict';

module.exports = {
  'class': 'className',
  'for':   'htmlFor'
};

},{}],144:[function(require,module,exports){
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

},{"./base/base-random":39}],145:[function(require,module,exports){
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

},{"./constants":53,"./is-primitive":118}],146:[function(require,module,exports){
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

},{"./base/base-set":41,"./cast-path":47,"./constants":53,"./to-object":154}],147:[function(require,module,exports){
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

},{}],148:[function(require,module,exports){
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

},{}],149:[function(require,module,exports){
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

},{}],150:[function(require,module,exports){
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

},{"./escape":75}],151:[function(require,module,exports){
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

},{"./timestamp":152}],152:[function(require,module,exports){
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

},{"./now":136}],153:[function(require,module,exports){
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

},{"./internal/unescape":103,"./is-symbol":121}],154:[function(require,module,exports){
'use strict';

var ERR = require( './constants' ).ERR;

module.exports = function toObject ( value ) {
  if ( value === null || typeof value === 'undefined' ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  return Object( value );
};

},{"./constants":53}],155:[function(require,module,exports){
'use strict';

if ( String.prototype.trimEnd ) {
  module.exports = function trimEnd ( string ) {
    return ( '' + string ).trimEnd();
  };
} else {
  module.exports = require( './create/create-trim' )( /[\s\uFEFF\xA0]+$/ );
}

},{"./create/create-trim":67}],156:[function(require,module,exports){
'use strict';

if ( String.prototype.trimStart ) {
  module.exports = function trimStart ( string ) {
    return ( '' + string ).trimStart();
  };
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+/ );
}

},{"./create/create-trim":67}],157:[function(require,module,exports){
'use strict';

if ( String.prototype.trim ) {
  module.exports = function trim ( string ) {
    return ( '' + string ).trim();
  };
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/ );
}

},{"./create/create-trim":67}],158:[function(require,module,exports){
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

},{"./create":54}],159:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-escape' )( /&(?:lt|gt|#34|#39|amp);/g, {
  '&lt;':  '<',
  '&gt;':  '>',
  '&#34;': '"',
  '&#39;': "'",
  '&amp;': '&'
} );

},{"./create/create-escape":57}],160:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-first' )( 'toUpperCase' );

},{"./create/create-first":59}]},{},[139])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJET01XcmFwcGVyL2luZGV4LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvY3NzLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZWFjaC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VuZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VxLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZmluZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2ZpcnN0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZ2V0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvbGFzdC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL21hcC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3BhcmVudC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlYWR5LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlQXR0ci5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlbW92ZVByb3AuanMiLCJET01XcmFwcGVyL3Byb3RvdHlwZS9zdGFjay5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3N0eWxlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvc3R5bGVzLmpzIiwiRXZlbnQuanMiLCJfLmpzIiwiYWNjZXNzLmpzIiwiYWpheC1vcHRpb25zLmpzIiwiYWpheC5qcyIsImFzc2lnbi1pbi5qcyIsImFzc2lnbi5qcyIsImJhc2UvYmFzZS1hc3NpZ24uanMiLCJiYXNlL2Jhc2UtY2xvbmUtYXJyYXkuanMiLCJiYXNlL2Jhc2UtY29weS1hcnJheS5qcyIsImJhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHkuanMiLCJiYXNlL2Jhc2UtZXhlYy5qcyIsImJhc2UvYmFzZS1mb3ItZWFjaC5qcyIsImJhc2UvYmFzZS1mb3ItaW4uanMiLCJiYXNlL2Jhc2UtZ2V0LmpzIiwiYmFzZS9iYXNlLWhhcy5qcyIsImJhc2UvYmFzZS1pbmRleC1vZi5qcyIsImJhc2UvYmFzZS1pbnZva2UuanMiLCJiYXNlL2Jhc2Uta2V5cy5qcyIsImJhc2UvYmFzZS1wcm9wZXJ0eS5qcyIsImJhc2UvYmFzZS1yYW5kb20uanMiLCJiYXNlL2Jhc2UtcmVtb3ZlLWF0dHIuanMiLCJiYXNlL2Jhc2Utc2V0LmpzIiwiYmFzZS9iYXNlLXZhbHVlcy5qcyIsImJlZm9yZS5qcyIsImJpbmQuanMiLCJjYWxsLWl0ZXJhdGVlLmpzIiwiY2FtZWxpemUuanMiLCJjYXN0LXBhdGguanMiLCJjbGFtcC5qcyIsImNsb25lLmpzIiwiY2xvc2VzdC1ub2RlLmpzIiwiY2xvc2VzdC5qcyIsImNvbXBvdW5kLmpzIiwiY29uc3RhbnRzLmpzIiwiY3JlYXRlLmpzIiwiY3JlYXRlL2NyZWF0ZS1hc3NpZ24uanMiLCJjcmVhdGUvY3JlYXRlLWVhY2guanMiLCJjcmVhdGUvY3JlYXRlLWVzY2FwZS5qcyIsImNyZWF0ZS9jcmVhdGUtZmluZC5qcyIsImNyZWF0ZS9jcmVhdGUtZmlyc3QuanMiLCJjcmVhdGUvY3JlYXRlLWZvci1lYWNoLmpzIiwiY3JlYXRlL2NyZWF0ZS1mb3ItaW4uanMiLCJjcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbi5qcyIsImNyZWF0ZS9jcmVhdGUtaW5kZXgtb2YuanMiLCJjcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mLmpzIiwiY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS5qcyIsImNyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AuanMiLCJjcmVhdGUvY3JlYXRlLXRyaW0uanMiLCJkZWJvdW5jZS5qcyIsImRlZmF1bHQtdG8uanMiLCJkZWZhdWx0cy5qcyIsImRlZmluZS1wcm9wZXJ0aWVzLmpzIiwiZGVmaW5lLXByb3BlcnR5LmpzIiwiZWFjaC1yaWdodC5qcyIsImVhY2guanMiLCJlc2NhcGUuanMiLCJldmVudC5qcyIsImZpbmQtaW5kZXguanMiLCJmaW5kLWxhc3QtaW5kZXguanMiLCJmaW5kLWxhc3QuanMiLCJmaW5kLmpzIiwiZm9yLWVhY2gtcmlnaHQuanMiLCJmb3ItZWFjaC5qcyIsImZvci1pbi1yaWdodC5qcyIsImZvci1pbi5qcyIsImZvci1vd24tcmlnaHQuanMiLCJmb3Itb3duLmpzIiwiZnJhZ21lbnQuanMiLCJmcm9tLXBhaXJzLmpzIiwiZ2V0LWVsZW1lbnQtaC5qcyIsImdldC1lbGVtZW50LXcuanMiLCJnZXQtcHJvdG90eXBlLW9mLmpzIiwiZ2V0LmpzIiwiaGFzLmpzIiwiaWRlbnRpdHkuanMiLCJpbmRleC1vZi5qcyIsImludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uLmpzIiwiaW50ZXJuYWwvY3NzLW51bWJlcnMuanMiLCJpbnRlcm5hbC9maXJzdC5qcyIsImludGVybmFsL2dldC1zdHlsZS5qcyIsImludGVybmFsL21lbW9pemUuanMiLCJpbnRlcm5hbC90ZXh0LWNvbnRlbnQuanMiLCJpbnRlcm5hbC90eXBlLmpzIiwiaW50ZXJuYWwvdW5lc2NhcGUuanMiLCJpbnRlcm5hbC93b3Jkcy5qcyIsImludmVydC5qcyIsImlzLWFycmF5LWxpa2Utb2JqZWN0LmpzIiwiaXMtYXJyYXktbGlrZS5qcyIsImlzLWFycmF5LmpzIiwiaXMtZG9tLWVsZW1lbnQuanMiLCJpcy1maW5pdGUuanMiLCJpcy1rZXkuanMiLCJpcy1sZW5ndGguanMiLCJpcy1uYW4uanMiLCJpcy1udW1iZXIuanMiLCJpcy1vYmplY3QtbGlrZS5qcyIsImlzLW9iamVjdC5qcyIsImlzLXBsYWluLW9iamVjdC5qcyIsImlzLXByaW1pdGl2ZS5qcyIsImlzLXNhZmUtaW50ZWdlci5qcyIsImlzLXN0cmluZy5qcyIsImlzLXN5bWJvbC5qcyIsImlzLXdpbmRvdy1saWtlLmpzIiwiaXMtd2luZG93LmpzIiwiaXNzZXQuanMiLCJpdGVyYWJsZS5qcyIsIml0ZXJhdGVlLmpzIiwia2V5cy1pbi5qcyIsImtleXMuanMiLCJsYXN0LWluZGV4LW9mLmpzIiwibWF0Y2hlcy1wcm9wZXJ0eS5qcyIsIm1hdGNoZXMtc2VsZWN0b3IuanMiLCJtZXRob2Qtb2YuanMiLCJtZXRob2QuanMiLCJtaXhpbi5qcyIsIm5vb3AuanMiLCJub3cuanMiLCJvbmNlLmpzIiwicGFyc2UtaHRtbC5qcyIsInBlYWtvLmpzIiwicGxhY2Vob2xkZXIuanMiLCJwcm9wZXJ0eS1vZi5qcyIsInByb3BlcnR5LmpzIiwicHJvcHMuanMiLCJyYW5kb20uanMiLCJzZXQtcHJvdG90eXBlLW9mLmpzIiwic2V0LmpzIiwic3VwcG9ydC9zdXBwb3J0LWRlZmluZS1wcm9wZXJ0eS5qcyIsInN1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlLmpzIiwic3VwcG9ydC9zdXBwb3J0LWtleXMuanMiLCJ0ZW1wbGF0ZS5qcyIsInRpbWVyLmpzIiwidGltZXN0YW1wLmpzIiwidG8ta2V5LmpzIiwidG8tb2JqZWN0LmpzIiwidHJpbS1lbmQuanMiLCJ0cmltLXN0YXJ0LmpzIiwidHJpbS5qcyIsInR5cGUuanMiLCJ1bmVzY2FwZS5qcyIsInVwcGVyLWZpcnN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTVdyYXBwZXI7XG5cbnZhciBfdGV4dENvbnRlbnQgICAgICAgICA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC90ZXh0LWNvbnRlbnQnICk7XG52YXIgX2ZpcnN0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvZmlyc3QnICk7XG52YXIgX3dvcmRzICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvd29yZHMnICk7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQtZ2V0LWF0dHJpYnV0ZScgKTtcblxudmFyIGNyZWF0ZVJlbW92ZVByb3BlcnR5ID0gcmVxdWlyZSggJy4uL2NyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AnICk7XG5cbnZhciBiYXNlRm9yRWFjaCAgICAgICAgICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWVhY2gnICk7XG52YXIgYmFzZUZvckluICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1pbicgKTtcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ICAgID0gcmVxdWlyZSggJy4uL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xudmFyIGlzRE9NRWxlbWVudCAgICAgICAgID0gcmVxdWlyZSggJy4uL2lzLWRvbS1lbGVtZW50JyApO1xudmFyIGdldEVsZW1lbnRXICAgICAgICAgID0gcmVxdWlyZSggJy4uL2dldC1lbGVtZW50LXcnICk7XG52YXIgZ2V0RWxlbWVudEggICAgICAgICAgPSByZXF1aXJlKCAnLi4vZ2V0LWVsZW1lbnQtaCcgKTtcbnZhciBwYXJzZUhUTUwgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9wYXJzZS1odG1sJyApO1xudmFyIGFjY2VzcyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2FjY2VzcycgKTtcbnZhciBldmVudCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9ldmVudCcgKTtcblxudmFyIHJzZWxlY3RvciA9IC9eKD86IyhbXFx3LV0rKXwoW1xcdy1dKyl8XFwuKFtcXHctXSspKSQvO1xuXG5mdW5jdGlvbiBET01XcmFwcGVyICggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG4gIHZhciBtYXRjaDtcbiAgdmFyIGxpc3Q7XG4gIHZhciBpO1xuXG4gIC8vIF8oKTtcblxuICBpZiAoICEgc2VsZWN0b3IgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gXyggd2luZG93ICk7XG5cbiAgaWYgKCBpc0RPTUVsZW1lbnQoIHNlbGVjdG9yICkgKSB7XG4gICAgX2ZpcnN0KCB0aGlzLCBzZWxlY3RvciApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyApIHtcbiAgICBpZiAoIHR5cGVvZiBjb250ZXh0ICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIGlmICggISBjb250ZXh0Ll9wZWFrbyApIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBET01XcmFwcGVyKCBjb250ZXh0ICk7XG4gICAgICB9XG5cbiAgICAgIGlmICggISBjb250ZXh0WyAwIF0gKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29udGV4dCA9IGNvbnRleHRbIDAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGV4dCA9IGRvY3VtZW50O1xuICAgIH1cblxuICAgIGlmICggc2VsZWN0b3IuY2hhckF0KCAwICkgIT09ICc8JyApIHtcbiAgICAgIG1hdGNoID0gcnNlbGVjdG9yLmV4ZWMoIHNlbGVjdG9yICk7XG5cbiAgICAgIC8vIF8oICdhID4gYiArIGMnICk7XG4gICAgICAvLyBfKCAnI2lkJywgJy5hbm90aGVyLWVsZW1lbnQnIClcblxuICAgICAgaWYgKCAhIG1hdGNoIHx8ICEgY29udGV4dC5nZXRFbGVtZW50QnlJZCAmJiBtYXRjaFsgMSBdIHx8ICEgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIG1hdGNoWyAzIF0gKSB7XG4gICAgICAgIGlmICggbWF0Y2ggJiYgbWF0Y2hbIDEgXSApIHtcbiAgICAgICAgICBsaXN0ID0gWyBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoIHNlbGVjdG9yICkgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaXN0ID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApO1xuICAgICAgICB9XG5cbiAgICAgIC8vIF8oICcjaWQnICk7XG5cbiAgICAgIH0gZWxzZSBpZiAoIG1hdGNoWyAxIF0gKSB7XG4gICAgICAgIGlmICggKCBsaXN0ID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggbWF0Y2hbIDEgXSApICkgKSB7XG4gICAgICAgICAgX2ZpcnN0KCB0aGlzLCBsaXN0ICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIF8oICd0YWcnICk7XG5cbiAgICAgIH0gZWxzZSBpZiAoIG1hdGNoWyAyIF0gKSB7XG4gICAgICAgIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBtYXRjaFsgMiBdICk7XG5cbiAgICAgIC8vIF8oICcuY2xhc3MnICk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIG1hdGNoWyAzIF0gKTtcbiAgICAgIH1cblxuICAgIC8vIF8oICc8ZGl2PicgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0ID0gcGFyc2VIVE1MKCBzZWxlY3RvciwgY29udGV4dCApO1xuICAgIH1cblxuICAvLyBfKCBbIC4uLiBdICk7XG5cbiAgfSBlbHNlIGlmICggaXNBcnJheUxpa2VPYmplY3QoIHNlbGVjdG9yICkgKSB7XG4gICAgbGlzdCA9IHNlbGVjdG9yO1xuXG4gIC8vIF8oIGZ1bmN0aW9uICggXyApIHsgLi4uIH0gKTtcblxuICB9IGVsc2UgaWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBkb2N1bWVudCApLnJlYWR5KCBzZWxlY3RvciApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFR5cGVFcnJvciggJ0dvdCB1bmV4cGVjdGVkIHNlbGVjdG9yOiAnICsgc2VsZWN0b3IgKyAnLicgKTtcbiAgfVxuXG4gIGlmICggISBsaXN0ICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMubGVuZ3RoID0gbGlzdC5sZW5ndGg7XG5cbiAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgdGhpc1sgaSBdID0gbGlzdFsgaSBdO1xuICB9XG59XG5cbkRPTVdyYXBwZXIucHJvdG90eXBlID0ge1xuICBlYWNoOiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZWFjaCcgKSxcbiAgZW5kOiAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2VuZCcgKSxcbiAgZXE6ICAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2VxJyApLFxuICBmaW5kOiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZmluZCcgKSxcbiAgZmlyc3Q6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2ZpcnN0JyApLFxuICBnZXQ6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZ2V0JyApLFxuICBsYXN0OiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvbGFzdCcgKSxcbiAgbWFwOiAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL21hcCcgKSxcbiAgcGFyZW50OiAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3BhcmVudCcgKSxcbiAgcmVhZHk6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3JlYWR5JyApLFxuICByZW1vdmU6ICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVtb3ZlJyApLFxuICByZW1vdmVBdHRyOiByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVtb3ZlQXR0cicgKSxcbiAgcmVtb3ZlUHJvcDogcmVxdWlyZSggJy4vcHJvdG90eXBlL3JlbW92ZVByb3AnICksXG4gIHN0YWNrOiAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9zdGFjaycgKSxcbiAgc3R5bGU6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3N0eWxlJyApLFxuICBzdHlsZXM6ICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvc3R5bGVzJyApLFxuICBjc3M6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvY3NzJyApLFxuICBjb25zdHJ1Y3RvcjogRE9NV3JhcHBlcixcbiAgbGVuZ3RoOiAwLFxuICBfcGVha286IHRydWVcbn07XG5cbmJhc2VGb3JJbigge1xuICB0cmlnZ2VyOiAndHJpZ2dlcicsXG4gIG9uY2U6ICAgICdvbicsXG4gIG9mZjogICAgICdvZmYnLFxuICBvbjogICAgICAnb24nXG59LCBmdW5jdGlvbiAoIG5hbWUsIG1ldGhvZE5hbWUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBtZXRob2ROYW1lIF0gPSBmdW5jdGlvbiAoIHR5cGVzLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG4gICAgdmFyIHJlbW92ZUFsbCA9IG1ldGhvZE5hbWUgPT09ICdvZmYnICYmICEgYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgb25jZSA9IG1ldGhvZE5hbWUgPT09ICdvbmNlJztcbiAgICB2YXIgZWxlbWVudDtcbiAgICB2YXIgaTtcbiAgICB2YXIgajtcbiAgICB2YXIgbDtcblxuICAgIGlmICggISByZW1vdmVBbGwgKSB7XG4gICAgICB0eXBlcyA9IF93b3JkcyggdHlwZXMgKTtcblxuICAgICAgaWYgKCAhIHR5cGVzLmxlbmd0aCApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGwgPSB0eXBlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gb2ZmKCB0eXBlcywgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKVxuICAgIC8vIG9mZiggdHlwZXMsIGxpc3RlbmVyIClcblxuICAgIGlmICggbWV0aG9kTmFtZSAhPT0gJ3RyaWdnZXInICYmIHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIGlmICggdHlwZW9mIGxpc3RlbmVyICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgdXNlQ2FwdHVyZSA9IGxpc3RlbmVyO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lciA9IHNlbGVjdG9yO1xuICAgICAgc2VsZWN0b3IgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIHVzZUNhcHR1cmUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdXNlQ2FwdHVyZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgZWxlbWVudCA9IHRoaXNbIGkgXTtcblxuICAgICAgaWYgKCByZW1vdmVBbGwgKSB7XG4gICAgICAgIGV2ZW50Lm9mZiggZWxlbWVudCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICggaiA9IDA7IGogPCBsOyArK2ogKSB7XG4gICAgICAgICAgZXZlbnRbIG5hbWUgXSggZWxlbWVudCwgdHlwZXNbIGogXSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlLCBvbmNlICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBpZiAoIG1ldGhvZE5hbWUgPT09ICdvbmNlJyApIHtcbiAgICB2YXIgY291bnQgPSAwO1xuXG4gICAgRE9NV3JhcHBlci5wcm90b3R5cGUub25lID0gZnVuY3Rpb24gb25lICgpIHtcbiAgICAgIGlmICggY291bnQrKyA8IDEgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCAnXCJvbmVcIiBpcyBkZXByZWNhdGVkIG5vdy4gVXNlIFwib25jZVwiIGluc3RlYWQuJyApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5vbmNlLmFwcGx5KCB0aGlzLCBbXS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xuICAgIH07XG4gIH1cbn0sIHZvaWQgMCwgdHJ1ZSwgWyAndHJpZ2dlcicsICdvbmNlJywgJ29mZicsICdvbicgXSApO1xuXG5iYXNlRm9yRWFjaCggW1xuICAnYmx1cicsICAgICAgICAnZm9jdXMnLCAgICAgICAnZm9jdXNpbicsXG4gICdmb2N1c291dCcsICAgICdyZXNpemUnLCAgICAgICdzY3JvbGwnLFxuICAnY2xpY2snLCAgICAgICAnZGJsY2xpY2snLCAgICAnbW91c2Vkb3duJyxcbiAgJ21vdXNldXAnLCAgICAgJ21vdXNlbW92ZScsICAgJ21vdXNlb3ZlcicsXG4gICdtb3VzZW91dCcsICAgICdtb3VzZWVudGVyJywgICdtb3VzZWxlYXZlJyxcbiAgJ2NoYW5nZScsICAgICAgJ3NlbGVjdCcsICAgICAgJ3N1Ym1pdCcsXG4gICdrZXlkb3duJywgICAgICdrZXlwcmVzcycsICAgICdrZXl1cCcsXG4gICdjb250ZXh0bWVudScsICd0b3VjaHN0YXJ0JywgICd0b3VjaG1vdmUnLFxuICAndG91Y2hlbmQnLCAgICAndG91Y2hlbnRlcicsICAndG91Y2hsZWF2ZScsXG4gICd0b3VjaGNhbmNlbCcsICdsb2FkJ1xuXSwgZnVuY3Rpb24gKCBldmVudFR5cGUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBldmVudFR5cGUgXSA9IGZ1bmN0aW9uICggYXJnICkge1xuICAgIHZhciBpO1xuICAgIHZhciBsO1xuXG4gICAgaWYgKCB0eXBlb2YgYXJnICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgcmV0dXJuIHRoaXMudHJpZ2dlciggZXZlbnRUeXBlLCBhcmcgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICB0aGlzLm9uKCBldmVudFR5cGUsIGFyZ3VtZW50c1sgaSBdLCBmYWxzZSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSwgdm9pZCAwLCB0cnVlICk7XG5cbmJhc2VGb3JJbigge1xuICBkaXNhYmxlZDogJ2Rpc2FibGVkJyxcbiAgY2hlY2tlZDogICdjaGVja2VkJyxcbiAgdmFsdWU6ICAgICd2YWx1ZScsXG4gIHRleHQ6ICAgICAndGV4dENvbnRlbnQnIGluIGRvY3VtZW50LmJvZHkgPyAndGV4dENvbnRlbnQnIDogX3RleHRDb250ZW50LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgaHRtbDogICAgICdpbm5lckhUTUwnXG59LCBmdW5jdGlvbiAoIGtleSwgbWV0aG9kTmFtZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIG1ldGhvZE5hbWUgXSA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICBpZiAoICEgKCBlbGVtZW50ID0gdGhpc1sgMCBdICkgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRbIGtleSBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5KCBlbGVtZW50ICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCB0eXBlb2Yga2V5ICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICBlbGVtZW50WyBrZXkgXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAga2V5KCBlbGVtZW50LCB2YWx1ZSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSwgdm9pZCAwLCB0cnVlLCBbICdkaXNhYmxlZCcsICdjaGVja2VkJywgJ3ZhbHVlJywgJ3RleHQnLCAnaHRtbCcgXSApO1xuXG4oIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByb3BzID0gcmVxdWlyZSggJy4uL3Byb3BzJyApO1xuXG4gIGZ1bmN0aW9uIF9hdHRyICggZWxlbWVudCwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICkge1xuICAgIGlmICggZWxlbWVudC5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICggcHJvcHNbIGtleSBdIHx8ICEgc3VwcG9ydCApIHtcbiAgICAgIHJldHVybiBfcHJvcCggZWxlbWVudCwgcHJvcHNbIGtleSBdIHx8IGtleSwgdmFsdWUsIGNoYWluYWJsZSApO1xuICAgIH1cblxuICAgIGlmICggISBjaGFpbmFibGUgKSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoIGtleSApO1xuICAgIH1cblxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCBrZXksIHZhbHVlICk7XG4gIH1cblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gYXR0ciAoIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWx1ZSwgX2F0dHIgKTtcbiAgfTtcblxuICBmdW5jdGlvbiBfcHJvcCAoIGVsZW1lbnQsIGtleSwgdmFsdWUsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRbIGtleSBdO1xuICAgIH1cblxuICAgIGVsZW1lbnRbIGtleSBdID0gdmFsdWU7XG4gIH1cblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5wcm9wID0gZnVuY3Rpb24gcHJvcCAoIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWx1ZSwgX3Byb3AgKTtcbiAgfTtcbn0gKSgpO1xuXG4oIGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9wZWFrb0lkID0gMDtcbiAgdmFyIF9kYXRhID0ge307XG5cbiAgZnVuY3Rpb24gX2FjY2Vzc0RhdGEgKCBlbGVtZW50LCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKSB7XG4gICAgdmFyIGF0dHJpYnV0ZXM7XG4gICAgdmFyIGF0dHJpYnV0ZTtcbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGlmICggISBlbGVtZW50Ll9wZWFrb0lkICkge1xuICAgICAgZWxlbWVudC5fcGVha29JZCA9ICsrX3BlYWtvSWQ7XG4gICAgfVxuXG4gICAgaWYgKCAhICggZGF0YSA9IF9kYXRhWyBlbGVtZW50Ll9wZWFrb0lkIF0gKSApIHtcbiAgICAgIGRhdGEgPSBfZGF0YVsgZWxlbWVudC5fcGVha29JZCBdID0ge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG5cbiAgICAgIGZvciAoIGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXMsIGkgPSAwLCBsID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICAgIGlmICggISAoIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbIGkgXSApLm5vZGVOYW1lLmluZGV4T2YoICdkYXRhLScgKSApIHtcbiAgICAgICAgICBkYXRhWyBhdHRyaWJ1dGUubm9kZU5hbWUuc2xpY2UoIDUgKSBdID0gYXR0cmlidXRlLm5vZGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggY2hhaW5hYmxlICkge1xuICAgICAgZGF0YVsga2V5IF0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRhdGFbIGtleSBdO1xuICAgIH1cbiAgfVxuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbiBkYXRhICgga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbHVlLCBfYWNjZXNzRGF0YSApO1xuICB9O1xuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLnJlbW92ZURhdGEgPSBjcmVhdGVSZW1vdmVQcm9wZXJ0eSggZnVuY3Rpb24gX3JlbW92ZURhdGEgKCBlbGVtZW50LCBrZXkgKSB7XG4gICAgaWYgKCBlbGVtZW50Ll9wZWFrb0lkICkge1xuICAgICAgZGVsZXRlIF9kYXRhWyBlbGVtZW50Ll9wZWFrb0lkIF1bIGtleSBdO1xuICAgIH1cbiAgfSApO1xufSApKCk7XG5cbmJhc2VGb3JJbiggeyBoZWlnaHQ6IGdldEVsZW1lbnRXLCB3aWR0aDogZ2V0RWxlbWVudEggfSwgZnVuY3Rpb24gKCBnZXQsIG5hbWUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBuYW1lIF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCB0aGlzWyAwIF0gKSB7XG4gICAgICByZXR1cm4gZ2V0KCB0aGlzWyAwIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn0sIHZvaWQgMCwgdHJ1ZSwgWyAnaGVpZ2h0JywgJ3dpZHRoJyBdICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5ID0gcmVxdWlyZSggJy4uLy4uL2lzLWFycmF5JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNzcyAoIGssIHYgKSB7XG4gIGlmICggaXNBcnJheSggayApICkge1xuICAgIHJldHVybiB0aGlzLnN0eWxlcyggayApO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuc3R5bGUoIGssIHYgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZWFjaCAoIGZ1biApIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG5cbiAgZm9yICggOyBpIDwgbGVuOyArK2kgKSB7XG4gICAgaWYgKCBmdW4uY2FsbCggdGhpc1sgaSBdLCBpLCB0aGlzWyBpIF0gKSA9PT0gZmFsc2UgKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuZCAoKSB7XG4gIHJldHVybiB0aGlzLl9wcmV2aW91cyB8fCBuZXcgRE9NV3JhcHBlcigpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlcSAoIGluZGV4ICkge1xuICByZXR1cm4gdGhpcy5zdGFjayggdGhpcy5nZXQoIGluZGV4ICkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbmQgKCBzZWxlY3RvciApIHtcbiAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBzZWxlY3RvciwgdGhpcyApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaXJzdCAoKSB7XG4gIHJldHVybiB0aGlzLmVxKCAwICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xvbmUgPSByZXF1aXJlKCAnLi4vLi4vYmFzZS9iYXNlLWNsb25lLWFycmF5JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldCAoIGluZGV4ICkge1xuICBpZiAoIHR5cGVvZiBpbmRleCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGNsb25lKCB0aGlzICk7XG4gIH1cblxuICBpZiAoIGluZGV4IDwgMCApIHtcbiAgICByZXR1cm4gdGhpc1sgdGhpcy5sZW5ndGggKyBpbmRleCBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXNbIGluZGV4IF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxhc3QgKCkge1xuICByZXR1cm4gdGhpcy5lcSggLTEgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFwICggZnVuICkge1xuICB2YXIgZWxzID0gdGhpcy5zdGFjaygpO1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG4gIHZhciBlbDtcbiAgdmFyIGk7XG5cbiAgZWxzLmxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gIGZvciAoIGkgPSAwOyBpIDwgbGVuOyArK2kgKSB7XG4gICAgZWxzWyBpIF0gPSBmdW4uY2FsbCggZWwgPSB0aGlzWyBpIF0sIGksIGVsICk7XG4gIH1cblxuICByZXR1cm4gZWxzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4uLy4uL2Jhc2UvYmFzZS1pbmRleC1vZicgKTtcbnZhciBtYXRjaGVzICAgICA9IHJlcXVpcmUoICcuLi8uLi9tYXRjaGVzLXNlbGVjdG9yJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcmVudCAoIHNlbGVjdG9yICkge1xuICB2YXIgZWxlbWVudHMgPSB0aGlzLnN0YWNrKCk7XG4gIHZhciBlbGVtZW50O1xuICB2YXIgcGFyZW50O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBwYXJlbnQgPSAoIGVsZW1lbnQgPSB0aGlzWyBpIF0gKS5ub2RlVHlwZSA9PT0gMSAmJiBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICBpZiAoIHBhcmVudCAmJiBiYXNlSW5kZXhPZiggZWxlbWVudHMsIHBhcmVudCApIDwgMCAmJiAoICEgc2VsZWN0b3IgfHwgbWF0Y2hlcy5jYWxsKCBwYXJlbnQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgIGVsZW1lbnRzWyBlbGVtZW50cy5sZW5ndGgrKyBdID0gcGFyZW50O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBldmVudCA9IHJlcXVpcmUoICcuLi8uLi9ldmVudCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZWFkeSAoIGNiICkge1xuICB2YXIgZG9jID0gdGhpc1sgMCBdO1xuICB2YXIgcmVhZHlTdGF0ZTtcblxuICBpZiAoICEgZG9jIHx8IGRvYy5ub2RlVHlwZSAhPT0gOSApIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlYWR5U3RhdGUgPSBkb2MucmVhZHlTdGF0ZTtcblxuICBpZiAoIGRvYy5hdHRhY2hFdmVudCA/IHJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScgOiByZWFkeVN0YXRlID09PSAnbG9hZGluZycgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICAgIGV2ZW50Lm9uKCBkb2MsICdET01Db250ZW50TG9hZGVkJywgbnVsbCwgZnVuY3Rpb24gKCkge1xuICAgICAgY2IoKTtcbiAgICB9LCBmYWxzZSwgdHJ1ZSApO1xuICB9IGVsc2Uge1xuICAgIGNiKCk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVtb3ZlICgpIHtcbiAgdmFyIGkgPSB0aGlzLmxlbmd0aCAtIDE7XG4gIHZhciBwYXJlbnROb2RlO1xuICB2YXIgbm9kZVR5cGU7XG5cbiAgZm9yICggOyBpID49IDA7IC0taSApIHtcbiAgICBub2RlVHlwZSA9IHRoaXNbIGkgXS5ub2RlVHlwZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBicmFjZS1ydWxlcy9icmFjZS1vbi1zYW1lLWxpbmVcbiAgICBpZiAoIG5vZGVUeXBlICE9PSAxICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gMyAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDggJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSA5ICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gMTEgKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoICggcGFyZW50Tm9kZSA9IHRoaXNbIGkgXS5wYXJlbnROb2RlICkgKSB7XG4gICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzWyBpIF0gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4uLy4uL2NyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AnICkoIHJlcXVpcmUoICcuLi8uLi9iYXNlL2Jhc2UtcmVtb3ZlLWF0dHInICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi4vLi4vY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcCcgKSggZnVuY3Rpb24gX3JlbW92ZVByb3AgKCBlbGVtZW50LCBrZXkgKSB7XG4gIGRlbGV0ZSBlbGVtZW50WyBrZXkgXTtcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9maXJzdCAgICAgICAgPSByZXF1aXJlKCAnLi4vLi4vaW50ZXJuYWwvZmlyc3QnICk7XG5cbnZhciBiYXNlQ29weUFycmF5ID0gcmVxdWlyZSggJy4uLy4uL2Jhc2UvYmFzZS1jb3B5LWFycmF5JyApO1xuXG52YXIgRE9NV3JhcHBlciAgICA9IHJlcXVpcmUoICcuLicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdGFjayAoIGVsZW1lbnRzICkge1xuICB2YXIgd3JhcHBlciA9IG5ldyBET01XcmFwcGVyKCk7XG5cbiAgaWYgKCBlbGVtZW50cyApIHtcbiAgICBpZiAoIGVsZW1lbnRzLmxlbmd0aCApIHtcbiAgICAgIGJhc2VDb3B5QXJyYXkoIHdyYXBwZXIsIGVsZW1lbnRzICkubGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZmlyc3QoIHdyYXBwZXIsIGVsZW1lbnRzICk7XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlci5fcHJldmlvdXMgPSB3cmFwcGVyLnByZXZPYmplY3QgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuXG4gIHJldHVybiB3cmFwcGVyO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jc3NOdW1iZXJzICAgPSByZXF1aXJlKCAnLi4vLi4vaW50ZXJuYWwvY3NzLW51bWJlcnMnICk7XG52YXIgX2dldFN0eWxlICAgICA9IHJlcXVpcmUoICcuLi8uLi9pbnRlcm5hbC9nZXQtc3R5bGUnICk7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi4vLi4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgY2FtZWxpemUgICAgID0gcmVxdWlyZSggJy4uLy4uL2NhbWVsaXplJyApO1xudmFyIGFjY2VzcyAgICAgICA9IHJlcXVpcmUoICcuLi8uLi9hY2Nlc3MnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGUgKCBrZXksIHZhbCApIHtcbiAgdmFyIHB4ID0gJ2RvLW5vdC1hZGQnO1xuXG4gIC8vIENvbXB1dGUgcHggb3IgYWRkICdweCcgdG8gYHZhbGAgbm93LlxuXG4gIGlmICggdHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYgISBfY3NzTnVtYmVyc1sgY2FtZWxpemUoIGtleSApIF0gKSB7XG4gICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyApIHtcbiAgICAgIHZhbCArPSAncHgnO1xuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICBweCA9ICdnb3QtYS1mdW5jdGlvbic7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc09iamVjdExpa2UoIGtleSApICkge1xuICAgIHB4ID0gJ2dvdC1hbi1vYmplY3QnO1xuICB9XG5cbiAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWwsIGZ1bmN0aW9uICggZWxlbWVudCwga2V5LCB2YWwsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoIGVsZW1lbnQubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBrZXkgPSBjYW1lbGl6ZSgga2V5ICk7XG5cbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIF9nZXRTdHlsZSggZWxlbWVudCwga2V5ICk7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiAoIHB4ID09PSAnZ290LWEtZnVuY3Rpb24nIHx8IHB4ID09PSAnZ290LWFuLW9iamVjdCcgJiYgISBfY3NzTnVtYmVyc1sga2V5IF0gKSApIHtcbiAgICAgIHZhbCArPSAncHgnO1xuICAgIH1cblxuICAgIGVsZW1lbnQuc3R5bGVbIGtleSBdID0gdmFsO1xuICB9ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FtZWxpemUgPSByZXF1aXJlKCAnLi4vLi4vY2FtZWxpemUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGVzICgga2V5cyApIHtcbiAgdmFyIGVsZW1lbnQgPSB0aGlzWyAwIF07XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGNvbXB1dGVkO1xuICB2YXIgdmFsdWU7XG4gIHZhciBrZXk7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IGtleXNbIGkgXTtcblxuICAgIGlmICggISBjb21wdXRlZCApIHtcbiAgICAgIHZhbHVlID0gZWxlbWVudC5zdHlsZVsgKCBrZXkgPSBjYW1lbGl6ZSgga2V5ICkgKSBdO1xuICAgIH1cblxuICAgIGlmICggISB2YWx1ZSApIHtcbiAgICAgIGlmICggISBjb21wdXRlZCApIHtcbiAgICAgICAgY29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlKCBlbGVtZW50ICk7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgga2V5ICk7XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2goIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VBc3NpZ24gPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtYXNzaWduJyApO1xuXG52YXIgaXNzZXQgICAgICA9IHJlcXVpcmUoICcuL2lzc2V0JyApO1xudmFyIGtleXMgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG52YXIgZGVmYXVsdHMgPSBbXG4gICdhbHRLZXknLCAgICAgICAgJ2J1YmJsZXMnLCAgICAgICAgJ2NhbmNlbGFibGUnLFxuICAnY2FuY2VsQnViYmxlJywgICdjaGFuZ2VkVG91Y2hlcycsICdjdHJsS2V5JyxcbiAgJ2N1cnJlbnRUYXJnZXQnLCAnZGV0YWlsJywgICAgICAgICAnZXZlbnRQaGFzZScsXG4gICdtZXRhS2V5JywgICAgICAgJ3BhZ2VYJywgICAgICAgICAgJ3BhZ2VZJyxcbiAgJ3NoaWZ0S2V5JywgICAgICAndmlldycsICAgICAgICAgICAnY2hhcicsXG4gICdjaGFyQ29kZScsICAgICAgJ2tleScsICAgICAgICAgICAgJ2tleUNvZGUnLFxuICAnYnV0dG9uJywgICAgICAgICdidXR0b25zJywgICAgICAgICdjbGllbnRYJyxcbiAgJ2NsaWVudFknLCAgICAgICAnb2Zmc2V0WCcsICAgICAgICAnb2Zmc2V0WScsXG4gICdwb2ludGVySWQnLCAgICAgJ3BvaW50ZXJUeXBlJywgICAgJ3JlbGF0ZWRUYXJnZXQnLFxuICAncmV0dXJuVmFsdWUnLCAgICdzY3JlZW5YJywgICAgICAgICdzY3JlZW5ZJyxcbiAgJ3RhcmdldFRvdWNoZXMnLCAndG9FbGVtZW50JywgICAgICAndG91Y2hlcycsXG4gICdpc1RydXN0ZWQnXG5dO1xuXG5mdW5jdGlvbiBFdmVudCAoIG9yaWdpbmFsLCBvcHRpb25zICkge1xuICB2YXIgaTtcbiAgdmFyIGs7XG5cbiAgaWYgKCB0eXBlb2Ygb3JpZ2luYWwgPT09ICdvYmplY3QnICkge1xuICAgIGZvciAoIGkgPSBkZWZhdWx0cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggaXNzZXQoIGsgPSBkZWZhdWx0c1sgaSBdLCBvcmlnaW5hbCApICkge1xuICAgICAgICB0aGlzWyBrIF0gPSBvcmlnaW5hbFsgayBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggb3JpZ2luYWwudGFyZ2V0ICkge1xuICAgICAgaWYgKCBvcmlnaW5hbC50YXJnZXQubm9kZVR5cGUgPT09IDMgKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWwudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsLnRhcmdldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9yaWdpbmFsID0gdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG4gICAgdGhpcy53aGljaCA9IEV2ZW50LndoaWNoKCBvcmlnaW5hbCApO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuaXNUcnVzdGVkID0gZmFsc2U7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBvcmlnaW5hbCA9PT0gJ3N0cmluZycgKSB7XG4gICAgdGhpcy50eXBlID0gb3JpZ2luYWw7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyApIHtcbiAgICB0aGlzLnR5cGUgPSBvcHRpb25zO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgKSB7XG4gICAgYmFzZUFzc2lnbiggdGhpcywgb3B0aW9ucywga2V5cyggb3B0aW9ucyApICk7XG4gIH1cbn1cblxuRXZlbnQucHJvdG90eXBlID0ge1xuICBwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24gcHJldmVudERlZmF1bHQgKCkge1xuICAgIGlmICggdGhpcy5vcmlnaW5hbCApIHtcbiAgICAgIGlmICggdGhpcy5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJldHVyblZhbHVlID0gdGhpcy5vcmlnaW5hbC5yZXR1cm5WYWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24gKCkge1xuICAgIGlmICggdGhpcy5vcmlnaW5hbCApIHtcbiAgICAgIGlmICggdGhpcy5vcmlnaW5hbC5zdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9yaWdpbmFsLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FuY2VsQnViYmxlID0gdGhpcy5vcmlnaW5hbC5jYW5jZWxCdWJibGU7XG4gICAgfVxuICB9LFxuXG4gIGNvbnN0cnVjdG9yOiBFdmVudFxufTtcblxuRXZlbnQud2hpY2ggPSBmdW5jdGlvbiB3aGljaCAoIGV2ZW50ICkge1xuICBpZiAoIGV2ZW50LndoaWNoICkge1xuICAgIHJldHVybiBldmVudC53aGljaDtcbiAgfVxuXG4gIGlmICggISBldmVudC50eXBlLmluZGV4T2YoICdrZXknICkgKSB7XG4gICAgaWYgKCB0eXBlb2YgZXZlbnQuY2hhckNvZGUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuIGV2ZW50LmNoYXJDb2RlO1xuICAgIH1cblxuICAgIHJldHVybiBldmVudC5rZXlDb2RlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgZXZlbnQuYnV0dG9uID09PSAndW5kZWZpbmVkJyB8fCAhIC9eKD86bW91c2V8cG9pbnRlcnxjb250ZXh0bWVudXxkcmFnfGRyb3ApfGNsaWNrLy50ZXN0KCBldmVudC50eXBlICkgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIGV2ZW50LmJ1dHRvbiAmIDEgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKCBldmVudC5idXR0b24gJiAyICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIGlmICggZXZlbnQuYnV0dG9uICYgNCApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG4gICAgcmV0dXJuIDI7XG4gIH1cblxuICByZXR1cm4gMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcblxuZnVuY3Rpb24gXyAoIHNlbGVjdG9yLCBjb250ZXh0ICkge1xuICByZXR1cm4gbmV3IERPTVdyYXBwZXIoIHNlbGVjdG9yLCBjb250ZXh0ICk7XG59XG5cbl8uZm4gPSBfLnByb3RvdHlwZSA9IERPTVdyYXBwZXIucHJvdG90eXBlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuXy5mbi5jb25zdHJ1Y3RvciA9IF87XG5cbm1vZHVsZS5leHBvcnRzID0gXztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi9ET01XcmFwcGVyJyApO1xudmFyIHR5cGUgICAgICAgPSByZXF1aXJlKCAnLi90eXBlJyApO1xudmFyIGtleXMgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5mdW5jdGlvbiBhY2Nlc3MgKCBvYmosIGtleSwgdmFsLCBmbiwgX25vQ2hlY2sgKSB7XG4gIHZhciBjaGFpbmFibGUgPSBfbm9DaGVjayB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbiAgdmFyIGJ1bGsgPSBrZXkgPT09IG51bGwgfHwga2V5ID09PSAndW5kZWZpbmVkJztcbiAgdmFyIGxlbiA9IG9iai5sZW5ndGg7XG4gIHZhciByYXcgPSBmYWxzZTtcbiAgdmFyIGU7XG4gIHZhciBrO1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgaWYgKCAhIF9ub0NoZWNrICYmIHR5cGUoIGtleSApID09PSAnb2JqZWN0JyApIHtcbiAgICBmb3IgKCBpID0gMCwgayA9IGtleXMoIGtleSApLCBsID0gay5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICBhY2Nlc3MoIG9iaiwga1sgaSBdLCBrZXlbIGtbIGkgXSBdLCBmbiwgdHJ1ZSApO1xuICAgIH1cblxuICAgIGNoYWluYWJsZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggdHlwZW9mIHZhbCAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJhdyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCBidWxrICkge1xuICAgICAgaWYgKCByYXcgKSB7XG4gICAgICAgIGZuLmNhbGwoIG9iaiwgdmFsICk7XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1bGsgPSBmbjtcblxuICAgICAgICBmbiA9IGZ1bmN0aW9uICggZSwga2V5LCB2YWwgKSB7XG4gICAgICAgICAgcmV0dXJuIGJ1bGsuY2FsbCggbmV3IERPTVdyYXBwZXIoIGUgKSwgdmFsICk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCBmbiApIHtcbiAgICAgIGZvciAoIGkgPSAwOyBpIDwgbGVuOyArK2kgKSB7XG4gICAgICAgIGUgPSBvYmpbIGkgXTtcblxuICAgICAgICBpZiAoIHJhdyApIHtcbiAgICAgICAgICBmbiggZSwga2V5LCB2YWwsIHRydWUgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmbiggZSwga2V5LCB2YWwuY2FsbCggZSwgaSwgZm4oIGUsIGtleSApICksIHRydWUgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNoYWluYWJsZSA9IHRydWU7XG4gIH1cblxuICBpZiAoIGNoYWluYWJsZSApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgaWYgKCBidWxrICkge1xuICAgIHJldHVybiBmbi5jYWxsKCBvYmogKTtcbiAgfVxuXG4gIGlmICggbGVuICkge1xuICAgIHJldHVybiBmbiggb2JqWyAwIF0sIGtleSApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWNjZXNzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoZWFkZXJzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGltZW91dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGhvZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogQSByZXF1ZXN0IGhlYWRlcnMuXG4gICAqL1xuICBoZWFkZXJzOiB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnXG4gIH0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBmb3IgY2FuY2VsIGEgcmVxdWVzdC5cbiAgICovXG4gIHRpbWVvdXQ6IDEwMDAgKiA2MCxcblxuICAvKipcbiAgICogQSByZXF1ZXN0IG1ldGhvZDogJ0dFVCcsICdQT1NUJyAob3RoZXJzIGFyZSBpZ25vcmVkLCBpbnN0ZWFkLCAnR0VUJyB3aWxsIGJlIHVzZWQpLlxuICAgKi9cbiAgbWV0aG9kOiAnR0VUJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKCB0eXBlb2YgcXMgPT09ICd1bmRlZmluZWQnICkge1xuICB2YXIgcXM7XG5cbiAgdHJ5IHtcbiAgICBxcyA9IHJlcXVpcmUoICdxcycgKTtcbiAgfSBjYXRjaCAoIGVycm9yICkge31cbn1cblxudmFyIF9vcHRpb25zID0gcmVxdWlyZSggJy4vYWpheC1vcHRpb25zJyApO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSggJy4vZGVmYXVsdHMnICk7XG52YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcm9zcy1icm93c2VyIFhNTEh0dHBSZXF1ZXN0OiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjU1NzI2OFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSFRUUFJlcXVlc3QgKCkge1xuICB2YXIgSFRUUEZhY3RvcmllczsgdmFyIGk7XG5cbiAgSFRUUEZhY3RvcmllcyA9IFtcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMy5YTUxIVFRQJyApO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNc3htbDIuWE1MSFRUUC42LjAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMi5YTUxIVFRQLjMuMCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwyLlhNTEhUVFAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01pY3Jvc29mdC5YTUxIVFRQJyApO1xuICAgIH1cbiAgXTtcblxuICBmb3IgKCBpID0gMDsgaSA8IEhUVFBGYWN0b3JpZXMubGVuZ3RoOyArK2kgKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoIGNyZWF0ZUhUVFBSZXF1ZXN0ID0gSFRUUEZhY3Rvcmllc1sgaSBdICkoKTtcbiAgICB9IGNhdGNoICggZXggKSB7fVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoICdjYW5ub3QgY3JlYXRlIFhNTEh0dHBSZXF1ZXN0IG9iamVjdCcgKTtcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLmFqYXhcbiAqIEBwYXJhbSAge3N0cmluZ3xvYmplY3R9IHBhdGggICAgICAgICAgICAgIEEgVVJMIG9yIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICBbb3B0aW9uc10gICAgICAgICBBbiBvcHRpb25zLlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgW29wdGlvbnMucGF0aF0gICAgQSBVUkwuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICBbb3B0aW9ucy5tZXRob2RdICBBIHJlcXVlc3QgbWV0aG9kLiBJZiBubyBwcmVzZW50IEdFVCBvciBQT1NUIHdpbGwgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQuXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICAgICBbb3B0aW9ucy5hc3luY10gICBEZWZhdWx0IHRvIGB0cnVlYCB3aGVuIG9wdGlvbnMgc3BlY2lmaWVkLCBvciBgZmFsc2VgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG5vIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICBbb3B0aW9ucy5zdWNjZXNzXSBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgc2VydmVyIHJlc3BvbmQgd2l0aCAyeHggc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLlxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgW29wdGlvbnMuZXJyb3JdICAgV2lsbCBiZSBjYWxsZWQgd2hlbiBhIHNlcnZlciByZXNwb25kIHdpdGggb3RoZXIgc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlIG9yIGFuIGVycm9yIG9jY3VycyB3aGlsZSBwYXJzaW5nIHJlc3BvbnNlLlxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgICAgICAgICAgUmV0dXJucyBhIHJlc3BvbnNlIGRhdGEgaWYgYSByZXF1ZXN0IHdhcyBzeW5jaHJvbm91c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcndpc2UgYG51bGxgLlxuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0PC9jYXB0aW9uPlxuICogdmFyIGRhdGEgPSBhamF4KCcuL2RhdGEuanNvbicpO1xuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0LCB3aXRoIGNhbGxiYWNrczwvY2FwdGlvbj5cbiAqIHZhciBkYXRhID0gYWpheCgnLi9kYXRhLmpzb24nLCB7XG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGFzeW5jOiAgIGZhbHNlXG4gKiB9KTtcbiAqXG4gKiBmdW5jdGlvbiBzdWNjZXNzKHNhbWVEYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKHNhbWVEYXRhKTtcbiAqIH1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPkFzeW5jaHJvbm91cyBQT1NUIHJlcXVlc3Q8L2NhcHRpb24+XG4gKiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gKiAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSB8fCB0aGlzLnN0YXR1cyArICc6ICcgKyB0aGlzLnN0YXR1c1RleHQpO1xuICogfVxuICpcbiAqIHZhciBoZWFkZXJzID0ge1xuICogICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gKiB9O1xuICpcbiAqIHZhciBkYXRhID0ge1xuICogICB1c2VybmFtZTogZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnVzZXJuYW1lLnZhbHVlLFxuICogICBzZXg6ICAgICAgZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnNleC52YWx1ZVxuICogfVxuICpcbiAqIGFqYXgoJy9hcGkvc2lnbnVwLz9zdGVwPTAnLCB7XG4gKiAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGVycm9yOiAgIGVycm9yLFxuICogICBkYXRhOiAgICBkYXRhXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gYWpheCAoIHBhdGgsIG9wdGlvbnMgKSB7XG4gIHZhciB0aW1lb3V0SWQgPSBudWxsO1xuICB2YXIgZGF0YSA9IG51bGw7XG4gIHZhciB4aHIgPSBjcmVhdGVIVFRQUmVxdWVzdCgpO1xuICB2YXIgcmVxQ29udGVudFR5cGU7XG4gIHZhciBtZXRob2Q7XG4gIHZhciBhc3luYztcbiAgdmFyIG5hbWU7XG5cbiAgLy8gXy5hamF4KCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIGlmICggdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnICkge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0cyggX29wdGlvbnMsIHBhdGggKTtcbiAgICBhc3luYyA9ICEgKCAnYXN5bmMnIGluIG9wdGlvbnMgKSB8fCBvcHRpb25zLmFzeW5jO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGg7XG5cbiAgLy8gXy5hamF4KCBwYXRoICk7XG4gIC8vIGFzeW5jID0gZmFsc2VcbiAgfSBlbHNlIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMgPT09IG51bGwgKSB7XG4gICAgb3B0aW9ucyA9IF9vcHRpb25zO1xuICAgIGFzeW5jID0gZmFsc2U7XG5cbiAgLy8gXy5hamF4KCBwYXRoLCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzKCBfb3B0aW9ucywgb3B0aW9ucyApO1xuICAgIGFzeW5jID0gISAoICdhc3luYycgaW4gb3B0aW9ucyApIHx8IG9wdGlvbnMuYXN5bmM7XG4gIH1cblxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXNDb250ZW50VHlwZTtcbiAgICB2YXIgc3RhdHVzO1xuICAgIHZhciBvYmplY3Q7XG4gICAgdmFyIGVycm9yO1xuXG4gICAgaWYgKCB0aGlzLnJlYWR5U3RhdGUgIT09IDQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3RhdHVzID0gdGhpcy5zdGF0dXMgPT09IDEyMjMgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZXJuYXJ5XG4gICAgICA/IDIwNFxuICAgICAgOiB0aGlzLnN0YXR1cztcblxuICAgIHJlc0NvbnRlbnRUeXBlID0gdGhpcy5nZXRSZXNwb25zZUhlYWRlciggJ2NvbnRlbnQtdHlwZScgKTtcblxuICAgIG9iamVjdCA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgcGF0aDogcGF0aFxuICAgIH07XG5cbiAgICBkYXRhID0gdGhpcy5yZXNwb25zZVRleHQ7XG5cbiAgICBpZiAoIHJlc0NvbnRlbnRUeXBlICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCAhIHJlc0NvbnRlbnRUeXBlLmluZGV4T2YoICdhcHBsaWNhdGlvbi9qc29uJyApICkge1xuICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgICAgIH0gZWxzZSBpZiAoICEgcmVzQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgKSApIHtcbiAgICAgICAgICBkYXRhID0gcXMucGFyc2UoIGRhdGEgKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIF9lcnJvciApIHtcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggISBlcnJvciAmJiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCApIHtcbiAgICAgIGlmICggdGltZW91dElkICE9PSBudWxsICkge1xuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJZCApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9wdGlvbnMuc3VjY2VzcyApIHtcbiAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmNhbGwoIHRoaXMsIGRhdGEsIG9iamVjdCApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIG9wdGlvbnMuZXJyb3IgKSB7XG4gICAgICBvcHRpb25zLmVycm9yLmNhbGwoIHRoaXMsIGRhdGEsIG9iamVjdCApO1xuICAgIH1cbiAgfTtcblxuICBtZXRob2QgPSBvcHRpb25zLm1ldGhvZDtcblxuICBpZiAoIHR5cGVvZiBtZXRob2QgPT09ICd1bmRlZmluZWQnICkge1xuICAgIG1ldGhvZCA9ICdkYXRhJyBpbiBvcHRpb25zIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICAgICAgPyAnUE9TVCdcbiAgICAgIDogJ0dFVCc7XG4gIH1cblxuICB4aHIub3BlbiggbWV0aG9kLCBwYXRoLCBhc3luYyApO1xuXG4gIGlmICggb3B0aW9ucy5oZWFkZXJzICkge1xuICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucy5oZWFkZXJzICkge1xuICAgICAgaWYgKCAhIGhhc093blByb3BlcnR5LmNhbGwoIG9wdGlvbnMuaGVhZGVycywgbmFtZSApICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnICkge1xuICAgICAgICByZXFDb250ZW50VHlwZSA9IG9wdGlvbnMuaGVhZGVyc1sgbmFtZSBdO1xuICAgICAgfVxuXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggbmFtZSwgb3B0aW9ucy5oZWFkZXJzWyBuYW1lIF0gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGFzeW5jICYmIHR5cGVvZiBvcHRpb25zLnRpbWVvdXQgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMudGltZW91dCAhPT0gbnVsbCApIHtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICB4aHIuYWJvcnQoKTtcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQgKTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHJlcUNvbnRlbnRUeXBlICE9PSAndW5kZWZpbmVkJyAmJiByZXFDb250ZW50VHlwZSAhPT0gbnVsbCAmJiAnZGF0YScgaW4gb3B0aW9ucyApIHtcbiAgICBpZiAoICEgcmVxQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL2pzb24nICkgKSB7XG4gICAgICB4aHIuc2VuZCggSlNPTi5zdHJpbmdpZnkoIG9wdGlvbnMuZGF0YSApICk7XG4gICAgfSBlbHNlIGlmICggISByZXFDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyApICkge1xuICAgICAgeGhyLnNlbmQoIHFzLnN0cmluZ2lmeSggb3B0aW9ucy5kYXRhICkgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLnNlbmQoIG9wdGlvbnMuZGF0YSApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWFzc2lnbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1hc3NpZ24nICkoIHJlcXVpcmUoICcuL2tleXMnICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlQXNzaWduICggb2JqLCBzcmMsIGsgKSB7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGsubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIG9ialsga1sgaSBdIF0gPSBzcmNbIGtbIGkgXSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUNsb25lQXJyYXkgKCBpdGVyYWJsZSApIHtcbiAgdmFyIGkgPSBpdGVyYWJsZS5sZW5ndGg7XG4gIHZhciBjbG9uZSA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICBpZiAoIGlzc2V0KCBpLCBpdGVyYWJsZSApICkge1xuICAgICAgY2xvbmVbIGkgXSA9IGl0ZXJhYmxlWyBpIF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNsb25lO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHRhcmdldCwgc291cmNlICkge1xuICBmb3IgKCB2YXIgaSA9IHNvdXJjZS5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICB0YXJnZXRbIGkgXSA9IHNvdXJjZVsgaSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbnZhciBkZWZpbmVHZXR0ZXIgPSBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG52YXIgZGVmaW5lU2V0dGVyID0gT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZVNldHRlcl9fO1xuXG5mdW5jdGlvbiBiYXNlRGVmaW5lUHJvcGVydHkgKCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApIHtcbiAgdmFyIGhhc0dldHRlciA9IGlzc2V0KCAnZ2V0JywgZGVzY3JpcHRvciApO1xuICB2YXIgaGFzU2V0dGVyID0gaXNzZXQoICdzZXQnLCBkZXNjcmlwdG9yICk7XG4gIHZhciBnZXQ7XG4gIHZhciBzZXQ7XG5cbiAgaWYgKCBoYXNHZXR0ZXIgfHwgaGFzU2V0dGVyICkge1xuICAgIGlmICggaGFzR2V0dGVyICYmIHR5cGVvZiggZ2V0ID0gZGVzY3JpcHRvci5nZXQgKSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ0dldHRlciBtdXN0IGJlIGEgZnVuY3Rpb246ICcgKyBnZXQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGhhc1NldHRlciAmJiB0eXBlb2YoIHNldCA9IGRlc2NyaXB0b3Iuc2V0ICkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uOiAnICsgc2V0ICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggJ3dyaXRhYmxlJywgZGVzY3JpcHRvciApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnSW52YWxpZCBwcm9wZXJ0eSBkZXNjcmlwdG9yLiBDYW5ub3QgYm90aCBzcGVjaWZ5IGFjY2Vzc29ycyBhbmQgYSB2YWx1ZSBvciB3cml0YWJsZSBhdHRyaWJ1dGUnICk7XG4gICAgfVxuXG4gICAgaWYgKCBkZWZpbmVHZXR0ZXIgKSB7XG4gICAgICBpZiAoIGhhc0dldHRlciApIHtcbiAgICAgICAgZGVmaW5lR2V0dGVyLmNhbGwoIG9iamVjdCwga2V5LCBnZXQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBoYXNTZXR0ZXIgKSB7XG4gICAgICAgIGRlZmluZVNldHRlci5jYWxsKCBvYmplY3QsIGtleSwgc2V0ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKCAnQ2Fubm90IGRlZmluZSBhIGdldHRlciBvciBzZXR0ZXInICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc3NldCggJ3ZhbHVlJywgZGVzY3JpcHRvciApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICB9IGVsc2UgaWYgKCAhIGlzc2V0KCBrZXksIG9iamVjdCApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSB2b2lkIDA7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VEZWZpbmVQcm9wZXJ0eTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRXhlYyAoIHJlZ2V4cCwgc3RyaW5nICkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciB2YWx1ZTtcblxuICByZWdleHAubGFzdEluZGV4ID0gMDtcblxuICB3aGlsZSAoICggdmFsdWUgPSByZWdleHAuZXhlYyggc3RyaW5nICkgKSApIHtcbiAgICByZXN1bHQucHVzaCggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEl0ZXJhdGVlID0gcmVxdWlyZSggJy4uL2NhbGwtaXRlcmF0ZWUnICk7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VGb3JFYWNoICggYXJyLCBmbiwgY3R4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciBpO1xuICB2YXIgajtcblxuICBmb3IgKCBpID0gLTEsIGogPSBhcnIubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBpZHggPSBqO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZHggPSArK2k7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggaWR4LCBhcnIgKSAmJiBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIGFyclsgaWR4IF0sIGlkeCwgYXJyICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFycjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRm9ySW4gKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCwga2V5cyApIHtcbiAgdmFyIGtleTtcbiAgdmFyIGk7XG4gIHZhciBqO1xuXG4gIGZvciAoIGkgPSAtMSwgaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBrZXkgPSBrZXlzWyBqIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IGtleXNbICsraSBdO1xuICAgIH1cblxuICAgIGlmICggY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCBvYmpbIGtleSBdLCBrZXksIG9iaiApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUdldCAoIG9iaiwgcGF0aCwgb2ZmICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGggLSBvZmY7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlSGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGg7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB2YXIgYmFzZVRvSW5kZXggPSByZXF1aXJlKCAnLi9iYXNlLXRvLWluZGV4JyApO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIGJhc2VJbmRleE9mXG4gKiBAcGFyYW0gIHtvYmplY3R9ICBhcnJheVxuICogQHBhcmFtICB7YW55fSAgICAgdmFsdWVcbiAqIEBwYXJhbSAge251bWJlcj99IGZyb21JbmRleFxuICogQHBhcmFtICB7Ym9vbGVhbn0gZnJvbVJpZ2h0XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUluZGV4T2YgKCBhcnJheSwgdmFsdWUsIGZyb21JbmRleCwgZnJvbVJpZ2h0ICkge1xuICAvLyBpZiAoIHR5cGVvZiBmcm9tSW5kZXggPT09ICd1bmRlZmluZWQnICkge1xuICAvLyAgIGZyb21JbmRleCA9IGZyb21SaWdodFxuICAvLyAgICAgPyBhcnJheS5sZW5ndGggLSAxXG4gIC8vICAgICA6IDA7XG4gIC8vIH0gZWxzZSB7XG4gIC8vICAgZnJvbUluZGV4ID0gYmFzZVRvSW5kZXgoIGZyb21JbmRleCwgYXJyYXkubGVuZ3RoICk7XG4gIC8vIH1cblxuICBpZiAoIHZhbHVlID09PSB2YWx1ZSApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGVybmFyeVxuICAgIHJldHVybiBmcm9tUmlnaHRcbiAgICAgID8gQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoIGFycmF5LCB2YWx1ZSApXG4gICAgICA6IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoIGFycmF5LCB2YWx1ZSApO1xuICB9XG5cbiAgZm9yICggdmFyIGwgPSBhcnJheS5sZW5ndGggLSAxLCBpID0gbDsgaSA+PSAwOyAtLWkgKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRlcm5hcnlcbiAgICB2YXIgaW5kZXggPSBmcm9tUmlnaHRcbiAgICAgID8gaVxuICAgICAgOiBsIC0gaTtcblxuICAgIGlmICggYXJyYXlbIGluZGV4IF0gPT09IHZhbHVlIHx8IHZhbHVlICE9PSB2YWx1ZSAmJiBhcnJheVsgaW5kZXggXSAhPT0gYXJyYXlbIGluZGV4IF0gKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldCA9IHJlcXVpcmUoICcuL2Jhc2UtZ2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VJbnZva2UgKCBvYmplY3QsIHBhdGgsIGFyZ3MgKSB7XG4gIGlmICggb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggcGF0aC5sZW5ndGggPD0gMSApIHtcbiAgICAgIHJldHVybiBvYmplY3RbIHBhdGhbIDAgXSBdLmFwcGx5KCBvYmplY3QsIGFyZ3MgKTtcbiAgICB9XG5cbiAgICBpZiAoICggb2JqZWN0ID0gZ2V0KCBvYmplY3QsIHBhdGgsIDEgKSApICkge1xuICAgICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgcGF0aC5sZW5ndGggLSAxIF0gXS5hcHBseSggb2JqZWN0LCBhcmdzICk7XG4gICAgfVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydCAgICAgPSByZXF1aXJlKCAnLi4vc3VwcG9ydC9zdXBwb3J0LWtleXMnICk7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuL2Jhc2UtaW5kZXgtb2YnICk7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmlmICggc3VwcG9ydCA9PT0gJ2hhcy1hLWJ1ZycgKSB7XG4gIHZhciBfa2V5cyA9IFtcbiAgICAndG9TdHJpbmcnLFxuICAgICd0b0xvY2FsZVN0cmluZycsXG4gICAgJ3ZhbHVlT2YnLFxuICAgICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICAgJ2NvbnN0cnVjdG9yJ1xuICBdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VLZXlzICggb2JqZWN0ICkge1xuICB2YXIga2V5cyA9IFtdO1xuICB2YXIga2V5O1xuICB2YXIgaTtcblxuICBmb3IgKCBrZXkgaW4gb2JqZWN0ICkge1xuICAgIGlmICggaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0LCBrZXkgKSApIHtcbiAgICAgIGtleXMucHVzaCgga2V5ICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCBzdXBwb3J0ID09PSAnaGFzLWEtYnVnJyApIHtcbiAgICBmb3IgKCBpID0gX2tleXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoIGJhc2VJbmRleE9mKCBrZXlzLCBfa2V5c1sgaSBdICkgPCAwICYmIGhhc093blByb3BlcnR5LmNhbGwoIG9iamVjdCwgX2tleXNbIGkgXSApICkge1xuICAgICAgICBrZXlzLnB1c2goIF9rZXlzWyBpIF0gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZXQgPSByZXF1aXJlKCAnLi9iYXNlLWdldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlUHJvcGVydHkgKCBvYmplY3QsIHBhdGggKSB7XG4gIGlmICggb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggcGF0aC5sZW5ndGggPiAxICkge1xuICAgICAgcmV0dXJuIGdldCggb2JqZWN0LCBwYXRoLCAwICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgMCBdIF07XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVJhbmRvbSAoIGxvd2VyLCB1cHBlciApIHtcbiAgcmV0dXJuIGxvd2VyICsgTWF0aC5yYW5kb20oKSAqICggdXBwZXIgLSBsb3dlciApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHByb3BzID0gcmVxdWlyZSggJy4uL3Byb3BzJyApO1xuXG5pZiAoIHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQtZ2V0LWF0dHJpYnV0ZScgKSApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfcmVtb3ZlQXR0ciAoIGVsZW1lbnQsIGtleSApIHtcbiAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgga2V5ICk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9yZW1vdmVBdHRyICggZWxlbWVudCwga2V5ICkge1xuICAgIGRlbGV0ZSBlbGVtZW50WyBwcm9wc1sga2V5IF0gfHwga2V5IF07XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlU2V0ICggb2JqLCBwYXRoLCB2YWwgKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGwgPSBwYXRoLmxlbmd0aDtcbiAgdmFyIGtleTtcblxuICBmb3IgKCA7IGkgPCBsOyArK2kgKSB7XG4gICAga2V5ID0gcGF0aFsgaSBdO1xuXG4gICAgaWYgKCBpID09PSBsIC0gMSApIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF0gPSB2YWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG4gICAgfSBlbHNlIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdID0ge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVZhbHVlcyAoIG9iamVjdCwga2V5cyApIHtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICB2YWx1ZXNbIGkgXSA9IG9iamVjdFsga2V5c1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL2ludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xudmFyIGRlZmF1bHRUbyA9IHJlcXVpcmUoICcuL2RlZmF1bHQtdG8nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVmb3JlICggbiwgZm4gKSB7XG4gIHZhciB2YWx1ZTtcblxuICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICB0aHJvdyBfQXJndW1lbnRFeGNlcHRpb24oIGZuLCAnYSBmdW5jdGlvbicgKTtcbiAgfVxuXG4gIG4gPSBkZWZhdWx0VG8oIG4sIDEgKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICggLS1uID49IDAgKSB7XG4gICAgICB2YWx1ZSA9IGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbnZhciBwbGFjZWhvbGRlciAgICAgICAgPSByZXF1aXJlKCAnLi9wbGFjZWhvbGRlcicgKTtcbnZhciBjb25zdGFudHMgICAgICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICk7XG52YXIgaW5kZXhPZiAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaW5kZXgtb2YnICk7XG5cbi8vIEZ1bmN0aW9uOjpiaW5kKCkgcG9seWZpbGwuXG5cbnZhciBfYmluZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIHx8IGZ1bmN0aW9uIGJpbmQgKCBjICkge1xuICB2YXIgZiA9IHRoaXM7XG4gIHZhciBhO1xuXG4gIGlmICggYXJndW1lbnRzLmxlbmd0aCA8PSAyICkge1xuICAgIHJldHVybiBmdW5jdGlvbiBib3VuZCAoKSB7XG4gICAgICByZXR1cm4gZi5hcHBseSggYywgYXJndW1lbnRzICk7XG4gICAgfTtcbiAgfVxuXG4gIGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kICgpIHtcbiAgICByZXR1cm4gZi5hcHBseSggYywgYS5jb25jYXQoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApICk7XG4gIH07XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBwIFRoZSBwYXJ0aWFsIGFyZ3VtZW50cy5cbiAqIEBwYXJhbSB7QXJyYXl9IGEgVGhlIGFyZ3VtZW50cy5cbiAqIEByZXR1cm5zIHtBcnJheX0gQSBwcm9jZXNzZWQgYXJndW1lbnRzLlxuICovXG5mdW5jdGlvbiBwcm9jZXNzICggcCwgYSApIHtcbiAgdmFyIHIgPSBbXTtcbiAgdmFyIGogPSAtMTtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gcC5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgaWYgKCBwWyBpIF0gPT09IHBsYWNlaG9sZGVyIHx8IHBbIGkgXSA9PT0gY29uc3RhbnRzLlBMQUNFSE9MREVSICkge1xuICAgICAgci5wdXNoKCBhWyArK2ogXSApO1xuICAgIH0gZWxzZSB7XG4gICAgICByLnB1c2goIHBbIGkgXSApO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoIGwgPSBhLmxlbmd0aDsgaiA8IGw7ICsraiApIHtcbiAgICByLnB1c2goIGFbIGkgXSApO1xuICB9XG5cbiAgcmV0dXJuIHI7XG59XG5cbi8qKlxuICogQHBhcmFtICB7ZnVuY3Rpb259IGYgVGhlIHRhcmdldCBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBib3VuZC5cbiAqIEBwYXJhbSAgeyp9ICAgICAgICBjIFRoZSBuZXcgY29udGV4dCBmb3IgdGhlIHRhcmdldCBmdW5jdGlvbi5cbiAqIEBwYXJhbSAgey4uLip9ICAgICBwIFRoZSBwYXJ0aWFsIGFyZ3VtZW50cywgbWF5IGNvbnRhaW4gXy5wbGFjZWhvbGRlci5cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICogQGV4YW1wbGVcbiAqIHZhciBfICAgID0gcmVxdWlyZSggJ3BlYWtvL3BsYWNlaG9sZGVyJyApO1xuICogdmFyIGJpbmQgPSByZXF1aXJlKCAncGVha28vYmluZCcgKTtcblxuICogZnVuY3Rpb24gd2VpcmRGdW5jdGlvbiAoIHgsIHkgKSB7XG4gKiAgIHJldHVybiB0aGlzWyB4IF0gKyB0aGlzWyB5IF07XG4gKiB9XG4gKlxuICogdmFyIGNvbnRleHQgPSB7XG4gKiAgIHg6IDQyLFxuICogICB5OiAxXG4gKiB9O1xuICpcbiAqIHZhciBib3VuZEZ1bmN0aW9uID0gYmluZCggd2VpcmRGdW5jdGlvbiwgY29udGV4dCwgXywgJ3knICk7XG4gKlxuICogYm91bmRGdW5jdGlvbiggJ3gnICk7IC8vIC0+IDQzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZCAoIGYsIGMgKSB7XG4gIHZhciBwO1xuXG4gIGlmICggdHlwZW9mIGYgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgdGhyb3cgX0FyZ3VtZW50RXhjZXB0aW9uKCBmLCAnYSBmdW5jdGlvbicgKTtcbiAgfVxuXG4gIC8vIG5vIHBhcnRpYWwgYXJndW1lbnRzIHdlcmUgcHJvdmlkZWRcblxuICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPD0gMiApIHtcbiAgICByZXR1cm4gX2JpbmQuY2FsbCggZiwgYyApO1xuICB9XG5cbiAgcCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDIgKTtcblxuICAvLyBubyBwbGFjZWhvbGRlcnMgaW4gdGhlIHBhcnRpYWwgYXJndW1lbnRzXG5cbiAgaWYgKCBpbmRleE9mKCBwLCBwbGFjZWhvbGRlciApIDwgMCAmJiBpbmRleE9mKCBwLCBjb25zdGFudHMuUExBQ0VIT0xERVIgKSA8IDAgKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsLmFwcGx5KCBfYmluZCwgYXJndW1lbnRzICk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gYm91bmQgKCkge1xuICAgIHJldHVybiBmLmFwcGx5KCBjLCBwcm9jZXNzKCBwLCBhcmd1bWVudHMgKSApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYWxsSXRlcmF0ZWUgKCBmbiwgY3R4LCB2YWwsIGtleSwgb2JqICkge1xuICBpZiAoIHR5cGVvZiBjdHggPT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBmbiggdmFsLCBrZXksIG9iaiApO1xuICB9XG5cbiAgcmV0dXJuIGZuLmNhbGwoIGN0eCwgdmFsLCBrZXksIG9iaiApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHVwcGVyRmlyc3QgPSByZXF1aXJlKCAnLi91cHBlci1maXJzdCcgKTtcblxuLy8gY2FtZWxpemUoICdiYWNrZ3JvdW5kLXJlcGVhdC14JyApOyAvLyAtPiAnYmFja2dyb3VuZFJlcGVhdFgnXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemUgKCBzdHJpbmcgKSB7XG4gIHZhciB3b3JkcyA9IHN0cmluZy5tYXRjaCggL1swLTlhLXpdKy9naSApO1xuICB2YXIgcmVzdWx0O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgaWYgKCAhIHdvcmRzICkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJlc3VsdCA9IHdvcmRzWyAwIF0udG9Mb3dlckNhc2UoKTtcblxuICBmb3IgKCBpID0gMSwgbCA9IHdvcmRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICByZXN1bHQgKz0gdXBwZXJGaXJzdCggd29yZHNbIGkgXSApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdW5lc2NhcGUgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC91bmVzY2FwZScgKTtcbnZhciBfdHlwZSAgICAgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC90eXBlJyApO1xuXG52YXIgYmFzZUV4ZWMgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWV4ZWMnICk7XG5cbnZhciBpc0tleSAgICAgPSByZXF1aXJlKCAnLi9pcy1rZXknICk7XG52YXIgdG9LZXkgICAgID0gcmVxdWlyZSggJy4vdG8ta2V5JyApO1xuXG52YXIgclByb3BlcnR5ID0gLyhefFxcLilcXHMqKFtfYS16XVxcdyopXFxzKnxcXFtcXHMqKCg/Oi0pPyg/OlxcZCt8XFxkKlxcLlxcZCspfChcInwnKSgoW15cXFxcXVxcXFwoXFxcXFxcXFwpKnxbXlxcNF0pKilcXDQpXFxzKlxcXS9naTtcblxuZnVuY3Rpb24gc3RyaW5nVG9QYXRoICggc3RyICkge1xuICB2YXIgcGF0aCA9IGJhc2VFeGVjKCByUHJvcGVydHksIHN0ciApO1xuICB2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTtcbiAgdmFyIHZhbDtcblxuICBmb3IgKCA7IGkgPj0gMDsgLS1pICkge1xuICAgIHZhbCA9IHBhdGhbIGkgXTtcblxuICAgIC8vIC5uYW1lXG4gICAgaWYgKCB2YWxbIDIgXSApIHtcbiAgICAgIHBhdGhbIGkgXSA9IHZhbFsgMiBdO1xuICAgIC8vIFsgXCJcIiBdIHx8IFsgJycgXVxuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWxbIDUgXSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICBwYXRoWyBpIF0gPSBfdW5lc2NhcGUoIHZhbFsgNSBdICk7XG4gICAgLy8gWyAwIF1cbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aFsgaSBdID0gdmFsWyAzIF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhdGg7XG59XG5cbmZ1bmN0aW9uIGNhc3RQYXRoICggdmFsICkge1xuICB2YXIgcGF0aDtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggaXNLZXkoIHZhbCApICkge1xuICAgIHJldHVybiBbIHRvS2V5KCB2YWwgKSBdO1xuICB9XG5cbiAgaWYgKCBfdHlwZSggdmFsICkgPT09ICdhcnJheScgKSB7XG4gICAgcGF0aCA9IEFycmF5KCBsID0gdmFsLmxlbmd0aCApO1xuXG4gICAgZm9yICggaSA9IGwgLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIHBhdGhbIGkgXSA9IHRvS2V5KCB2YWxbIGkgXSApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gc3RyaW5nVG9QYXRoKCAnJyArIHZhbCApO1xuICB9XG5cbiAgcmV0dXJuIHBhdGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xhbXAgKCB2YWx1ZSwgbG93ZXIsIHVwcGVyICkge1xuICBpZiAoIHZhbHVlID49IHVwcGVyICkge1xuICAgIHJldHVybiB1cHBlcjtcbiAgfVxuXG4gIGlmICggdmFsdWUgPD0gbG93ZXIgKSB7XG4gICAgcmV0dXJuIGxvd2VyO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSggJy4vZ2V0LXByb3RvdHlwZS1vZicgKTtcbnZhciBpc09iamVjdExpa2UgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xudmFyIHRvT2JqZWN0ICAgICAgID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSggJy4vY3JlYXRlJyApO1xudmFyIGVhY2ggICAgICAgICAgID0gcmVxdWlyZSggJy4vZWFjaCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9uZSAoIGRlZXAsIHRhcmdldCwgZ3VhcmQgKSB7XG4gIHZhciBjbG47XG5cbiAgaWYgKCB0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyB8fCBndWFyZCApIHtcbiAgICB0YXJnZXQgPSBkZWVwO1xuICAgIGRlZXAgPSB0cnVlO1xuICB9XG5cbiAgY2xuID0gY3JlYXRlKCBnZXRQcm90b3R5cGVPZiggdGFyZ2V0ID0gdG9PYmplY3QoIHRhcmdldCApICkgKTtcblxuICBlYWNoKCB0YXJnZXQsIGZ1bmN0aW9uICggdmFsdWUsIGtleSwgdGFyZ2V0ICkge1xuICAgIGlmICggdmFsdWUgPT09IHRhcmdldCApIHtcbiAgICAgIHRoaXNbIGtleSBdID0gdGhpcztcbiAgICB9IGVsc2UgaWYgKCBkZWVwICYmIGlzT2JqZWN0TGlrZSggdmFsdWUgKSApIHtcbiAgICAgIHRoaXNbIGtleSBdID0gY2xvbmUoIGRlZXAsIHZhbHVlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXNbIGtleSBdID0gdmFsdWU7XG4gICAgfVxuICB9LCBjbG4gKTtcblxuICByZXR1cm4gY2xuO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb3Nlc3QgPSByZXF1aXJlKCAnLi9jbG9zZXN0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsb3Nlc3ROb2RlICggZSwgYyApIHtcbiAgaWYgKCB0eXBlb2YgYyA9PT0gJ3N0cmluZycgKSB7XG4gICAgcmV0dXJuIGNsb3Nlc3QuY2FsbCggZSwgYyApO1xuICB9XG5cbiAgZG8ge1xuICAgIGlmICggZSA9PT0gYyApIHtcbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgfSB3aGlsZSAoICggZSA9IGUucGFyZW50Tm9kZSApICk7XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWF0Y2hlcyA9IHJlcXVpcmUoICcuL21hdGNoZXMtc2VsZWN0b3InICk7XG5cbnZhciBjbG9zZXN0O1xuXG5pZiAoIHR5cGVvZiBFbGVtZW50ID09PSAndW5kZWZpbmVkJyB8fCAhICggY2xvc2VzdCA9IEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgKSApIHtcbiAgY2xvc2VzdCA9IGZ1bmN0aW9uIGNsb3Nlc3QgKCBzZWxlY3RvciApIHtcbiAgICB2YXIgZWxlbWVudCA9IHRoaXM7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoIG1hdGNoZXMuY2FsbCggZWxlbWVudCwgc2VsZWN0b3IgKSApIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoICggZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudCApICk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9zZXN0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvdW5kICggZnVuY3Rpb25zICkge1xuICByZXR1cm4gZnVuY3Rpb24gY29tcG91bmRlZCAoKSB7XG4gICAgdmFyIHZhbHVlO1xuICAgIHZhciBpO1xuICAgIHZhciBsO1xuXG4gICAgZm9yICggaSA9IDAsIGwgPSBmdW5jdGlvbnMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgdmFsdWUgPSBmdW5jdGlvbnNbIGkgXS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEVSUjoge1xuICAgIElOVkFMSURfQVJHUzogICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnRzJyxcbiAgICBGVU5DVElPTl9FWFBFQ1RFRDogICAgICdFeHBlY3RlZCBhIGZ1bmN0aW9uJyxcbiAgICBTVFJJTkdfRVhQRUNURUQ6ICAgICAgICdFeHBlY3RlZCBhIHN0cmluZycsXG4gICAgVU5ERUZJTkVEX09SX05VTEw6ICAgICAnQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0JyxcbiAgICBSRURVQ0VfT0ZfRU1QVFlfQVJSQVk6ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyxcbiAgICBOT19QQVRIOiAgICAgICAgICAgICAgICdObyBwYXRoIHdhcyBnaXZlbidcbiAgfSxcblxuICBNQVhfQVJSQVlfTEVOR1RIOiA0Mjk0OTY3Mjk1LFxuICBNQVhfU0FGRV9JTlQ6ICAgICA5MDA3MTk5MjU0NzQwOTkxLFxuICBNSU5fU0FGRV9JTlQ6ICAgIC05MDA3MTk5MjU0NzQwOTkxLFxuXG4gIERFRVA6ICAgICAgICAgMSxcbiAgREVFUF9LRUVQX0ZOOiAyLFxuXG4gIFBMQUNFSE9MREVSOiB7fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGNyZWF0ZTtcblxudmFyIGRlZmluZVByb3BlcnRpZXMgPSByZXF1aXJlKCAnLi9kZWZpbmUtcHJvcGVydGllcycgKTtcblxudmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZSggJy4vc2V0LXByb3RvdHlwZS1vZicgKTtcblxudmFyIGlzUHJpbWl0aXZlID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xuXG5mdW5jdGlvbiBDICgpIHt9XG5cbmZ1bmN0aW9uIGNyZWF0ZSAoIHByb3RvdHlwZSwgZGVzY3JpcHRvcnMgKSB7XG4gIHZhciBvYmplY3Q7XG5cbiAgaWYgKCBwcm90b3R5cGUgIT09IG51bGwgJiYgaXNQcmltaXRpdmUoIHByb3RvdHlwZSApICkge1xuICAgIHRocm93IFR5cGVFcnJvciggJ09iamVjdCBwcm90b3R5cGUgbWF5IG9ubHkgYmUgYW4gT2JqZWN0IG9yIG51bGw6ICcgKyBwcm90b3R5cGUgKTtcbiAgfVxuXG4gIEMucHJvdG90eXBlID0gcHJvdG90eXBlO1xuXG4gIG9iamVjdCA9IG5ldyBDKCk7XG5cbiAgQy5wcm90b3R5cGUgPSBudWxsO1xuXG4gIGlmICggcHJvdG90eXBlID09PSBudWxsICkge1xuICAgIHNldFByb3RvdHlwZU9mKCBvYmplY3QsIG51bGwgKTtcbiAgfVxuXG4gIGlmICggYXJndW1lbnRzLmxlbmd0aCA+PSAyICkge1xuICAgIGRlZmluZVByb3BlcnRpZXMoIG9iamVjdCwgZGVzY3JpcHRvcnMgKTtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUFzc2lnbiA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtYXNzaWduJyApO1xudmFyIEVSUiAgICAgICAgPSByZXF1aXJlKCAnLi4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVBc3NpZ24gKCBrZXlzICkge1xuICByZXR1cm4gZnVuY3Rpb24gYXNzaWduICggb2JqICkge1xuICAgIHZhciBzcmM7XG4gICAgdmFyIGw7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IDEsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgc3JjID0gYXJndW1lbnRzWyBpIF07XG5cbiAgICAgIGlmICggc3JjICE9PSBudWxsICYmIHR5cGVvZiBzcmMgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICBiYXNlQXNzaWduKCBvYmosIHNyYywga2V5cyggc3JjICkgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VGb3JFYWNoICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWVhY2gnICk7XG52YXIgYmFzZUZvckluICAgID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItaW4nICk7XG52YXIgaXNBcnJheUxpa2UgID0gcmVxdWlyZSggJy4uL2lzLWFycmF5LWxpa2UnICk7XG52YXIgdG9PYmplY3QgICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcbnZhciBpdGVyYXRlZSAgICAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG52YXIga2V5cyAgICAgICAgID0gcmVxdWlyZSggJy4uL2tleXMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRWFjaCAoIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGVhY2ggKCBvYmosIGZuLCBjdHggKSB7XG5cbiAgICBvYmogPSB0b09iamVjdCggb2JqICk7XG5cbiAgICBmbiAgPSBpdGVyYXRlZSggZm4gKTtcblxuICAgIGlmICggaXNBcnJheUxpa2UoIG9iaiApICkge1xuICAgICAgcmV0dXJuIGJhc2VGb3JFYWNoKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCApO1xuICAgIH1cblxuICAgIHJldHVybiBiYXNlRm9ySW4oIG9iaiwgZm4sIGN0eCwgZnJvbVJpZ2h0LCBrZXlzKCBvYmogKSApO1xuXG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVzY2FwZSAoIHJlZ2V4cCwgbWFwICkge1xuICBmdW5jdGlvbiByZXBsYWNlciAoIGMgKSB7XG4gICAgcmV0dXJuIG1hcFsgYyBdO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGVzY2FwZSAoIHN0cmluZyApIHtcbiAgICBpZiAoIHN0cmluZyA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyaW5nID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gKCBzdHJpbmcgKz0gJycgKS5yZXBsYWNlKCByZWdleHAsIHJlcGxhY2VyICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEl0ZXJhdGVlID0gcmVxdWlyZSggJy4uL2NhbGwtaXRlcmF0ZWUnICk7XG52YXIgdG9PYmplY3QgICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcbnZhciBpdGVyYWJsZSAgICAgPSByZXF1aXJlKCAnLi4vaXRlcmFibGUnICk7XG52YXIgaXRlcmF0ZWUgICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xudmFyIGlzc2V0ICAgICAgICA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGaW5kICggcmV0dXJuSW5kZXgsIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZpbmQgKCBhcnIsIGZuLCBjdHggKSB7XG4gICAgdmFyIGogPSAoIGFyciA9IGl0ZXJhYmxlKCB0b09iamVjdCggYXJyICkgKSApLmxlbmd0aCAtIDE7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB2YXIgaWR4O1xuICAgIHZhciB2YWw7XG5cbiAgICBmbiA9IGl0ZXJhdGVlKCBmbiApO1xuXG4gICAgZm9yICggOyBqID49IDA7IC0taiApIHtcbiAgICAgIGlmICggZnJvbVJpZ2h0ICkge1xuICAgICAgICBpZHggPSBqO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWR4ID0gKytpO1xuICAgICAgfVxuXG4gICAgICB2YWwgPSBhcnJbIGlkeCBdO1xuXG4gICAgICBpZiAoIGlzc2V0KCBpZHgsIGFyciApICYmIGNhbGxJdGVyYXRlZSggZm4sIGN0eCwgdmFsLCBpZHgsIGFyciApICkge1xuICAgICAgICBpZiAoIHJldHVybkluZGV4ICkge1xuICAgICAgICAgIHJldHVybiBpZHg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggcmV0dXJuSW5kZXggKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUiA9IHJlcXVpcmUoICcuLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZpcnN0ICggbmFtZSApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggc3RyICkge1xuICAgIGlmICggc3RyID09PSBudWxsIHx8IHR5cGVvZiBzdHIgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCBzdHIgKz0gJycgKS5jaGFyQXQoIDAgKVsgbmFtZSBdKCkgKyBzdHIuc2xpY2UoIDEgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlRm9yRWFjaCA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWVhY2gnICk7XG52YXIgdG9PYmplY3QgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhdGVlICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xudmFyIGl0ZXJhYmxlICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhYmxlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZvckVhY2ggKCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb3JFYWNoICggYXJyLCBmbiwgY3R4ICkge1xuICAgIHJldHVybiBiYXNlRm9yRWFjaCggaXRlcmFibGUoIHRvT2JqZWN0KCBhcnIgKSApLCBpdGVyYXRlZSggZm4gKSwgY3R4LCBmcm9tUmlnaHQgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlRm9ySW4gPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1pbicgKTtcbnZhciB0b09iamVjdCAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhdGVlICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGb3JJbiAoIGtleXMsIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvckluICggb2JqLCBmbiwgY3R4ICkge1xuICAgIHJldHVybiBiYXNlRm9ySW4oIG9iaiA9IHRvT2JqZWN0KCBvYmogKSwgaXRlcmF0ZWUoIGZuICksIGN0eCwgZnJvbVJpZ2h0LCBrZXlzKCBvYmogKSApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBNdXN0IGJlICdXaWR0aCcgb3IgJ0hlaWdodCcgKGNhcGl0YWxpemVkKS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVHZXRFbGVtZW50RGltZW5zaW9uICggbmFtZSApIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7V2luZG93fE5vZGV9IGVcbiAgICovXG4gIHJldHVybiBmdW5jdGlvbiAoIGUgKSB7XG4gICAgdmFyIHY7XG4gICAgdmFyIGI7XG4gICAgdmFyIGQ7XG5cbiAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhIHdpbmRvd1xuXG4gICAgaWYgKCBlLndpbmRvdyA9PT0gZSApIHtcblxuICAgICAgLy8gaW5uZXJXaWR0aCBhbmQgaW5uZXJIZWlnaHQgaW5jbHVkZXMgYSBzY3JvbGxiYXIgd2lkdGgsIGJ1dCBpdCBpcyBub3RcbiAgICAgIC8vIHN1cHBvcnRlZCBieSBvbGRlciBicm93c2Vyc1xuXG4gICAgICB2ID0gTWF0aC5tYXgoIGVbICdpbm5lcicgKyBuYW1lIF0gfHwgMCwgZS5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbICdjbGllbnQnICsgbmFtZSBdICk7XG5cbiAgICAvLyBpZiB0aGUgZWxlbWVudHMgaXMgYSBkb2N1bWVudFxuXG4gICAgfSBlbHNlIGlmICggZS5ub2RlVHlwZSA9PT0gOSApIHtcblxuICAgICAgYiA9IGUuYm9keTtcbiAgICAgIGQgPSBlLmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgdiA9IE1hdGgubWF4KFxuICAgICAgICBiWyAnc2Nyb2xsJyArIG5hbWUgXSxcbiAgICAgICAgZFsgJ3Njcm9sbCcgKyBuYW1lIF0sXG4gICAgICAgIGJbICdvZmZzZXQnICsgbmFtZSBdLFxuICAgICAgICBkWyAnb2Zmc2V0JyArIG5hbWUgXSxcbiAgICAgICAgYlsgJ2NsaWVudCcgKyBuYW1lIF0sXG4gICAgICAgIGRbICdjbGllbnQnICsgbmFtZSBdICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdiA9IGVbICdjbGllbnQnICsgbmFtZSBdO1xuICAgIH1cblxuICAgIHJldHVybiB2O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1pbmRleC1vZicgKTtcblxudmFyIHRvT2JqZWN0ICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQG1ldGhvZCBjcmVhdGVJbmRleE9mXG4gKiBAcGFyYW0gIHtib29sZWFufSAgZnJvbVJpZ2h0XG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJbmRleE9mICggZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gaW5kZXhPZiAoIGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4ICkge1xuICAgIHJldHVybiBiYXNlSW5kZXhPZiggdG9PYmplY3QoIGFycmF5ICksIHZhbHVlLCBmcm9tSW5kZXgsIGZyb21SaWdodCApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4uL2Nhc3QtcGF0aCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQcm9wZXJ0eU9mICggYmFzZVByb3BlcnR5LCB1c2VBcmdzICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBvYmplY3QgKSB7XG4gICAgdmFyIGFyZ3M7XG5cbiAgICBpZiAoIHVzZUFyZ3MgKSB7XG4gICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoIHBhdGggKSB7XG4gICAgICBpZiAoICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGggKSB7XG4gICAgICAgIHJldHVybiBiYXNlUHJvcGVydHkoIG9iamVjdCwgcGF0aCwgYXJncyApO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi4vY2FzdC1wYXRoJyApO1xudmFyIG5vb3AgICAgID0gcmVxdWlyZSggJy4uL25vb3AnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUHJvcGVydHkgKCBiYXNlUHJvcGVydHksIHVzZUFyZ3MgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIHBhdGggKSB7XG4gICAgdmFyIGFyZ3M7XG5cbiAgICBpZiAoICEgKCBwYXRoID0gY2FzdFBhdGgoIHBhdGggKSApLmxlbmd0aCApIHtcbiAgICAgIHJldHVybiBub29wO1xuICAgIH1cblxuICAgIGlmICggdXNlQXJncyApIHtcbiAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICggb2JqZWN0ICkge1xuICAgICAgcmV0dXJuIGJhc2VQcm9wZXJ0eSggb2JqZWN0LCBwYXRoLCBhcmdzICk7XG4gICAgfTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfd29yZHMgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvd29yZHMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2NyZWF0ZVJlbW92ZVByb3AgKCBfcmVtb3ZlUHJvcCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgga2V5cyApIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICB2YXIgaTtcbiAgICB2YXIgajtcblxuICAgIGlmICggdHlwZW9mIGtleXMgPT09ICdzdHJpbmcnICApIHtcbiAgICAgIGtleXMgPSBfd29yZHMoIGtleXMgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggKCBlbGVtZW50ID0gdGhpc1sgaSBdICkubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKCBqID0ga2V5cy5sZW5ndGggLSAxOyBqID49IDA7IC0taiApIHtcbiAgICAgICAgX3JlbW92ZVByb3AoIGVsZW1lbnQsIGtleXNbIGogXSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUiA9IHJlcXVpcmUoICcuLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVRyaW0gKCByZWdleHAgKSB7XG4gIHJldHVybiBmdW5jdGlvbiB0cmltICggc3RyaW5nICkge1xuICAgIGlmICggc3RyaW5nID09PSBudWxsIHx8IHR5cGVvZiBzdHJpbmcgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCAnJyArIHN0cmluZyApLnJlcGxhY2UoIHJlZ2V4cCwgJycgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfQXJndW1lbnRFeGNlcHRpb24gPSByZXF1aXJlKCAnLi9pbnRlcm5hbC9Bcmd1bWVudEV4Y2VwdGlvbicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWJvdW5jZSAoIG1heFdhaXQsIGZuICkge1xuICB2YXIgdGltZW91dElkID0gbnVsbDtcblxuICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICB0aHJvdyBfQXJndW1lbnRFeGNlcHRpb24oIGZuLCAnYSBmdW5jdGlvbicgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCAoKSB7XG4gICAgaWYgKCB0aW1lb3V0SWQgIT09IG51bGwgKSB7XG4gICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJZCApO1xuICAgIH1cblxuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCApIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQuYXBwbHkoIG51bGwsIFsgZm4sIG1heFdhaXQgXS5jb25jYXQoIFtdLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICkgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCggZm4sIG1heFdhaXQgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwgKCkge1xuICAgIGlmICggdGltZW91dElkICE9PSBudWxsICkge1xuICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SWQgKTtcbiAgICAgIHRpbWVvdXRJZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkZWJvdW5jZWQ6IGRlYm91bmNlZCxcbiAgICBjYW5jZWw6ICAgIGNhbmNlbFxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZhdWx0VG8gKCB2YWx1ZSwgZGVmYXVsdFZhbHVlICkge1xuICBpZiAoIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IHZhbHVlICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBkZWZhdWx0VmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWl4aW4gPSByZXF1aXJlKCAnLi9taXhpbicgKTtcblxuZnVuY3Rpb24gZGVmYXVsdHMgKCBkZWZhdWx0cywgb2JqZWN0ICkge1xuICBpZiAoIG9iamVjdCApIHtcbiAgICByZXR1cm4gbWl4aW4oIHt9LCBkZWZhdWx0cywgb2JqZWN0ICk7XG4gIH1cblxuICByZXR1cm4gbWl4aW4oIHt9LCBkZWZhdWx0cyApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vc3VwcG9ydC9zdXBwb3J0LWRlZmluZS1wcm9wZXJ0eScgKTtcblxudmFyIGJhc2VEZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHknICk7XG5cbnZhciBpc1ByaW1pdGl2ZSAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1wcmltaXRpdmUnICk7XG52YXIgZWFjaCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZWFjaCcgKTtcblxudmFyIGRlZmluZVByb3BlcnRpZXM7XG5cbmlmICggc3VwcG9ydCAhPT0gJ2Z1bGwnICkge1xuICBkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyAoIG9iamVjdCwgZGVzY3JpcHRvcnMgKSB7XG4gICAgaWYgKCBzdXBwb3J0ICE9PSAnbm90LXN1cHBvcnRlZCcgKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIG9iamVjdCwgZGVzY3JpcHRvcnMgKTtcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cbiAgICB9XG5cbiAgICBpZiAoIGlzUHJpbWl0aXZlKCBvYmplY3QgKSApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ2RlZmluZVByb3BlcnRpZXMgY2FsbGVkIG9uIG5vbi1vYmplY3QnICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc1ByaW1pdGl2ZSggZGVzY3JpcHRvcnMgKSApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ1Byb3BlcnR5IGRlc2NyaXB0aW9uIG11c3QgYmUgYW4gb2JqZWN0OiAnICsgZGVzY3JpcHRvcnMgKTtcbiAgICB9XG5cbiAgICBlYWNoKCBkZXNjcmlwdG9ycywgZnVuY3Rpb24gKCBkZXNjcmlwdG9yLCBrZXkgKSB7XG4gICAgICBpZiAoIGlzUHJpbWl0aXZlKCBkZXNjcmlwdG9yICkgKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvciggJ1Byb3BlcnR5IGRlc2NyaXB0aW9uIG11c3QgYmUgYW4gb2JqZWN0OiAnICsgZGVzY3JpcHRvciApO1xuICAgICAgfVxuXG4gICAgICBiYXNlRGVmaW5lUHJvcGVydHkoIHRoaXMsIGtleSwgZGVzY3JpcHRvciApO1xuICAgIH0sIG9iamVjdCApO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn0gZWxzZSB7XG4gIGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0aWVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vc3VwcG9ydC9zdXBwb3J0LWRlZmluZS1wcm9wZXJ0eScgKTtcblxudmFyIGJhc2VEZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHknICk7XG5cbnZhciBpc1ByaW1pdGl2ZSAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1wcmltaXRpdmUnICk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eTtcblxuaWYgKCBzdXBwb3J0ICE9PSAnZnVsbCcgKSB7XG4gIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkgKCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApIHtcbiAgICBpZiAoIHN1cHBvcnQgIT09ICdub3Qtc3VwcG9ydGVkJyApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iamVjdCwga2V5LCBkZXNjcmlwdG9yICk7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG4gICAgfVxuXG4gICAgaWYgKCBpc1ByaW1pdGl2ZSggb2JqZWN0ICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdkZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdCcgKTtcbiAgICB9XG5cbiAgICBpZiAoIGlzUHJpbWl0aXZlKCBkZXNjcmlwdG9yICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogJyArIGRlc2NyaXB0b3IgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZURlZmluZVByb3BlcnR5KCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApO1xuICB9O1xufSBlbHNlIHtcbiAgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1lYWNoJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1lYWNoJyApKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1lc2NhcGUnICkoIC9bPD5cIicmXS9nLCB7XG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgXCInXCI6ICcmIzM5OycsXG4gICdcIic6ICcmIzM0OycsXG4gICcmJzogJyZhbXA7J1xufSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xvc2VzdE5vZGUgPSByZXF1aXJlKCAnLi9jbG9zZXN0LW5vZGUnICk7XG52YXIgRE9NV3JhcHBlciAgPSByZXF1aXJlKCAnLi9ET01XcmFwcGVyJyApO1xudmFyIEV2ZW50ICAgICAgID0gcmVxdWlyZSggJy4vRXZlbnQnICk7XG5cbnZhciBldmVudHMgPSB7XG4gIGl0ZW1zOiB7fSxcbiAgdHlwZXM6IFtdXG59O1xuXG52YXIgc3VwcG9ydCA9IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiAnYWRkRXZlbnRMaXN0ZW5lcicgaW4gc2VsZjtcblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLmV2ZW50Lm9uXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgZWxlbWVudFxuICogQHBhcmFtICB7c3RyaW5nfSAgIHR5cGVcbiAqIEBwYXJhbSAge3N0cmluZz99ICBzZWxlY3RvclxuICogQHBhcmFtICB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gKiBAcGFyYW0gIHtib29sZWFufSAgdXNlQ2FwdHVyZVxuICogQHBhcmFtICB7Ym9vbGVhbn0gIFtvbmNlXVxuICogQHJldHVybiB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiBfLmV2ZW50Lm9uKCBkb2N1bWVudCwgJ2NsaWNrJywgJy5wb3N0X19saWtlLWJ1dHRvbicsICggZXZlbnQgKSA9PiB7XG4gKiAgIGNvbnN0IGRhdGEgPSB7XG4gKiAgICAgaWQ6IF8oIHRoaXMgKS5wYXJlbnQoICcucG9zdCcgKS5kYXRhKCAnaWQnIClcbiAqICAgfVxuICpcbiAqICAgXy5hamF4KCAnL2xpa2UnLCB7IGRhdGEgfSApXG4gKiB9LCBmYWxzZSApXG4gKi9cbmV4cG9ydHMub24gPSBmdW5jdGlvbiBvbiAoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSwgb25jZSApIHtcbiAgdmFyIGl0ZW0gPSB7XG4gICAgdXNlQ2FwdHVyZTogdXNlQ2FwdHVyZSxcbiAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgZWxlbWVudDogZWxlbWVudCxcbiAgICBvbmNlOiBvbmNlXG4gIH07XG5cbiAgaWYgKCBzZWxlY3RvciApIHtcbiAgICBpdGVtLnNlbGVjdG9yID0gc2VsZWN0b3I7XG4gIH1cblxuICBpZiAoIHN1cHBvcnQgKSB7XG4gICAgaXRlbS53cmFwcGVyID0gZnVuY3Rpb24gd3JhcHBlciAoIGV2ZW50LCBfZWxlbWVudCApIHtcbiAgICAgIGlmICggc2VsZWN0b3IgJiYgISBfZWxlbWVudCAmJiAhICggX2VsZW1lbnQgPSBjbG9zZXN0Tm9kZSggZXZlbnQudGFyZ2V0LCBzZWxlY3RvciApICkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCBvbmNlICkge1xuICAgICAgICBleHBvcnRzLm9mZiggZWxlbWVudCwgdHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICk7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVyLmNhbGwoIF9lbGVtZW50IHx8IGVsZW1lbnQsIG5ldyBFdmVudCggZXZlbnQgKSApO1xuICAgIH07XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGl0ZW0ud3JhcHBlciwgdXNlQ2FwdHVyZSApO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbGlzdGVuZXIgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgaXRlbS53cmFwcGVyID0gZnVuY3Rpb24gd3JhcHBlciAoIGV2ZW50LCBfZWxlbWVudCApIHtcbiAgICAgIGlmICggc2VsZWN0b3IgJiYgISBfZWxlbWVudCAmJiAhICggX2VsZW1lbnQgPSBjbG9zZXN0Tm9kZSggZXZlbnQudGFyZ2V0LCBzZWxlY3RvciApICkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCB0eXBlID09PSAnRE9NQ29udGVudExvYWRlZCcgJiYgZWxlbWVudC5yZWFkeVN0YXRlICE9PSAnY29tcGxldGUnICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggb25jZSApIHtcbiAgICAgICAgZXhwb3J0cy5vZmYoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lci5jYWxsKCBfZWxlbWVudCB8fCBlbGVtZW50LCBuZXcgRXZlbnQoIGV2ZW50LCB0eXBlICkgKTtcbiAgICB9O1xuXG4gICAgZWxlbWVudC5hdHRhY2hFdmVudCggaXRlbS5JRVR5cGUgPSBJRVR5cGUoIHR5cGUgKSwgaXRlbS53cmFwcGVyICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnbm90IGltcGxlbWVudGVkJyApO1xuICB9XG5cbiAgaWYgKCBldmVudHMuaXRlbXNbIHR5cGUgXSApIHtcbiAgICBldmVudHMuaXRlbXNbIHR5cGUgXS5wdXNoKCBpdGVtICk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0gPSBbIGl0ZW0gXTtcbiAgICBldmVudHMuaXRlbXNbIHR5cGUgXS5pbmRleCA9IGV2ZW50cy50eXBlcy5sZW5ndGg7XG4gICAgZXZlbnRzLnR5cGVzLnB1c2goIHR5cGUgKTtcbiAgfVxufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLmV2ZW50Lm9mZlxuICogQHBhcmFtICB7Tm9kZX0gICAgIGVsZW1lbnRcbiAqIEBwYXJhbSAge3N0cmluZ30gICB0eXBlXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgc2VsZWN0b3JcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICogQHBhcmFtICB7Ym9vbGVhbn0gIHVzZUNhcHR1cmVcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbmV4cG9ydHMub2ZmID0gZnVuY3Rpb24gb2ZmICggZWxlbWVudCwgdHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICkge1xuICB2YXIgaXRlbXM7XG4gIHZhciBpdGVtO1xuICB2YXIgaTtcblxuICBpZiAoIHR5cGUgPT09IG51bGwgfHwgdHlwZW9mIHR5cGUgPT09ICd1bmRlZmluZWQnICkge1xuICAgIGZvciAoIGkgPSBldmVudHMudHlwZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBldmVudC5vZmYoIGVsZW1lbnQsIGV2ZW50cy50eXBlc1sgaSBdLCBzZWxlY3RvciApO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICggISAoIGl0ZW1zID0gZXZlbnRzLml0ZW1zWyB0eXBlIF0gKSApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKCBpID0gaXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgaXRlbSA9IGl0ZW1zWyBpIF07XG5cbiAgICBpZiAoIGl0ZW0uZWxlbWVudCAhPT0gZWxlbWVudCB8fFxuICAgICAgdHlwZW9mIGxpc3RlbmVyICE9PSAndW5kZWZpbmVkJyAmJiAoXG4gICAgICAgIGl0ZW0ubGlzdGVuZXIgIT09IGxpc3RlbmVyIHx8XG4gICAgICAgIGl0ZW0udXNlQ2FwdHVyZSAhPT0gdXNlQ2FwdHVyZSB8fFxuICAgICAgICAvLyB0b2RvOiBjaGVjayBib3RoIGl0ZW0uc2VsZWN0b3IgYW5kIHNlbGVjdG9yIGFuZCB0aGVuIGNvbXBhcmVcbiAgICAgICAgaXRlbS5zZWxlY3RvciAmJiBpdGVtLnNlbGVjdG9yICE9PSBzZWxlY3RvciApIClcbiAgICB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYnJhY2Utc3R5bGVcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGl0ZW1zLnNwbGljZSggaSwgMSApO1xuXG4gICAgaWYgKCAhIGl0ZW1zLmxlbmd0aCApIHtcbiAgICAgIGV2ZW50cy50eXBlcy5zcGxpY2UoIGl0ZW1zLmluZGV4LCAxICk7XG4gICAgICBldmVudHMuaXRlbXNbIHR5cGUgXSA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCBzdXBwb3J0ICkge1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBpdGVtLndyYXBwZXIsIGl0ZW0udXNlQ2FwdHVyZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmRldGFjaEV2ZW50KCBpdGVtLklFVHlwZSwgaXRlbS53cmFwcGVyICk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLnRyaWdnZXIgPSBmdW5jdGlvbiB0cmlnZ2VyICggZWxlbWVudCwgdHlwZSwgZGF0YSApIHtcbiAgdmFyIGl0ZW1zID0gZXZlbnRzLml0ZW1zWyB0eXBlIF07XG4gIHZhciBjbG9zZXN0O1xuICB2YXIgaXRlbTtcbiAgdmFyIGk7XG5cbiAgaWYgKCAhIGl0ZW1zICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyArK2kgKSB7XG4gICAgaXRlbSA9IGl0ZW1zWyBpIF07XG5cbiAgICBpZiAoIGVsZW1lbnQgKSB7XG4gICAgICBjbG9zZXN0ID0gY2xvc2VzdE5vZGUoIGVsZW1lbnQsIGl0ZW0uc2VsZWN0b3IgfHwgaXRlbS5lbGVtZW50ICk7XG4gICAgfSBlbHNlIGlmICggaXRlbS5zZWxlY3RvciApIHtcbiAgICAgIG5ldyBET01XcmFwcGVyKCBpdGVtLnNlbGVjdG9yICkuZWFjaCggKCBmdW5jdGlvbiAoIGl0ZW0gKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaXRlbS53cmFwcGVyKCBjcmVhdGVFdmVudFdpdGhUYXJnZXQoIHR5cGUsIGRhdGEsIHRoaXMgKSwgdGhpcyApO1xuICAgICAgICB9O1xuICAgICAgfSApKCBpdGVtICkgKTtcblxuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3Nlc3QgPSBpdGVtLmVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKCBjbG9zZXN0ICkge1xuICAgICAgaXRlbS53cmFwcGVyKCBjcmVhdGVFdmVudFdpdGhUYXJnZXQoIHR5cGUsIGRhdGEsIGVsZW1lbnQgfHwgY2xvc2VzdCApLCBjbG9zZXN0ICk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICggdGFyZ2V0LCBzb3VyY2UsIGRlZXAgKSB7XG4gIHZhciBpdGVtcztcbiAgdmFyIGl0ZW07XG4gIHZhciB0eXBlO1xuICB2YXIgaTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSBldmVudHMudHlwZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgaWYgKCAoIGl0ZW1zID0gZXZlbnRzLml0ZW1zWyB0eXBlID0gZXZlbnRzLnR5cGVzWyBpIF0gXSApICkge1xuICAgICAgZm9yICggaiA9IDAsIGwgPSBpdGVtcy5sZW5ndGg7IGogPCBsOyArK2ogKSB7XG4gICAgICAgIGlmICggKCBpdGVtID0gaXRlbXNbIGogXSApLnRhcmdldCA9PT0gc291cmNlICkge1xuICAgICAgICAgIGV2ZW50Lm9uKCB0YXJnZXQsIHR5cGUsIG51bGwsIGl0ZW0ubGlzdGVuZXIsIGl0ZW0udXNlQ2FwdHVyZSwgaXRlbS5vbmNlICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoICEgZGVlcCApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0YXJnZXQgPSB0YXJnZXQuY2hpbGROb2RlcztcbiAgc291cmNlID0gc291cmNlLmNoaWxkTm9kZXM7XG5cbiAgZm9yICggaSA9IHRhcmdldC5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBldmVudC5jb3B5KCB0YXJnZXRbIGkgXSwgc291cmNlWyBpIF0sIHRydWUgKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlRXZlbnRXaXRoVGFyZ2V0ICggdHlwZSwgZGF0YSwgdGFyZ2V0ICkge1xuICB2YXIgZSA9IG5ldyBFdmVudCggdHlwZSwgZGF0YSApO1xuICBlLnRhcmdldCA9IHRhcmdldDtcbiAgcmV0dXJuIGU7XG59XG5cbmZ1bmN0aW9uIElFVHlwZSAoIHR5cGUgKSB7XG4gIGlmICggdHlwZSA9PT0gJ0RPTUNvbnRlbnRMb2FkZWQnICkge1xuICAgIHJldHVybiAnb25yZWFkeXN0YXRlY2hhbmdlJztcbiAgfVxuXG4gIHJldHVybiAnb24nICsgdHlwZTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpbmQnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpbmQnICkoIHRydWUsIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpbmQnICkoIGZhbHNlLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItZWFjaCcgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWVhY2gnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1pbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzLWluJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMnICksIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1pbicgKSggcmVxdWlyZSggJy4va2V5cycgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5cbnZhciB3cmFwcGVycyA9IHtcbiAgY29sOiAgICAgIFsgMiwgJzx0YWJsZT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nIF0sXG4gIHRyOiAgICAgICBbIDIsICc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+JyBdLFxuICBkZWZhdWx0czogWyAwLCAnJywgJycgXVxufTtcblxuZnVuY3Rpb24gYXBwZW5kICggZnJhZ21lbnQsIGVsZW1lbnRzICkge1xuICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGVsZW1lbnRzWyBpIF0gKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZyYWdtZW50ICggZWxlbWVudHMsIGNvbnRleHQgKSB7XG4gIHZhciBmcmFnbWVudCA9IGNvbnRleHQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICB2YXIgZWxlbWVudDtcbiAgdmFyIHdyYXBwZXI7XG4gIHZhciB0YWc7XG4gIHZhciBkaXY7XG4gIHZhciBpO1xuICB2YXIgajtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgZWxlbWVudCA9IGVsZW1lbnRzWyBpIF07XG5cbiAgICBpZiAoIGlzT2JqZWN0TGlrZSggZWxlbWVudCApICkge1xuICAgICAgaWYgKCAnbm9kZVR5cGUnIGluIGVsZW1lbnQgKSB7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50ICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBlbmQoIGZyYWdtZW50LCBlbGVtZW50ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICggLzx8JiM/XFx3KzsvLnRlc3QoIGVsZW1lbnQgKSApIHtcbiAgICAgIGlmICggISBkaXYgKSB7XG4gICAgICAgIGRpdiA9IGNvbnRleHQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcbiAgICAgIH1cblxuICAgICAgdGFnID0gLzwoW2Etel1bXlxccz5dKikvaS5leGVjKCBlbGVtZW50ICk7XG5cbiAgICAgIGlmICggdGFnICkge1xuICAgICAgICB3cmFwcGVyID0gd3JhcHBlcnNbIHRhZyA9IHRhZ1sgMSBdIF0gfHwgd3JhcHBlcnNbIHRhZy50b0xvd2VyQ2FzZSgpIF0gfHwgd3JhcHBlcnMuZGVmYXVsdHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cmFwcGVyID0gd3JhcHBlcnMuZGVmYXVsdHM7XG4gICAgICB9XG5cbiAgICAgIGRpdi5pbm5lckhUTUwgPSB3cmFwcGVyWyAxIF0gKyBlbGVtZW50ICsgd3JhcHBlclsgMiBdO1xuXG4gICAgICBmb3IgKCBqID0gd3JhcHBlclsgMCBdOyBqID4gMDsgLS1qICkge1xuICAgICAgICBkaXYgPSBkaXYubGFzdENoaWxkO1xuICAgICAgfVxuXG4gICAgICBhcHBlbmQoIGZyYWdtZW50LCBkaXYuY2hpbGROb2RlcyApO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggY29udGV4dC5jcmVhdGVUZXh0Tm9kZSggZWxlbWVudCApICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCBkaXYgKSB7XG4gICAgZGl2LmlubmVySFRNTCA9ICcnO1xuICB9XG5cbiAgcmV0dXJuIGZyYWdtZW50O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmcm9tUGFpcnMgKCBwYWlycyApIHtcbiAgdmFyIG9iamVjdCA9IHt9O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSBwYWlycy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgb2JqZWN0WyBwYWlyc1sgaSBdWyAwIF0gXSA9IHBhaXJzWyBpIF1bIDEgXTtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZ2V0LWVsZW1lbnQtZGltZW5zaW9uJyApKCAnSGVpZ2h0JyApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZ2V0LWVsZW1lbnQtZGltZW5zaW9uJyApKCAnV2lkdGgnICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZiAoIG9iaiApIHtcbiAgdmFyIHByb3RvdHlwZTtcblxuICBpZiAoIG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICB9XG5cbiAgcHJvdG90eXBlID0gb2JqLl9fcHJvdG9fXzsgLy8ganNoaW50IGlnbm9yZTogbGluZVxuXG4gIGlmICggdHlwZW9mIHByb3RvdHlwZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIHByb3RvdHlwZTtcbiAgfVxuXG4gIGlmICggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCBvYmouY29uc3RydWN0b3IgKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyApIHtcbiAgICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgYmFzZUdldCAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtZ2V0JyApO1xudmFyIEVSUiAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXQgKCBvYmplY3QsIHBhdGggKSB7XG4gIHZhciBsZW5ndGggPSAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoO1xuXG4gIGlmICggISBsZW5ndGggKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGxlbmd0aCA+IDEgKSB7XG4gICAgcmV0dXJuIGJhc2VHZXQoIHRvT2JqZWN0KCBvYmplY3QgKSwgcGF0aCwgMCApO1xuICB9XG5cbiAgcmV0dXJuIHRvT2JqZWN0KCBvYmplY3QgKVsgcGF0aFsgMCBdIF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgaXNzZXQgICAgPSByZXF1aXJlKCAnLi9pc3NldCcgKTtcbnZhciBiYXNlSGFzICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1oYXMnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhcyAoIG9iaiwgcGF0aCApIHtcbiAgdmFyIGwgPSAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoO1xuXG4gIGlmICggISBsICkge1xuICAgIHRocm93IEVycm9yKCBFUlIuTk9fUEFUSCApO1xuICB9XG5cbiAgaWYgKCBsID4gMSApIHtcbiAgICByZXR1cm4gYmFzZUhhcyggdG9PYmplY3QoIG9iaiApLCBwYXRoICk7XG4gIH1cblxuICByZXR1cm4gaXNzZXQoIHRvT2JqZWN0KCBvYmogKSwgcGF0aFsgMCBdICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlkZW50aXR5ICggdiApIHtcbiAgcmV0dXJuIHY7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtaW5kZXgtb2YnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfQXJndW1lbnRFeGNlcHRpb24gKCB1bmV4cGVjdGVkLCBleHBlY3RlZCApIHtcbiAgcmV0dXJuIEVycm9yKCAnXCInICsgdG9TdHJpbmcuY2FsbCggdW5leHBlY3RlZCApICsgJ1wiIGlzIG5vdCAnICsgZXhwZWN0ZWQgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogdHJ1ZSxcbiAgY29sdW1uQ291bnQ6IHRydWUsXG4gIGZpbGxPcGFjaXR5OiB0cnVlLFxuICBmbGV4U2hyaW5rOiB0cnVlLFxuICBmb250V2VpZ2h0OiB0cnVlLFxuICBsaW5lSGVpZ2h0OiB0cnVlLFxuICBmbGV4R3JvdzogdHJ1ZSxcbiAgb3BhY2l0eTogdHJ1ZSxcbiAgb3JwaGFuczogdHJ1ZSxcbiAgd2lkb3dzOiB0cnVlLFxuICB6SW5kZXg6IHRydWUsXG4gIG9yZGVyOiB0cnVlLFxuICB6b29tOiB0cnVlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9maXJzdCAoIHdyYXBwZXIsIGVsZW1lbnQgKSB7XG4gIHdyYXBwZXJbIDAgXSA9IGVsZW1lbnQ7XG4gIHdyYXBwZXIubGVuZ3RoID0gMTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgX2dldFN0eWxlXG4gKiBAcGFyYW0gIHtvYmplY3R9ICBlbGVtZW50XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICBzdHlsZVxuICogQHBhcmFtICB7b2JqZWN0fSBbY29tcHV0ZWRTdHlsZV1cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZ2V0U3R5bGUgKCBlbGVtZW50LCBzdHlsZSwgY29tcHV0ZWRTdHlsZSApIHtcbiAgcmV0dXJuIGVsZW1lbnQuc3R5bGVbIHN0eWxlIF0gfHxcbiAgICAoIGNvbXB1dGVkU3R5bGUgfHwgZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbWVudCApICkuZ2V0UHJvcGVydHlWYWx1ZSggc3R5bGUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgX21lbW9pemVcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBmdW5jdGlvbl9cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9tZW1vaXplICggZnVuY3Rpb25fICkge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG4gIHZhciBsYXN0UmVzdWx0O1xuICB2YXIgbGFzdFZhbHVlO1xuXG4gIHJldHVybiBmdW5jdGlvbiBtZW1vaXplZCAoIHZhbHVlICkge1xuICAgIHN3aXRjaCAoIGZhbHNlICkge1xuICAgICAgY2FzZSBjYWxsZWQ6XG4gICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgIC8vIGZhbGxzIHRocm91Z2hcbiAgICAgIGNhc2UgdmFsdWUgPT09IGxhc3RWYWx1ZTpcbiAgICAgICAgcmV0dXJuICggbGFzdFJlc3VsdCA9IGZ1bmN0aW9uXyggKCBsYXN0VmFsdWUgPSB2YWx1ZSApICkgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGFzdFJlc3VsdDtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlc2NhcGUgPSByZXF1aXJlKCAnLi4vZXNjYXBlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF90ZXh0Q29udGVudCAoIGVsZW1lbnQsIHZhbHVlICkge1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIHZhciBjaGlsZHJlbjtcbiAgdmFyIGNoaWxkO1xuICB2YXIgdHlwZTtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGVzY2FwZSggdmFsdWUgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKCBpID0gMCwgbCA9ICggY2hpbGRyZW4gPSBlbGVtZW50LmNoaWxkTm9kZXMgKS5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgLy8gVEVYVF9OT0RFXG4gICAgaWYgKCAoIHR5cGUgPSAoIGNoaWxkID0gY2hpbGRyZW5bIGkgXSApLm5vZGVUeXBlICkgPT09IDMgKSB7XG4gICAgICByZXN1bHQgKz0gY2hpbGQubm9kZVZhbHVlO1xuICAgIC8vIEVMRU1FTlRfTk9ERVxuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09IDEgKSB7XG4gICAgICByZXN1bHQgKz0gX3RleHRDb250ZW50KCBjaGlsZCApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL21lbW9pemUnICkoIHJlcXVpcmUoICcuLi90eXBlJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3VuZXNjYXBlICggc3RyaW5nICkge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoIC9cXFxcKFxcXFwpPy9nLCAnJDEnICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd29yZHMgKCBzdHJpbmcgKSB7XG4gIGlmICggdHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycgKSB7XG4gICAgdGhyb3cgX0FyZ3VtZW50RXhjZXB0aW9uKCBzdHJpbmcsICdhIHN0cmluZycgKTtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmcubWF0Y2goIC9bXlxcc1xcdUZFRkZcXHhBMF0rL2cgKSB8fCBbXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBrZXlzICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW52ZXJ0ICggb2JqZWN0ICkge1xuICB2YXIgayA9IGtleXMoIG9iamVjdCA9IHRvT2JqZWN0KCBvYmplY3QgKSApO1xuICB2YXIgaW52ZXJ0ZWQgPSB7fTtcbiAgdmFyIGk7XG5cbiAgZm9yICggaSA9IGsubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgaW52ZXJ0ZWRbIGtbIGkgXSBdID0gb2JqZWN0WyBrWyBpIF0gXTtcbiAgfVxuXG4gIHJldHVybiBpbnZlcnRlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciBpc0xlbmd0aCAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSggdmFsdWUgKSAmJiBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiYgISBpc1dpbmRvd0xpa2UoIHZhbHVlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNMZW5ndGggICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xudmFyIGlzV2luZG93TGlrZSA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJyYXlMaWtlICggdmFsdWUgKSB7XG4gIGlmICggdmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgKSB7XG4gICAgcmV0dXJuIGlzTGVuZ3RoKCB2YWx1ZS5sZW5ndGggKSAmJiAhIGlzV2luZG93TGlrZSggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xudmFyIGlzTGVuZ3RoICAgICA9IHJlcXVpcmUoICcuL2lzLWxlbmd0aCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSggdmFsdWUgKSAmJlxuICAgIGlzTGVuZ3RoKCB2YWx1ZS5sZW5ndGggKSAmJlxuICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggdmFsdWUgKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0RPTUVsZW1lbnQgKCB2YWx1ZSApIHtcbiAgdmFyIG5vZGVUeXBlO1xuXG4gIGlmICggISBpc09iamVjdExpa2UoIHZhbHVlICkgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCBpc1dpbmRvd0xpa2UoIHZhbHVlICkgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBub2RlVHlwZSA9IHZhbHVlLm5vZGVUeXBlO1xuXG4gIHJldHVybiBub2RlVHlwZSA9PT0gMSB8fCAvLyBFTEVNRU5UX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSAzIHx8IC8vIFRFWFRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDggfHwgLy8gQ09NTUVOVF9OT0RFXG4gICAgICAgICBub2RlVHlwZSA9PT0gOSB8fCAvLyBET0NVTUVOVF9OT0RFXG4gICAgICAgICBub2RlVHlwZSA9PT0gMTE7ICAvLyBET0NVTUVOVF9GUkFHTUVOVF9OT0RFXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNOdW1iZXIgPSByZXF1aXJlKCAnLi9pcy1udW1iZXInICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNGaW5pdGUgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzTnVtYmVyKCB2YWx1ZSApICYmIGlzRmluaXRlKCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF90eXBlID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdHlwZScgKTtcblxudmFyIHJEZWVwS2V5ID0gLyhefFteXFxcXF0pKFxcXFxcXFxcKSooXFwufFxcWykvO1xuXG5mdW5jdGlvbiBpc0tleSAoIHZhbCApIHtcbiAgdmFyIHR5cGU7XG5cbiAgaWYgKCAhIHZhbCApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICggX3R5cGUoIHZhbCApID09PSAnYXJyYXknICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHR5cGUgPSB0eXBlb2YgdmFsO1xuXG4gIGlmICggdHlwZSA9PT0gJ251bWJlcicgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nIHx8IF90eXBlKCB2YWwgKSA9PT0gJ3N5bWJvbCcgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gISByRGVlcEtleS50ZXN0KCB2YWwgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1BWF9BUlJBWV9MRU5HVEggPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuTUFYX0FSUkFZX0xFTkdUSDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0xlbmd0aCAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID49IDAgJiZcbiAgICB2YWx1ZSA8PSBNQVhfQVJSQVlfTEVOR1RIICYmXG4gICAgdmFsdWUgJSAxID09PSAwO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc05hTiAoIHZhbHVlICkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc051bWJlciAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3RMaWtlICggdmFsdWUgKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xuXG52YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc09iamVjdCAoIHZhbHVlICkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKCB2YWx1ZSApICYmIHRvU3RyaW5nLmNhbGwoIHZhbHVlICkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSggJy4vZ2V0LXByb3RvdHlwZS1vZicgKTtcbnZhciBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdCcgKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcbnZhciBPQkpFQ1QgPSB0b1N0cmluZy5jYWxsKCBPYmplY3QgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0ICggdiApIHtcbiAgdmFyIHA7XG4gIHZhciBjO1xuXG4gIGlmICggISBpc09iamVjdCggdiApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHAgPSBnZXRQcm90b3R5cGVPZiggdiApO1xuXG4gIGlmICggcCA9PT0gbnVsbCApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICggISBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBwLCAnY29uc3RydWN0b3InICkgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYyA9IHAuY29uc3RydWN0b3I7XG5cbiAgcmV0dXJuIHR5cGVvZiBjID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwoIGMgKSA9PT0gT0JKRUNUO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1ByaW1pdGl2ZSAoIHZhbHVlICkge1xuICByZXR1cm4gISB2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0Zpbml0ZSAgPSByZXF1aXJlKCAnLi9pcy1maW5pdGUnICk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU2FmZUludGVnZXIgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzRmluaXRlKCB2YWx1ZSApICYmXG4gICAgdmFsdWUgPD0gY29uc3RhbnRzLk1BWF9TQUZFX0lOVCAmJlxuICAgIHZhbHVlID49IGNvbnN0YW50cy5NSU5fU0FGRV9JTlQgJiZcbiAgICB2YWx1ZSAlIDEgPT09IDA7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU3RyaW5nICggdmFsdWUgKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGUgPSByZXF1aXJlKCAnLi90eXBlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU3ltYm9sICggdmFsdWUgKSB7XG4gIHJldHVybiB0eXBlKCB2YWx1ZSApID09PSAnc3ltYm9sJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1dpbmRvd0xpa2UgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSggdmFsdWUgKSAmJiB2YWx1ZS53aW5kb3cgPT09IHZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzV2luZG93TGlrZSA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xuXG52YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1dpbmRvdyAoIHZhbHVlICkge1xuICByZXR1cm4gaXNXaW5kb3dMaWtlKCB2YWx1ZSApICYmIHRvU3RyaW5nLmNhbGwoIHZhbHVlICkgPT09ICdbb2JqZWN0IFdpbmRvd10nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc3NldCAoIGtleSwgb2JqICkge1xuICBpZiAoIG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIG9ialsga2V5IF0gIT09ICd1bmRlZmluZWQnIHx8IGtleSBpbiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZVZhbHVlcyAgICAgICAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtdmFsdWVzJyApO1xuXG52YXIgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCAnLi9pcy1hcnJheS1saWtlLW9iamVjdCcgKTtcbnZhciBrZXlzICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXRlcmFibGUgKCB2YWx1ZSApIHtcbiAgaWYgKCBpc0FycmF5TGlrZU9iamVjdCggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSB7XG4gICAgcmV0dXJuIHZhbHVlLnNwbGl0KCAnJyApO1xuICB9XG5cbiAgcmV0dXJuIGJhc2VWYWx1ZXMoIHZhbHVlLCBrZXlzKCB2YWx1ZSApICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCAnLi9pcy1hcnJheS1saWtlLW9iamVjdCcgKTtcbnZhciBtYXRjaGVzUHJvcGVydHkgICA9IHJlcXVpcmUoICcuL21hdGNoZXMtcHJvcGVydHknICk7XG52YXIgcHJvcGVydHkgICAgICAgICAgPSByZXF1aXJlKCAnLi9wcm9wZXJ0eScgKTtcblxuZXhwb3J0cy5pdGVyYXRlZSA9IGZ1bmN0aW9uIGl0ZXJhdGVlICggdmFsdWUgKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICggaXNBcnJheUxpa2VPYmplY3QoIHZhbHVlICkgKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNQcm9wZXJ0eSggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiBwcm9wZXJ0eSggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRLZXlzSW4gKCBvYmogKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciBrZXk7XG5cbiAgb2JqID0gdG9PYmplY3QoIG9iaiApO1xuXG4gIGZvciAoIGtleSBpbiBvYmogKSB7XG4gICAga2V5cy5wdXNoKCBrZXkgKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VLZXlzID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWtleXMnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgc3VwcG9ydCAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQta2V5cycgKTtcblxuaWYgKCBzdXBwb3J0ICE9PSAnZXMyMDE1JyApIHtcbiAgdmFyIF9rZXlzO1xuXG4gIC8qKlxuICAgKiArIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gK1xuICAgKiB8IEkgdGVzdGVkIHRoZSBmdW5jdGlvbnMgd2l0aCBzdHJpbmdbMjA0OF0gKGFuIGFycmF5IG9mIHN0cmluZ3MpIGFuZCBoYWQgfFxuICAgKiB8IHRoaXMgcmVzdWx0cyBpbiBOb2RlLmpzICh2OC4xMC4wKTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgKiArIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gK1xuICAgKiB8IGJhc2VLZXlzIHggMTAsNjc0IG9wcy9zZWMgwrEwLjIzJSAoOTQgcnVucyBzYW1wbGVkKSAgICAgICAgICAgICAgICAgICAgIHxcbiAgICogfCBPYmplY3Qua2V5cyB4IDIyLDE0NyBvcHMvc2VjIMKxMC4yMyUgKDk1IHJ1bnMgc2FtcGxlZCkgICAgICAgICAgICAgICAgICB8XG4gICAqIHwgRmFzdGVzdCBpcyBcIk9iamVjdC5rZXlzXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICogKyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICtcbiAgICovXG5cbiAgaWYgKCBzdXBwb3J0ID09PSAnZXM1JyApIHtcbiAgICBfa2V5cyA9IE9iamVjdC5rZXlzO1xuICB9IGVsc2Uge1xuICAgIF9rZXlzID0gYmFzZUtleXM7XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtleXMgKCB2ICkge1xuICAgIHJldHVybiBfa2V5cyggdG9PYmplY3QoIHYgKSApO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWluZGV4LW9mJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciBnZXQgICAgICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1nZXQnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hdGNoZXNQcm9wZXJ0eSAoIHByb3BlcnR5ICkge1xuICB2YXIgcGF0aCAgPSBjYXN0UGF0aCggcHJvcGVydHlbIDAgXSApO1xuICB2YXIgdmFsdWUgPSBwcm9wZXJ0eVsgMSBdO1xuXG4gIGlmICggISBwYXRoLmxlbmd0aCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoIG9iamVjdCApIHtcbiAgICBpZiAoIG9iamVjdCA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqZWN0ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIHBhdGgubGVuZ3RoID4gMSApIHtcbiAgICAgIHJldHVybiBnZXQoIG9iamVjdCwgcGF0aCwgMCApID09PSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyAwIF0gXSA9PT0gdmFsdWU7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtaW5kZXgtb2YnICk7XG5cbnZhciBtYXRjaGVzO1xuXG5pZiAoIHR5cGVvZiBFbGVtZW50ID09PSAndW5kZWZpbmVkJyB8fCAhICggbWF0Y2hlcyA9IEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUub01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yICkgKSB7XG4gIG1hdGNoZXMgPSBmdW5jdGlvbiBtYXRjaGVzICggc2VsZWN0b3IgKSB7XG4gICAgaWYgKCAvXiNbXFx3XFwtXSskLy50ZXN0KCBzZWxlY3RvciArPSAnJyApICkge1xuICAgICAgcmV0dXJuICcjJyArIHRoaXMuaWQgPT09IHNlbGVjdG9yO1xuICAgIH1cblxuICAgIHJldHVybiBiYXNlSW5kZXhPZiggdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICksIHRoaXMgKSA+PSAwO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS1vZicgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLWludm9rZScgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHknICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1pbnZva2UnICksIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1lbW9pemUgICAgICAgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC9tZW1vaXplJyApO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoICcuL2lzLXBsYWluLW9iamVjdCcgKTtcbnZhciB0b09iamVjdCAgICAgID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGtleXMgICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xudmFyIGlzQXJyYXkgICAgICAgPSBtZW1vaXplKCByZXF1aXJlKCAnLi9pcy1hcnJheScgKSApO1xuXG4vKipcbiAqIEBtZXRob2QgcGVha28ubWl4aW5cbiAqIEBwYXJhbSAge2Jvb2xlYW59ICAgIFtkZWVwPXRydWVdXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICB0YXJnZXRcbiAqIEBwYXJhbSAgey4uLm9iamVjdD99IG9iamVjdFxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1peGluICggZGVlcCwgdGFyZ2V0ICkge1xuICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpID0gMjtcbiAgdmFyIG9iamVjdDtcbiAgdmFyIHNvdXJjZTtcbiAgdmFyIHZhbHVlO1xuICB2YXIgajtcbiAgdmFyIGw7XG4gIHZhciBrO1xuXG4gIGlmICggdHlwZW9mIGRlZXAgIT09ICdib29sZWFuJyApIHtcbiAgICB0YXJnZXQgPSBkZWVwO1xuICAgIGRlZXAgPSB0cnVlO1xuICAgIGkgPSAxO1xuICB9XG5cbiAgdGFyZ2V0ID0gdG9PYmplY3QoIHRhcmdldCApO1xuXG4gIGZvciAoIDsgaSA8IGFyZ3NMZW5ndGg7ICsraSApIHtcbiAgICBvYmplY3QgPSBhcmd1bWVudHNbIGkgXTtcblxuICAgIGlmICggISBvYmplY3QgKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKCBrID0ga2V5cyggb2JqZWN0ICksIGogPSAwLCBsID0gay5sZW5ndGg7IGogPCBsOyArK2ogKSB7XG4gICAgICB2YWx1ZSA9IG9iamVjdFsga1sgaiBdIF07XG5cbiAgICAgIGlmICggZGVlcCAmJiBpc1BsYWluT2JqZWN0KCB2YWx1ZSApIHx8IGlzQXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgIHNvdXJjZSA9IHRhcmdldFsga1sgaiBdIF07XG5cbiAgICAgICAgaWYgKCBpc0FycmF5KCB2YWx1ZSApICkge1xuICAgICAgICAgIGlmICggISBpc0FycmF5KCBzb3VyY2UgKSApIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoICEgaXNQbGFpbk9iamVjdCggc291cmNlICkgKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRbIGtbIGogXSBdID0gbWl4aW4oIHRydWUsIHNvdXJjZSwgdmFsdWUgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFsga1sgaiBdIF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub29wICgpIHt9OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGJyYWNlLXJ1bGVzL2JyYWNlLW9uLXNhbWUtbGluZVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGUubm93IHx8IGZ1bmN0aW9uIG5vdyAoKSB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiZWZvcmUgPSByZXF1aXJlKCAnLi9iZWZvcmUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZSAoIHRhcmdldCApIHtcbiAgcmV0dXJuIGJlZm9yZSggMSwgdGFyZ2V0ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUNsb25lQXJyYXkgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtY2xvbmUtYXJyYXknICk7XG5cbnZhciBmcmFnbWVudCAgICAgICA9IHJlcXVpcmUoICcuL2ZyYWdtZW50JyApO1xuXG4vKipcbiAqIEBtZXRob2QgXy5wYXJzZUhUTUxcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgc3RyaW5nXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge0FycmF5LjxFbGVtZW50Pn1cbiAqIEBleGFtcGxlXG4gKiB2YXIgZWxlbWVudHMgPSBfLnBhcnNlSFRNTCggJzxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJzdWJtaXRcIiAvPicgKTtcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhUTUwgKCBzdHJpbmcsIGNvbnRleHQgKSB7XG4gIGlmICggL14oPzo8KFtcXHctXSspPjxcXC9bXFx3LV0rPnw8KFtcXHctXSspKD86XFxzKlxcLyk/PikkLy50ZXN0KCBzdHJpbmcgKSApIHtcbiAgICByZXR1cm4gWyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBSZWdFeHAuJDEgfHwgUmVnRXhwLiQyICkgXTtcbiAgfVxuXG4gIHJldHVybiBiYXNlQ2xvbmVBcnJheSggZnJhZ21lbnQoIFsgc3RyaW5nIF0sIGNvbnRleHQgfHwgZG9jdW1lbnQgKS5jaGlsZE5vZGVzICk7XG59O1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBWbGFkaXNsYXYgVGlraGl5IChTSUxFTlQpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdGlraGl5L3BlYWtvXG4gKi9cblxuLyohXG4gKiBCYXNlZCBvbiBqUXVlcnkgICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZVxuICogQmFzZWQgb24gTG9kYXNoICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmFtZXNwYWNlIHBlYWtvXG4gKi9cbnZhciBwZWFrbztcblxuaWYgKCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICkge1xuICBwZWFrbyA9IHJlcXVpcmUoICcuL18nICk7XG4gIHBlYWtvLkRPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi9ET01XcmFwcGVyJyApO1xufSBlbHNlIHtcbiAgcGVha28gPSBmdW5jdGlvbiBwZWFrbyAoKSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBicmFjZS1ydWxlcy9icmFjZS1vbi1zYW1lLWxpbmVcbn1cblxucGVha28uYWpheCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9hamF4JyApO1xucGVha28uYXNzaWduICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9hc3NpZ24nICk7XG5wZWFrby5hc3NpZ25JbiAgICAgICAgICA9IHJlcXVpcmUoICcuL2Fzc2lnbi1pbicgKTtcbnBlYWtvLmNsb25lICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xvbmUnICk7XG5wZWFrby5jcmVhdGUgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NyZWF0ZScgKTtcbnBlYWtvLmRlZmF1bHRzICAgICAgICAgID0gcmVxdWlyZSggJy4vZGVmYXVsdHMnICk7XG5wZWFrby5kZWZpbmVQcm9wZXJ0eSAgICA9IHJlcXVpcmUoICcuL2RlZmluZS1wcm9wZXJ0eScgKTtcbnBlYWtvLmRlZmluZVByb3BlcnRpZXMgID0gcmVxdWlyZSggJy4vZGVmaW5lLXByb3BlcnRpZXMnICk7XG5wZWFrby5lYWNoICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gnICk7XG5wZWFrby5lYWNoUmlnaHQgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gtcmlnaHQnICk7XG5wZWFrby5nZXRQcm90b3R5cGVPZiAgICA9IHJlcXVpcmUoICcuL2dldC1wcm90b3R5cGUtb2YnICk7XG5wZWFrby5pbmRleE9mICAgICAgICAgICA9IHJlcXVpcmUoICcuL2luZGV4LW9mJyApO1xucGVha28uaXNBcnJheSAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1hcnJheScgKTtcbnBlYWtvLmlzQXJyYXlMaWtlICAgICAgID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZScgKTtcbnBlYWtvLmlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG5wZWFrby5pc0RPTUVsZW1lbnQgICAgICA9IHJlcXVpcmUoICcuL2lzLWRvbS1lbGVtZW50JyApO1xucGVha28uaXNMZW5ndGggICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG5wZWFrby5pc09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdCcgKTtcbnBlYWtvLmlzT2JqZWN0TGlrZSAgICAgID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5wZWFrby5pc1BsYWluT2JqZWN0ICAgICA9IHJlcXVpcmUoICcuL2lzLXBsYWluLW9iamVjdCcgKTtcbnBlYWtvLmlzUHJpbWl0aXZlICAgICAgID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xucGVha28uaXNTeW1ib2wgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1zeW1ib2wnICk7XG5wZWFrby5pc1N0cmluZyAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXN0cmluZycgKTtcbnBlYWtvLmlzV2luZG93ICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtd2luZG93JyApO1xucGVha28uaXNXaW5kb3dMaWtlICAgICAgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcbnBlYWtvLmlzTnVtYmVyICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbnVtYmVyJyApO1xucGVha28uaXNOYU4gICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1uYW4nICk7XG5wZWFrby5pc1NhZmVJbnRlZ2VyICAgICA9IHJlcXVpcmUoICcuL2lzLXNhZmUtaW50ZWdlcicgKTtcbnBlYWtvLmlzRmluaXRlICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtZmluaXRlJyApO1xucGVha28ua2V5cyAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xucGVha28ua2V5c0luICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzLWluJyApO1xucGVha28ubGFzdEluZGV4T2YgICAgICAgPSByZXF1aXJlKCAnLi9sYXN0LWluZGV4LW9mJyApO1xucGVha28ubWl4aW4gICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9taXhpbicgKTtcbnBlYWtvLm5vb3AgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbm9vcCcgKTtcbnBlYWtvLnByb3BlcnR5ICAgICAgICAgID0gcmVxdWlyZSggJy4vcHJvcGVydHknICk7XG5wZWFrby5wcm9wZXJ0eU9mICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5LW9mJyApO1xucGVha28ubWV0aG9kICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9tZXRob2QnICk7XG5wZWFrby5tZXRob2RPZiAgICAgICAgICA9IHJlcXVpcmUoICcuL21ldGhvZC1vZicgKTtcbnBlYWtvLnNldFByb3RvdHlwZU9mICAgID0gcmVxdWlyZSggJy4vc2V0LXByb3RvdHlwZS1vZicgKTtcbnBlYWtvLnRvT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xucGVha28udHlwZSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90eXBlJyApO1xucGVha28uZm9yRWFjaCAgICAgICAgICAgPSByZXF1aXJlKCAnLi9mb3ItZWFjaCcgKTtcbnBlYWtvLmZvckVhY2hSaWdodCAgICAgID0gcmVxdWlyZSggJy4vZm9yLWVhY2gtcmlnaHQnICk7XG5wZWFrby5mb3JJbiAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1pbicgKTtcbnBlYWtvLmZvckluUmlnaHQgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLWluLXJpZ2h0JyApO1xucGVha28uZm9yT3duICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9mb3Itb3duJyApO1xucGVha28uZm9yT3duUmlnaHQgICAgICAgPSByZXF1aXJlKCAnLi9mb3Itb3duLXJpZ2h0JyApO1xucGVha28uYmVmb3JlICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9iZWZvcmUnICk7XG5wZWFrby5vbmNlICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL29uY2UnICk7XG5wZWFrby5kZWZhdWx0VG8gICAgICAgICA9IHJlcXVpcmUoICcuL2RlZmF1bHQtdG8nICk7XG5wZWFrby50aW1lciAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3RpbWVyJyApO1xucGVha28udGltZXN0YW1wICAgICAgICAgPSByZXF1aXJlKCAnLi90aW1lc3RhbXAnICk7XG5wZWFrby5ub3cgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL25vdycgKTtcbnBlYWtvLmNsYW1wICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xhbXAnICk7XG5wZWFrby5iaW5kICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2JpbmQnICk7XG5wZWFrby50cmltICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3RyaW0nICk7XG5wZWFrby50cmltRW5kICAgICAgICAgICA9IHJlcXVpcmUoICcuL3RyaW0tZW5kJyApO1xucGVha28udHJpbVN0YXJ0ICAgICAgICAgPSByZXF1aXJlKCAnLi90cmltLXN0YXJ0JyApO1xucGVha28uZmluZCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9maW5kJyApO1xucGVha28uZmluZEluZGV4ICAgICAgICAgPSByZXF1aXJlKCAnLi9maW5kLWluZGV4JyApO1xucGVha28uZmluZExhc3QgICAgICAgICAgPSByZXF1aXJlKCAnLi9maW5kLWxhc3QnICk7XG5wZWFrby5maW5kTGFzdEluZGV4ICAgICA9IHJlcXVpcmUoICcuL2ZpbmQtbGFzdC1pbmRleCcgKTtcbnBlYWtvLmhhcyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaGFzJyApO1xucGVha28uZ2V0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9nZXQnICk7XG5wZWFrby5zZXQgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3NldCcgKTtcbnBlYWtvLml0ZXJhdGVlICAgICAgICAgID0gcmVxdWlyZSggJy4vaXRlcmF0ZWUnICk7XG5wZWFrby5pZGVudGl0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL2lkZW50aXR5JyApO1xucGVha28uZXNjYXBlICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lc2NhcGUnICk7XG5wZWFrby51bmVzY2FwZSAgICAgICAgICA9IHJlcXVpcmUoICcuL3VuZXNjYXBlJyApO1xucGVha28ucmFuZG9tICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9yYW5kb20nICk7XG5wZWFrby5mcm9tUGFpcnMgICAgICAgICA9IHJlcXVpcmUoICcuL2Zyb20tcGFpcnMnICk7XG5wZWFrby5jb25zdGFudHMgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcbnBlYWtvLnRlbXBsYXRlICAgICAgICAgID0gcmVxdWlyZSggJy4vdGVtcGxhdGUnICk7XG5wZWFrby5pbnZlcnQgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2ludmVydCcgKTtcbnBlYWtvLmNvbXBvdW5kICAgICAgICAgID0gcmVxdWlyZSggJy4vY29tcG91bmQnICk7XG5wZWFrby5kZWJvdW5jZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2RlYm91bmNlJyApO1xuXG5pZiAoIHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyApIHtcbiAgc2VsZi5wZWFrbyA9IHNlbGYuXyA9IHBlYWtvOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBlYWtvO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBtZW1iZXIge29iamVjdH0gXy5wbGFjZWhvbGRlclxuICovXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG1ldGhvZCBfLnByb3BlcnR5T2ZcbiAqIEBwYXJhbSAge29iamVjdH0gICBvYmplY3RcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICogQGV4YW1wbGVcbiAqIHZhciBvYmplY3QgPSB7XG4gKiAgIHg6IDQyLFxuICogICB5OiAwXG4gKiB9O1xuICpcbiAqIFsgJ3gnLCAneScgXS5tYXAoIF8ucHJvcGVydHlPZiggb2JqZWN0ICkgKTsgLy8gLT4gWyA0MiwgMCBdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS1vZicgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLXByb3BlcnR5JyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG1ldGhvZCBfLnByb3BlcnR5XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgcGF0aFxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKiBAZXhhbXBsZVxuICogdmFyIG9iamVjdHMgPSBbXG4gKiAgIHsgbmFtZTogJ0phbWVzJyB9LFxuICogICB7IG5hbWU6ICdKb2huJyB9XG4gKiBdO1xuICpcbiAqIG9iamVjdHMubWFwKCBfLnByb3BlcnR5KCAnbmFtZScgKSApOyAvLyAtPiBbICdKYW1lcycsICdKb2huJyBdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eScgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLXByb3BlcnR5JyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAnY2xhc3MnOiAnY2xhc3NOYW1lJyxcbiAgJ2Zvcic6ICAgJ2h0bWxGb3InXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZVJhbmRvbSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1yYW5kb20nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmFuZG9tICggbG93ZXIsIHVwcGVyLCBmbG9hdGluZyApIHtcblxuICAvLyBfLnJhbmRvbSgpO1xuXG4gIGlmICggdHlwZW9mIGxvd2VyID09PSAndW5kZWZpbmVkJyApIHtcbiAgICBmbG9hdGluZyA9IGZhbHNlO1xuICAgIHVwcGVyID0gMTtcbiAgICBsb3dlciA9IDA7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiB1cHBlciA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cbiAgICAvLyBfLnJhbmRvbSggZmxvYXRpbmcgKTtcblxuICAgIGlmICggdHlwZW9mIGxvd2VyID09PSAnYm9vbGVhbicgKSB7XG4gICAgICBmbG9hdGluZyA9IGxvd2VyO1xuICAgICAgdXBwZXIgPSAxO1xuXG4gICAgLy8gXy5yYW5kb20oIHVwcGVyICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgZmxvYXRpbmcgPSBmYWxzZTtcbiAgICAgIHVwcGVyID0gbG93ZXI7XG4gICAgfVxuXG4gICAgbG93ZXIgPSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgZmxvYXRpbmcgPT09ICd1bmRlZmluZWQnICkge1xuXG4gICAgLy8gXy5yYW5kb20oIHVwcGVyLCBmbG9hdGluZyApO1xuXG4gICAgaWYgKCB0eXBlb2YgdXBwZXIgPT09ICdib29sZWFuJyApIHtcbiAgICAgIGZsb2F0aW5nID0gdXBwZXI7XG4gICAgICB1cHBlciA9IGxvd2VyO1xuICAgICAgbG93ZXIgPSAwO1xuXG4gICAgLy8gXy5yYW5kb20oIGxvd2VyLCB1cHBlciApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGZsb2F0aW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCBmbG9hdGluZyB8fCBsb3dlciAlIDEgfHwgdXBwZXIgJSAxICkge1xuICAgIHJldHVybiBiYXNlUmFuZG9tKCBsb3dlciwgdXBwZXIgKTtcbiAgfVxuXG4gIHJldHVybiBNYXRoLnJvdW5kKCBiYXNlUmFuZG9tKCBsb3dlciwgdXBwZXIgKSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzUHJpbWl0aXZlID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xudmFyIEVSUiAgICAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YgKCB0YXJnZXQsIHByb3RvdHlwZSApIHtcbiAgaWYgKCB0YXJnZXQgPT09IG51bGwgfHwgdHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgfVxuXG4gIGlmICggcHJvdG90eXBlICE9PSBudWxsICYmIGlzUHJpbWl0aXZlKCBwcm90b3R5cGUgKSApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoICdPYmplY3QgcHJvdG90eXBlIG1heSBvbmx5IGJlIGFuIE9iamVjdCBvciBudWxsOiAnICsgcHJvdG90eXBlICk7XG4gIH1cblxuICBpZiAoICdfX3Byb3RvX18nIGluIHRhcmdldCApIHtcbiAgICB0YXJnZXQuX19wcm90b19fID0gcHJvdG90eXBlOyAvLyBqc2hpbnQgaWdub3JlOiBsaW5lXG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4vY2FzdC1wYXRoJyApO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGJhc2VTZXQgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLXNldCcgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0ICggb2JqLCBwYXRoLCB2YWwgKSB7XG4gIHZhciBsID0gKCBwYXRoID0gY2FzdFBhdGgoIHBhdGggKSApLmxlbmd0aDtcblxuICBpZiAoICEgbCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIGlmICggbCA+IDEgKSB7XG4gICAgcmV0dXJuIGJhc2VTZXQoIHRvT2JqZWN0KCBvYmogKSwgcGF0aCwgdmFsICk7XG4gIH1cblxuICByZXR1cm4gKCB0b09iamVjdCggb2JqIClbIHBhdGhbIDAgXSBdID0gdmFsICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydDtcblxuZnVuY3Rpb24gdGVzdCAoIHRhcmdldCApIHtcbiAgdHJ5IHtcbiAgICBpZiAoICcnIGluIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggdGFyZ2V0LCAnJywge30gKSApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuaWYgKCB0ZXN0KCB7fSApICkge1xuICBzdXBwb3J0ID0gJ2Z1bGwnO1xufSBlbHNlIGlmICggdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0ZXN0KCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKSApICkge1xuICBzdXBwb3J0ID0gJ2RvbSc7XG59IGVsc2Uge1xuICBzdXBwb3J0ID0gJ25vdC1zdXBwb3J0ZWQnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN1cHBvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7XG5cbnRyeSB7XG4gIGlmICggc3Bhbi5zZXRBdHRyaWJ1dGUoICd4JywgJ3knICksIHNwYW4uZ2V0QXR0cmlidXRlKCAneCcgKSA9PT0gJ3knICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlcXVlbmNlc1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBudWxsO1xuICB9XG59IGNhdGNoICggZXJyb3IgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG59XG5cbnNwYW4gPSBudWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydDtcblxuaWYgKCBPYmplY3Qua2V5cyApIHtcbiAgdHJ5IHtcbiAgICBzdXBwb3J0ID0gT2JqZWN0LmtleXMoICcnICksICdlczIwMTUnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9ucywgbm8tc2VxdWVuY2VzXG4gIH0gY2F0Y2ggKCBlcnJvciApIHtcbiAgICBzdXBwb3J0ID0gJ2VzNSc7XG4gIH1cbn0gZWxzZSBpZiAoIHsgdG9TdHJpbmc6IG51bGwgfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSggJ3RvU3RyaW5nJyApICkge1xuICBzdXBwb3J0ID0gJ2hhcy1hLWJ1Zyc7XG59IGVsc2Uge1xuICBzdXBwb3J0ID0gJ25vdC1zdXBwb3J0ZWQnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN1cHBvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlc2NhcGUgID0gcmVxdWlyZSggJy4vZXNjYXBlJyApO1xuXG52YXIgcmVnZXhwcyA9IHtcbiAgc2FmZTogJzxcXFxcJT1cXFxccyooW15dKj8pXFxcXHMqXFxcXCU+JyxcbiAgaHRtbDogJzxcXFxcJS1cXFxccyooW15dKj8pXFxcXHMqXFxcXCU+JyxcbiAgY29tbTogXCInJycoW15dKj8pJycnXCIsXG4gIGNvZGU6ICc8XFxcXCVcXFxccyooW15dKj8pXFxcXHMqXFxcXCU+J1xufTtcblxuZnVuY3Rpb24gcmVwbGFjZXIgKCBtYXRjaCwgc2FmZSwgaHRtbCwgY29kZSApIHtcbiAgaWYgKCB0eXBlb2Ygc2FmZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIFwiJytfZShcIiArIHNhZmUucmVwbGFjZSggL1xcXFxuL2csICdcXG4nICkgKyBcIikrJ1wiO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgaHRtbCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIFwiJysoXCIgKyBodG1sLnJlcGxhY2UoIC9cXFxcbi9nLCAnXFxuJyApICsgXCIpKydcIjtcbiAgfVxuXG4gIGlmICggdHlwZW9mIGNvZGUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIic7XCIgKyBjb2RlLnJlcGxhY2UoIC9cXFxcbi9nLCAnXFxuJyApICsgXCI7X3IrPSdcIjtcbiAgfVxuXG4gIC8vIGNvbW1lbnQgaXMgbWF0Y2hlZCAtIGRvIG5vdGhpbmdcbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIEBtZXRob2QgcGVha28udGVtcGxhdGVcbiAqIEBwYXJhbSAge3N0cmluZ30gc291cmNlICAgICAgICAgICAgVGhlIHRlbXBsYXRlIHNvdXJjZS5cbiAqIEBwYXJhbSAge29iamVjdH0gW29wdGlvbnNdICAgICAgICAgQW4gb3B0aW9ucy5cbiAqIEBwYXJhbSAge29iamVjdH0gW29wdGlvbnMucmVnZXhwc10gQ3VzdG9tIHBhdHRlcm5zLlxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICAgICAgICBBbiBvYmplY3Qgd2l0aCBgcmVuZGVyYCBtZXRob2QuXG4gKiBAZXhhbXBsZVxuICogdmFyIHRlbXBsYXRlID0gcGVha28udGVtcGxhdGUoYFxuICogICAnJycgQSBodG1sLXNhZmUgb3V0cHV0LiAnJydcbiAqICAgPHRpdGxlPjwlPSBkYXRhLnVzZXJuYW1lICU+PC90aXRsZT5cbiAqICAgJycnIEEgYmxvY2sgb2YgY29kZS4gJycnXG4gKiAgIDwlIGZvciAoIHZhciBpID0gMDsgaSA8IDU7IGkgKz0gMSApIHtcbiAqICAgICAvLyBUaGUgXCJwcmludFwiIGZ1bmN0aW9uLlxuICogICAgIHByaW50KCBpICk7XG4gKiAgIH0gJT5cbiAqIGApO1xuICogdmFyIGh0bWwgPSB0ZW1wbGF0ZS5yZW5kZXIoIHsgdXNlcm5hbWU6ICdKb2huJyB9ICk7XG4gKiAvLyAtPiAnXFxuICBcXG4gIDx0aXRsZT5Kb2huPC90aXRsZT5cXG4gIFxcbiAgMDEyMzRcXG4nXG4gKi9cbmZ1bmN0aW9uIHRlbXBsYXRlICggc291cmNlLCBvcHRpb25zICkge1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIHZhciByZWdleHA7XG4gIHZhciByZW5kZXJfO1xuXG4gIGlmICggISBvcHRpb25zICkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldCAoIGtleSApIHtcbiAgICByZXR1cm4gb3B0aW9ucy5yZWdleHBzICYmIG9wdGlvbnMucmVnZXhwc1sga2V5IF0gfHwgcmVnZXhwc1sga2V5IF07XG4gIH1cblxuICByZWdleHAgPSBSZWdFeHAoXG4gICAgZ2V0KCAnc2FmZScgKSArICd8JyArXG4gICAgZ2V0KCAnaHRtbCcgKSArICd8JyArXG4gICAgZ2V0KCAnY29kZScgKSArICd8JyArXG4gICAgZ2V0KCAnY29tbScgKSwgJ2cnICk7XG5cbiAgaWYgKCBvcHRpb25zLndpdGggKSB7XG4gICAgcmVzdWx0ICs9ICd3aXRoKGRhdGF8fHt9KXsnO1xuICB9XG5cbiAgaWYgKCBvcHRpb25zLnByaW50ICE9PSBudWxsICkge1xuICAgIHJlc3VsdCArPSAnZnVuY3Rpb24gJyArICggb3B0aW9ucy5wcmludCB8fCAncHJpbnQnICkgKyBcIigpe19yKz1BcnJheS5wcm90b3R5cGUuam9pbi5jYWxsKGFyZ3VtZW50cywnJyk7fVwiO1xuICB9XG5cbiAgcmVzdWx0ICs9IFwidmFyIF9yPSdcIjtcblxuICByZXN1bHQgKz0gc291cmNlXG4gICAgLnJlcGxhY2UoIC9cXG4vZywgJ1xcXFxuJyApXG4gICAgLnJlcGxhY2UoIHJlZ2V4cCwgcmVwbGFjZXIgKTtcblxuICByZXN1bHQgKz0gXCInO1wiO1xuXG4gIGlmICggb3B0aW9ucy53aXRoICkge1xuICAgIHJlc3VsdCArPSAnfSc7XG4gIH1cblxuICByZXN1bHQgKz0gJ3JldHVybiBfcjsnO1xuXG4gIHJlbmRlcl8gPSBGdW5jdGlvbiggJ2RhdGEnLCAnX2UnLCByZXN1bHQgKTtcblxuICByZXR1cm4ge1xuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyICggZGF0YSApIHtcbiAgICAgIHJldHVybiByZW5kZXJfLmNhbGwoIHRoaXMsIGRhdGEsIGVzY2FwZSApO1xuICAgIH0sXG5cbiAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICBzb3VyY2U6IHNvdXJjZVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlO1xuIiwiLyoqXG4gKiBCYXNlZCBvbiBFcmlrIE3DtmxsZXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsOlxuICpcbiAqIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MSB3aGljaCBkZXJpdmVkIGZyb21cbiAqIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4gKiBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXG4gKlxuICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlci5cbiAqIEZpeGVzIGZyb20gUGF1bCBJcmlzaCwgVGlubyBaaWpkZWwsIEFuZHJldyBNYW8sIEtsZW1lbiBTbGF2acSNLCBEYXJpdXMgQmFjb24uXG4gKlxuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB0aW1lc3RhbXAgPSByZXF1aXJlKCAnLi90aW1lc3RhbXAnICk7XG5cbnZhciByZXF1ZXN0QUY7XG52YXIgY2FuY2VsQUY7XG5cbmlmICggdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICkge1xuICBjYW5jZWxBRiA9IHNlbGYuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi53ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIHJlcXVlc3RBRiA9IHNlbGYucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLm1velJlcXVlc3RBbmltYXRpb25GcmFtZTtcbn1cblxudmFyIG5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gISByZXF1ZXN0QUYgfHwgISBjYW5jZWxBRiB8fFxuICB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAvaVAoYWR8aG9uZXxvZCkuKk9TXFxzNi8udGVzdCggbmF2aWdhdG9yLnVzZXJBZ2VudCApO1xuXG5pZiAoIG5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICkge1xuICB2YXIgbGFzdFJlcXVlc3RUaW1lID0gMDtcbiAgdmFyIGZyYW1lRHVyYXRpb24gICA9IDEwMDAgLyA2MDtcblxuICBleHBvcnRzLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0ICggYW5pbWF0ZSApIHtcbiAgICB2YXIgbm93ICAgICAgICAgICAgID0gdGltZXN0YW1wKCk7XG4gICAgdmFyIG5leHRSZXF1ZXN0VGltZSA9IE1hdGgubWF4KCBsYXN0UmVxdWVzdFRpbWUgKyBmcmFtZUR1cmF0aW9uLCBub3cgKTtcblxuICAgIHJldHVybiBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICBsYXN0UmVxdWVzdFRpbWUgPSBuZXh0UmVxdWVzdFRpbWU7XG4gICAgICBhbmltYXRlKCBub3cgKTtcbiAgICB9LCBuZXh0UmVxdWVzdFRpbWUgLSBub3cgKTtcbiAgfTtcblxuICBleHBvcnRzLmNhbmNlbCA9IGNsZWFyVGltZW91dDtcbn0gZWxzZSB7XG4gIGV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QgKCBhbmltYXRlICkge1xuICAgIHJldHVybiByZXF1ZXN0QUYoIGFuaW1hdGUgKTtcbiAgfTtcblxuICBleHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCAoIGlkICkge1xuICAgIHJldHVybiBjYW5jZWxBRiggaWQgKTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG5vdyA9IHJlcXVpcmUoICcuL25vdycgKTtcbnZhciBuYXZpZ2F0b3JTdGFydDtcblxuaWYgKCB0eXBlb2YgcGVyZm9ybWFuY2UgPT09ICd1bmRlZmluZWQnIHx8ICEgcGVyZm9ybWFuY2Uubm93ICkge1xuICBuYXZpZ2F0b3JTdGFydCA9IG5vdygpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGltZXN0YW1wICgpIHtcbiAgICByZXR1cm4gbm93KCkgLSBuYXZpZ2F0b3JTdGFydDtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGltZXN0YW1wICgpIHtcbiAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdW5lc2NhcGUgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC91bmVzY2FwZScgKTtcblxudmFyIGlzU3ltYm9sICA9IHJlcXVpcmUoICcuL2lzLXN5bWJvbCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSB7XG4gICAgcmV0dXJuIF91bmVzY2FwZSggdmFsdWUgKTtcbiAgfVxuXG4gIGlmICggaXNTeW1ib2woIHZhbHVlICkgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgdmFyIGtleSA9ICcnICsgdmFsdWU7XG5cbiAgaWYgKCBrZXkgPT09ICcwJyAmJiAxIC8gdmFsdWUgPT09IC1JbmZpbml0eSApIHtcbiAgICByZXR1cm4gJy0wJztcbiAgfVxuXG4gIHJldHVybiBfdW5lc2NhcGUoIGtleSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUiA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9PYmplY3QgKCB2YWx1ZSApIHtcbiAgaWYgKCB2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0KCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKCBTdHJpbmcucHJvdG90eXBlLnRyaW1FbmQgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJpbUVuZCAoIHN0cmluZyApIHtcbiAgICByZXR1cm4gKCAnJyArIHN0cmluZyApLnRyaW1FbmQoKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS10cmltJyApKCAvW1xcc1xcdUZFRkZcXHhBMF0rJC8gKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKCBTdHJpbmcucHJvdG90eXBlLnRyaW1TdGFydCApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmltU3RhcnQgKCBzdHJpbmcgKSB7XG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS50cmltU3RhcnQoKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS10cmltJyApKCAvXltcXHNcXHVGRUZGXFx4QTBdKy8gKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKCBTdHJpbmcucHJvdG90eXBlLnRyaW0gKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJpbSAoIHN0cmluZyApIHtcbiAgICByZXR1cm4gKCAnJyArIHN0cmluZyApLnRyaW0oKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS10cmltJyApKCAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskLyApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlID0gcmVxdWlyZSggJy4vY3JlYXRlJyApO1xuXG52YXIgY2FjaGUgPSBjcmVhdGUoIG51bGwgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0eXBlICggdmFsdWUgKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbiAgfVxuXG4gIGlmICggdmFsdWUgPT09IG51bGwgKSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuXG4gIHZhciBzdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHZhbHVlICk7XG5cbiAgaWYgKCAhIGNhY2hlWyBzdHJpbmcgXSApIHtcbiAgICBjYWNoZVsgc3RyaW5nIF0gPSBzdHJpbmcuc2xpY2UoIDgsIC0xICkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHJldHVybiBjYWNoZVsgc3RyaW5nIF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZXNjYXBlJyApKCAvJig/Omx0fGd0fCMzNHwjMzl8YW1wKTsvZywge1xuICAnJmx0Oyc6ICAnPCcsXG4gICcmZ3Q7JzogICc+JyxcbiAgJyYjMzQ7JzogJ1wiJyxcbiAgJyYjMzk7JzogXCInXCIsXG4gICcmYW1wOyc6ICcmJ1xufSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmlyc3QnICkoICd0b1VwcGVyQ2FzZScgKTtcbiJdfQ==
