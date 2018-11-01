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

},{"../access":21,"../base/base-for-each":31,"../base/base-for-in":32,"../create/create-remove-prop":67,"../event":78,"../get-element-h":91,"../get-element-w":92,"../internal/first":100,"../internal/text-content":102,"../internal/words":105,"../is-array-like-object":107,"../is-dom-element":110,"../parse-html":139,"../props":144,"../support/support-get-attribute":149,"./prototype/css":2,"./prototype/each":3,"./prototype/end":4,"./prototype/eq":5,"./prototype/find":6,"./prototype/first":7,"./prototype/get":8,"./prototype/last":9,"./prototype/map":10,"./prototype/parent":11,"./prototype/ready":12,"./prototype/remove":13,"./prototype/removeAttr":14,"./prototype/removeProp":15,"./prototype/stack":16,"./prototype/style":17,"./prototype/styles":18}],2:[function(require,module,exports){
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

},{"../../event":78}],13:[function(require,module,exports){
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

},{"../../base/base-remove-attr":40,"../../create/create-remove-prop":67}],15:[function(require,module,exports){
'use strict';

module.exports = require( '../../create/create-remove-prop' )( function _removeProp ( element, key ) {
  delete element[ key ];
} );

},{"../../create/create-remove-prop":67}],16:[function(require,module,exports){
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

},{"..":1,"../../base/base-copy-array":28,"../../internal/first":100}],17:[function(require,module,exports){
'use strict';

var isObjectLike = require( '../../is-object-like' );
var cssNumbers   = require( '../../css-numbers' );
var getStyle     = require( '../../get-style' );
var camelize     = require( '../../camelize' );
var access       = require( '../../access' );

module.exports = function style ( key, val ) {
  var px = 'do-not-add';

  // Compute px or add 'px' to `val` now.

  if ( typeof key === 'string' && ! cssNumbers[ camelize( key ) ] ) {
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
      return getStyle( element, key );
    }

    if ( typeof val === 'number' && ( px === 'got-a-function' || px === 'got-an-object' && ! cssNumbers[ key ] ) ) {
      val += 'px';
    }

    element.style[ key ] = val;
  } );
};

},{"../../access":21,"../../camelize":47,"../../css-numbers":69,"../../get-style":94,"../../is-object-like":116}],18:[function(require,module,exports){
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

},{"../../camelize":47}],19:[function(require,module,exports){
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

},{"./ajax-options":22,"./defaults":72,"qs":"qs"}],24:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-assign' )( require( './keys-in' ) );

},{"./create/create-assign":56,"./keys-in":128}],25:[function(require,module,exports){
'use strict';

module.exports = Object.assign || require( './create/create-assign' )( require( './keys' ) );

},{"./create/create-assign":56,"./keys":129}],26:[function(require,module,exports){
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

},{"../call-iteratee":46,"../isset":125}],32:[function(require,module,exports){
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

},{"../call-iteratee":46}],33:[function(require,module,exports){
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

var baseToIndex = require( './base-to-index' );

var indexOf     = Array.prototype.indexOf;
var lastIndexOf = Array.prototype.lastIndexOf;

function baseIndexOf ( arr, search, fromIndex, fromRight ) {
  var idx;
  var val;
  var i;
  var j;
  var l;

  // use the native function if it is supported and the search is not nan.

  if ( search === search && ( idx = fromRight ? lastIndexOf : indexOf ) ) { // eslint-disable-line no-ternary
    return idx.call( arr, search, fromIndex );
  }

  l = arr.length;

  if ( ! l ) {
    return -1;
  }

  j = l - 1;

  if ( typeof fromIndex !== 'undefined' ) {
    fromIndex = baseToIndex( fromIndex, l );

    if ( fromRight ) {
      j = Math.min( j, fromIndex );
    } else {
      j = Math.max( 0, fromIndex );
    }

    i = j - 1;
  } else {
    i = -1;
  }

  for ( ; j >= 0; --j ) {
    if ( fromRight ) {
      idx = j;
    } else {
      idx = ++i;
    }

    val = arr[ idx ];

    if ( val === search || search !== search && val !== val ) {
      return idx;
    }
  }

  return -1;
}

module.exports = baseIndexOf;

},{"./base-to-index":42}],36:[function(require,module,exports){
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

module.exports = function baseToIndex ( v, l ) {
  if ( ! l || ! v ) {
    return 0;
  }

  if ( v < 0 ) {
    v += l;
  }

  return v || 0;
};

},{}],43:[function(require,module,exports){
'use strict';

module.exports = function baseValues ( object, keys ) {
  var i = keys.length;
  var values = Array( i );

  while ( --i >= 0 ) {
    values[ i ] = object[ keys[ i ] ];
  }

  return values;
};

},{}],44:[function(require,module,exports){
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

},{"./default-to":71,"./internal/ArgumentException":99}],45:[function(require,module,exports){
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

},{"./constants":54,"./index-of":98,"./internal/ArgumentException":99,"./placeholder":141}],46:[function(require,module,exports){
'use strict';

module.exports = function callIteratee ( fn, ctx, val, key, obj ) {
  if ( typeof ctx === 'undefined' ) {
    return fn( val, key, obj );
  }

  return fn.call( ctx, val, key, obj );
};

},{}],47:[function(require,module,exports){
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

},{"./upper-first":161}],48:[function(require,module,exports){
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

},{"./base/base-exec":30,"./internal/type":103,"./internal/unescape":104,"./is-key":112,"./to-key":154}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{"./create":55,"./each":76,"./get-prototype-of":93,"./is-object-like":116,"./to-object":155}],51:[function(require,module,exports){
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

},{"./closest":52}],52:[function(require,module,exports){
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

},{"./matches-selector":132}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{"./define-properties":73,"./is-primitive":119,"./set-prototype-of":146}],56:[function(require,module,exports){
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

},{"../base/base-assign":26,"../constants":54}],57:[function(require,module,exports){
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

},{"../base/base-for-each":31,"../base/base-for-in":32,"../is-array-like":108,"../iteratee":127,"../keys":129,"../to-object":155}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{"../call-iteratee":46,"../isset":125,"../iterable":126,"../iteratee":127,"../to-object":155}],60:[function(require,module,exports){
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

},{"../constants":54}],61:[function(require,module,exports){
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

},{"../base/base-for-each":31,"../iterable":126,"../iteratee":127,"../to-object":155}],62:[function(require,module,exports){
'use strict';

var baseForIn = require( '../base/base-for-in' );
var toObject  = require( '../to-object' );
var iteratee  = require( '../iteratee' ).iteratee;

module.exports = function createForIn ( keys, fromRight ) {
  return function forIn ( obj, fn, ctx ) {
    return baseForIn( obj = toObject( obj ), iteratee( fn ), ctx, fromRight, keys( obj ) );
  };
};

},{"../base/base-for-in":32,"../iteratee":127,"../to-object":155}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
'use strict';

var baseIndexOf = require( '../base/base-index-of' );
var toObject    = require( '../to-object' );

module.exports = function createIndexOf ( fromRight ) {
  return function indexOf ( arr, search, fromIndex ) {
    return baseIndexOf( toObject( arr ), search, fromIndex, fromRight );
  };
};

},{"../base/base-index-of":35,"../to-object":155}],65:[function(require,module,exports){
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

},{"../cast-path":48}],66:[function(require,module,exports){
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

},{"../cast-path":48,"../noop":136}],67:[function(require,module,exports){
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

},{"../internal/words":105}],68:[function(require,module,exports){
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

},{"../constants":54}],69:[function(require,module,exports){
'use strict';

module.exports = {
  'animationIterationCount': true,
  'columnCount': true,
  'fillOpacity': true,
  'flexShrink': true,
  'fontWeight': true,
  'lineHeight': true,
  'flexGrow': true,
  'opacity': true,
  'orphans': true,
  'widows': true,
  'zIndex': true,
  'order': true,
  'zoom': true
};

},{}],70:[function(require,module,exports){
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

},{"./internal/ArgumentException":99}],71:[function(require,module,exports){
'use strict';

module.exports = function defaultTo ( value, defaultValue ) {
  if ( value !== null && typeof value !== 'undefined' && value === value ) {
    return value;
  }

  return defaultValue;
};

},{}],72:[function(require,module,exports){
'use strict';

var mixin = require( './mixin' );

function defaults ( defaults, object ) {
  if ( object ) {
    return mixin( {}, defaults, object );
  }

  return mixin( {}, defaults );
}

module.exports = defaults;

},{"./mixin":135}],73:[function(require,module,exports){
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

},{"./base/base-define-property":29,"./each":76,"./is-primitive":119,"./support/support-define-property":148}],74:[function(require,module,exports){
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

},{"./base/base-define-property":29,"./is-primitive":119,"./support/support-define-property":148}],75:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-each' )( true );

},{"./create/create-each":57}],76:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-each' )();

},{"./create/create-each":57}],77:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-escape' )( /[<>"'&]/g, {
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&#34;',
  '&': '&amp;'
} );

},{"./create/create-escape":58}],78:[function(require,module,exports){
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

},{"./DOMWrapper":1,"./Event":19,"./closest-node":51}],79:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( true );

},{"./create/create-find":59}],80:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( true, true );

},{"./create/create-find":59}],81:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )( false, true );

},{"./create/create-find":59}],82:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-find' )();

},{"./create/create-find":59}],83:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-each' )( true );

},{"./create/create-for-each":61}],84:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-each' )();

},{"./create/create-for-each":61}],85:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys-in' ), true );

},{"./create/create-for-in":62,"./keys-in":128}],86:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys-in' ) );

},{"./create/create-for-in":62,"./keys-in":128}],87:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys' ), true );

},{"./create/create-for-in":62,"./keys":129}],88:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-for-in' )( require( './keys' ) );

},{"./create/create-for-in":62,"./keys":129}],89:[function(require,module,exports){
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

},{"./is-object-like":116}],90:[function(require,module,exports){
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

},{}],91:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-get-element-dimension' )( 'Height' );

},{"./create/create-get-element-dimension":63}],92:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-get-element-dimension' )( 'Width' );

},{"./create/create-get-element-dimension":63}],93:[function(require,module,exports){
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

},{"./constants":54}],94:[function(require,module,exports){
'use strict';

module.exports = function getStyle ( e, k, c ) {
  return e.style[ k ] || ( c || getComputedStyle( e ) ).getPropertyValue( k );
};

},{}],95:[function(require,module,exports){
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

},{"./base/base-get":33,"./cast-path":48,"./constants":54,"./to-object":155}],96:[function(require,module,exports){
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

},{"./base/base-has":34,"./cast-path":48,"./constants":54,"./isset":125,"./to-object":155}],97:[function(require,module,exports){
'use strict';

module.exports = function identity ( v ) {
  return v;
};

},{}],98:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-index-of' )();

},{"./create/create-index-of":64}],99:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString;

