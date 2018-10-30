(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports = DOMWrapper;

var _textContent         = require( '../internal/text-content' );
var _first               = require( '../internal/first' );

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
  off:     'off',
  one:     'on',
  on:      'on'
}, function ( name, methodName ) {
  DOMWrapper.prototype[ methodName ] = function ( types, selector, listener, useCapture ) {
    var removeAll = name === 'off' && ! arguments.length;
    var one = name === 'one';
    var element;
    var i;
    var j;
    var l;

    if ( ! removeAll ) {
      if ( ! ( types = types.match( /[^\s\uFEFF\xA0]+/g ) ) ) {
        return this;
      }

      l = types.length;
    }

    // off( types, listener, useCapture )
    // off( types, listener )

    if ( name !== 'trigger' && typeof selector === 'function' ) {
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

},{"../access":21,"../base/base-for-each":31,"../base/base-for-in":32,"../create/create-remove-prop":67,"../event":78,"../get-element-h":91,"../get-element-w":92,"../internal/first":100,"../internal/text-content":102,"../is-array-like-object":107,"../is-dom-element":110,"../parse-html":139,"../props":143,"../support/support-get-attribute":148,"./prototype/css":2,"./prototype/each":3,"./prototype/end":4,"./prototype/eq":5,"./prototype/find":6,"./prototype/first":7,"./prototype/get":8,"./prototype/last":9,"./prototype/map":10,"./prototype/parent":11,"./prototype/ready":12,"./prototype/remove":13,"./prototype/removeAttr":14,"./prototype/removeProp":15,"./prototype/stack":16,"./prototype/style":17,"./prototype/styles":18}],2:[function(require,module,exports){
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
   * Request headers.
   */
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },

  /**
   * Milliseconds after which the request should be canceled.
   */
  timeout: 1000 * 60,

  /**
   * The request method: 'GET', 'POST' (others are ignored, instead, 'GET' will be used).
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
 * @param  {string}        [options.method]  Default to 'GET' when no options or no `data` in
 *                                           options, or 'POST' when `data` in options.
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

    if ( this.status !== 1223 ) {
      status = this.status;
    } else {
      status = 204;
    }

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

  if ( options.method === 'POST' || 'data' in options ) {
    xhr.open( 'POST', path, async );
  } else {
    xhr.open( 'GET', path, async );
  }

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

if ( Object.assign ) {
  module.exports = Object.assign;
} else {
  module.exports = require( './create/create-assign' )( require( './keys' ) );
}

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

var constants               = require( './constants' );
var indexOf                 = require( './index-of' );

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
    if ( p[ i ] === constants.PLACEHOLDER ) {
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
 * @param {function} f The target function that should be bound.
 * @param {*} c The new context for the target function.
 * @param {...*} p The partial arguments, may contain constants.PLACEHOLDER.
 * @example
 *
 * function f ( x, y ) {
 *   return this[ x ] + this[ y ];
 * }
 *
 * const c = {
 *   x: 42,
 *   y: 1
 * };
 *
 * const bound = bind( f, c, constants.PLACEHOLDER, 'y' );
 *
 * bound( 'x' ); // -> 43
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

  if ( indexOf( p, constants.PLACEHOLDER ) < 0 ) {
    return Function.prototype.call.apply( _bind, arguments );
  }

  return function bound () {
    return f.apply( c, process( p, arguments ) );
  };
};

},{"./constants":54,"./index-of":98,"./internal/ArgumentException":99}],46:[function(require,module,exports){
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

var defineProperties = require( './define-properties' );

var setPrototypeOf = require( './set-prototype-of' );

var isPrimitive = require( './is-primitive' );

function C () {}

module.exports = Object.create || function create ( prototype, descriptors ) {
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

},{"./define-properties":73,"./is-primitive":119,"./set-prototype-of":145}],56:[function(require,module,exports){
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

var baseDefineProperty = require( './base/base-define-property' );

var support            = require( './support/support-define-property' );

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

},{"./base/base-define-property":29,"./each":76,"./is-primitive":119,"./support/support-define-property":147}],74:[function(require,module,exports){
'use strict';

var baseDefineProperty = require( './base/base-define-property' );

var support            = require( './support/support-define-property' );

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

},{"./base/base-define-property":29,"./is-primitive":119,"./support/support-define-property":147}],75:[function(require,module,exports){
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
 * @param {Node} element The element to which the listener should be attached.
 * @param {string} type The event type name.
 * @param {string?} selector The selector to which delegate an event.
 * @param {function} listener The event listener.
 * @param {boolean} useCapture
 * @param {boolean} [one] Remove the listener after it first dispatching?
 */

// on( document, 'click', '.post__like-button', ( event ) => {
//   const data = {
//     id: _( this ).parent( '.post' ).attr( 'data-id' )
//   }

//   ajax( '/like', { data } )
// }, false )

exports.on = function on ( element, type, selector, listener, useCapture, one ) {
  var item = {
    useCapture: useCapture,
    listener: listener,
    element: element,
    one: one
  };

  if ( selector ) {
    item.selector = selector;
  }

  if ( support ) {
    item.wrapper = function wrapper ( event, _element ) {
      if ( selector && ! _element && ! ( _element = closestNode( event.target, selector ) ) ) {
        return;
      }

      if ( one ) {
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

      if ( one ) {
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
        item.selector && item.selector !== selector ) ) {
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
          event.on( target, type, null, item.listener, item.useCapture, item.one );
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
  return !! value && typeof value === 'object';
};

},{}],117:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

var toString = {}.toString;

module.exports = function isObject ( value ) {
  return isObjectLike( value ) &&
    toString.call( value ) === '[object Object]';
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
  return ! value ||
    typeof value !== 'object' &&
    typeof value !== 'function';
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

},{"./is-array-like-object":107,"./matches-property":131,"./property":142}],128:[function(require,module,exports){
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

},{"./base/base-keys":37,"./support/support-keys":149,"./to-object":155}],130:[function(require,module,exports){
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
 * @return {[type]}
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
peako.templateRegexps   = require( './template-regexps' );
peako.invert            = require( './invert' );
peako.compound          = require( './compound' );
peako.debounce          = require( './debounce' );

if ( typeof self !== 'undefined' ) {
  self.peako = self._ = peako; // eslint-disable-line no-multi-assign
}

module.exports = peako;

},{"./DOMWrapper":1,"./_":20,"./ajax":23,"./assign":25,"./assign-in":24,"./before":44,"./bind":45,"./clamp":49,"./clone":50,"./compound":53,"./constants":54,"./create":55,"./debounce":70,"./default-to":71,"./defaults":72,"./define-properties":73,"./define-property":74,"./each":76,"./each-right":75,"./escape":77,"./find":82,"./find-index":79,"./find-last":81,"./find-last-index":80,"./for-each":84,"./for-each-right":83,"./for-in":86,"./for-in-right":85,"./for-own":88,"./for-own-right":87,"./from-pairs":90,"./get":95,"./get-prototype-of":93,"./has":96,"./identity":97,"./index-of":98,"./invert":106,"./is-array":109,"./is-array-like":108,"./is-array-like-object":107,"./is-dom-element":110,"./is-finite":111,"./is-length":113,"./is-nan":114,"./is-number":115,"./is-object":117,"./is-object-like":116,"./is-plain-object":118,"./is-primitive":119,"./is-safe-integer":120,"./is-string":121,"./is-symbol":122,"./is-window":124,"./is-window-like":123,"./iteratee":127,"./keys":129,"./keys-in":128,"./last-index-of":130,"./method":134,"./method-of":133,"./mixin":135,"./noop":136,"./now":137,"./once":138,"./property":142,"./property-of":141,"./random":144,"./set":146,"./set-prototype-of":145,"./template":151,"./template-regexps":150,"./timer":152,"./timestamp":153,"./to-object":155,"./trim":158,"./trim-end":156,"./trim-start":157,"./type":159,"./unescape":160}],141:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property-of' )( require( './base/base-property' ) );

},{"./base/base-property":38,"./create/create-property-of":65}],142:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-property' )( require( './base/base-property' ) );

},{"./base/base-property":38,"./create/create-property":66}],143:[function(require,module,exports){
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

},{"./constants":54,"./is-primitive":119}],146:[function(require,module,exports){
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

},{"./base/base-set":41,"./cast-path":48,"./constants":54,"./to-object":155}],147:[function(require,module,exports){
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

module.exports = {
  safe: '<%=\\s*([^]*?)\\s*%>',
  html: '<%-\\s*([^]*?)\\s*%>',
  comm: '<%#([^]*?)%>',
  code: '<%\\s*([^]*?)\\s*%>'
};

},{}],151:[function(require,module,exports){
'use strict';

var regexps = require( './template-regexps' );
var escape  = require( './escape' );

function replacer ( match, safe, html, comm, code ) {
  if ( safe !== null && typeof safe !== 'undefined' ) {
    return "'+_e(" + safe.replace( /\\n/g, '\n' ) + ")+'";
  }

  if ( html !== null && typeof html !== 'undefined' ) {
    return "'+(" + html.replace( /\\n/g, '\n' ) + ")+'";
  }

  if ( code !== null && typeof code !== 'undefined' ) {
    return "';" + code.replace( /\\n/g, '\n' ) + ";_r+='";
  }

  // comment is matched - do nothing
  return '';
}

/**
 * @memberof peako
 * @param {string} source The template source.
 * @example
 * var template = peako.template('<title><%- data.username %></title>');
 * var html = template.render({ username: 'John' });
 * // -> '<title>John</title>'
 */
function template ( source ) {
  var regexp = RegExp( regexps.safe +
    '|' + regexps.html +
    '|' + regexps.comm +
    '|' + regexps.code, 'g' );
  var result = '';
  var _render;

  result += "function print(){_r+=Array.prototype.join.call(arguments,'');}";

  result += "var _r='";

  result += source
    .replace( /\n/g, '\\n' )
    .replace( regexp, replacer );

  result += "';return _r;";

  _render = Function( 'data', '_e', result ); // jshint ignore: line

  return {
    render: function render ( data ) {
      return _render.call( this, data, escape );
    },

    result: result,
    source: source
  };
}

module.exports = template;

},{"./escape":77,"./template-regexps":150}],152:[function(require,module,exports){
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
  module.exports = require( './bind' )( Function.prototype.call, String.prototype.trimEnd );
} else {
  module.exports = require( './create/create-trim' )( /[\s\uFEFF\xA0]+$/ );
}

},{"./bind":45,"./create/create-trim":68}],157:[function(require,module,exports){
'use strict';

if ( String.prototype.trimStart ) {
  module.exports = require( './bind' )( Function.prototype.call, String.prototype.trimStart );
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+/ );
}

},{"./bind":45,"./create/create-trim":68}],158:[function(require,module,exports){
'use strict';

if ( String.prototype.trim ) {
  module.exports = require( './bind' )( Function.prototype.call, String.prototype.trim );
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/ );
}

},{"./bind":45,"./create/create-trim":68}],159:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJET01XcmFwcGVyL2luZGV4LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvY3NzLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZWFjaC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VuZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2VxLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZmluZC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL2ZpcnN0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvZ2V0LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvbGFzdC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL21hcC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3BhcmVudC5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlYWR5LmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvcmVtb3ZlQXR0ci5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3JlbW92ZVByb3AuanMiLCJET01XcmFwcGVyL3Byb3RvdHlwZS9zdGFjay5qcyIsIkRPTVdyYXBwZXIvcHJvdG90eXBlL3N0eWxlLmpzIiwiRE9NV3JhcHBlci9wcm90b3R5cGUvc3R5bGVzLmpzIiwiRXZlbnQuanMiLCJfLmpzIiwiYWNjZXNzLmpzIiwiYWpheC1vcHRpb25zLmpzIiwiYWpheC5qcyIsImFzc2lnbi1pbi5qcyIsImFzc2lnbi5qcyIsImJhc2UvYmFzZS1hc3NpZ24uanMiLCJiYXNlL2Jhc2UtY2xvbmUtYXJyYXkuanMiLCJiYXNlL2Jhc2UtY29weS1hcnJheS5qcyIsImJhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHkuanMiLCJiYXNlL2Jhc2UtZXhlYy5qcyIsImJhc2UvYmFzZS1mb3ItZWFjaC5qcyIsImJhc2UvYmFzZS1mb3ItaW4uanMiLCJiYXNlL2Jhc2UtZ2V0LmpzIiwiYmFzZS9iYXNlLWhhcy5qcyIsImJhc2UvYmFzZS1pbmRleC1vZi5qcyIsImJhc2UvYmFzZS1pbnZva2UuanMiLCJiYXNlL2Jhc2Uta2V5cy5qcyIsImJhc2UvYmFzZS1wcm9wZXJ0eS5qcyIsImJhc2UvYmFzZS1yYW5kb20uanMiLCJiYXNlL2Jhc2UtcmVtb3ZlLWF0dHIuanMiLCJiYXNlL2Jhc2Utc2V0LmpzIiwiYmFzZS9iYXNlLXRvLWluZGV4LmpzIiwiYmFzZS9iYXNlLXZhbHVlcy5qcyIsImJlZm9yZS5qcyIsImJpbmQuanMiLCJjYWxsLWl0ZXJhdGVlLmpzIiwiY2FtZWxpemUuanMiLCJjYXN0LXBhdGguanMiLCJjbGFtcC5qcyIsImNsb25lLmpzIiwiY2xvc2VzdC1ub2RlLmpzIiwiY2xvc2VzdC5qcyIsImNvbXBvdW5kLmpzIiwiY29uc3RhbnRzLmpzIiwiY3JlYXRlLmpzIiwiY3JlYXRlL2NyZWF0ZS1hc3NpZ24uanMiLCJjcmVhdGUvY3JlYXRlLWVhY2guanMiLCJjcmVhdGUvY3JlYXRlLWVzY2FwZS5qcyIsImNyZWF0ZS9jcmVhdGUtZmluZC5qcyIsImNyZWF0ZS9jcmVhdGUtZmlyc3QuanMiLCJjcmVhdGUvY3JlYXRlLWZvci1lYWNoLmpzIiwiY3JlYXRlL2NyZWF0ZS1mb3ItaW4uanMiLCJjcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbi5qcyIsImNyZWF0ZS9jcmVhdGUtaW5kZXgtb2YuanMiLCJjcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mLmpzIiwiY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS5qcyIsImNyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AuanMiLCJjcmVhdGUvY3JlYXRlLXRyaW0uanMiLCJjc3MtbnVtYmVycy5qcyIsImRlYm91bmNlLmpzIiwiZGVmYXVsdC10by5qcyIsImRlZmF1bHRzLmpzIiwiZGVmaW5lLXByb3BlcnRpZXMuanMiLCJkZWZpbmUtcHJvcGVydHkuanMiLCJlYWNoLXJpZ2h0LmpzIiwiZWFjaC5qcyIsImVzY2FwZS5qcyIsImV2ZW50LmpzIiwiZmluZC1pbmRleC5qcyIsImZpbmQtbGFzdC1pbmRleC5qcyIsImZpbmQtbGFzdC5qcyIsImZpbmQuanMiLCJmb3ItZWFjaC1yaWdodC5qcyIsImZvci1lYWNoLmpzIiwiZm9yLWluLXJpZ2h0LmpzIiwiZm9yLWluLmpzIiwiZm9yLW93bi1yaWdodC5qcyIsImZvci1vd24uanMiLCJmcmFnbWVudC5qcyIsImZyb20tcGFpcnMuanMiLCJnZXQtZWxlbWVudC1oLmpzIiwiZ2V0LWVsZW1lbnQtdy5qcyIsImdldC1wcm90b3R5cGUtb2YuanMiLCJnZXQtc3R5bGUuanMiLCJnZXQuanMiLCJoYXMuanMiLCJpZGVudGl0eS5qcyIsImluZGV4LW9mLmpzIiwiaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24uanMiLCJpbnRlcm5hbC9maXJzdC5qcyIsImludGVybmFsL21lbW9pemUuanMiLCJpbnRlcm5hbC90ZXh0LWNvbnRlbnQuanMiLCJpbnRlcm5hbC90eXBlLmpzIiwiaW50ZXJuYWwvdW5lc2NhcGUuanMiLCJpbnRlcm5hbC93b3Jkcy5qcyIsImludmVydC5qcyIsImlzLWFycmF5LWxpa2Utb2JqZWN0LmpzIiwiaXMtYXJyYXktbGlrZS5qcyIsImlzLWFycmF5LmpzIiwiaXMtZG9tLWVsZW1lbnQuanMiLCJpcy1maW5pdGUuanMiLCJpcy1rZXkuanMiLCJpcy1sZW5ndGguanMiLCJpcy1uYW4uanMiLCJpcy1udW1iZXIuanMiLCJpcy1vYmplY3QtbGlrZS5qcyIsImlzLW9iamVjdC5qcyIsImlzLXBsYWluLW9iamVjdC5qcyIsImlzLXByaW1pdGl2ZS5qcyIsImlzLXNhZmUtaW50ZWdlci5qcyIsImlzLXN0cmluZy5qcyIsImlzLXN5bWJvbC5qcyIsImlzLXdpbmRvdy1saWtlLmpzIiwiaXMtd2luZG93LmpzIiwiaXNzZXQuanMiLCJpdGVyYWJsZS5qcyIsIml0ZXJhdGVlLmpzIiwia2V5cy1pbi5qcyIsImtleXMuanMiLCJsYXN0LWluZGV4LW9mLmpzIiwibWF0Y2hlcy1wcm9wZXJ0eS5qcyIsIm1hdGNoZXMtc2VsZWN0b3IuanMiLCJtZXRob2Qtb2YuanMiLCJtZXRob2QuanMiLCJtaXhpbi5qcyIsIm5vb3AuanMiLCJub3cuanMiLCJvbmNlLmpzIiwicGFyc2UtaHRtbC5qcyIsInBlYWtvLmpzIiwicHJvcGVydHktb2YuanMiLCJwcm9wZXJ0eS5qcyIsInByb3BzLmpzIiwicmFuZG9tLmpzIiwic2V0LXByb3RvdHlwZS1vZi5qcyIsInNldC5qcyIsInN1cHBvcnQvc3VwcG9ydC1kZWZpbmUtcHJvcGVydHkuanMiLCJzdXBwb3J0L3N1cHBvcnQtZ2V0LWF0dHJpYnV0ZS5qcyIsInN1cHBvcnQvc3VwcG9ydC1rZXlzLmpzIiwidGVtcGxhdGUtcmVnZXhwcy5qcyIsInRlbXBsYXRlLmpzIiwidGltZXIuanMiLCJ0aW1lc3RhbXAuanMiLCJ0by1rZXkuanMiLCJ0by1vYmplY3QuanMiLCJ0cmltLWVuZC5qcyIsInRyaW0tc3RhcnQuanMiLCJ0cmltLmpzIiwidHlwZS5qcyIsInVuZXNjYXBlLmpzIiwidXBwZXItZmlyc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk9BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTVdyYXBwZXI7XG5cbnZhciBfdGV4dENvbnRlbnQgICAgICAgICA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC90ZXh0LWNvbnRlbnQnICk7XG52YXIgX2ZpcnN0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvZmlyc3QnICk7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQtZ2V0LWF0dHJpYnV0ZScgKTtcblxudmFyIGNyZWF0ZVJlbW92ZVByb3BlcnR5ID0gcmVxdWlyZSggJy4uL2NyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AnICk7XG5cbnZhciBiYXNlRm9yRWFjaCAgICAgICAgICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWVhY2gnICk7XG52YXIgYmFzZUZvckluICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1pbicgKTtcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ICAgID0gcmVxdWlyZSggJy4uL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xudmFyIGlzRE9NRWxlbWVudCAgICAgICAgID0gcmVxdWlyZSggJy4uL2lzLWRvbS1lbGVtZW50JyApO1xudmFyIGdldEVsZW1lbnRXICAgICAgICAgID0gcmVxdWlyZSggJy4uL2dldC1lbGVtZW50LXcnICk7XG52YXIgZ2V0RWxlbWVudEggICAgICAgICAgPSByZXF1aXJlKCAnLi4vZ2V0LWVsZW1lbnQtaCcgKTtcbnZhciBwYXJzZUhUTUwgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9wYXJzZS1odG1sJyApO1xudmFyIGFjY2VzcyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2FjY2VzcycgKTtcbnZhciBldmVudCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9ldmVudCcgKTtcblxudmFyIHJzZWxlY3RvciA9IC9eKD86IyhbXFx3LV0rKXwoW1xcdy1dKyl8XFwuKFtcXHctXSspKSQvO1xuXG5mdW5jdGlvbiBET01XcmFwcGVyICggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG4gIHZhciBtYXRjaDtcbiAgdmFyIGxpc3Q7XG4gIHZhciBpO1xuXG4gIC8vIF8oKTtcblxuICBpZiAoICEgc2VsZWN0b3IgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gXyggd2luZG93ICk7XG5cbiAgaWYgKCBpc0RPTUVsZW1lbnQoIHNlbGVjdG9yICkgKSB7XG4gICAgX2ZpcnN0KCB0aGlzLCBzZWxlY3RvciApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyApIHtcbiAgICBpZiAoIHR5cGVvZiBjb250ZXh0ICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIGlmICggISBjb250ZXh0Ll9wZWFrbyApIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBET01XcmFwcGVyKCBjb250ZXh0ICk7XG4gICAgICB9XG5cbiAgICAgIGlmICggISBjb250ZXh0WyAwIF0gKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29udGV4dCA9IGNvbnRleHRbIDAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGV4dCA9IGRvY3VtZW50O1xuICAgIH1cblxuICAgIGlmICggc2VsZWN0b3IuY2hhckF0KCAwICkgIT09ICc8JyApIHtcbiAgICAgIG1hdGNoID0gcnNlbGVjdG9yLmV4ZWMoIHNlbGVjdG9yICk7XG5cbiAgICAgIC8vIF8oICdhID4gYiArIGMnICk7XG4gICAgICAvLyBfKCAnI2lkJywgJy5hbm90aGVyLWVsZW1lbnQnIClcblxuICAgICAgaWYgKCAhIG1hdGNoIHx8ICEgY29udGV4dC5nZXRFbGVtZW50QnlJZCAmJiBtYXRjaFsgMSBdIHx8ICEgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIG1hdGNoWyAzIF0gKSB7XG4gICAgICAgIGlmICggbWF0Y2hbIDEgXSApIHtcbiAgICAgICAgICBsaXN0ID0gWyBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoIHNlbGVjdG9yICkgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaXN0ID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApO1xuICAgICAgICB9XG5cbiAgICAgIC8vIF8oICcjaWQnICk7XG5cbiAgICAgIH0gZWxzZSBpZiAoIG1hdGNoWyAxIF0gKSB7XG4gICAgICAgIGlmICggKCBsaXN0ID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggbWF0Y2hbIDEgXSApICkgKSB7XG4gICAgICAgICAgX2ZpcnN0KCB0aGlzLCBsaXN0ICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIF8oICd0YWcnICk7XG5cbiAgICAgIH0gZWxzZSBpZiAoIG1hdGNoWyAyIF0gKSB7XG4gICAgICAgIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBtYXRjaFsgMiBdICk7XG5cbiAgICAgIC8vIF8oICcuY2xhc3MnICk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIG1hdGNoWyAzIF0gKTtcbiAgICAgIH1cblxuICAgIC8vIF8oICc8ZGl2PicgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0ID0gcGFyc2VIVE1MKCBzZWxlY3RvciwgY29udGV4dCApO1xuICAgIH1cblxuICAvLyBfKCBbIC4uLiBdICk7XG5cbiAgfSBlbHNlIGlmICggaXNBcnJheUxpa2VPYmplY3QoIHNlbGVjdG9yICkgKSB7XG4gICAgbGlzdCA9IHNlbGVjdG9yO1xuXG4gIC8vIF8oIGZ1bmN0aW9uICggXyApIHsgLi4uIH0gKTtcblxuICB9IGVsc2UgaWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBkb2N1bWVudCApLnJlYWR5KCBzZWxlY3RvciApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFR5cGVFcnJvciggJ0dvdCB1bmV4cGVjdGVkIHNlbGVjdG9yOiAnICsgc2VsZWN0b3IgKyAnLicgKTtcbiAgfVxuXG4gIGlmICggISBsaXN0ICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMubGVuZ3RoID0gbGlzdC5sZW5ndGg7XG5cbiAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgdGhpc1sgaSBdID0gbGlzdFsgaSBdO1xuICB9XG59XG5cbkRPTVdyYXBwZXIucHJvdG90eXBlID0ge1xuICBlYWNoOiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZWFjaCcgKSxcbiAgZW5kOiAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2VuZCcgKSxcbiAgZXE6ICAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2VxJyApLFxuICBmaW5kOiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZmluZCcgKSxcbiAgZmlyc3Q6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL2ZpcnN0JyApLFxuICBnZXQ6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvZ2V0JyApLFxuICBsYXN0OiAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvbGFzdCcgKSxcbiAgbWFwOiAgICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL21hcCcgKSxcbiAgcGFyZW50OiAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3BhcmVudCcgKSxcbiAgcmVhZHk6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3JlYWR5JyApLFxuICByZW1vdmU6ICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVtb3ZlJyApLFxuICByZW1vdmVBdHRyOiByZXF1aXJlKCAnLi9wcm90b3R5cGUvcmVtb3ZlQXR0cicgKSxcbiAgcmVtb3ZlUHJvcDogcmVxdWlyZSggJy4vcHJvdG90eXBlL3JlbW92ZVByb3AnICksXG4gIHN0YWNrOiAgICAgIHJlcXVpcmUoICcuL3Byb3RvdHlwZS9zdGFjaycgKSxcbiAgc3R5bGU6ICAgICAgcmVxdWlyZSggJy4vcHJvdG90eXBlL3N0eWxlJyApLFxuICBzdHlsZXM6ICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvc3R5bGVzJyApLFxuICBjc3M6ICAgICAgICByZXF1aXJlKCAnLi9wcm90b3R5cGUvY3NzJyApLFxuICBjb25zdHJ1Y3RvcjogRE9NV3JhcHBlcixcbiAgbGVuZ3RoOiAwLFxuICBfcGVha286IHRydWVcbn07XG5cbmJhc2VGb3JJbigge1xuICB0cmlnZ2VyOiAndHJpZ2dlcicsXG4gIG9mZjogICAgICdvZmYnLFxuICBvbmU6ICAgICAnb24nLFxuICBvbjogICAgICAnb24nXG59LCBmdW5jdGlvbiAoIG5hbWUsIG1ldGhvZE5hbWUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBtZXRob2ROYW1lIF0gPSBmdW5jdGlvbiAoIHR5cGVzLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG4gICAgdmFyIHJlbW92ZUFsbCA9IG5hbWUgPT09ICdvZmYnICYmICEgYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgb25lID0gbmFtZSA9PT0gJ29uZSc7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG4gICAgdmFyIGo7XG4gICAgdmFyIGw7XG5cbiAgICBpZiAoICEgcmVtb3ZlQWxsICkge1xuICAgICAgaWYgKCAhICggdHlwZXMgPSB0eXBlcy5tYXRjaCggL1teXFxzXFx1RkVGRlxceEEwXSsvZyApICkgKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsID0gdHlwZXMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIG9mZiggdHlwZXMsIGxpc3RlbmVyLCB1c2VDYXB0dXJlIClcbiAgICAvLyBvZmYoIHR5cGVzLCBsaXN0ZW5lciApXG5cbiAgICBpZiAoIG5hbWUgIT09ICd0cmlnZ2VyJyAmJiB0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBsaXN0ZW5lciAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIHVzZUNhcHR1cmUgPSBsaXN0ZW5lcjtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXIgPSBzZWxlY3RvcjtcbiAgICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiB1c2VDYXB0dXJlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHVzZUNhcHR1cmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGVsZW1lbnQgPSB0aGlzWyBpIF07XG5cbiAgICAgIGlmICggcmVtb3ZlQWxsICkge1xuICAgICAgICBldmVudC5vZmYoIGVsZW1lbnQgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoIGogPSAwOyBqIDwgbDsgKytqICkge1xuICAgICAgICAgIGV2ZW50WyBuYW1lIF0oIGVsZW1lbnQsIHR5cGVzWyBqIF0sIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSwgb25lICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0sIHZvaWQgMCwgdHJ1ZSwgWyAndHJpZ2dlcicsICdvZmYnLCAnb25lJywgJ29uJyBdICk7XG5cbmJhc2VGb3JFYWNoKCBbXG4gICdibHVyJywgICAgICAgICdmb2N1cycsICAgICAgICdmb2N1c2luJyxcbiAgJ2ZvY3Vzb3V0JywgICAgJ3Jlc2l6ZScsICAgICAgJ3Njcm9sbCcsXG4gICdjbGljaycsICAgICAgICdkYmxjbGljaycsICAgICdtb3VzZWRvd24nLFxuICAnbW91c2V1cCcsICAgICAnbW91c2Vtb3ZlJywgICAnbW91c2VvdmVyJyxcbiAgJ21vdXNlb3V0JywgICAgJ21vdXNlZW50ZXInLCAgJ21vdXNlbGVhdmUnLFxuICAnY2hhbmdlJywgICAgICAnc2VsZWN0JywgICAgICAnc3VibWl0JyxcbiAgJ2tleWRvd24nLCAgICAgJ2tleXByZXNzJywgICAgJ2tleXVwJyxcbiAgJ2NvbnRleHRtZW51JywgJ3RvdWNoc3RhcnQnLCAgJ3RvdWNobW92ZScsXG4gICd0b3VjaGVuZCcsICAgICd0b3VjaGVudGVyJywgICd0b3VjaGxlYXZlJyxcbiAgJ3RvdWNoY2FuY2VsJywgJ2xvYWQnXG5dLCBmdW5jdGlvbiAoIGV2ZW50VHlwZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIGV2ZW50VHlwZSBdID0gZnVuY3Rpb24gKCBhcmcgKSB7XG4gICAgdmFyIGk7XG4gICAgdmFyIGw7XG5cbiAgICBpZiAoIHR5cGVvZiBhcmcgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmlnZ2VyKCBldmVudFR5cGUsIGFyZyApO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIHRoaXMub24oIGV2ZW50VHlwZSwgYXJndW1lbnRzWyBpIF0sIGZhbHNlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59LCB2b2lkIDAsIHRydWUgKTtcblxuYmFzZUZvckluKCB7XG4gIGRpc2FibGVkOiAnZGlzYWJsZWQnLFxuICBjaGVja2VkOiAgJ2NoZWNrZWQnLFxuICB2YWx1ZTogICAgJ3ZhbHVlJyxcbiAgdGV4dDogICAgICd0ZXh0Q29udGVudCcgaW4gZG9jdW1lbnQuYm9keSA/ICd0ZXh0Q29udGVudCcgOiBfdGV4dENvbnRlbnQsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICBodG1sOiAgICAgJ2lubmVySFRNTCdcbn0sIGZ1bmN0aW9uICgga2V5LCBtZXRob2ROYW1lICkge1xuICBET01XcmFwcGVyLnByb3RvdHlwZVsgbWV0aG9kTmFtZSBdID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICB2YXIgaTtcblxuICAgIGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIGlmICggISAoIGVsZW1lbnQgPSB0aGlzWyAwIF0gKSB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKCB0eXBlb2Yga2V5ICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICByZXR1cm4gZWxlbWVudFsga2V5IF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXkoIGVsZW1lbnQgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggKCBlbGVtZW50ID0gdGhpc1sgaSBdICkubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICAgIGVsZW1lbnRbIGtleSBdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrZXkoIGVsZW1lbnQsIHZhbHVlICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59LCB2b2lkIDAsIHRydWUsIFsgJ2Rpc2FibGVkJywgJ2NoZWNrZWQnLCAndmFsdWUnLCAndGV4dCcsICdodG1sJyBdICk7XG5cbiggZnVuY3Rpb24gKCkge1xuICB2YXIgcHJvcHMgPSByZXF1aXJlKCAnLi4vcHJvcHMnICk7XG5cbiAgZnVuY3Rpb24gX2F0dHIgKCBlbGVtZW50LCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKSB7XG4gICAgaWYgKCBlbGVtZW50Lm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCBwcm9wc1sga2V5IF0gfHwgISBzdXBwb3J0ICkge1xuICAgICAgcmV0dXJuIF9wcm9wKCBlbGVtZW50LCBwcm9wc1sga2V5IF0gfHwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICk7XG4gICAgfVxuXG4gICAgaWYgKCAhIGNoYWluYWJsZSApIHtcbiAgICAgIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZSgga2V5ICk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoIGtleSwgdmFsdWUgKTtcbiAgfVxuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLmF0dHIgPSBmdW5jdGlvbiBhdHRyICgga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbHVlLCBfYXR0ciApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIF9wcm9wICggZWxlbWVudCwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICkge1xuICAgIGlmICggISBjaGFpbmFibGUgKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFsga2V5IF07XG4gICAgfVxuXG4gICAgZWxlbWVudFsga2V5IF0gPSB2YWx1ZTtcbiAgfVxuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLnByb3AgPSBmdW5jdGlvbiBwcm9wICgga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbHVlLCBfcHJvcCApO1xuICB9O1xufSApKCk7XG5cbiggZnVuY3Rpb24gKCkge1xuICB2YXIgX3BlYWtvSWQgPSAwO1xuICB2YXIgX2RhdGEgPSB7fTtcblxuICBmdW5jdGlvbiBfYWNjZXNzRGF0YSAoIGVsZW1lbnQsIGtleSwgdmFsdWUsIGNoYWluYWJsZSApIHtcbiAgICB2YXIgYXR0cmlidXRlcztcbiAgICB2YXIgYXR0cmlidXRlO1xuICAgIHZhciBkYXRhO1xuICAgIHZhciBpO1xuICAgIHZhciBsO1xuXG4gICAgaWYgKCAhIGVsZW1lbnQuX3BlYWtvSWQgKSB7XG4gICAgICBlbGVtZW50Ll9wZWFrb0lkID0gKytfcGVha29JZDtcbiAgICB9XG5cbiAgICBpZiAoICEgKCBkYXRhID0gX2RhdGFbIGVsZW1lbnQuX3BlYWtvSWQgXSApICkge1xuICAgICAgZGF0YSA9IF9kYXRhWyBlbGVtZW50Ll9wZWFrb0lkIF0gPSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cblxuICAgICAgZm9yICggYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlcywgaSA9IDAsIGwgPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgICAgaWYgKCAhICggYXR0cmlidXRlID0gYXR0cmlidXRlc1sgaSBdICkubm9kZU5hbWUuaW5kZXhPZiggJ2RhdGEtJyApICkge1xuICAgICAgICAgIGRhdGFbIGF0dHJpYnV0ZS5ub2RlTmFtZS5zbGljZSggNSApIF0gPSBhdHRyaWJ1dGUubm9kZVZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCBjaGFpbmFibGUgKSB7XG4gICAgICBkYXRhWyBrZXkgXSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGF0YVsga2V5IF07XG4gICAgfVxuICB9XG5cbiAgRE9NV3JhcHBlci5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uIGRhdGEgKCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhY2Nlc3MoIHRoaXMsIGtleSwgdmFsdWUsIF9hY2Nlc3NEYXRhICk7XG4gIH07XG5cbiAgRE9NV3JhcHBlci5wcm90b3R5cGUucmVtb3ZlRGF0YSA9IGNyZWF0ZVJlbW92ZVByb3BlcnR5KCBmdW5jdGlvbiBfcmVtb3ZlRGF0YSAoIGVsZW1lbnQsIGtleSApIHtcbiAgICBpZiAoIGVsZW1lbnQuX3BlYWtvSWQgKSB7XG4gICAgICBkZWxldGUgX2RhdGFbIGVsZW1lbnQuX3BlYWtvSWQgXVsga2V5IF07XG4gICAgfVxuICB9ICk7XG59ICkoKTtcblxuYmFzZUZvckluKCB7IGhlaWdodDogZ2V0RWxlbWVudFcsIHdpZHRoOiBnZXRFbGVtZW50SCB9LCBmdW5jdGlvbiAoIGdldCwgbmFtZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIG5hbWUgXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHRoaXNbIDAgXSApIHtcbiAgICAgIHJldHVybiBnZXQoIHRoaXNbIDAgXSApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xufSwgdm9pZCAwLCB0cnVlLCBbICdoZWlnaHQnLCAnd2lkdGgnIF0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCAnLi4vLi4vaXMtYXJyYXknICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3NzICggaywgdiApIHtcbiAgaWYgKCBpc0FycmF5KCBrICkgKSB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVzKCBrICk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5zdHlsZSggaywgdiApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlYWNoICggZnVuICkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG4gIHZhciBpID0gMDtcblxuICBmb3IgKCA7IGkgPCBsZW47ICsraSApIHtcbiAgICBpZiAoIGZ1bi5jYWxsKCB0aGlzWyBpIF0sIGksIHRoaXNbIGkgXSApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi4nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5kICgpIHtcbiAgcmV0dXJuIHRoaXMuX3ByZXZpb3VzIHx8IG5ldyBET01XcmFwcGVyKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVxICggaW5kZXggKSB7XG4gIHJldHVybiB0aGlzLnN0YWNrKCB0aGlzLmdldCggaW5kZXggKSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLi4nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluZCAoIHNlbGVjdG9yICkge1xuICByZXR1cm4gbmV3IERPTVdyYXBwZXIoIHNlbGVjdG9yLCB0aGlzICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpcnN0ICgpIHtcbiAgcmV0dXJuIHRoaXMuZXEoIDAgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9uZSA9IHJlcXVpcmUoICcuLi8uLi9iYXNlL2Jhc2UtY2xvbmUtYXJyYXknICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0ICggaW5kZXggKSB7XG4gIGlmICggdHlwZW9mIGluZGV4ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gY2xvbmUoIHRoaXMgKTtcbiAgfVxuXG4gIGlmICggaW5kZXggPCAwICkge1xuICAgIHJldHVybiB0aGlzWyB0aGlzLmxlbmd0aCArIGluZGV4IF07XG4gIH1cblxuICByZXR1cm4gdGhpc1sgaW5kZXggXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbGFzdCAoKSB7XG4gIHJldHVybiB0aGlzLmVxKCAtMSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXAgKCBmdW4gKSB7XG4gIHZhciBlbHMgPSB0aGlzLnN0YWNrKCk7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcbiAgdmFyIGVsO1xuICB2YXIgaTtcblxuICBlbHMubGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgZm9yICggaSA9IDA7IGkgPCBsZW47ICsraSApIHtcbiAgICBlbHNbIGkgXSA9IGZ1bi5jYWxsKCBlbCA9IHRoaXNbIGkgXSwgaSwgZWwgKTtcbiAgfVxuXG4gIHJldHVybiBlbHM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCAnLi4vLi4vYmFzZS9iYXNlLWluZGV4LW9mJyApO1xudmFyIG1hdGNoZXMgICAgID0gcmVxdWlyZSggJy4uLy4uL21hdGNoZXMtc2VsZWN0b3InICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyZW50ICggc2VsZWN0b3IgKSB7XG4gIHZhciBlbGVtZW50cyA9IHRoaXMuc3RhY2soKTtcbiAgdmFyIGVsZW1lbnQ7XG4gIHZhciBwYXJlbnQ7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIHBhcmVudCA9ICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlID09PSAxICYmIGVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICAgIGlmICggcGFyZW50ICYmIGJhc2VJbmRleE9mKCBlbGVtZW50cywgcGFyZW50ICkgPCAwICYmICggISBzZWxlY3RvciB8fCBtYXRjaGVzLmNhbGwoIHBhcmVudCwgc2VsZWN0b3IgKSApICkge1xuICAgICAgZWxlbWVudHNbIGVsZW1lbnRzLmxlbmd0aCsrIF0gPSBwYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV2ZW50ID0gcmVxdWlyZSggJy4uLy4uL2V2ZW50JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlYWR5ICggY2IgKSB7XG4gIHZhciBkb2MgPSB0aGlzWyAwIF07XG4gIHZhciByZWFkeVN0YXRlO1xuXG4gIGlmICggISBkb2MgfHwgZG9jLm5vZGVUeXBlICE9PSA5ICkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVhZHlTdGF0ZSA9IGRvYy5yZWFkeVN0YXRlO1xuXG4gIGlmICggZG9jLmF0dGFjaEV2ZW50ID8gcmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJyA6IHJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZXJuYXJ5XG4gICAgZXZlbnQub24oIGRvYywgJ0RPTUNvbnRlbnRMb2FkZWQnLCBudWxsLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjYigpO1xuICAgIH0sIGZhbHNlLCB0cnVlICk7XG4gIH0gZWxzZSB7XG4gICAgY2IoKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmUgKCkge1xuICB2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTtcbiAgdmFyIHBhcmVudE5vZGU7XG4gIHZhciBub2RlVHlwZTtcblxuICBmb3IgKCA7IGkgPj0gMDsgLS1pICkge1xuICAgIG5vZGVUeXBlID0gdGhpc1sgaSBdLm5vZGVUeXBlO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGJyYWNlLXJ1bGVzL2JyYWNlLW9uLXNhbWUtbGluZVxuICAgIGlmICggbm9kZVR5cGUgIT09IDEgJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSAzICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gOCAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDkgJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSAxMSApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICggKCBwYXJlbnROb2RlID0gdGhpc1sgaSBdLnBhcmVudE5vZGUgKSApIHtcbiAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHRoaXNbIGkgXSApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi4vLi4vY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcCcgKSggcmVxdWlyZSggJy4uLy4uL2Jhc2UvYmFzZS1yZW1vdmUtYXR0cicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuLi8uLi9jcmVhdGUvY3JlYXRlLXJlbW92ZS1wcm9wJyApKCBmdW5jdGlvbiBfcmVtb3ZlUHJvcCAoIGVsZW1lbnQsIGtleSApIHtcbiAgZGVsZXRlIGVsZW1lbnRbIGtleSBdO1xufSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2ZpcnN0ICAgICAgICA9IHJlcXVpcmUoICcuLi8uLi9pbnRlcm5hbC9maXJzdCcgKTtcblxudmFyIGJhc2VDb3B5QXJyYXkgPSByZXF1aXJlKCAnLi4vLi4vYmFzZS9iYXNlLWNvcHktYXJyYXknICk7XG5cbnZhciBET01XcmFwcGVyICAgID0gcmVxdWlyZSggJy4uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0YWNrICggZWxlbWVudHMgKSB7XG4gIHZhciB3cmFwcGVyID0gbmV3IERPTVdyYXBwZXIoKTtcblxuICBpZiAoIGVsZW1lbnRzICkge1xuICAgIGlmICggZWxlbWVudHMubGVuZ3RoICkge1xuICAgICAgYmFzZUNvcHlBcnJheSggd3JhcHBlciwgZWxlbWVudHMgKS5sZW5ndGggPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9maXJzdCggd3JhcHBlciwgZWxlbWVudHMgKTtcbiAgICB9XG4gIH1cblxuICB3cmFwcGVyLl9wcmV2aW91cyA9IHdyYXBwZXIucHJldk9iamVjdCA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG5cbiAgcmV0dXJuIHdyYXBwZXI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4uLy4uL2lzLW9iamVjdC1saWtlJyApO1xudmFyIGNzc051bWJlcnMgICA9IHJlcXVpcmUoICcuLi8uLi9jc3MtbnVtYmVycycgKTtcbnZhciBnZXRTdHlsZSAgICAgPSByZXF1aXJlKCAnLi4vLi4vZ2V0LXN0eWxlJyApO1xudmFyIGNhbWVsaXplICAgICA9IHJlcXVpcmUoICcuLi8uLi9jYW1lbGl6ZScgKTtcbnZhciBhY2Nlc3MgICAgICAgPSByZXF1aXJlKCAnLi4vLi4vYWNjZXNzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlICgga2V5LCB2YWwgKSB7XG4gIHZhciBweCA9ICdkby1ub3QtYWRkJztcblxuICAvLyBDb21wdXRlIHB4IG9yIGFkZCAncHgnIHRvIGB2YWxgIG5vdy5cblxuICBpZiAoIHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmICEgY3NzTnVtYmVyc1sgY2FtZWxpemUoIGtleSApIF0gKSB7XG4gICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyApIHtcbiAgICAgIHZhbCArPSAncHgnO1xuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICBweCA9ICdnb3QtYS1mdW5jdGlvbic7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc09iamVjdExpa2UoIGtleSApICkge1xuICAgIHB4ID0gJ2dvdC1hbi1vYmplY3QnO1xuICB9XG5cbiAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWwsIGZ1bmN0aW9uICggZWxlbWVudCwga2V5LCB2YWwsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoIGVsZW1lbnQubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBrZXkgPSBjYW1lbGl6ZSgga2V5ICk7XG5cbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIGdldFN0eWxlKCBlbGVtZW50LCBrZXkgKTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmICggcHggPT09ICdnb3QtYS1mdW5jdGlvbicgfHwgcHggPT09ICdnb3QtYW4tb2JqZWN0JyAmJiAhIGNzc051bWJlcnNbIGtleSBdICkgKSB7XG4gICAgICB2YWwgKz0gJ3B4JztcbiAgICB9XG5cbiAgICBlbGVtZW50LnN0eWxlWyBrZXkgXSA9IHZhbDtcbiAgfSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbWVsaXplID0gcmVxdWlyZSggJy4uLy4uL2NhbWVsaXplJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlcyAoIGtleXMgKSB7XG4gIHZhciBlbGVtZW50ID0gdGhpc1sgMCBdO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBjb21wdXRlZDtcbiAgdmFyIHZhbHVlO1xuICB2YXIga2V5O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBrZXkgPSBrZXlzWyBpIF07XG5cbiAgICBpZiAoICEgY29tcHV0ZWQgKSB7XG4gICAgICB2YWx1ZSA9IGVsZW1lbnQuc3R5bGVbICgga2V5ID0gY2FtZWxpemUoIGtleSApICkgXTtcbiAgICB9XG5cbiAgICBpZiAoICEgdmFsdWUgKSB7XG4gICAgICBpZiAoICEgY29tcHV0ZWQgKSB7XG4gICAgICAgIGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbWVudCApO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoIGtleSApO1xuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlQXNzaWduID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWFzc2lnbicgKTtcblxudmFyIGlzc2V0ICAgICAgPSByZXF1aXJlKCAnLi9pc3NldCcgKTtcbnZhciBrZXlzICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxudmFyIGRlZmF1bHRzID0gW1xuICAnYWx0S2V5JywgICAgICAgICdidWJibGVzJywgICAgICAgICdjYW5jZWxhYmxlJyxcbiAgJ2NhbmNlbEJ1YmJsZScsICAnY2hhbmdlZFRvdWNoZXMnLCAnY3RybEtleScsXG4gICdjdXJyZW50VGFyZ2V0JywgJ2RldGFpbCcsICAgICAgICAgJ2V2ZW50UGhhc2UnLFxuICAnbWV0YUtleScsICAgICAgICdwYWdlWCcsICAgICAgICAgICdwYWdlWScsXG4gICdzaGlmdEtleScsICAgICAgJ3ZpZXcnLCAgICAgICAgICAgJ2NoYXInLFxuICAnY2hhckNvZGUnLCAgICAgICdrZXknLCAgICAgICAgICAgICdrZXlDb2RlJyxcbiAgJ2J1dHRvbicsICAgICAgICAnYnV0dG9ucycsICAgICAgICAnY2xpZW50WCcsXG4gICdjbGllbnRZJywgICAgICAgJ29mZnNldFgnLCAgICAgICAgJ29mZnNldFknLFxuICAncG9pbnRlcklkJywgICAgICdwb2ludGVyVHlwZScsICAgICdyZWxhdGVkVGFyZ2V0JyxcbiAgJ3JldHVyblZhbHVlJywgICAnc2NyZWVuWCcsICAgICAgICAnc2NyZWVuWScsXG4gICd0YXJnZXRUb3VjaGVzJywgJ3RvRWxlbWVudCcsICAgICAgJ3RvdWNoZXMnLFxuICAnaXNUcnVzdGVkJ1xuXTtcblxuZnVuY3Rpb24gRXZlbnQgKCBvcmlnaW5hbCwgb3B0aW9ucyApIHtcbiAgdmFyIGk7XG4gIHZhciBrO1xuXG4gIGlmICggdHlwZW9mIG9yaWdpbmFsID09PSAnb2JqZWN0JyApIHtcbiAgICBmb3IgKCBpID0gZGVmYXVsdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoIGlzc2V0KCBrID0gZGVmYXVsdHNbIGkgXSwgb3JpZ2luYWwgKSApIHtcbiAgICAgICAgdGhpc1sgayBdID0gb3JpZ2luYWxbIGsgXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIG9yaWdpbmFsLnRhcmdldCApIHtcbiAgICAgIGlmICggb3JpZ2luYWwudGFyZ2V0Lm5vZGVUeXBlID09PSAzICkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsLnRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBvcmlnaW5hbC50YXJnZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5hbCA9IHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuICAgIHRoaXMud2hpY2ggPSBFdmVudC53aGljaCggb3JpZ2luYWwgKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmlzVHJ1c3RlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygb3JpZ2luYWwgPT09ICdzdHJpbmcnICkge1xuICAgIHRoaXMudHlwZSA9IG9yaWdpbmFsO1xuICB9IGVsc2UgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgKSB7XG4gICAgdGhpcy50eXBlID0gb3B0aW9ucztcbiAgfVxuXG4gIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICkge1xuICAgIGJhc2VBc3NpZ24oIHRoaXMsIG9wdGlvbnMsIGtleXMoIG9wdGlvbnMgKSApO1xuICB9XG59XG5cbkV2ZW50LnByb3RvdHlwZSA9IHtcbiAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0ICgpIHtcbiAgICBpZiAoIHRoaXMub3JpZ2luYWwgKSB7XG4gICAgICBpZiAoIHRoaXMub3JpZ2luYWwucHJldmVudERlZmF1bHQgKSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHRoaXMub3JpZ2luYWwucmV0dXJuVmFsdWU7XG4gICAgfVxuICB9LFxuXG4gIHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uICgpIHtcbiAgICBpZiAoIHRoaXMub3JpZ2luYWwgKSB7XG4gICAgICBpZiAoIHRoaXMub3JpZ2luYWwuc3RvcFByb3BhZ2F0aW9uICkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IHRoaXMub3JpZ2luYWwuY2FuY2VsQnViYmxlO1xuICAgIH1cbiAgfSxcblxuICBjb25zdHJ1Y3RvcjogRXZlbnRcbn07XG5cbkV2ZW50LndoaWNoID0gZnVuY3Rpb24gd2hpY2ggKCBldmVudCApIHtcbiAgaWYgKCBldmVudC53aGljaCApIHtcbiAgICByZXR1cm4gZXZlbnQud2hpY2g7XG4gIH1cblxuICBpZiAoICEgZXZlbnQudHlwZS5pbmRleE9mKCAna2V5JyApICkge1xuICAgIGlmICggdHlwZW9mIGV2ZW50LmNoYXJDb2RlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHJldHVybiBldmVudC5jaGFyQ29kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXZlbnQua2V5Q29kZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIGV2ZW50LmJ1dHRvbiA9PT0gJ3VuZGVmaW5lZCcgfHwgISAvXig/Om1vdXNlfHBvaW50ZXJ8Y29udGV4dG1lbnV8ZHJhZ3xkcm9wKXxjbGljay8udGVzdCggZXZlbnQudHlwZSApICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCBldmVudC5idXR0b24gJiAxICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmICggZXZlbnQuYnV0dG9uICYgMiApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG4gICAgcmV0dXJuIDM7XG4gIH1cblxuICBpZiAoIGV2ZW50LmJ1dHRvbiAmIDQgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICAgIHJldHVybiAyO1xuICB9XG5cbiAgcmV0dXJuIDA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuL0RPTVdyYXBwZXInICk7XG5cbmZ1bmN0aW9uIF8gKCBzZWxlY3RvciwgY29udGV4dCApIHtcbiAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBzZWxlY3RvciwgY29udGV4dCApO1xufVxuXG5fLmZuID0gXy5wcm90b3R5cGUgPSBET01XcmFwcGVyLnByb3RvdHlwZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbl8uZm4uY29uc3RydWN0b3IgPSBfO1xuXG5tb2R1bGUuZXhwb3J0cyA9IF87XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbnZhciB0eXBlICAgICAgID0gcmVxdWlyZSggJy4vdHlwZScgKTtcbnZhciBrZXlzICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxuZnVuY3Rpb24gYWNjZXNzICggb2JqLCBrZXksIHZhbCwgZm4sIF9ub0NoZWNrICkge1xuICB2YXIgY2hhaW5hYmxlID0gX25vQ2hlY2sgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG4gIHZhciBidWxrID0ga2V5ID09PSBudWxsIHx8IGtleSA9PT0gJ3VuZGVmaW5lZCc7XG4gIHZhciBsZW4gPSBvYmoubGVuZ3RoO1xuICB2YXIgcmF3ID0gZmFsc2U7XG4gIHZhciBlO1xuICB2YXIgaztcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggISBfbm9DaGVjayAmJiB0eXBlKCBrZXkgKSA9PT0gJ29iamVjdCcgKSB7XG4gICAgZm9yICggaSA9IDAsIGsgPSBrZXlzKCBrZXkgKSwgbCA9IGsubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgYWNjZXNzKCBvYmosIGtbIGkgXSwga2V5WyBrWyBpIF0gXSwgZm4sIHRydWUgKTtcbiAgICB9XG5cbiAgICBjaGFpbmFibGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICBpZiAoIHR5cGVvZiB2YWwgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByYXcgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICggYnVsayApIHtcbiAgICAgIGlmICggcmF3ICkge1xuICAgICAgICBmbi5jYWxsKCBvYmosIHZhbCApO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWxrID0gZm47XG5cbiAgICAgICAgZm4gPSBmdW5jdGlvbiAoIGUsIGtleSwgdmFsICkge1xuICAgICAgICAgIHJldHVybiBidWxrLmNhbGwoIG5ldyBET01XcmFwcGVyKCBlICksIHZhbCApO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggZm4gKSB7XG4gICAgICBmb3IgKCBpID0gMDsgaSA8IGxlbjsgKytpICkge1xuICAgICAgICBlID0gb2JqWyBpIF07XG5cbiAgICAgICAgaWYgKCByYXcgKSB7XG4gICAgICAgICAgZm4oIGUsIGtleSwgdmFsLCB0cnVlICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm4oIGUsIGtleSwgdmFsLmNhbGwoIGUsIGksIGZuKCBlLCBrZXkgKSApLCB0cnVlICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFpbmFibGUgPSB0cnVlO1xuICB9XG5cbiAgaWYgKCBjaGFpbmFibGUgKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGlmICggYnVsayApIHtcbiAgICByZXR1cm4gZm4uY2FsbCggb2JqICk7XG4gIH1cblxuICBpZiAoIGxlbiApIHtcbiAgICByZXR1cm4gZm4oIG9ialsgMCBdLCBrZXkgKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFjY2VzcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJvcGVydHkge09iamVjdH0gaGVhZGVyc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHRpbWVvdXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRob2RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgaGVhZGVycy5cbiAgICovXG4gIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCdcbiAgfSxcblxuICAvKipcbiAgICogTWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSByZXF1ZXN0IHNob3VsZCBiZSBjYW5jZWxlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDEwMDAgKiA2MCxcblxuICAvKipcbiAgICogVGhlIHJlcXVlc3QgbWV0aG9kOiAnR0VUJywgJ1BPU1QnIChvdGhlcnMgYXJlIGlnbm9yZWQsIGluc3RlYWQsICdHRVQnIHdpbGwgYmUgdXNlZCkuXG4gICAqL1xuICBtZXRob2Q6ICdHRVQnXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIHR5cGVvZiBxcyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gIHZhciBxcztcblxuICB0cnkge1xuICAgIHFzID0gcmVxdWlyZSggJ3FzJyApO1xuICB9IGNhdGNoICggZXJyb3IgKSB7fVxufVxuXG52YXIgX29wdGlvbnMgPSByZXF1aXJlKCAnLi9hamF4LW9wdGlvbnMnICk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCAnLi9kZWZhdWx0cycgKTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgWE1MSHR0cFJlcXVlc3Q6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTU3MjY4XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjcmVhdGVIVFRQUmVxdWVzdCAoKSB7XG4gIHZhciBIVFRQRmFjdG9yaWVzOyB2YXIgaTtcblxuICBIVFRQRmFjdG9yaWVzID0gW1xuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwzLlhNTEhUVFAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMi5YTUxIVFRQLjYuMCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwyLlhNTEhUVFAuMy4wJyApO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNc3htbDIuWE1MSFRUUCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTWljcm9zb2Z0LlhNTEhUVFAnICk7XG4gICAgfVxuICBdO1xuXG4gIGZvciAoIGkgPSAwOyBpIDwgSFRUUEZhY3Rvcmllcy5sZW5ndGg7ICsraSApIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICggY3JlYXRlSFRUUFJlcXVlc3QgPSBIVFRQRmFjdG9yaWVzWyBpIF0gKSgpO1xuICAgIH0gY2F0Y2ggKCBleCApIHt9XG4gIH1cblxuICB0aHJvdyBFcnJvciggJ2Nhbm5vdCBjcmVhdGUgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0JyApO1xufVxuXG4vKipcbiAqIEBtZXRob2QgcGVha28uYWpheFxuICogQHBhcmFtICB7c3RyaW5nfG9iamVjdH0gcGF0aCAgICAgICAgICAgICAgQSBVUkwgb3Igb3B0aW9ucy5cbiAqIEBwYXJhbSAge29iamVjdH0gICAgICAgIFtvcHRpb25zXSAgICAgICAgIEFuIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICBbb3B0aW9ucy5wYXRoXSAgICBBIFVSTC5cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgIFtvcHRpb25zLm1ldGhvZF0gIERlZmF1bHQgdG8gJ0dFVCcgd2hlbiBubyBvcHRpb25zIG9yIG5vIGBkYXRhYCBpblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucywgb3IgJ1BPU1QnIHdoZW4gYGRhdGFgIGluIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICAgICBbb3B0aW9ucy5hc3luY10gICBEZWZhdWx0IHRvIGB0cnVlYCB3aGVuIG9wdGlvbnMgc3BlY2lmaWVkLCBvciBgZmFsc2VgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG5vIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICBbb3B0aW9ucy5zdWNjZXNzXSBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgc2VydmVyIHJlc3BvbmQgd2l0aCAyeHggc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLlxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgW29wdGlvbnMuZXJyb3JdICAgV2lsbCBiZSBjYWxsZWQgd2hlbiBhIHNlcnZlciByZXNwb25kIHdpdGggb3RoZXIgc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlIG9yIGFuIGVycm9yIG9jY3VycyB3aGlsZSBwYXJzaW5nIHJlc3BvbnNlLlxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgICAgICAgICAgUmV0dXJucyBhIHJlc3BvbnNlIGRhdGEgaWYgYSByZXF1ZXN0IHdhcyBzeW5jaHJvbm91c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcndpc2UgYG51bGxgLlxuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0PC9jYXB0aW9uPlxuICogdmFyIGRhdGEgPSBhamF4KCcuL2RhdGEuanNvbicpO1xuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0LCB3aXRoIGNhbGxiYWNrczwvY2FwdGlvbj5cbiAqIHZhciBkYXRhID0gYWpheCgnLi9kYXRhLmpzb24nLCB7XG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGFzeW5jOiAgIGZhbHNlXG4gKiB9KTtcbiAqXG4gKiBmdW5jdGlvbiBzdWNjZXNzKHNhbWVEYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKHNhbWVEYXRhKTtcbiAqIH1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPkFzeW5jaHJvbm91cyBQT1NUIHJlcXVlc3Q8L2NhcHRpb24+XG4gKiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gKiAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSB8fCB0aGlzLnN0YXR1cyArICc6ICcgKyB0aGlzLnN0YXR1c1RleHQpO1xuICogfVxuICpcbiAqIHZhciBoZWFkZXJzID0ge1xuICogICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gKiB9O1xuICpcbiAqIHZhciBkYXRhID0ge1xuICogICB1c2VybmFtZTogZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnVzZXJuYW1lLnZhbHVlLFxuICogICBzZXg6ICAgICAgZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnNleC52YWx1ZVxuICogfVxuICpcbiAqIGFqYXgoJy9hcGkvc2lnbnVwLz9zdGVwPTAnLCB7XG4gKiAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGVycm9yOiAgIGVycm9yLFxuICogICBkYXRhOiAgICBkYXRhXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gYWpheCAoIHBhdGgsIG9wdGlvbnMgKSB7XG4gIHZhciB0aW1lb3V0SWQgPSBudWxsO1xuICB2YXIgZGF0YSA9IG51bGw7XG4gIHZhciB4aHIgPSBjcmVhdGVIVFRQUmVxdWVzdCgpO1xuICB2YXIgcmVxQ29udGVudFR5cGU7XG4gIHZhciBhc3luYztcbiAgdmFyIG5hbWU7XG5cbiAgLy8gXy5hamF4KCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIGlmICggdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnICkge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0cyggX29wdGlvbnMsIHBhdGggKTtcbiAgICBhc3luYyA9ICEgKCAnYXN5bmMnIGluIG9wdGlvbnMgKSB8fCBvcHRpb25zLmFzeW5jO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGg7XG5cbiAgLy8gXy5hamF4KCBwYXRoICk7XG4gIC8vIGFzeW5jID0gZmFsc2VcbiAgfSBlbHNlIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMgPT09IG51bGwgKSB7XG4gICAgb3B0aW9ucyA9IF9vcHRpb25zO1xuICAgIGFzeW5jID0gZmFsc2U7XG5cbiAgLy8gXy5hamF4KCBwYXRoLCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzKCBfb3B0aW9ucywgb3B0aW9ucyApO1xuICAgIGFzeW5jID0gISAoICdhc3luYycgaW4gb3B0aW9ucyApIHx8IG9wdGlvbnMuYXN5bmM7XG4gIH1cblxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXNDb250ZW50VHlwZTtcbiAgICB2YXIgc3RhdHVzO1xuICAgIHZhciBvYmplY3Q7XG4gICAgdmFyIGVycm9yO1xuXG4gICAgaWYgKCB0aGlzLnJlYWR5U3RhdGUgIT09IDQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCB0aGlzLnN0YXR1cyAhPT0gMTIyMyApIHtcbiAgICAgIHN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgPSAyMDQ7XG4gICAgfVxuXG4gICAgcmVzQ29udGVudFR5cGUgPSB0aGlzLmdldFJlc3BvbnNlSGVhZGVyKCAnY29udGVudC10eXBlJyApO1xuXG4gICAgb2JqZWN0ID0ge1xuICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICBwYXRoOiBwYXRoXG4gICAgfTtcblxuICAgIGRhdGEgPSB0aGlzLnJlc3BvbnNlVGV4dDtcblxuICAgIGlmICggcmVzQ29udGVudFR5cGUgKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoICEgcmVzQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL2pzb24nICkgKSB7XG4gICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoIGRhdGEgKTtcbiAgICAgICAgfSBlbHNlIGlmICggISByZXNDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyApICkge1xuICAgICAgICAgIGRhdGEgPSBxcy5wYXJzZSggZGF0YSApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggX2Vycm9yICkge1xuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCAhIGVycm9yICYmIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwICkge1xuICAgICAgaWYgKCB0aW1lb3V0SWQgIT09IG51bGwgKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgICB9XG5cbiAgICAgIGlmICggb3B0aW9ucy5zdWNjZXNzICkge1xuICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuY2FsbCggdGhpcywgZGF0YSwgb2JqZWN0ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICggb3B0aW9ucy5lcnJvciApIHtcbiAgICAgIG9wdGlvbnMuZXJyb3IuY2FsbCggdGhpcywgZGF0YSwgb2JqZWN0ICk7XG4gICAgfVxuICB9O1xuXG4gIGlmICggb3B0aW9ucy5tZXRob2QgPT09ICdQT1NUJyB8fCAnZGF0YScgaW4gb3B0aW9ucyApIHtcbiAgICB4aHIub3BlbiggJ1BPU1QnLCBwYXRoLCBhc3luYyApO1xuICB9IGVsc2Uge1xuICAgIHhoci5vcGVuKCAnR0VUJywgcGF0aCwgYXN5bmMgKTtcbiAgfVxuXG4gIGlmICggb3B0aW9ucy5oZWFkZXJzICkge1xuICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucy5oZWFkZXJzICkge1xuICAgICAgaWYgKCAhIGhhc093blByb3BlcnR5LmNhbGwoIG9wdGlvbnMuaGVhZGVycywgbmFtZSApICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnICkge1xuICAgICAgICByZXFDb250ZW50VHlwZSA9IG9wdGlvbnMuaGVhZGVyc1sgbmFtZSBdO1xuICAgICAgfVxuXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggbmFtZSwgb3B0aW9ucy5oZWFkZXJzWyBuYW1lIF0gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGFzeW5jICYmIHR5cGVvZiBvcHRpb25zLnRpbWVvdXQgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMudGltZW91dCAhPT0gbnVsbCApIHtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICB4aHIuYWJvcnQoKTtcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQgKTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHJlcUNvbnRlbnRUeXBlICE9PSAndW5kZWZpbmVkJyAmJiByZXFDb250ZW50VHlwZSAhPT0gbnVsbCAmJiAnZGF0YScgaW4gb3B0aW9ucyApIHtcbiAgICBpZiAoICEgcmVxQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL2pzb24nICkgKSB7XG4gICAgICB4aHIuc2VuZCggSlNPTi5zdHJpbmdpZnkoIG9wdGlvbnMuZGF0YSApICk7XG4gICAgfSBlbHNlIGlmICggISByZXFDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyApICkge1xuICAgICAgeGhyLnNlbmQoIHFzLnN0cmluZ2lmeSggb3B0aW9ucy5kYXRhICkgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLnNlbmQoIG9wdGlvbnMuZGF0YSApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWFzc2lnbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIE9iamVjdC5hc3NpZ24gKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbjtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1hc3NpZ24nICkoIHJlcXVpcmUoICcuL2tleXMnICkgKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlQXNzaWduICggb2JqLCBzcmMsIGsgKSB7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGsubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIG9ialsga1sgaSBdIF0gPSBzcmNbIGtbIGkgXSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUNsb25lQXJyYXkgKCBpdGVyYWJsZSApIHtcbiAgdmFyIGkgPSBpdGVyYWJsZS5sZW5ndGg7XG4gIHZhciBjbG9uZSA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICBpZiAoIGlzc2V0KCBpLCBpdGVyYWJsZSApICkge1xuICAgICAgY2xvbmVbIGkgXSA9IGl0ZXJhYmxlWyBpIF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNsb25lO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHRhcmdldCwgc291cmNlICkge1xuICBmb3IgKCB2YXIgaSA9IHNvdXJjZS5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICB0YXJnZXRbIGkgXSA9IHNvdXJjZVsgaSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbnZhciBkZWZpbmVHZXR0ZXIgPSBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG52YXIgZGVmaW5lU2V0dGVyID0gT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZVNldHRlcl9fO1xuXG5mdW5jdGlvbiBiYXNlRGVmaW5lUHJvcGVydHkgKCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApIHtcbiAgdmFyIGhhc0dldHRlciA9IGlzc2V0KCAnZ2V0JywgZGVzY3JpcHRvciApO1xuICB2YXIgaGFzU2V0dGVyID0gaXNzZXQoICdzZXQnLCBkZXNjcmlwdG9yICk7XG4gIHZhciBnZXQ7XG4gIHZhciBzZXQ7XG5cbiAgaWYgKCBoYXNHZXR0ZXIgfHwgaGFzU2V0dGVyICkge1xuICAgIGlmICggaGFzR2V0dGVyICYmIHR5cGVvZiggZ2V0ID0gZGVzY3JpcHRvci5nZXQgKSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ0dldHRlciBtdXN0IGJlIGEgZnVuY3Rpb246ICcgKyBnZXQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGhhc1NldHRlciAmJiB0eXBlb2YoIHNldCA9IGRlc2NyaXB0b3Iuc2V0ICkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uOiAnICsgc2V0ICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggJ3dyaXRhYmxlJywgZGVzY3JpcHRvciApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnSW52YWxpZCBwcm9wZXJ0eSBkZXNjcmlwdG9yLiBDYW5ub3QgYm90aCBzcGVjaWZ5IGFjY2Vzc29ycyBhbmQgYSB2YWx1ZSBvciB3cml0YWJsZSBhdHRyaWJ1dGUnICk7XG4gICAgfVxuXG4gICAgaWYgKCBkZWZpbmVHZXR0ZXIgKSB7XG4gICAgICBpZiAoIGhhc0dldHRlciApIHtcbiAgICAgICAgZGVmaW5lR2V0dGVyLmNhbGwoIG9iamVjdCwga2V5LCBnZXQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBoYXNTZXR0ZXIgKSB7XG4gICAgICAgIGRlZmluZVNldHRlci5jYWxsKCBvYmplY3QsIGtleSwgc2V0ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKCAnQ2Fubm90IGRlZmluZSBhIGdldHRlciBvciBzZXR0ZXInICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc3NldCggJ3ZhbHVlJywgZGVzY3JpcHRvciApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICB9IGVsc2UgaWYgKCAhIGlzc2V0KCBrZXksIG9iamVjdCApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSB2b2lkIDA7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VEZWZpbmVQcm9wZXJ0eTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRXhlYyAoIHJlZ2V4cCwgc3RyaW5nICkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciB2YWx1ZTtcblxuICByZWdleHAubGFzdEluZGV4ID0gMDtcblxuICB3aGlsZSAoICggdmFsdWUgPSByZWdleHAuZXhlYyggc3RyaW5nICkgKSApIHtcbiAgICByZXN1bHQucHVzaCggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEl0ZXJhdGVlID0gcmVxdWlyZSggJy4uL2NhbGwtaXRlcmF0ZWUnICk7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VGb3JFYWNoICggYXJyLCBmbiwgY3R4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciBpO1xuICB2YXIgajtcblxuICBmb3IgKCBpID0gLTEsIGogPSBhcnIubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBpZHggPSBqO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZHggPSArK2k7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggaWR4LCBhcnIgKSAmJiBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIGFyclsgaWR4IF0sIGlkeCwgYXJyICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFycjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRm9ySW4gKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCwga2V5cyApIHtcbiAgdmFyIGtleTtcbiAgdmFyIGk7XG4gIHZhciBqO1xuXG4gIGZvciAoIGkgPSAtMSwgaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBrZXkgPSBrZXlzWyBqIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IGtleXNbICsraSBdO1xuICAgIH1cblxuICAgIGlmICggY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCBvYmpbIGtleSBdLCBrZXksIG9iaiApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUdldCAoIG9iaiwgcGF0aCwgb2ZmICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGggLSBvZmY7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlSGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGg7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZVRvSW5kZXggPSByZXF1aXJlKCAnLi9iYXNlLXRvLWluZGV4JyApO1xuXG52YXIgaW5kZXhPZiAgICAgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZjtcbnZhciBsYXN0SW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcblxuZnVuY3Rpb24gYmFzZUluZGV4T2YgKCBhcnIsIHNlYXJjaCwgZnJvbUluZGV4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuICB2YXIgajtcbiAgdmFyIGw7XG5cbiAgLy8gdXNlIHRoZSBuYXRpdmUgZnVuY3Rpb24gaWYgaXQgaXMgc3VwcG9ydGVkIGFuZCB0aGUgc2VhcmNoIGlzIG5vdCBuYW4uXG5cbiAgaWYgKCBzZWFyY2ggPT09IHNlYXJjaCAmJiAoIGlkeCA9IGZyb21SaWdodCA/IGxhc3RJbmRleE9mIDogaW5kZXhPZiApICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgICByZXR1cm4gaWR4LmNhbGwoIGFyciwgc2VhcmNoLCBmcm9tSW5kZXggKTtcbiAgfVxuXG4gIGwgPSBhcnIubGVuZ3RoO1xuXG4gIGlmICggISBsICkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGogPSBsIC0gMTtcblxuICBpZiAoIHR5cGVvZiBmcm9tSW5kZXggIT09ICd1bmRlZmluZWQnICkge1xuICAgIGZyb21JbmRleCA9IGJhc2VUb0luZGV4KCBmcm9tSW5kZXgsIGwgKTtcblxuICAgIGlmICggZnJvbVJpZ2h0ICkge1xuICAgICAgaiA9IE1hdGgubWluKCBqLCBmcm9tSW5kZXggKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaiA9IE1hdGgubWF4KCAwLCBmcm9tSW5kZXggKTtcbiAgICB9XG5cbiAgICBpID0gaiAtIDE7XG4gIH0gZWxzZSB7XG4gICAgaSA9IC0xO1xuICB9XG5cbiAgZm9yICggOyBqID49IDA7IC0taiApIHtcbiAgICBpZiAoIGZyb21SaWdodCApIHtcbiAgICAgIGlkeCA9IGo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkeCA9ICsraTtcbiAgICB9XG5cbiAgICB2YWwgPSBhcnJbIGlkeCBdO1xuXG4gICAgaWYgKCB2YWwgPT09IHNlYXJjaCB8fCBzZWFyY2ggIT09IHNlYXJjaCAmJiB2YWwgIT09IHZhbCApIHtcbiAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0ID0gcmVxdWlyZSggJy4vYmFzZS1nZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUludm9rZSAoIG9iamVjdCwgcGF0aCwgYXJncyApIHtcbiAgaWYgKCBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCBwYXRoLmxlbmd0aCA8PSAxICkge1xuICAgICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgMCBdIF0uYXBwbHkoIG9iamVjdCwgYXJncyApO1xuICAgIH1cblxuICAgIGlmICggKCBvYmplY3QgPSBnZXQoIG9iamVjdCwgcGF0aCwgMSApICkgKSB7XG4gICAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyBwYXRoLmxlbmd0aCAtIDEgXSBdLmFwcGx5KCBvYmplY3QsIGFyZ3MgKTtcbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0ICAgICA9IHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQta2V5cycgKTtcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4vYmFzZS1pbmRleC1vZicgKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuaWYgKCBzdXBwb3J0ID09PSAnaGFzLWEtYnVnJyApIHtcbiAgdmFyIF9rZXlzID0gW1xuICAgICd0b1N0cmluZycsXG4gICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAndmFsdWVPZicsXG4gICAgJ2hhc093blByb3BlcnR5JyxcbiAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgICAnY29uc3RydWN0b3InXG4gIF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUtleXMgKCBvYmplY3QgKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciBrZXk7XG4gIHZhciBpO1xuXG4gIGZvciAoIGtleSBpbiBvYmplY3QgKSB7XG4gICAgaWYgKCBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3QsIGtleSApICkge1xuICAgICAga2V5cy5wdXNoKCBrZXkgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIHN1cHBvcnQgPT09ICdoYXMtYS1idWcnICkge1xuICAgIGZvciAoIGkgPSBfa2V5cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggYmFzZUluZGV4T2YoIGtleXMsIF9rZXlzWyBpIF0gKSA8IDAgJiYgaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0LCBfa2V5c1sgaSBdICkgKSB7XG4gICAgICAgIGtleXMucHVzaCggX2tleXNbIGkgXSApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldCA9IHJlcXVpcmUoICcuL2Jhc2UtZ2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VQcm9wZXJ0eSAoIG9iamVjdCwgcGF0aCApIHtcbiAgaWYgKCBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCBwYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICByZXR1cm4gZ2V0KCBvYmplY3QsIHBhdGgsIDAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyAwIF0gXTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlUmFuZG9tICggbG93ZXIsIHVwcGVyICkge1xuICByZXR1cm4gbG93ZXIgKyBNYXRoLnJhbmRvbSgpICogKCB1cHBlciAtIGxvd2VyICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvcHMgPSByZXF1aXJlKCAnLi4vcHJvcHMnICk7XG5cbmlmICggcmVxdWlyZSggJy4uL3N1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlJyApICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9yZW1vdmVBdHRyICggZWxlbWVudCwga2V5ICkge1xuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCBrZXkgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3JlbW92ZUF0dHIgKCBlbGVtZW50LCBrZXkgKSB7XG4gICAgZGVsZXRlIGVsZW1lbnRbIHByb3BzWyBrZXkgXSB8fCBrZXkgXTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzc2V0ID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VTZXQgKCBvYmosIHBhdGgsIHZhbCApIHtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IHBhdGgubGVuZ3RoO1xuICB2YXIga2V5O1xuXG4gIGZvciAoIDsgaSA8IGw7ICsraSApIHtcbiAgICBrZXkgPSBwYXRoWyBpIF07XG5cbiAgICBpZiAoIGkgPT09IGwgLSAxICkge1xuICAgICAgb2JqID0gb2JqWyBrZXkgXSA9IHZhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB9IGVsc2UgaWYgKCBpc3NldCgga2V5LCBvYmogKSApIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF0gPSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlVG9JbmRleCAoIHYsIGwgKSB7XG4gIGlmICggISBsIHx8ICEgdiApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmICggdiA8IDAgKSB7XG4gICAgdiArPSBsO1xuICB9XG5cbiAgcmV0dXJuIHYgfHwgMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVZhbHVlcyAoIG9iamVjdCwga2V5cyApIHtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICB2YWx1ZXNbIGkgXSA9IG9iamVjdFsga2V5c1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL2ludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xudmFyIGRlZmF1bHRUbyA9IHJlcXVpcmUoICcuL2RlZmF1bHQtdG8nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVmb3JlICggbiwgZm4gKSB7XG4gIHZhciB2YWx1ZTtcblxuICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICB0aHJvdyBfQXJndW1lbnRFeGNlcHRpb24oIGZuLCAnYSBmdW5jdGlvbicgKTtcbiAgfVxuXG4gIG4gPSBkZWZhdWx0VG8oIG4sIDEgKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICggLS1uID49IDAgKSB7XG4gICAgICB2YWx1ZSA9IGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbnZhciBjb25zdGFudHMgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcbnZhciBpbmRleE9mICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2luZGV4LW9mJyApO1xuXG4vLyBGdW5jdGlvbjo6YmluZCgpIHBvbHlmaWxsLlxuXG52YXIgX2JpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBmdW5jdGlvbiBiaW5kICggYyApIHtcbiAgdmFyIGYgPSB0aGlzO1xuICB2YXIgYTtcblxuICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPD0gMiApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gYm91bmQgKCkge1xuICAgICAgcmV0dXJuIGYuYXBwbHkoIGMsIGFyZ3VtZW50cyApO1xuICAgIH07XG4gIH1cblxuICBhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuXG4gIHJldHVybiBmdW5jdGlvbiBib3VuZCAoKSB7XG4gICAgcmV0dXJuIGYuYXBwbHkoIGMsIGEuY29uY2F0KCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKSApO1xuICB9O1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gcCBUaGUgcGFydGlhbCBhcmd1bWVudHMuXG4gKiBAcGFyYW0ge0FycmF5fSBhIFRoZSBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IEEgcHJvY2Vzc2VkIGFyZ3VtZW50cy5cbiAqL1xuZnVuY3Rpb24gcHJvY2VzcyAoIHAsIGEgKSB7XG4gIHZhciByID0gW107XG4gIHZhciBqID0gLTE7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IHAubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGlmICggcFsgaSBdID09PSBjb25zdGFudHMuUExBQ0VIT0xERVIgKSB7XG4gICAgICByLnB1c2goIGFbICsraiBdICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHIucHVzaCggcFsgaSBdICk7XG4gICAgfVxuICB9XG5cbiAgZm9yICggbCA9IGEubGVuZ3RoOyBqIDwgbDsgKytqICkge1xuICAgIHIucHVzaCggYVsgaSBdICk7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmIFRoZSB0YXJnZXQgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgYm91bmQuXG4gKiBAcGFyYW0geyp9IGMgVGhlIG5ldyBjb250ZXh0IGZvciB0aGUgdGFyZ2V0IGZ1bmN0aW9uLlxuICogQHBhcmFtIHsuLi4qfSBwIFRoZSBwYXJ0aWFsIGFyZ3VtZW50cywgbWF5IGNvbnRhaW4gY29uc3RhbnRzLlBMQUNFSE9MREVSLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBmICggeCwgeSApIHtcbiAqICAgcmV0dXJuIHRoaXNbIHggXSArIHRoaXNbIHkgXTtcbiAqIH1cbiAqXG4gKiBjb25zdCBjID0ge1xuICogICB4OiA0MixcbiAqICAgeTogMVxuICogfTtcbiAqXG4gKiBjb25zdCBib3VuZCA9IGJpbmQoIGYsIGMsIGNvbnN0YW50cy5QTEFDRUhPTERFUiwgJ3knICk7XG4gKlxuICogYm91bmQoICd4JyApOyAvLyAtPiA0M1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQgKCBmLCBjICkge1xuICB2YXIgcDtcblxuICBpZiAoIHR5cGVvZiBmICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggZiwgJ2EgZnVuY3Rpb24nICk7XG4gIH1cblxuICAvLyBubyBwYXJ0aWFsIGFyZ3VtZW50cyB3ZXJlIHByb3ZpZGVkXG5cbiAgaWYgKCBhcmd1bWVudHMubGVuZ3RoIDw9IDIgKSB7XG4gICAgcmV0dXJuIF9iaW5kLmNhbGwoIGYsIGMgKTtcbiAgfVxuXG4gIHAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAyICk7XG5cbiAgLy8gbm8gcGxhY2Vob2xkZXJzIGluIHRoZSBwYXJ0aWFsIGFyZ3VtZW50c1xuXG4gIGlmICggaW5kZXhPZiggcCwgY29uc3RhbnRzLlBMQUNFSE9MREVSICkgPCAwICkge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbC5hcHBseSggX2JpbmQsIGFyZ3VtZW50cyApO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kICgpIHtcbiAgICByZXR1cm4gZi5hcHBseSggYywgcHJvY2VzcyggcCwgYXJndW1lbnRzICkgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FsbEl0ZXJhdGVlICggZm4sIGN0eCwgdmFsLCBrZXksIG9iaiApIHtcbiAgaWYgKCB0eXBlb2YgY3R4ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gZm4oIHZhbCwga2V5LCBvYmogKTtcbiAgfVxuXG4gIHJldHVybiBmbi5jYWxsKCBjdHgsIHZhbCwga2V5LCBvYmogKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1cHBlckZpcnN0ID0gcmVxdWlyZSggJy4vdXBwZXItZmlyc3QnICk7XG5cbi8vIGNhbWVsaXplKCAnYmFja2dyb3VuZC1yZXBlYXQteCcgKTsgLy8gLT4gJ2JhY2tncm91bmRSZXBlYXRYJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplICggc3RyaW5nICkge1xuICB2YXIgd29yZHMgPSBzdHJpbmcubWF0Y2goIC9bMC05YS16XSsvZ2kgKTtcbiAgdmFyIHJlc3VsdDtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggISB3b3JkcyApIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXN1bHQgPSB3b3Jkc1sgMCBdLnRvTG93ZXJDYXNlKCk7XG5cbiAgZm9yICggaSA9IDEsIGwgPSB3b3Jkcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgcmVzdWx0ICs9IHVwcGVyRmlyc3QoIHdvcmRzWyBpIF0gKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3VuZXNjYXBlID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdW5lc2NhcGUnICk7XG52YXIgX3R5cGUgICAgID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdHlwZScgKTtcblxudmFyIGJhc2VFeGVjICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1leGVjJyApO1xuXG52YXIgaXNLZXkgICAgID0gcmVxdWlyZSggJy4vaXMta2V5JyApO1xudmFyIHRvS2V5ICAgICA9IHJlcXVpcmUoICcuL3RvLWtleScgKTtcblxudmFyIHJQcm9wZXJ0eSA9IC8oXnxcXC4pXFxzKihbX2Etel1cXHcqKVxccyp8XFxbXFxzKigoPzotKT8oPzpcXGQrfFxcZCpcXC5cXGQrKXwoXCJ8JykoKFteXFxcXF1cXFxcKFxcXFxcXFxcKSp8W15cXDRdKSopXFw0KVxccypcXF0vZ2k7XG5cbmZ1bmN0aW9uIHN0cmluZ1RvUGF0aCAoIHN0ciApIHtcbiAgdmFyIHBhdGggPSBiYXNlRXhlYyggclByb3BlcnR5LCBzdHIgKTtcbiAgdmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7XG4gIHZhciB2YWw7XG5cbiAgZm9yICggOyBpID49IDA7IC0taSApIHtcbiAgICB2YWwgPSBwYXRoWyBpIF07XG5cbiAgICAvLyAubmFtZVxuICAgIGlmICggdmFsWyAyIF0gKSB7XG4gICAgICBwYXRoWyBpIF0gPSB2YWxbIDIgXTtcbiAgICAvLyBbIFwiXCIgXSB8fCBbICcnIF1cbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsWyA1IF0gPT09ICdzdHJpbmcnICkge1xuICAgICAgcGF0aFsgaSBdID0gX3VuZXNjYXBlKCB2YWxbIDUgXSApO1xuICAgIC8vIFsgMCBdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdGhbIGkgXSA9IHZhbFsgMyBdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBjYXN0UGF0aCAoIHZhbCApIHtcbiAgdmFyIHBhdGg7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoIGlzS2V5KCB2YWwgKSApIHtcbiAgICByZXR1cm4gWyB0b0tleSggdmFsICkgXTtcbiAgfVxuXG4gIGlmICggX3R5cGUoIHZhbCApID09PSAnYXJyYXknICkge1xuICAgIHBhdGggPSBBcnJheSggbCA9IHZhbC5sZW5ndGggKTtcblxuICAgIGZvciAoIGkgPSBsIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBwYXRoWyBpIF0gPSB0b0tleSggdmFsWyBpIF0gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHN0cmluZ1RvUGF0aCggJycgKyB2YWwgKTtcbiAgfVxuXG4gIHJldHVybiBwYXRoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RQYXRoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsYW1wICggdmFsdWUsIGxvd2VyLCB1cHBlciApIHtcbiAgaWYgKCB2YWx1ZSA+PSB1cHBlciApIHtcbiAgICByZXR1cm4gdXBwZXI7XG4gIH1cblxuICBpZiAoIHZhbHVlIDw9IGxvd2VyICkge1xuICAgIHJldHVybiBsb3dlcjtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoICcuL2dldC1wcm90b3R5cGUtb2YnICk7XG52YXIgaXNPYmplY3RMaWtlICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciB0b09iamVjdCAgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoICcuL2NyZWF0ZScgKTtcbnZhciBlYWNoICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvbmUgKCBkZWVwLCB0YXJnZXQsIGd1YXJkICkge1xuICB2YXIgY2xuO1xuXG4gIGlmICggdHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgfHwgZ3VhcmQgKSB7XG4gICAgdGFyZ2V0ID0gZGVlcDtcbiAgICBkZWVwID0gdHJ1ZTtcbiAgfVxuXG4gIGNsbiA9IGNyZWF0ZSggZ2V0UHJvdG90eXBlT2YoIHRhcmdldCA9IHRvT2JqZWN0KCB0YXJnZXQgKSApICk7XG5cbiAgZWFjaCggdGFyZ2V0LCBmdW5jdGlvbiAoIHZhbHVlLCBrZXksIHRhcmdldCApIHtcbiAgICBpZiAoIHZhbHVlID09PSB0YXJnZXQgKSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IHRoaXM7XG4gICAgfSBlbHNlIGlmICggZGVlcCAmJiBpc09iamVjdExpa2UoIHZhbHVlICkgKSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IGNsb25lKCBkZWVwLCB2YWx1ZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IHZhbHVlO1xuICAgIH1cbiAgfSwgY2xuICk7XG5cbiAgcmV0dXJuIGNsbjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9zZXN0ID0gcmVxdWlyZSggJy4vY2xvc2VzdCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9zZXN0Tm9kZSAoIGUsIGMgKSB7XG4gIGlmICggdHlwZW9mIGMgPT09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiBjbG9zZXN0LmNhbGwoIGUsIGMgKTtcbiAgfVxuXG4gIGRvIHtcbiAgICBpZiAoIGUgPT09IGMgKSB7XG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIH0gd2hpbGUgKCAoIGUgPSBlLnBhcmVudE5vZGUgKSApO1xuXG4gIHJldHVybiBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1hdGNoZXMgPSByZXF1aXJlKCAnLi9tYXRjaGVzLXNlbGVjdG9yJyApO1xuXG52YXIgY2xvc2VzdDtcblxuaWYgKCB0eXBlb2YgRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgISAoIGNsb3Nlc3QgPSBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ICkgKSB7XG4gIGNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0ICggc2VsZWN0b3IgKSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCBtYXRjaGVzLmNhbGwoIGVsZW1lbnQsIHNlbGVjdG9yICkgKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCAoIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQgKSApO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvc2VzdDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3VuZCAoIGZ1bmN0aW9ucyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbXBvdW5kZWQgKCkge1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGZvciAoIGkgPSAwLCBsID0gZnVuY3Rpb25zLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIHZhbHVlID0gZnVuY3Rpb25zWyBpIF0uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBFUlI6IHtcbiAgICBJTlZBTElEX0FSR1M6ICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50cycsXG4gICAgRlVOQ1RJT05fRVhQRUNURUQ6ICAgICAnRXhwZWN0ZWQgYSBmdW5jdGlvbicsXG4gICAgU1RSSU5HX0VYUEVDVEVEOiAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcnLFxuICAgIFVOREVGSU5FRF9PUl9OVUxMOiAgICAgJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcsXG4gICAgUkVEVUNFX09GX0VNUFRZX0FSUkFZOiAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScsXG4gICAgTk9fUEFUSDogICAgICAgICAgICAgICAnTm8gcGF0aCB3YXMgZ2l2ZW4nXG4gIH0sXG5cbiAgTUFYX0FSUkFZX0xFTkdUSDogNDI5NDk2NzI5NSxcbiAgTUFYX1NBRkVfSU5UOiAgICAgOTAwNzE5OTI1NDc0MDk5MSxcbiAgTUlOX1NBRkVfSU5UOiAgICAtOTAwNzE5OTI1NDc0MDk5MSxcblxuICBERUVQOiAgICAgICAgIDEsXG4gIERFRVBfS0VFUF9GTjogMixcblxuICBQTEFDRUhPTERFUjoge31cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSggJy4vZGVmaW5lLXByb3BlcnRpZXMnICk7XG5cbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoICcuL3NldC1wcm90b3R5cGUtb2YnICk7XG5cbnZhciBpc1ByaW1pdGl2ZSA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcblxuZnVuY3Rpb24gQyAoKSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlICggcHJvdG90eXBlLCBkZXNjcmlwdG9ycyApIHtcbiAgdmFyIG9iamVjdDtcblxuICBpZiAoIHByb3RvdHlwZSAhPT0gbnVsbCAmJiBpc1ByaW1pdGl2ZSggcHJvdG90eXBlICkgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogJyArIHByb3RvdHlwZSApO1xuICB9XG5cbiAgQy5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG5cbiAgb2JqZWN0ID0gbmV3IEMoKTtcblxuICBDLnByb3RvdHlwZSA9IG51bGw7XG5cbiAgaWYgKCBwcm90b3R5cGUgPT09IG51bGwgKSB7XG4gICAgc2V0UHJvdG90eXBlT2YoIG9iamVjdCwgbnVsbCApO1xuICB9XG5cbiAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID49IDIgKSB7XG4gICAgZGVmaW5lUHJvcGVydGllcyggb2JqZWN0LCBkZXNjcmlwdG9ycyApO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlQXNzaWduID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1hc3NpZ24nICk7XG52YXIgRVJSICAgICAgICA9IHJlcXVpcmUoICcuLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbiAoIGtleXMgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBhc3NpZ24gKCBvYmogKSB7XG4gICAgdmFyIHNyYztcbiAgICB2YXIgbDtcbiAgICB2YXIgaTtcblxuICAgIGlmICggb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gMSwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICBzcmMgPSBhcmd1bWVudHNbIGkgXTtcblxuICAgICAgaWYgKCBzcmMgIT09IG51bGwgJiYgdHlwZW9mIHNyYyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIGJhc2VBc3NpZ24oIG9iaiwgc3JjLCBrZXlzKCBzcmMgKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUZvckVhY2ggID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItZWFjaCcgKTtcbnZhciBiYXNlRm9ySW4gICAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1pbicgKTtcbnZhciBpc0FycmF5TGlrZSAgPSByZXF1aXJlKCAnLi4vaXMtYXJyYXktbGlrZScgKTtcbnZhciB0b09iamVjdCAgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhdGVlICAgICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcbnZhciBrZXlzICAgICAgICAgPSByZXF1aXJlKCAnLi4va2V5cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFYWNoICggZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZWFjaCAoIG9iaiwgZm4sIGN0eCApIHtcblxuICAgIG9iaiA9IHRvT2JqZWN0KCBvYmogKTtcblxuICAgIGZuICA9IGl0ZXJhdGVlKCBmbiApO1xuXG4gICAgaWYgKCBpc0FycmF5TGlrZSggb2JqICkgKSB7XG4gICAgICByZXR1cm4gYmFzZUZvckVhY2goIG9iaiwgZm4sIGN0eCwgZnJvbVJpZ2h0ICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VGb3JJbiggb2JqLCBmbiwgY3R4LCBmcm9tUmlnaHQsIGtleXMoIG9iaiApICk7XG5cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXNjYXBlICggcmVnZXhwLCBtYXAgKSB7XG4gIGZ1bmN0aW9uIHJlcGxhY2VyICggYyApIHtcbiAgICByZXR1cm4gbWFwWyBjIF07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gZXNjYXBlICggc3RyaW5nICkge1xuICAgIGlmICggc3RyaW5nID09PSBudWxsIHx8IHR5cGVvZiBzdHJpbmcgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiAoIHN0cmluZyArPSAnJyApLnJlcGxhY2UoIHJlZ2V4cCwgcmVwbGFjZXIgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcbnZhciB0b09iamVjdCAgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhYmxlICAgICA9IHJlcXVpcmUoICcuLi9pdGVyYWJsZScgKTtcbnZhciBpdGVyYXRlZSAgICAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZpbmQgKCByZXR1cm5JbmRleCwgZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZmluZCAoIGFyciwgZm4sIGN0eCApIHtcbiAgICB2YXIgaiA9ICggYXJyID0gaXRlcmFibGUoIHRvT2JqZWN0KCBhcnIgKSApICkubGVuZ3RoIC0gMTtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHZhciBpZHg7XG4gICAgdmFyIHZhbDtcblxuICAgIGZuID0gaXRlcmF0ZWUoIGZuICk7XG5cbiAgICBmb3IgKCA7IGogPj0gMDsgLS1qICkge1xuICAgICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICAgIGlkeCA9IGo7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZHggPSArK2k7XG4gICAgICB9XG5cbiAgICAgIHZhbCA9IGFyclsgaWR4IF07XG5cbiAgICAgIGlmICggaXNzZXQoIGlkeCwgYXJyICkgJiYgY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCB2YWwsIGlkeCwgYXJyICkgKSB7XG4gICAgICAgIGlmICggcmV0dXJuSW5kZXggKSB7XG4gICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCByZXR1cm5JbmRleCApIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRmlyc3QgKCBuYW1lICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBzdHIgKSB7XG4gICAgaWYgKCBzdHIgPT09IG51bGwgfHwgdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICAgIH1cblxuICAgIHJldHVybiAoIHN0ciArPSAnJyApLmNoYXJBdCggMCApWyBuYW1lIF0oKSArIHN0ci5zbGljZSggMSApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VGb3JFYWNoID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItZWFjaCcgKTtcbnZhciB0b09iamVjdCAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmF0ZWUgICAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG52YXIgaXRlcmFibGUgICAgPSByZXF1aXJlKCAnLi4vaXRlcmFibGUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRm9yRWFjaCAoIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvckVhY2ggKCBhcnIsIGZuLCBjdHggKSB7XG4gICAgcmV0dXJuIGJhc2VGb3JFYWNoKCBpdGVyYWJsZSggdG9PYmplY3QoIGFyciApICksIGl0ZXJhdGVlKCBmbiApLCBjdHgsIGZyb21SaWdodCApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VGb3JJbiA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWluJyApO1xudmFyIHRvT2JqZWN0ICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmF0ZWUgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZvckluICgga2V5cywgZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9ySW4gKCBvYmosIGZuLCBjdHggKSB7XG4gICAgcmV0dXJuIGJhc2VGb3JJbiggb2JqID0gdG9PYmplY3QoIG9iaiApLCBpdGVyYXRlZSggZm4gKSwgY3R4LCBmcm9tUmlnaHQsIGtleXMoIG9iaiApICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE11c3QgYmUgJ1dpZHRoJyBvciAnSGVpZ2h0JyAoY2FwaXRhbGl6ZWQpLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUdldEVsZW1lbnREaW1lbnNpb24gKCBuYW1lICkge1xuICAvKipcbiAgICogQHBhcmFtIHtXaW5kb3d8Tm9kZX0gZVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uICggZSApIHtcbiAgICB2YXIgdjtcbiAgICB2YXIgYjtcbiAgICB2YXIgZDtcblxuICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgd2luZG93XG5cbiAgICBpZiAoIGUud2luZG93ID09PSBlICkge1xuXG4gICAgICAvLyBpbm5lcldpZHRoIGFuZCBpbm5lckhlaWdodCBpbmNsdWRlcyBhIHNjcm9sbGJhciB3aWR0aCwgYnV0IGl0IGlzIG5vdFxuICAgICAgLy8gc3VwcG9ydGVkIGJ5IG9sZGVyIGJyb3dzZXJzXG5cbiAgICAgIHYgPSBNYXRoLm1heCggZVsgJ2lubmVyJyArIG5hbWUgXSB8fCAwLCBlLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFsgJ2NsaWVudCcgKyBuYW1lIF0gKTtcblxuICAgIC8vIGlmIHRoZSBlbGVtZW50cyBpcyBhIGRvY3VtZW50XG5cbiAgICB9IGVsc2UgaWYgKCBlLm5vZGVUeXBlID09PSA5ICkge1xuXG4gICAgICBiID0gZS5ib2R5O1xuICAgICAgZCA9IGUuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICB2ID0gTWF0aC5tYXgoXG4gICAgICAgIGJbICdzY3JvbGwnICsgbmFtZSBdLFxuICAgICAgICBkWyAnc2Nyb2xsJyArIG5hbWUgXSxcbiAgICAgICAgYlsgJ29mZnNldCcgKyBuYW1lIF0sXG4gICAgICAgIGRbICdvZmZzZXQnICsgbmFtZSBdLFxuICAgICAgICBiWyAnY2xpZW50JyArIG5hbWUgXSxcbiAgICAgICAgZFsgJ2NsaWVudCcgKyBuYW1lIF0gKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB2ID0gZVsgJ2NsaWVudCcgKyBuYW1lIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHY7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWluZGV4LW9mJyApO1xudmFyIHRvT2JqZWN0ICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJbmRleE9mICggZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gaW5kZXhPZiAoIGFyciwgc2VhcmNoLCBmcm9tSW5kZXggKSB7XG4gICAgcmV0dXJuIGJhc2VJbmRleE9mKCB0b09iamVjdCggYXJyICksIHNlYXJjaCwgZnJvbUluZGV4LCBmcm9tUmlnaHQgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuLi9jYXN0LXBhdGgnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUHJvcGVydHlPZiAoIGJhc2VQcm9wZXJ0eSwgdXNlQXJncyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggb2JqZWN0ICkge1xuICAgIHZhciBhcmdzO1xuXG4gICAgaWYgKCB1c2VBcmdzICkge1xuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgICAgaWYgKCAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gYmFzZVByb3BlcnR5KCBvYmplY3QsIHBhdGgsIGFyZ3MgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4uL2Nhc3QtcGF0aCcgKTtcbnZhciBub29wICAgICA9IHJlcXVpcmUoICcuLi9ub29wJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVByb3BlcnR5ICggYmFzZVByb3BlcnR5LCB1c2VBcmdzICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgIHZhciBhcmdzO1xuXG4gICAgaWYgKCAhICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGggKSB7XG4gICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG5cbiAgICBpZiAoIHVzZUFyZ3MgKSB7XG4gICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoIG9iamVjdCApIHtcbiAgICAgIHJldHVybiBiYXNlUHJvcGVydHkoIG9iamVjdCwgcGF0aCwgYXJncyApO1xuICAgIH07XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3dvcmRzID0gcmVxdWlyZSggJy4uL2ludGVybmFsL3dvcmRzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jcmVhdGVSZW1vdmVQcm9wICggX3JlbW92ZVByb3AgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIGtleXMgKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG4gICAgdmFyIGo7XG5cbiAgICBpZiAoIHR5cGVvZiBrZXlzID09PSAnc3RyaW5nJyAgKSB7XG4gICAgICBrZXlzID0gX3dvcmRzKCBrZXlzICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZm9yICggaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgICAgIF9yZW1vdmVQcm9wKCBlbGVtZW50LCBrZXlzWyBqIF0gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVUcmltICggcmVnZXhwICkge1xuICByZXR1cm4gZnVuY3Rpb24gdHJpbSAoIHN0cmluZyApIHtcbiAgICBpZiAoIHN0cmluZyA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyaW5nID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gICAgfVxuXG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS5yZXBsYWNlKCByZWdleHAsICcnICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2FuaW1hdGlvbkl0ZXJhdGlvbkNvdW50JzogdHJ1ZSxcbiAgJ2NvbHVtbkNvdW50JzogdHJ1ZSxcbiAgJ2ZpbGxPcGFjaXR5JzogdHJ1ZSxcbiAgJ2ZsZXhTaHJpbmsnOiB0cnVlLFxuICAnZm9udFdlaWdodCc6IHRydWUsXG4gICdsaW5lSGVpZ2h0JzogdHJ1ZSxcbiAgJ2ZsZXhHcm93JzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlLFxuICAnb3JwaGFucyc6IHRydWUsXG4gICd3aWRvd3MnOiB0cnVlLFxuICAnekluZGV4JzogdHJ1ZSxcbiAgJ29yZGVyJzogdHJ1ZSxcbiAgJ3pvb20nOiB0cnVlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UgKCBtYXhXYWl0LCBmbiApIHtcbiAgdmFyIHRpbWVvdXRJZCA9IG51bGw7XG5cbiAgaWYgKCB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicgKSB7XG4gICAgdGhyb3cgX0FyZ3VtZW50RXhjZXB0aW9uKCBmbiwgJ2EgZnVuY3Rpb24nICk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgIGlmICggdGltZW91dElkICE9PSBudWxsICkge1xuICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SWQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0LmFwcGx5KCBudWxsLCBbIGZuLCBtYXhXYWl0IF0uY29uY2F0KCBbXS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoIGZuLCBtYXhXYWl0ICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsICgpIHtcbiAgICBpZiAoIHRpbWVvdXRJZCAhPT0gbnVsbCApIHtcbiAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgICB0aW1lb3V0SWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVib3VuY2VkOiBkZWJvdW5jZWQsXG4gICAgY2FuY2VsOiAgICBjYW5jZWxcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmYXVsdFRvICggdmFsdWUsIGRlZmF1bHRWYWx1ZSApIHtcbiAgaWYgKCB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSB2YWx1ZSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1peGluID0gcmVxdWlyZSggJy4vbWl4aW4nICk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRzICggZGVmYXVsdHMsIG9iamVjdCApIHtcbiAgaWYgKCBvYmplY3QgKSB7XG4gICAgcmV0dXJuIG1peGluKCB7fSwgZGVmYXVsdHMsIG9iamVjdCApO1xuICB9XG5cbiAgcmV0dXJuIG1peGluKCB7fSwgZGVmYXVsdHMgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VEZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHknICk7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgaXNQcmltaXRpdmUgICAgICAgID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xudmFyIGVhY2ggICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gnICk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0aWVzO1xuXG5pZiAoIHN1cHBvcnQgIT09ICdmdWxsJyApIHtcbiAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMgKCBvYmplY3QsIGRlc2NyaXB0b3JzICkge1xuICAgIGlmICggc3VwcG9ydCAhPT0gJ25vdC1zdXBwb3J0ZWQnICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBvYmplY3QsIGRlc2NyaXB0b3JzICk7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG4gICAgfVxuXG4gICAgaWYgKCBpc1ByaW1pdGl2ZSggb2JqZWN0ICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdkZWZpbmVQcm9wZXJ0aWVzIGNhbGxlZCBvbiBub24tb2JqZWN0JyApO1xuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIGRlc2NyaXB0b3JzICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogJyArIGRlc2NyaXB0b3JzICk7XG4gICAgfVxuXG4gICAgZWFjaCggZGVzY3JpcHRvcnMsIGZ1bmN0aW9uICggZGVzY3JpcHRvciwga2V5ICkge1xuICAgICAgaWYgKCBpc1ByaW1pdGl2ZSggZGVzY3JpcHRvciApICkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogJyArIGRlc2NyaXB0b3IgKTtcbiAgICAgIH1cblxuICAgICAgYmFzZURlZmluZVByb3BlcnR5KCB0aGlzLCBrZXksIGRlc2NyaXB0b3IgKTtcbiAgICB9LCBvYmplY3QgKTtcblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59IGVsc2Uge1xuICBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydGllcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VEZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHknICk7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgaXNQcmltaXRpdmUgICAgICAgID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xuXG52YXIgZGVmaW5lUHJvcGVydHk7XG5cbmlmICggc3VwcG9ydCAhPT0gJ2Z1bGwnICkge1xuICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5ICggb2JqZWN0LCBrZXksIGRlc2NyaXB0b3IgKSB7XG4gICAgaWYgKCBzdXBwb3J0ICE9PSAnbm90LXN1cHBvcnRlZCcgKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIG9iamVjdCApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3QnICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc1ByaW1pdGl2ZSggZGVzY3JpcHRvciApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICcgKyBkZXNjcmlwdG9yICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VEZWZpbmVQcm9wZXJ0eSggb2JqZWN0LCBrZXksIGRlc2NyaXB0b3IgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnR5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZWFjaCcgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZWFjaCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZXNjYXBlJyApKCAvWzw+XCInJl0vZywge1xuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gIFwiJ1wiOiAnJiMzOTsnLFxuICAnXCInOiAnJiMzNDsnLFxuICAnJic6ICcmYW1wOydcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb3Nlc3ROb2RlID0gcmVxdWlyZSggJy4vY2xvc2VzdC1ub2RlJyApO1xudmFyIERPTVdyYXBwZXIgID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbnZhciBFdmVudCAgICAgICA9IHJlcXVpcmUoICcuL0V2ZW50JyApO1xuXG52YXIgZXZlbnRzID0ge1xuICBpdGVtczoge30sXG4gIHR5cGVzOiBbXVxufTtcblxudmFyIHN1cHBvcnQgPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2FkZEV2ZW50TGlzdGVuZXInIGluIHNlbGY7XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHdoaWNoIHRoZSBsaXN0ZW5lciBzaG91bGQgYmUgYXR0YWNoZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgZXZlbnQgdHlwZSBuYW1lLlxuICogQHBhcmFtIHtzdHJpbmc/fSBzZWxlY3RvciBUaGUgc2VsZWN0b3IgdG8gd2hpY2ggZGVsZWdhdGUgYW4gZXZlbnQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciBUaGUgZXZlbnQgbGlzdGVuZXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVzZUNhcHR1cmVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29uZV0gUmVtb3ZlIHRoZSBsaXN0ZW5lciBhZnRlciBpdCBmaXJzdCBkaXNwYXRjaGluZz9cbiAqL1xuXG4vLyBvbiggZG9jdW1lbnQsICdjbGljaycsICcucG9zdF9fbGlrZS1idXR0b24nLCAoIGV2ZW50ICkgPT4ge1xuLy8gICBjb25zdCBkYXRhID0ge1xuLy8gICAgIGlkOiBfKCB0aGlzICkucGFyZW50KCAnLnBvc3QnICkuYXR0ciggJ2RhdGEtaWQnIClcbi8vICAgfVxuXG4vLyAgIGFqYXgoICcvbGlrZScsIHsgZGF0YSB9IClcbi8vIH0sIGZhbHNlIClcblxuZXhwb3J0cy5vbiA9IGZ1bmN0aW9uIG9uICggZWxlbWVudCwgdHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlLCBvbmUgKSB7XG4gIHZhciBpdGVtID0ge1xuICAgIHVzZUNhcHR1cmU6IHVzZUNhcHR1cmUsXG4gICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgb25lOiBvbmVcbiAgfTtcblxuICBpZiAoIHNlbGVjdG9yICkge1xuICAgIGl0ZW0uc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgfVxuXG4gIGlmICggc3VwcG9ydCApIHtcbiAgICBpdGVtLndyYXBwZXIgPSBmdW5jdGlvbiB3cmFwcGVyICggZXZlbnQsIF9lbGVtZW50ICkge1xuICAgICAgaWYgKCBzZWxlY3RvciAmJiAhIF9lbGVtZW50ICYmICEgKCBfZWxlbWVudCA9IGNsb3Nlc3ROb2RlKCBldmVudC50YXJnZXQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9uZSApIHtcbiAgICAgICAgZXhwb3J0cy5vZmYoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lci5jYWxsKCBfZWxlbWVudCB8fCBlbGVtZW50LCBuZXcgRXZlbnQoIGV2ZW50ICkgKTtcbiAgICB9O1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBpdGVtLndyYXBwZXIsIHVzZUNhcHR1cmUgKTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nICkge1xuICAgIGl0ZW0ud3JhcHBlciA9IGZ1bmN0aW9uIHdyYXBwZXIgKCBldmVudCwgX2VsZW1lbnQgKSB7XG4gICAgICBpZiAoIHNlbGVjdG9yICYmICEgX2VsZW1lbnQgJiYgISAoIF9lbGVtZW50ID0gY2xvc2VzdE5vZGUoIGV2ZW50LnRhcmdldCwgc2VsZWN0b3IgKSApICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZSA9PT0gJ0RPTUNvbnRlbnRMb2FkZWQnICYmIGVsZW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJyApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9uZSApIHtcbiAgICAgICAgZXhwb3J0cy5vZmYoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lci5jYWxsKCBfZWxlbWVudCB8fCBlbGVtZW50LCBuZXcgRXZlbnQoIGV2ZW50LCB0eXBlICkgKTtcbiAgICB9O1xuXG4gICAgZWxlbWVudC5hdHRhY2hFdmVudCggaXRlbS5JRVR5cGUgPSBJRVR5cGUoIHR5cGUgKSwgaXRlbS53cmFwcGVyICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnbm90IGltcGxlbWVudGVkJyApO1xuICB9XG5cbiAgaWYgKCBldmVudHMuaXRlbXNbIHR5cGUgXSApIHtcbiAgICBldmVudHMuaXRlbXNbIHR5cGUgXS5wdXNoKCBpdGVtICk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0gPSBbIGl0ZW0gXTtcbiAgICBldmVudHMuaXRlbXNbIHR5cGUgXS5pbmRleCA9IGV2ZW50cy50eXBlcy5sZW5ndGg7XG4gICAgZXZlbnRzLnR5cGVzLnB1c2goIHR5cGUgKTtcbiAgfVxufTtcblxuZXhwb3J0cy5vZmYgPSBmdW5jdGlvbiBvZmYgKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG4gIHZhciBpdGVtcztcbiAgdmFyIGl0ZW07XG4gIHZhciBpO1xuXG4gIGlmICggdHlwZSA9PT0gbnVsbCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZm9yICggaSA9IGV2ZW50cy50eXBlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGV2ZW50Lm9mZiggZWxlbWVudCwgZXZlbnRzLnR5cGVzWyBpIF0sIHNlbGVjdG9yICk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCAhICggaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgXSApICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSBpdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBpdGVtID0gaXRlbXNbIGkgXTtcblxuICAgIGlmICggaXRlbS5lbGVtZW50ICE9PSBlbGVtZW50IHx8XG4gICAgICB0eXBlb2YgbGlzdGVuZXIgIT09ICd1bmRlZmluZWQnICYmIChcbiAgICAgICAgaXRlbS5saXN0ZW5lciAhPT0gbGlzdGVuZXIgfHxcbiAgICAgICAgaXRlbS51c2VDYXB0dXJlICE9PSB1c2VDYXB0dXJlIHx8XG4gICAgICAgIGl0ZW0uc2VsZWN0b3IgJiYgaXRlbS5zZWxlY3RvciAhPT0gc2VsZWN0b3IgKSApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGl0ZW1zLnNwbGljZSggaSwgMSApO1xuXG4gICAgaWYgKCAhIGl0ZW1zLmxlbmd0aCApIHtcbiAgICAgIGV2ZW50cy50eXBlcy5zcGxpY2UoIGl0ZW1zLmluZGV4LCAxICk7XG4gICAgICBldmVudHMuaXRlbXNbIHR5cGUgXSA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCBzdXBwb3J0ICkge1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBpdGVtLndyYXBwZXIsIGl0ZW0udXNlQ2FwdHVyZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmRldGFjaEV2ZW50KCBpdGVtLklFVHlwZSwgaXRlbS53cmFwcGVyICk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLnRyaWdnZXIgPSBmdW5jdGlvbiB0cmlnZ2VyICggZWxlbWVudCwgdHlwZSwgZGF0YSApIHtcbiAgdmFyIGl0ZW1zID0gZXZlbnRzLml0ZW1zWyB0eXBlIF07XG4gIHZhciBjbG9zZXN0O1xuICB2YXIgaXRlbTtcbiAgdmFyIGk7XG5cbiAgaWYgKCAhIGl0ZW1zICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyArK2kgKSB7XG4gICAgaXRlbSA9IGl0ZW1zWyBpIF07XG5cbiAgICBpZiAoIGVsZW1lbnQgKSB7XG4gICAgICBjbG9zZXN0ID0gY2xvc2VzdE5vZGUoIGVsZW1lbnQsIGl0ZW0uc2VsZWN0b3IgfHwgaXRlbS5lbGVtZW50ICk7XG4gICAgfSBlbHNlIGlmICggaXRlbS5zZWxlY3RvciApIHtcbiAgICAgIG5ldyBET01XcmFwcGVyKCBpdGVtLnNlbGVjdG9yICkuZWFjaCggKCBmdW5jdGlvbiAoIGl0ZW0gKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaXRlbS53cmFwcGVyKCBjcmVhdGVFdmVudFdpdGhUYXJnZXQoIHR5cGUsIGRhdGEsIHRoaXMgKSwgdGhpcyApO1xuICAgICAgICB9O1xuICAgICAgfSApKCBpdGVtICkgKTtcblxuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3Nlc3QgPSBpdGVtLmVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKCBjbG9zZXN0ICkge1xuICAgICAgaXRlbS53cmFwcGVyKCBjcmVhdGVFdmVudFdpdGhUYXJnZXQoIHR5cGUsIGRhdGEsIGVsZW1lbnQgfHwgY2xvc2VzdCApLCBjbG9zZXN0ICk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICggdGFyZ2V0LCBzb3VyY2UsIGRlZXAgKSB7XG4gIHZhciBpdGVtcztcbiAgdmFyIGl0ZW07XG4gIHZhciB0eXBlO1xuICB2YXIgaTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSBldmVudHMudHlwZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG5cbiAgICBpZiAoICggaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgPSBldmVudHMudHlwZXNbIGkgXSBdICkgKSB7XG5cbiAgICAgIGZvciAoIGogPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBqIDwgbDsgKytqICkge1xuXG4gICAgICAgIGlmICggKCBpdGVtID0gaXRlbXNbIGogXSApLnRhcmdldCA9PT0gc291cmNlICkge1xuICAgICAgICAgIGV2ZW50Lm9uKCB0YXJnZXQsIHR5cGUsIG51bGwsIGl0ZW0ubGlzdGVuZXIsIGl0ZW0udXNlQ2FwdHVyZSwgaXRlbS5vbmUgKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgfVxuXG4gIGlmICggISBkZWVwICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldCA9IHRhcmdldC5jaGlsZE5vZGVzO1xuICBzb3VyY2UgPSBzb3VyY2UuY2hpbGROb2RlcztcblxuICBmb3IgKCBpID0gdGFyZ2V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGV2ZW50LmNvcHkoIHRhcmdldFsgaSBdLCBzb3VyY2VbIGkgXSwgdHJ1ZSApO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFdpdGhUYXJnZXQgKCB0eXBlLCBkYXRhLCB0YXJnZXQgKSB7XG5cbiAgdmFyIGUgPSBuZXcgRXZlbnQoIHR5cGUsIGRhdGEgKTtcblxuICBlLnRhcmdldCA9IHRhcmdldDtcblxuICByZXR1cm4gZTtcblxufVxuXG5mdW5jdGlvbiBJRVR5cGUgKCB0eXBlICkge1xuICBpZiAoIHR5cGUgPT09ICdET01Db250ZW50TG9hZGVkJyApIHtcbiAgICByZXR1cm4gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gIH1cblxuICByZXR1cm4gJ29uJyArIHR5cGU7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCB0cnVlLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCBmYWxzZSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWVhY2gnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1lYWNoJyApKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMtaW4nICksIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1pbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMnICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xuXG52YXIgd3JhcHBlcnMgPSB7XG4gIGNvbDogICAgICBbIDIsICc8dGFibGU+PGNvbGdyb3VwPicsICc8L2NvbGdyb3VwPjwvdGFibGU+JyBdLFxuICB0cjogICAgICAgWyAyLCAnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPicgXSxcbiAgZGVmYXVsdHM6IFsgMCwgJycsICcnIF1cbn07XG5cbmZ1bmN0aW9uIGFwcGVuZCAoIGZyYWdtZW50LCBlbGVtZW50cyApIHtcbiAgZm9yICggdmFyIGkgPSAwLCBsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50c1sgaSBdICk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmcmFnbWVudCAoIGVsZW1lbnRzLCBjb250ZXh0ICkge1xuICB2YXIgZnJhZ21lbnQgPSBjb250ZXh0LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGVsZW1lbnQ7XG4gIHZhciB3cmFwcGVyO1xuICB2YXIgdGFnO1xuICB2YXIgZGl2O1xuICB2YXIgaTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50c1sgaSBdO1xuXG4gICAgaWYgKCBpc09iamVjdExpa2UoIGVsZW1lbnQgKSApIHtcbiAgICAgIGlmICggJ25vZGVUeXBlJyBpbiBlbGVtZW50ICkge1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggZWxlbWVudCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwZW5kKCBmcmFnbWVudCwgZWxlbWVudCApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIC88fCYjP1xcdys7Ly50ZXN0KCBlbGVtZW50ICkgKSB7XG4gICAgICBpZiAoICEgZGl2ICkge1xuICAgICAgICBkaXYgPSBjb250ZXh0LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICB9XG5cbiAgICAgIHRhZyA9IC88KFthLXpdW15cXHM+XSopL2kuZXhlYyggZWxlbWVudCApO1xuXG4gICAgICBpZiAoIHRhZyApIHtcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzWyB0YWcgPSB0YWdbIDEgXSBdIHx8IHdyYXBwZXJzWyB0YWcudG9Mb3dlckNhc2UoKSBdIHx8IHdyYXBwZXJzLmRlZmF1bHRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzLmRlZmF1bHRzO1xuICAgICAgfVxuXG4gICAgICBkaXYuaW5uZXJIVE1MID0gd3JhcHBlclsgMSBdICsgZWxlbWVudCArIHdyYXBwZXJbIDIgXTtcblxuICAgICAgZm9yICggaiA9IHdyYXBwZXJbIDAgXTsgaiA+IDA7IC0taiApIHtcbiAgICAgICAgZGl2ID0gZGl2Lmxhc3RDaGlsZDtcbiAgICAgIH1cblxuICAgICAgYXBwZW5kKCBmcmFnbWVudCwgZGl2LmNoaWxkTm9kZXMgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGNvbnRleHQuY3JlYXRlVGV4dE5vZGUoIGVsZW1lbnQgKSApO1xuICAgIH1cbiAgfVxuXG4gIGlmICggZGl2ICkge1xuICAgIGRpdi5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIHJldHVybiBmcmFnbWVudDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZnJvbVBhaXJzICggcGFpcnMgKSB7XG4gIHZhciBvYmplY3QgPSB7fTtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gcGFpcnMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIG9iamVjdFsgcGFpcnNbIGkgXVsgMCBdIF0gPSBwYWlyc1sgaSBdWyAxIF07XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbicgKSggJ0hlaWdodCcgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbicgKSggJ1dpZHRoJyApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YgKCBvYmogKSB7XG4gIHZhciBwcm90b3R5cGU7XG5cbiAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgfVxuXG4gIHByb3RvdHlwZSA9IG9iai5fX3Byb3RvX187IC8vIGpzaGludCBpZ25vcmU6IGxpbmVcblxuICBpZiAoIHR5cGVvZiBwcm90b3R5cGUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBwcm90b3R5cGU7XG4gIH1cblxuICBpZiAoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggb2JqLmNvbnN0cnVjdG9yICkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgKSB7XG4gICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTdHlsZSAoIGUsIGssIGMgKSB7XG4gIHJldHVybiBlLnN0eWxlWyBrIF0gfHwgKCBjIHx8IGdldENvbXB1dGVkU3R5bGUoIGUgKSApLmdldFByb3BlcnR5VmFsdWUoIGsgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBiYXNlR2V0ICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1nZXQnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldCAoIG9iamVjdCwgcGF0aCApIHtcbiAgdmFyIGxlbmd0aCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGxlbmd0aCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIGlmICggbGVuZ3RoID4gMSApIHtcbiAgICByZXR1cm4gYmFzZUdldCggdG9PYmplY3QoIG9iamVjdCApLCBwYXRoLCAwICk7XG4gIH1cblxuICByZXR1cm4gdG9PYmplY3QoIG9iamVjdCApWyBwYXRoWyAwIF0gXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBpc3NldCAgICA9IHJlcXVpcmUoICcuL2lzc2V0JyApO1xudmFyIGJhc2VIYXMgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWhhcycgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgbCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGwgKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGwgPiAxICkge1xuICAgIHJldHVybiBiYXNlSGFzKCB0b09iamVjdCggb2JqICksIHBhdGggKTtcbiAgfVxuXG4gIHJldHVybiBpc3NldCggdG9PYmplY3QoIG9iaiApLCBwYXRoWyAwIF0gKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaWRlbnRpdHkgKCB2ICkge1xuICByZXR1cm4gdjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1pbmRleC1vZicgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9Bcmd1bWVudEV4Y2VwdGlvbiAoIHVuZXhwZWN0ZWQsIGV4cGVjdGVkICkge1xuICByZXR1cm4gRXJyb3IoICdcIicgKyB0b1N0cmluZy5jYWxsKCB1bmV4cGVjdGVkICkgKyAnXCIgaXMgbm90ICcgKyBleHBlY3RlZCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZmlyc3QgKCB3cmFwcGVyLCBlbGVtZW50ICkge1xuICB3cmFwcGVyWyAwIF0gPSBlbGVtZW50O1xuICB3cmFwcGVyLmxlbmd0aCA9IDE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIF9tZW1vaXplXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gZnVuY3Rpb25fXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfbWVtb2l6ZSAoIGZ1bmN0aW9uXyApIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuICB2YXIgbGFzdFJlc3VsdDtcbiAgdmFyIGxhc3RWYWx1ZTtcblxuICByZXR1cm4gZnVuY3Rpb24gbWVtb2l6ZWQgKCB2YWx1ZSApIHtcbiAgICBzd2l0Y2ggKCBmYWxzZSApIHtcbiAgICAgIGNhc2UgY2FsbGVkOlxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAvLyBmYWxscyB0aHJvdWdoXG4gICAgICBjYXNlIHZhbHVlID09PSBsYXN0VmFsdWU6XG4gICAgICAgIHJldHVybiAoIGxhc3RSZXN1bHQgPSBmdW5jdGlvbl8oICggbGFzdFZhbHVlID0gdmFsdWUgKSApICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhc3RSZXN1bHQ7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXNjYXBlID0gcmVxdWlyZSggJy4uL2VzY2FwZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfdGV4dENvbnRlbnQgKCBlbGVtZW50LCB2YWx1ZSApIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgY2hpbGRyZW47XG4gIHZhciBjaGlsZDtcbiAgdmFyIHR5cGU7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBlc2NhcGUoIHZhbHVlICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggaSA9IDAsIGwgPSAoIGNoaWxkcmVuID0gZWxlbWVudC5jaGlsZE5vZGVzICkubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIC8vIFRFWFRfTk9ERVxuICAgIGlmICggKCB0eXBlID0gKCBjaGlsZCA9IGNoaWxkcmVuWyBpIF0gKS5ub2RlVHlwZSApID09PSAzICkge1xuICAgICAgcmVzdWx0ICs9IGNoaWxkLm5vZGVWYWx1ZTtcbiAgICAvLyBFTEVNRU5UX05PREVcbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAxICkge1xuICAgICAgcmVzdWx0ICs9IF90ZXh0Q29udGVudCggY2hpbGQgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9tZW1vaXplJyApKCByZXF1aXJlKCAnLi4vdHlwZScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF91bmVzY2FwZSAoIHN0cmluZyApIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKCAvXFxcXChcXFxcKT8vZywgJyQxJyApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdvcmRzICggc3RyaW5nICkge1xuICBpZiAoIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggc3RyaW5nLCAnYSBzdHJpbmcnICk7XG4gIH1cblxuICByZXR1cm4gc3RyaW5nLm1hdGNoKCAvW15cXHNcXHVGRUZGXFx4QTBdKy9nICkgfHwgW107XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIga2V5cyAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGludmVydCAoIG9iamVjdCApIHtcbiAgdmFyIGsgPSBrZXlzKCBvYmplY3QgPSB0b09iamVjdCggb2JqZWN0ICkgKTtcbiAgdmFyIGludmVydGVkID0ge307XG4gIHZhciBpO1xuXG4gIGZvciAoIGkgPSBrLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGludmVydGVkWyBrWyBpIF0gXSA9IG9iamVjdFsga1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gaW52ZXJ0ZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNMZW5ndGggICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xudmFyIGlzV2luZG93TGlrZSA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgaXNMZW5ndGgoIHZhbHVlLmxlbmd0aCApICYmICEgaXNXaW5kb3dMaWtlKCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTGVuZ3RoICAgICA9IHJlcXVpcmUoICcuL2lzLWxlbmd0aCcgKTtcbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIHZhbHVlICkge1xuICBpZiAoIHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICkge1xuICAgIHJldHVybiBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiYgISBpc1dpbmRvd0xpa2UoIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciBpc0xlbmd0aCAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiZcbiAgICBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiZcbiAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHZhbHVlICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNET01FbGVtZW50ICggdmFsdWUgKSB7XG4gIHZhciBub2RlVHlwZTtcblxuICBpZiAoICEgaXNPYmplY3RMaWtlKCB2YWx1ZSApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICggaXNXaW5kb3dMaWtlKCB2YWx1ZSApICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbm9kZVR5cGUgPSB2YWx1ZS5ub2RlVHlwZTtcblxuICByZXR1cm4gbm9kZVR5cGUgPT09IDEgfHwgLy8gRUxFTUVOVF9OT0RFXG4gICAgICAgICBub2RlVHlwZSA9PT0gMyB8fCAvLyBURVhUX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSA4IHx8IC8vIENPTU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDkgfHwgLy8gRE9DVU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDExOyAgLy8gRE9DVU1FTlRfRlJBR01FTlRfTk9ERVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTnVtYmVyID0gcmVxdWlyZSggJy4vaXMtbnVtYmVyJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRmluaXRlICggdmFsdWUgKSB7XG4gIHJldHVybiBpc051bWJlciggdmFsdWUgKSAmJiBpc0Zpbml0ZSggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZSAgICA9IHJlcXVpcmUoICcuL2ludGVybmFsL3R5cGUnICk7XG5cbnZhciByRGVlcEtleSA9IC8oXnxbXlxcXFxdKShcXFxcXFxcXCkqKFxcLnxcXFspLztcblxuZnVuY3Rpb24gaXNLZXkgKCB2YWwgKSB7XG4gIHZhciB0eXBlO1xuXG4gIGlmICggISB2YWwgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoIF90eXBlKCB2YWwgKSA9PT0gJ2FycmF5JyApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0eXBlID0gdHlwZW9mIHZhbDtcblxuICBpZiAoIHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJyB8fCBfdHlwZSggdmFsICkgPT09ICdzeW1ib2wnICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuICEgckRlZXBLZXkudGVzdCggdmFsICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLk1BWF9BUlJBWV9MRU5HVEg7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNMZW5ndGggKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+PSAwICYmXG4gICAgdmFsdWUgPD0gTUFYX0FSUkFZX0xFTkdUSCAmJlxuICAgIHZhbHVlICUgMSA9PT0gMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNOYU4gKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNOdW1iZXIgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSAoIHZhbHVlICkge1xuICByZXR1cm4gISEgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3QgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSggdmFsdWUgKSAmJlxuICAgIHRvU3RyaW5nLmNhbGwoIHZhbHVlICkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSggJy4vZ2V0LXByb3RvdHlwZS1vZicgKTtcbnZhciBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdCcgKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcbnZhciBPQkpFQ1QgPSB0b1N0cmluZy5jYWxsKCBPYmplY3QgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0ICggdiApIHtcbiAgdmFyIHA7XG4gIHZhciBjO1xuXG4gIGlmICggISBpc09iamVjdCggdiApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHAgPSBnZXRQcm90b3R5cGVPZiggdiApO1xuXG4gIGlmICggcCA9PT0gbnVsbCApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICggISBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBwLCAnY29uc3RydWN0b3InICkgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYyA9IHAuY29uc3RydWN0b3I7XG5cbiAgcmV0dXJuIHR5cGVvZiBjID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwoIGMgKSA9PT0gT0JKRUNUO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1ByaW1pdGl2ZSAoIHZhbHVlICkge1xuICByZXR1cm4gISB2YWx1ZSB8fFxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNGaW5pdGUgID0gcmVxdWlyZSggJy4vaXMtZmluaXRlJyApO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyICggdmFsdWUgKSB7XG4gIHJldHVybiBpc0Zpbml0ZSggdmFsdWUgKSAmJlxuICAgIHZhbHVlIDw9IGNvbnN0YW50cy5NQVhfU0FGRV9JTlQgJiZcbiAgICB2YWx1ZSA+PSBjb25zdGFudHMuTUlOX1NBRkVfSU5UICYmXG4gICAgdmFsdWUgJSAxID09PSAwO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N0cmluZyAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlID0gcmVxdWlyZSggJy4vdHlwZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N5bWJvbCAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZSggdmFsdWUgKSA9PT0gJ3N5bWJvbCc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaW5kb3dMaWtlICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgdmFsdWUud2luZG93ID09PSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaW5kb3cgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzV2luZG93TGlrZSggdmFsdWUgKSAmJiB0b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBXaW5kb3ddJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNzZXQgKCBrZXksIG9iaiApIHtcbiAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBvYmpbIGtleSBdICE9PSAndW5kZWZpbmVkJyB8fCBrZXkgaW4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG52YXIgYmFzZVZhbHVlcyAgICAgICAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtdmFsdWVzJyApO1xudmFyIGtleXMgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpdGVyYWJsZSAoIHZhbHVlICkge1xuICBpZiAoIGlzQXJyYXlMaWtlT2JqZWN0KCB2YWx1ZSApICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gdmFsdWUuc3BsaXQoICcnICk7XG4gIH1cblxuICByZXR1cm4gYmFzZVZhbHVlcyggdmFsdWUsIGtleXMoIHZhbHVlICkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xudmFyIG1hdGNoZXNQcm9wZXJ0eSAgID0gcmVxdWlyZSggJy4vbWF0Y2hlcy1wcm9wZXJ0eScgKTtcbnZhciBwcm9wZXJ0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5JyApO1xuXG5leHBvcnRzLml0ZXJhdGVlID0gZnVuY3Rpb24gaXRlcmF0ZWUgKCB2YWx1ZSApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKCBpc0FycmF5TGlrZU9iamVjdCggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gbWF0Y2hlc1Byb3BlcnR5KCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHByb3BlcnR5KCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEtleXNJbiAoIG9iaiApIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIGtleTtcblxuICBvYmogPSB0b09iamVjdCggb2JqICk7XG5cbiAgZm9yICgga2V5IGluIG9iaiApIHtcbiAgICBrZXlzLnB1c2goIGtleSApO1xuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUtleXMgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2Uta2V5cycgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBzdXBwb3J0ICA9IHJlcXVpcmUoICcuL3N1cHBvcnQvc3VwcG9ydC1rZXlzJyApO1xuXG5pZiAoIHN1cHBvcnQgIT09ICdlczIwMTUnICkge1xuICB2YXIgX2tleXM7XG5cbiAgLyoqXG4gICAqICsgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSArXG4gICAqIHwgSSB0ZXN0ZWQgdGhlIGZ1bmN0aW9ucyB3aXRoIHN0cmluZ1syMDQ4XSAoYW4gYXJyYXkgb2Ygc3RyaW5ncykgYW5kIGhhZCB8XG4gICAqIHwgdGhpcyByZXN1bHRzIGluIE5vZGUuanMgKHY4LjEwLjApOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAqICsgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSArXG4gICAqIHwgYmFzZUtleXMgeCAxMCw2NzQgb3BzL3NlYyDCsTAuMjMlICg5NCBydW5zIHNhbXBsZWQpICAgICAgICAgICAgICAgICAgICAgfFxuICAgKiB8IE9iamVjdC5rZXlzIHggMjIsMTQ3IG9wcy9zZWMgwrEwLjIzJSAoOTUgcnVucyBzYW1wbGVkKSAgICAgICAgICAgICAgICAgIHxcbiAgICogfCBGYXN0ZXN0IGlzIFwiT2JqZWN0LmtleXNcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgKiArIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gK1xuICAgKi9cblxuICBpZiAoIHN1cHBvcnQgPT09ICdlczUnICkge1xuICAgIF9rZXlzID0gT2JqZWN0LmtleXM7XG4gIH0gZWxzZSB7XG4gICAgX2tleXMgPSBiYXNlS2V5cztcbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ga2V5cyAoIHYgKSB7XG4gICAgcmV0dXJuIF9rZXlzKCB0b09iamVjdCggdiApICk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtaW5kZXgtb2YnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4vY2FzdC1wYXRoJyApO1xudmFyIGdldCAgICAgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWdldCcgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWF0Y2hlc1Byb3BlcnR5ICggcHJvcGVydHkgKSB7XG4gIHZhciBwYXRoICA9IGNhc3RQYXRoKCBwcm9wZXJ0eVsgMCBdICk7XG4gIHZhciB2YWx1ZSA9IHByb3BlcnR5WyAxIF07XG5cbiAgaWYgKCAhIHBhdGgubGVuZ3RoICkge1xuICAgIHRocm93IEVycm9yKCBFUlIuTk9fUEFUSCApO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICggb2JqZWN0ICkge1xuICAgIGlmICggb2JqZWN0ID09PSBudWxsIHx8IHR5cGVvZiBvYmplY3QgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggcGF0aC5sZW5ndGggPiAxICkge1xuICAgICAgcmV0dXJuIGdldCggb2JqZWN0LCBwYXRoLCAwICkgPT09IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3RbIHBhdGhbIDAgXSBdID09PSB2YWx1ZTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1pbmRleC1vZicgKTtcblxudmFyIG1hdGNoZXM7XG5cbmlmICggdHlwZW9mIEVsZW1lbnQgPT09ICd1bmRlZmluZWQnIHx8ICEgKCBtYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyB8fCBFbGVtZW50LnByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgKSApIHtcbiAgbWF0Y2hlcyA9IGZ1bmN0aW9uIG1hdGNoZXMgKCBzZWxlY3RvciApIHtcbiAgICBpZiAoIC9eI1tcXHdcXC1dKyQvLnRlc3QoIHNlbGVjdG9yICs9ICcnICkgKSB7XG4gICAgICByZXR1cm4gJyMnICsgdGhpcy5pZCA9PT0gc2VsZWN0b3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VJbmRleE9mKCB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKSwgdGhpcyApID49IDA7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mJyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtaW52b2tlJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eScgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLWludm9rZScgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWVtb2l6ZSAgICAgICA9IHJlcXVpcmUoICcuL2ludGVybmFsL21lbW9pemUnICk7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtcGxhaW4tb2JqZWN0JyApO1xudmFyIHRvT2JqZWN0ICAgICAgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIga2V5cyAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG52YXIgaXNBcnJheSAgICAgICA9IG1lbW9pemUoIHJlcXVpcmUoICcuL2lzLWFycmF5JyApICk7XG5cbi8qKlxuICogQG1ldGhvZCBwZWFrby5taXhpblxuICogQHBhcmFtICB7Ym9vbGVhbn0gICAgW2RlZXA9dHJ1ZV1cbiAqIEBwYXJhbSAge29iamVjdH0gICAgIHRhcmdldFxuICogQHBhcmFtICB7Li4ub2JqZWN0P30gb2JqZWN0XG4gKiBAcmV0dXJuIHtbdHlwZV19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWl4aW4gKCBkZWVwLCB0YXJnZXQgKSB7XG4gIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGkgPSAyO1xuICB2YXIgb2JqZWN0O1xuICB2YXIgc291cmNlO1xuICB2YXIgdmFsdWU7XG4gIHZhciBqO1xuICB2YXIgbDtcbiAgdmFyIGs7XG5cbiAgaWYgKCB0eXBlb2YgZGVlcCAhPT0gJ2Jvb2xlYW4nICkge1xuICAgIHRhcmdldCA9IGRlZXA7XG4gICAgZGVlcCA9IHRydWU7XG4gICAgaSA9IDE7XG4gIH1cblxuICB0YXJnZXQgPSB0b09iamVjdCggdGFyZ2V0ICk7XG5cbiAgZm9yICggOyBpIDwgYXJnc0xlbmd0aDsgKytpICkge1xuICAgIG9iamVjdCA9IGFyZ3VtZW50c1sgaSBdO1xuXG4gICAgaWYgKCAhIG9iamVjdCApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAoIGsgPSBrZXlzKCBvYmplY3QgKSwgaiA9IDAsIGwgPSBrLmxlbmd0aDsgaiA8IGw7ICsraiApIHtcbiAgICAgIHZhbHVlID0gb2JqZWN0WyBrWyBqIF0gXTtcblxuICAgICAgaWYgKCBkZWVwICYmIGlzUGxhaW5PYmplY3QoIHZhbHVlICkgfHwgaXNBcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgc291cmNlID0gdGFyZ2V0WyBrWyBqIF0gXTtcblxuICAgICAgICBpZiAoIGlzQXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgICAgaWYgKCAhIGlzQXJyYXkoIHNvdXJjZSApICkge1xuICAgICAgICAgICAgc291cmNlID0gW107XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICggISBpc1BsYWluT2JqZWN0KCBzb3VyY2UgKSApIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldFsga1sgaiBdIF0gPSBtaXhpbiggdHJ1ZSwgc291cmNlLCB2YWx1ZSApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0WyBrWyBqIF0gXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vb3AgKCkge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYnJhY2UtcnVsZXMvYnJhY2Utb24tc2FtZS1saW5lXG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gbm93ICgpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJlZm9yZSA9IHJlcXVpcmUoICcuL2JlZm9yZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlICggdGFyZ2V0ICkge1xuICByZXR1cm4gYmVmb3JlKCAxLCB0YXJnZXQgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlQ2xvbmVBcnJheSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1jbG9uZS1hcnJheScgKTtcbnZhciBmcmFnbWVudCAgICAgICA9IHJlcXVpcmUoICcuL2ZyYWdtZW50JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSFRNTCAoIHN0cmluZywgY29udGV4dCApIHtcbiAgaWYgKCAvXig/OjwoW1xcdy1dKyk+PFxcL1tcXHctXSs+fDwoW1xcdy1dKykoPzpcXHMqXFwvKT8+KSQvLnRlc3QoIHN0cmluZyApICkge1xuICAgIHJldHVybiBbIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFJlZ0V4cC4kMSB8fCBSZWdFeHAuJDIgKSBdO1xuICB9XG5cbiAgcmV0dXJuIGJhc2VDbG9uZUFycmF5KCBmcmFnbWVudCggWyBzdHJpbmcgXSwgY29udGV4dCB8fCBkb2N1bWVudCApLmNoaWxkTm9kZXMgKTtcbn07XG4iLCIvKiFcbiAqIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFZsYWRpc2xhdiBUaWtoaXkgKFNJTEVOVClcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90aWtoaXkvcGVha29cbiAqL1xuXG4vKiFcbiAqIEJhc2VkIG9uIGpRdWVyeSAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnlcbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlXG4gKiBCYXNlZCBvbiBMb2Rhc2ggICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgcGVha29cbiAqL1xudmFyIHBlYWtvO1xuXG5pZiAoIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gIHBlYWtvID0gcmVxdWlyZSggJy4vXycgKTtcbiAgcGVha28uRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuL0RPTVdyYXBwZXInICk7XG59IGVsc2Uge1xuICBwZWFrbyA9IGZ1bmN0aW9uIHBlYWtvICgpIHt9OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGJyYWNlLXJ1bGVzL2JyYWNlLW9uLXNhbWUtbGluZVxufVxuXG5wZWFrby5hamF4ICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2FqYXgnICk7XG5wZWFrby5hc3NpZ24gICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Fzc2lnbicgKTtcbnBlYWtvLmFzc2lnbkluICAgICAgICAgID0gcmVxdWlyZSggJy4vYXNzaWduLWluJyApO1xucGVha28uY2xvbmUgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jbG9uZScgKTtcbnBlYWtvLmNyZWF0ZSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vY3JlYXRlJyApO1xucGVha28uZGVmYXVsdHMgICAgICAgICAgPSByZXF1aXJlKCAnLi9kZWZhdWx0cycgKTtcbnBlYWtvLmRlZmluZVByb3BlcnR5ICAgID0gcmVxdWlyZSggJy4vZGVmaW5lLXByb3BlcnR5JyApO1xucGVha28uZGVmaW5lUHJvcGVydGllcyAgPSByZXF1aXJlKCAnLi9kZWZpbmUtcHJvcGVydGllcycgKTtcbnBlYWtvLmVhY2ggICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZWFjaCcgKTtcbnBlYWtvLmVhY2hSaWdodCAgICAgICAgID0gcmVxdWlyZSggJy4vZWFjaC1yaWdodCcgKTtcbnBlYWtvLmdldFByb3RvdHlwZU9mICAgID0gcmVxdWlyZSggJy4vZ2V0LXByb3RvdHlwZS1vZicgKTtcbnBlYWtvLmluZGV4T2YgICAgICAgICAgID0gcmVxdWlyZSggJy4vaW5kZXgtb2YnICk7XG5wZWFrby5pc0FycmF5ICAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLWFycmF5JyApO1xucGVha28uaXNBcnJheUxpa2UgICAgICAgPSByZXF1aXJlKCAnLi9pcy1hcnJheS1saWtlJyApO1xucGVha28uaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCAnLi9pcy1hcnJheS1saWtlLW9iamVjdCcgKTtcbnBlYWtvLmlzRE9NRWxlbWVudCAgICAgID0gcmVxdWlyZSggJy4vaXMtZG9tLWVsZW1lbnQnICk7XG5wZWFrby5pc0xlbmd0aCAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLWxlbmd0aCcgKTtcbnBlYWtvLmlzT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0JyApO1xucGVha28uaXNPYmplY3RMaWtlICAgICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnBlYWtvLmlzUGxhaW5PYmplY3QgICAgID0gcmVxdWlyZSggJy4vaXMtcGxhaW4tb2JqZWN0JyApO1xucGVha28uaXNQcmltaXRpdmUgICAgICAgPSByZXF1aXJlKCAnLi9pcy1wcmltaXRpdmUnICk7XG5wZWFrby5pc1N5bWJvbCAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXN5bWJvbCcgKTtcbnBlYWtvLmlzU3RyaW5nICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtc3RyaW5nJyApO1xucGVha28uaXNXaW5kb3cgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy13aW5kb3cnICk7XG5wZWFrby5pc1dpbmRvd0xpa2UgICAgICA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xucGVha28uaXNOdW1iZXIgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1udW1iZXInICk7XG5wZWFrby5pc05hTiAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLW5hbicgKTtcbnBlYWtvLmlzU2FmZUludGVnZXIgICAgID0gcmVxdWlyZSggJy4vaXMtc2FmZS1pbnRlZ2VyJyApO1xucGVha28uaXNGaW5pdGUgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1maW5pdGUnICk7XG5wZWFrby5rZXlzICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG5wZWFrby5rZXlzSW4gICAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleXMtaW4nICk7XG5wZWFrby5sYXN0SW5kZXhPZiAgICAgICA9IHJlcXVpcmUoICcuL2xhc3QtaW5kZXgtb2YnICk7XG5wZWFrby5taXhpbiAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL21peGluJyApO1xucGVha28ubm9vcCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9ub29wJyApO1xucGVha28ucHJvcGVydHkgICAgICAgICAgPSByZXF1aXJlKCAnLi9wcm9wZXJ0eScgKTtcbnBlYWtvLnByb3BlcnR5T2YgICAgICAgID0gcmVxdWlyZSggJy4vcHJvcGVydHktb2YnICk7XG5wZWFrby5tZXRob2QgICAgICAgICAgICA9IHJlcXVpcmUoICcuL21ldGhvZCcgKTtcbnBlYWtvLm1ldGhvZE9mICAgICAgICAgID0gcmVxdWlyZSggJy4vbWV0aG9kLW9mJyApO1xucGVha28uc2V0UHJvdG90eXBlT2YgICAgPSByZXF1aXJlKCAnLi9zZXQtcHJvdG90eXBlLW9mJyApO1xucGVha28udG9PYmplY3QgICAgICAgICAgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG5wZWFrby50eXBlICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3R5cGUnICk7XG5wZWFrby5mb3JFYWNoICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1lYWNoJyApO1xucGVha28uZm9yRWFjaFJpZ2h0ICAgICAgPSByZXF1aXJlKCAnLi9mb3ItZWFjaC1yaWdodCcgKTtcbnBlYWtvLmZvckluICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLWluJyApO1xucGVha28uZm9ySW5SaWdodCAgICAgICAgPSByZXF1aXJlKCAnLi9mb3ItaW4tcmlnaHQnICk7XG5wZWFrby5mb3JPd24gICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1vd24nICk7XG5wZWFrby5mb3JPd25SaWdodCAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1vd24tcmlnaHQnICk7XG5wZWFrby5iZWZvcmUgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2JlZm9yZScgKTtcbnBlYWtvLm9uY2UgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vb25jZScgKTtcbnBlYWtvLmRlZmF1bHRUbyAgICAgICAgID0gcmVxdWlyZSggJy4vZGVmYXVsdC10bycgKTtcbnBlYWtvLnRpbWVyICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdGltZXInICk7XG5wZWFrby50aW1lc3RhbXAgICAgICAgICA9IHJlcXVpcmUoICcuL3RpbWVzdGFtcCcgKTtcbnBlYWtvLm5vdyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbm93JyApO1xucGVha28uY2xhbXAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jbGFtcCcgKTtcbnBlYWtvLmJpbmQgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYmluZCcgKTtcbnBlYWtvLnRyaW0gICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdHJpbScgKTtcbnBlYWtvLnRyaW1FbmQgICAgICAgICAgID0gcmVxdWlyZSggJy4vdHJpbS1lbmQnICk7XG5wZWFrby50cmltU3RhcnQgICAgICAgICA9IHJlcXVpcmUoICcuL3RyaW0tc3RhcnQnICk7XG5wZWFrby5maW5kICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2ZpbmQnICk7XG5wZWFrby5maW5kSW5kZXggICAgICAgICA9IHJlcXVpcmUoICcuL2ZpbmQtaW5kZXgnICk7XG5wZWFrby5maW5kTGFzdCAgICAgICAgICA9IHJlcXVpcmUoICcuL2ZpbmQtbGFzdCcgKTtcbnBlYWtvLmZpbmRMYXN0SW5kZXggICAgID0gcmVxdWlyZSggJy4vZmluZC1sYXN0LWluZGV4JyApO1xucGVha28uaGFzICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9oYXMnICk7XG5wZWFrby5nZXQgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2dldCcgKTtcbnBlYWtvLnNldCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vc2V0JyApO1xucGVha28uaXRlcmF0ZWUgICAgICAgICAgPSByZXF1aXJlKCAnLi9pdGVyYXRlZScgKTtcbnBlYWtvLmlkZW50aXR5ICAgICAgICAgID0gcmVxdWlyZSggJy4vaWRlbnRpdHknICk7XG5wZWFrby5lc2NhcGUgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VzY2FwZScgKTtcbnBlYWtvLnVuZXNjYXBlICAgICAgICAgID0gcmVxdWlyZSggJy4vdW5lc2NhcGUnICk7XG5wZWFrby5yYW5kb20gICAgICAgICAgICA9IHJlcXVpcmUoICcuL3JhbmRvbScgKTtcbnBlYWtvLmZyb21QYWlycyAgICAgICAgID0gcmVxdWlyZSggJy4vZnJvbS1wYWlycycgKTtcbnBlYWtvLmNvbnN0YW50cyAgICAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApO1xucGVha28udGVtcGxhdGUgICAgICAgICAgPSByZXF1aXJlKCAnLi90ZW1wbGF0ZScgKTtcbnBlYWtvLnRlbXBsYXRlUmVnZXhwcyAgID0gcmVxdWlyZSggJy4vdGVtcGxhdGUtcmVnZXhwcycgKTtcbnBlYWtvLmludmVydCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaW52ZXJ0JyApO1xucGVha28uY29tcG91bmQgICAgICAgICAgPSByZXF1aXJlKCAnLi9jb21wb3VuZCcgKTtcbnBlYWtvLmRlYm91bmNlICAgICAgICAgID0gcmVxdWlyZSggJy4vZGVib3VuY2UnICk7XG5cbmlmICggdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICkge1xuICBzZWxmLnBlYWtvID0gc2VsZi5fID0gcGVha287IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGVha287XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eS1vZicgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLXByb3BlcnR5JyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eScgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLXByb3BlcnR5JyApICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAnY2xhc3MnOiAnY2xhc3NOYW1lJyxcbiAgJ2Zvcic6ICAgJ2h0bWxGb3InXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZVJhbmRvbSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1yYW5kb20nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmFuZG9tICggbG93ZXIsIHVwcGVyLCBmbG9hdGluZyApIHtcblxuICAvLyBfLnJhbmRvbSgpO1xuXG4gIGlmICggdHlwZW9mIGxvd2VyID09PSAndW5kZWZpbmVkJyApIHtcbiAgICBmbG9hdGluZyA9IGZhbHNlO1xuICAgIHVwcGVyID0gMTtcbiAgICBsb3dlciA9IDA7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiB1cHBlciA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cbiAgICAvLyBfLnJhbmRvbSggZmxvYXRpbmcgKTtcblxuICAgIGlmICggdHlwZW9mIGxvd2VyID09PSAnYm9vbGVhbicgKSB7XG4gICAgICBmbG9hdGluZyA9IGxvd2VyO1xuICAgICAgdXBwZXIgPSAxO1xuXG4gICAgLy8gXy5yYW5kb20oIHVwcGVyICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgZmxvYXRpbmcgPSBmYWxzZTtcbiAgICAgIHVwcGVyID0gbG93ZXI7XG4gICAgfVxuXG4gICAgbG93ZXIgPSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgZmxvYXRpbmcgPT09ICd1bmRlZmluZWQnICkge1xuXG4gICAgLy8gXy5yYW5kb20oIHVwcGVyLCBmbG9hdGluZyApO1xuXG4gICAgaWYgKCB0eXBlb2YgdXBwZXIgPT09ICdib29sZWFuJyApIHtcbiAgICAgIGZsb2F0aW5nID0gdXBwZXI7XG4gICAgICB1cHBlciA9IGxvd2VyO1xuICAgICAgbG93ZXIgPSAwO1xuXG4gICAgLy8gXy5yYW5kb20oIGxvd2VyLCB1cHBlciApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGZsb2F0aW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCBmbG9hdGluZyB8fCBsb3dlciAlIDEgfHwgdXBwZXIgJSAxICkge1xuICAgIHJldHVybiBiYXNlUmFuZG9tKCBsb3dlciwgdXBwZXIgKTtcbiAgfVxuXG4gIHJldHVybiBNYXRoLnJvdW5kKCBiYXNlUmFuZG9tKCBsb3dlciwgdXBwZXIgKSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzUHJpbWl0aXZlID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xudmFyIEVSUiAgICAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YgKCB0YXJnZXQsIHByb3RvdHlwZSApIHtcbiAgaWYgKCB0YXJnZXQgPT09IG51bGwgfHwgdHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgfVxuXG4gIGlmICggcHJvdG90eXBlICE9PSBudWxsICYmIGlzUHJpbWl0aXZlKCBwcm90b3R5cGUgKSApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoICdPYmplY3QgcHJvdG90eXBlIG1heSBvbmx5IGJlIGFuIE9iamVjdCBvciBudWxsOiAnICsgcHJvdG90eXBlICk7XG4gIH1cblxuICBpZiAoICdfX3Byb3RvX18nIGluIHRhcmdldCApIHtcbiAgICB0YXJnZXQuX19wcm90b19fID0gcHJvdG90eXBlOyAvLyBqc2hpbnQgaWdub3JlOiBsaW5lXG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4vY2FzdC1wYXRoJyApO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xudmFyIGJhc2VTZXQgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLXNldCcgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0ICggb2JqLCBwYXRoLCB2YWwgKSB7XG4gIHZhciBsID0gKCBwYXRoID0gY2FzdFBhdGgoIHBhdGggKSApLmxlbmd0aDtcblxuICBpZiAoICEgbCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIGlmICggbCA+IDEgKSB7XG4gICAgcmV0dXJuIGJhc2VTZXQoIHRvT2JqZWN0KCBvYmogKSwgcGF0aCwgdmFsICk7XG4gIH1cblxuICByZXR1cm4gKCB0b09iamVjdCggb2JqIClbIHBhdGhbIDAgXSBdID0gdmFsICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydDtcblxuZnVuY3Rpb24gdGVzdCAoIHRhcmdldCApIHtcbiAgdHJ5IHtcbiAgICBpZiAoICcnIGluIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggdGFyZ2V0LCAnJywge30gKSApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuaWYgKCB0ZXN0KCB7fSApICkge1xuICBzdXBwb3J0ID0gJ2Z1bGwnO1xufSBlbHNlIGlmICggdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0ZXN0KCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKSApICkge1xuICBzdXBwb3J0ID0gJ2RvbSc7XG59IGVsc2Uge1xuICBzdXBwb3J0ID0gJ25vdC1zdXBwb3J0ZWQnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN1cHBvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7XG5cbnRyeSB7XG4gIGlmICggc3Bhbi5zZXRBdHRyaWJ1dGUoICd4JywgJ3knICksIHNwYW4uZ2V0QXR0cmlidXRlKCAneCcgKSA9PT0gJ3knICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlcXVlbmNlc1xuICAgIG1vZHVsZS5leHBvcnRzID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBudWxsO1xuICB9XG59IGNhdGNoICggZXJyb3IgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG59XG5cbnNwYW4gPSBudWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3VwcG9ydDtcblxuaWYgKCBPYmplY3Qua2V5cyApIHtcbiAgdHJ5IHtcbiAgICBzdXBwb3J0ID0gT2JqZWN0LmtleXMoICcnICksICdlczIwMTUnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9ucywgbm8tc2VxdWVuY2VzXG4gIH0gY2F0Y2ggKCBlcnJvciApIHtcbiAgICBzdXBwb3J0ID0gJ2VzNSc7XG4gIH1cbn0gZWxzZSBpZiAoIHsgdG9TdHJpbmc6IG51bGwgfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSggJ3RvU3RyaW5nJyApICkge1xuICBzdXBwb3J0ID0gJ2hhcy1hLWJ1Zyc7XG59IGVsc2Uge1xuICBzdXBwb3J0ID0gJ25vdC1zdXBwb3J0ZWQnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN1cHBvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzYWZlOiAnPCU9XFxcXHMqKFteXSo/KVxcXFxzKiU+JyxcbiAgaHRtbDogJzwlLVxcXFxzKihbXl0qPylcXFxccyolPicsXG4gIGNvbW06ICc8JSMoW15dKj8pJT4nLFxuICBjb2RlOiAnPCVcXFxccyooW15dKj8pXFxcXHMqJT4nXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVnZXhwcyA9IHJlcXVpcmUoICcuL3RlbXBsYXRlLXJlZ2V4cHMnICk7XG52YXIgZXNjYXBlICA9IHJlcXVpcmUoICcuL2VzY2FwZScgKTtcblxuZnVuY3Rpb24gcmVwbGFjZXIgKCBtYXRjaCwgc2FmZSwgaHRtbCwgY29tbSwgY29kZSApIHtcbiAgaWYgKCBzYWZlICE9PSBudWxsICYmIHR5cGVvZiBzYWZlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gXCInK19lKFwiICsgc2FmZS5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiKSsnXCI7XG4gIH1cblxuICBpZiAoIGh0bWwgIT09IG51bGwgJiYgdHlwZW9mIGh0bWwgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIicrKFwiICsgaHRtbC5yZXBsYWNlKCAvXFxcXG4vZywgJ1xcbicgKSArIFwiKSsnXCI7XG4gIH1cblxuICBpZiAoIGNvZGUgIT09IG51bGwgJiYgdHlwZW9mIGNvZGUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIic7XCIgKyBjb2RlLnJlcGxhY2UoIC9cXFxcbi9nLCAnXFxuJyApICsgXCI7X3IrPSdcIjtcbiAgfVxuXG4gIC8vIGNvbW1lbnQgaXMgbWF0Y2hlZCAtIGRvIG5vdGhpbmdcbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIEBtZW1iZXJvZiBwZWFrb1xuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSBUaGUgdGVtcGxhdGUgc291cmNlLlxuICogQGV4YW1wbGVcbiAqIHZhciB0ZW1wbGF0ZSA9IHBlYWtvLnRlbXBsYXRlKCc8dGl0bGU+PCUtIGRhdGEudXNlcm5hbWUgJT48L3RpdGxlPicpO1xuICogdmFyIGh0bWwgPSB0ZW1wbGF0ZS5yZW5kZXIoeyB1c2VybmFtZTogJ0pvaG4nIH0pO1xuICogLy8gLT4gJzx0aXRsZT5Kb2huPC90aXRsZT4nXG4gKi9cbmZ1bmN0aW9uIHRlbXBsYXRlICggc291cmNlICkge1xuICB2YXIgcmVnZXhwID0gUmVnRXhwKCByZWdleHBzLnNhZmUgK1xuICAgICd8JyArIHJlZ2V4cHMuaHRtbCArXG4gICAgJ3wnICsgcmVnZXhwcy5jb21tICtcbiAgICAnfCcgKyByZWdleHBzLmNvZGUsICdnJyApO1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIHZhciBfcmVuZGVyO1xuXG4gIHJlc3VsdCArPSBcImZ1bmN0aW9uIHByaW50KCl7X3IrPUFycmF5LnByb3RvdHlwZS5qb2luLmNhbGwoYXJndW1lbnRzLCcnKTt9XCI7XG5cbiAgcmVzdWx0ICs9IFwidmFyIF9yPSdcIjtcblxuICByZXN1bHQgKz0gc291cmNlXG4gICAgLnJlcGxhY2UoIC9cXG4vZywgJ1xcXFxuJyApXG4gICAgLnJlcGxhY2UoIHJlZ2V4cCwgcmVwbGFjZXIgKTtcblxuICByZXN1bHQgKz0gXCInO3JldHVybiBfcjtcIjtcblxuICBfcmVuZGVyID0gRnVuY3Rpb24oICdkYXRhJywgJ19lJywgcmVzdWx0ICk7IC8vIGpzaGludCBpZ25vcmU6IGxpbmVcblxuICByZXR1cm4ge1xuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyICggZGF0YSApIHtcbiAgICAgIHJldHVybiBfcmVuZGVyLmNhbGwoIHRoaXMsIGRhdGEsIGVzY2FwZSApO1xuICAgIH0sXG5cbiAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICBzb3VyY2U6IHNvdXJjZVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlO1xuIiwiLyoqXG4gKiBCYXNlZCBvbiBFcmlrIE3DtmxsZXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsOlxuICpcbiAqIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MSB3aGljaCBkZXJpdmVkIGZyb21cbiAqIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4gKiBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXG4gKlxuICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlci5cbiAqIEZpeGVzIGZyb20gUGF1bCBJcmlzaCwgVGlubyBaaWpkZWwsIEFuZHJldyBNYW8sIEtsZW1lbiBTbGF2acSNLCBEYXJpdXMgQmFjb24uXG4gKlxuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB0aW1lc3RhbXAgPSByZXF1aXJlKCAnLi90aW1lc3RhbXAnICk7XG5cbnZhciByZXF1ZXN0QUY7XG52YXIgY2FuY2VsQUY7XG5cbmlmICggdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICkge1xuICBjYW5jZWxBRiA9IHNlbGYuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi53ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIHJlcXVlc3RBRiA9IHNlbGYucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgc2VsZi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLm1velJlcXVlc3RBbmltYXRpb25GcmFtZTtcbn1cblxudmFyIG5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gISByZXF1ZXN0QUYgfHwgISBjYW5jZWxBRiB8fFxuICB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAvaVAoYWR8aG9uZXxvZCkuKk9TXFxzNi8udGVzdCggbmF2aWdhdG9yLnVzZXJBZ2VudCApO1xuXG5pZiAoIG5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICkge1xuICB2YXIgbGFzdFJlcXVlc3RUaW1lID0gMDtcbiAgdmFyIGZyYW1lRHVyYXRpb24gICA9IDEwMDAgLyA2MDtcblxuICBleHBvcnRzLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0ICggYW5pbWF0ZSApIHtcbiAgICB2YXIgbm93ICAgICAgICAgICAgID0gdGltZXN0YW1wKCk7XG4gICAgdmFyIG5leHRSZXF1ZXN0VGltZSA9IE1hdGgubWF4KCBsYXN0UmVxdWVzdFRpbWUgKyBmcmFtZUR1cmF0aW9uLCBub3cgKTtcblxuICAgIHJldHVybiBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICBsYXN0UmVxdWVzdFRpbWUgPSBuZXh0UmVxdWVzdFRpbWU7XG4gICAgICBhbmltYXRlKCBub3cgKTtcbiAgICB9LCBuZXh0UmVxdWVzdFRpbWUgLSBub3cgKTtcbiAgfTtcblxuICBleHBvcnRzLmNhbmNlbCA9IGNsZWFyVGltZW91dDtcbn0gZWxzZSB7XG4gIGV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QgKCBhbmltYXRlICkge1xuICAgIHJldHVybiByZXF1ZXN0QUYoIGFuaW1hdGUgKTtcbiAgfTtcblxuICBleHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCAoIGlkICkge1xuICAgIHJldHVybiBjYW5jZWxBRiggaWQgKTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG5vdyA9IHJlcXVpcmUoICcuL25vdycgKTtcbnZhciBuYXZpZ2F0b3JTdGFydDtcblxuaWYgKCB0eXBlb2YgcGVyZm9ybWFuY2UgPT09ICd1bmRlZmluZWQnIHx8ICEgcGVyZm9ybWFuY2Uubm93ICkge1xuICBuYXZpZ2F0b3JTdGFydCA9IG5vdygpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGltZXN0YW1wICgpIHtcbiAgICByZXR1cm4gbm93KCkgLSBuYXZpZ2F0b3JTdGFydDtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGltZXN0YW1wICgpIHtcbiAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdW5lc2NhcGUgPSByZXF1aXJlKCAnLi9pbnRlcm5hbC91bmVzY2FwZScgKTtcblxudmFyIGlzU3ltYm9sICA9IHJlcXVpcmUoICcuL2lzLXN5bWJvbCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSB7XG4gICAgcmV0dXJuIF91bmVzY2FwZSggdmFsdWUgKTtcbiAgfVxuXG4gIGlmICggaXNTeW1ib2woIHZhbHVlICkgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgdmFyIGtleSA9ICcnICsgdmFsdWU7XG5cbiAgaWYgKCBrZXkgPT09ICcwJyAmJiAxIC8gdmFsdWUgPT09IC1JbmZpbml0eSApIHtcbiAgICByZXR1cm4gJy0wJztcbiAgfVxuXG4gIHJldHVybiBfdW5lc2NhcGUoIGtleSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUiA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9PYmplY3QgKCB2YWx1ZSApIHtcbiAgaWYgKCB2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0KCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKCBTdHJpbmcucHJvdG90eXBlLnRyaW1FbmQgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vYmluZCcgKSggRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwsIFN0cmluZy5wcm90b3R5cGUudHJpbUVuZCApO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXRyaW0nICkoIC9bXFxzXFx1RkVGRlxceEEwXSskLyApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbVN0YXJ0ICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2JpbmQnICkoIEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsLCBTdHJpbmcucHJvdG90eXBlLnRyaW1TdGFydCApO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXRyaW0nICkoIC9eW1xcc1xcdUZFRkZcXHhBMF0rLyApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbSApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9iaW5kJyApKCBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbCwgU3RyaW5nLnByb3RvdHlwZS50cmltICk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC8gKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZSA9IHJlcXVpcmUoICcuL2NyZWF0ZScgKTtcblxudmFyIGNhY2hlID0gY3JlYXRlKCBudWxsICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHlwZSAoIHZhbHVlICkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWU7XG4gIH1cblxuICBpZiAoIHZhbHVlID09PSBudWxsICkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cblxuICB2YXIgc3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2YWx1ZSApO1xuXG4gIGlmICggISBjYWNoZVsgc3RyaW5nIF0gKSB7XG4gICAgY2FjaGVbIHN0cmluZyBdID0gc3RyaW5nLnNsaWNlKCA4LCAtMSApLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICByZXR1cm4gY2FjaGVbIHN0cmluZyBdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWVzY2FwZScgKSggLyYoPzpsdHxndHwjMzR8IzM5fGFtcCk7L2csIHtcbiAgJyZsdDsnOiAgJzwnLFxuICAnJmd0Oyc6ICAnPicsXG4gICcmIzM0Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiLFxuICAnJmFtcDsnOiAnJidcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZpcnN0JyApKCAndG9VcHBlckNhc2UnICk7XG4iXX0=