module.exports = function _ArgumentException ( unexpected, expected ) {
  return Error( '"' + toString.call( unexpected ) + '" is not ' + expected );
};

},{}],100:[function(require,module,exports){
'use strict';

module.exports = function _first ( wrapper, element ) {
  wrapper[ 0 ] = element;
  wrapper.length = 1;
};

},{}],101:[function(require,module,exports){
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

},{}],102:[function(require,module,exports){
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

},{"../escape":77}],103:[function(require,module,exports){
'use strict';

module.exports = require( './memoize' )( require( '../type' ) );

},{"../type":159,"./memoize":101}],104:[function(require,module,exports){
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

},{"./ArgumentException":99}],106:[function(require,module,exports){
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

var _type    = require( './internal/type' );

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

},{"./constants":54}],114:[function(require,module,exports){
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

},{"./get-prototype-of":93,"./is-object":117}],119:[function(require,module,exports){
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

},{"./constants":54,"./is-finite":111}],121:[function(require,module,exports){
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

var isArrayLikeObject = require( './is-array-like-object' );
var baseValues        = require( './base/base-values' );
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

},{"./base/base-values":43,"./is-array-like-object":107,"./keys":129}],127:[function(require,module,exports){
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

},{"./create/create-index-of":64}],131:[function(require,module,exports){
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

},{"./base/base-get":33,"./cast-path":48,"./constants":54}],132:[function(require,module,exports){
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

},{"./base/base-invoke":36,"./create/create-property-of":65}],134:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property' )( require( './base/base-invoke' ), true );

},{"./base/base-invoke":36,"./create/create-property":66}],135:[function(require,module,exports){
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

},{"./internal/memoize":101,"./is-array":109,"./is-plain-object":118,"./keys":129,"./to-object":155}],136:[function(require,module,exports){
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

},{"./before":44}],139:[function(require,module,exports){
'use strict';

var baseCloneArray = require( './base/base-clone-array' );
var fragment       = require( './fragment' );

module.exports = function parseHTML ( string, context ) {
  if ( /^(?:<([\w-]+)><\/[\w-]+>|<([\w-]+)(?:\s*\/)?>)$/.test( string ) ) {
    return [ document.createElement( RegExp.$1 || RegExp.$2 ) ];
  }

  return baseCloneArray( fragment( [ string ], context || document ).childNodes );
};

},{"./base/base-clone-array":27,"./fragment":89}],140:[function(require,module,exports){
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

},{"./DOMWrapper":1,"./_":20,"./ajax":23,"./assign":25,"./assign-in":24,"./before":44,"./bind":45,"./clamp":49,"./clone":50,"./compound":53,"./constants":54,"./create":55,"./debounce":70,"./default-to":71,"./defaults":72,"./define-properties":73,"./define-property":74,"./each":76,"./each-right":75,"./escape":77,"./find":82,"./find-index":79,"./find-last":81,"./find-last-index":80,"./for-each":84,"./for-each-right":83,"./for-in":86,"./for-in-right":85,"./for-own":88,"./for-own-right":87,"./from-pairs":90,"./get":95,"./get-prototype-of":93,"./has":96,"./identity":97,"./index-of":98,"./invert":106,"./is-array":109,"./is-array-like":108,"./is-array-like-object":107,"./is-dom-element":110,"./is-finite":111,"./is-length":113,"./is-nan":114,"./is-number":115,"./is-object":117,"./is-object-like":116,"./is-plain-object":118,"./is-primitive":119,"./is-safe-integer":120,"./is-string":121,"./is-symbol":122,"./is-window":124,"./is-window-like":123,"./iteratee":127,"./keys":129,"./keys-in":128,"./last-index-of":130,"./method":134,"./method-of":133,"./mixin":135,"./noop":136,"./now":137,"./once":138,"./property":143,"./property-of":142,"./random":145,"./set":147,"./set-prototype-of":146,"./template":151,"./timer":152,"./timestamp":153,"./to-object":155,"./trim":158,"./trim-end":156,"./trim-start":157,"./type":159,"./unescape":160}],141:[function(require,module,exports){
'use strict';

/**
 * @member {object} peako.placeholder
 */

},{}],142:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property-of' )( require( './base/base-property' ) );

},{"./base/base-property":38,"./create/create-property-of":65}],143:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property' )( require( './base/base-property' ) );

},{"./base/base-property":38,"./create/create-property":66}],144:[function(require,module,exports){
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

},{"./constants":54,"./is-primitive":119}],147:[function(require,module,exports){
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

},{"./base/base-set":41,"./cast-path":48,"./constants":54,"./to-object":155}],148:[function(require,module,exports){
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
 *   <% for ( var i = 0; i < 5; i += 1 ) { %>
 *     <%- i %>
 *   <% } %>
 *   ''' The "print" function. '''
 *   <% print( 'Hello T!' ); %>
 * `);
 * var html = template.render( { username: 'John' } );
 * // -> '<title>John</title>'
 */
function template ( source, options ) {
  var result = '';
  var regexp;
  var render_;

  if ( ! options ) {
    options = {};
  }

  function _ ( key ) {
    return options.regexps && options.regexps[ key ] || regexps[ key ];
  }

  var regexps_ = {
    safe: _( 'safe' ),
    html: _( 'html' ),
    code: _( 'code' ),
    comm: _( 'comm' )
  };

  regexp = RegExp(
    ( regexps_.safe ) + '|' +
    ( regexps_.html ) + '|' +
    ( regexps_.code ) + '|' +
    ( regexps_.comm ), 'g' );

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

},{"./escape":77}],152:[function(require,module,exports){
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

},{"./constants":54}],156:[function(require,module,exports){
'use strict';

if ( String.prototype.trimEnd ) {
  module.exports = function trimEnd ( string ) {
    return ( '' + string ).trimEnd();
  };
} else {
  module.exports = require( './create/create-trim' )( /[\s\uFEFF\xA0]+$/ );
}

},{"./create/create-trim":68}],157:[function(require,module,exports){
'use strict';

if ( String.prototype.trimStart ) {
  module.exports = function trimStart ( string ) {
    return ( '' + string ).trimStart();
  };
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+/ );
}

},{"./create/create-trim":68}],158:[function(require,module,exports){
'use strict';

if ( String.prototype.trim ) {
  module.exports = function trim ( string ) {
    return ( '' + string ).trim();
  };
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/ );
}

},{"./create/create-trim":68}],159:[function(require,module,exports){
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

},{"./create":55}],160:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-escape' )( /&(?:lt|gt|#34|#39|amp);/g, {
  '&lt;':  '<',
  '&gt;':  '>',
  '&#34;': '"',
  '&#39;': "'",
  '&amp;': '&'
} );

},{"./create/create-escape":58}],161:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-first' )( 'toUpperCase' );

},{"./create/create-first":60}]},{},[140])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJET01XcmFwcGVyL2luZGV4LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvY3NzLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZWFjaC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VuZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VxLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZmluZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2ZpcnN0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZ2V0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvbGFzdC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL21hcC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3BhcmVudC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlYWR5LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlQXR0ci5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlbW92ZVByb3AuanMiLCJET01XcmFwcGVyL3Byb3RvdHlwZS9zdGFjay5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3N0eWxlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvc3R5bGVzLmpzIiwiRXZlbnQuanMiLCJfLmpzIiwiYWNjZXNzLmpzIiwiYWpheC1vcHRpb25zLmpzIiwiYWpheC5qcyIsImFzc2lnbi1pbi5qcyIsImFzc2lnbi5qcyIsImJhc2UvYmFzZS1hc3NpZ24uanMiLCJiYXNlL2Jhc2UtY2xvbmUtYXJyYXkuanMiLCJiYXNlL2Jhc2UtY29weS1hcnJheS5qcyIsImJhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHkuanMiLCJiYXNlL2Jhc2UtZXhlYy5qcyIsImJhc2UvYmFzZS1mb3ItZWFjaC5qcyIsImJhc2UvYmFzZS1mb3ItaW4uanMiLCJiYXNlL2Jhc2UtZ2V0LmpzIiwiYmFzZS9iYXNlLWhhcy5qcyIsImJhc2UvYmFzZS1pbmRleC1vZi5qcyIsImJhc2UvYmFzZS1pbnZva2UuanMiLCJiYXNlL2Jhc2Uta2V5cy5qcyIsImJhc2UvYmFzZS1wcm9wZXJ0eS5qcyIsImJhc2UvYmFzZS1yYW5kb20uanMiLCJiYXNlL2Jhc2UtcmVtb3ZlLWF0dHIuanMiLCJiYXNlL2Jhc2Utc2V0LmpzIiwiYmFzZS9iYXNlLXRvLWluZGV4LmpzIiwiYmFzZS9iYXNlLXZhbHVlcy5qcyIsImJlZm9yZS5qcyIsImJpbmQuanMiLCJjYWxsLWl0ZXJhdGVlLmpzIiwiY2FtZWxpemUuanMiLCJjYXN0LXBhdGguanMiLCJjbGFtcC5qcyIsImNsb25lLmpzIiwiY2xvc2VzdC1ub2RlLmpzIiwiY2xvc2VzdC5qcyIsImNvbXBvdW5kLmpzIiwiY29uc3RhbnRzLmpzIiwiY3JlYXRlLmpzIiwiY3JlYXRlL2NyZWF0ZS1hc3NpZ24uanMiLCJjcmVhdGUvY3JlYXRlLWVhY2guanMiLCJjcmVhdGUvY3JlYXRlLWVzY2FwZS5qcyIsImNyZWF0ZS9jcmVhdGUtZmluZC5qcyIsImNyZWF0ZS9jcmVhdGUtZmlyc3QuanMiLCJjcmVhdGUvY3JlYXRlLWZvci1lYWNoLmpzIiwiY3JlYXRlL2NyZWF0ZS1mb3ItaW4uanMiLCJjcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbi5qcyIsImNyZWF0ZS9jcmVhdGUtaW5kZXgtb2YuanMiLCJjcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mLmpzIiwiY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS5qcyIsImNyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AuanMiLCJjcmVhdGUvY3JlYXRlLXRyaW0uanMiLCJjc3MtbnVtYmVycy5qcyIsImRlYm91bmNlLmpzIiwiZGVmYXVsdC10by5qcyIsImRlZmF1bHRzLmpzIiwiZGVmaW5lLXByb3BlcnRpZXMuanMiLCJkZWZpbmUtcHJvcGVydHkuanMiLCJlYWNoLXJpZ2h0LmpzIiwiZWFjaC5qcyIsImVzY2FwZS5qcyIsImV2ZW50LmpzIiwiZmluZC1pbmRleC5qcyIsImZpbmQtbGFzdC1pbmRleC5qcyIsImZpbmQtbGFzdC5qcyIsImZpbmQuanMiLCJmb3ItZWFjaC1yaWdodC5qcyIsImZvci1lYWNoLmpzIiwiZm9yLWluLXJpZ2h0LmpzIiwiZm9yLWluLmpzIiwiZm9yLW93bi1yaWdodC5qcyIsImZvci1vd24uanMiLCJmcmFnbWVudC5qcyIsImZyb20tcGFpcnMuanMiLCJnZXQtZWxlbWVudC1oLmpzIiwiZ2V0LWVsZW1lbnQtdy5qcyIsImdldC1wcm90b3R5cGUtb2YuanMiLCJnZXQtc3R5bGUuanMiLCJnZXQuanMiLCJoYXMuanMiLCJpZGVudGl0eS5qcyIsImluZGV4LW9mLmpzIiwiaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24uanMiLCJpbnRlcm5hbC9maXJzdC5qcyIsImludGVybmFsL21lbW9pemUuanMiLCJpbnRlcm5hbC90ZXh0LWNvbnRlbnQuanMiLCJpbnRlcm5hbC90eXBlLmpzIiwiaW50ZXJuYWwvdW5lc2NhcGUuanMiLCJpbnRlcm5hbC93b3Jkcy5qcyIsImludmVydC5qcyIsImlzLWFycmF5LWxpa2Utb2JqZWN0LmpzIiwiaXMtYXJyYXktbGlrZS5qcyIsImlzLWFycmF5LmpzIiwiaXMtZG9tLWVsZW1lbnQuanMiLCJpcy1maW5pdGUuanMiLCJpcy1rZXkuanMiLCJpcy1sZW5ndGguanMiLCJpcy1uYW4uanMiLCJpcy1udW1iZXIuanMiLCJpcy1vYmplY3QtbGlrZS5qcyIsImlzLW9iamVjdC5qcyIsImlzLXBsYWluLW9iamVjdC5qcyIsImlzLXByaW1pdGl2ZS5qcyIsImlzLXNhZmUtaW50ZWdlci5qcyIsImlzLXN0cmluZy5qcyIsImlzLXN5bWJvbC5qcyIsImlzLXdpbmRvdy1saWtlLmpzIiwiaXMtd2luZG93LmpzIiwiaXNzZXQuanMiLCJpdGVyYWJsZS5qcyIsIml0ZXJhdGVlLmpzIiwia2V5cy1pbi5qcyIsImtleXMuanMiLCJsYXN0LWluZGV4LW9mLmpzIiwibWF0Y2hlcy1wcm9wZXJ0eS5qcyIsIm1hdGNoZXMtc2VsZWN0b3IuanMiLCJtZXRob2Qtb2YuanMiLCJtZXRob2QuanMiLCJtaXhpbi5qcyIsIm5vb3AuanMiLCJub3cuanMiLCJvbmNlLmpzIiwicGFyc2UtaHRtbC5qcyIsInBlYWtvLmpzIiwicGxhY2Vob2xkZXIuanMiLCJwcm9wZXJ0eS1vZi5qcyIsInByb3BlcnR5LmpzIiwicHJvcHMuanMiLCJyYW5kb20uanMiLCJzZXQtcHJvdG90eXBlLW9mLmpzIiwic2V0LmpzIiwic3VwcG9ydC9zdXBwb3J0LWRlZmluZS1wcm9wZXJ0eS5qcyIsInN1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlLmpzIiwic3VwcG9ydC9zdXBwb3J0LWtleXMuanMiLCJ0ZW1wbGF0ZS5qcyIsInRpbWVyLmpzIiwidGltZXN0YW1wLmpzIiwidG8ta2V5LmpzIiwidG8tb2JqZWN0LmpzIiwidHJpbS1lbmQuanMiLCJ0cmltLXN0YXJ0LmpzIiwidHJpbS5qcyIsInR5cGUuanMiLCJ1bmVzY2FwZS5qcyIsInVwcGVyLWZpcnN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBET01XcmFwcGVyO1xuXG52YXIgX3RleHRDb250ZW50ICAgICAgICAgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvdGV4dC1jb250ZW50JyApO1xudmFyIF9maXJzdCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2ludGVybmFsL2ZpcnN0JyApO1xudmFyIF93b3JkcyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2ludGVybmFsL3dvcmRzJyApO1xuXG52YXIgc3VwcG9ydCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vc3VwcG9ydC9zdXBwb3J0LWdldC1hdHRyaWJ1dGUnICk7XG5cbnZhciBjcmVhdGVSZW1vdmVQcm9wZXJ0eSA9IHJlcXVpcmUoICcuLi9jcmVhdGUvY3JlYXRlLXJlbW92ZS1wcm9wJyApO1xuXG52YXIgYmFzZUZvckVhY2ggICAgICAgICAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1lYWNoJyApO1xudmFyIGJhc2VGb3JJbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItaW4nICk7XG5cbnZhciBpc0FycmF5TGlrZU9iamVjdCAgICA9IHJlcXVpcmUoICcuLi9pcy1hcnJheS1saWtlLW9iamVjdCcgKTtcbnZhciBpc0RPTUVsZW1lbnQgICAgICAgICA9IHJlcXVpcmUoICcuLi9pcy1kb20tZWxlbWVudCcgKTtcbnZhciBnZXRFbGVtZW50VyAgICAgICAgICA9IHJlcXVpcmUoICcuLi9nZXQtZWxlbWVudC13JyApO1xudmFyIGdldEVsZW1lbnRIICAgICAgICAgID0gcmVxdWlyZSggJy4uL2dldC1lbGVtZW50LWgnICk7XG52YXIgcGFyc2VIVE1MICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vcGFyc2UtaHRtbCcgKTtcbnZhciBhY2Nlc3MgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9hY2Nlc3MnICk7XG52YXIgZXZlbnQgICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vZXZlbnQnICk7XG5cbnZhciByc2VsZWN0b3IgPSAvXig/OiMoW1xcdy1dKyl8KFtcXHctXSspfFxcLihbXFx3LV0rKSkkLztcblxuZnVuY3Rpb24gRE9NV3JhcHBlciAoIHNlbGVjdG9yLCBjb250ZXh0ICkge1xuICB2YXIgbWF0Y2g7XG4gIHZhciBsaXN0O1xuICB2YXIgaTtcblxuICAvLyBfKCk7XG5cbiAgaWYgKCAhIHNlbGVjdG9yICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIF8oIHdpbmRvdyApO1xuXG4gIGlmICggaXNET01FbGVtZW50KCBzZWxlY3RvciApICkge1xuICAgIF9maXJzdCggdGhpcywgc2VsZWN0b3IgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgKSB7XG4gICAgaWYgKCB0eXBlb2YgY29udGV4dCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICBpZiAoICEgY29udGV4dC5fcGVha28gKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgRE9NV3JhcHBlciggY29udGV4dCApO1xuICAgICAgfVxuXG4gICAgICBpZiAoICEgY29udGV4dFsgMCBdICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQgPSBjb250ZXh0WyAwIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRleHQgPSBkb2N1bWVudDtcbiAgICB9XG5cbiAgICBpZiAoIHNlbGVjdG9yLmNoYXJBdCggMCApICE9PSAnPCcgKSB7XG4gICAgICBtYXRjaCA9IHJzZWxlY3Rvci5leGVjKCBzZWxlY3RvciApO1xuXG4gICAgICAvLyBfKCAnYSA+IGIgKyBjJyApO1xuICAgICAgLy8gXyggJyNpZCcsICcuYW5vdGhlci1lbGVtZW50JyApXG5cbiAgICAgIGlmICggISBtYXRjaCB8fCAhIGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgJiYgbWF0Y2hbIDEgXSB8fCAhIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJiBtYXRjaFsgMyBdICkge1xuICAgICAgICBpZiAoIG1hdGNoWyAxIF0gKSB7XG4gICAgICAgICAgbGlzdCA9IFsgY29udGV4dC5xdWVyeVNlbGVjdG9yKCBzZWxlY3RvciApIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGlzdCA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKTtcbiAgICAgICAgfVxuXG4gICAgICAvLyBfKCAnI2lkJyApO1xuXG4gICAgICB9IGVsc2UgaWYgKCBtYXRjaFsgMSBdICkge1xuICAgICAgICBpZiAoICggbGlzdCA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG1hdGNoWyAxIF0gKSApICkge1xuICAgICAgICAgIF9maXJzdCggdGhpcywgbGlzdCApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBfKCAndGFnJyApO1xuXG4gICAgICB9IGVsc2UgaWYgKCBtYXRjaFsgMiBdICkge1xuICAgICAgICBsaXN0ID0gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggbWF0Y2hbIDIgXSApO1xuXG4gICAgICAvLyBfKCAnLmNsYXNzJyApO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0ID0gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBtYXRjaFsgMyBdICk7XG4gICAgICB9XG5cbiAgICAvLyBfKCAnPGRpdj4nICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdCA9IHBhcnNlSFRNTCggc2VsZWN0b3IsIGNvbnRleHQgKTtcbiAgICB9XG5cbiAgLy8gXyggWyAuLi4gXSApO1xuXG4gIH0gZWxzZSBpZiAoIGlzQXJyYXlMaWtlT2JqZWN0KCBzZWxlY3RvciApICkge1xuICAgIGxpc3QgPSBzZWxlY3RvcjtcblxuICAvLyBfKCBmdW5jdGlvbiAoIF8gKSB7IC4uLiB9ICk7XG5cbiAgfSBlbHNlIGlmICggdHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybiBuZXcgRE9NV3JhcHBlciggZG9jdW1lbnQgKS5yZWFkeSggc2VsZWN0b3IgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoICdHb3QgdW5leHBlY3RlZCBzZWxlY3RvcjogJyArIHNlbGVjdG9yICsgJy4nICk7XG4gIH1cblxuICBpZiAoICEgbGlzdCApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLmxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuXG4gIGZvciAoIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIHRoaXNbIGkgXSA9IGxpc3RbIGkgXTtcbiAgfVxufVxuXG5ET01XcmFwcGVyLnByb3RvdHlwZSA9IHtcbiAgZWFjaDogICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2VhY2gnICksXG4gIGVuZDogICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9lbmQnICksXG4gIGVxOiAgICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9lcScgKSxcbiAgZmluZDogICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2ZpbmQnICksXG4gIGZpcnN0OiAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9maXJzdCcgKSxcbiAgZ2V0OiAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2dldCcgKSxcbiAgbGFzdDogICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2xhc3QnICksXG4gIG1hcDogICAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9tYXAnICksXG4gIHBhcmVudDogICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9wYXJlbnQnICksXG4gIHJlYWR5OiAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9yZWFkeScgKSxcbiAgcmVtb3ZlOiAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3JlbW92ZScgKSxcbiAgcmVtb3ZlQXR0cjogcmVxdWlyZSggJy4vcHJvdG90eXBlL3JlbW92ZUF0dHInICksXG4gIHJlbW92ZVByb3A6IHJlcXVpcmUoICcuL3Byb3RvdHlwZS9yZW1vdmVQcm9wJyApLFxuICBzdGFjazogICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvc3RhY2snICksXG4gIHN0eWxlOiAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9zdHlsZScgKSxcbiAgc3R5bGVzOiAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3N0eWxlcycgKSxcbiAgY3NzOiAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2NzcycgKSxcbiAgY29uc3RydWN0b3I6IERPTVdyYXBwZXIsXG4gIGxlbmd0aDogMCxcbiAgX3BlYWtvOiB0cnVlXG59O1xuXG5iYXNlRm9ySW4oIHtcbiAgdHJpZ2dlcjogJ3RyaWdnZXInLFxuICBvbmNlOiAgICAnb24nLFxuICBvZmY6ICAgICAnb2ZmJyxcbiAgb246ICAgICAgJ29uJ1xufSwgZnVuY3Rpb24gKCBuYW1lLCBtZXRob2ROYW1lICkge1xuICBET01XcmFwcGVyLnByb3RvdHlwZVsgbWV0aG9kTmFtZSBdID0gZnVuY3Rpb24gKCB0eXBlcywgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICkge1xuICAgIHZhciByZW1vdmVBbGwgPSBtZXRob2ROYW1lID09PSAnb2ZmJyAmJiAhIGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG9uY2UgPSBtZXRob2ROYW1lID09PSAnb25jZSc7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG4gICAgdmFyIGo7XG4gICAgdmFyIGw7XG5cbiAgICBpZiAoICEgcmVtb3ZlQWxsICkge1xuICAgICAgdHlwZXMgPSBfd29yZHMoIHR5cGVzICk7XG5cbiAgICAgIGlmICggISB0eXBlcy5sZW5ndGggKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsID0gdHlwZXMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIG9mZiggdHlwZXMsIGxpc3RlbmVyLCB1c2VDYXB0dXJlIClcbiAgICAvLyBvZmYoIHR5cGVzLCBsaXN0ZW5lciApXG5cbiAgICBpZiAoIG1ldGhvZE5hbWUgIT09ICd0cmlnZ2VyJyAmJiB0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBsaXN0ZW5lciAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIHVzZUNhcHR1cmUgPSBsaXN0ZW5lcjtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXIgPSBzZWxlY3RvcjtcbiAgICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiB1c2VDYXB0dXJlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHVzZUNhcHR1cmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGVsZW1lbnQgPSB0aGlzWyBpIF07XG5cbiAgICAgIGlmICggcmVtb3ZlQWxsICkge1xuICAgICAgICBldmVudC5vZmYoIGVsZW1lbnQgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoIGogPSAwOyBqIDwgbDsgKytqICkge1xuICAgICAgICAgIGV2ZW50WyBuYW1lIF0oIGVsZW1lbnQsIHR5cGVzWyBqIF0sIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSwgb25jZSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgaWYgKCBtZXRob2ROYW1lID09PSAnb25jZScgKSB7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIERPTVdyYXBwZXIucHJvdG90eXBlLm9uZSA9IGZ1bmN0aW9uIG9uZSAoKSB7XG4gICAgICBpZiAoIGNvdW50KysgPCAxICkge1xuICAgICAgICBjb25zb2xlLmxvZyggJ1wib25lXCIgaXMgZGVwcmVjYXRlZCBub3cuIFVzZSBcIm9uY2VcIiBpbnN0ZWFkLicgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub25jZS5hcHBseSggdGhpcywgW10uc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbiAgICB9O1xuICB9XG59LCB2b2lkIDAsIHRydWUsIFsgJ3RyaWdnZXInLCAnb25jZScsICdvZmYnLCAnb24nIF0gKTtcblxuYmFzZUZvckVhY2goIFtcbiAgJ2JsdXInLCAgICAgICAgJ2ZvY3VzJywgICAgICAgJ2ZvY3VzaW4nLFxuICAnZm9jdXNvdXQnLCAgICAncmVzaXplJywgICAgICAnc2Nyb2xsJyxcbiAgJ2NsaWNrJywgICAgICAgJ2RibGNsaWNrJywgICAgJ21vdXNlZG93bicsXG4gICdtb3VzZXVwJywgICAgICdtb3VzZW1vdmUnLCAgICdtb3VzZW92ZXInLFxuICAnbW91c2VvdXQnLCAgICAnbW91c2VlbnRlcicsICAnbW91c2VsZWF2ZScsXG4gICdjaGFuZ2UnLCAgICAgICdzZWxlY3QnLCAgICAgICdzdWJtaXQnLFxuICAna2V5ZG93bicsICAgICAna2V5cHJlc3MnLCAgICAna2V5dXAnLFxuICAnY29udGV4dG1lbnUnLCAndG91Y2hzdGFydCcsICAndG91Y2htb3ZlJyxcbiAgJ3RvdWNoZW5kJywgICAgJ3RvdWNoZW50ZXInLCAgJ3RvdWNobGVhdmUnLFxuICAndG91Y2hjYW5jZWwnLCAnbG9hZCdcbl0sIGZ1bmN0aW9uICggZXZlbnRUeXBlICkge1xuICBET01XcmFwcGVyLnByb3RvdHlwZVsgZXZlbnRUeXBlIF0gPSBmdW5jdGlvbiAoIGFyZyApIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGlmICggdHlwZW9mIGFyZyAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJldHVybiB0aGlzLnRyaWdnZXIoIGV2ZW50VHlwZSwgYXJnICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgdGhpcy5vbiggZXZlbnRUeXBlLCBhcmd1bWVudHNbIGkgXSwgZmFsc2UgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0sIHZvaWQgMCwgdHJ1ZSApO1xuXG5iYXNlRm9ySW4oIHtcbiAgZGlzYWJsZWQ6ICdkaXNhYmxlZCcsXG4gIGNoZWNrZWQ6ICAnY2hlY2tlZCcsXG4gIHZhbHVlOiAgICAndmFsdWUnLFxuICB0ZXh0OiAgICAgJ3RleHRDb250ZW50JyBpbiBkb2N1bWVudC5ib2R5ID8gJ3RleHRDb250ZW50JyA6IF90ZXh0Q29udGVudCwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZXJuYXJ5XG4gIGh0bWw6ICAgICAnaW5uZXJIVE1MJ1xufSwgZnVuY3Rpb24gKCBrZXksIG1ldGhvZE5hbWUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBtZXRob2ROYW1lIF0gPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICAgIHZhciBlbGVtZW50O1xuICAgIHZhciBpO1xuXG4gICAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgaWYgKCAhICggZWxlbWVudCA9IHRoaXNbIDAgXSApIHx8IGVsZW1lbnQubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50WyBrZXkgXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleSggZWxlbWVudCApO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgaWYgKCAoIGVsZW1lbnQgPSB0aGlzWyBpIF0gKS5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgZWxlbWVudFsga2V5IF0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGtleSggZWxlbWVudCwgdmFsdWUgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0sIHZvaWQgMCwgdHJ1ZSwgWyAnZGlzYWJsZWQnLCAnY2hlY2tlZCcsICd2YWx1ZScsICd0ZXh0JywgJ2h0bWwnIF0gKTtcblxuKCBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcm9wcyA9IHJlcXVpcmUoICcuLi9wcm9wcycgKTtcblxuICBmdW5jdGlvbiBfYXR0ciAoIGVsZW1lbnQsIGtleSwgdmFsdWUsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoIGVsZW1lbnQubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIHByb3BzWyBrZXkgXSB8fCAhIHN1cHBvcnQgKSB7XG4gICAgICByZXR1cm4gX3Byb3AoIGVsZW1lbnQsIHByb3BzWyBrZXkgXSB8fCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKTtcbiAgICB9XG5cbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCBrZXkgKTtcbiAgICB9XG5cbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgga2V5LCB2YWx1ZSApO1xuICB9XG5cbiAgRE9NV3JhcHBlci5wcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uIGF0dHIgKCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhY2Nlc3MoIHRoaXMsIGtleSwgdmFsdWUsIF9hdHRyICk7XG4gIH07XG5cbiAgZnVuY3Rpb24gX3Byb3AgKCBlbGVtZW50LCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKSB7XG4gICAgaWYgKCAhIGNoYWluYWJsZSApIHtcbiAgICAgIHJldHVybiBlbGVtZW50WyBrZXkgXTtcbiAgICB9XG5cbiAgICBlbGVtZW50WyBrZXkgXSA9IHZhbHVlO1xuICB9XG5cbiAgRE9NV3JhcHBlci5wcm90b3R5cGUucHJvcCA9IGZ1bmN0aW9uIHByb3AgKCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhY2Nlc3MoIHRoaXMsIGtleSwgdmFsdWUsIF9wcm9wICk7XG4gIH07XG59ICkoKTtcblxuKCBmdW5jdGlvbiAoKSB7XG4gIHZhciBfcGVha29JZCA9IDA7XG4gIHZhciBfZGF0YSA9IHt9O1xuXG4gIGZ1bmN0aW9uIF9hY2Nlc3NEYXRhICggZWxlbWVudCwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICkge1xuICAgIHZhciBhdHRyaWJ1dGVzO1xuICAgIHZhciBhdHRyaWJ1dGU7XG4gICAgdmFyIGRhdGE7XG4gICAgdmFyIGk7XG4gICAgdmFyIGw7XG5cbiAgICBpZiAoICEgZWxlbWVudC5fcGVha29JZCApIHtcbiAgICAgIGVsZW1lbnQuX3BlYWtvSWQgPSArK19wZWFrb0lkO1xuICAgIH1cblxuICAgIGlmICggISAoIGRhdGEgPSBfZGF0YVsgZWxlbWVudC5fcGVha29JZCBdICkgKSB7XG4gICAgICBkYXRhID0gX2RhdGFbIGVsZW1lbnQuX3BlYWtvSWQgXSA9IHt9OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuXG4gICAgICBmb3IgKCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzLCBpID0gMCwgbCA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgICBpZiAoICEgKCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzWyBpIF0gKS5ub2RlTmFtZS5pbmRleE9mKCAnZGF0YS0nICkgKSB7XG4gICAgICAgICAgZGF0YVsgYXR0cmlidXRlLm5vZGVOYW1lLnNsaWNlKCA1ICkgXSA9IGF0dHJpYnV0ZS5ub2RlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIGNoYWluYWJsZSApIHtcbiAgICAgIGRhdGFbIGtleSBdID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYXRhWyBrZXkgXTtcbiAgICB9XG4gIH1cblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24gZGF0YSAoIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWx1ZSwgX2FjY2Vzc0RhdGEgKTtcbiAgfTtcblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5yZW1vdmVEYXRhID0gY3JlYXRlUmVtb3ZlUHJvcGVydHkoIGZ1bmN0aW9uIF9yZW1vdmVEYXRhICggZWxlbWVudCwga2V5ICkge1xuICAgIGlmICggZWxlbWVudC5fcGVha29JZCApIHtcbiAgICAgIGRlbGV0ZSBfZGF0YVsgZWxlbWVudC5fcGVha29JZCBdWyBrZXkgXTtcbiAgICB9XG4gIH0gKTtcbn0gKSgpO1xuXG5iYXNlRm9ySW4oIHsgaGVpZ2h0OiBnZXRFbGVtZW50Vywgd2lkdGg6IGdldEVsZW1lbnRIIH0sIGZ1bmN0aW9uICggZ2V0LCBuYW1lICkge1xuICBET01XcmFwcGVyLnByb3RvdHlwZVsgbmFtZSBdID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICggdGhpc1sgMCBdICkge1xuICAgICAgcmV0dXJuIGdldCggdGhpc1sgMCBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59LCB2b2lkIDAsIHRydWUsIFsgJ2hlaWdodCcsICd3aWR0aCcgXSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoICcuLi8uLi9pcy1hcnJheScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjc3MgKCBrLCB2ICkge1xuICBpZiAoIGlzQXJyYXkoIGsgKSApIHtcbiAgICByZXR1cm4gdGhpcy5zdHlsZXMoIGsgKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLnN0eWxlKCBrLCB2ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVhY2ggKCBmdW4gKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuXG4gIGZvciAoIDsgaSA8IGxlbjsgKytpICkge1xuICAgIGlmICggZnVuLmNhbGwoIHRoaXNbIGkgXSwgaSwgdGhpc1sgaSBdICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuLicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmQgKCkge1xuICByZXR1cm4gdGhpcy5fcHJldmlvdXMgfHwgbmV3IERPTVdyYXBwZXIoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXEgKCBpbmRleCApIHtcbiAgcmV0dXJuIHRoaXMuc3RhY2soIHRoaXMuZ2V0KCBpbmRleCApICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuLicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5kICggc2VsZWN0b3IgKSB7XG4gIHJldHVybiBuZXcgRE9NV3JhcHBlciggc2VsZWN0b3IsIHRoaXMgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmlyc3QgKCkge1xuICByZXR1cm4gdGhpcy5lcSggMCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb25lID0gcmVxdWlyZSggJy4uLy4uL2Jhc2UvYmFzZS1jbG9uZS1hcnJheScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXQgKCBpbmRleCApIHtcbiAgaWYgKCB0eXBlb2YgaW5kZXggPT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBjbG9uZSggdGhpcyApO1xuICB9XG5cbiAgaWYgKCBpbmRleCA8IDAgKSB7XG4gICAgcmV0dXJuIHRoaXNbIHRoaXMubGVuZ3RoICsgaW5kZXggXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzWyBpbmRleCBdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsYXN0ICgpIHtcbiAgcmV0dXJuIHRoaXMuZXEoIC0xICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hcCAoIGZ1biApIHtcbiAgdmFyIGVscyA9IHRoaXMuc3RhY2soKTtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xuICB2YXIgZWw7XG4gIHZhciBpO1xuXG4gIGVscy5sZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICBmb3IgKCBpID0gMDsgaSA8IGxlbjsgKytpICkge1xuICAgIGVsc1sgaSBdID0gZnVuLmNhbGwoIGVsID0gdGhpc1sgaSBdLCBpLCBlbCApO1xuICB9XG5cbiAgcmV0dXJuIGVscztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuLi8uLi9iYXNlL2Jhc2UtaW5kZXgtb2YnICk7XG52YXIgbWF0Y2hlcyAgICAgPSByZXF1aXJlKCAnLi4vLi4vbWF0Y2hlcy1zZWxlY3RvcicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJlbnQgKCBzZWxlY3RvciApIHtcbiAgdmFyIGVsZW1lbnRzID0gdGhpcy5zdGFjaygpO1xuICB2YXIgZWxlbWVudDtcbiAgdmFyIHBhcmVudDtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgcGFyZW50ID0gKCBlbGVtZW50ID0gdGhpc1sgaSBdICkubm9kZVR5cGUgPT09IDEgJiYgZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgaWYgKCBwYXJlbnQgJiYgYmFzZUluZGV4T2YoIGVsZW1lbnRzLCBwYXJlbnQgKSA8IDAgJiYgKCAhIHNlbGVjdG9yIHx8IG1hdGNoZXMuY2FsbCggcGFyZW50LCBzZWxlY3RvciApICkgKSB7XG4gICAgICBlbGVtZW50c1sgZWxlbWVudHMubGVuZ3RoKysgXSA9IHBhcmVudDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudHM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXZlbnQgPSByZXF1aXJlKCAnLi4vLi4vZXZlbnQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVhZHkgKCBjYiApIHtcbiAgdmFyIGRvYyA9IHRoaXNbIDAgXTtcbiAgdmFyIHJlYWR5U3RhdGU7XG5cbiAgaWYgKCAhIGRvYyB8fCBkb2Mubm9kZVR5cGUgIT09IDkgKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWFkeVN0YXRlID0gZG9jLnJlYWR5U3RhdGU7XG5cbiAgaWYgKCBkb2MuYXR0YWNoRXZlbnQgPyByZWFkeVN0YXRlICE9PSAnY29tcGxldGUnIDogcmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgICBldmVudC5vbiggZG9jLCAnRE9NQ29udGVudExvYWRlZCcsIG51bGwsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNiKCk7XG4gICAgfSwgZmFsc2UsIHRydWUgKTtcbiAgfSBlbHNlIHtcbiAgICBjYigpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlbW92ZSAoKSB7XG4gIHZhciBpID0gdGhpcy5sZW5ndGggLSAxO1xuICB2YXIgcGFyZW50Tm9kZTtcbiAgdmFyIG5vZGVUeXBlO1xuXG4gIGZvciAoIDsgaSA+PSAwOyAtLWkgKSB7XG4gICAgbm9kZVR5cGUgPSB0aGlzWyBpIF0ubm9kZVR5cGU7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgYnJhY2UtcnVsZXMvYnJhY2Utb24tc2FtZS1saW5lXG4gICAgaWYgKCBub2RlVHlwZSAhPT0gMSAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDMgJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSA4ICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gOSAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDExICkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKCAoIHBhcmVudE5vZGUgPSB0aGlzWyBpIF0ucGFyZW50Tm9kZSApICkge1xuICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggdGhpc1sgaSBdICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuLi8uLi9jcmVhdGUvY3JlYXRlLXJlbW92ZS1wcm9wJyApKCByZXF1aXJlKCAnLi4vLi4vYmFzZS9iYXNlLXJlbW92ZS1hdHRyJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4uLy4uL2NyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AnICkoIGZ1bmN0aW9uIF9yZW1vdmVQcm9wICggZWxlbWVudCwga2V5ICkge1xuICBkZWxldGUgZWxlbWVudFsga2V5IF07XG59ICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZmlyc3QgICAgICAgID0gcmVxdWlyZSggJy4uLy4uL2ludGVybmFsL2ZpcnN0JyApO1xuXG52YXIgYmFzZUNvcHlBcnJheSA9IHJlcXVpcmUoICcuLi8uLi9iYXNlL2Jhc2UtY29weS1hcnJheScgKTtcblxudmFyIERPTVdyYXBwZXIgICAgPSByZXF1aXJlKCAnLi4nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RhY2sgKCBlbGVtZW50cyApIHtcbiAgdmFyIHdyYXBwZXIgPSBuZXcgRE9NV3JhcHBlcigpO1xuXG4gIGlmICggZWxlbWVudHMgKSB7XG4gICAgaWYgKCBlbGVtZW50cy5sZW5ndGggKSB7XG4gICAgICBiYXNlQ29weUFycmF5KCB3cmFwcGVyLCBlbGVtZW50cyApLmxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgX2ZpcnN0KCB3cmFwcGVyLCBlbGVtZW50cyApO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBwZXIuX3ByZXZpb3VzID0gd3JhcHBlci5wcmV2T2JqZWN0ID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cblxuICByZXR1cm4gd3JhcHBlcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi4vLi4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgY3NzTnVtYmVycyAgID0gcmVxdWlyZSggJy4uLy4uL2Nzcy1udW1iZXJzJyApO1xudmFyIGdldFN0eWxlICAgICA9IHJlcXVpcmUoICcuLi8uLi9nZXQtc3R5bGUnICk7XG52YXIgY2FtZWxpemUgICAgID0gcmVxdWlyZSggJy4uLy4uL2NhbWVsaXplJyApO1xudmFyIGFjY2VzcyAgICAgICA9IHJlcXVpcmUoICcuLi8uLi9hY2Nlc3MnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGUgKCBrZXksIHZhbCApIHtcbiAgdmFyIHB4ID0gJ2RvLW5vdC1hZGQnO1xuXG4gIC8vIENvbXB1dGUgcHggb3IgYWRkICdweCcgdG8gYHZhbGAgbm93LlxuXG4gIGlmICggdHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYgISBjc3NOdW1iZXJzWyBjYW1lbGl6ZSgga2V5ICkgXSApIHtcbiAgICBpZiAoIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICkge1xuICAgICAgdmFsICs9ICdweCc7XG4gICAgfSBlbHNlIGlmICggdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHB4ID0gJ2dvdC1hLWZ1bmN0aW9uJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoIGlzT2JqZWN0TGlrZSgga2V5ICkgKSB7XG4gICAgcHggPSAnZ290LWFuLW9iamVjdCc7XG4gIH1cblxuICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbCwgZnVuY3Rpb24gKCBlbGVtZW50LCBrZXksIHZhbCwgY2hhaW5hYmxlICkge1xuICAgIGlmICggZWxlbWVudC5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGtleSA9IGNhbWVsaXplKCBrZXkgKTtcblxuICAgIGlmICggISBjaGFpbmFibGUgKSB7XG4gICAgICByZXR1cm4gZ2V0U3R5bGUoIGVsZW1lbnQsIGtleSApO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgJiYgKCBweCA9PT0gJ2dvdC1hLWZ1bmN0aW9uJyB8fCBweCA9PT0gJ2dvdC1hbi1vYmplY3QnICYmICEgY3NzTnVtYmVyc1sga2V5IF0gKSApIHtcbiAgICAgIHZhbCArPSAncHgnO1xuICAgIH1cblxuICAgIGVsZW1lbnQuc3R5bGVbIGtleSBdID0gdmFsO1xuICB9ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FtZWxpemUgPSByZXF1aXJlKCAnLi4vLi4vY2FtZWxpemUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGVzICgga2V5cyApIHtcbiAgdmFyIGVsZW1lbnQgPSB0aGlzWyAwIF07XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGNvbXB1dGVkO1xuICB2YXIgdmFsdWU7XG4gIHZhciBrZXk7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IGtleXNbIGkgXTtcblxuICAgIGlmICggISBjb21wdXRlZCApIHtcbiAgICAgIHZhbHVlID0gZWxlbWVudC5zdHlsZVsgKCBrZXkgPSBjYW1lbGl6ZSgga2V5ICkgKSBdO1xuICAgIH1cblxuICAgIGlmICggISB2YWx1ZSApIHtcbiAgICAgIGlmICggISBjb21wdXRlZCApIHtcbiAgICAgICAgY29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlKCBlbGVtZW50ICk7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgga2V5ICk7XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2goIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VBc3NpZ24gPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtYXNzaWduJyApO1xuXG52YXIgaXNzZXQgICAgICA9IHJlcXVpcmUoICcuL2lzc2V0JyApO1xudmFyIGtleXMgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG52YXIgZGVmYXVsdHMgPSBbXG4gICdhbHRLZXknLCAgICAgICAgJ2J1YmJsZXMnLCAgICAgICAgJ2NhbmNlbGFibGUnLFxuICAnY2FuY2VsQnViYmxlJywgICdjaGFuZ2VkVG91Y2hlcycsICdjdHJsS2V5JyxcbiAgJ2N1cnJlbnRUYXJnZXQnLCAnZGV0YWlsJywgICAgICAgICAnZXZlbnRQaGFzZScsXG4gICdtZXRhS2V5JywgICAgICAgJ3BhZ2VYJywgICAgICAgICAgJ3BhZ2VZJyxcbiAgJ3NoaWZ0S2V5JywgICAgICAndmlldycsICAgICAgICAgICAnY2hhcicsXG4gICdjaGFyQ29kZScsICAgICAgJ2tleScsICAgICAgICAgICAgJ2tleUNvZGUnLFxuICAnYnV0dG9uJywgICAgICAgICdidXR0b25zJywgICAgICAgICdjbGllbnRYJyxcbiAgJ2NsaWVudFknLCAgICAgICAnb2Zmc2V0WCcsICAgICAgICAnb2Zmc2V0WScsXG4gICdwb2ludGVySWQnLCAgICAgJ3BvaW50ZXJUeXBlJywgICAgJ3JlbGF0ZWRUYXJnZXQnLFxuICAncmV0dXJuVmFsdWUnLCAgICdzY3JlZW5YJywgICAgICAgICdzY3JlZW5ZJyxcbiAgJ3RhcmdldFRvdWNoZXMnLCAndG9FbGVtZW50JywgICAgICAndG91Y2hlcycsXG4gICdpc1RydXN0ZWQnXG5dO1xuXG5mdW5jdGlvbiBFdmVudCAoIG9yaWdpbmFsLCBvcHRpb25zICkge1xuICB2YXIgaTtcbiAgdmFyIGs7XG5cbiAgaWYgKCB0eXBlb2Ygb3JpZ2luYWwgPT09ICdvYmplY3QnICkge1xuICAgIGZvciAoIGkgPSBkZWZhdWx0cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggaXNzZXQoIGsgPSBkZWZhdWx0c1sgaSBdLCBvcmlnaW5hbCApICkge1xuICAgICAgICB0aGlzWyBrIF0gPSBvcmlnaW5hbFsgayBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggb3JpZ2luYWwudGFyZ2V0ICkge1xuICAgICAgaWYgKCBvcmlnaW5hbC50YXJnZXQubm9kZVR5cGUgPT09IDMgKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWwudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsLnRhcmdldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9yaWdpbmFsID0gdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG4gICAgdGhpcy53aGljaCA9IEV2ZW50LndoaWNoKCBvcmlnaW5hbCApO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuaXNUcnVzdGVkID0gZmFsc2U7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBvcmlnaW5hbCA9PT0gJ3N0cmluZycgKSB7XG4gICAgdGhpcy50eXBlID0gb3JpZ2luYWw7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyApIHtcbiAgICB0aGlzLnR5cGUgPSBvcHRpb25zO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgKSB7XG4gICAgYmFzZUFzc2lnbiggdGhpcywgb3B0aW9ucywga2V5cyggb3B0aW9ucyApICk7XG4gIH1cbn1cblxuRXZlbnQucHJvdG90eXBlID0ge1xuICBwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24gcHJldmVudERlZmF1bHQgKCkge1xuICAgIGlmICggdGhpcy5vcmlnaW5hbCApIHtcbiAgICAgIGlmICggdGhpcy5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJldHVyblZhbHVlID0gdGhpcy5vcmlnaW5hbC5yZXR1cm5WYWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24gKCkge1xuICAgIGlmICggdGhpcy5vcmlnaW5hbCApIHtcbiAgICAgIGlmICggdGhpcy5vcmlnaW5hbC5zdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9yaWdpbmFsLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FuY2VsQnViYmxlID0gdGhpcy5vcmlnaW5hbC5jYW5jZWxCdWJibGU7XG4gICAgfVxuICB9LFxuXG4gIGNvbnN0cnVjdG9yOiBFdmVudFxufTtcblxuRXZlbnQud2hpY2ggPSBmdW5jdGlvbiB3aGljaCAoIGV2ZW50ICkge1xuICBpZiAoIGV2ZW50LndoaWNoICkge1xuICAgIHJldHVybiBldmVudC53aGljaDtcbiAgfVxuXG4gIGlmICggISBldmVudC50eXBlLmluZGV4T2YoICdrZXknICkgKSB7XG4gICAgaWYgKCB0eXBlb2YgZXZlbnQuY2hhckNvZGUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuIGV2ZW50LmNoYXJDb2RlO1xuICAgIH1cblxuICAgIHJldHVybiBldmVudC5rZXlDb2RlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgZXZlbnQuYnV0dG9uID09PSAndW5kZWZpbmVkJyB8fCAhIC9eKD86bW91c2V8cG9pbnRlcnxjb250ZXh0bWVudXxkcmFnfGRyb3ApfGNsaWNrLy50ZXN0KCBldmVudC50eXBlICkgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIGV2ZW50LmJ1dHRvbiAmIDEgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKCBldmVudC5idXR0b24gJiAyICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIGlmICggZXZlbnQuYnV0dG9uICYgNCApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG4gICAgcmV0dXJuIDI7XG4gIH1cblxuICByZXR1cm4gMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcblxuZnVuY3Rpb24gXyAoIHNlbGVjdG9yLCBjb250ZXh0ICkge1xuICByZXR1cm4gbmV3IERPTVdyYXBwZXIoIHNlbGVjdG9yLCBjb250ZXh0ICk7XG59XG5cbl8uZm4gPSBfLnByb3RvdHlwZSA9IERPTVdyYXBwZXIucHJvdG90eXBlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuXy5mbi5jb25zdHJ1Y3RvciA9IF87XG5cbm1vZHVsZS5leHBvcnRzID0gXztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi9ET01XcmFwcGVyJyApO1xudmFyIHR5cGUgICAgICAgPSByZXF1aXJlKCAnLi90eXBlJyApO1xudmFyIGtleXMgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5mdW5jdGlvbiBhY2Nlc3MgKCBvYmosIGtleSwgdmFsLCBmbiwgX25vQ2hlY2sgKSB7XG4gIHZhciBjaGFpbmFibGUgPSBfbm9DaGVjayB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbiAgdmFyIGJ1bGsgPSBrZXkgPT09IG51bGwgfHwga2V5ID09PSAndW5kZWZpbmVkJztcbiAgdmFyIGxlbiA9IG9iai5sZW5ndGg7XG4gIHZhciByYXcgPSBmYWxzZTtcbiAgdmFyIGU7XG4gIHZhciBrO1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgaWYgKCAhIF9ub0NoZWNrICYmIHR5cGUoIGtleSApID09PSAnb2JqZWN0JyApIHtcbiAgICBmb3IgKCBpID0gMCwgayA9IGtleXMoIGtleSApLCBsID0gay5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICBhY2Nlc3MoIG9iaiwga1sgaSBdLCBrZXlbIGtbIGkgXSBdLCBmbiwgdHJ1ZSApO1xuICAgIH1cblxuICAgIGNoYWluYWJsZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGlmICggdHlwZW9mIHZhbCAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJhdyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCBidWxrICkge1xuICAgICAgaWYgKCByYXcgKSB7XG4gICAgICAgIGZuLmNhbGwoIG9iaiwgdmFsICk7XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1bGsgPSBmbjtcblxuICAgICAgICBmbiA9IGZ1bmN0aW9uICggZSwga2V5LCB2YWwgKSB7XG4gICAgICAgICAgcmV0dXJuIGJ1bGsuY2FsbCggbmV3IERPTVdyYXBwZXIoIGUgKSwgdmFsICk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCBmbiApIHtcbiAgICAgIGZvciAoIGkgPSAwOyBpIDwgbGVuOyArK2kgKSB7XG4gICAgICAgIGUgPSBvYmpbIGkgXTtcblxuICAgICAgICBpZiAoIHJhdyApIHtcbiAgICAgICAgICBmbiggZSwga2V5LCB2YWwsIHRydWUgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmbiggZSwga2V5LCB2YWwuY2FsbCggZSwgaSwgZm4oIGUsIGtleSApICksIHRydWUgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNoYWluYWJsZSA9IHRydWU7XG4gIH1cblxuICBpZiAoIGNoYWluYWJsZSApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgaWYgKCBidWxrICkge1xuICAgIHJldHVybiBmbi5jYWxsKCBvYmogKTtcbiAgfVxuXG4gIGlmICggbGVuICkge1xuICAgIHJldHVybiBmbiggb2JqWyAwIF0sIGtleSApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWNjZXNzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoZWFkZXJzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGltZW91dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGhvZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogQSByZXF1ZXN0IGhlYWRlcnMuXG4gICAqL1xuICBoZWFkZXJzOiB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnXG4gIH0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBmb3IgY2FuY2VsIGEgcmVxdWVzdC5cbiAgICovXG4gIHRpbWVvdXQ6IDEwMDAgKiA2MCxcblxuICAvKipcbiAgICogQSByZXF1ZXN0IG1ldGhvZDogJ0dFVCcsICdQT1NUJyAob3RoZXJzIGFyZSBpZ25vcmVkLCBpbnN0ZWFkLCAnR0VUJyB3aWxsIGJlIHVzZWQpLlxuICAgKi9cbiAgbWV0aG9kOiAnR0VUJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKCB0eXBlb2YgcXMgPT09ICd1bmRlZmluZWQnICkge1xuICB2YXIgcXM7XG5cbiAgdHJ5IHtcbiAgICBxcyA9IHJlcXVpcmUoICdxcycgKTtcbiAgfSBjYXRjaCAoIGVycm9yICkge31cbn1cblxudmFyIF9vcHRpb25zID0gcmVxdWlyZSggJy4vYWpheC1vcHRpb25zJyApO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSggJy4vZGVmYXVsdHMnICk7XG52YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcm9zcy1icm93c2VyIFhNTEh0dHBSZXF1ZXN0OiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjU1NzI2OFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSFRUUFJlcXVlc3QgKCkge1xuICB2YXIgSFRUUEZhY3RvcmllczsgdmFyIGk7XG5cbiAgSFRUUEZhY3RvcmllcyA9IFtcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMy5YTUxIVFRQJyApO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNc3htbDIuWE1MSFRUUC42LjAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMi5YTUxIVFRQLjMuMCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwyLlhNTEhUVFAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01pY3Jvc29mdC5YTUxIVFRQJyApO1xuICAgIH1cbiAgXTtcblxuICBmb3IgKCBpID0gMDsgaSA8IEhUVFBGYWN0b3JpZXMubGVuZ3RoOyArK2kgKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoIGNyZWF0ZUhUVFBSZXF1ZXN0ID0gSFRUUEZhY3Rvcmllc1sgaSBdICkoKTtcbiAgICB9IGNhdGNoICggZXggKSB7fVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoICdjYW5ub3QgY3JlYXRlIFhNTEh0dHBSZXF1ZXN0IG9iamVjdCcgKTtcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLmFqYXhcbiAqIEBwYXJhbSAge3N0cmluZ3xvYmplY3R9IHBhdGggICAgICAgICAgICAgIEEgVVJMIG9yIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICBbb3B0aW9uc10gICAgICAgICBBbiBvcHRpb25zLlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgW29wdGlvbnMucGF0aF0gICAgQSBVUkwuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICBbb3B0aW9ucy5tZXRob2RdICBBIHJlcXVlc3QgbWV0aG9kLiBJZiBubyBwcmVzZW50IEdFVCBvciBQT1NUIHdpbGwgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQuXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICAgICBbb3B0aW9ucy5hc3luY10gICBEZWZhdWx0IHRvIGB0cnVlYCB3aGVuIG9wdGlvbnMgc3BlY2lmaWVkLCBvciBgZmFsc2VgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG5vIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICBbb3B0aW9ucy5zdWNjZXNzXSBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgc2VydmVyIHJlc3BvbmQgd2l0aCAyeHggc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLlxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgW29wdGlvbnMuZXJyb3JdICAgV2lsbCBiZSBjYWxsZWQgd2hlbiBhIHNlcnZlciByZXNwb25kIHdpdGggb3RoZXIgc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlIG9yIGFuIGVycm9yIG9jY3VycyB3aGlsZSBwYXJzaW5nIHJlc3BvbnNlLlxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgICAgICAgICAgUmV0dXJucyBhIHJlc3BvbnNlIGRhdGEgaWYgYSByZXF1ZXN0IHdhcyBzeW5jaHJvbm91c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcndpc2UgYG51bGxgLlxuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0PC9jYXB0aW9uPlxuICogdmFyIGRhdGEgPSBhamF4KCcuL2RhdGEuanNvbicpO1xuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0LCB3aXRoIGNhbGxiYWNrczwvY2FwdGlvbj5cbiAqIHZhciBkYXRhID0gYWpheCgnLi9kYXRhLmpzb24nLCB7XG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGFzeW5jOiAgIGZhbHNlXG4gKiB9KTtcbiAqXG4gKiBmdW5jdGlvbiBzdWNjZXNzKHNhbWVEYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKHNhbWVEYXRhKTtcbiAqIH1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPkFzeW5jaHJvbm91cyBQT1NUIHJlcXVlc3Q8L2NhcHRpb24+XG4gKiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gKiAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSB8fCB0aGlzLnN0YXR1cyArICc6ICcgKyB0aGlzLnN0YXR1c1RleHQpO1xuICogfVxuICpcbiAqIHZhciBoZWFkZXJzID0ge1xuICogICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gKiB9O1xuICpcbiAqIHZhciBkYXRhID0ge1xuICogICB1c2VybmFtZTogZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnVzZXJuYW1lLnZhbHVlLFxuICogICBzZXg6ICAgICAgZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnNleC52YWx1ZVxuICogfVxuICpcbiAqIGFqYXgoJy9hcGkvc2lnbnVwLz9zdGVwPTAnLCB7XG4gKiAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGVycm9yOiAgIGVycm9yLFxuICogICBkYXRhOiAgICBkYXRhXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gYWpheCAoIHBhdGgsIG9wdGlvbnMgKSB7XG4gIHZhciB0aW1lb3V0SWQgPSBudWxsO1xuICB2YXIgZGF0YSA9IG51bGw7XG4gIHZhciB4aHIgPSBjcmVhdGVIVFRQUmVxdWVzdCgpO1xuICB2YXIgcmVxQ29udGVudFR5cGU7XG4gIHZhciBtZXRob2Q7XG4gIHZhciBhc3luYztcbiAgdmFyIG5hbWU7XG5cbiAgLy8gXy5hamF4KCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIGlmICggdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnICkge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0cyggX29wdGlvbnMsIHBhdGggKTtcbiAgICBhc3luYyA9ICEgKCAnYXN5bmMnIGluIG9wdGlvbnMgKSB8fCBvcHRpb25zLmFzeW5jO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGg7XG5cbiAgLy8gXy5hamF4KCBwYXRoICk7XG4gIC8vIGFzeW5jID0gZmFsc2VcbiAgfSBlbHNlIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMgPT09IG51bGwgKSB7XG4gICAgb3B0aW9ucyA9IF9vcHRpb25zO1xuICAgIGFzeW5jID0gZmFsc2U7XG5cbiAgLy8gXy5hamF4KCBwYXRoLCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzKCBfb3B0aW9ucywgb3B0aW9ucyApO1xuICAgIGFzeW5jID0gISAoICdhc3luYycgaW4gb3B0aW9ucyApIHx8IG9wdGlvbnMuYXN5bmM7XG4gIH1cblxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXNDb250ZW50VHlwZTtcbiAgICB2YXIgc3RhdHVzO1xuICAgIHZhciBvYmplY3Q7XG4gICAgdmFyIGVycm9yO1xuXG4gICAgaWYgKCB0aGlzLnJlYWR5U3RhdGUgIT09IDQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3RhdHVzID0gdGhpcy5zdGF0dXMgPT09IDEyMjMgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZXJuYXJ5XG4gICAgICA/IDIwNFxuICAgICAgOiB0aGlzLnN0YXR1cztcblxuICAgIHJlc0NvbnRlbnRUeXBlID0gdGhpcy5nZXRSZXNwb25zZUhlYWRlciggJ2NvbnRlbnQtdHlwZScgKTtcblxuICAgIG9iamVjdCA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgcGF0aDogcGF0aFxuICAgIH07XG5cbiAgICBkYXRhID0gdGhpcy5yZXNwb25zZVRleHQ7XG5cbiAgICBpZiAoIHJlc0NvbnRlbnRUeXBlICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCAhIHJlc0NvbnRlbnRUeXBlLmluZGV4T2YoICdhcHBsaWNhdGlvbi9qc29uJyApICkge1xuICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgICAgIH0gZWxzZSBpZiAoICEgcmVzQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgKSApIHtcbiAgICAgICAgICBkYXRhID0gcXMucGFyc2UoIGRhdGEgKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIF9lcnJvciApIHtcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggISBlcnJvciAmJiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCApIHtcbiAgICAgIGlmICggdGltZW91dElkICE9PSBudWxsICkge1xuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJZCApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9wdGlvbnMuc3VjY2VzcyApIHtcbiAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmNhbGwoIHRoaXMsIGRhdGEsIG9iamVjdCApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIG9wdGlvbnMuZXJyb3IgKSB7XG4gICAgICBvcHRpb25zLmVycm9yLmNhbGwoIHRoaXMsIGRhdGEsIG9iamVjdCApO1xuICAgIH1cbiAgfTtcblxuICBtZXRob2QgPSBvcHRpb25zLm1ldGhvZDtcblxuICBpZiAoIHR5cGVvZiBtZXRob2QgPT09ICd1bmRlZmluZWQnICkge1xuICAgIG1ldGhvZCA9ICdkYXRhJyBpbiBvcHRpb25zIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICAgICAgPyAnUE9TVCdcbiAgICAgIDogJ0dFVCc7XG4gIH1cblxuICB4aHIub3BlbiggbWV0aG9kLCBwYXRoLCBhc3luYyApO1xuXG4gIGlmICggb3B0aW9ucy5oZWFkZXJzICkge1xuICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucy5oZWFkZXJzICkge1xuICAgICAgaWYgKCAhIGhhc093blByb3BlcnR5LmNhbGwoIG9wdGlvbnMuaGVhZGVycywgbmFtZSApICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnICkge1xuICAgICAgICByZXFDb250ZW50VHlwZSA9IG9wdGlvbnMuaGVhZGVyc1sgbmFtZSBdO1xuICAgICAgfVxuXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggbmFtZSwgb3B0aW9ucy5oZWFkZXJzWyBuYW1lIF0gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGFzeW5jICYmIHR5cGVvZiBvcHRpb25zLnRpbWVvdXQgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMudGltZW91dCAhPT0gbnVsbCApIHtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICB4aHIuYWJvcnQoKTtcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQgKTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHJlcUNvbnRlbnRUeXBlICE9PSAndW5kZWZpbmVkJyAmJiByZXFDb250ZW50VHlwZSAhPT0gbnVsbCAmJiAnZGF0YScgaW4gb3B0aW9ucyApIHtcbiAgICBpZiAoICEgcmVxQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL2pzb24nICkgKSB7XG4gICAgICB4aHIuc2VuZCggSlNPTi5zdHJpbmdpZnkoIG9wdGlvbnMuZGF0YSApICk7XG4gICAgfSBlbHNlIGlmICggISByZXFDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyApICkge1xuICAgICAgeGhyLnNlbmQoIHFzLnN0cmluZ2lmeSggb3B0aW9ucy5kYXRhICkgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLnNlbmQoIG9wdGlvbnMuZGF0YSApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWFzc2lnbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1hc3NpZ24nICkoIHJlcXVpcmUoICcuL2tleXMnICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlQXNzaWduICggb2JqLCBzcmMsIGsgKSB7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGsubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIG9ialsga1sgaSBdIF0gPSBzcmNbIGtbIGkgXSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUNsb25lQXJyYXkgKCBpdGVyYWJsZSApIHtcbiAgdmFyIGkgPSBpdGVyYWJsZS5sZW5ndGg7XG4gIHZhciBjbG9uZSA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICBpZiAoIGlzc2V0KCBpLCBpdGVyYWJsZSApICkge1xuICAgICAgY2xvbmVbIGkgXSA9IGl0ZXJhYmxlWyBpIF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNsb25lO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHRhcmdldCwgc291cmNlICkge1xuICBmb3IgKCB2YXIgaSA9IHNvdXJjZS5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICB0YXJnZXRbIGkgXSA9IHNvdXJjZVsgaSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbnZhciBkZWZpbmVHZXR0ZXIgPSBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG52YXIgZGVmaW5lU2V0dGVyID0gT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZVNldHRlcl9fO1xuXG5mdW5jdGlvbiBiYXNlRGVmaW5lUHJvcGVydHkgKCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApIHtcbiAgdmFyIGhhc0dldHRlciA9IGlzc2V0KCAnZ2V0JywgZGVzY3JpcHRvciApO1xuICB2YXIgaGFzU2V0dGVyID0gaXNzZXQoICdzZXQnLCBkZXNjcmlwdG9yICk7XG4gIHZhciBnZXQ7XG4gIHZhciBzZXQ7XG5cbiAgaWYgKCBoYXNHZXR0ZXIgfHwgaGFzU2V0dGVyICkge1xuICAgIGlmICggaGFzR2V0dGVyICYmIHR5cGVvZiggZ2V0ID0gZGVzY3JpcHRvci5nZXQgKSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ0dldHRlciBtdXN0IGJlIGEgZnVuY3Rpb246ICcgKyBnZXQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGhhc1NldHRlciAmJiB0eXBlb2YoIHNldCA9IGRlc2NyaXB0b3Iuc2V0ICkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uOiAnICsgc2V0ICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggJ3dyaXRhYmxlJywgZGVzY3JpcHRvciApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnSW52YWxpZCBwcm9wZXJ0eSBkZXNjcmlwdG9yLiBDYW5ub3QgYm90aCBzcGVjaWZ5IGFjY2Vzc29ycyBhbmQgYSB2YWx1ZSBvciB3cml0YWJsZSBhdHRyaWJ1dGUnICk7XG4gICAgfVxuXG4gICAgaWYgKCBkZWZpbmVHZXR0ZXIgKSB7XG4gICAgICBpZiAoIGhhc0dldHRlciApIHtcbiAgICAgICAgZGVmaW5lR2V0dGVyLmNhbGwoIG9iamVjdCwga2V5LCBnZXQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBoYXNTZXR0ZXIgKSB7XG4gICAgICAgIGRlZmluZVNldHRlci5jYWxsKCBvYmplY3QsIGtleSwgc2V0ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKCAnQ2Fubm90IGRlZmluZSBhIGdldHRlciBvciBzZXR0ZXInICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc3NldCggJ3ZhbHVlJywgZGVzY3JpcHRvciApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICB9IGVsc2UgaWYgKCAhIGlzc2V0KCBrZXksIG9iamVjdCApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSB2b2lkIDA7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VEZWZpbmVQcm9wZXJ0eTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRXhlYyAoIHJlZ2V4cCwgc3RyaW5nICkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciB2YWx1ZTtcblxuICByZWdleHAubGFzdEluZGV4ID0gMDtcblxuICB3aGlsZSAoICggdmFsdWUgPSByZWdleHAuZXhlYyggc3RyaW5nICkgKSApIHtcbiAgICByZXN1bHQucHVzaCggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEl0ZXJhdGVlID0gcmVxdWlyZSggJy4uL2NhbGwtaXRlcmF0ZWUnICk7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VGb3JFYWNoICggYXJyLCBmbiwgY3R4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciBpO1xuICB2YXIgajtcblxuICBmb3IgKCBpID0gLTEsIGogPSBhcnIubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBpZHggPSBqO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZHggPSArK2k7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggaWR4LCBhcnIgKSAmJiBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIGFyclsgaWR4IF0sIGlkeCwgYXJyICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFycjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRm9ySW4gKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCwga2V5cyApIHtcbiAgdmFyIGtleTtcbiAgdmFyIGk7XG4gIHZhciBqO1xuXG4gIGZvciAoIGkgPSAtMSwgaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBrZXkgPSBrZXlzWyBqIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IGtleXNbICsraSBdO1xuICAgIH1cblxuICAgIGlmICggY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCBvYmpbIGtleSBdLCBrZXksIG9iaiApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUdldCAoIG9iaiwgcGF0aCwgb2ZmICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGggLSBvZmY7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlSGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGg7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZVRvSW5kZXggPSByZXF1aXJlKCAnLi9iYXNlLXRvLWluZGV4JyApO1xuXG52YXIgaW5kZXhPZiAgICAgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZjtcbnZhciBsYXN0SW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcblxuZnVuY3Rpb24gYmFzZUluZGV4T2YgKCBhcnIsIHNlYXJjaCwgZnJvbUluZGV4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuICB2YXIgajtcbiAgdmFyIGw7XG5cbiAgLy8gdXNlIHRoZSBuYXRpdmUgZnVuY3Rpb24gaWYgaXQgaXMgc3VwcG9ydGVkIGFuZCB0aGUgc2VhcmNoIGlzIG5vdCBuYW4uXG5cbiAgaWYgKCBzZWFyY2ggPT09IHNlYXJjaCAmJiAoIGlkeCA9IGZyb21SaWdodCA/IGxhc3RJbmRleE9mIDogaW5kZXhPZiApICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgICByZXR1cm4gaWR4LmNhbGwoIGFyciwgc2VhcmNoLCBmcm9tSW5kZXggKTtcbiAgfVxuXG4gIGwgPSBhcnIubGVuZ3RoO1xuXG4gIGlmICggISBsICkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGogPSBsIC0gMTtcblxuICBpZiAoIHR5cGVvZiBmcm9tSW5kZXggIT09ICd1bmRlZmluZWQnICkge1xuICAgIGZyb21JbmRleCA9IGJhc2VUb0luZGV4KCBmcm9tSW5kZXgsIGwgKTtcblxuICAgIGlmICggZnJvbVJpZ2h0ICkge1xuICAgICAgaiA9IE1hdGgubWluKCBqLCBmcm9tSW5kZXggKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaiA9IE1hdGgubWF4KCAwLCBmcm9tSW5kZXggKTtcbiAgICB9XG5cbiAgICBpID0gaiAtIDE7XG4gIH0gZWxzZSB7XG4gICAgaSA9IC0xO1xuICB9XG5cbiAgZm9yICggOyBqID49IDA7IC0taiApIHtcbiAgICBpZiAoIGZyb21SaWdodCApIHtcbiAgICAgIGlkeCA9IGo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkeCA9ICsraTtcbiAgICB9XG5cbiAgICB2YWwgPSBhcnJbIGlkeCBdO1xuXG4gICAgaWYgKCB2YWwgPT09IHNlYXJjaCB8fCBzZWFyY2ggIT09IHNlYXJjaCAmJiB2YWwgIT09IHZhbCApIHtcbiAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0ID0gcmVxdWlyZSggJy4vYmFzZS1nZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUludm9rZSAoIG9iamVjdCwgcGF0aCwgYXJncyApIHtcbiAgaWYgKCBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCBwYXRoLmxlbmd0aCA8PSAxICkge1xuICAgICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgMCBdIF0uYXBwbHkoIG9iamVjdCwgYXJncyApO1xuICAgIH1cblxuICAgIGlmICggKCBvYmplY3QgPSBnZXQoIG9iamVjdCwgcGF0aCwgMSApICkgKSB7XG4gICAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyBwYXRoLmxlbmd0aCAtIDEgXSBdLmFwcGx5KCBvYmplY3QsIGFyZ3MgKTtcbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0ICAgICA9IHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQta2V5cycgKTtcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4vYmFzZS1pbmRleC1vZicgKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuaWYgKCBzdXBwb3J0ID09PSAnaGFzLWEtYnVnJyApIHtcbiAgdmFyIF9rZXlzID0gW1xuICAgICd0b1N0cmluZycsXG4gICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAndmFsdWVPZicsXG4gICAgJ2hhc093blByb3BlcnR5JyxcbiAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgICAnY29uc3RydWN0b3InXG4gIF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUtleXMgKCBvYmplY3QgKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciBrZXk7XG4gIHZhciBpO1xuXG4gIGZvciAoIGtleSBpbiBvYmplY3QgKSB7XG4gICAgaWYgKCBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3QsIGtleSApICkge1xuICAgICAga2V5cy5wdXNoKCBrZXkgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIHN1cHBvcnQgPT09ICdoYXMtYS1idWcnICkge1xuICAgIGZvciAoIGkgPSBfa2V5cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggYmFzZUluZGV4T2YoIGtleXMsIF9rZXlzWyBpIF0gKSA8IDAgJiYgaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0LCBfa2V5c1sgaSBdICkgKSB7XG4gICAgICAgIGtleXMucHVzaCggX2tleXNbIGkgXSApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldCA9IHJlcXVpcmUoICcuL2Jhc2UtZ2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VQcm9wZXJ0eSAoIG9iamVjdCwgcGF0aCApIHtcbiAgaWYgKCBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCBwYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICByZXR1cm4gZ2V0KCBvYmplY3QsIHBhdGgsIDAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyAwIF0gXTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlUmFuZG9tICggbG93ZXIsIHVwcGVyICkge1xuICByZXR1cm4gbG93ZXIgKyBNYXRoLnJhbmRvbSgpICogKCB1cHBlciAtIGxvd2VyICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvcHMgPSByZXF1aXJlKCAnLi4vcHJvcHMnICk7XG5cbmlmICggcmVxdWlyZSggJy4uL3N1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlJyApICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9yZW1vdmVBdHRyICggZWxlbWVudCwga2V5ICkge1xuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCBrZXkgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3JlbW92ZUF0dHIgKCBlbGVtZW50LCBrZXkgKSB7XG4gICAgZGVsZXRlIGVsZW1lbnRbIHByb3BzWyBrZXkgXSB8fCBrZXkgXTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzc2V0ID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VTZXQgKCBvYmosIHBhdGgsIHZhbCApIHtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IHBhdGgubGVuZ3RoO1xuICB2YXIga2V5O1xuXG4gIGZvciAoIDsgaSA8IGw7ICsraSApIHtcbiAgICBrZXkgPSBwYXRoWyBpIF07XG5cbiAgICBpZiAoIGkgPT09IGwgLSAxICkge1xuICAgICAgb2JqID0gb2JqWyBrZXkgXSA9IHZhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB9IGVsc2UgaWYgKCBpc3NldCgga2V5LCBvYmogKSApIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF0gPSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlVG9JbmRleCAoIHYsIGwgKSB7XG4gIGlmICggISBsIHx8ICEgdiApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmICggdiA8IDAgKSB7XG4gICAgdiArPSBsO1xuICB9XG5cbiAgcmV0dXJuIHYgfHwgMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVZhbHVlcyAoIG9iamVjdCwga2V5cyApIHtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICB2YWx1ZXNbIGkgXSA9IG9iamVjdFsga2V5c1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL2ludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xudmFyIGRlZmF1bHRUbyA9IHJlcXVpcmUoICcuL2RlZmF1bHQtdG8nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVmb3JlICggbiwgZm4gKSB7XG4gIHZhciB2YWx1ZTtcblxuICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICB0aHJvdyBfQXJndW1lbnRFeGNlcHRpb24oIGZuLCAnYSBmdW5jdGlvbicgKTtcbiAgfVxuXG4gIG4gPSBkZWZhdWx0VG8oIG4sIDEgKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICggLS1uID49IDAgKSB7XG4gICAgICB2YWx1ZSA9IGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbnZhciBwbGFjZWhvbGRlciAgICAgICAgPSByZXF1aXJlKCAnLi9wbGFjZWhvbGRlcicgKTtcbnZhciBjb25zdGFudHMgICAgICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICk7XG52YXIgaW5kZXhPZiAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaW5kZXgtb2YnICk7XG5cbi8vIEZ1bmN0aW9uOjpiaW5kKCkgcG9seWZpbGwuXG5cbnZhciBfYmluZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIHx8IGZ1bmN0aW9uIGJpbmQgKCBjICkge1xuICB2YXIgZiA9IHRoaXM7XG4gIHZhciBhO1xuXG4gIGlmICggYXJndW1lbnRzLmxlbmd0aCA8PSAyICkge1xuICAgIHJldHVybiBmdW5jdGlvbiBib3VuZCAoKSB7XG4gICAgICByZXR1cm4gZi5hcHBseSggYywgYXJndW1lbnRzICk7XG4gICAgfTtcbiAgfVxuXG4gIGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kICgpIHtcbiAgICByZXR1cm4gZi5hcHBseSggYywgYS5jb25jYXQoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApICk7XG4gIH07XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBwIFRoZSBwYXJ0aWFsIGFyZ3VtZW50cy5cbiAqIEBwYXJhbSB7QXJyYXl9IGEgVGhlIGFyZ3VtZW50cy5cbiAqIEByZXR1cm5zIHtBcnJheX0gQSBwcm9jZXNzZWQgYXJndW1lbnRzLlxuICovXG5mdW5jdGlvbiBwcm9jZXNzICggcCwgYSApIHtcbiAgdmFyIHIgPSBbXTtcbiAgdmFyIGogPSAtMTtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gcC5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgaWYgKCBwWyBpIF0gPT09IHBsYWNlaG9sZGVyIHx8IHBbIGkgXSA9PT0gY29uc3RhbnRzLlBMQUNFSE9MREVSICkge1xuICAgICAgci5wdXNoKCBhWyArK2ogXSApO1xuICAgIH0gZWxzZSB7XG4gICAgICByLnB1c2goIHBbIGkgXSApO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoIGwgPSBhLmxlbmd0aDsgaiA8IGw7ICsraiApIHtcbiAgICByLnB1c2goIGFbIGkgXSApO1xuICB9XG5cbiAgcmV0dXJuIHI7XG59XG5cbi8qKlxuICogQHBhcmFtICB7ZnVuY3Rpb259IGYgVGhlIHRhcmdldCBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBib3VuZC5cbiAqIEBwYXJhbSAgeyp9ICAgICAgICBjIFRoZSBuZXcgY29udGV4dCBmb3IgdGhlIHRhcmdldCBmdW5jdGlvbi5cbiAqIEBwYXJhbSAgey4uLip9ICAgICBwIFRoZSBwYXJ0aWFsIGFyZ3VtZW50cywgbWF5IGNvbnRhaW4gXy5wbGFjZWhvbGRlci5cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICogQGV4YW1wbGVcbiAqIHZhciBfICAgID0gcmVxdWlyZSggJ3BlYWtvL3BsYWNlaG9sZGVyJyApO1xuICogdmFyIGJpbmQgPSByZXF1aXJlKCAncGVha28vYmluZCcgKTtcblxuICogZnVuY3Rpb24gd2VpcmRGdW5jdGlvbiAoIHgsIHkgKSB7XG4gKiAgIHJldHVybiB0aGlzWyB4IF0gKyB0aGlzWyB5IF07XG4gKiB9XG4gKlxuICogdmFyIGNvbnRleHQgPSB7XG4gKiAgIHg6IDQyLFxuICogICB5OiAxXG4gKiB9O1xuICpcbiAqIHZhciBib3VuZEZ1bmN0aW9uID0gYmluZCggd2VpcmRGdW5jdGlvbiwgY29udGV4dCwgXywgJ3knICk7XG4gKlxuICogYm91bmRGdW5jdGlvbiggJ3gnICk7IC8vIC0+IDQzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZCAoIGYsIGMgKSB7XG4gIHZhciBwO1xuXG4gIGlmICggdHlwZW9mIGYgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgdGhyb3cgX0FyZ3VtZW50RXhjZXB0aW9uKCBmLCAnYSBmdW5jdGlvbicgKTtcbiAgfVxuXG4gIC8vIG5vIHBhcnRpYWwgYXJndW1lbnRzIHdlcmUgcHJvdmlkZWRcblxuICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPD0gMiApIHtcbiAgICByZXR1cm4gX2JpbmQuY2FsbCggZiwgYyApO1xuICB9XG5cbiAgcCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDIgKTtcblxuICAvLyBubyBwbGFjZWhvbGRlcnMgaW4gdGhlIHBhcnRpYWwgYXJndW1lbnRzXG5cbiAgaWYgKCBpbmRleE9mKCBwLCBwbGFjZWhvbGRlciApIDwgMCAmJiBpbmRleE9mKCBwLCBjb25zdGFudHMuUExBQ0VIT0xERVIgKSA8IDAgKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsLmFwcGx5KCBfYmluZCwgYXJndW1lbnRzICk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gYm91bmQgKCkge1xuICAgIHJldHVybiBmLmFwcGx5KCBjLCBwcm9jZXNzKCBwLCBhcmd1bWVudHMgKSApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYWxsSXRlcmF0ZWUgKCBmbiwgY3R4LCB2YWwsIGtleSwgb2JqICkge1xuICBpZiAoIHR5cGVvZiBjdHggPT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBmbiggdmFsLCBrZXksIG9iaiApO1xuICB9XG5cbiAgcmV0dXJuIGZuLmNhbGwoIGN0eCwgdmFsLCBrZXksIG9iaiApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHVwcGVyRmlyc3QgPSByZXF1aXJlKCAnLi91cHBlci1maXJzdCcgKTtcblxuLy8gY2FtZWxpemUoICdiYWNrZ3JvdW5kLXJlcGVhdC14JyApOyAvLyAtPiAnYmFja2dyb3VuZFJlcGVhdFgnXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemUgKCBzdHJpbmcgKSB7XG4gIHZhciB3b3JkcyA9IHN0cmluZy5tYXRjaCggL1swLTlhLXpdKy9naSApO1xuICB2YXIgcmVzdWx0O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgaWYgKCAhIHdvcmRzICkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJlc3VsdCA9IHdvcmRzWyAwIF0udG9Mb3dlckNhc2UoKTtcblxuICBmb3IgKCBpID0gMSwgbCA9IHdvcmRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICByZXN1bHQgKz0gdXBwZXJGaXJzdCggd29yZHNbIGkgXSApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdW5lc2NhcGUgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC91bmVzY2FwZScgKTtcbnZhciBfdHlwZSAgICAgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC90eXBlJyApO1xuXG52YXIgYmFzZUV4ZWMgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWV4ZWMnICk7XG5cbnZhciBpc0tleSAgICAgPSByZXF1aXJlKCAnLi9pcy1rZXknICk7XG52YXIgdG9LZXkgICAgID0gcmVxdWlyZSggJy4vdG8ta2V5JyApO1xuXG52YXIgclByb3BlcnR5ID0gLyhefFxcLilcXHMqKFtfYS16XVxcdyopXFxzKnxcXFtcXHMqKCg/Oi0pPyg/OlxcZCt8XFxkKlxcLlxcZCspfChcInwnKSgoW15cXFxcXVxcXFwoXFxcXFxcXFwpKnxbXlxcNF0pKilcXDQpXFxzKlxcXS9naTtcblxuZnVuY3Rpb24gc3RyaW5nVG9QYXRoICggc3RyICkge1xuICB2YXIgcGF0aCA9IGJhc2VFeGVjKCByUHJvcGVydHksIHN0ciApO1xuICB2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTtcbiAgdmFyIHZhbDtcblxuICBmb3IgKCA7IGkgPj0gMDsgLS1pICkge1xuICAgIHZhbCA9IHBhdGhbIGkgXTtcblxuICAgIC8vIC5uYW1lXG4gICAgaWYgKCB2YWxbIDIgXSApIHtcbiAgICAgIHBhdGhbIGkgXSA9IHZhbFsgMiBdO1xuICAgIC8vIFsgXCJcIiBdIHx8IFsgJycgXVxuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWxbIDUgXSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICBwYXRoWyBpIF0gPSBfdW5lc2NhcGUoIHZhbFsgNSBdICk7XG4gICAgLy8gWyAwIF1cbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aFsgaSBdID0gdmFsWyAzIF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhdGg7XG59XG5cbmZ1bmN0aW9uIGNhc3RQYXRoICggdmFsICkge1xuICB2YXIgcGF0aDtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggaXNLZXkoIHZhbCApICkge1xuICAgIHJldHVybiBbIHRvS2V5KCB2YWwgKSBdO1xuICB9XG5cbiAgaWYgKCBfdHlwZSggdmFsICkgPT09ICdhcnJheScgKSB7XG4gICAgcGF0aCA9IEFycmF5KCBsID0gdmFsLmxlbmd0aCApO1xuXG4gICAgZm9yICggaSA9IGwgLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIHBhdGhbIGkgXSA9IHRvS2V5KCB2YWxbIGkgXSApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gc3RyaW5nVG9QYXRoKCAnJyArIHZhbCApO1xuICB9XG5cbiAgcmV0dXJuIHBhdGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xhbXAgKCB2YWx1ZSwgbG93ZXIsIHVwcGVyICkge1xuICBpZiAoIHZhbHVlID49IHVwcGVyICkge1xuICAgIHJldHVybiB1cHBlcjtcbiAgfVxuXG4gIGlmICggdmFsdWUgPD0gbG93ZXIgKSB7XG4gICAgcmV0dXJuIGxvd2VyO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSggJy4vZ2V0LXByb3RvdHlwZS1vZicgKTtcbnZhciBpc09iamVjdExpa2UgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xudmFyIHRvT2JqZWN0ICAgICAgID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSggJy4vY3JlYXRlJyApO1xudmFyIGVhY2ggICAgICAgICAgID0gcmVxdWlyZSggJy4vZWFjaCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9uZSAoIGRlZXAsIHRhcmdldCwgZ3VhcmQgKSB7XG4gIHZhciBjbG47XG5cbiAgaWYgKCB0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyB8fCBndWFyZCApIHtcbiAgICB0YXJnZXQgPSBkZWVwO1xuICAgIGRlZXAgPSB0cnVlO1xuICB9XG5cbiAgY2xuID0gY3JlYXRlKCBnZXRQcm90b3R5cGVPZiggdGFyZ2V0ID0gdG9PYmplY3QoIHRhcmdldCApICkgKTtcblxuICBlYWNoKCB0YXJnZXQsIGZ1bmN0aW9uICggdmFsdWUsIGtleSwgdGFyZ2V0ICkge1xuICAgIGlmICggdmFsdWUgPT09IHRhcmdldCApIHtcbiAgICAgIHRoaXNbIGtleSBdID0gdGhpcztcbiAgICB9IGVsc2UgaWYgKCBkZWVwICYmIGlzT2JqZWN0TGlrZSggdmFsdWUgKSApIHtcbiAgICAgIHRoaXNbIGtleSBdID0gY2xvbmUoIGRlZXAsIHZhbHVlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXNbIGtleSBdID0gdmFsdWU7XG4gICAgfVxuICB9LCBjbG4gKTtcblxuICByZXR1cm4gY2xuO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb3Nlc3QgPSByZXF1aXJlKCAnLi9jbG9zZXN0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsb3Nlc3ROb2RlICggZSwgYyApIHtcbiAgaWYgKCB0eXBlb2YgYyA9PT0gJ3N0cmluZycgKSB7XG4gICAgcmV0dXJuIGNsb3Nlc3QuY2FsbCggZSwgYyApO1xuICB9XG5cbiAgZG8ge1xuICAgIGlmICggZSA9PT0gYyApIHtcbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgfSB3aGlsZSAoICggZSA9IGUucGFyZW50Tm9kZSApICk7XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWF0Y2hlcyA9IHJlcXVpcmUoICcuL21hdGNoZXMtc2VsZWN0b3InICk7XG5cbnZhciBjbG9zZXN0O1xuXG5pZiAoIHR5cGVvZiBFbGVtZW50ID09PSAndW5kZWZpbmVkJyB8fCAhICggY2xvc2VzdCA9IEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgKSApIHtcbiAgY2xvc2VzdCA9IGZ1bmN0aW9uIGNsb3Nlc3QgKCBzZWxlY3RvciApIHtcbiAgICB2YXIgZWxlbWVudCA9IHRoaXM7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoIG1hdGNoZXMuY2FsbCggZWxlbWVudCwgc2VsZWN0b3IgKSApIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoICggZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudCApICk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9zZXN0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvdW5kICggZnVuY3Rpb25zICkge1xuICByZXR1cm4gZnVuY3Rpb24gY29tcG91bmRlZCAoKSB7XG4gICAgdmFyIHZhbHVlO1xuICAgIHZhciBpO1xuICAgIHZhciBsO1xuXG4gICAgZm9yICggaSA9IDAsIGwgPSBmdW5jdGlvbnMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgdmFsdWUgPSBmdW5jdGlvbnNbIGkgXS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEVSUjoge1xuICAgIElOVkFMSURfQVJHUzogICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnRzJyxcbiAgICBGVU5DVElPTl9FWFBFQ1RFRDogICAgICdFeHBlY3RlZCBhIGZ1bmN0aW9uJyxcbiAgICBTVFJJTkdfRVhQRUNURUQ6ICAgICAgICdFeHBlY3RlZCBhIHN0cmluZycsXG4gICAgVU5ERUZJTkVEX09SX05VTEw6ICAgICAnQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0JyxcbiAgICBSRURVQ0VfT0ZfRU1QVFlfQVJSQVk6ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyxcbiAgICBOT19QQVRIOiAgICAgICAgICAgICAgICdObyBwYXRoIHdhcyBnaXZlbidcbiAgfSxcblxuICBNQVhfQVJSQVlfTEVOR1RIOiA0Mjk0OTY3Mjk1LFxuICBNQVhfU0FGRV9JTlQ6ICAgICA5MDA3MTk5MjU0NzQwOTkxLFxuICBNSU5fU0FGRV9JTlQ6ICAgIC05MDA3MTk5MjU0NzQwOTkxLFxuXG4gIERFRVA6ICAgICAgICAgMSxcbiAgREVFUF9LRUVQX0ZOOiAyLFxuXG4gIFBMQUNFSE9MREVSOiB7fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGNyZWF0ZTtcblxudmFyIGRlZmluZVByb3BlcnRpZXMgPSByZXF1aXJlKCAnLi9kZWZpbmUtcHJvcGVydGllcycgKTtcblxudmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZSggJy4vc2V0LXByb3RvdHlwZS1vZicgKTtcblxudmFyIGlzUHJpbWl0aXZlID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xuXG5mdW5jdGlvbiBDICgpIHt9XG5cbmZ1bmN0aW9uIGNyZWF0ZSAoIHByb3RvdHlwZSwgZGVzY3JpcHRvcnMgKSB7XG4gIHZhciBvYmplY3Q7XG5cbiAgaWYgKCBwcm90b3R5cGUgIT09IG51bGwgJiYgaXNQcmltaXRpdmUoIHByb3RvdHlwZSApICkge1xuICAgIHRocm93IFR5cGVFcnJvciggJ09iamVjdCBwcm90b3R5cGUgbWF5IG9ubHkgYmUgYW4gT2JqZWN0IG9yIG51bGw6ICcgKyBwcm90b3R5cGUgKTtcbiAgfVxuXG4gIEMucHJvdG90eXBlID0gcHJvdG90eXBlO1xuXG4gIG9iamVjdCA9IG5ldyBDKCk7XG5cbiAgQy5wcm90b3R5cGUgPSBudWxsO1xuXG4gIGlmICggcHJvdG90eXBlID09PSBudWxsICkge1xuICAgIHNldFByb3RvdHlwZU9mKCBvYmplY3QsIG51bGwgKTtcbiAgfVxuXG4gIGlmICggYXJndW1lbnRzLmxlbmd0aCA+PSAyICkge1xuICAgIGRlZmluZVByb3BlcnRpZXMoIG9iamVjdCwgZGVzY3JpcHRvcnMgKTtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUFzc2lnbiA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtYXNzaWduJyApO1xudmFyIEVSUiAgICAgICAgPSByZXF1aXJlKCAnLi4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVBc3NpZ24gKCBrZXlzICkge1xuICByZXR1cm4gZnVuY3Rpb24gYXNzaWduICggb2JqICkge1xuICAgIHZhciBzcmM7XG4gICAgdmFyIGw7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IDEsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgc3JjID0gYXJndW1lbnRzWyBpIF07XG5cbiAgICAgIGlmICggc3JjICE9PSBudWxsICYmIHR5cGVvZiBzcmMgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICBiYXNlQXNzaWduKCBvYmosIHNyYywga2V5cyggc3JjICkgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VGb3JFYWNoICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWVhY2gnICk7XG52YXIgYmFzZUZvckluICAgID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItaW4nICk7XG52YXIgaXNBcnJheUxpa2UgID0gcmVxdWlyZSggJy4uL2lzLWFycmF5LWxpa2UnICk7XG52YXIgdG9PYmplY3QgICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcbnZhciBpdGVyYXRlZSAgICAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG52YXIga2V5cyAgICAgICAgID0gcmVxdWlyZSggJy4uL2tleXMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRWFjaCAoIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGVhY2ggKCBvYmosIGZuLCBjdHggKSB7XG5cbiAgICBvYmogPSB0b09iamVjdCggb2JqICk7XG5cbiAgICBmbiAgPSBpdGVyYXRlZSggZm4gKTtcblxuICAgIGlmICggaXNBcnJheUxpa2UoIG9iaiApICkge1xuICAgICAgcmV0dXJuIGJhc2VGb3JFYWNoKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCApO1xuICAgIH1cblxuICAgIHJldHVybiBiYXNlRm9ySW4oIG9iaiwgZm4sIGN0eCwgZnJvbVJpZ2h0LCBrZXlzKCBvYmogKSApO1xuXG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVzY2FwZSAoIHJlZ2V4cCwgbWFwICkge1xuICBmdW5jdGlvbiByZXBsYWNlciAoIGMgKSB7XG4gICAgcmV0dXJuIG1hcFsgYyBdO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGVzY2FwZSAoIHN0cmluZyApIHtcbiAgICBpZiAoIHN0cmluZyA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyaW5nID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gKCBzdHJpbmcgKz0gJycgKS5yZXBsYWNlKCByZWdleHAsIHJlcGxhY2VyICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEl0ZXJhdGVlID0gcmVxdWlyZSggJy4uL2NhbGwtaXRlcmF0ZWUnICk7XG52YXIgdG9PYmplY3QgICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcbnZhciBpdGVyYWJsZSAgICAgPSByZXF1aXJlKCAnLi4vaXRlcmFibGUnICk7XG52YXIgaXRlcmF0ZWUgICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xudmFyIGlzc2V0ICAgICAgICA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGaW5kICggcmV0dXJuSW5kZXgsIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZpbmQgKCBhcnIsIGZuLCBjdHggKSB7XG4gICAgdmFyIGogPSAoIGFyciA9IGl0ZXJhYmxlKCB0b09iamVjdCggYXJyICkgKSApLmxlbmd0aCAtIDE7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB2YXIgaWR4O1xuICAgIHZhciB2YWw7XG5cbiAgICBmbiA9IGl0ZXJhdGVlKCBmbiApO1xuXG4gICAgZm9yICggOyBqID49IDA7IC0taiApIHtcbiAgICAgIGlmICggZnJvbVJpZ2h0ICkge1xuICAgICAgICBpZHggPSBqO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWR4ID0gKytpO1xuICAgICAgfVxuXG4gICAgICB2YWwgPSBhcnJbIGlkeCBdO1xuXG4gICAgICBpZiAoIGlzc2V0KCBpZHgsIGFyciApICYmIGNhbGxJdGVyYXRlZSggZm4sIGN0eCwgdmFsLCBpZHgsIGFyciApICkge1xuICAgICAgICBpZiAoIHJldHVybkluZGV4ICkge1xuICAgICAgICAgIHJldHVybiBpZHg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggcmV0dXJuSW5kZXggKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUiA9IHJlcXVpcmUoICcuLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZpcnN0ICggbmFtZSApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggc3RyICkge1xuICAgIGlmICggc3RyID09PSBudWxsIHx8IHR5cGVvZiBzdHIgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCBzdHIgKz0gJycgKS5jaGFyQXQoIDAgKVsgbmFtZSBdKCkgKyBzdHIuc2xpY2UoIDEgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlRm9yRWFjaCA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWVhY2gnICk7XG52YXIgdG9PYmplY3QgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhdGVlICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xudmFyIGl0ZXJhYmxlICAgID0gcmVxdWlyZSggJy4uL2l0ZXJhYmxlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZvckVhY2ggKCBmcm9tUmlnaHQgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb3JFYWNoICggYXJyLCBmbiwgY3R4ICkge1xuICAgIHJldHVybiBiYXNlRm9yRWFjaCggaXRlcmFibGUoIHRvT2JqZWN0KCBhcnIgKSApLCBpdGVyYXRlZSggZm4gKSwgY3R4LCBmcm9tUmlnaHQgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlRm9ySW4gPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1pbicgKTtcbnZhciB0b09iamVjdCAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhdGVlICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGb3JJbiAoIGtleXMsIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvckluICggb2JqLCBmbiwgY3R4ICkge1xuICAgIHJldHVybiBiYXNlRm9ySW4oIG9iaiA9IHRvT2JqZWN0KCBvYmogKSwgaXRlcmF0ZWUoIGZuICksIGN0eCwgZnJvbVJpZ2h0LCBrZXlzKCBvYmogKSApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBNdXN0IGJlICdXaWR0aCcgb3IgJ0hlaWdodCcgKGNhcGl0YWxpemVkKS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVHZXRFbGVtZW50RGltZW5zaW9uICggbmFtZSApIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7V2luZG93fE5vZGV9IGVcbiAgICovXG4gIHJldHVybiBmdW5jdGlvbiAoIGUgKSB7XG4gICAgdmFyIHY7XG4gICAgdmFyIGI7XG4gICAgdmFyIGQ7XG5cbiAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhIHdpbmRvd1xuXG4gICAgaWYgKCBlLndpbmRvdyA9PT0gZSApIHtcblxuICAgICAgLy8gaW5uZXJXaWR0aCBhbmQgaW5uZXJIZWlnaHQgaW5jbHVkZXMgYSBzY3JvbGxiYXIgd2lkdGgsIGJ1dCBpdCBpcyBub3RcbiAgICAgIC8vIHN1cHBvcnRlZCBieSBvbGRlciBicm93c2Vyc1xuXG4gICAgICB2ID0gTWF0aC5tYXgoIGVbICdpbm5lcicgKyBuYW1lIF0gfHwgMCwgZS5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbICdjbGllbnQnICsgbmFtZSBdICk7XG5cbiAgICAvLyBpZiB0aGUgZWxlbWVudHMgaXMgYSBkb2N1bWVudFxuXG4gICAgfSBlbHNlIGlmICggZS5ub2RlVHlwZSA9PT0gOSApIHtcblxuICAgICAgYiA9IGUuYm9keTtcbiAgICAgIGQgPSBlLmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgdiA9IE1hdGgubWF4KFxuICAgICAgICBiWyAnc2Nyb2xsJyArIG5hbWUgXSxcbiAgICAgICAgZFsgJ3Njcm9sbCcgKyBuYW1lIF0sXG4gICAgICAgIGJbICdvZmZzZXQnICsgbmFtZSBdLFxuICAgICAgICBkWyAnb2Zmc2V0JyArIG5hbWUgXSxcbiAgICAgICAgYlsgJ2NsaWVudCcgKyBuYW1lIF0sXG4gICAgICAgIGRbICdjbGllbnQnICsgbmFtZSBdICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdiA9IGVbICdjbGllbnQnICsgbmFtZSBdO1xuICAgIH1cblxuICAgIHJldHVybiB2O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1pbmRleC1vZicgKTtcbnZhciB0b09iamVjdCAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlSW5kZXhPZiAoIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGluZGV4T2YgKCBhcnIsIHNlYXJjaCwgZnJvbUluZGV4ICkge1xuICAgIHJldHVybiBiYXNlSW5kZXhPZiggdG9PYmplY3QoIGFyciApLCBzZWFyY2gsIGZyb21JbmRleCwgZnJvbVJpZ2h0ICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi4vY2FzdC1wYXRoJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVByb3BlcnR5T2YgKCBiYXNlUHJvcGVydHksIHVzZUFyZ3MgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIG9iamVjdCApIHtcbiAgICB2YXIgYXJncztcblxuICAgIGlmICggdXNlQXJncyApIHtcbiAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICggcGF0aCApIHtcbiAgICAgIGlmICggKCBwYXRoID0gY2FzdFBhdGgoIHBhdGggKSApLmxlbmd0aCApIHtcbiAgICAgICAgcmV0dXJuIGJhc2VQcm9wZXJ0eSggb2JqZWN0LCBwYXRoLCBhcmdzICk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuLi9jYXN0LXBhdGgnICk7XG52YXIgbm9vcCAgICAgPSByZXF1aXJlKCAnLi4vbm9vcCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQcm9wZXJ0eSAoIGJhc2VQcm9wZXJ0eSwgdXNlQXJncyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggcGF0aCApIHtcbiAgICB2YXIgYXJncztcblxuICAgIGlmICggISAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoICkge1xuICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuXG4gICAgaWYgKCB1c2VBcmdzICkge1xuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCBvYmplY3QgKSB7XG4gICAgICByZXR1cm4gYmFzZVByb3BlcnR5KCBvYmplY3QsIHBhdGgsIGFyZ3MgKTtcbiAgICB9O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF93b3JkcyA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC93b3JkcycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY3JlYXRlUmVtb3ZlUHJvcCAoIF9yZW1vdmVQcm9wICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBrZXlzICkge1xuICAgIHZhciBlbGVtZW50O1xuICAgIHZhciBpO1xuICAgIHZhciBqO1xuXG4gICAgaWYgKCB0eXBlb2Yga2V5cyA9PT0gJ3N0cmluZycgICkge1xuICAgICAga2V5cyA9IF93b3Jkcygga2V5cyApO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgICAgaWYgKCAoIGVsZW1lbnQgPSB0aGlzWyBpIF0gKS5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGZvciAoIGogPSBrZXlzLmxlbmd0aCAtIDE7IGogPj0gMDsgLS1qICkge1xuICAgICAgICBfcmVtb3ZlUHJvcCggZWxlbWVudCwga2V5c1sgaiBdICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVHJpbSAoIHJlZ2V4cCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRyaW0gKCBzdHJpbmcgKSB7XG4gICAgaWYgKCBzdHJpbmcgPT09IG51bGwgfHwgdHlwZW9mIHN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICAgIH1cblxuICAgIHJldHVybiAoICcnICsgc3RyaW5nICkucmVwbGFjZSggcmVnZXhwLCAnJyApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICdhbmltYXRpb25JdGVyYXRpb25Db3VudCc6IHRydWUsXG4gICdjb2x1bW5Db3VudCc6IHRydWUsXG4gICdmaWxsT3BhY2l0eSc6IHRydWUsXG4gICdmbGV4U2hyaW5rJzogdHJ1ZSxcbiAgJ2ZvbnRXZWlnaHQnOiB0cnVlLFxuICAnbGluZUhlaWdodCc6IHRydWUsXG4gICdmbGV4R3Jvdyc6IHRydWUsXG4gICdvcGFjaXR5JzogdHJ1ZSxcbiAgJ29ycGhhbnMnOiB0cnVlLFxuICAnd2lkb3dzJzogdHJ1ZSxcbiAgJ3pJbmRleCc6IHRydWUsXG4gICdvcmRlcic6IHRydWUsXG4gICd6b29tJzogdHJ1ZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL2ludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlICggbWF4V2FpdCwgZm4gKSB7XG4gIHZhciB0aW1lb3V0SWQgPSBudWxsO1xuXG4gIGlmICggdHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggZm4sICdhIGZ1bmN0aW9uJyApO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkICgpIHtcbiAgICBpZiAoIHRpbWVvdXRJZCAhPT0gbnVsbCApIHtcbiAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgfVxuXG4gICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoICkge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dC5hcHBseSggbnVsbCwgWyBmbiwgbWF4V2FpdCBdLmNvbmNhdCggW10uc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCBmbiwgbWF4V2FpdCApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XG4gICAgaWYgKCB0aW1lb3V0SWQgIT09IG51bGwgKSB7XG4gICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJZCApO1xuICAgICAgdGltZW91dElkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRlYm91bmNlZDogZGVib3VuY2VkLFxuICAgIGNhbmNlbDogICAgY2FuY2VsXG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmF1bHRUbyAoIHZhbHVlLCBkZWZhdWx0VmFsdWUgKSB7XG4gIGlmICggdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gdmFsdWUgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtaXhpbiA9IHJlcXVpcmUoICcuL21peGluJyApO1xuXG5mdW5jdGlvbiBkZWZhdWx0cyAoIGRlZmF1bHRzLCBvYmplY3QgKSB7XG4gIGlmICggb2JqZWN0ICkge1xuICAgIHJldHVybiBtaXhpbigge30sIGRlZmF1bHRzLCBvYmplY3QgKTtcbiAgfVxuXG4gIHJldHVybiBtaXhpbigge30sIGRlZmF1bHRzICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgYmFzZURlZmluZVByb3BlcnR5ID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWRlZmluZS1wcm9wZXJ0eScgKTtcblxudmFyIGlzUHJpbWl0aXZlICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnZhciBlYWNoICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoJyApO1xuXG52YXIgZGVmaW5lUHJvcGVydGllcztcblxuaWYgKCBzdXBwb3J0ICE9PSAnZnVsbCcgKSB7XG4gIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzICggb2JqZWN0LCBkZXNjcmlwdG9ycyApIHtcbiAgICBpZiAoIHN1cHBvcnQgIT09ICdub3Qtc3VwcG9ydGVkJyApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggb2JqZWN0LCBkZXNjcmlwdG9ycyApO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIG9iamVjdCApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnZGVmaW5lUHJvcGVydGllcyBjYWxsZWQgb24gbm9uLW9iamVjdCcgKTtcbiAgICB9XG5cbiAgICBpZiAoIGlzUHJpbWl0aXZlKCBkZXNjcmlwdG9ycyApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICcgKyBkZXNjcmlwdG9ycyApO1xuICAgIH1cblxuICAgIGVhY2goIGRlc2NyaXB0b3JzLCBmdW5jdGlvbiAoIGRlc2NyaXB0b3IsIGtleSApIHtcbiAgICAgIGlmICggaXNQcmltaXRpdmUoIGRlc2NyaXB0b3IgKSApIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICcgKyBkZXNjcmlwdG9yICk7XG4gICAgICB9XG5cbiAgICAgIGJhc2VEZWZpbmVQcm9wZXJ0eSggdGhpcywga2V5LCBkZXNjcmlwdG9yICk7XG4gICAgfSwgb2JqZWN0ICk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufSBlbHNlIHtcbiAgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnRpZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgYmFzZURlZmluZVByb3BlcnR5ID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWRlZmluZS1wcm9wZXJ0eScgKTtcblxudmFyIGlzUHJpbWl0aXZlICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcblxudmFyIGRlZmluZVByb3BlcnR5O1xuXG5pZiAoIHN1cHBvcnQgIT09ICdmdWxsJyApIHtcbiAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSAoIG9iamVjdCwga2V5LCBkZXNjcmlwdG9yICkge1xuICAgIGlmICggc3VwcG9ydCAhPT0gJ25vdC1zdXBwb3J0ZWQnICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqZWN0LCBrZXksIGRlc2NyaXB0b3IgKTtcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cbiAgICB9XG5cbiAgICBpZiAoIGlzUHJpbWl0aXZlKCBvYmplY3QgKSApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ2RlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0JyApO1xuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIGRlc2NyaXB0b3IgKSApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ1Byb3BlcnR5IGRlc2NyaXB0aW9uIG11c3QgYmUgYW4gb2JqZWN0OiAnICsgZGVzY3JpcHRvciApO1xuICAgIH1cblxuICAgIHJldHVybiBiYXNlRGVmaW5lUHJvcGVydHkoIG9iamVjdCwga2V5LCBkZXNjcmlwdG9yICk7XG4gIH07XG59IGVsc2Uge1xuICBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVhY2gnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVhY2gnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVzY2FwZScgKSggL1s8PlwiJyZdL2csIHtcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICBcIidcIjogJyYjMzk7JyxcbiAgJ1wiJzogJyYjMzQ7JyxcbiAgJyYnOiAnJmFtcDsnXG59ICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9zZXN0Tm9kZSA9IHJlcXVpcmUoICcuL2Nsb3Nlc3Qtbm9kZScgKTtcbnZhciBET01XcmFwcGVyICA9IHJlcXVpcmUoICcuL0RPTVdyYXBwZXInICk7XG52YXIgRXZlbnQgICAgICAgPSByZXF1aXJlKCAnLi9FdmVudCcgKTtcblxudmFyIGV2ZW50cyA9IHtcbiAgaXRlbXM6IHt9LFxuICB0eXBlczogW11cbn07XG5cbnZhciBzdXBwb3J0ID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmICdhZGRFdmVudExpc3RlbmVyJyBpbiBzZWxmO1xuXG4vKipcbiAqIEBtZXRob2QgcGVha28uZXZlbnQub25cbiAqIEBwYXJhbSAge05vZGV9ICAgICBlbGVtZW50XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgdHlwZVxuICogQHBhcmFtICB7c3RyaW5nP30gIHNlbGVjdG9yXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gbGlzdGVuZXJcbiAqIEBwYXJhbSAge2Jvb2xlYW59ICB1c2VDYXB0dXJlXG4gKiBAcGFyYW0gIHtib29sZWFufSAgW29uY2VdXG4gKiBAcmV0dXJuIHt2b2lkfVxuICogQGV4YW1wbGVcbiAqIF8uZXZlbnQub24oIGRvY3VtZW50LCAnY2xpY2snLCAnLnBvc3RfX2xpa2UtYnV0dG9uJywgKCBldmVudCApID0+IHtcbiAqICAgY29uc3QgZGF0YSA9IHtcbiAqICAgICBpZDogXyggdGhpcyApLnBhcmVudCggJy5wb3N0JyApLmRhdGEoICdpZCcgKVxuICogICB9XG4gKlxuICogICBfLmFqYXgoICcvbGlrZScsIHsgZGF0YSB9IClcbiAqIH0sIGZhbHNlIClcbiAqL1xuZXhwb3J0cy5vbiA9IGZ1bmN0aW9uIG9uICggZWxlbWVudCwgdHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlLCBvbmNlICkge1xuICB2YXIgaXRlbSA9IHtcbiAgICB1c2VDYXB0dXJlOiB1c2VDYXB0dXJlLFxuICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgIG9uY2U6IG9uY2VcbiAgfTtcblxuICBpZiAoIHNlbGVjdG9yICkge1xuICAgIGl0ZW0uc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgfVxuXG4gIGlmICggc3VwcG9ydCApIHtcbiAgICBpdGVtLndyYXBwZXIgPSBmdW5jdGlvbiB3cmFwcGVyICggZXZlbnQsIF9lbGVtZW50ICkge1xuICAgICAgaWYgKCBzZWxlY3RvciAmJiAhIF9lbGVtZW50ICYmICEgKCBfZWxlbWVudCA9IGNsb3Nlc3ROb2RlKCBldmVudC50YXJnZXQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9uY2UgKSB7XG4gICAgICAgIGV4cG9ydHMub2ZmKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKTtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXIuY2FsbCggX2VsZW1lbnQgfHwgZWxlbWVudCwgbmV3IEV2ZW50KCBldmVudCApICk7XG4gICAgfTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgaXRlbS53cmFwcGVyLCB1c2VDYXB0dXJlICk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICBpdGVtLndyYXBwZXIgPSBmdW5jdGlvbiB3cmFwcGVyICggZXZlbnQsIF9lbGVtZW50ICkge1xuICAgICAgaWYgKCBzZWxlY3RvciAmJiAhIF9lbGVtZW50ICYmICEgKCBfZWxlbWVudCA9IGNsb3Nlc3ROb2RlKCBldmVudC50YXJnZXQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIHR5cGUgPT09ICdET01Db250ZW50TG9hZGVkJyAmJiBlbGVtZW50LnJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCBvbmNlICkge1xuICAgICAgICBleHBvcnRzLm9mZiggZWxlbWVudCwgdHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICk7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVyLmNhbGwoIF9lbGVtZW50IHx8IGVsZW1lbnQsIG5ldyBFdmVudCggZXZlbnQsIHR5cGUgKSApO1xuICAgIH07XG5cbiAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCBpdGVtLklFVHlwZSA9IElFVHlwZSggdHlwZSApLCBpdGVtLndyYXBwZXIgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoICdub3QgaW1wbGVtZW50ZWQnICk7XG4gIH1cblxuICBpZiAoIGV2ZW50cy5pdGVtc1sgdHlwZSBdICkge1xuICAgIGV2ZW50cy5pdGVtc1sgdHlwZSBdLnB1c2goIGl0ZW0gKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHMuaXRlbXNbIHR5cGUgXSA9IFsgaXRlbSBdO1xuICAgIGV2ZW50cy5pdGVtc1sgdHlwZSBdLmluZGV4ID0gZXZlbnRzLnR5cGVzLmxlbmd0aDtcbiAgICBldmVudHMudHlwZXMucHVzaCggdHlwZSApO1xuICB9XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGVha28uZXZlbnQub2ZmXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgZWxlbWVudFxuICogQHBhcmFtICB7c3RyaW5nfSAgIHR5cGVcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzZWxlY3RvclxuICogQHBhcmFtICB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gKiBAcGFyYW0gIHtib29sZWFufSAgdXNlQ2FwdHVyZVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0cy5vZmYgPSBmdW5jdGlvbiBvZmYgKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG4gIHZhciBpdGVtcztcbiAgdmFyIGl0ZW07XG4gIHZhciBpO1xuXG4gIGlmICggdHlwZSA9PT0gbnVsbCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZm9yICggaSA9IGV2ZW50cy50eXBlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGV2ZW50Lm9mZiggZWxlbWVudCwgZXZlbnRzLnR5cGVzWyBpIF0sIHNlbGVjdG9yICk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCAhICggaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgXSApICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSBpdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBpdGVtID0gaXRlbXNbIGkgXTtcblxuICAgIGlmICggaXRlbS5lbGVtZW50ICE9PSBlbGVtZW50IHx8XG4gICAgICB0eXBlb2YgbGlzdGVuZXIgIT09ICd1bmRlZmluZWQnICYmIChcbiAgICAgICAgaXRlbS5saXN0ZW5lciAhPT0gbGlzdGVuZXIgfHxcbiAgICAgICAgaXRlbS51c2VDYXB0dXJlICE9PSB1c2VDYXB0dXJlIHx8XG4gICAgICAgIC8vIHRvZG86IGNoZWNrIGJvdGggaXRlbS5zZWxlY3RvciBhbmQgc2VsZWN0b3IgYW5kIHRoZW4gY29tcGFyZVxuICAgICAgICBpdGVtLnNlbGVjdG9yICYmIGl0ZW0uc2VsZWN0b3IgIT09IHNlbGVjdG9yICkgKVxuICAgIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBicmFjZS1zdHlsZVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaXRlbXMuc3BsaWNlKCBpLCAxICk7XG5cbiAgICBpZiAoICEgaXRlbXMubGVuZ3RoICkge1xuICAgICAgZXZlbnRzLnR5cGVzLnNwbGljZSggaXRlbXMuaW5kZXgsIDEgKTtcbiAgICAgIGV2ZW50cy5pdGVtc1sgdHlwZSBdID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIHN1cHBvcnQgKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGl0ZW0ud3JhcHBlciwgaXRlbS51c2VDYXB0dXJlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuZGV0YWNoRXZlbnQoIGl0ZW0uSUVUeXBlLCBpdGVtLndyYXBwZXIgKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMudHJpZ2dlciA9IGZ1bmN0aW9uIHRyaWdnZXIgKCBlbGVtZW50LCB0eXBlLCBkYXRhICkge1xuICB2YXIgaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgXTtcbiAgdmFyIGNsb3Nlc3Q7XG4gIHZhciBpdGVtO1xuICB2YXIgaTtcblxuICBpZiAoICEgaXRlbXMgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSApIHtcbiAgICBpdGVtID0gaXRlbXNbIGkgXTtcblxuICAgIGlmICggZWxlbWVudCApIHtcbiAgICAgIGNsb3Nlc3QgPSBjbG9zZXN0Tm9kZSggZWxlbWVudCwgaXRlbS5zZWxlY3RvciB8fCBpdGVtLmVsZW1lbnQgKTtcbiAgICB9IGVsc2UgaWYgKCBpdGVtLnNlbGVjdG9yICkge1xuICAgICAgbmV3IERPTVdyYXBwZXIoIGl0ZW0uc2VsZWN0b3IgKS5lYWNoKCAoIGZ1bmN0aW9uICggaXRlbSApIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpdGVtLndyYXBwZXIoIGNyZWF0ZUV2ZW50V2l0aFRhcmdldCggdHlwZSwgZGF0YSwgdGhpcyApLCB0aGlzICk7XG4gICAgICAgIH07XG4gICAgICB9ICkoIGl0ZW0gKSApO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xvc2VzdCA9IGl0ZW0uZWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAoIGNsb3Nlc3QgKSB7XG4gICAgICBpdGVtLndyYXBwZXIoIGNyZWF0ZUV2ZW50V2l0aFRhcmdldCggdHlwZSwgZGF0YSwgZWxlbWVudCB8fCBjbG9zZXN0ICksIGNsb3Nlc3QgKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMuY29weSA9IGZ1bmN0aW9uIGNvcHkgKCB0YXJnZXQsIHNvdXJjZSwgZGVlcCApIHtcbiAgdmFyIGl0ZW1zO1xuICB2YXIgaXRlbTtcbiAgdmFyIHR5cGU7XG4gIHZhciBpO1xuICB2YXIgajtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IGV2ZW50cy50eXBlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBpZiAoICggaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgPSBldmVudHMudHlwZXNbIGkgXSBdICkgKSB7XG4gICAgICBmb3IgKCBqID0gMCwgbCA9IGl0ZW1zLmxlbmd0aDsgaiA8IGw7ICsraiApIHtcbiAgICAgICAgaWYgKCAoIGl0ZW0gPSBpdGVtc1sgaiBdICkudGFyZ2V0ID09PSBzb3VyY2UgKSB7XG4gICAgICAgICAgZXZlbnQub24oIHRhcmdldCwgdHlwZSwgbnVsbCwgaXRlbS5saXN0ZW5lciwgaXRlbS51c2VDYXB0dXJlLCBpdGVtLm9uY2UgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICggISBkZWVwICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldCA9IHRhcmdldC5jaGlsZE5vZGVzO1xuICBzb3VyY2UgPSBzb3VyY2UuY2hpbGROb2RlcztcblxuICBmb3IgKCBpID0gdGFyZ2V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGV2ZW50LmNvcHkoIHRhcmdldFsgaSBdLCBzb3VyY2VbIGkgXSwgdHJ1ZSApO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFdpdGhUYXJnZXQgKCB0eXBlLCBkYXRhLCB0YXJnZXQgKSB7XG4gIHZhciBlID0gbmV3IEV2ZW50KCB0eXBlLCBkYXRhICk7XG4gIGUudGFyZ2V0ID0gdGFyZ2V0O1xuICByZXR1cm4gZTtcbn1cblxuZnVuY3Rpb24gSUVUeXBlICggdHlwZSApIHtcbiAgaWYgKCB0eXBlID09PSAnRE9NQ29udGVudExvYWRlZCcgKSB7XG4gICAgcmV0dXJuICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICB9XG5cbiAgcmV0dXJuICdvbicgKyB0eXBlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggdHJ1ZSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSggZmFsc2UsIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpbmQnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1lYWNoJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItZWFjaCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzLWluJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMtaW4nICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1pbicgKSggcmVxdWlyZSggJy4va2V5cycgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzJyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcblxudmFyIHdyYXBwZXJzID0ge1xuICBjb2w6ICAgICAgWyAyLCAnPHRhYmxlPjxjb2xncm91cD4nLCAnPC9jb2xncm91cD48L3RhYmxlPicgXSxcbiAgdHI6ICAgICAgIFsgMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nIF0sXG4gIGRlZmF1bHRzOiBbIDAsICcnLCAnJyBdXG59O1xuXG5mdW5jdGlvbiBhcHBlbmQgKCBmcmFnbWVudCwgZWxlbWVudHMgKSB7XG4gIGZvciAoIHZhciBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggZWxlbWVudHNbIGkgXSApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZnJhZ21lbnQgKCBlbGVtZW50cywgY29udGV4dCApIHtcbiAgdmFyIGZyYWdtZW50ID0gY29udGV4dC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBlbGVtZW50O1xuICB2YXIgd3JhcHBlcjtcbiAgdmFyIHRhZztcbiAgdmFyIGRpdjtcbiAgdmFyIGk7XG4gIHZhciBqO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudHNbIGkgXTtcblxuICAgIGlmICggaXNPYmplY3RMaWtlKCBlbGVtZW50ICkgKSB7XG4gICAgICBpZiAoICdub2RlVHlwZScgaW4gZWxlbWVudCApIHtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGVsZW1lbnQgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGVuZCggZnJhZ21lbnQsIGVsZW1lbnQgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCAvPHwmIz9cXHcrOy8udGVzdCggZWxlbWVudCApICkge1xuICAgICAgaWYgKCAhIGRpdiApIHtcbiAgICAgICAgZGl2ID0gY29udGV4dC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgfVxuXG4gICAgICB0YWcgPSAvPChbYS16XVteXFxzPl0qKS9pLmV4ZWMoIGVsZW1lbnQgKTtcblxuICAgICAgaWYgKCB0YWcgKSB7XG4gICAgICAgIHdyYXBwZXIgPSB3cmFwcGVyc1sgdGFnID0gdGFnWyAxIF0gXSB8fCB3cmFwcGVyc1sgdGFnLnRvTG93ZXJDYXNlKCkgXSB8fCB3cmFwcGVycy5kZWZhdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyYXBwZXIgPSB3cmFwcGVycy5kZWZhdWx0cztcbiAgICAgIH1cblxuICAgICAgZGl2LmlubmVySFRNTCA9IHdyYXBwZXJbIDEgXSArIGVsZW1lbnQgKyB3cmFwcGVyWyAyIF07XG5cbiAgICAgIGZvciAoIGogPSB3cmFwcGVyWyAwIF07IGogPiAwOyAtLWogKSB7XG4gICAgICAgIGRpdiA9IGRpdi5sYXN0Q2hpbGQ7XG4gICAgICB9XG5cbiAgICAgIGFwcGVuZCggZnJhZ21lbnQsIGRpdi5jaGlsZE5vZGVzICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBjb250ZXh0LmNyZWF0ZVRleHROb2RlKCBlbGVtZW50ICkgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGRpdiApIHtcbiAgICBkaXYuaW5uZXJIVE1MID0gJyc7XG4gIH1cblxuICByZXR1cm4gZnJhZ21lbnQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZyb21QYWlycyAoIHBhaXJzICkge1xuICB2YXIgb2JqZWN0ID0ge307XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IHBhaXJzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBvYmplY3RbIHBhaXJzWyBpIF1bIDAgXSBdID0gcGFpcnNbIGkgXVsgMSBdO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1nZXQtZWxlbWVudC1kaW1lbnNpb24nICkoICdIZWlnaHQnICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1nZXQtZWxlbWVudC1kaW1lbnNpb24nICkoICdXaWR0aCcgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUiA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mICggb2JqICkge1xuICB2YXIgcHJvdG90eXBlO1xuXG4gIGlmICggb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICkge1xuICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gIH1cblxuICBwcm90b3R5cGUgPSBvYmouX19wcm90b19fOyAvLyBqc2hpbnQgaWdub3JlOiBsaW5lXG5cbiAgaWYgKCB0eXBlb2YgcHJvdG90eXBlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gcHJvdG90eXBlO1xuICB9XG5cbiAgaWYgKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIG9iai5jb25zdHJ1Y3RvciApID09PSAnW29iamVjdCBGdW5jdGlvbl0nICkge1xuICAgIHJldHVybiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3R5bGUgKCBlLCBrLCBjICkge1xuICByZXR1cm4gZS5zdHlsZVsgayBdIHx8ICggYyB8fCBnZXRDb21wdXRlZFN0eWxlKCBlICkgKS5nZXRQcm9wZXJ0eVZhbHVlKCBrICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgYmFzZUdldCAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtZ2V0JyApO1xudmFyIEVSUiAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXQgKCBvYmplY3QsIHBhdGggKSB7XG4gIHZhciBsZW5ndGggPSAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoO1xuXG4gIGlmICggISBsZW5ndGggKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGxlbmd0aCA+IDEgKSB7XG4gICAgcmV0dXJuIGJhc2VHZXQoIHRvT2JqZWN0KCBvYmplY3QgKSwgcGF0aCwgMCApO1xuICB9XG5cbiAgcmV0dXJuIHRvT2JqZWN0KCBvYmplY3QgKVsgcGF0aFsgMCBdIF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgaXNzZXQgICAgPSByZXF1aXJlKCAnLi9pc3NldCcgKTtcbnZhciBiYXNlSGFzICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1oYXMnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhcyAoIG9iaiwgcGF0aCApIHtcbiAgdmFyIGwgPSAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoO1xuXG4gIGlmICggISBsICkge1xuICAgIHRocm93IEVycm9yKCBFUlIuTk9fUEFUSCApO1xuICB9XG5cbiAgaWYgKCBsID4gMSApIHtcbiAgICByZXR1cm4gYmFzZUhhcyggdG9PYmplY3QoIG9iaiApLCBwYXRoICk7XG4gIH1cblxuICByZXR1cm4gaXNzZXQoIHRvT2JqZWN0KCBvYmogKSwgcGF0aFsgMCBdICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlkZW50aXR5ICggdiApIHtcbiAgcmV0dXJuIHY7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtaW5kZXgtb2YnICkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfQXJndW1lbnRFeGNlcHRpb24gKCB1bmV4cGVjdGVkLCBleHBlY3RlZCApIHtcbiAgcmV0dXJuIEVycm9yKCAnXCInICsgdG9TdHJpbmcuY2FsbCggdW5leHBlY3RlZCApICsgJ1wiIGlzIG5vdCAnICsgZXhwZWN0ZWQgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2ZpcnN0ICggd3JhcHBlciwgZWxlbWVudCApIHtcbiAgd3JhcHBlclsgMCBdID0gZWxlbWVudDtcbiAgd3JhcHBlci5sZW5ndGggPSAxO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQG1ldGhvZCBfbWVtb2l6ZVxuICogQHBhcmFtICB7ZnVuY3Rpb259IGZ1bmN0aW9uX1xuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX21lbW9pemUgKCBmdW5jdGlvbl8gKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgdmFyIGxhc3RSZXN1bHQ7XG4gIHZhciBsYXN0VmFsdWU7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIG1lbW9pemVkICggdmFsdWUgKSB7XG4gICAgc3dpdGNoICggZmFsc2UgKSB7XG4gICAgICBjYXNlIGNhbGxlZDpcbiAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gZmFsbHMgdGhyb3VnaFxuICAgICAgY2FzZSB2YWx1ZSA9PT0gbGFzdFZhbHVlOlxuICAgICAgICByZXR1cm4gKCBsYXN0UmVzdWx0ID0gZnVuY3Rpb25fKCAoIGxhc3RWYWx1ZSA9IHZhbHVlICkgKSApO1xuICAgIH1cblxuICAgIHJldHVybiBsYXN0UmVzdWx0O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVzY2FwZSA9IHJlcXVpcmUoICcuLi9lc2NhcGUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3RleHRDb250ZW50ICggZWxlbWVudCwgdmFsdWUgKSB7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgdmFyIGNoaWxkcmVuO1xuICB2YXIgY2hpbGQ7XG4gIHZhciB0eXBlO1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgaWYgKCB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZXNjYXBlKCB2YWx1ZSApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSAwLCBsID0gKCBjaGlsZHJlbiA9IGVsZW1lbnQuY2hpbGROb2RlcyApLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAvLyBURVhUX05PREVcbiAgICBpZiAoICggdHlwZSA9ICggY2hpbGQgPSBjaGlsZHJlblsgaSBdICkubm9kZVR5cGUgKSA9PT0gMyApIHtcbiAgICAgIHJlc3VsdCArPSBjaGlsZC5ub2RlVmFsdWU7XG4gICAgLy8gRUxFTUVOVF9OT0RFXG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gMSApIHtcbiAgICAgIHJlc3VsdCArPSBfdGV4dENvbnRlbnQoIGNoaWxkICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vbWVtb2l6ZScgKSggcmVxdWlyZSggJy4uL3R5cGUnICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfdW5lc2NhcGUgKCBzdHJpbmcgKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSggL1xcXFwoXFxcXCk/L2csICckMScgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfQXJndW1lbnRFeGNlcHRpb24gPSByZXF1aXJlKCAnLi9Bcmd1bWVudEV4Y2VwdGlvbicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3b3JkcyAoIHN0cmluZyApIHtcbiAgaWYgKCB0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJyApIHtcbiAgICB0aHJvdyBfQXJndW1lbnRFeGNlcHRpb24oIHN0cmluZywgJ2Egc3RyaW5nJyApO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZy5tYXRjaCggL1teXFxzXFx1RkVGRlxceEEwXSsvZyApIHx8IFtdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGtleXMgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbnZlcnQgKCBvYmplY3QgKSB7XG4gIHZhciBrID0ga2V5cyggb2JqZWN0ID0gdG9PYmplY3QoIG9iamVjdCApICk7XG4gIHZhciBpbnZlcnRlZCA9IHt9O1xuICB2YXIgaTtcblxuICBmb3IgKCBpID0gay5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBpbnZlcnRlZFsga1sgaSBdIF0gPSBvYmplY3RbIGtbIGkgXSBdO1xuICB9XG5cbiAgcmV0dXJuIGludmVydGVkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xudmFyIGlzTGVuZ3RoICAgICA9IHJlcXVpcmUoICcuL2lzLWxlbmd0aCcgKTtcbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCAoIHZhbHVlICkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKCB2YWx1ZSApICYmIGlzTGVuZ3RoKCB2YWx1ZS5sZW5ndGggKSAmJiAhIGlzV2luZG93TGlrZSggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0xlbmd0aCAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcnJheUxpa2UgKCB2YWx1ZSApIHtcbiAgaWYgKCB2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyApIHtcbiAgICByZXR1cm4gaXNMZW5ndGgoIHZhbHVlLmxlbmd0aCApICYmICEgaXNXaW5kb3dMaWtlKCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNMZW5ndGggICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheSAoIHZhbHVlICkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKCB2YWx1ZSApICYmXG4gICAgaXNMZW5ndGgoIHZhbHVlLmxlbmd0aCApICYmXG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xudmFyIGlzV2luZG93TGlrZSA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRE9NRWxlbWVudCAoIHZhbHVlICkge1xuICB2YXIgbm9kZVR5cGU7XG5cbiAgaWYgKCAhIGlzT2JqZWN0TGlrZSggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIGlzV2luZG93TGlrZSggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG5vZGVUeXBlID0gdmFsdWUubm9kZVR5cGU7XG5cbiAgcmV0dXJuIG5vZGVUeXBlID09PSAxIHx8IC8vIEVMRU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDMgfHwgLy8gVEVYVF9OT0RFXG4gICAgICAgICBub2RlVHlwZSA9PT0gOCB8fCAvLyBDT01NRU5UX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSA5IHx8IC8vIERPQ1VNRU5UX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSAxMTsgIC8vIERPQ1VNRU5UX0ZSQUdNRU5UX05PREVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc051bWJlciA9IHJlcXVpcmUoICcuL2lzLW51bWJlcicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Zpbml0ZSAoIHZhbHVlICkge1xuICByZXR1cm4gaXNOdW1iZXIoIHZhbHVlICkgJiYgaXNGaW5pdGUoIHZhbHVlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3R5cGUgICAgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC90eXBlJyApO1xuXG52YXIgckRlZXBLZXkgPSAvKF58W15cXFxcXSkoXFxcXFxcXFwpKihcXC58XFxbKS87XG5cbmZ1bmN0aW9uIGlzS2V5ICggdmFsICkge1xuICB2YXIgdHlwZTtcblxuICBpZiAoICEgdmFsICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCBfdHlwZSggdmFsICkgPT09ICdhcnJheScgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHlwZSA9IHR5cGVvZiB2YWw7XG5cbiAgaWYgKCB0eXBlID09PSAnbnVtYmVyJyB8fCB0eXBlID09PSAnYm9vbGVhbicgfHwgX3R5cGUoIHZhbCApID09PSAnc3ltYm9sJyApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiAhIHJEZWVwS2V5LnRlc3QoIHZhbCApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTUFYX0FSUkFZX0xFTkdUSCA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5NQVhfQVJSQVlfTEVOR1RIO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTGVuZ3RoICggdmFsdWUgKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPj0gMCAmJlxuICAgIHZhbHVlIDw9IE1BWF9BUlJBWV9MRU5HVEggJiZcbiAgICB2YWx1ZSAlIDEgPT09IDA7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTmFOICggdmFsdWUgKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTnVtYmVyICggdmFsdWUgKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc09iamVjdExpa2UgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5cbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgdG9TdHJpbmcuY2FsbCggdmFsdWUgKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCAnLi9nZXQtcHJvdG90eXBlLW9mJyApO1xudmFyIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0JyApO1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIE9CSkVDVCA9IHRvU3RyaW5nLmNhbGwoIE9iamVjdCApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QgKCB2ICkge1xuICB2YXIgcDtcbiAgdmFyIGM7XG5cbiAgaWYgKCAhIGlzT2JqZWN0KCB2ICkgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcCA9IGdldFByb3RvdHlwZU9mKCB2ICk7XG5cbiAgaWYgKCBwID09PSBudWxsICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCAhIGhhc093blByb3BlcnR5LmNhbGwoIHAsICdjb25zdHJ1Y3RvcicgKSApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjID0gcC5jb25zdHJ1Y3RvcjtcblxuICByZXR1cm4gdHlwZW9mIGMgPT09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCggYyApID09PSBPQkpFQ1Q7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzUHJpbWl0aXZlICggdmFsdWUgKSB7XG4gIHJldHVybiAhIHZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzRmluaXRlICA9IHJlcXVpcmUoICcuL2lzLWZpbml0ZScgKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTYWZlSW50ZWdlciAoIHZhbHVlICkge1xuICByZXR1cm4gaXNGaW5pdGUoIHZhbHVlICkgJiZcbiAgICB2YWx1ZSA8PSBjb25zdGFudHMuTUFYX1NBRkVfSU5UICYmXG4gICAgdmFsdWUgPj0gY29uc3RhbnRzLk1JTl9TQUZFX0lOVCAmJlxuICAgIHZhbHVlICUgMSA9PT0gMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTdHJpbmcgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZSA9IHJlcXVpcmUoICcuL3R5cGUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTeW1ib2wgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGUoIHZhbHVlICkgPT09ICdzeW1ib2wnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzV2luZG93TGlrZSAoIHZhbHVlICkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKCB2YWx1ZSApICYmIHZhbHVlLndpbmRvdyA9PT0gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzV2luZG93ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc1dpbmRvd0xpa2UoIHZhbHVlICkgJiYgdG9TdHJpbmcuY2FsbCggdmFsdWUgKSA9PT0gJ1tvYmplY3QgV2luZG93XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzc2V0ICgga2V5LCBvYmogKSB7XG4gIGlmICggb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0eXBlb2Ygb2JqWyBrZXkgXSAhPT0gJ3VuZGVmaW5lZCcgfHwga2V5IGluIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xudmFyIGJhc2VWYWx1ZXMgICAgICAgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLXZhbHVlcycgKTtcbnZhciBrZXlzICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXRlcmFibGUgKCB2YWx1ZSApIHtcbiAgaWYgKCBpc0FycmF5TGlrZU9iamVjdCggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSB7XG4gICAgcmV0dXJuIHZhbHVlLnNwbGl0KCAnJyApO1xuICB9XG5cbiAgcmV0dXJuIGJhc2VWYWx1ZXMoIHZhbHVlLCBrZXlzKCB2YWx1ZSApICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCAnLi9pcy1hcnJheS1saWtlLW9iamVjdCcgKTtcbnZhciBtYXRjaGVzUHJvcGVydHkgICA9IHJlcXVpcmUoICcuL21hdGNoZXMtcHJvcGVydHknICk7XG52YXIgcHJvcGVydHkgICAgICAgICAgPSByZXF1aXJlKCAnLi9wcm9wZXJ0eScgKTtcblxuZXhwb3J0cy5pdGVyYXRlZSA9IGZ1bmN0aW9uIGl0ZXJhdGVlICggdmFsdWUgKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICggaXNBcnJheUxpa2VPYmplY3QoIHZhbHVlICkgKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNQcm9wZXJ0eSggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiBwcm9wZXJ0eSggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRLZXlzSW4gKCBvYmogKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciBrZXk7XG5cbiAgb2JqID0gdG9PYmplY3QoIG9iaiApO1xuXG4gIGZvciAoIGtleSBpbiBvYmogKSB7XG4gICAga2V5cy5wdXNoKCBrZXkgKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VLZXlzID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWtleXMnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgc3VwcG9ydCAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQta2V5cycgKTtcblxuaWYgKCBzdXBwb3J0ICE9PSAnZXMyMDE1JyApIHtcbiAgdmFyIF9rZXlzO1xuXG4gIC8qKlxuICAgKiArIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gK1xuICAgKiB8IEkgdGVzdGVkIHRoZSBmdW5jdGlvbnMgd2l0aCBzdHJpbmdbMjA0OF0gKGFuIGFycmF5IG9mIHN0cmluZ3MpIGFuZCBoYWQgfFxuICAgKiB8IHRoaXMgcmVzdWx0cyBpbiBOb2RlLmpzICh2OC4xMC4wKTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgKiArIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gK1xuICAgKiB8IGJhc2VLZXlzIHggMTAsNjc0IG9wcy9zZWMgwrEwLjIzJSAoOTQgcnVucyBzYW1wbGVkKSAgICAgICAgICAgICAgICAgICAgIHxcbiAgICogfCBPYmplY3Qua2V5cyB4IDIyLDE0NyBvcHMvc2VjIMKxMC4yMyUgKDk1IHJ1bnMgc2FtcGxlZCkgICAgICAgICAgICAgICAgICB8XG4gICAqIHwgRmFzdGVzdCBpcyBcIk9iamVjdC5rZXlzXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICogKyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICtcbiAgICovXG5cbiAgaWYgKCBzdXBwb3J0ID09PSAnZXM1JyApIHtcbiAgICBfa2V5cyA9IE9iamVjdC5rZXlzO1xuICB9IGVsc2Uge1xuICAgIF9rZXlzID0gYmFzZUtleXM7XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtleXMgKCB2ICkge1xuICAgIHJldHVybiBfa2V5cyggdG9PYmplY3QoIHYgKSApO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWluZGV4LW9mJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciBnZXQgICAgICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1nZXQnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hdGNoZXNQcm9wZXJ0eSAoIHByb3BlcnR5ICkge1xuICB2YXIgcGF0aCAgPSBjYXN0UGF0aCggcHJvcGVydHlbIDAgXSApO1xuICB2YXIgdmFsdWUgPSBwcm9wZXJ0eVsgMSBdO1xuXG4gIGlmICggISBwYXRoLmxlbmd0aCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoIG9iamVjdCApIHtcbiAgICBpZiAoIG9iamVjdCA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqZWN0ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIHBhdGgubGVuZ3RoID4gMSApIHtcbiAgICAgIHJldHVybiBnZXQoIG9iamVjdCwgcGF0aCwgMCApID09PSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyAwIF0gXSA9PT0gdmFsdWU7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtaW5kZXgtb2YnICk7XG5cbnZhciBtYXRjaGVzO1xuXG5pZiAoIHR5cGVvZiBFbGVtZW50ID09PSAndW5kZWZpbmVkJyB8fCAhICggbWF0Y2hlcyA9IEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUub01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yICkgKSB7XG4gIG1hdGNoZXMgPSBmdW5jdGlvbiBtYXRjaGVzICggc2VsZWN0b3IgKSB7XG4gICAgaWYgKCAvXiNbXFx3XFwtXSskLy50ZXN0KCBzZWxlY3RvciArPSAnJyApICkge1xuICAgICAgcmV0dXJuICcjJyArIHRoaXMuaWQgPT09IHNlbGVjdG9yO1xuICAgIH1cblxuICAgIHJldHVybiBiYXNlSW5kZXhPZiggdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICksIHRoaXMgKSA+PSAwO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS1vZicgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLWludm9rZScgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHknICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1pbnZva2UnICksIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1lbW9pemUgICAgICAgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC9tZW1vaXplJyApO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoICcuL2lzLXBsYWluLW9iamVjdCcgKTtcbnZhciB0b09iamVjdCAgICAgID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGtleXMgICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xudmFyIGlzQXJyYXkgICAgICAgPSBtZW1vaXplKCByZXF1aXJlKCAnLi9pcy1hcnJheScgKSApO1xuXG4vKipcbiAqIEBtZXRob2QgcGVha28ubWl4aW5cbiAqIEBwYXJhbSAge2Jvb2xlYW59ICAgIFtkZWVwPXRydWVdXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICB0YXJnZXRcbiAqIEBwYXJhbSAgey4uLm9iamVjdD99IG9iamVjdFxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1peGluICggZGVlcCwgdGFyZ2V0ICkge1xuICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpID0gMjtcbiAgdmFyIG9iamVjdDtcbiAgdmFyIHNvdXJjZTtcbiAgdmFyIHZhbHVlO1xuICB2YXIgajtcbiAgdmFyIGw7XG4gIHZhciBrO1xuXG4gIGlmICggdHlwZW9mIGRlZXAgIT09ICdib29sZWFuJyApIHtcbiAgICB0YXJnZXQgPSBkZWVwO1xuICAgIGRlZXAgPSB0cnVlO1xuICAgIGkgPSAxO1xuICB9XG5cbiAgdGFyZ2V0ID0gdG9PYmplY3QoIHRhcmdldCApO1xuXG4gIGZvciAoIDsgaSA8IGFyZ3NMZW5ndGg7ICsraSApIHtcbiAgICBvYmplY3QgPSBhcmd1bWVudHNbIGkgXTtcblxuICAgIGlmICggISBvYmplY3QgKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKCBrID0ga2V5cyggb2JqZWN0ICksIGogPSAwLCBsID0gay5sZW5ndGg7IGogPCBsOyArK2ogKSB7XG4gICAgICB2YWx1ZSA9IG9iamVjdFsga1sgaiBdIF07XG5cbiAgICAgIGlmICggZGVlcCAmJiBpc1BsYWluT2JqZWN0KCB2YWx1ZSApIHx8IGlzQXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgIHNvdXJjZSA9IHRhcmdldFsga1sgaiBdIF07XG5cbiAgICAgICAgaWYgKCBpc0FycmF5KCB2YWx1ZSApICkge1xuICAgICAgICAgIGlmICggISBpc0FycmF5KCBzb3VyY2UgKSApIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoICEgaXNQbGFpbk9iamVjdCggc291cmNlICkgKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRbIGtbIGogXSBdID0gbWl4aW4oIHRydWUsIHNvdXJjZSwgdmFsdWUgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFsga1sgaiBdIF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub29wICgpIHt9OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGJyYWNlLXJ1bGVzL2JyYWNlLW9uLXNhbWUtbGluZVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGUubm93IHx8IGZ1bmN0aW9uIG5vdyAoKSB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiZWZvcmUgPSByZXF1aXJlKCAnLi9iZWZvcmUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZSAoIHRhcmdldCApIHtcbiAgcmV0dXJuIGJlZm9yZSggMSwgdGFyZ2V0ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUNsb25lQXJyYXkgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtY2xvbmUtYXJyYXknICk7XG52YXIgZnJhZ21lbnQgICAgICAgPSByZXF1aXJlKCAnLi9mcmFnbWVudCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhUTUwgKCBzdHJpbmcsIGNvbnRleHQgKSB7XG4gIGlmICggL14oPzo8KFtcXHctXSspPjxcXC9bXFx3LV0rPnw8KFtcXHctXSspKD86XFxzKlxcLyk/PikkLy50ZXN0KCBzdHJpbmcgKSApIHtcbiAgICByZXR1cm4gWyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBSZWdFeHAuJDEgfHwgUmVnRXhwLiQyICkgXTtcbiAgfVxuXG4gIHJldHVybiBiYXNlQ2xvbmVBcnJheSggZnJhZ21lbnQoIFsgc3RyaW5nIF0sIGNvbnRleHQgfHwgZG9jdW1lbnQgKS5jaGlsZE5vZGVzICk7XG59O1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBWbGFkaXNsYXYgVGlraGl5IChTSUxFTlQpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdGlraGl5L3BlYWtvXG4gKi9cblxuLyohXG4gKiBCYXNlZCBvbiBqUXVlcnkgICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZVxuICogQmFzZWQgb24gTG9kYXNoICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmFtZXNwYWNlIHBlYWtvXG4gKi9cbnZhciBwZWFrbztcblxuaWYgKCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICkge1xuICBwZWFrbyA9IHJlcXVpcmUoICcuL18nICk7XG4gIHBlYWtvLkRPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi9ET01XcmFwcGVyJyApO1xufSBlbHNlIHtcbiAgcGVha28gPSBmdW5jdGlvbiBwZWFrbyAoKSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBicmFjZS1ydWxlcy9icmFjZS1vbi1zYW1lLWxpbmVcbn1cblxucGVha28uYWpheCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9hamF4JyApO1xucGVha28uYXNzaWduICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9hc3NpZ24nICk7XG5wZWFrby5hc3NpZ25JbiAgICAgICAgICA9IHJlcXVpcmUoICcuL2Fzc2lnbi1pbicgKTtcbnBlYWtvLmNsb25lICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xvbmUnICk7XG5wZWFrby5jcmVhdGUgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NyZWF0ZScgKTtcbnBlYWtvLmRlZmF1bHRzICAgICAgICAgID0gcmVxdWlyZSggJy4vZGVmYXVsdHMnICk7XG5wZWFrby5kZWZpbmVQcm9wZXJ0eSAgICA9IHJlcXVpcmUoICcuL2RlZmluZS1wcm9wZXJ0eScgKTtcbnBlYWtvLmRlZmluZVByb3BlcnRpZXMgID0gcmVxdWlyZSggJy4vZGVmaW5lLXByb3BlcnRpZXMnICk7XG5wZWFrby5lYWNoICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gnICk7XG5wZWFrby5lYWNoUmlnaHQgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gtcmlnaHQnICk7XG5wZWFrby5nZXRQcm90b3R5cGVPZiAgICA9IHJlcXVpcmUoICcuL2dldC1wcm90b3R5cGUtb2YnICk7XG5wZWFrby5pbmRleE9mICAgICAgICAgICA9IHJlcXVpcmUoICcuL2luZGV4LW9mJyApO1xucGVha28uaXNBcnJheSAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1hcnJheScgKTtcbnBlYWtvLmlzQXJyYXlMaWtlICAgICAgID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZScgKTtcbnBlYWtvLmlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG5wZWFrby5pc0RPTUVsZW1lbnQgICAgICA9IHJlcXVpcmUoICcuL2lzLWRvbS1lbGVtZW50JyApO1xucGVha28uaXNMZW5ndGggICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG5wZWFrby5pc09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdCcgKTtcbnBlYWtvLmlzT2JqZWN0TGlrZSAgICAgID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5wZWFrby5pc1BsYWluT2JqZWN0ICAgICA9IHJlcXVpcmUoICcuL2lzLXBsYWluLW9iamVjdCcgKTtcbnBlYWtvLmlzUHJpbWl0aXZlICAgICAgID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xucGVha28uaXNTeW1ib2wgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1zeW1ib2wnICk7XG5wZWFrby5pc1N0cmluZyAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXN0cmluZycgKTtcbnBlYWtvLmlzV2luZG93ICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtd2luZG93JyApO1xucGVha28uaXNXaW5kb3dMaWtlICAgICAgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcbnBlYWtvLmlzTnVtYmVyICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbnVtYmVyJyApO1xucGVha28uaXNOYU4gICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1uYW4nICk7XG5wZWFrby5pc1NhZmVJbnRlZ2VyICAgICA9IHJlcXVpcmUoICcuL2lzLXNhZmUtaW50ZWdlcicgKTtcbnBlYWtvLmlzRmluaXRlICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtZmluaXRlJyApO1xucGVha28ua2V5cyAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xucGVha28ua2V5c0luICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXlzLWluJyApO1xucGVha28ubGFzdEluZGV4T2YgICAgICAgPSByZXF1aXJlKCAnLi9sYXN0LWluZGV4LW9mJyApO1xucGVha28ubWl4aW4gICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9taXhpbicgKTtcbnBlYWtvLm5vb3AgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbm9vcCcgKTtcbnBlYWtvLnByb3BlcnR5ICAgICAgICAgID0gcmVxdWlyZSggJy4vcHJvcGVydHknICk7XG5wZWFrby5wcm9wZXJ0eU9mICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5LW9mJyApO1xucGVha28ubWV0aG9kICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9tZXRob2QnICk7XG5wZWFrby5tZXRob2RPZiAgICAgICAgICA9IHJlcXVpcmUoICcuL21ldGhvZC1vZicgKTtcbnBlYWtvLnNldFByb3RvdHlwZU9mICAgID0gcmVxdWlyZSggJy4vc2V0LXByb3RvdHlwZS1vZicgKTtcbnBlYWtvLnRvT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xucGVha28udHlwZSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90eXBlJyApO1xucGVha28uZm9yRWFjaCAgICAgICAgICAgPSByZXF1aXJlKCAnLi9mb3ItZWFjaCcgKTtcbnBlYWtvLmZvckVhY2hSaWdodCAgICAgID0gcmVxdWlyZSggJy4vZm9yLWVhY2gtcmlnaHQnICk7XG5wZWFrby5mb3JJbiAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1pbicgKTtcbnBlYWtvLmZvckluUmlnaHQgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLWluLXJpZ2h0JyApO1xucGVha28uZm9yT3duICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9mb3Itb3duJyApO1xucGVha28uZm9yT3duUmlnaHQgICAgICAgPSByZXF1aXJlKCAnLi9mb3Itb3duLXJpZ2h0JyApO1xucGVha28uYmVmb3JlICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9iZWZvcmUnICk7XG5wZWFrby5vbmNlICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL29uY2UnICk7XG5wZWFrby5kZWZhdWx0VG8gICAgICAgICA9IHJlcXVpcmUoICcuL2RlZmF1bHQtdG8nICk7XG5wZWFrby50aW1lciAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3RpbWVyJyApO1xucGVha28udGltZXN0YW1wICAgICAgICAgPSByZXF1aXJlKCAnLi90aW1lc3RhbXAnICk7XG5wZWFrby5ub3cgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL25vdycgKTtcbnBlYWtvLmNsYW1wICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xhbXAnICk7XG5wZWFrby5iaW5kICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2JpbmQnICk7XG5wZWFrby50cmltICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3RyaW0nICk7XG5wZWFrby50cmltRW5kICAgICAgICAgICA9IHJlcXVpcmUoICcuL3RyaW0tZW5kJyApO1xucGVha28udHJpbVN0YXJ0ICAgICAgICAgPSByZXF1aXJlKCAnLi90cmltLXN0YXJ0JyApO1xucGVha28uZmluZCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9maW5kJyApO1xucGVha28uZmluZEluZGV4ICAgICAgICAgPSByZXF1aXJlKCAnLi9maW5kLWluZGV4JyApO1xucGVha28uZmluZExhc3QgICAgICAgICAgPSByZXF1aXJlKCAnLi9maW5kLWxhc3QnICk7XG5wZWFrby5maW5kTGFzdEluZGV4ICAgICA9IHJlcXVpcmUoICcuL2ZpbmQtbGFzdC1pbmRleCcgKTtcbnBlYWtvLmhhcyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaGFzJyApO1xucGVha28uZ2V0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9nZXQnICk7XG5wZWFrby5zZXQgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3NldCcgKTtcbnBlYWtvLml0ZXJhdGVlICAgICAgICAgID0gcmVxdWlyZSggJy4vaXRlcmF0ZWUnICk7XG5wZWFrby5pZGVudGl0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL2lkZW50aXR5JyApO1xucGVha28uZXNjYXBlICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lc2NhcGUnICk7XG5wZWFrby51bmVzY2FwZSAgICAgICAgICA9IHJlcXVpcmUoICcuL3VuZXNjYXBlJyApO1xucGVha28ucmFuZG9tICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9yYW5kb20nICk7XG5wZWFrby5mcm9tUGFpcnMgICAgICAgICA9IHJlcXVpcmUoICcuL2Zyb20tcGFpcnMnICk7XG5wZWFrby5jb25zdGFudHMgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcbnBlYWtvLnRlbXBsYXRlICAgICAgICAgID0gcmVxdWlyZSggJy4vdGVtcGxhdGUnICk7XG5wZWFrby5pbnZlcnQgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2ludmVydCcgKTtcbnBlYWtvLmNvbXBvdW5kICAgICAgICAgID0gcmVxdWlyZSggJy4vY29tcG91bmQnICk7XG5wZWFrby5kZWJvdW5jZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2RlYm91bmNlJyApO1xuXG5pZiAoIHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyApIHtcbiAgc2VsZi5wZWFrbyA9IHNlbGYuXyA9IHBlYWtvOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBlYWtvO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBtZW1iZXIge29iamVjdH0gcGVha28ucGxhY2Vob2xkZXJcbiAqL1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHktb2YnICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1wcm9wZXJ0eScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtcHJvcGVydHknICkoIHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1wcm9wZXJ0eScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2NsYXNzJzogJ2NsYXNzTmFtZScsXG4gICdmb3InOiAgICdodG1sRm9yJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VSYW5kb20gPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtcmFuZG9tJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJhbmRvbSAoIGxvd2VyLCB1cHBlciwgZmxvYXRpbmcgKSB7XG5cbiAgLy8gXy5yYW5kb20oKTtcblxuICBpZiAoIHR5cGVvZiBsb3dlciA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZmxvYXRpbmcgPSBmYWxzZTtcbiAgICB1cHBlciA9IDE7XG4gICAgbG93ZXIgPSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgdXBwZXIgPT09ICd1bmRlZmluZWQnICkge1xuXG4gICAgLy8gXy5yYW5kb20oIGZsb2F0aW5nICk7XG5cbiAgICBpZiAoIHR5cGVvZiBsb3dlciA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgZmxvYXRpbmcgPSBsb3dlcjtcbiAgICAgIHVwcGVyID0gMTtcblxuICAgIC8vIF8ucmFuZG9tKCB1cHBlciApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGZsb2F0aW5nID0gZmFsc2U7XG4gICAgICB1cHBlciA9IGxvd2VyO1xuICAgIH1cblxuICAgIGxvd2VyID0gMDtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGZsb2F0aW5nID09PSAndW5kZWZpbmVkJyApIHtcblxuICAgIC8vIF8ucmFuZG9tKCB1cHBlciwgZmxvYXRpbmcgKTtcblxuICAgIGlmICggdHlwZW9mIHVwcGVyID09PSAnYm9vbGVhbicgKSB7XG4gICAgICBmbG9hdGluZyA9IHVwcGVyO1xuICAgICAgdXBwZXIgPSBsb3dlcjtcbiAgICAgIGxvd2VyID0gMDtcblxuICAgIC8vIF8ucmFuZG9tKCBsb3dlciwgdXBwZXIgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBmbG9hdGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICggZmxvYXRpbmcgfHwgbG93ZXIgJSAxIHx8IHVwcGVyICUgMSApIHtcbiAgICByZXR1cm4gYmFzZVJhbmRvbSggbG93ZXIsIHVwcGVyICk7XG4gIH1cblxuICByZXR1cm4gTWF0aC5yb3VuZCggYmFzZVJhbmRvbSggbG93ZXIsIHVwcGVyICkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1ByaW1pdGl2ZSA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnZhciBFUlIgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mICggdGFyZ2V0LCBwcm90b3R5cGUgKSB7XG4gIGlmICggdGFyZ2V0ID09PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnICkge1xuICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gIH1cblxuICBpZiAoIHByb3RvdHlwZSAhPT0gbnVsbCAmJiBpc1ByaW1pdGl2ZSggcHJvdG90eXBlICkgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogJyArIHByb3RvdHlwZSApO1xuICB9XG5cbiAgaWYgKCAnX19wcm90b19fJyBpbiB0YXJnZXQgKSB7XG4gICAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTsgLy8ganNoaW50IGlnbm9yZTogbGluZVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBiYXNlU2V0ICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1zZXQnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldCAoIG9iaiwgcGF0aCwgdmFsICkge1xuICB2YXIgbCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGwgKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGwgPiAxICkge1xuICAgIHJldHVybiBiYXNlU2V0KCB0b09iamVjdCggb2JqICksIHBhdGgsIHZhbCApO1xuICB9XG5cbiAgcmV0dXJuICggdG9PYmplY3QoIG9iaiApWyBwYXRoWyAwIF0gXSA9IHZhbCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1cHBvcnQ7XG5cbmZ1bmN0aW9uIHRlc3QgKCB0YXJnZXQgKSB7XG4gIHRyeSB7XG4gICAgaWYgKCAnJyBpbiBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHRhcmdldCwgJycsIHt9ICkgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKCBlICkge31cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmlmICggdGVzdCgge30gKSApIHtcbiAgc3VwcG9ydCA9ICdmdWxsJztcbn0gZWxzZSBpZiAoIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdGVzdCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICkgKSApIHtcbiAgc3VwcG9ydCA9ICdkb20nO1xufSBlbHNlIHtcbiAgc3VwcG9ydCA9ICdub3Qtc3VwcG9ydGVkJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuXG50cnkge1xuICBpZiAoIHNwYW4uc2V0QXR0cmlidXRlKCAneCcsICd5JyApLCBzcGFuLmdldEF0dHJpYnV0ZSggJ3gnICkgPT09ICd5JyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZXF1ZW5jZXNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbnVsbDtcbiAgfVxufSBjYXRjaCAoIGVycm9yICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xufVxuXG5zcGFuID0gbnVsbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1cHBvcnQ7XG5cbmlmICggT2JqZWN0LmtleXMgKSB7XG4gIHRyeSB7XG4gICAgc3VwcG9ydCA9IE9iamVjdC5rZXlzKCAnJyApLCAnZXMyMDE1JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnMsIG5vLXNlcXVlbmNlc1xuICB9IGNhdGNoICggZXJyb3IgKSB7XG4gICAgc3VwcG9ydCA9ICdlczUnO1xuICB9XG59IGVsc2UgaWYgKCB7IHRvU3RyaW5nOiBudWxsIH0ucHJvcGVydHlJc0VudW1lcmFibGUoICd0b1N0cmluZycgKSApIHtcbiAgc3VwcG9ydCA9ICdoYXMtYS1idWcnO1xufSBlbHNlIHtcbiAgc3VwcG9ydCA9ICdub3Qtc3VwcG9ydGVkJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXNjYXBlICA9IHJlcXVpcmUoICcuL2VzY2FwZScgKTtcblxudmFyIHJlZ2V4cHMgPSB7XG4gIHNhZmU6ICc8XFxcXCU9XFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPicsXG4gIGh0bWw6ICc8XFxcXCUtXFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPicsXG4gIGNvbW06IFwiJycnKFteXSo/KScnJ1wiLFxuICBjb2RlOiAnPFxcXFwlXFxcXHMqKFteXSo/KVxcXFxzKlxcXFwlPidcbn07XG5cbmZ1bmN0aW9uIHJlcGxhY2VyICggbWF0Y2gsIHNhZmUsIGh0bWwsIGNvZGUgKSB7XG4gIGlmICggdHlwZW9mIHNhZmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIicrX2UoXCIgKyBzYWZlLnJlcGxhY2UoIC9cXFxcbi9nLCAnXFxuJyApICsgXCIpKydcIjtcbiAgfVxuXG4gIGlmICggdHlwZW9mIGh0bWwgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIicrKFwiICsgaHRtbC5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiKSsnXCI7XG4gIH1cblxuICBpZiAoIHR5cGVvZiBjb2RlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gXCInO1wiICsgY29kZS5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiO19yKz0nXCI7XG4gIH1cblxuICAvLyBjb21tZW50IGlzIG1hdGNoZWQgLSBkbyBub3RoaW5nXG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHBlYWtvLnRlbXBsYXRlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHNvdXJjZSAgICAgICAgICAgIFRoZSB0ZW1wbGF0ZSBzb3VyY2UuXG4gKiBAcGFyYW0gIHtvYmplY3R9IFtvcHRpb25zXSAgICAgICAgIEFuIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtvYmplY3R9IFtvcHRpb25zLnJlZ2V4cHNdIEN1c3RvbSBwYXR0ZXJucy5cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgICAgICAgQW4gb2JqZWN0IHdpdGggYHJlbmRlcmAgbWV0aG9kLlxuICogQGV4YW1wbGVcbiAqIHZhciB0ZW1wbGF0ZSA9IHBlYWtvLnRlbXBsYXRlKGBcbiAqICAgJycnIEEgaHRtbC1zYWZlIG91dHB1dC4gJycnXG4gKiAgIDx0aXRsZT48JT0gZGF0YS51c2VybmFtZSAlPjwvdGl0bGU+XG4gKiAgICcnJyBBIGJsb2NrIG9mIGNvZGUuICcnJ1xuICogICA8JSBmb3IgKCB2YXIgaSA9IDA7IGkgPCA1OyBpICs9IDEgKSB7ICU+XG4gKiAgICAgPCUtIGkgJT5cbiAqICAgPCUgfSAlPlxuICogICAnJycgVGhlIFwicHJpbnRcIiBmdW5jdGlvbi4gJycnXG4gKiAgIDwlIHByaW50KCAnSGVsbG8gVCEnICk7ICU+XG4gKiBgKTtcbiAqIHZhciBodG1sID0gdGVtcGxhdGUucmVuZGVyKCB7IHVzZXJuYW1lOiAnSm9obicgfSApO1xuICogLy8gLT4gJzx0aXRsZT5Kb2huPC90aXRsZT4nXG4gKi9cbmZ1bmN0aW9uIHRlbXBsYXRlICggc291cmNlLCBvcHRpb25zICkge1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIHZhciByZWdleHA7XG4gIHZhciByZW5kZXJfO1xuXG4gIGlmICggISBvcHRpb25zICkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF8gKCBrZXkgKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMucmVnZXhwcyAmJiBvcHRpb25zLnJlZ2V4cHNbIGtleSBdIHx8IHJlZ2V4cHNbIGtleSBdO1xuICB9XG5cbiAgdmFyIHJlZ2V4cHNfID0ge1xuICAgIHNhZmU6IF8oICdzYWZlJyApLFxuICAgIGh0bWw6IF8oICdodG1sJyApLFxuICAgIGNvZGU6IF8oICdjb2RlJyApLFxuICAgIGNvbW06IF8oICdjb21tJyApXG4gIH07XG5cbiAgcmVnZXhwID0gUmVnRXhwKFxuICAgICggcmVnZXhwc18uc2FmZSApICsgJ3wnICtcbiAgICAoIHJlZ2V4cHNfLmh0bWwgKSArICd8JyArXG4gICAgKCByZWdleHBzXy5jb2RlICkgKyAnfCcgK1xuICAgICggcmVnZXhwc18uY29tbSApLCAnZycgKTtcblxuICBpZiAoIG9wdGlvbnMud2l0aCApIHtcbiAgICByZXN1bHQgKz0gJ3dpdGgoZGF0YXx8e30peyc7XG4gIH1cblxuICBpZiAoIG9wdGlvbnMucHJpbnQgIT09IG51bGwgKSB7XG4gICAgcmVzdWx0ICs9ICdmdW5jdGlvbiAnICsgKCBvcHRpb25zLnByaW50IHx8ICdwcmludCcgKSArIFwiKCl7X3IrPUFycmF5LnByb3RvdHlwZS5qb2luLmNhbGwoYXJndW1lbnRzLCcnKTt9XCI7XG4gIH1cblxuICByZXN1bHQgKz0gXCJ2YXIgX3I9J1wiO1xuXG4gIHJlc3VsdCArPSBzb3VyY2VcbiAgICAucmVwbGFjZSggL1xcbi9nLCAnXFxcXG4nIClcbiAgICAucmVwbGFjZSggcmVnZXhwLCByZXBsYWNlciApO1xuXG4gIHJlc3VsdCArPSBcIic7XCI7XG5cbiAgaWYgKCBvcHRpb25zLndpdGggKSB7XG4gICAgcmVzdWx0ICs9ICd9JztcbiAgfVxuXG4gIHJlc3VsdCArPSAncmV0dXJuIF9yOyc7XG5cbiAgcmVuZGVyXyA9IEZ1bmN0aW9uKCAnZGF0YScsICdfZScsIHJlc3VsdCApO1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKCBkYXRhICkge1xuICAgICAgcmV0dXJuIHJlbmRlcl8uY2FsbCggdGhpcywgZGF0YSwgZXNjYXBlICk7XG4gICAgfSxcblxuICAgIHJlc3VsdDogcmVzdWx0LFxuICAgIHNvdXJjZTogc291cmNlXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG4iLCIvKipcbiAqIEJhc2VkIG9uIEVyaWsgTcO2bGxlciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGw6XG4gKlxuICogQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxIHdoaWNoIGRlcml2ZWQgZnJvbVxuICogaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiAqIGh0dHA6Ly9teS5vcGVyYS5jb20vZW1vbGxlci9ibG9nLzIwMTEvMTIvMjAvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1lci1hbmltYXRpbmdcbiAqXG4gKiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyLlxuICogRml4ZXMgZnJvbSBQYXVsIElyaXNoLCBUaW5vIFppamRlbCwgQW5kcmV3IE1hbywgS2xlbWVuIFNsYXZpxI0sIERhcml1cyBCYWNvbi5cbiAqXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHRpbWVzdGFtcCA9IHJlcXVpcmUoICcuL3RpbWVzdGFtcCcgKTtcblxudmFyIHJlcXVlc3RBRjtcbnZhciBjYW5jZWxBRjtcblxuaWYgKCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gIGNhbmNlbEFGID0gc2VsZi5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgcmVxdWVzdEFGID0gc2VsZi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xufVxuXG52YXIgbm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAhIHJlcXVlc3RBRiB8fCAhIGNhbmNlbEFGIHx8XG4gIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIC9pUChhZHxob25lfG9kKS4qT1NcXHM2Ly50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICk7XG5cbmlmICggbm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKSB7XG4gIHZhciBsYXN0UmVxdWVzdFRpbWUgPSAwO1xuICB2YXIgZnJhbWVEdXJhdGlvbiAgID0gMTAwMCAvIDYwO1xuXG4gIGV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QgKCBhbmltYXRlICkge1xuICAgIHZhciBub3cgICAgICAgICAgICAgPSB0aW1lc3RhbXAoKTtcbiAgICB2YXIgbmV4dFJlcXVlc3RUaW1lID0gTWF0aC5tYXgoIGxhc3RSZXF1ZXN0VGltZSArIGZyYW1lRHVyYXRpb24sIG5vdyApO1xuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxhc3RSZXF1ZXN0VGltZSA9IG5leHRSZXF1ZXN0VGltZTtcbiAgICAgIGFuaW1hdGUoIG5vdyApO1xuICAgIH0sIG5leHRSZXF1ZXN0VGltZSAtIG5vdyApO1xuICB9O1xuXG4gIGV4cG9ydHMuY2FuY2VsID0gY2xlYXJUaW1lb3V0O1xufSBlbHNlIHtcbiAgZXhwb3J0cy5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdCAoIGFuaW1hdGUgKSB7XG4gICAgcmV0dXJuIHJlcXVlc3RBRiggYW5pbWF0ZSApO1xuICB9O1xuXG4gIGV4cG9ydHMuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsICggaWQgKSB7XG4gICAgcmV0dXJuIGNhbmNlbEFGKCBpZCApO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbm93ID0gcmVxdWlyZSggJy4vbm93JyApO1xudmFyIG5hdmlnYXRvclN0YXJ0O1xuXG5pZiAoIHR5cGVvZiBwZXJmb3JtYW5jZSA9PT0gJ3VuZGVmaW5lZCcgfHwgISBwZXJmb3JtYW5jZS5ub3cgKSB7XG4gIG5hdmlnYXRvclN0YXJ0ID0gbm93KCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0aW1lc3RhbXAgKCkge1xuICAgIHJldHVybiBub3coKSAtIG5hdmlnYXRvclN0YXJ0O1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0aW1lc3RhbXAgKCkge1xuICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF91bmVzY2FwZSA9IHJlcXVpcmUoICcuL2ludGVybmFsL3VuZXNjYXBlJyApO1xuXG52YXIgaXNTeW1ib2wgID0gcmVxdWlyZSggJy4vaXMtc3ltYm9sJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gX3VuZXNjYXBlKCB2YWx1ZSApO1xuICB9XG5cbiAgaWYgKCBpc1N5bWJvbCggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICB2YXIga2V5ID0gJycgKyB2YWx1ZTtcblxuICBpZiAoIGtleSA9PT0gJzAnICYmIDEgLyB2YWx1ZSA9PT0gLUluZmluaXR5ICkge1xuICAgIHJldHVybiAnLTAnO1xuICB9XG5cbiAgcmV0dXJuIF91bmVzY2FwZSgga2V5ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b09iamVjdCAoIHZhbHVlICkge1xuICBpZiAoIHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QoIHZhbHVlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbUVuZCApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmltRW5kICggc3RyaW5nICkge1xuICAgIHJldHVybiAoICcnICsgc3RyaW5nICkudHJpbUVuZCgpO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXRyaW0nICkoIC9bXFxzXFx1RkVGRlxceEEwXSskLyApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbVN0YXJ0ICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW1TdGFydCAoIHN0cmluZyApIHtcbiAgICByZXR1cm4gKCAnJyArIHN0cmluZyApLnRyaW1TdGFydCgpO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXRyaW0nICkoIC9eW1xcc1xcdUZFRkZcXHhBMF0rLyApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbSApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmltICggc3RyaW5nICkge1xuICAgIHJldHVybiAoICcnICsgc3RyaW5nICkudHJpbSgpO1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXRyaW0nICkoIC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGUgPSByZXF1aXJlKCAnLi9jcmVhdGUnICk7XG5cbnZhciBjYWNoZSA9IGNyZWF0ZSggbnVsbCApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHR5cGUgKCB2YWx1ZSApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlO1xuICB9XG5cbiAgaWYgKCB2YWx1ZSA9PT0gbnVsbCApIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG5cbiAgdmFyIHN0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggdmFsdWUgKTtcblxuICBpZiAoICEgY2FjaGVbIHN0cmluZyBdICkge1xuICAgIGNhY2hlWyBzdHJpbmcgXSA9IHN0cmluZy5zbGljZSggOCwgLTEgKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgcmV0dXJuIGNhY2hlWyBzdHJpbmcgXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1lc2NhcGUnICkoIC8mKD86bHR8Z3R8IzM0fCMzOXxhbXApOy9nLCB7XG4gICcmbHQ7JzogICc8JyxcbiAgJyZndDsnOiAgJz4nLFxuICAnJiMzNDsnOiAnXCInLFxuICAnJiMzOTsnOiBcIidcIixcbiAgJyZhbXA7JzogJyYnXG59ICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maXJzdCcgKSggJ3RvVXBwZXJDYXNlJyApO1xuIl19
