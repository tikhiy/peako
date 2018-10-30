(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var isArray = require( '../is-array' );

module.exports = function css ( k, v ) {
  if ( isArray( k ) ) {
    return this.styles( k );
  }

  return this.style( k, v );
};

},{"../is-array":109}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

var DOMWrapper = require( '.' );

module.exports = function end () {
  return this._previous || new DOMWrapper();
};

},{".":18}],4:[function(require,module,exports){
'use strict';

module.exports = function eq ( index ) {
  return this.stack( this.get( index ) );
};

},{}],5:[function(require,module,exports){
'use strict';

var DOMWrapper = require( '.' );

module.exports = function find ( selector ) {
  return new DOMWrapper( selector, this );
};

},{".":18}],6:[function(require,module,exports){
'use strict';

module.exports = function first () {
  return this.eq( 0 );
};

},{}],7:[function(require,module,exports){
'use strict';

var clone = require( '../base/base-clone-array' );

module.exports = function get ( index ) {
  if ( typeof index === 'undefined' ) {
    return clone( this );
  }

  if ( index < 0 ) {
    return this[ this.length + index ];
  }

  return this[ index ];
};

},{"../base/base-clone-array":27}],8:[function(require,module,exports){
'use strict';

module.exports = function last () {
  return this.eq( -1 );
};

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

var baseIndexOf = require( '../base/base-index-of' );
var matches     = require( '../matches-selector' );

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

},{"../base/base-index-of":35,"../matches-selector":132}],11:[function(require,module,exports){
'use strict';

var event = require( '../event' );

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

},{"../event":78}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

module.exports = require( '../create/create-remove-prop' )( require( '../base/base-remove-attr' ) );

},{"../base/base-remove-attr":40,"../create/create-remove-prop":67}],14:[function(require,module,exports){
'use strict';

module.exports = require( '../create/create-remove-prop' )( function _removeProp ( element, key ) {
  delete element[ key ];
} );

},{"../create/create-remove-prop":67}],15:[function(require,module,exports){
'use strict';

var _first        = require( '../internal/first' );

var baseCopyArray = require( '../base/base-copy-array' );

var DOMWrapper    = require( '.' );

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

},{".":18,"../base/base-copy-array":28,"../internal/first":100}],16:[function(require,module,exports){
'use strict';

var isObjectLike = require( '../is-object-like' );
var cssNumbers   = require( '../css-numbers' );
var getStyle     = require( '../get-style' );
var camelize     = require( '../camelize' );
var access       = require( '../access' );

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

},{"../access":21,"../camelize":47,"../css-numbers":69,"../get-style":94,"../is-object-like":116}],17:[function(require,module,exports){
'use strict';

var camelize = require( '../camelize' );

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

},{"../camelize":47}],18:[function(require,module,exports){
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

},{"../access":21,"../base/base-for-each":31,"../base/base-for-in":32,"../create/create-remove-prop":67,"../event":78,"../get-element-h":91,"../get-element-w":92,"../internal/first":100,"../internal/text-content":102,"../is-array-like-object":107,"../is-dom-element":110,"../parse-html":139,"../props":143,"../support/support-get-attribute":148,"./DOMWrapper#css":1,"./DOMWrapper#each":2,"./DOMWrapper#end":3,"./DOMWrapper#eq":4,"./DOMWrapper#find":5,"./DOMWrapper#first":6,"./DOMWrapper#get":7,"./DOMWrapper#last":8,"./DOMWrapper#map":9,"./DOMWrapper#parent":10,"./DOMWrapper#ready":11,"./DOMWrapper#remove":12,"./DOMWrapper#removeAttr":13,"./DOMWrapper#removeProp":14,"./DOMWrapper#stack":15,"./DOMWrapper#style":16,"./DOMWrapper#styles":17}],19:[function(require,module,exports){
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

},{"./DOMWrapper":18}],21:[function(require,module,exports){
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

},{"./DOMWrapper":18,"./keys":129,"./type":159}],22:[function(require,module,exports){
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

},{"./DOMWrapper":18,"./Event":19,"./closest-node":51}],79:[function(require,module,exports){
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
 * Copyright (c) 2017-2018 SILENT
 * Released under the MIT License.
 *
 * peako:               https://github.com/silent-tempest/peako
 * based on jquery:     https://github.com/jquery/jquery
 * based on underscore: https://github.com/jashkenas/underscore
 * based on lodash:     https://github.com/lodash/lodash
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

},{"./DOMWrapper":18,"./_":20,"./ajax":23,"./assign":25,"./assign-in":24,"./before":44,"./bind":45,"./clamp":49,"./clone":50,"./compound":53,"./constants":54,"./create":55,"./debounce":70,"./default-to":71,"./defaults":72,"./define-properties":73,"./define-property":74,"./each":76,"./each-right":75,"./escape":77,"./find":82,"./find-index":79,"./find-last":81,"./find-last-index":80,"./for-each":84,"./for-each-right":83,"./for-in":86,"./for-in-right":85,"./for-own":88,"./for-own-right":87,"./from-pairs":90,"./get":95,"./get-prototype-of":93,"./has":96,"./identity":97,"./index-of":98,"./invert":106,"./is-array":109,"./is-array-like":108,"./is-array-like-object":107,"./is-dom-element":110,"./is-finite":111,"./is-length":113,"./is-nan":114,"./is-number":115,"./is-object":117,"./is-object-like":116,"./is-plain-object":118,"./is-primitive":119,"./is-safe-integer":120,"./is-string":121,"./is-symbol":122,"./is-window":124,"./is-window-like":123,"./iteratee":127,"./keys":129,"./keys-in":128,"./last-index-of":130,"./method":134,"./method-of":133,"./mixin":135,"./noop":136,"./now":137,"./once":138,"./property":142,"./property-of":141,"./random":144,"./set":146,"./set-prototype-of":145,"./template":151,"./template-regexps":150,"./timer":152,"./timestamp":153,"./to-object":155,"./trim":158,"./trim-end":156,"./trim-start":157,"./type":159,"./unescape":160}],141:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJET01XcmFwcGVyL0RPTVdyYXBwZXIjY3NzLmpzIiwiRE9NV3JhcHBlci9ET01XcmFwcGVyI2VhY2guanMiLCJET01XcmFwcGVyL0RPTVdyYXBwZXIjZW5kLmpzIiwiRE9NV3JhcHBlci9ET01XcmFwcGVyI2VxLmpzIiwiRE9NV3JhcHBlci9ET01XcmFwcGVyI2ZpbmQuanMiLCJET01XcmFwcGVyL0RPTVdyYXBwZXIjZmlyc3QuanMiLCJET01XcmFwcGVyL0RPTVdyYXBwZXIjZ2V0LmpzIiwiRE9NV3JhcHBlci9ET01XcmFwcGVyI2xhc3QuanMiLCJET01XcmFwcGVyL0RPTVdyYXBwZXIjbWFwLmpzIiwiRE9NV3JhcHBlci9ET01XcmFwcGVyI3BhcmVudC5qcyIsIkRPTVdyYXBwZXIvRE9NV3JhcHBlciNyZWFkeS5qcyIsIkRPTVdyYXBwZXIvRE9NV3JhcHBlciNyZW1vdmUuanMiLCJET01XcmFwcGVyL0RPTVdyYXBwZXIjcmVtb3ZlQXR0ci5qcyIsIkRPTVdyYXBwZXIvRE9NV3JhcHBlciNyZW1vdmVQcm9wLmpzIiwiRE9NV3JhcHBlci9ET01XcmFwcGVyI3N0YWNrLmpzIiwiRE9NV3JhcHBlci9ET01XcmFwcGVyI3N0eWxlLmpzIiwiRE9NV3JhcHBlci9ET01XcmFwcGVyI3N0eWxlcy5qcyIsIkRPTVdyYXBwZXIvaW5kZXguanMiLCJFdmVudC5qcyIsIl8uanMiLCJhY2Nlc3MuanMiLCJhamF4LW9wdGlvbnMuanMiLCJhamF4LmpzIiwiYXNzaWduLWluLmpzIiwiYXNzaWduLmpzIiwiYmFzZS9iYXNlLWFzc2lnbi5qcyIsImJhc2UvYmFzZS1jbG9uZS1hcnJheS5qcyIsImJhc2UvYmFzZS1jb3B5LWFycmF5LmpzIiwiYmFzZS9iYXNlLWRlZmluZS1wcm9wZXJ0eS5qcyIsImJhc2UvYmFzZS1leGVjLmpzIiwiYmFzZS9iYXNlLWZvci1lYWNoLmpzIiwiYmFzZS9iYXNlLWZvci1pbi5qcyIsImJhc2UvYmFzZS1nZXQuanMiLCJiYXNlL2Jhc2UtaGFzLmpzIiwiYmFzZS9iYXNlLWluZGV4LW9mLmpzIiwiYmFzZS9iYXNlLWludm9rZS5qcyIsImJhc2UvYmFzZS1rZXlzLmpzIiwiYmFzZS9iYXNlLXByb3BlcnR5LmpzIiwiYmFzZS9iYXNlLXJhbmRvbS5qcyIsImJhc2UvYmFzZS1yZW1vdmUtYXR0ci5qcyIsImJhc2UvYmFzZS1zZXQuanMiLCJiYXNlL2Jhc2UtdG8taW5kZXguanMiLCJiYXNlL2Jhc2UtdmFsdWVzLmpzIiwiYmVmb3JlLmpzIiwiYmluZC5qcyIsImNhbGwtaXRlcmF0ZWUuanMiLCJjYW1lbGl6ZS5qcyIsImNhc3QtcGF0aC5qcyIsImNsYW1wLmpzIiwiY2xvbmUuanMiLCJjbG9zZXN0LW5vZGUuanMiLCJjbG9zZXN0LmpzIiwiY29tcG91bmQuanMiLCJjb25zdGFudHMuanMiLCJjcmVhdGUuanMiLCJjcmVhdGUvY3JlYXRlLWFzc2lnbi5qcyIsImNyZWF0ZS9jcmVhdGUtZWFjaC5qcyIsImNyZWF0ZS9jcmVhdGUtZXNjYXBlLmpzIiwiY3JlYXRlL2NyZWF0ZS1maW5kLmpzIiwiY3JlYXRlL2NyZWF0ZS1maXJzdC5qcyIsImNyZWF0ZS9jcmVhdGUtZm9yLWVhY2guanMiLCJjcmVhdGUvY3JlYXRlLWZvci1pbi5qcyIsImNyZWF0ZS9jcmVhdGUtZ2V0LWVsZW1lbnQtZGltZW5zaW9uLmpzIiwiY3JlYXRlL2NyZWF0ZS1pbmRleC1vZi5qcyIsImNyZWF0ZS9jcmVhdGUtcHJvcGVydHktb2YuanMiLCJjcmVhdGUvY3JlYXRlLXByb3BlcnR5LmpzIiwiY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcC5qcyIsImNyZWF0ZS9jcmVhdGUtdHJpbS5qcyIsImNzcy1udW1iZXJzLmpzIiwiZGVib3VuY2UuanMiLCJkZWZhdWx0LXRvLmpzIiwiZGVmYXVsdHMuanMiLCJkZWZpbmUtcHJvcGVydGllcy5qcyIsImRlZmluZS1wcm9wZXJ0eS5qcyIsImVhY2gtcmlnaHQuanMiLCJlYWNoLmpzIiwiZXNjYXBlLmpzIiwiZXZlbnQuanMiLCJmaW5kLWluZGV4LmpzIiwiZmluZC1sYXN0LWluZGV4LmpzIiwiZmluZC1sYXN0LmpzIiwiZmluZC5qcyIsImZvci1lYWNoLXJpZ2h0LmpzIiwiZm9yLWVhY2guanMiLCJmb3ItaW4tcmlnaHQuanMiLCJmb3ItaW4uanMiLCJmb3Itb3duLXJpZ2h0LmpzIiwiZm9yLW93bi5qcyIsImZyYWdtZW50LmpzIiwiZnJvbS1wYWlycy5qcyIsImdldC1lbGVtZW50LWguanMiLCJnZXQtZWxlbWVudC13LmpzIiwiZ2V0LXByb3RvdHlwZS1vZi5qcyIsImdldC1zdHlsZS5qcyIsImdldC5qcyIsImhhcy5qcyIsImlkZW50aXR5LmpzIiwiaW5kZXgtb2YuanMiLCJpbnRlcm5hbC9Bcmd1bWVudEV4Y2VwdGlvbi5qcyIsImludGVybmFsL2ZpcnN0LmpzIiwiaW50ZXJuYWwvbWVtb2l6ZS5qcyIsImludGVybmFsL3RleHQtY29udGVudC5qcyIsImludGVybmFsL3R5cGUuanMiLCJpbnRlcm5hbC91bmVzY2FwZS5qcyIsImludGVybmFsL3dvcmRzLmpzIiwiaW52ZXJ0LmpzIiwiaXMtYXJyYXktbGlrZS1vYmplY3QuanMiLCJpcy1hcnJheS1saWtlLmpzIiwiaXMtYXJyYXkuanMiLCJpcy1kb20tZWxlbWVudC5qcyIsImlzLWZpbml0ZS5qcyIsImlzLWtleS5qcyIsImlzLWxlbmd0aC5qcyIsImlzLW5hbi5qcyIsImlzLW51bWJlci5qcyIsImlzLW9iamVjdC1saWtlLmpzIiwiaXMtb2JqZWN0LmpzIiwiaXMtcGxhaW4tb2JqZWN0LmpzIiwiaXMtcHJpbWl0aXZlLmpzIiwiaXMtc2FmZS1pbnRlZ2VyLmpzIiwiaXMtc3RyaW5nLmpzIiwiaXMtc3ltYm9sLmpzIiwiaXMtd2luZG93LWxpa2UuanMiLCJpcy13aW5kb3cuanMiLCJpc3NldC5qcyIsIml0ZXJhYmxlLmpzIiwiaXRlcmF0ZWUuanMiLCJrZXlzLWluLmpzIiwia2V5cy5qcyIsImxhc3QtaW5kZXgtb2YuanMiLCJtYXRjaGVzLXByb3BlcnR5LmpzIiwibWF0Y2hlcy1zZWxlY3Rvci5qcyIsIm1ldGhvZC1vZi5qcyIsIm1ldGhvZC5qcyIsIm1peGluLmpzIiwibm9vcC5qcyIsIm5vdy5qcyIsIm9uY2UuanMiLCJwYXJzZS1odG1sLmpzIiwicGVha28uanMiLCJwcm9wZXJ0eS1vZi5qcyIsInByb3BlcnR5LmpzIiwicHJvcHMuanMiLCJyYW5kb20uanMiLCJzZXQtcHJvdG90eXBlLW9mLmpzIiwic2V0LmpzIiwic3VwcG9ydC9zdXBwb3J0LWRlZmluZS1wcm9wZXJ0eS5qcyIsInN1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlLmpzIiwic3VwcG9ydC9zdXBwb3J0LWtleXMuanMiLCJ0ZW1wbGF0ZS1yZWdleHBzLmpzIiwidGVtcGxhdGUuanMiLCJ0aW1lci5qcyIsInRpbWVzdGFtcC5qcyIsInRvLWtleS5qcyIsInRvLW9iamVjdC5qcyIsInRyaW0tZW5kLmpzIiwidHJpbS1zdGFydC5qcyIsInRyaW0uanMiLCJ0eXBlLmpzIiwidW5lc2NhcGUuanMiLCJ1cHBlci1maXJzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hOQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCAnLi4vaXMtYXJyYXknICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3NzICggaywgdiApIHtcbiAgaWYgKCBpc0FycmF5KCBrICkgKSB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVzKCBrICk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5zdHlsZSggaywgdiApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlYWNoICggZnVuICkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG4gIHZhciBpID0gMDtcblxuICBmb3IgKCA7IGkgPCBsZW47ICsraSApIHtcbiAgICBpZiAoIGZ1bi5jYWxsKCB0aGlzWyBpIF0sIGksIHRoaXNbIGkgXSApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERPTVdyYXBwZXIgPSByZXF1aXJlKCAnLicgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmQgKCkge1xuICByZXR1cm4gdGhpcy5fcHJldmlvdXMgfHwgbmV3IERPTVdyYXBwZXIoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXEgKCBpbmRleCApIHtcbiAgcmV0dXJuIHRoaXMuc3RhY2soIHRoaXMuZ2V0KCBpbmRleCApICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbmQgKCBzZWxlY3RvciApIHtcbiAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBzZWxlY3RvciwgdGhpcyApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaXJzdCAoKSB7XG4gIHJldHVybiB0aGlzLmVxKCAwICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xvbmUgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWNsb25lLWFycmF5JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldCAoIGluZGV4ICkge1xuICBpZiAoIHR5cGVvZiBpbmRleCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGNsb25lKCB0aGlzICk7XG4gIH1cblxuICBpZiAoIGluZGV4IDwgMCApIHtcbiAgICByZXR1cm4gdGhpc1sgdGhpcy5sZW5ndGggKyBpbmRleCBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXNbIGluZGV4IF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxhc3QgKCkge1xuICByZXR1cm4gdGhpcy5lcSggLTEgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFwICggZnVuICkge1xuICB2YXIgZWxzID0gdGhpcy5zdGFjaygpO1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG4gIHZhciBlbDtcbiAgdmFyIGk7XG5cbiAgZWxzLmxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gIGZvciAoIGkgPSAwOyBpIDwgbGVuOyArK2kgKSB7XG4gICAgZWxzWyBpIF0gPSBmdW4uY2FsbCggZWwgPSB0aGlzWyBpIF0sIGksIGVsICk7XG4gIH1cblxuICByZXR1cm4gZWxzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1pbmRleC1vZicgKTtcbnZhciBtYXRjaGVzICAgICA9IHJlcXVpcmUoICcuLi9tYXRjaGVzLXNlbGVjdG9yJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcmVudCAoIHNlbGVjdG9yICkge1xuICB2YXIgZWxlbWVudHMgPSB0aGlzLnN0YWNrKCk7XG4gIHZhciBlbGVtZW50O1xuICB2YXIgcGFyZW50O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBwYXJlbnQgPSAoIGVsZW1lbnQgPSB0aGlzWyBpIF0gKS5ub2RlVHlwZSA9PT0gMSAmJiBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICBpZiAoIHBhcmVudCAmJiBiYXNlSW5kZXhPZiggZWxlbWVudHMsIHBhcmVudCApIDwgMCAmJiAoICEgc2VsZWN0b3IgfHwgbWF0Y2hlcy5jYWxsKCBwYXJlbnQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgIGVsZW1lbnRzWyBlbGVtZW50cy5sZW5ndGgrKyBdID0gcGFyZW50O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBldmVudCA9IHJlcXVpcmUoICcuLi9ldmVudCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZWFkeSAoIGNiICkge1xuICB2YXIgZG9jID0gdGhpc1sgMCBdO1xuICB2YXIgcmVhZHlTdGF0ZTtcblxuICBpZiAoICEgZG9jIHx8IGRvYy5ub2RlVHlwZSAhPT0gOSApIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlYWR5U3RhdGUgPSBkb2MucmVhZHlTdGF0ZTtcblxuICBpZiAoIGRvYy5hdHRhY2hFdmVudCA/IHJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScgOiByZWFkeVN0YXRlID09PSAnbG9hZGluZycgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVybmFyeVxuICAgIGV2ZW50Lm9uKCBkb2MsICdET01Db250ZW50TG9hZGVkJywgbnVsbCwgZnVuY3Rpb24gKCkge1xuICAgICAgY2IoKTtcbiAgICB9LCBmYWxzZSwgdHJ1ZSApO1xuICB9IGVsc2Uge1xuICAgIGNiKCk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVtb3ZlICgpIHtcbiAgdmFyIGkgPSB0aGlzLmxlbmd0aCAtIDE7XG4gIHZhciBwYXJlbnROb2RlO1xuICB2YXIgbm9kZVR5cGU7XG5cbiAgZm9yICggOyBpID49IDA7IC0taSApIHtcbiAgICBub2RlVHlwZSA9IHRoaXNbIGkgXS5ub2RlVHlwZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBicmFjZS1ydWxlcy9icmFjZS1vbi1zYW1lLWxpbmVcbiAgICBpZiAoIG5vZGVUeXBlICE9PSAxICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gMyAmJlxuICAgICAgICAgbm9kZVR5cGUgIT09IDggJiZcbiAgICAgICAgIG5vZGVUeXBlICE9PSA5ICYmXG4gICAgICAgICBub2RlVHlwZSAhPT0gMTEgKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoICggcGFyZW50Tm9kZSA9IHRoaXNbIGkgXS5wYXJlbnROb2RlICkgKSB7XG4gICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzWyBpIF0gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4uL2NyZWF0ZS9jcmVhdGUtcmVtb3ZlLXByb3AnICkoIHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtcmVtb3ZlLWF0dHInICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi4vY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcCcgKSggZnVuY3Rpb24gX3JlbW92ZVByb3AgKCBlbGVtZW50LCBrZXkgKSB7XG4gIGRlbGV0ZSBlbGVtZW50WyBrZXkgXTtcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9maXJzdCAgICAgICAgPSByZXF1aXJlKCAnLi4vaW50ZXJuYWwvZmlyc3QnICk7XG5cbnZhciBiYXNlQ29weUFycmF5ID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1jb3B5LWFycmF5JyApO1xuXG52YXIgRE9NV3JhcHBlciAgICA9IHJlcXVpcmUoICcuJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0YWNrICggZWxlbWVudHMgKSB7XG4gIHZhciB3cmFwcGVyID0gbmV3IERPTVdyYXBwZXIoKTtcblxuICBpZiAoIGVsZW1lbnRzICkge1xuICAgIGlmICggZWxlbWVudHMubGVuZ3RoICkge1xuICAgICAgYmFzZUNvcHlBcnJheSggd3JhcHBlciwgZWxlbWVudHMgKS5sZW5ndGggPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9maXJzdCggd3JhcHBlciwgZWxlbWVudHMgKTtcbiAgICB9XG4gIH1cblxuICB3cmFwcGVyLl9wcmV2aW91cyA9IHdyYXBwZXIucHJldk9iamVjdCA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG5cbiAgcmV0dXJuIHdyYXBwZXI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4uL2lzLW9iamVjdC1saWtlJyApO1xudmFyIGNzc051bWJlcnMgICA9IHJlcXVpcmUoICcuLi9jc3MtbnVtYmVycycgKTtcbnZhciBnZXRTdHlsZSAgICAgPSByZXF1aXJlKCAnLi4vZ2V0LXN0eWxlJyApO1xudmFyIGNhbWVsaXplICAgICA9IHJlcXVpcmUoICcuLi9jYW1lbGl6ZScgKTtcbnZhciBhY2Nlc3MgICAgICAgPSByZXF1aXJlKCAnLi4vYWNjZXNzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlICgga2V5LCB2YWwgKSB7XG4gIHZhciBweCA9ICdkby1ub3QtYWRkJztcblxuICAvLyBDb21wdXRlIHB4IG9yIGFkZCAncHgnIHRvIGB2YWxgIG5vdy5cblxuICBpZiAoIHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmICEgY3NzTnVtYmVyc1sgY2FtZWxpemUoIGtleSApIF0gKSB7XG4gICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyApIHtcbiAgICAgIHZhbCArPSAncHgnO1xuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICBweCA9ICdnb3QtYS1mdW5jdGlvbic7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc09iamVjdExpa2UoIGtleSApICkge1xuICAgIHB4ID0gJ2dvdC1hbi1vYmplY3QnO1xuICB9XG5cbiAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWwsIGZ1bmN0aW9uICggZWxlbWVudCwga2V5LCB2YWwsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoIGVsZW1lbnQubm9kZVR5cGUgIT09IDEgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBrZXkgPSBjYW1lbGl6ZSgga2V5ICk7XG5cbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIGdldFN0eWxlKCBlbGVtZW50LCBrZXkgKTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmICggcHggPT09ICdnb3QtYS1mdW5jdGlvbicgfHwgcHggPT09ICdnb3QtYW4tb2JqZWN0JyAmJiAhIGNzc051bWJlcnNbIGtleSBdICkgKSB7XG4gICAgICB2YWwgKz0gJ3B4JztcbiAgICB9XG5cbiAgICBlbGVtZW50LnN0eWxlWyBrZXkgXSA9IHZhbDtcbiAgfSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbWVsaXplID0gcmVxdWlyZSggJy4uL2NhbWVsaXplJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlcyAoIGtleXMgKSB7XG4gIHZhciBlbGVtZW50ID0gdGhpc1sgMCBdO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBjb21wdXRlZDtcbiAgdmFyIHZhbHVlO1xuICB2YXIga2V5O1xuICB2YXIgaTtcbiAgdmFyIGw7XG5cbiAgZm9yICggaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICBrZXkgPSBrZXlzWyBpIF07XG5cbiAgICBpZiAoICEgY29tcHV0ZWQgKSB7XG4gICAgICB2YWx1ZSA9IGVsZW1lbnQuc3R5bGVbICgga2V5ID0gY2FtZWxpemUoIGtleSApICkgXTtcbiAgICB9XG5cbiAgICBpZiAoICEgdmFsdWUgKSB7XG4gICAgICBpZiAoICEgY29tcHV0ZWQgKSB7XG4gICAgICAgIGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbWVudCApO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoIGtleSApO1xuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NV3JhcHBlcjtcblxudmFyIF90ZXh0Q29udGVudCAgICAgICAgID0gcmVxdWlyZSggJy4uL2ludGVybmFsL3RleHQtY29udGVudCcgKTtcbnZhciBfZmlyc3QgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9pbnRlcm5hbC9maXJzdCcgKTtcblxudmFyIHN1cHBvcnQgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL3N1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlJyApO1xuXG52YXIgY3JlYXRlUmVtb3ZlUHJvcGVydHkgPSByZXF1aXJlKCAnLi4vY3JlYXRlL2NyZWF0ZS1yZW1vdmUtcHJvcCcgKTtcblxudmFyIGJhc2VGb3JFYWNoICAgICAgICAgID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItZWFjaCcgKTtcbnZhciBiYXNlRm9ySW4gICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWluJyApO1xuXG52YXIgaXNBcnJheUxpa2VPYmplY3QgICAgPSByZXF1aXJlKCAnLi4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG52YXIgaXNET01FbGVtZW50ICAgICAgICAgPSByZXF1aXJlKCAnLi4vaXMtZG9tLWVsZW1lbnQnICk7XG52YXIgZ2V0RWxlbWVudFcgICAgICAgICAgPSByZXF1aXJlKCAnLi4vZ2V0LWVsZW1lbnQtdycgKTtcbnZhciBnZXRFbGVtZW50SCAgICAgICAgICA9IHJlcXVpcmUoICcuLi9nZXQtZWxlbWVudC1oJyApO1xudmFyIHBhcnNlSFRNTCAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL3BhcnNlLWh0bWwnICk7XG52YXIgYWNjZXNzICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vYWNjZXNzJyApO1xudmFyIGV2ZW50ICAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2V2ZW50JyApO1xuXG52YXIgcnNlbGVjdG9yID0gL14oPzojKFtcXHctXSspfChbXFx3LV0rKXxcXC4oW1xcdy1dKykpJC87XG5cbmZ1bmN0aW9uIERPTVdyYXBwZXIgKCBzZWxlY3RvciwgY29udGV4dCApIHtcbiAgdmFyIG1hdGNoO1xuICB2YXIgbGlzdDtcbiAgdmFyIGk7XG5cbiAgLy8gXygpO1xuXG4gIGlmICggISBzZWxlY3RvciApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBfKCB3aW5kb3cgKTtcblxuICBpZiAoIGlzRE9NRWxlbWVudCggc2VsZWN0b3IgKSApIHtcbiAgICBfZmlyc3QoIHRoaXMsIHNlbGVjdG9yICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnICkge1xuICAgIGlmICggdHlwZW9mIGNvbnRleHQgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgaWYgKCAhIGNvbnRleHQuX3BlYWtvICkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IERPTVdyYXBwZXIoIGNvbnRleHQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCAhIGNvbnRleHRbIDAgXSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0ID0gY29udGV4dFsgMCBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZXh0ID0gZG9jdW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKCBzZWxlY3Rvci5jaGFyQXQoIDAgKSAhPT0gJzwnICkge1xuICAgICAgbWF0Y2ggPSByc2VsZWN0b3IuZXhlYyggc2VsZWN0b3IgKTtcblxuICAgICAgLy8gXyggJ2EgPiBiICsgYycgKTtcbiAgICAgIC8vIF8oICcjaWQnLCAnLmFub3RoZXItZWxlbWVudCcgKVxuXG4gICAgICBpZiAoICEgbWF0Y2ggfHwgISBjb250ZXh0LmdldEVsZW1lbnRCeUlkICYmIG1hdGNoWyAxIF0gfHwgISBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiYgbWF0Y2hbIDMgXSApIHtcbiAgICAgICAgaWYgKCBtYXRjaFsgMSBdICkge1xuICAgICAgICAgIGxpc3QgPSBbIGNvbnRleHQucXVlcnlTZWxlY3Rvciggc2VsZWN0b3IgKSBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3QgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICk7XG4gICAgICAgIH1cblxuICAgICAgLy8gXyggJyNpZCcgKTtcblxuICAgICAgfSBlbHNlIGlmICggbWF0Y2hbIDEgXSApIHtcbiAgICAgICAgaWYgKCAoIGxpc3QgPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtYXRjaFsgMSBdICkgKSApIHtcbiAgICAgICAgICBfZmlyc3QoIHRoaXMsIGxpc3QgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gXyggJ3RhZycgKTtcblxuICAgICAgfSBlbHNlIGlmICggbWF0Y2hbIDIgXSApIHtcbiAgICAgICAgbGlzdCA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIG1hdGNoWyAyIF0gKTtcblxuICAgICAgLy8gXyggJy5jbGFzcycgKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdCA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggbWF0Y2hbIDMgXSApO1xuICAgICAgfVxuXG4gICAgLy8gXyggJzxkaXY+JyApO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3QgPSBwYXJzZUhUTUwoIHNlbGVjdG9yLCBjb250ZXh0ICk7XG4gICAgfVxuXG4gIC8vIF8oIFsgLi4uIF0gKTtcblxuICB9IGVsc2UgaWYgKCBpc0FycmF5TGlrZU9iamVjdCggc2VsZWN0b3IgKSApIHtcbiAgICBsaXN0ID0gc2VsZWN0b3I7XG5cbiAgLy8gXyggZnVuY3Rpb24gKCBfICkgeyAuLi4gfSApO1xuXG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICByZXR1cm4gbmV3IERPTVdyYXBwZXIoIGRvY3VtZW50ICkucmVhZHkoIHNlbGVjdG9yICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnR290IHVuZXhwZWN0ZWQgc2VsZWN0b3I6ICcgKyBzZWxlY3RvciArICcuJyApO1xuICB9XG5cbiAgaWYgKCAhIGxpc3QgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5sZW5ndGggPSBsaXN0Lmxlbmd0aDtcblxuICBmb3IgKCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICB0aGlzWyBpIF0gPSBsaXN0WyBpIF07XG4gIH1cbn1cblxuRE9NV3JhcHBlci5wcm90b3R5cGUgPSB7XG4gIGVhY2g6ICAgICAgIHJlcXVpcmUoICcuL0RPTVdyYXBwZXIjZWFjaCcgKSxcbiAgZW5kOiAgICAgICAgcmVxdWlyZSggJy4vRE9NV3JhcHBlciNlbmQnICksXG4gIGVxOiAgICAgICAgIHJlcXVpcmUoICcuL0RPTVdyYXBwZXIjZXEnICksXG4gIGZpbmQ6ICAgICAgIHJlcXVpcmUoICcuL0RPTVdyYXBwZXIjZmluZCcgKSxcbiAgZmlyc3Q6ICAgICAgcmVxdWlyZSggJy4vRE9NV3JhcHBlciNmaXJzdCcgKSxcbiAgZ2V0OiAgICAgICAgcmVxdWlyZSggJy4vRE9NV3JhcHBlciNnZXQnICksXG4gIGxhc3Q6ICAgICAgIHJlcXVpcmUoICcuL0RPTVdyYXBwZXIjbGFzdCcgKSxcbiAgbWFwOiAgICAgICAgcmVxdWlyZSggJy4vRE9NV3JhcHBlciNtYXAnICksXG4gIHBhcmVudDogICAgIHJlcXVpcmUoICcuL0RPTVdyYXBwZXIjcGFyZW50JyApLFxuICByZWFkeTogICAgICByZXF1aXJlKCAnLi9ET01XcmFwcGVyI3JlYWR5JyApLFxuICByZW1vdmU6ICAgICByZXF1aXJlKCAnLi9ET01XcmFwcGVyI3JlbW92ZScgKSxcbiAgcmVtb3ZlQXR0cjogcmVxdWlyZSggJy4vRE9NV3JhcHBlciNyZW1vdmVBdHRyJyApLFxuICByZW1vdmVQcm9wOiByZXF1aXJlKCAnLi9ET01XcmFwcGVyI3JlbW92ZVByb3AnICksXG4gIHN0YWNrOiAgICAgIHJlcXVpcmUoICcuL0RPTVdyYXBwZXIjc3RhY2snICksXG4gIHN0eWxlOiAgICAgIHJlcXVpcmUoICcuL0RPTVdyYXBwZXIjc3R5bGUnICksXG4gIHN0eWxlczogICAgIHJlcXVpcmUoICcuL0RPTVdyYXBwZXIjc3R5bGVzJyApLFxuICBjc3M6ICAgICAgICByZXF1aXJlKCAnLi9ET01XcmFwcGVyI2NzcycgKSxcbiAgY29uc3RydWN0b3I6IERPTVdyYXBwZXIsXG4gIGxlbmd0aDogMCxcbiAgX3BlYWtvOiB0cnVlXG59O1xuXG5iYXNlRm9ySW4oIHtcbiAgdHJpZ2dlcjogJ3RyaWdnZXInLFxuICBvZmY6ICAgICAnb2ZmJyxcbiAgb25lOiAgICAgJ29uJyxcbiAgb246ICAgICAgJ29uJ1xufSwgZnVuY3Rpb24gKCBuYW1lLCBtZXRob2ROYW1lICkge1xuICBET01XcmFwcGVyLnByb3RvdHlwZVsgbWV0aG9kTmFtZSBdID0gZnVuY3Rpb24gKCB0eXBlcywgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICkge1xuICAgIHZhciByZW1vdmVBbGwgPSBuYW1lID09PSAnb2ZmJyAmJiAhIGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG9uZSA9IG5hbWUgPT09ICdvbmUnO1xuICAgIHZhciBlbGVtZW50O1xuICAgIHZhciBpO1xuICAgIHZhciBqO1xuICAgIHZhciBsO1xuXG4gICAgaWYgKCAhIHJlbW92ZUFsbCApIHtcbiAgICAgIGlmICggISAoIHR5cGVzID0gdHlwZXMubWF0Y2goIC9bXlxcc1xcdUZFRkZcXHhBMF0rL2cgKSApICkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbCA9IHR5cGVzLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBvZmYoIHR5cGVzLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApXG4gICAgLy8gb2ZmKCB0eXBlcywgbGlzdGVuZXIgKVxuXG4gICAgaWYgKCBuYW1lICE9PSAndHJpZ2dlcicgJiYgdHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgaWYgKCB0eXBlb2YgbGlzdGVuZXIgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICB1c2VDYXB0dXJlID0gbGlzdGVuZXI7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVyID0gc2VsZWN0b3I7XG4gICAgICBzZWxlY3RvciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgdXNlQ2FwdHVyZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB1c2VDYXB0dXJlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBlbGVtZW50ID0gdGhpc1sgaSBdO1xuXG4gICAgICBpZiAoIHJlbW92ZUFsbCApIHtcbiAgICAgICAgZXZlbnQub2ZmKCBlbGVtZW50ICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKCBqID0gMDsgaiA8IGw7ICsraiApIHtcbiAgICAgICAgICBldmVudFsgbmFtZSBdKCBlbGVtZW50LCB0eXBlc1sgaiBdLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUsIG9uZSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59LCB2b2lkIDAsIHRydWUsIFsgJ3RyaWdnZXInLCAnb2ZmJywgJ29uZScsICdvbicgXSApO1xuXG5iYXNlRm9yRWFjaCggW1xuICAnYmx1cicsICAgICAgICAnZm9jdXMnLCAgICAgICAnZm9jdXNpbicsXG4gICdmb2N1c291dCcsICAgICdyZXNpemUnLCAgICAgICdzY3JvbGwnLFxuICAnY2xpY2snLCAgICAgICAnZGJsY2xpY2snLCAgICAnbW91c2Vkb3duJyxcbiAgJ21vdXNldXAnLCAgICAgJ21vdXNlbW92ZScsICAgJ21vdXNlb3ZlcicsXG4gICdtb3VzZW91dCcsICAgICdtb3VzZWVudGVyJywgICdtb3VzZWxlYXZlJyxcbiAgJ2NoYW5nZScsICAgICAgJ3NlbGVjdCcsICAgICAgJ3N1Ym1pdCcsXG4gICdrZXlkb3duJywgICAgICdrZXlwcmVzcycsICAgICdrZXl1cCcsXG4gICdjb250ZXh0bWVudScsICd0b3VjaHN0YXJ0JywgICd0b3VjaG1vdmUnLFxuICAndG91Y2hlbmQnLCAgICAndG91Y2hlbnRlcicsICAndG91Y2hsZWF2ZScsXG4gICd0b3VjaGNhbmNlbCcsICdsb2FkJ1xuXSwgZnVuY3Rpb24gKCBldmVudFR5cGUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBldmVudFR5cGUgXSA9IGZ1bmN0aW9uICggYXJnICkge1xuICAgIHZhciBpO1xuICAgIHZhciBsO1xuXG4gICAgaWYgKCB0eXBlb2YgYXJnICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgcmV0dXJuIHRoaXMudHJpZ2dlciggZXZlbnRUeXBlLCBhcmcgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICB0aGlzLm9uKCBldmVudFR5cGUsIGFyZ3VtZW50c1sgaSBdLCBmYWxzZSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSwgdm9pZCAwLCB0cnVlICk7XG5cbmJhc2VGb3JJbigge1xuICBkaXNhYmxlZDogJ2Rpc2FibGVkJyxcbiAgY2hlY2tlZDogICdjaGVja2VkJyxcbiAgdmFsdWU6ICAgICd2YWx1ZScsXG4gIHRleHQ6ICAgICAndGV4dENvbnRlbnQnIGluIGRvY3VtZW50LmJvZHkgPyAndGV4dENvbnRlbnQnIDogX3RleHRDb250ZW50LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgaHRtbDogICAgICdpbm5lckhUTUwnXG59LCBmdW5jdGlvbiAoIGtleSwgbWV0aG9kTmFtZSApIHtcbiAgRE9NV3JhcHBlci5wcm90b3R5cGVbIG1ldGhvZE5hbWUgXSA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICBpZiAoICEgKCBlbGVtZW50ID0gdGhpc1sgMCBdICkgfHwgZWxlbWVudC5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRbIGtleSBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5KCBlbGVtZW50ICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCB0eXBlb2Yga2V5ICE9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICBlbGVtZW50WyBrZXkgXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAga2V5KCBlbGVtZW50LCB2YWx1ZSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSwgdm9pZCAwLCB0cnVlLCBbICdkaXNhYmxlZCcsICdjaGVja2VkJywgJ3ZhbHVlJywgJ3RleHQnLCAnaHRtbCcgXSApO1xuXG4oIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByb3BzID0gcmVxdWlyZSggJy4uL3Byb3BzJyApO1xuXG4gIGZ1bmN0aW9uIF9hdHRyICggZWxlbWVudCwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlICkge1xuICAgIGlmICggZWxlbWVudC5ub2RlVHlwZSAhPT0gMSApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICggcHJvcHNbIGtleSBdIHx8ICEgc3VwcG9ydCApIHtcbiAgICAgIHJldHVybiBfcHJvcCggZWxlbWVudCwgcHJvcHNbIGtleSBdIHx8IGtleSwgdmFsdWUsIGNoYWluYWJsZSApO1xuICAgIH1cblxuICAgIGlmICggISBjaGFpbmFibGUgKSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoIGtleSApO1xuICAgIH1cblxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCBrZXksIHZhbHVlICk7XG4gIH1cblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gYXR0ciAoIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWx1ZSwgX2F0dHIgKTtcbiAgfTtcblxuICBmdW5jdGlvbiBfcHJvcCAoIGVsZW1lbnQsIGtleSwgdmFsdWUsIGNoYWluYWJsZSApIHtcbiAgICBpZiAoICEgY2hhaW5hYmxlICkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRbIGtleSBdO1xuICAgIH1cblxuICAgIGVsZW1lbnRbIGtleSBdID0gdmFsdWU7XG4gIH1cblxuICBET01XcmFwcGVyLnByb3RvdHlwZS5wcm9wID0gZnVuY3Rpb24gcHJvcCAoIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFjY2VzcyggdGhpcywga2V5LCB2YWx1ZSwgX3Byb3AgKTtcbiAgfTtcbn0gKSgpO1xuXG4oIGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9wZWFrb0lkID0gMDtcbiAgdmFyIF9kYXRhID0ge307XG5cbiAgZnVuY3Rpb24gX2FjY2Vzc0RhdGEgKCBlbGVtZW50LCBrZXksIHZhbHVlLCBjaGFpbmFibGUgKSB7XG4gICAgdmFyIGF0dHJpYnV0ZXM7XG4gICAgdmFyIGF0dHJpYnV0ZTtcbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGlmICggISBlbGVtZW50Ll9wZWFrb0lkICkge1xuICAgICAgZWxlbWVudC5fcGVha29JZCA9ICsrX3BlYWtvSWQ7XG4gICAgfVxuXG4gICAgaWYgKCAhICggZGF0YSA9IF9kYXRhWyBlbGVtZW50Ll9wZWFrb0lkIF0gKSApIHtcbiAgICAgIGRhdGEgPSBfZGF0YVsgZWxlbWVudC5fcGVha29JZCBdID0ge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbXVsdGktYXNzaWduXG5cbiAgICAgIGZvciAoIGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXMsIGkgPSAwLCBsID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICAgIGlmICggISAoIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbIGkgXSApLm5vZGVOYW1lLmluZGV4T2YoICdkYXRhLScgKSApIHtcbiAgICAgICAgICBkYXRhWyBhdHRyaWJ1dGUubm9kZU5hbWUuc2xpY2UoIDUgKSBdID0gYXR0cmlidXRlLm5vZGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggY2hhaW5hYmxlICkge1xuICAgICAgZGF0YVsga2V5IF0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRhdGFbIGtleSBdO1xuICAgIH1cbiAgfVxuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbiBkYXRhICgga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYWNjZXNzKCB0aGlzLCBrZXksIHZhbHVlLCBfYWNjZXNzRGF0YSApO1xuICB9O1xuXG4gIERPTVdyYXBwZXIucHJvdG90eXBlLnJlbW92ZURhdGEgPSBjcmVhdGVSZW1vdmVQcm9wZXJ0eSggZnVuY3Rpb24gX3JlbW92ZURhdGEgKCBlbGVtZW50LCBrZXkgKSB7XG4gICAgaWYgKCBlbGVtZW50Ll9wZWFrb0lkICkge1xuICAgICAgZGVsZXRlIF9kYXRhWyBlbGVtZW50Ll9wZWFrb0lkIF1bIGtleSBdO1xuICAgIH1cbiAgfSApO1xufSApKCk7XG5cbmJhc2VGb3JJbiggeyBoZWlnaHQ6IGdldEVsZW1lbnRXLCB3aWR0aDogZ2V0RWxlbWVudEggfSwgZnVuY3Rpb24gKCBnZXQsIG5hbWUgKSB7XG4gIERPTVdyYXBwZXIucHJvdG90eXBlWyBuYW1lIF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCB0aGlzWyAwIF0gKSB7XG4gICAgICByZXR1cm4gZ2V0KCB0aGlzWyAwIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn0sIHZvaWQgMCwgdHJ1ZSwgWyAnaGVpZ2h0JywgJ3dpZHRoJyBdICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlQXNzaWduID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWFzc2lnbicgKTtcblxudmFyIGlzc2V0ICAgICAgPSByZXF1aXJlKCAnLi9pc3NldCcgKTtcbnZhciBrZXlzICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxudmFyIGRlZmF1bHRzID0gW1xuICAnYWx0S2V5JywgICAgICAgICdidWJibGVzJywgICAgICAgICdjYW5jZWxhYmxlJyxcbiAgJ2NhbmNlbEJ1YmJsZScsICAnY2hhbmdlZFRvdWNoZXMnLCAnY3RybEtleScsXG4gICdjdXJyZW50VGFyZ2V0JywgJ2RldGFpbCcsICAgICAgICAgJ2V2ZW50UGhhc2UnLFxuICAnbWV0YUtleScsICAgICAgICdwYWdlWCcsICAgICAgICAgICdwYWdlWScsXG4gICdzaGlmdEtleScsICAgICAgJ3ZpZXcnLCAgICAgICAgICAgJ2NoYXInLFxuICAnY2hhckNvZGUnLCAgICAgICdrZXknLCAgICAgICAgICAgICdrZXlDb2RlJyxcbiAgJ2J1dHRvbicsICAgICAgICAnYnV0dG9ucycsICAgICAgICAnY2xpZW50WCcsXG4gICdjbGllbnRZJywgICAgICAgJ29mZnNldFgnLCAgICAgICAgJ29mZnNldFknLFxuICAncG9pbnRlcklkJywgICAgICdwb2ludGVyVHlwZScsICAgICdyZWxhdGVkVGFyZ2V0JyxcbiAgJ3JldHVyblZhbHVlJywgICAnc2NyZWVuWCcsICAgICAgICAnc2NyZWVuWScsXG4gICd0YXJnZXRUb3VjaGVzJywgJ3RvRWxlbWVudCcsICAgICAgJ3RvdWNoZXMnLFxuICAnaXNUcnVzdGVkJ1xuXTtcblxuZnVuY3Rpb24gRXZlbnQgKCBvcmlnaW5hbCwgb3B0aW9ucyApIHtcbiAgdmFyIGk7XG4gIHZhciBrO1xuXG4gIGlmICggdHlwZW9mIG9yaWdpbmFsID09PSAnb2JqZWN0JyApIHtcbiAgICBmb3IgKCBpID0gZGVmYXVsdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoIGlzc2V0KCBrID0gZGVmYXVsdHNbIGkgXSwgb3JpZ2luYWwgKSApIHtcbiAgICAgICAgdGhpc1sgayBdID0gb3JpZ2luYWxbIGsgXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIG9yaWdpbmFsLnRhcmdldCApIHtcbiAgICAgIGlmICggb3JpZ2luYWwudGFyZ2V0Lm5vZGVUeXBlID09PSAzICkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsLnRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBvcmlnaW5hbC50YXJnZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5hbCA9IHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW11bHRpLWFzc2lnblxuICAgIHRoaXMud2hpY2ggPSBFdmVudC53aGljaCggb3JpZ2luYWwgKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmlzVHJ1c3RlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2Ygb3JpZ2luYWwgPT09ICdzdHJpbmcnICkge1xuICAgIHRoaXMudHlwZSA9IG9yaWdpbmFsO1xuICB9IGVsc2UgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgKSB7XG4gICAgdGhpcy50eXBlID0gb3B0aW9ucztcbiAgfVxuXG4gIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICkge1xuICAgIGJhc2VBc3NpZ24oIHRoaXMsIG9wdGlvbnMsIGtleXMoIG9wdGlvbnMgKSApO1xuICB9XG59XG5cbkV2ZW50LnByb3RvdHlwZSA9IHtcbiAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0ICgpIHtcbiAgICBpZiAoIHRoaXMub3JpZ2luYWwgKSB7XG4gICAgICBpZiAoIHRoaXMub3JpZ2luYWwucHJldmVudERlZmF1bHQgKSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWwucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHRoaXMub3JpZ2luYWwucmV0dXJuVmFsdWU7XG4gICAgfVxuICB9LFxuXG4gIHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uICgpIHtcbiAgICBpZiAoIHRoaXMub3JpZ2luYWwgKSB7XG4gICAgICBpZiAoIHRoaXMub3JpZ2luYWwuc3RvcFByb3BhZ2F0aW9uICkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IHRoaXMub3JpZ2luYWwuY2FuY2VsQnViYmxlO1xuICAgIH1cbiAgfSxcblxuICBjb25zdHJ1Y3RvcjogRXZlbnRcbn07XG5cbkV2ZW50LndoaWNoID0gZnVuY3Rpb24gd2hpY2ggKCBldmVudCApIHtcbiAgaWYgKCBldmVudC53aGljaCApIHtcbiAgICByZXR1cm4gZXZlbnQud2hpY2g7XG4gIH1cblxuICBpZiAoICEgZXZlbnQudHlwZS5pbmRleE9mKCAna2V5JyApICkge1xuICAgIGlmICggdHlwZW9mIGV2ZW50LmNoYXJDb2RlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHJldHVybiBldmVudC5jaGFyQ29kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXZlbnQua2V5Q29kZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIGV2ZW50LmJ1dHRvbiA9PT0gJ3VuZGVmaW5lZCcgfHwgISAvXig/Om1vdXNlfHBvaW50ZXJ8Y29udGV4dG1lbnV8ZHJhZ3xkcm9wKXxjbGljay8udGVzdCggZXZlbnQudHlwZSApICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCBldmVudC5idXR0b24gJiAxICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmICggZXZlbnQuYnV0dG9uICYgMiApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG4gICAgcmV0dXJuIDM7XG4gIH1cblxuICBpZiAoIGV2ZW50LmJ1dHRvbiAmIDQgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICAgIHJldHVybiAyO1xuICB9XG5cbiAgcmV0dXJuIDA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NV3JhcHBlciA9IHJlcXVpcmUoICcuL0RPTVdyYXBwZXInICk7XG5cbmZ1bmN0aW9uIF8gKCBzZWxlY3RvciwgY29udGV4dCApIHtcbiAgcmV0dXJuIG5ldyBET01XcmFwcGVyKCBzZWxlY3RvciwgY29udGV4dCApO1xufVxuXG5fLmZuID0gXy5wcm90b3R5cGUgPSBET01XcmFwcGVyLnByb3RvdHlwZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbl8uZm4uY29uc3RydWN0b3IgPSBfO1xuXG5tb2R1bGUuZXhwb3J0cyA9IF87XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbnZhciB0eXBlICAgICAgID0gcmVxdWlyZSggJy4vdHlwZScgKTtcbnZhciBrZXlzICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxuZnVuY3Rpb24gYWNjZXNzICggb2JqLCBrZXksIHZhbCwgZm4sIF9ub0NoZWNrICkge1xuICB2YXIgY2hhaW5hYmxlID0gX25vQ2hlY2sgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG4gIHZhciBidWxrID0ga2V5ID09PSBudWxsIHx8IGtleSA9PT0gJ3VuZGVmaW5lZCc7XG4gIHZhciBsZW4gPSBvYmoubGVuZ3RoO1xuICB2YXIgcmF3ID0gZmFsc2U7XG4gIHZhciBlO1xuICB2YXIgaztcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggISBfbm9DaGVjayAmJiB0eXBlKCBrZXkgKSA9PT0gJ29iamVjdCcgKSB7XG4gICAgZm9yICggaSA9IDAsIGsgPSBrZXlzKCBrZXkgKSwgbCA9IGsubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgICAgYWNjZXNzKCBvYmosIGtbIGkgXSwga2V5WyBrWyBpIF0gXSwgZm4sIHRydWUgKTtcbiAgICB9XG5cbiAgICBjaGFpbmFibGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICBpZiAoIHR5cGVvZiB2YWwgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByYXcgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICggYnVsayApIHtcbiAgICAgIGlmICggcmF3ICkge1xuICAgICAgICBmbi5jYWxsKCBvYmosIHZhbCApO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWxrID0gZm47XG5cbiAgICAgICAgZm4gPSBmdW5jdGlvbiAoIGUsIGtleSwgdmFsICkge1xuICAgICAgICAgIHJldHVybiBidWxrLmNhbGwoIG5ldyBET01XcmFwcGVyKCBlICksIHZhbCApO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggZm4gKSB7XG4gICAgICBmb3IgKCBpID0gMDsgaSA8IGxlbjsgKytpICkge1xuICAgICAgICBlID0gb2JqWyBpIF07XG5cbiAgICAgICAgaWYgKCByYXcgKSB7XG4gICAgICAgICAgZm4oIGUsIGtleSwgdmFsLCB0cnVlICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm4oIGUsIGtleSwgdmFsLmNhbGwoIGUsIGksIGZuKCBlLCBrZXkgKSApLCB0cnVlICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFpbmFibGUgPSB0cnVlO1xuICB9XG5cbiAgaWYgKCBjaGFpbmFibGUgKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGlmICggYnVsayApIHtcbiAgICByZXR1cm4gZm4uY2FsbCggb2JqICk7XG4gIH1cblxuICBpZiAoIGxlbiApIHtcbiAgICByZXR1cm4gZm4oIG9ialsgMCBdLCBrZXkgKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFjY2VzcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcHJvcGVydHkge09iamVjdH0gaGVhZGVyc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHRpbWVvdXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRob2RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgaGVhZGVycy5cbiAgICovXG4gIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCdcbiAgfSxcblxuICAvKipcbiAgICogTWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSByZXF1ZXN0IHNob3VsZCBiZSBjYW5jZWxlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDEwMDAgKiA2MCxcblxuICAvKipcbiAgICogVGhlIHJlcXVlc3QgbWV0aG9kOiAnR0VUJywgJ1BPU1QnIChvdGhlcnMgYXJlIGlnbm9yZWQsIGluc3RlYWQsICdHRVQnIHdpbGwgYmUgdXNlZCkuXG4gICAqL1xuICBtZXRob2Q6ICdHRVQnXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIHR5cGVvZiBxcyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gIHZhciBxcztcblxuICB0cnkge1xuICAgIHFzID0gcmVxdWlyZSggJ3FzJyApO1xuICB9IGNhdGNoICggZXJyb3IgKSB7fVxufVxuXG52YXIgX29wdGlvbnMgPSByZXF1aXJlKCAnLi9hamF4LW9wdGlvbnMnICk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCAnLi9kZWZhdWx0cycgKTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgWE1MSHR0cFJlcXVlc3Q6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTU3MjY4XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjcmVhdGVIVFRQUmVxdWVzdCAoKSB7XG4gIHZhciBIVFRQRmFjdG9yaWVzOyB2YXIgaTtcblxuICBIVFRQRmFjdG9yaWVzID0gW1xuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwzLlhNTEhUVFAnICk7XG4gICAgfSxcblxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCggJ01zeG1sMi5YTUxIVFRQLjYuMCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTXN4bWwyLlhNTEhUVFAuMy4wJyApO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoICdNc3htbDIuWE1MSFRUUCcgKTtcbiAgICB9LFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCAnTWljcm9zb2Z0LlhNTEhUVFAnICk7XG4gICAgfVxuICBdO1xuXG4gIGZvciAoIGkgPSAwOyBpIDwgSFRUUEZhY3Rvcmllcy5sZW5ndGg7ICsraSApIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICggY3JlYXRlSFRUUFJlcXVlc3QgPSBIVFRQRmFjdG9yaWVzWyBpIF0gKSgpO1xuICAgIH0gY2F0Y2ggKCBleCApIHt9XG4gIH1cblxuICB0aHJvdyBFcnJvciggJ2Nhbm5vdCBjcmVhdGUgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0JyApO1xufVxuXG4vKipcbiAqIEBtZXRob2QgcGVha28uYWpheFxuICogQHBhcmFtICB7c3RyaW5nfG9iamVjdH0gcGF0aCAgICAgICAgICAgICAgQSBVUkwgb3Igb3B0aW9ucy5cbiAqIEBwYXJhbSAge29iamVjdH0gICAgICAgIFtvcHRpb25zXSAgICAgICAgIEFuIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICBbb3B0aW9ucy5wYXRoXSAgICBBIFVSTC5cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgIFtvcHRpb25zLm1ldGhvZF0gIERlZmF1bHQgdG8gJ0dFVCcgd2hlbiBubyBvcHRpb25zIG9yIG5vIGBkYXRhYCBpblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucywgb3IgJ1BPU1QnIHdoZW4gYGRhdGFgIGluIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICAgICBbb3B0aW9ucy5hc3luY10gICBEZWZhdWx0IHRvIGB0cnVlYCB3aGVuIG9wdGlvbnMgc3BlY2lmaWVkLCBvciBgZmFsc2VgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIG5vIG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICBbb3B0aW9ucy5zdWNjZXNzXSBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgc2VydmVyIHJlc3BvbmQgd2l0aCAyeHggc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLlxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgW29wdGlvbnMuZXJyb3JdICAgV2lsbCBiZSBjYWxsZWQgd2hlbiBhIHNlcnZlciByZXNwb25kIHdpdGggb3RoZXIgc3RhdHVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlIG9yIGFuIGVycm9yIG9jY3VycyB3aGlsZSBwYXJzaW5nIHJlc3BvbnNlLlxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgICAgICAgICAgUmV0dXJucyBhIHJlc3BvbnNlIGRhdGEgaWYgYSByZXF1ZXN0IHdhcyBzeW5jaHJvbm91c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcndpc2UgYG51bGxgLlxuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0PC9jYXB0aW9uPlxuICogdmFyIGRhdGEgPSBhamF4KCcuL2RhdGEuanNvbicpO1xuICogQGV4YW1wbGUgPGNhcHRpb24+U3luY2hyb25vdXMgKGRvIG5vdCB1c2UpIEdFVCByZXF1ZXN0LCB3aXRoIGNhbGxiYWNrczwvY2FwdGlvbj5cbiAqIHZhciBkYXRhID0gYWpheCgnLi9kYXRhLmpzb24nLCB7XG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGFzeW5jOiAgIGZhbHNlXG4gKiB9KTtcbiAqXG4gKiBmdW5jdGlvbiBzdWNjZXNzKHNhbWVEYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKHNhbWVEYXRhKTtcbiAqIH1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPkFzeW5jaHJvbm91cyBQT1NUIHJlcXVlc3Q8L2NhcHRpb24+XG4gKiBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gKiAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSB8fCB0aGlzLnN0YXR1cyArICc6ICcgKyB0aGlzLnN0YXR1c1RleHQpO1xuICogfVxuICpcbiAqIHZhciBoZWFkZXJzID0ge1xuICogICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gKiB9O1xuICpcbiAqIHZhciBkYXRhID0ge1xuICogICB1c2VybmFtZTogZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnVzZXJuYW1lLnZhbHVlLFxuICogICBzZXg6ICAgICAgZG9jdW1lbnQuZm9ybXMuc2lnbnVwLmVsZW1lbnRzLnNleC52YWx1ZVxuICogfVxuICpcbiAqIGFqYXgoJy9hcGkvc2lnbnVwLz9zdGVwPTAnLCB7XG4gKiAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gKiAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gKiAgIGVycm9yOiAgIGVycm9yLFxuICogICBkYXRhOiAgICBkYXRhXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gYWpheCAoIHBhdGgsIG9wdGlvbnMgKSB7XG4gIHZhciB0aW1lb3V0SWQgPSBudWxsO1xuICB2YXIgZGF0YSA9IG51bGw7XG4gIHZhciB4aHIgPSBjcmVhdGVIVFRQUmVxdWVzdCgpO1xuICB2YXIgcmVxQ29udGVudFR5cGU7XG4gIHZhciBhc3luYztcbiAgdmFyIG5hbWU7XG5cbiAgLy8gXy5hamF4KCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIGlmICggdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnICkge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0cyggX29wdGlvbnMsIHBhdGggKTtcbiAgICBhc3luYyA9ICEgKCAnYXN5bmMnIGluIG9wdGlvbnMgKSB8fCBvcHRpb25zLmFzeW5jO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGg7XG5cbiAgLy8gXy5hamF4KCBwYXRoICk7XG4gIC8vIGFzeW5jID0gZmFsc2VcbiAgfSBlbHNlIGlmICggdHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMgPT09IG51bGwgKSB7XG4gICAgb3B0aW9ucyA9IF9vcHRpb25zO1xuICAgIGFzeW5jID0gZmFsc2U7XG5cbiAgLy8gXy5hamF4KCBwYXRoLCBvcHRpb25zICk7XG4gIC8vIGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlXG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzKCBfb3B0aW9ucywgb3B0aW9ucyApO1xuICAgIGFzeW5jID0gISAoICdhc3luYycgaW4gb3B0aW9ucyApIHx8IG9wdGlvbnMuYXN5bmM7XG4gIH1cblxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXNDb250ZW50VHlwZTtcbiAgICB2YXIgc3RhdHVzO1xuICAgIHZhciBvYmplY3Q7XG4gICAgdmFyIGVycm9yO1xuXG4gICAgaWYgKCB0aGlzLnJlYWR5U3RhdGUgIT09IDQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCB0aGlzLnN0YXR1cyAhPT0gMTIyMyApIHtcbiAgICAgIHN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgPSAyMDQ7XG4gICAgfVxuXG4gICAgcmVzQ29udGVudFR5cGUgPSB0aGlzLmdldFJlc3BvbnNlSGVhZGVyKCAnY29udGVudC10eXBlJyApO1xuXG4gICAgb2JqZWN0ID0ge1xuICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICBwYXRoOiBwYXRoXG4gICAgfTtcblxuICAgIGRhdGEgPSB0aGlzLnJlc3BvbnNlVGV4dDtcblxuICAgIGlmICggcmVzQ29udGVudFR5cGUgKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoICEgcmVzQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL2pzb24nICkgKSB7XG4gICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoIGRhdGEgKTtcbiAgICAgICAgfSBlbHNlIGlmICggISByZXNDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyApICkge1xuICAgICAgICAgIGRhdGEgPSBxcy5wYXJzZSggZGF0YSApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggX2Vycm9yICkge1xuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCAhIGVycm9yICYmIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwICkge1xuICAgICAgaWYgKCB0aW1lb3V0SWQgIT09IG51bGwgKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgICB9XG5cbiAgICAgIGlmICggb3B0aW9ucy5zdWNjZXNzICkge1xuICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuY2FsbCggdGhpcywgZGF0YSwgb2JqZWN0ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICggb3B0aW9ucy5lcnJvciApIHtcbiAgICAgIG9wdGlvbnMuZXJyb3IuY2FsbCggdGhpcywgZGF0YSwgb2JqZWN0ICk7XG4gICAgfVxuICB9O1xuXG4gIGlmICggb3B0aW9ucy5tZXRob2QgPT09ICdQT1NUJyB8fCAnZGF0YScgaW4gb3B0aW9ucyApIHtcbiAgICB4aHIub3BlbiggJ1BPU1QnLCBwYXRoLCBhc3luYyApO1xuICB9IGVsc2Uge1xuICAgIHhoci5vcGVuKCAnR0VUJywgcGF0aCwgYXN5bmMgKTtcbiAgfVxuXG4gIGlmICggb3B0aW9ucy5oZWFkZXJzICkge1xuICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucy5oZWFkZXJzICkge1xuICAgICAgaWYgKCAhIGhhc093blByb3BlcnR5LmNhbGwoIG9wdGlvbnMuaGVhZGVycywgbmFtZSApICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnICkge1xuICAgICAgICByZXFDb250ZW50VHlwZSA9IG9wdGlvbnMuaGVhZGVyc1sgbmFtZSBdO1xuICAgICAgfVxuXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggbmFtZSwgb3B0aW9ucy5oZWFkZXJzWyBuYW1lIF0gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGFzeW5jICYmIHR5cGVvZiBvcHRpb25zLnRpbWVvdXQgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMudGltZW91dCAhPT0gbnVsbCApIHtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICB4aHIuYWJvcnQoKTtcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQgKTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHJlcUNvbnRlbnRUeXBlICE9PSAndW5kZWZpbmVkJyAmJiByZXFDb250ZW50VHlwZSAhPT0gbnVsbCAmJiAnZGF0YScgaW4gb3B0aW9ucyApIHtcbiAgICBpZiAoICEgcmVxQ29udGVudFR5cGUuaW5kZXhPZiggJ2FwcGxpY2F0aW9uL2pzb24nICkgKSB7XG4gICAgICB4aHIuc2VuZCggSlNPTi5zdHJpbmdpZnkoIG9wdGlvbnMuZGF0YSApICk7XG4gICAgfSBlbHNlIGlmICggISByZXFDb250ZW50VHlwZS5pbmRleE9mKCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyApICkge1xuICAgICAgeGhyLnNlbmQoIHFzLnN0cmluZ2lmeSggb3B0aW9ucy5kYXRhICkgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLnNlbmQoIG9wdGlvbnMuZGF0YSApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWFzc2lnbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIE9iamVjdC5hc3NpZ24gKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbjtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1hc3NpZ24nICkoIHJlcXVpcmUoICcuL2tleXMnICkgKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlQXNzaWduICggb2JqLCBzcmMsIGsgKSB7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IGsubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIG9ialsga1sgaSBdIF0gPSBzcmNbIGtbIGkgXSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUNsb25lQXJyYXkgKCBpdGVyYWJsZSApIHtcbiAgdmFyIGkgPSBpdGVyYWJsZS5sZW5ndGg7XG4gIHZhciBjbG9uZSA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICBpZiAoIGlzc2V0KCBpLCBpdGVyYWJsZSApICkge1xuICAgICAgY2xvbmVbIGkgXSA9IGl0ZXJhYmxlWyBpIF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNsb25lO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHRhcmdldCwgc291cmNlICkge1xuICBmb3IgKCB2YXIgaSA9IHNvdXJjZS5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICB0YXJnZXRbIGkgXSA9IHNvdXJjZVsgaSBdO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbnZhciBkZWZpbmVHZXR0ZXIgPSBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX187XG52YXIgZGVmaW5lU2V0dGVyID0gT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZVNldHRlcl9fO1xuXG5mdW5jdGlvbiBiYXNlRGVmaW5lUHJvcGVydHkgKCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApIHtcbiAgdmFyIGhhc0dldHRlciA9IGlzc2V0KCAnZ2V0JywgZGVzY3JpcHRvciApO1xuICB2YXIgaGFzU2V0dGVyID0gaXNzZXQoICdzZXQnLCBkZXNjcmlwdG9yICk7XG4gIHZhciBnZXQ7XG4gIHZhciBzZXQ7XG5cbiAgaWYgKCBoYXNHZXR0ZXIgfHwgaGFzU2V0dGVyICkge1xuICAgIGlmICggaGFzR2V0dGVyICYmIHR5cGVvZiggZ2V0ID0gZGVzY3JpcHRvci5nZXQgKSAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggJ0dldHRlciBtdXN0IGJlIGEgZnVuY3Rpb246ICcgKyBnZXQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGhhc1NldHRlciAmJiB0eXBlb2YoIHNldCA9IGRlc2NyaXB0b3Iuc2V0ICkgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uOiAnICsgc2V0ICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggJ3dyaXRhYmxlJywgZGVzY3JpcHRvciApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnSW52YWxpZCBwcm9wZXJ0eSBkZXNjcmlwdG9yLiBDYW5ub3QgYm90aCBzcGVjaWZ5IGFjY2Vzc29ycyBhbmQgYSB2YWx1ZSBvciB3cml0YWJsZSBhdHRyaWJ1dGUnICk7XG4gICAgfVxuXG4gICAgaWYgKCBkZWZpbmVHZXR0ZXIgKSB7XG4gICAgICBpZiAoIGhhc0dldHRlciApIHtcbiAgICAgICAgZGVmaW5lR2V0dGVyLmNhbGwoIG9iamVjdCwga2V5LCBnZXQgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBoYXNTZXR0ZXIgKSB7XG4gICAgICAgIGRlZmluZVNldHRlci5jYWxsKCBvYmplY3QsIGtleSwgc2V0ICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKCAnQ2Fubm90IGRlZmluZSBhIGdldHRlciBvciBzZXR0ZXInICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBpc3NldCggJ3ZhbHVlJywgZGVzY3JpcHRvciApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICB9IGVsc2UgaWYgKCAhIGlzc2V0KCBrZXksIG9iamVjdCApICkge1xuICAgIG9iamVjdFsga2V5IF0gPSB2b2lkIDA7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VEZWZpbmVQcm9wZXJ0eTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRXhlYyAoIHJlZ2V4cCwgc3RyaW5nICkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciB2YWx1ZTtcblxuICByZWdleHAubGFzdEluZGV4ID0gMDtcblxuICB3aGlsZSAoICggdmFsdWUgPSByZWdleHAuZXhlYyggc3RyaW5nICkgKSApIHtcbiAgICByZXN1bHQucHVzaCggdmFsdWUgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsbEl0ZXJhdGVlID0gcmVxdWlyZSggJy4uL2NhbGwtaXRlcmF0ZWUnICk7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VGb3JFYWNoICggYXJyLCBmbiwgY3R4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciBpO1xuICB2YXIgajtcblxuICBmb3IgKCBpID0gLTEsIGogPSBhcnIubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBpZHggPSBqO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZHggPSArK2k7XG4gICAgfVxuXG4gICAgaWYgKCBpc3NldCggaWR4LCBhcnIgKSAmJiBjYWxsSXRlcmF0ZWUoIGZuLCBjdHgsIGFyclsgaWR4IF0sIGlkeCwgYXJyICkgPT09IGZhbHNlICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFycjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlRm9ySW4gKCBvYmosIGZuLCBjdHgsIGZyb21SaWdodCwga2V5cyApIHtcbiAgdmFyIGtleTtcbiAgdmFyIGk7XG4gIHZhciBqO1xuXG4gIGZvciAoIGkgPSAtMSwgaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICBrZXkgPSBrZXlzWyBqIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IGtleXNbICsraSBdO1xuICAgIH1cblxuICAgIGlmICggY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCBvYmpbIGtleSBdLCBrZXksIG9iaiApID09PSBmYWxzZSApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNzZXQgPSByZXF1aXJlKCAnLi4vaXNzZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUdldCAoIG9iaiwgcGF0aCwgb2ZmICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGggLSBvZmY7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc3NldCA9IHJlcXVpcmUoICcuLi9pc3NldCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlSGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0gcGF0aC5sZW5ndGg7XG4gIHZhciBrZXk7XG5cbiAgZm9yICggOyBpIDwgbDsgKytpICkge1xuICAgIGtleSA9IHBhdGhbIGkgXTtcblxuICAgIGlmICggaXNzZXQoIGtleSwgb2JqICkgKSB7XG4gICAgICBvYmogPSBvYmpbIGtleSBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZVRvSW5kZXggPSByZXF1aXJlKCAnLi9iYXNlLXRvLWluZGV4JyApO1xuXG52YXIgaW5kZXhPZiAgICAgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZjtcbnZhciBsYXN0SW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcblxuZnVuY3Rpb24gYmFzZUluZGV4T2YgKCBhcnIsIHNlYXJjaCwgZnJvbUluZGV4LCBmcm9tUmlnaHQgKSB7XG4gIHZhciBpZHg7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuICB2YXIgajtcbiAgdmFyIGw7XG5cbiAgLy8gdXNlIHRoZSBuYXRpdmUgZnVuY3Rpb24gaWYgaXQgaXMgc3VwcG9ydGVkIGFuZCB0aGUgc2VhcmNoIGlzIG5vdCBuYW4uXG5cbiAgaWYgKCBzZWFyY2ggPT09IHNlYXJjaCAmJiAoIGlkeCA9IGZyb21SaWdodCA/IGxhc3RJbmRleE9mIDogaW5kZXhPZiApICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlcm5hcnlcbiAgICByZXR1cm4gaWR4LmNhbGwoIGFyciwgc2VhcmNoLCBmcm9tSW5kZXggKTtcbiAgfVxuXG4gIGwgPSBhcnIubGVuZ3RoO1xuXG4gIGlmICggISBsICkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGogPSBsIC0gMTtcblxuICBpZiAoIHR5cGVvZiBmcm9tSW5kZXggIT09ICd1bmRlZmluZWQnICkge1xuICAgIGZyb21JbmRleCA9IGJhc2VUb0luZGV4KCBmcm9tSW5kZXgsIGwgKTtcblxuICAgIGlmICggZnJvbVJpZ2h0ICkge1xuICAgICAgaiA9IE1hdGgubWluKCBqLCBmcm9tSW5kZXggKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaiA9IE1hdGgubWF4KCAwLCBmcm9tSW5kZXggKTtcbiAgICB9XG5cbiAgICBpID0gaiAtIDE7XG4gIH0gZWxzZSB7XG4gICAgaSA9IC0xO1xuICB9XG5cbiAgZm9yICggOyBqID49IDA7IC0taiApIHtcbiAgICBpZiAoIGZyb21SaWdodCApIHtcbiAgICAgIGlkeCA9IGo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkeCA9ICsraTtcbiAgICB9XG5cbiAgICB2YWwgPSBhcnJbIGlkeCBdO1xuXG4gICAgaWYgKCB2YWwgPT09IHNlYXJjaCB8fCBzZWFyY2ggIT09IHNlYXJjaCAmJiB2YWwgIT09IHZhbCApIHtcbiAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0ID0gcmVxdWlyZSggJy4vYmFzZS1nZXQnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUludm9rZSAoIG9iamVjdCwgcGF0aCwgYXJncyApIHtcbiAgaWYgKCBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCBwYXRoLmxlbmd0aCA8PSAxICkge1xuICAgICAgcmV0dXJuIG9iamVjdFsgcGF0aFsgMCBdIF0uYXBwbHkoIG9iamVjdCwgYXJncyApO1xuICAgIH1cblxuICAgIGlmICggKCBvYmplY3QgPSBnZXQoIG9iamVjdCwgcGF0aCwgMSApICkgKSB7XG4gICAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyBwYXRoLmxlbmd0aCAtIDEgXSBdLmFwcGx5KCBvYmplY3QsIGFyZ3MgKTtcbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0ICAgICA9IHJlcXVpcmUoICcuLi9zdXBwb3J0L3N1cHBvcnQta2V5cycgKTtcblxudmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSggJy4vYmFzZS1pbmRleC1vZicgKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuaWYgKCBzdXBwb3J0ID09PSAnaGFzLWEtYnVnJyApIHtcbiAgdmFyIF9rZXlzID0gW1xuICAgICd0b1N0cmluZycsXG4gICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAndmFsdWVPZicsXG4gICAgJ2hhc093blByb3BlcnR5JyxcbiAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgICAnY29uc3RydWN0b3InXG4gIF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZUtleXMgKCBvYmplY3QgKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciBrZXk7XG4gIHZhciBpO1xuXG4gIGZvciAoIGtleSBpbiBvYmplY3QgKSB7XG4gICAgaWYgKCBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3QsIGtleSApICkge1xuICAgICAga2V5cy5wdXNoKCBrZXkgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIHN1cHBvcnQgPT09ICdoYXMtYS1idWcnICkge1xuICAgIGZvciAoIGkgPSBfa2V5cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGlmICggYmFzZUluZGV4T2YoIGtleXMsIF9rZXlzWyBpIF0gKSA8IDAgJiYgaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0LCBfa2V5c1sgaSBdICkgKSB7XG4gICAgICAgIGtleXMucHVzaCggX2tleXNbIGkgXSApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldCA9IHJlcXVpcmUoICcuL2Jhc2UtZ2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VQcm9wZXJ0eSAoIG9iamVjdCwgcGF0aCApIHtcbiAgaWYgKCBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgaWYgKCBwYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICByZXR1cm4gZ2V0KCBvYmplY3QsIHBhdGgsIDAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0WyBwYXRoWyAwIF0gXTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlUmFuZG9tICggbG93ZXIsIHVwcGVyICkge1xuICByZXR1cm4gbG93ZXIgKyBNYXRoLnJhbmRvbSgpICogKCB1cHBlciAtIGxvd2VyICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvcHMgPSByZXF1aXJlKCAnLi4vcHJvcHMnICk7XG5cbmlmICggcmVxdWlyZSggJy4uL3N1cHBvcnQvc3VwcG9ydC1nZXQtYXR0cmlidXRlJyApICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9yZW1vdmVBdHRyICggZWxlbWVudCwga2V5ICkge1xuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCBrZXkgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3JlbW92ZUF0dHIgKCBlbGVtZW50LCBrZXkgKSB7XG4gICAgZGVsZXRlIGVsZW1lbnRbIHByb3BzWyBrZXkgXSB8fCBrZXkgXTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzc2V0ID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJhc2VTZXQgKCBvYmosIHBhdGgsIHZhbCApIHtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IHBhdGgubGVuZ3RoO1xuICB2YXIga2V5O1xuXG4gIGZvciAoIDsgaSA8IGw7ICsraSApIHtcbiAgICBrZXkgPSBwYXRoWyBpIF07XG5cbiAgICBpZiAoIGkgPT09IGwgLSAxICkge1xuICAgICAgb2JqID0gb2JqWyBrZXkgXSA9IHZhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB9IGVsc2UgaWYgKCBpc3NldCgga2V5LCBvYmogKSApIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iaiA9IG9ialsga2V5IF0gPSB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYXNlVG9JbmRleCAoIHYsIGwgKSB7XG4gIGlmICggISBsIHx8ICEgdiApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmICggdiA8IDAgKSB7XG4gICAgdiArPSBsO1xuICB9XG5cbiAgcmV0dXJuIHYgfHwgMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZVZhbHVlcyAoIG9iamVjdCwga2V5cyApIHtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IEFycmF5KCBpICk7XG5cbiAgd2hpbGUgKCAtLWkgPj0gMCApIHtcbiAgICB2YWx1ZXNbIGkgXSA9IG9iamVjdFsga2V5c1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL2ludGVybmFsL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xudmFyIGRlZmF1bHRUbyA9IHJlcXVpcmUoICcuL2RlZmF1bHQtdG8nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVmb3JlICggbiwgZm4gKSB7XG4gIHZhciB2YWx1ZTtcblxuICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICB0aHJvdyBfQXJndW1lbnRFeGNlcHRpb24oIGZuLCAnYSBmdW5jdGlvbicgKTtcbiAgfVxuXG4gIG4gPSBkZWZhdWx0VG8oIG4sIDEgKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICggLS1uID49IDAgKSB7XG4gICAgICB2YWx1ZSA9IGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbnZhciBjb25zdGFudHMgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcbnZhciBpbmRleE9mICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2luZGV4LW9mJyApO1xuXG4vLyBGdW5jdGlvbjo6YmluZCgpIHBvbHlmaWxsLlxuXG52YXIgX2JpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBmdW5jdGlvbiBiaW5kICggYyApIHtcbiAgdmFyIGYgPSB0aGlzO1xuICB2YXIgYTtcblxuICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPD0gMiApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gYm91bmQgKCkge1xuICAgICAgcmV0dXJuIGYuYXBwbHkoIGMsIGFyZ3VtZW50cyApO1xuICAgIH07XG4gIH1cblxuICBhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuXG4gIHJldHVybiBmdW5jdGlvbiBib3VuZCAoKSB7XG4gICAgcmV0dXJuIGYuYXBwbHkoIGMsIGEuY29uY2F0KCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKSApO1xuICB9O1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gcCBUaGUgcGFydGlhbCBhcmd1bWVudHMuXG4gKiBAcGFyYW0ge0FycmF5fSBhIFRoZSBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IEEgcHJvY2Vzc2VkIGFyZ3VtZW50cy5cbiAqL1xuZnVuY3Rpb24gcHJvY2VzcyAoIHAsIGEgKSB7XG4gIHZhciByID0gW107XG4gIHZhciBqID0gLTE7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBmb3IgKCBpID0gMCwgbCA9IHAubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGlmICggcFsgaSBdID09PSBjb25zdGFudHMuUExBQ0VIT0xERVIgKSB7XG4gICAgICByLnB1c2goIGFbICsraiBdICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHIucHVzaCggcFsgaSBdICk7XG4gICAgfVxuICB9XG5cbiAgZm9yICggbCA9IGEubGVuZ3RoOyBqIDwgbDsgKytqICkge1xuICAgIHIucHVzaCggYVsgaSBdICk7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmIFRoZSB0YXJnZXQgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgYm91bmQuXG4gKiBAcGFyYW0geyp9IGMgVGhlIG5ldyBjb250ZXh0IGZvciB0aGUgdGFyZ2V0IGZ1bmN0aW9uLlxuICogQHBhcmFtIHsuLi4qfSBwIFRoZSBwYXJ0aWFsIGFyZ3VtZW50cywgbWF5IGNvbnRhaW4gY29uc3RhbnRzLlBMQUNFSE9MREVSLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBmICggeCwgeSApIHtcbiAqICAgcmV0dXJuIHRoaXNbIHggXSArIHRoaXNbIHkgXTtcbiAqIH1cbiAqXG4gKiBjb25zdCBjID0ge1xuICogICB4OiA0MixcbiAqICAgeTogMVxuICogfTtcbiAqXG4gKiBjb25zdCBib3VuZCA9IGJpbmQoIGYsIGMsIGNvbnN0YW50cy5QTEFDRUhPTERFUiwgJ3knICk7XG4gKlxuICogYm91bmQoICd4JyApOyAvLyAtPiA0M1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQgKCBmLCBjICkge1xuICB2YXIgcDtcblxuICBpZiAoIHR5cGVvZiBmICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggZiwgJ2EgZnVuY3Rpb24nICk7XG4gIH1cblxuICAvLyBubyBwYXJ0aWFsIGFyZ3VtZW50cyB3ZXJlIHByb3ZpZGVkXG5cbiAgaWYgKCBhcmd1bWVudHMubGVuZ3RoIDw9IDIgKSB7XG4gICAgcmV0dXJuIF9iaW5kLmNhbGwoIGYsIGMgKTtcbiAgfVxuXG4gIHAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAyICk7XG5cbiAgLy8gbm8gcGxhY2Vob2xkZXJzIGluIHRoZSBwYXJ0aWFsIGFyZ3VtZW50c1xuXG4gIGlmICggaW5kZXhPZiggcCwgY29uc3RhbnRzLlBMQUNFSE9MREVSICkgPCAwICkge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbC5hcHBseSggX2JpbmQsIGFyZ3VtZW50cyApO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kICgpIHtcbiAgICByZXR1cm4gZi5hcHBseSggYywgcHJvY2VzcyggcCwgYXJndW1lbnRzICkgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FsbEl0ZXJhdGVlICggZm4sIGN0eCwgdmFsLCBrZXksIG9iaiApIHtcbiAgaWYgKCB0eXBlb2YgY3R4ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICByZXR1cm4gZm4oIHZhbCwga2V5LCBvYmogKTtcbiAgfVxuXG4gIHJldHVybiBmbi5jYWxsKCBjdHgsIHZhbCwga2V5LCBvYmogKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1cHBlckZpcnN0ID0gcmVxdWlyZSggJy4vdXBwZXItZmlyc3QnICk7XG5cbi8vIGNhbWVsaXplKCAnYmFja2dyb3VuZC1yZXBlYXQteCcgKTsgLy8gLT4gJ2JhY2tncm91bmRSZXBlYXRYJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplICggc3RyaW5nICkge1xuICB2YXIgd29yZHMgPSBzdHJpbmcubWF0Y2goIC9bMC05YS16XSsvZ2kgKTtcbiAgdmFyIHJlc3VsdDtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGlmICggISB3b3JkcyApIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXN1bHQgPSB3b3Jkc1sgMCBdLnRvTG93ZXJDYXNlKCk7XG5cbiAgZm9yICggaSA9IDEsIGwgPSB3b3Jkcy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgcmVzdWx0ICs9IHVwcGVyRmlyc3QoIHdvcmRzWyBpIF0gKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3VuZXNjYXBlID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdW5lc2NhcGUnICk7XG52YXIgX3R5cGUgICAgID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvdHlwZScgKTtcblxudmFyIGJhc2VFeGVjICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1leGVjJyApO1xuXG52YXIgaXNLZXkgICAgID0gcmVxdWlyZSggJy4vaXMta2V5JyApO1xudmFyIHRvS2V5ICAgICA9IHJlcXVpcmUoICcuL3RvLWtleScgKTtcblxudmFyIHJQcm9wZXJ0eSA9IC8oXnxcXC4pXFxzKihbX2Etel1cXHcqKVxccyp8XFxbXFxzKigoPzotKT8oPzpcXGQrfFxcZCpcXC5cXGQrKXwoXCJ8JykoKFteXFxcXF1cXFxcKFxcXFxcXFxcKSp8W15cXDRdKSopXFw0KVxccypcXF0vZ2k7XG5cbmZ1bmN0aW9uIHN0cmluZ1RvUGF0aCAoIHN0ciApIHtcbiAgdmFyIHBhdGggPSBiYXNlRXhlYyggclByb3BlcnR5LCBzdHIgKTtcbiAgdmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7XG4gIHZhciB2YWw7XG5cbiAgZm9yICggOyBpID49IDA7IC0taSApIHtcbiAgICB2YWwgPSBwYXRoWyBpIF07XG5cbiAgICAvLyAubmFtZVxuICAgIGlmICggdmFsWyAyIF0gKSB7XG4gICAgICBwYXRoWyBpIF0gPSB2YWxbIDIgXTtcbiAgICAvLyBbIFwiXCIgXSB8fCBbICcnIF1cbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsWyA1IF0gPT09ICdzdHJpbmcnICkge1xuICAgICAgcGF0aFsgaSBdID0gX3VuZXNjYXBlKCB2YWxbIDUgXSApO1xuICAgIC8vIFsgMCBdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdGhbIGkgXSA9IHZhbFsgMyBdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBjYXN0UGF0aCAoIHZhbCApIHtcbiAgdmFyIHBhdGg7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoIGlzS2V5KCB2YWwgKSApIHtcbiAgICByZXR1cm4gWyB0b0tleSggdmFsICkgXTtcbiAgfVxuXG4gIGlmICggX3R5cGUoIHZhbCApID09PSAnYXJyYXknICkge1xuICAgIHBhdGggPSBBcnJheSggbCA9IHZhbC5sZW5ndGggKTtcblxuICAgIGZvciAoIGkgPSBsIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBwYXRoWyBpIF0gPSB0b0tleSggdmFsWyBpIF0gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHN0cmluZ1RvUGF0aCggJycgKyB2YWwgKTtcbiAgfVxuXG4gIHJldHVybiBwYXRoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RQYXRoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsYW1wICggdmFsdWUsIGxvd2VyLCB1cHBlciApIHtcbiAgaWYgKCB2YWx1ZSA+PSB1cHBlciApIHtcbiAgICByZXR1cm4gdXBwZXI7XG4gIH1cblxuICBpZiAoIHZhbHVlIDw9IGxvd2VyICkge1xuICAgIHJldHVybiBsb3dlcjtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoICcuL2dldC1wcm90b3R5cGUtb2YnICk7XG52YXIgaXNPYmplY3RMaWtlICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciB0b09iamVjdCAgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoICcuL2NyZWF0ZScgKTtcbnZhciBlYWNoICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvbmUgKCBkZWVwLCB0YXJnZXQsIGd1YXJkICkge1xuICB2YXIgY2xuO1xuXG4gIGlmICggdHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgfHwgZ3VhcmQgKSB7XG4gICAgdGFyZ2V0ID0gZGVlcDtcbiAgICBkZWVwID0gdHJ1ZTtcbiAgfVxuXG4gIGNsbiA9IGNyZWF0ZSggZ2V0UHJvdG90eXBlT2YoIHRhcmdldCA9IHRvT2JqZWN0KCB0YXJnZXQgKSApICk7XG5cbiAgZWFjaCggdGFyZ2V0LCBmdW5jdGlvbiAoIHZhbHVlLCBrZXksIHRhcmdldCApIHtcbiAgICBpZiAoIHZhbHVlID09PSB0YXJnZXQgKSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IHRoaXM7XG4gICAgfSBlbHNlIGlmICggZGVlcCAmJiBpc09iamVjdExpa2UoIHZhbHVlICkgKSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IGNsb25lKCBkZWVwLCB2YWx1ZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzWyBrZXkgXSA9IHZhbHVlO1xuICAgIH1cbiAgfSwgY2xuICk7XG5cbiAgcmV0dXJuIGNsbjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9zZXN0ID0gcmVxdWlyZSggJy4vY2xvc2VzdCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9zZXN0Tm9kZSAoIGUsIGMgKSB7XG4gIGlmICggdHlwZW9mIGMgPT09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiBjbG9zZXN0LmNhbGwoIGUsIGMgKTtcbiAgfVxuXG4gIGRvIHtcbiAgICBpZiAoIGUgPT09IGMgKSB7XG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIH0gd2hpbGUgKCAoIGUgPSBlLnBhcmVudE5vZGUgKSApO1xuXG4gIHJldHVybiBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1hdGNoZXMgPSByZXF1aXJlKCAnLi9tYXRjaGVzLXNlbGVjdG9yJyApO1xuXG52YXIgY2xvc2VzdDtcblxuaWYgKCB0eXBlb2YgRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgISAoIGNsb3Nlc3QgPSBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ICkgKSB7XG4gIGNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0ICggc2VsZWN0b3IgKSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCBtYXRjaGVzLmNhbGwoIGVsZW1lbnQsIHNlbGVjdG9yICkgKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCAoIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQgKSApO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvc2VzdDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3VuZCAoIGZ1bmN0aW9ucyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbXBvdW5kZWQgKCkge1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgaTtcbiAgICB2YXIgbDtcblxuICAgIGZvciAoIGkgPSAwLCBsID0gZnVuY3Rpb25zLmxlbmd0aDsgaSA8IGw7ICsraSApIHtcbiAgICAgIHZhbHVlID0gZnVuY3Rpb25zWyBpIF0uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBFUlI6IHtcbiAgICBJTlZBTElEX0FSR1M6ICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50cycsXG4gICAgRlVOQ1RJT05fRVhQRUNURUQ6ICAgICAnRXhwZWN0ZWQgYSBmdW5jdGlvbicsXG4gICAgU1RSSU5HX0VYUEVDVEVEOiAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcnLFxuICAgIFVOREVGSU5FRF9PUl9OVUxMOiAgICAgJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcsXG4gICAgUkVEVUNFX09GX0VNUFRZX0FSUkFZOiAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScsXG4gICAgTk9fUEFUSDogICAgICAgICAgICAgICAnTm8gcGF0aCB3YXMgZ2l2ZW4nXG4gIH0sXG5cbiAgTUFYX0FSUkFZX0xFTkdUSDogNDI5NDk2NzI5NSxcbiAgTUFYX1NBRkVfSU5UOiAgICAgOTAwNzE5OTI1NDc0MDk5MSxcbiAgTUlOX1NBRkVfSU5UOiAgICAtOTAwNzE5OTI1NDc0MDk5MSxcblxuICBERUVQOiAgICAgICAgIDEsXG4gIERFRVBfS0VFUF9GTjogMixcblxuICBQTEFDRUhPTERFUjoge31cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSggJy4vZGVmaW5lLXByb3BlcnRpZXMnICk7XG5cbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoICcuL3NldC1wcm90b3R5cGUtb2YnICk7XG5cbnZhciBpc1ByaW1pdGl2ZSA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcblxuZnVuY3Rpb24gQyAoKSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlICggcHJvdG90eXBlLCBkZXNjcmlwdG9ycyApIHtcbiAgdmFyIG9iamVjdDtcblxuICBpZiAoIHByb3RvdHlwZSAhPT0gbnVsbCAmJiBpc1ByaW1pdGl2ZSggcHJvdG90eXBlICkgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogJyArIHByb3RvdHlwZSApO1xuICB9XG5cbiAgQy5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG5cbiAgb2JqZWN0ID0gbmV3IEMoKTtcblxuICBDLnByb3RvdHlwZSA9IG51bGw7XG5cbiAgaWYgKCBwcm90b3R5cGUgPT09IG51bGwgKSB7XG4gICAgc2V0UHJvdG90eXBlT2YoIG9iamVjdCwgbnVsbCApO1xuICB9XG5cbiAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID49IDIgKSB7XG4gICAgZGVmaW5lUHJvcGVydGllcyggb2JqZWN0LCBkZXNjcmlwdG9ycyApO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlQXNzaWduID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1hc3NpZ24nICk7XG52YXIgRVJSICAgICAgICA9IHJlcXVpcmUoICcuLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbiAoIGtleXMgKSB7XG4gIHJldHVybiBmdW5jdGlvbiBhc3NpZ24gKCBvYmogKSB7XG4gICAgdmFyIHNyYztcbiAgICB2YXIgbDtcbiAgICB2YXIgaTtcblxuICAgIGlmICggb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gMSwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyArK2kgKSB7XG4gICAgICBzcmMgPSBhcmd1bWVudHNbIGkgXTtcblxuICAgICAgaWYgKCBzcmMgIT09IG51bGwgJiYgdHlwZW9mIHNyYyAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIGJhc2VBc3NpZ24oIG9iaiwgc3JjLCBrZXlzKCBzcmMgKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUZvckVhY2ggID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItZWFjaCcgKTtcbnZhciBiYXNlRm9ySW4gICAgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWZvci1pbicgKTtcbnZhciBpc0FycmF5TGlrZSAgPSByZXF1aXJlKCAnLi4vaXMtYXJyYXktbGlrZScgKTtcbnZhciB0b09iamVjdCAgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhdGVlICAgICA9IHJlcXVpcmUoICcuLi9pdGVyYXRlZScgKS5pdGVyYXRlZTtcbnZhciBrZXlzICAgICAgICAgPSByZXF1aXJlKCAnLi4va2V5cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFYWNoICggZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZWFjaCAoIG9iaiwgZm4sIGN0eCApIHtcblxuICAgIG9iaiA9IHRvT2JqZWN0KCBvYmogKTtcblxuICAgIGZuICA9IGl0ZXJhdGVlKCBmbiApO1xuXG4gICAgaWYgKCBpc0FycmF5TGlrZSggb2JqICkgKSB7XG4gICAgICByZXR1cm4gYmFzZUZvckVhY2goIG9iaiwgZm4sIGN0eCwgZnJvbVJpZ2h0ICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VGb3JJbiggb2JqLCBmbiwgY3R4LCBmcm9tUmlnaHQsIGtleXMoIG9iaiApICk7XG5cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXNjYXBlICggcmVnZXhwLCBtYXAgKSB7XG4gIGZ1bmN0aW9uIHJlcGxhY2VyICggYyApIHtcbiAgICByZXR1cm4gbWFwWyBjIF07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gZXNjYXBlICggc3RyaW5nICkge1xuICAgIGlmICggc3RyaW5nID09PSBudWxsIHx8IHR5cGVvZiBzdHJpbmcgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiAoIHN0cmluZyArPSAnJyApLnJlcGxhY2UoIHJlZ2V4cCwgcmVwbGFjZXIgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsSXRlcmF0ZWUgPSByZXF1aXJlKCAnLi4vY2FsbC1pdGVyYXRlZScgKTtcbnZhciB0b09iamVjdCAgICAgPSByZXF1aXJlKCAnLi4vdG8tb2JqZWN0JyApO1xudmFyIGl0ZXJhYmxlICAgICA9IHJlcXVpcmUoICcuLi9pdGVyYWJsZScgKTtcbnZhciBpdGVyYXRlZSAgICAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG52YXIgaXNzZXQgICAgICAgID0gcmVxdWlyZSggJy4uL2lzc2V0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZpbmQgKCByZXR1cm5JbmRleCwgZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZmluZCAoIGFyciwgZm4sIGN0eCApIHtcbiAgICB2YXIgaiA9ICggYXJyID0gaXRlcmFibGUoIHRvT2JqZWN0KCBhcnIgKSApICkubGVuZ3RoIC0gMTtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHZhciBpZHg7XG4gICAgdmFyIHZhbDtcblxuICAgIGZuID0gaXRlcmF0ZWUoIGZuICk7XG5cbiAgICBmb3IgKCA7IGogPj0gMDsgLS1qICkge1xuICAgICAgaWYgKCBmcm9tUmlnaHQgKSB7XG4gICAgICAgIGlkeCA9IGo7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZHggPSArK2k7XG4gICAgICB9XG5cbiAgICAgIHZhbCA9IGFyclsgaWR4IF07XG5cbiAgICAgIGlmICggaXNzZXQoIGlkeCwgYXJyICkgJiYgY2FsbEl0ZXJhdGVlKCBmbiwgY3R4LCB2YWwsIGlkeCwgYXJyICkgKSB7XG4gICAgICAgIGlmICggcmV0dXJuSW5kZXggKSB7XG4gICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCByZXR1cm5JbmRleCApIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4uL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRmlyc3QgKCBuYW1lICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBzdHIgKSB7XG4gICAgaWYgKCBzdHIgPT09IG51bGwgfHwgdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICAgIH1cblxuICAgIHJldHVybiAoIHN0ciArPSAnJyApLmNoYXJBdCggMCApWyBuYW1lIF0oKSArIHN0ci5zbGljZSggMSApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VGb3JFYWNoID0gcmVxdWlyZSggJy4uL2Jhc2UvYmFzZS1mb3ItZWFjaCcgKTtcbnZhciB0b09iamVjdCAgICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmF0ZWUgICAgPSByZXF1aXJlKCAnLi4vaXRlcmF0ZWUnICkuaXRlcmF0ZWU7XG52YXIgaXRlcmFibGUgICAgPSByZXF1aXJlKCAnLi4vaXRlcmFibGUnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRm9yRWFjaCAoIGZyb21SaWdodCApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvckVhY2ggKCBhcnIsIGZuLCBjdHggKSB7XG4gICAgcmV0dXJuIGJhc2VGb3JFYWNoKCBpdGVyYWJsZSggdG9PYmplY3QoIGFyciApICksIGl0ZXJhdGVlKCBmbiApLCBjdHgsIGZyb21SaWdodCApO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VGb3JJbiA9IHJlcXVpcmUoICcuLi9iYXNlL2Jhc2UtZm9yLWluJyApO1xudmFyIHRvT2JqZWN0ICA9IHJlcXVpcmUoICcuLi90by1vYmplY3QnICk7XG52YXIgaXRlcmF0ZWUgID0gcmVxdWlyZSggJy4uL2l0ZXJhdGVlJyApLml0ZXJhdGVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZvckluICgga2V5cywgZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9ySW4gKCBvYmosIGZuLCBjdHggKSB7XG4gICAgcmV0dXJuIGJhc2VGb3JJbiggb2JqID0gdG9PYmplY3QoIG9iaiApLCBpdGVyYXRlZSggZm4gKSwgY3R4LCBmcm9tUmlnaHQsIGtleXMoIG9iaiApICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE11c3QgYmUgJ1dpZHRoJyBvciAnSGVpZ2h0JyAoY2FwaXRhbGl6ZWQpLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUdldEVsZW1lbnREaW1lbnNpb24gKCBuYW1lICkge1xuICAvKipcbiAgICogQHBhcmFtIHtXaW5kb3d8Tm9kZX0gZVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uICggZSApIHtcbiAgICB2YXIgdjtcbiAgICB2YXIgYjtcbiAgICB2YXIgZDtcblxuICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgd2luZG93XG5cbiAgICBpZiAoIGUud2luZG93ID09PSBlICkge1xuXG4gICAgICAvLyBpbm5lcldpZHRoIGFuZCBpbm5lckhlaWdodCBpbmNsdWRlcyBhIHNjcm9sbGJhciB3aWR0aCwgYnV0IGl0IGlzIG5vdFxuICAgICAgLy8gc3VwcG9ydGVkIGJ5IG9sZGVyIGJyb3dzZXJzXG5cbiAgICAgIHYgPSBNYXRoLm1heCggZVsgJ2lubmVyJyArIG5hbWUgXSB8fCAwLCBlLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFsgJ2NsaWVudCcgKyBuYW1lIF0gKTtcblxuICAgIC8vIGlmIHRoZSBlbGVtZW50cyBpcyBhIGRvY3VtZW50XG5cbiAgICB9IGVsc2UgaWYgKCBlLm5vZGVUeXBlID09PSA5ICkge1xuXG4gICAgICBiID0gZS5ib2R5O1xuICAgICAgZCA9IGUuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICB2ID0gTWF0aC5tYXgoXG4gICAgICAgIGJbICdzY3JvbGwnICsgbmFtZSBdLFxuICAgICAgICBkWyAnc2Nyb2xsJyArIG5hbWUgXSxcbiAgICAgICAgYlsgJ29mZnNldCcgKyBuYW1lIF0sXG4gICAgICAgIGRbICdvZmZzZXQnICsgbmFtZSBdLFxuICAgICAgICBiWyAnY2xpZW50JyArIG5hbWUgXSxcbiAgICAgICAgZFsgJ2NsaWVudCcgKyBuYW1lIF0gKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB2ID0gZVsgJ2NsaWVudCcgKyBuYW1lIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHY7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCAnLi4vYmFzZS9iYXNlLWluZGV4LW9mJyApO1xudmFyIHRvT2JqZWN0ICAgID0gcmVxdWlyZSggJy4uL3RvLW9iamVjdCcgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJbmRleE9mICggZnJvbVJpZ2h0ICkge1xuICByZXR1cm4gZnVuY3Rpb24gaW5kZXhPZiAoIGFyciwgc2VhcmNoLCBmcm9tSW5kZXggKSB7XG4gICAgcmV0dXJuIGJhc2VJbmRleE9mKCB0b09iamVjdCggYXJyICksIHNlYXJjaCwgZnJvbUluZGV4LCBmcm9tUmlnaHQgKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuLi9jYXN0LXBhdGgnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUHJvcGVydHlPZiAoIGJhc2VQcm9wZXJ0eSwgdXNlQXJncyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggb2JqZWN0ICkge1xuICAgIHZhciBhcmdzO1xuXG4gICAgaWYgKCB1c2VBcmdzICkge1xuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgICAgaWYgKCAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gYmFzZVByb3BlcnR5KCBvYmplY3QsIHBhdGgsIGFyZ3MgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4uL2Nhc3QtcGF0aCcgKTtcbnZhciBub29wICAgICA9IHJlcXVpcmUoICcuLi9ub29wJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVByb3BlcnR5ICggYmFzZVByb3BlcnR5LCB1c2VBcmdzICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgIHZhciBhcmdzO1xuXG4gICAgaWYgKCAhICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGggKSB7XG4gICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG5cbiAgICBpZiAoIHVzZUFyZ3MgKSB7XG4gICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoIG9iamVjdCApIHtcbiAgICAgIHJldHVybiBiYXNlUHJvcGVydHkoIG9iamVjdCwgcGF0aCwgYXJncyApO1xuICAgIH07XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3dvcmRzID0gcmVxdWlyZSggJy4uL2ludGVybmFsL3dvcmRzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jcmVhdGVSZW1vdmVQcm9wICggX3JlbW92ZVByb3AgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIGtleXMgKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGk7XG4gICAgdmFyIGo7XG5cbiAgICBpZiAoIHR5cGVvZiBrZXlzID09PSAnc3RyaW5nJyAgKSB7XG4gICAgICBrZXlzID0gX3dvcmRzKCBrZXlzICk7XG4gICAgfVxuXG4gICAgZm9yICggaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG4gICAgICBpZiAoICggZWxlbWVudCA9IHRoaXNbIGkgXSApLm5vZGVUeXBlICE9PSAxICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZm9yICggaiA9IGtleXMubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWogKSB7XG4gICAgICAgIF9yZW1vdmVQcm9wKCBlbGVtZW50LCBrZXlzWyBqIF0gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlIgPSByZXF1aXJlKCAnLi4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVUcmltICggcmVnZXhwICkge1xuICByZXR1cm4gZnVuY3Rpb24gdHJpbSAoIHN0cmluZyApIHtcbiAgICBpZiAoIHN0cmluZyA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyaW5nID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IFR5cGVFcnJvciggRVJSLlVOREVGSU5FRF9PUl9OVUxMICk7XG4gICAgfVxuXG4gICAgcmV0dXJuICggJycgKyBzdHJpbmcgKS5yZXBsYWNlKCByZWdleHAsICcnICk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2FuaW1hdGlvbkl0ZXJhdGlvbkNvdW50JzogdHJ1ZSxcbiAgJ2NvbHVtbkNvdW50JzogdHJ1ZSxcbiAgJ2ZpbGxPcGFjaXR5JzogdHJ1ZSxcbiAgJ2ZsZXhTaHJpbmsnOiB0cnVlLFxuICAnZm9udFdlaWdodCc6IHRydWUsXG4gICdsaW5lSGVpZ2h0JzogdHJ1ZSxcbiAgJ2ZsZXhHcm93JzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlLFxuICAnb3JwaGFucyc6IHRydWUsXG4gICd3aWRvd3MnOiB0cnVlLFxuICAnekluZGV4JzogdHJ1ZSxcbiAgJ29yZGVyJzogdHJ1ZSxcbiAgJ3pvb20nOiB0cnVlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0FyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSggJy4vaW50ZXJuYWwvQXJndW1lbnRFeGNlcHRpb24nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UgKCBtYXhXYWl0LCBmbiApIHtcbiAgdmFyIHRpbWVvdXRJZCA9IG51bGw7XG5cbiAgaWYgKCB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicgKSB7XG4gICAgdGhyb3cgX0FyZ3VtZW50RXhjZXB0aW9uKCBmbiwgJ2EgZnVuY3Rpb24nICk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgIGlmICggdGltZW91dElkICE9PSBudWxsICkge1xuICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SWQgKTtcbiAgICB9XG5cbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0LmFwcGx5KCBudWxsLCBbIGZuLCBtYXhXYWl0IF0uY29uY2F0KCBbXS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoIGZuLCBtYXhXYWl0ICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsICgpIHtcbiAgICBpZiAoIHRpbWVvdXRJZCAhPT0gbnVsbCApIHtcbiAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElkICk7XG4gICAgICB0aW1lb3V0SWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVib3VuY2VkOiBkZWJvdW5jZWQsXG4gICAgY2FuY2VsOiAgICBjYW5jZWxcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmYXVsdFRvICggdmFsdWUsIGRlZmF1bHRWYWx1ZSApIHtcbiAgaWYgKCB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSB2YWx1ZSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1peGluID0gcmVxdWlyZSggJy4vbWl4aW4nICk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRzICggZGVmYXVsdHMsIG9iamVjdCApIHtcbiAgaWYgKCBvYmplY3QgKSB7XG4gICAgcmV0dXJuIG1peGluKCB7fSwgZGVmYXVsdHMsIG9iamVjdCApO1xuICB9XG5cbiAgcmV0dXJuIG1peGluKCB7fSwgZGVmYXVsdHMgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VEZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHknICk7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgaXNQcmltaXRpdmUgICAgICAgID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xudmFyIGVhY2ggICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2VhY2gnICk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0aWVzO1xuXG5pZiAoIHN1cHBvcnQgIT09ICdmdWxsJyApIHtcbiAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMgKCBvYmplY3QsIGRlc2NyaXB0b3JzICkge1xuICAgIGlmICggc3VwcG9ydCAhPT0gJ25vdC1zdXBwb3J0ZWQnICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBvYmplY3QsIGRlc2NyaXB0b3JzICk7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG4gICAgfVxuXG4gICAgaWYgKCBpc1ByaW1pdGl2ZSggb2JqZWN0ICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdkZWZpbmVQcm9wZXJ0aWVzIGNhbGxlZCBvbiBub24tb2JqZWN0JyApO1xuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIGRlc2NyaXB0b3JzICkgKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogJyArIGRlc2NyaXB0b3JzICk7XG4gICAgfVxuXG4gICAgZWFjaCggZGVzY3JpcHRvcnMsIGZ1bmN0aW9uICggZGVzY3JpcHRvciwga2V5ICkge1xuICAgICAgaWYgKCBpc1ByaW1pdGl2ZSggZGVzY3JpcHRvciApICkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogJyArIGRlc2NyaXB0b3IgKTtcbiAgICAgIH1cblxuICAgICAgYmFzZURlZmluZVByb3BlcnR5KCB0aGlzLCBrZXksIGRlc2NyaXB0b3IgKTtcbiAgICB9LCBvYmplY3QgKTtcblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59IGVsc2Uge1xuICBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydGllcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhc2VEZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1kZWZpbmUtcHJvcGVydHknICk7XG5cbnZhciBzdXBwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zdXBwb3J0L3N1cHBvcnQtZGVmaW5lLXByb3BlcnR5JyApO1xuXG52YXIgaXNQcmltaXRpdmUgICAgICAgID0gcmVxdWlyZSggJy4vaXMtcHJpbWl0aXZlJyApO1xuXG52YXIgZGVmaW5lUHJvcGVydHk7XG5cbmlmICggc3VwcG9ydCAhPT0gJ2Z1bGwnICkge1xuICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5ICggb2JqZWN0LCBrZXksIGRlc2NyaXB0b3IgKSB7XG4gICAgaWYgKCBzdXBwb3J0ICE9PSAnbm90LXN1cHBvcnRlZCcgKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmplY3QsIGtleSwgZGVzY3JpcHRvciApO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuICAgIH1cblxuICAgIGlmICggaXNQcmltaXRpdmUoIG9iamVjdCApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3QnICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc1ByaW1pdGl2ZSggZGVzY3JpcHRvciApICkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICcgKyBkZXNjcmlwdG9yICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VEZWZpbmVQcm9wZXJ0eSggb2JqZWN0LCBrZXksIGRlc2NyaXB0b3IgKTtcbiAgfTtcbn0gZWxzZSB7XG4gIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnR5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZWFjaCcgKSggdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZWFjaCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZXNjYXBlJyApKCAvWzw+XCInJl0vZywge1xuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gIFwiJ1wiOiAnJiMzOTsnLFxuICAnXCInOiAnJiMzNDsnLFxuICAnJic6ICcmYW1wOydcbn0gKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb3Nlc3ROb2RlID0gcmVxdWlyZSggJy4vY2xvc2VzdC1ub2RlJyApO1xudmFyIERPTVdyYXBwZXIgID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbnZhciBFdmVudCAgICAgICA9IHJlcXVpcmUoICcuL0V2ZW50JyApO1xuXG52YXIgZXZlbnRzID0ge1xuICBpdGVtczoge30sXG4gIHR5cGVzOiBbXVxufTtcblxudmFyIHN1cHBvcnQgPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2FkZEV2ZW50TGlzdGVuZXInIGluIHNlbGY7XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHdoaWNoIHRoZSBsaXN0ZW5lciBzaG91bGQgYmUgYXR0YWNoZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgZXZlbnQgdHlwZSBuYW1lLlxuICogQHBhcmFtIHtzdHJpbmc/fSBzZWxlY3RvciBUaGUgc2VsZWN0b3IgdG8gd2hpY2ggZGVsZWdhdGUgYW4gZXZlbnQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciBUaGUgZXZlbnQgbGlzdGVuZXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVzZUNhcHR1cmVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29uZV0gUmVtb3ZlIHRoZSBsaXN0ZW5lciBhZnRlciBpdCBmaXJzdCBkaXNwYXRjaGluZz9cbiAqL1xuXG4vLyBvbiggZG9jdW1lbnQsICdjbGljaycsICcucG9zdF9fbGlrZS1idXR0b24nLCAoIGV2ZW50ICkgPT4ge1xuLy8gICBjb25zdCBkYXRhID0ge1xuLy8gICAgIGlkOiBfKCB0aGlzICkucGFyZW50KCAnLnBvc3QnICkuYXR0ciggJ2RhdGEtaWQnIClcbi8vICAgfVxuXG4vLyAgIGFqYXgoICcvbGlrZScsIHsgZGF0YSB9IClcbi8vIH0sIGZhbHNlIClcblxuZXhwb3J0cy5vbiA9IGZ1bmN0aW9uIG9uICggZWxlbWVudCwgdHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCB1c2VDYXB0dXJlLCBvbmUgKSB7XG4gIHZhciBpdGVtID0ge1xuICAgIHVzZUNhcHR1cmU6IHVzZUNhcHR1cmUsXG4gICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgb25lOiBvbmVcbiAgfTtcblxuICBpZiAoIHNlbGVjdG9yICkge1xuICAgIGl0ZW0uc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgfVxuXG4gIGlmICggc3VwcG9ydCApIHtcbiAgICBpdGVtLndyYXBwZXIgPSBmdW5jdGlvbiB3cmFwcGVyICggZXZlbnQsIF9lbGVtZW50ICkge1xuICAgICAgaWYgKCBzZWxlY3RvciAmJiAhIF9lbGVtZW50ICYmICEgKCBfZWxlbWVudCA9IGNsb3Nlc3ROb2RlKCBldmVudC50YXJnZXQsIHNlbGVjdG9yICkgKSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9uZSApIHtcbiAgICAgICAgZXhwb3J0cy5vZmYoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lci5jYWxsKCBfZWxlbWVudCB8fCBlbGVtZW50LCBuZXcgRXZlbnQoIGV2ZW50ICkgKTtcbiAgICB9O1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBpdGVtLndyYXBwZXIsIHVzZUNhcHR1cmUgKTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nICkge1xuICAgIGl0ZW0ud3JhcHBlciA9IGZ1bmN0aW9uIHdyYXBwZXIgKCBldmVudCwgX2VsZW1lbnQgKSB7XG4gICAgICBpZiAoIHNlbGVjdG9yICYmICEgX2VsZW1lbnQgJiYgISAoIF9lbGVtZW50ID0gY2xvc2VzdE5vZGUoIGV2ZW50LnRhcmdldCwgc2VsZWN0b3IgKSApICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggdHlwZSA9PT0gJ0RPTUNvbnRlbnRMb2FkZWQnICYmIGVsZW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJyApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG9uZSApIHtcbiAgICAgICAgZXhwb3J0cy5vZmYoIGVsZW1lbnQsIHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lci5jYWxsKCBfZWxlbWVudCB8fCBlbGVtZW50LCBuZXcgRXZlbnQoIGV2ZW50LCB0eXBlICkgKTtcbiAgICB9O1xuXG4gICAgZWxlbWVudC5hdHRhY2hFdmVudCggaXRlbS5JRVR5cGUgPSBJRVR5cGUoIHR5cGUgKSwgaXRlbS53cmFwcGVyICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCAnbm90IGltcGxlbWVudGVkJyApO1xuICB9XG5cbiAgaWYgKCBldmVudHMuaXRlbXNbIHR5cGUgXSApIHtcbiAgICBldmVudHMuaXRlbXNbIHR5cGUgXS5wdXNoKCBpdGVtICk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLml0ZW1zWyB0eXBlIF0gPSBbIGl0ZW0gXTtcbiAgICBldmVudHMuaXRlbXNbIHR5cGUgXS5pbmRleCA9IGV2ZW50cy50eXBlcy5sZW5ndGg7XG4gICAgZXZlbnRzLnR5cGVzLnB1c2goIHR5cGUgKTtcbiAgfVxufTtcblxuZXhwb3J0cy5vZmYgPSBmdW5jdGlvbiBvZmYgKCBlbGVtZW50LCB0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG4gIHZhciBpdGVtcztcbiAgdmFyIGl0ZW07XG4gIHZhciBpO1xuXG4gIGlmICggdHlwZSA9PT0gbnVsbCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZm9yICggaSA9IGV2ZW50cy50eXBlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICAgIGV2ZW50Lm9mZiggZWxlbWVudCwgZXZlbnRzLnR5cGVzWyBpIF0sIHNlbGVjdG9yICk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCAhICggaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgXSApICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSBpdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSApIHtcbiAgICBpdGVtID0gaXRlbXNbIGkgXTtcblxuICAgIGlmICggaXRlbS5lbGVtZW50ICE9PSBlbGVtZW50IHx8XG4gICAgICB0eXBlb2YgbGlzdGVuZXIgIT09ICd1bmRlZmluZWQnICYmIChcbiAgICAgICAgaXRlbS5saXN0ZW5lciAhPT0gbGlzdGVuZXIgfHxcbiAgICAgICAgaXRlbS51c2VDYXB0dXJlICE9PSB1c2VDYXB0dXJlIHx8XG4gICAgICAgIGl0ZW0uc2VsZWN0b3IgJiYgaXRlbS5zZWxlY3RvciAhPT0gc2VsZWN0b3IgKSApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGl0ZW1zLnNwbGljZSggaSwgMSApO1xuXG4gICAgaWYgKCAhIGl0ZW1zLmxlbmd0aCApIHtcbiAgICAgIGV2ZW50cy50eXBlcy5zcGxpY2UoIGl0ZW1zLmluZGV4LCAxICk7XG4gICAgICBldmVudHMuaXRlbXNbIHR5cGUgXSA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCBzdXBwb3J0ICkge1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBpdGVtLndyYXBwZXIsIGl0ZW0udXNlQ2FwdHVyZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmRldGFjaEV2ZW50KCBpdGVtLklFVHlwZSwgaXRlbS53cmFwcGVyICk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLnRyaWdnZXIgPSBmdW5jdGlvbiB0cmlnZ2VyICggZWxlbWVudCwgdHlwZSwgZGF0YSApIHtcbiAgdmFyIGl0ZW1zID0gZXZlbnRzLml0ZW1zWyB0eXBlIF07XG4gIHZhciBjbG9zZXN0O1xuICB2YXIgaXRlbTtcbiAgdmFyIGk7XG5cbiAgaWYgKCAhIGl0ZW1zICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyArK2kgKSB7XG4gICAgaXRlbSA9IGl0ZW1zWyBpIF07XG5cbiAgICBpZiAoIGVsZW1lbnQgKSB7XG4gICAgICBjbG9zZXN0ID0gY2xvc2VzdE5vZGUoIGVsZW1lbnQsIGl0ZW0uc2VsZWN0b3IgfHwgaXRlbS5lbGVtZW50ICk7XG4gICAgfSBlbHNlIGlmICggaXRlbS5zZWxlY3RvciApIHtcbiAgICAgIG5ldyBET01XcmFwcGVyKCBpdGVtLnNlbGVjdG9yICkuZWFjaCggKCBmdW5jdGlvbiAoIGl0ZW0gKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaXRlbS53cmFwcGVyKCBjcmVhdGVFdmVudFdpdGhUYXJnZXQoIHR5cGUsIGRhdGEsIHRoaXMgKSwgdGhpcyApO1xuICAgICAgICB9O1xuICAgICAgfSApKCBpdGVtICkgKTtcblxuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3Nlc3QgPSBpdGVtLmVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKCBjbG9zZXN0ICkge1xuICAgICAgaXRlbS53cmFwcGVyKCBjcmVhdGVFdmVudFdpdGhUYXJnZXQoIHR5cGUsIGRhdGEsIGVsZW1lbnQgfHwgY2xvc2VzdCApLCBjbG9zZXN0ICk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICggdGFyZ2V0LCBzb3VyY2UsIGRlZXAgKSB7XG4gIHZhciBpdGVtcztcbiAgdmFyIGl0ZW07XG4gIHZhciB0eXBlO1xuICB2YXIgaTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSBldmVudHMudHlwZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkgKSB7XG5cbiAgICBpZiAoICggaXRlbXMgPSBldmVudHMuaXRlbXNbIHR5cGUgPSBldmVudHMudHlwZXNbIGkgXSBdICkgKSB7XG5cbiAgICAgIGZvciAoIGogPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBqIDwgbDsgKytqICkge1xuXG4gICAgICAgIGlmICggKCBpdGVtID0gaXRlbXNbIGogXSApLnRhcmdldCA9PT0gc291cmNlICkge1xuICAgICAgICAgIGV2ZW50Lm9uKCB0YXJnZXQsIHR5cGUsIG51bGwsIGl0ZW0ubGlzdGVuZXIsIGl0ZW0udXNlQ2FwdHVyZSwgaXRlbS5vbmUgKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgfVxuXG4gIGlmICggISBkZWVwICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldCA9IHRhcmdldC5jaGlsZE5vZGVzO1xuICBzb3VyY2UgPSBzb3VyY2UuY2hpbGROb2RlcztcblxuICBmb3IgKCBpID0gdGFyZ2V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGV2ZW50LmNvcHkoIHRhcmdldFsgaSBdLCBzb3VyY2VbIGkgXSwgdHJ1ZSApO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFdpdGhUYXJnZXQgKCB0eXBlLCBkYXRhLCB0YXJnZXQgKSB7XG5cbiAgdmFyIGUgPSBuZXcgRXZlbnQoIHR5cGUsIGRhdGEgKTtcblxuICBlLnRhcmdldCA9IHRhcmdldDtcblxuICByZXR1cm4gZTtcblxufVxuXG5mdW5jdGlvbiBJRVR5cGUgKCB0eXBlICkge1xuICBpZiAoIHR5cGUgPT09ICdET01Db250ZW50TG9hZGVkJyApIHtcbiAgICByZXR1cm4gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gIH1cblxuICByZXR1cm4gJ29uJyArIHR5cGU7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCB0cnVlLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1maW5kJyApKCBmYWxzZSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmluZCcgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWVhY2gnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1lYWNoJyApKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMtaW4nICksIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWZvci1pbicgKSggcmVxdWlyZSggJy4va2V5cy1pbicgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZm9yLWluJyApKCByZXF1aXJlKCAnLi9rZXlzJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1mb3ItaW4nICkoIHJlcXVpcmUoICcuL2tleXMnICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xuXG52YXIgd3JhcHBlcnMgPSB7XG4gIGNvbDogICAgICBbIDIsICc8dGFibGU+PGNvbGdyb3VwPicsICc8L2NvbGdyb3VwPjwvdGFibGU+JyBdLFxuICB0cjogICAgICAgWyAyLCAnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPicgXSxcbiAgZGVmYXVsdHM6IFsgMCwgJycsICcnIF1cbn07XG5cbmZ1bmN0aW9uIGFwcGVuZCAoIGZyYWdtZW50LCBlbGVtZW50cyApIHtcbiAgZm9yICggdmFyIGkgPSAwLCBsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50c1sgaSBdICk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmcmFnbWVudCAoIGVsZW1lbnRzLCBjb250ZXh0ICkge1xuICB2YXIgZnJhZ21lbnQgPSBjb250ZXh0LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGVsZW1lbnQ7XG4gIHZhciB3cmFwcGVyO1xuICB2YXIgdGFnO1xuICB2YXIgZGl2O1xuICB2YXIgaTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50c1sgaSBdO1xuXG4gICAgaWYgKCBpc09iamVjdExpa2UoIGVsZW1lbnQgKSApIHtcbiAgICAgIGlmICggJ25vZGVUeXBlJyBpbiBlbGVtZW50ICkge1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggZWxlbWVudCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwZW5kKCBmcmFnbWVudCwgZWxlbWVudCApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIC88fCYjP1xcdys7Ly50ZXN0KCBlbGVtZW50ICkgKSB7XG4gICAgICBpZiAoICEgZGl2ICkge1xuICAgICAgICBkaXYgPSBjb250ZXh0LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICB9XG5cbiAgICAgIHRhZyA9IC88KFthLXpdW15cXHM+XSopL2kuZXhlYyggZWxlbWVudCApO1xuXG4gICAgICBpZiAoIHRhZyApIHtcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzWyB0YWcgPSB0YWdbIDEgXSBdIHx8IHdyYXBwZXJzWyB0YWcudG9Mb3dlckNhc2UoKSBdIHx8IHdyYXBwZXJzLmRlZmF1bHRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzLmRlZmF1bHRzO1xuICAgICAgfVxuXG4gICAgICBkaXYuaW5uZXJIVE1MID0gd3JhcHBlclsgMSBdICsgZWxlbWVudCArIHdyYXBwZXJbIDIgXTtcblxuICAgICAgZm9yICggaiA9IHdyYXBwZXJbIDAgXTsgaiA+IDA7IC0taiApIHtcbiAgICAgICAgZGl2ID0gZGl2Lmxhc3RDaGlsZDtcbiAgICAgIH1cblxuICAgICAgYXBwZW5kKCBmcmFnbWVudCwgZGl2LmNoaWxkTm9kZXMgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGNvbnRleHQuY3JlYXRlVGV4dE5vZGUoIGVsZW1lbnQgKSApO1xuICAgIH1cbiAgfVxuXG4gIGlmICggZGl2ICkge1xuICAgIGRpdi5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIHJldHVybiBmcmFnbWVudDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZnJvbVBhaXJzICggcGFpcnMgKSB7XG4gIHZhciBvYmplY3QgPSB7fTtcbiAgdmFyIGk7XG4gIHZhciBsO1xuXG4gIGZvciAoIGkgPSAwLCBsID0gcGFpcnMubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIG9iamVjdFsgcGFpcnNbIGkgXVsgMCBdIF0gPSBwYWlyc1sgaSBdWyAxIF07XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbicgKSggJ0hlaWdodCcgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLWdldC1lbGVtZW50LWRpbWVuc2lvbicgKSggJ1dpZHRoJyApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YgKCBvYmogKSB7XG4gIHZhciBwcm90b3R5cGU7XG5cbiAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgfVxuXG4gIHByb3RvdHlwZSA9IG9iai5fX3Byb3RvX187IC8vIGpzaGludCBpZ25vcmU6IGxpbmVcblxuICBpZiAoIHR5cGVvZiBwcm90b3R5cGUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBwcm90b3R5cGU7XG4gIH1cblxuICBpZiAoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggb2JqLmNvbnN0cnVjdG9yICkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgKSB7XG4gICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTdHlsZSAoIGUsIGssIGMgKSB7XG4gIHJldHVybiBlLnN0eWxlWyBrIF0gfHwgKCBjIHx8IGdldENvbXB1dGVkU3R5bGUoIGUgKSApLmdldFByb3BlcnR5VmFsdWUoIGsgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBiYXNlR2V0ICA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1nZXQnICk7XG52YXIgRVJSICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldCAoIG9iamVjdCwgcGF0aCApIHtcbiAgdmFyIGxlbmd0aCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGxlbmd0aCApIHtcbiAgICB0aHJvdyBFcnJvciggRVJSLk5PX1BBVEggKTtcbiAgfVxuXG4gIGlmICggbGVuZ3RoID4gMSApIHtcbiAgICByZXR1cm4gYmFzZUdldCggdG9PYmplY3QoIG9iamVjdCApLCBwYXRoLCAwICk7XG4gIH1cblxuICByZXR1cm4gdG9PYmplY3QoIG9iamVjdCApWyBwYXRoWyAwIF0gXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXN0UGF0aCA9IHJlcXVpcmUoICcuL2Nhc3QtcGF0aCcgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBpc3NldCAgICA9IHJlcXVpcmUoICcuL2lzc2V0JyApO1xudmFyIGJhc2VIYXMgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWhhcycgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzICggb2JqLCBwYXRoICkge1xuICB2YXIgbCA9ICggcGF0aCA9IGNhc3RQYXRoKCBwYXRoICkgKS5sZW5ndGg7XG5cbiAgaWYgKCAhIGwgKSB7XG4gICAgdGhyb3cgRXJyb3IoIEVSUi5OT19QQVRIICk7XG4gIH1cblxuICBpZiAoIGwgPiAxICkge1xuICAgIHJldHVybiBiYXNlSGFzKCB0b09iamVjdCggb2JqICksIHBhdGggKTtcbiAgfVxuXG4gIHJldHVybiBpc3NldCggdG9PYmplY3QoIG9iaiApLCBwYXRoWyAwIF0gKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaWRlbnRpdHkgKCB2ICkge1xuICByZXR1cm4gdjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1pbmRleC1vZicgKSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9Bcmd1bWVudEV4Y2VwdGlvbiAoIHVuZXhwZWN0ZWQsIGV4cGVjdGVkICkge1xuICByZXR1cm4gRXJyb3IoICdcIicgKyB0b1N0cmluZy5jYWxsKCB1bmV4cGVjdGVkICkgKyAnXCIgaXMgbm90ICcgKyBleHBlY3RlZCApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZmlyc3QgKCB3cmFwcGVyLCBlbGVtZW50ICkge1xuICB3cmFwcGVyWyAwIF0gPSBlbGVtZW50O1xuICB3cmFwcGVyLmxlbmd0aCA9IDE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIF9tZW1vaXplXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gZnVuY3Rpb25fXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfbWVtb2l6ZSAoIGZ1bmN0aW9uXyApIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuICB2YXIgbGFzdFJlc3VsdDtcbiAgdmFyIGxhc3RWYWx1ZTtcblxuICByZXR1cm4gZnVuY3Rpb24gbWVtb2l6ZWQgKCB2YWx1ZSApIHtcbiAgICBzd2l0Y2ggKCBmYWxzZSApIHtcbiAgICAgIGNhc2UgY2FsbGVkOlxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAvLyBmYWxscyB0aHJvdWdoXG4gICAgICBjYXNlIHZhbHVlID09PSBsYXN0VmFsdWU6XG4gICAgICAgIHJldHVybiAoIGxhc3RSZXN1bHQgPSBmdW5jdGlvbl8oICggbGFzdFZhbHVlID0gdmFsdWUgKSApICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhc3RSZXN1bHQ7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXNjYXBlID0gcmVxdWlyZSggJy4uL2VzY2FwZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfdGV4dENvbnRlbnQgKCBlbGVtZW50LCB2YWx1ZSApIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgY2hpbGRyZW47XG4gIHZhciBjaGlsZDtcbiAgdmFyIHR5cGU7XG4gIHZhciBpO1xuICB2YXIgbDtcblxuICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBlc2NhcGUoIHZhbHVlICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggaSA9IDAsIGwgPSAoIGNoaWxkcmVuID0gZWxlbWVudC5jaGlsZE5vZGVzICkubGVuZ3RoOyBpIDwgbDsgKytpICkge1xuICAgIC8vIFRFWFRfTk9ERVxuICAgIGlmICggKCB0eXBlID0gKCBjaGlsZCA9IGNoaWxkcmVuWyBpIF0gKS5ub2RlVHlwZSApID09PSAzICkge1xuICAgICAgcmVzdWx0ICs9IGNoaWxkLm5vZGVWYWx1ZTtcbiAgICAvLyBFTEVNRU5UX05PREVcbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAxICkge1xuICAgICAgcmVzdWx0ICs9IF90ZXh0Q29udGVudCggY2hpbGQgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9tZW1vaXplJyApKCByZXF1aXJlKCAnLi4vdHlwZScgKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF91bmVzY2FwZSAoIHN0cmluZyApIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKCAvXFxcXChcXFxcKT8vZywgJyQxJyApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9Bcmd1bWVudEV4Y2VwdGlvbiA9IHJlcXVpcmUoICcuL0FyZ3VtZW50RXhjZXB0aW9uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdvcmRzICggc3RyaW5nICkge1xuICBpZiAoIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnICkge1xuICAgIHRocm93IF9Bcmd1bWVudEV4Y2VwdGlvbiggc3RyaW5nLCAnYSBzdHJpbmcnICk7XG4gIH1cblxuICByZXR1cm4gc3RyaW5nLm1hdGNoKCAvW15cXHNcXHVGRUZGXFx4QTBdKy9nICkgfHwgW107XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIga2V5cyAgICAgPSByZXF1aXJlKCAnLi9rZXlzJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGludmVydCAoIG9iamVjdCApIHtcbiAgdmFyIGsgPSBrZXlzKCBvYmplY3QgPSB0b09iamVjdCggb2JqZWN0ICkgKTtcbiAgdmFyIGludmVydGVkID0ge307XG4gIHZhciBpO1xuXG4gIGZvciAoIGkgPSBrLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pICkge1xuICAgIGludmVydGVkWyBrWyBpIF0gXSA9IG9iamVjdFsga1sgaSBdIF07XG4gIH1cblxuICByZXR1cm4gaW52ZXJ0ZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNMZW5ndGggICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xudmFyIGlzV2luZG93TGlrZSA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdy1saWtlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgaXNMZW5ndGgoIHZhbHVlLmxlbmd0aCApICYmICEgaXNXaW5kb3dMaWtlKCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTGVuZ3RoICAgICA9IHJlcXVpcmUoICcuL2lzLWxlbmd0aCcgKTtcbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIHZhbHVlICkge1xuICBpZiAoIHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICkge1xuICAgIHJldHVybiBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiYgISBpc1dpbmRvd0xpa2UoIHZhbHVlICk7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcbnZhciBpc0xlbmd0aCAgICAgPSByZXF1aXJlKCAnLi9pcy1sZW5ndGgnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5ICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiZcbiAgICBpc0xlbmd0aCggdmFsdWUubGVuZ3RoICkgJiZcbiAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHZhbHVlICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG52YXIgaXNXaW5kb3dMaWtlID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNET01FbGVtZW50ICggdmFsdWUgKSB7XG4gIHZhciBub2RlVHlwZTtcblxuICBpZiAoICEgaXNPYmplY3RMaWtlKCB2YWx1ZSApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICggaXNXaW5kb3dMaWtlKCB2YWx1ZSApICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbm9kZVR5cGUgPSB2YWx1ZS5ub2RlVHlwZTtcblxuICByZXR1cm4gbm9kZVR5cGUgPT09IDEgfHwgLy8gRUxFTUVOVF9OT0RFXG4gICAgICAgICBub2RlVHlwZSA9PT0gMyB8fCAvLyBURVhUX05PREVcbiAgICAgICAgIG5vZGVUeXBlID09PSA4IHx8IC8vIENPTU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDkgfHwgLy8gRE9DVU1FTlRfTk9ERVxuICAgICAgICAgbm9kZVR5cGUgPT09IDExOyAgLy8gRE9DVU1FTlRfRlJBR01FTlRfTk9ERVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTnVtYmVyID0gcmVxdWlyZSggJy4vaXMtbnVtYmVyJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRmluaXRlICggdmFsdWUgKSB7XG4gIHJldHVybiBpc051bWJlciggdmFsdWUgKSAmJiBpc0Zpbml0ZSggdmFsdWUgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZSAgICA9IHJlcXVpcmUoICcuL2ludGVybmFsL3R5cGUnICk7XG5cbnZhciByRGVlcEtleSA9IC8oXnxbXlxcXFxdKShcXFxcXFxcXCkqKFxcLnxcXFspLztcblxuZnVuY3Rpb24gaXNLZXkgKCB2YWwgKSB7XG4gIHZhciB0eXBlO1xuXG4gIGlmICggISB2YWwgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoIF90eXBlKCB2YWwgKSA9PT0gJ2FycmF5JyApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0eXBlID0gdHlwZW9mIHZhbDtcblxuICBpZiAoIHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJyB8fCBfdHlwZSggdmFsICkgPT09ICdzeW1ib2wnICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuICEgckRlZXBLZXkudGVzdCggdmFsICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLk1BWF9BUlJBWV9MRU5HVEg7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNMZW5ndGggKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+PSAwICYmXG4gICAgdmFsdWUgPD0gTUFYX0FSUkFZX0xFTkdUSCAmJlxuICAgIHZhbHVlICUgMSA9PT0gMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNOYU4gKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNOdW1iZXIgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSAoIHZhbHVlICkge1xuICByZXR1cm4gISEgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QtbGlrZScgKTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3QgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSggdmFsdWUgKSAmJlxuICAgIHRvU3RyaW5nLmNhbGwoIHZhbHVlICkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSggJy4vZ2V0LXByb3RvdHlwZS1vZicgKTtcbnZhciBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdCcgKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcbnZhciBPQkpFQ1QgPSB0b1N0cmluZy5jYWxsKCBPYmplY3QgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0ICggdiApIHtcbiAgdmFyIHA7XG4gIHZhciBjO1xuXG4gIGlmICggISBpc09iamVjdCggdiApICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHAgPSBnZXRQcm90b3R5cGVPZiggdiApO1xuXG4gIGlmICggcCA9PT0gbnVsbCApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICggISBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBwLCAnY29uc3RydWN0b3InICkgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYyA9IHAuY29uc3RydWN0b3I7XG5cbiAgcmV0dXJuIHR5cGVvZiBjID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwoIGMgKSA9PT0gT0JKRUNUO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1ByaW1pdGl2ZSAoIHZhbHVlICkge1xuICByZXR1cm4gISB2YWx1ZSB8fFxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNGaW5pdGUgID0gcmVxdWlyZSggJy4vaXMtZmluaXRlJyApO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyICggdmFsdWUgKSB7XG4gIHJldHVybiBpc0Zpbml0ZSggdmFsdWUgKSAmJlxuICAgIHZhbHVlIDw9IGNvbnN0YW50cy5NQVhfU0FGRV9JTlQgJiZcbiAgICB2YWx1ZSA+PSBjb25zdGFudHMuTUlOX1NBRkVfSU5UICYmXG4gICAgdmFsdWUgJSAxID09PSAwO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N0cmluZyAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlID0gcmVxdWlyZSggJy4vdHlwZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N5bWJvbCAoIHZhbHVlICkge1xuICByZXR1cm4gdHlwZSggdmFsdWUgKSA9PT0gJ3N5bWJvbCc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSggJy4vaXMtb2JqZWN0LWxpa2UnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaW5kb3dMaWtlICggdmFsdWUgKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UoIHZhbHVlICkgJiYgdmFsdWUud2luZG93ID09PSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1dpbmRvd0xpa2UgPSByZXF1aXJlKCAnLi9pcy13aW5kb3ctbGlrZScgKTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaW5kb3cgKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGlzV2luZG93TGlrZSggdmFsdWUgKSAmJiB0b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBXaW5kb3ddJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNzZXQgKCBrZXksIG9iaiApIHtcbiAgaWYgKCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBvYmpbIGtleSBdICE9PSAndW5kZWZpbmVkJyB8fCBrZXkgaW4gb2JqO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtYXJyYXktbGlrZS1vYmplY3QnICk7XG52YXIgYmFzZVZhbHVlcyAgICAgICAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtdmFsdWVzJyApO1xudmFyIGtleXMgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpdGVyYWJsZSAoIHZhbHVlICkge1xuICBpZiAoIGlzQXJyYXlMaWtlT2JqZWN0KCB2YWx1ZSApICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gdmFsdWUuc3BsaXQoICcnICk7XG4gIH1cblxuICByZXR1cm4gYmFzZVZhbHVlcyggdmFsdWUsIGtleXMoIHZhbHVlICkgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xudmFyIG1hdGNoZXNQcm9wZXJ0eSAgID0gcmVxdWlyZSggJy4vbWF0Y2hlcy1wcm9wZXJ0eScgKTtcbnZhciBwcm9wZXJ0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5JyApO1xuXG5leHBvcnRzLml0ZXJhdGVlID0gZnVuY3Rpb24gaXRlcmF0ZWUgKCB2YWx1ZSApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKCBpc0FycmF5TGlrZU9iamVjdCggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gbWF0Y2hlc1Byb3BlcnR5KCB2YWx1ZSApO1xuICB9XG5cbiAgcmV0dXJuIHByb3BlcnR5KCB2YWx1ZSApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSggJy4vdG8tb2JqZWN0JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEtleXNJbiAoIG9iaiApIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIGtleTtcblxuICBvYmogPSB0b09iamVjdCggb2JqICk7XG5cbiAgZm9yICgga2V5IGluIG9iaiApIHtcbiAgICBrZXlzLnB1c2goIGtleSApO1xuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFzZUtleXMgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2Uta2V5cycgKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnZhciBzdXBwb3J0ICA9IHJlcXVpcmUoICcuL3N1cHBvcnQvc3VwcG9ydC1rZXlzJyApO1xuXG5pZiAoIHN1cHBvcnQgIT09ICdlczIwMTUnICkge1xuICB2YXIgX2tleXM7XG5cbiAgLyoqXG4gICAqICsgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSArXG4gICAqIHwgSSB0ZXN0ZWQgdGhlIGZ1bmN0aW9ucyB3aXRoIHN0cmluZ1syMDQ4XSAoYW4gYXJyYXkgb2Ygc3RyaW5ncykgYW5kIGhhZCB8XG4gICAqIHwgdGhpcyByZXN1bHRzIGluIE5vZGUuanMgKHY4LjEwLjApOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAqICsgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSArXG4gICAqIHwgYmFzZUtleXMgeCAxMCw2NzQgb3BzL3NlYyDCsTAuMjMlICg5NCBydW5zIHNhbXBsZWQpICAgICAgICAgICAgICAgICAgICAgfFxuICAgKiB8IE9iamVjdC5rZXlzIHggMjIsMTQ3IG9wcy9zZWMgwrEwLjIzJSAoOTUgcnVucyBzYW1wbGVkKSAgICAgICAgICAgICAgICAgIHxcbiAgICogfCBGYXN0ZXN0IGlzIFwiT2JqZWN0LmtleXNcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgKiArIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gK1xuICAgKi9cblxuICBpZiAoIHN1cHBvcnQgPT09ICdlczUnICkge1xuICAgIF9rZXlzID0gT2JqZWN0LmtleXM7XG4gIH0gZWxzZSB7XG4gICAgX2tleXMgPSBiYXNlS2V5cztcbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ga2V5cyAoIHYgKSB7XG4gICAgcmV0dXJuIF9rZXlzKCB0b09iamVjdCggdiApICk7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtaW5kZXgtb2YnICkoIHRydWUgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhc3RQYXRoID0gcmVxdWlyZSggJy4vY2FzdC1wYXRoJyApO1xudmFyIGdldCAgICAgID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLWdldCcgKTtcbnZhciBFUlIgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0YW50cycgKS5FUlI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWF0Y2hlc1Byb3BlcnR5ICggcHJvcGVydHkgKSB7XG4gIHZhciBwYXRoICA9IGNhc3RQYXRoKCBwcm9wZXJ0eVsgMCBdICk7XG4gIHZhciB2YWx1ZSA9IHByb3BlcnR5WyAxIF07XG5cbiAgaWYgKCAhIHBhdGgubGVuZ3RoICkge1xuICAgIHRocm93IEVycm9yKCBFUlIuTk9fUEFUSCApO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICggb2JqZWN0ICkge1xuICAgIGlmICggb2JqZWN0ID09PSBudWxsIHx8IHR5cGVvZiBvYmplY3QgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggcGF0aC5sZW5ndGggPiAxICkge1xuICAgICAgcmV0dXJuIGdldCggb2JqZWN0LCBwYXRoLCAwICkgPT09IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3RbIHBhdGhbIDAgXSBdID09PSB2YWx1ZTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1pbmRleC1vZicgKTtcblxudmFyIG1hdGNoZXM7XG5cbmlmICggdHlwZW9mIEVsZW1lbnQgPT09ICd1bmRlZmluZWQnIHx8ICEgKCBtYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyB8fCBFbGVtZW50LnByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgKSApIHtcbiAgbWF0Y2hlcyA9IGZ1bmN0aW9uIG1hdGNoZXMgKCBzZWxlY3RvciApIHtcbiAgICBpZiAoIC9eI1tcXHdcXC1dKyQvLnRlc3QoIHNlbGVjdG9yICs9ICcnICkgKSB7XG4gICAgICByZXR1cm4gJyMnICsgdGhpcy5pZCA9PT0gc2VsZWN0b3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VJbmRleE9mKCB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKSwgdGhpcyApID49IDA7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mJyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtaW52b2tlJyApLCB0cnVlICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS1wcm9wZXJ0eScgKSggcmVxdWlyZSggJy4vYmFzZS9iYXNlLWludm9rZScgKSwgdHJ1ZSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWVtb2l6ZSAgICAgICA9IHJlcXVpcmUoICcuL2ludGVybmFsL21lbW9pemUnICk7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSggJy4vaXMtcGxhaW4tb2JqZWN0JyApO1xudmFyIHRvT2JqZWN0ICAgICAgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIga2V5cyAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleXMnICk7XG52YXIgaXNBcnJheSAgICAgICA9IG1lbW9pemUoIHJlcXVpcmUoICcuL2lzLWFycmF5JyApICk7XG5cbi8qKlxuICogQG1ldGhvZCBwZWFrby5taXhpblxuICogQHBhcmFtICB7Ym9vbGVhbn0gICAgW2RlZXA9dHJ1ZV1cbiAqIEBwYXJhbSAge29iamVjdH0gICAgIHRhcmdldFxuICogQHBhcmFtICB7Li4ub2JqZWN0P30gb2JqZWN0XG4gKiBAcmV0dXJuIHtbdHlwZV19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWl4aW4gKCBkZWVwLCB0YXJnZXQgKSB7XG4gIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGkgPSAyO1xuICB2YXIgb2JqZWN0O1xuICB2YXIgc291cmNlO1xuICB2YXIgdmFsdWU7XG4gIHZhciBqO1xuICB2YXIgbDtcbiAgdmFyIGs7XG5cbiAgaWYgKCB0eXBlb2YgZGVlcCAhPT0gJ2Jvb2xlYW4nICkge1xuICAgIHRhcmdldCA9IGRlZXA7XG4gICAgZGVlcCA9IHRydWU7XG4gICAgaSA9IDE7XG4gIH1cblxuICB0YXJnZXQgPSB0b09iamVjdCggdGFyZ2V0ICk7XG5cbiAgZm9yICggOyBpIDwgYXJnc0xlbmd0aDsgKytpICkge1xuICAgIG9iamVjdCA9IGFyZ3VtZW50c1sgaSBdO1xuXG4gICAgaWYgKCAhIG9iamVjdCApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAoIGsgPSBrZXlzKCBvYmplY3QgKSwgaiA9IDAsIGwgPSBrLmxlbmd0aDsgaiA8IGw7ICsraiApIHtcbiAgICAgIHZhbHVlID0gb2JqZWN0WyBrWyBqIF0gXTtcblxuICAgICAgaWYgKCBkZWVwICYmIGlzUGxhaW5PYmplY3QoIHZhbHVlICkgfHwgaXNBcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgc291cmNlID0gdGFyZ2V0WyBrWyBqIF0gXTtcblxuICAgICAgICBpZiAoIGlzQXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgICAgaWYgKCAhIGlzQXJyYXkoIHNvdXJjZSApICkge1xuICAgICAgICAgICAgc291cmNlID0gW107XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICggISBpc1BsYWluT2JqZWN0KCBzb3VyY2UgKSApIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldFsga1sgaiBdIF0gPSBtaXhpbiggdHJ1ZSwgc291cmNlLCB2YWx1ZSApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0WyBrWyBqIF0gXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vb3AgKCkge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYnJhY2UtcnVsZXMvYnJhY2Utb24tc2FtZS1saW5lXG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gbm93ICgpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJlZm9yZSA9IHJlcXVpcmUoICcuL2JlZm9yZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlICggdGFyZ2V0ICkge1xuICByZXR1cm4gYmVmb3JlKCAxLCB0YXJnZXQgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlQ2xvbmVBcnJheSA9IHJlcXVpcmUoICcuL2Jhc2UvYmFzZS1jbG9uZS1hcnJheScgKTtcbnZhciBmcmFnbWVudCAgICAgICA9IHJlcXVpcmUoICcuL2ZyYWdtZW50JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSFRNTCAoIHN0cmluZywgY29udGV4dCApIHtcbiAgaWYgKCAvXig/OjwoW1xcdy1dKyk+PFxcL1tcXHctXSs+fDwoW1xcdy1dKykoPzpcXHMqXFwvKT8+KSQvLnRlc3QoIHN0cmluZyApICkge1xuICAgIHJldHVybiBbIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFJlZ0V4cC4kMSB8fCBSZWdFeHAuJDIgKSBdO1xuICB9XG5cbiAgcmV0dXJuIGJhc2VDbG9uZUFycmF5KCBmcmFnbWVudCggWyBzdHJpbmcgXSwgY29udGV4dCB8fCBkb2N1bWVudCApLmNoaWxkTm9kZXMgKTtcbn07XG4iLCIvKiFcbiAqIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFNJTEVOVFxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICpcbiAqIHBlYWtvOiAgICAgICAgICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9zaWxlbnQtdGVtcGVzdC9wZWFrb1xuICogYmFzZWQgb24ganF1ZXJ5OiAgICAgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnlcbiAqIGJhc2VkIG9uIHVuZGVyc2NvcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZVxuICogYmFzZWQgb24gbG9kYXNoOiAgICAgaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2hcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5hbWVzcGFjZSBwZWFrb1xuICovXG52YXIgcGVha287XG5cbmlmICggdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyApIHtcbiAgcGVha28gPSByZXF1aXJlKCAnLi9fJyApO1xuICBwZWFrby5ET01XcmFwcGVyID0gcmVxdWlyZSggJy4vRE9NV3JhcHBlcicgKTtcbn0gZWxzZSB7XG4gIHBlYWtvID0gZnVuY3Rpb24gcGVha28gKCkge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYnJhY2UtcnVsZXMvYnJhY2Utb24tc2FtZS1saW5lXG59XG5cbnBlYWtvLmFqYXggICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYWpheCcgKTtcbnBlYWtvLmFzc2lnbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYXNzaWduJyApO1xucGVha28uYXNzaWduSW4gICAgICAgICAgPSByZXF1aXJlKCAnLi9hc3NpZ24taW4nICk7XG5wZWFrby5jbG9uZSAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Nsb25lJyApO1xucGVha28uY3JlYXRlICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jcmVhdGUnICk7XG5wZWFrby5kZWZhdWx0cyAgICAgICAgICA9IHJlcXVpcmUoICcuL2RlZmF1bHRzJyApO1xucGVha28uZGVmaW5lUHJvcGVydHkgICAgPSByZXF1aXJlKCAnLi9kZWZpbmUtcHJvcGVydHknICk7XG5wZWFrby5kZWZpbmVQcm9wZXJ0aWVzICA9IHJlcXVpcmUoICcuL2RlZmluZS1wcm9wZXJ0aWVzJyApO1xucGVha28uZWFjaCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoJyApO1xucGVha28uZWFjaFJpZ2h0ICAgICAgICAgPSByZXF1aXJlKCAnLi9lYWNoLXJpZ2h0JyApO1xucGVha28uZ2V0UHJvdG90eXBlT2YgICAgPSByZXF1aXJlKCAnLi9nZXQtcHJvdG90eXBlLW9mJyApO1xucGVha28uaW5kZXhPZiAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pbmRleC1vZicgKTtcbnBlYWtvLmlzQXJyYXkgICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtYXJyYXknICk7XG5wZWFrby5pc0FycmF5TGlrZSAgICAgICA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2UnICk7XG5wZWFrby5pc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoICcuL2lzLWFycmF5LWxpa2Utb2JqZWN0JyApO1xucGVha28uaXNET01FbGVtZW50ICAgICAgPSByZXF1aXJlKCAnLi9pcy1kb20tZWxlbWVudCcgKTtcbnBlYWtvLmlzTGVuZ3RoICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbGVuZ3RoJyApO1xucGVha28uaXNPYmplY3QgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1vYmplY3QnICk7XG5wZWFrby5pc09iamVjdExpa2UgICAgICA9IHJlcXVpcmUoICcuL2lzLW9iamVjdC1saWtlJyApO1xucGVha28uaXNQbGFpbk9iamVjdCAgICAgPSByZXF1aXJlKCAnLi9pcy1wbGFpbi1vYmplY3QnICk7XG5wZWFrby5pc1ByaW1pdGl2ZSAgICAgICA9IHJlcXVpcmUoICcuL2lzLXByaW1pdGl2ZScgKTtcbnBlYWtvLmlzU3ltYm9sICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtc3ltYm9sJyApO1xucGVha28uaXNTdHJpbmcgICAgICAgICAgPSByZXF1aXJlKCAnLi9pcy1zdHJpbmcnICk7XG5wZWFrby5pc1dpbmRvdyAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLXdpbmRvdycgKTtcbnBlYWtvLmlzV2luZG93TGlrZSAgICAgID0gcmVxdWlyZSggJy4vaXMtd2luZG93LWxpa2UnICk7XG5wZWFrby5pc051bWJlciAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLW51bWJlcicgKTtcbnBlYWtvLmlzTmFOICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vaXMtbmFuJyApO1xucGVha28uaXNTYWZlSW50ZWdlciAgICAgPSByZXF1aXJlKCAnLi9pcy1zYWZlLWludGVnZXInICk7XG5wZWFrby5pc0Zpbml0ZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2lzLWZpbml0ZScgKTtcbnBlYWtvLmtleXMgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cycgKTtcbnBlYWtvLmtleXNJbiAgICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5cy1pbicgKTtcbnBlYWtvLmxhc3RJbmRleE9mICAgICAgID0gcmVxdWlyZSggJy4vbGFzdC1pbmRleC1vZicgKTtcbnBlYWtvLm1peGluICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbWl4aW4nICk7XG5wZWFrby5ub29wICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL25vb3AnICk7XG5wZWFrby5wcm9wZXJ0eSAgICAgICAgICA9IHJlcXVpcmUoICcuL3Byb3BlcnR5JyApO1xucGVha28ucHJvcGVydHlPZiAgICAgICAgPSByZXF1aXJlKCAnLi9wcm9wZXJ0eS1vZicgKTtcbnBlYWtvLm1ldGhvZCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vbWV0aG9kJyApO1xucGVha28ubWV0aG9kT2YgICAgICAgICAgPSByZXF1aXJlKCAnLi9tZXRob2Qtb2YnICk7XG5wZWFrby5zZXRQcm90b3R5cGVPZiAgICA9IHJlcXVpcmUoICcuL3NldC1wcm90b3R5cGUtb2YnICk7XG5wZWFrby50b09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoICcuL3RvLW9iamVjdCcgKTtcbnBlYWtvLnR5cGUgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdHlwZScgKTtcbnBlYWtvLmZvckVhY2ggICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLWVhY2gnICk7XG5wZWFrby5mb3JFYWNoUmlnaHQgICAgICA9IHJlcXVpcmUoICcuL2Zvci1lYWNoLXJpZ2h0JyApO1xucGVha28uZm9ySW4gICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9mb3ItaW4nICk7XG5wZWFrby5mb3JJblJpZ2h0ICAgICAgICA9IHJlcXVpcmUoICcuL2Zvci1pbi1yaWdodCcgKTtcbnBlYWtvLmZvck93biAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZm9yLW93bicgKTtcbnBlYWtvLmZvck93blJpZ2h0ICAgICAgID0gcmVxdWlyZSggJy4vZm9yLW93bi1yaWdodCcgKTtcbnBlYWtvLmJlZm9yZSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vYmVmb3JlJyApO1xucGVha28ub25jZSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9vbmNlJyApO1xucGVha28uZGVmYXVsdFRvICAgICAgICAgPSByZXF1aXJlKCAnLi9kZWZhdWx0LXRvJyApO1xucGVha28udGltZXIgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90aW1lcicgKTtcbnBlYWtvLnRpbWVzdGFtcCAgICAgICAgID0gcmVxdWlyZSggJy4vdGltZXN0YW1wJyApO1xucGVha28ubm93ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9ub3cnICk7XG5wZWFrby5jbGFtcCAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NsYW1wJyApO1xucGVha28uYmluZCAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9iaW5kJyApO1xucGVha28udHJpbSAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi90cmltJyApO1xucGVha28udHJpbUVuZCAgICAgICAgICAgPSByZXF1aXJlKCAnLi90cmltLWVuZCcgKTtcbnBlYWtvLnRyaW1TdGFydCAgICAgICAgID0gcmVxdWlyZSggJy4vdHJpbS1zdGFydCcgKTtcbnBlYWtvLmZpbmQgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZCcgKTtcbnBlYWtvLmZpbmRJbmRleCAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZC1pbmRleCcgKTtcbnBlYWtvLmZpbmRMYXN0ICAgICAgICAgID0gcmVxdWlyZSggJy4vZmluZC1sYXN0JyApO1xucGVha28uZmluZExhc3RJbmRleCAgICAgPSByZXF1aXJlKCAnLi9maW5kLWxhc3QtaW5kZXgnICk7XG5wZWFrby5oYXMgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2hhcycgKTtcbnBlYWtvLmdldCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZ2V0JyApO1xucGVha28uc2V0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9zZXQnICk7XG5wZWFrby5pdGVyYXRlZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2l0ZXJhdGVlJyApO1xucGVha28uaWRlbnRpdHkgICAgICAgICAgPSByZXF1aXJlKCAnLi9pZGVudGl0eScgKTtcbnBlYWtvLmVzY2FwZSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vZXNjYXBlJyApO1xucGVha28udW5lc2NhcGUgICAgICAgICAgPSByZXF1aXJlKCAnLi91bmVzY2FwZScgKTtcbnBlYWtvLnJhbmRvbSAgICAgICAgICAgID0gcmVxdWlyZSggJy4vcmFuZG9tJyApO1xucGVha28uZnJvbVBhaXJzICAgICAgICAgPSByZXF1aXJlKCAnLi9mcm9tLXBhaXJzJyApO1xucGVha28uY29uc3RhbnRzICAgICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICk7XG5wZWFrby50ZW1wbGF0ZSAgICAgICAgICA9IHJlcXVpcmUoICcuL3RlbXBsYXRlJyApO1xucGVha28udGVtcGxhdGVSZWdleHBzICAgPSByZXF1aXJlKCAnLi90ZW1wbGF0ZS1yZWdleHBzJyApO1xucGVha28uaW52ZXJ0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9pbnZlcnQnICk7XG5wZWFrby5jb21wb3VuZCAgICAgICAgICA9IHJlcXVpcmUoICcuL2NvbXBvdW5kJyApO1xucGVha28uZGVib3VuY2UgICAgICAgICAgPSByZXF1aXJlKCAnLi9kZWJvdW5jZScgKTtcblxuaWYgKCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gIHNlbGYucGVha28gPSBzZWxmLl8gPSBwZWFrbzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1tdWx0aS1hc3NpZ25cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwZWFrbztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5LW9mJyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtcHJvcGVydHknICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9jcmVhdGUvY3JlYXRlLXByb3BlcnR5JyApKCByZXF1aXJlKCAnLi9iYXNlL2Jhc2UtcHJvcGVydHknICkgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICdjbGFzcyc6ICdjbGFzc05hbWUnLFxuICAnZm9yJzogICAnaHRtbEZvcidcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlUmFuZG9tID0gcmVxdWlyZSggJy4vYmFzZS9iYXNlLXJhbmRvbScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByYW5kb20gKCBsb3dlciwgdXBwZXIsIGZsb2F0aW5nICkge1xuXG4gIC8vIF8ucmFuZG9tKCk7XG5cbiAgaWYgKCB0eXBlb2YgbG93ZXIgPT09ICd1bmRlZmluZWQnICkge1xuICAgIGZsb2F0aW5nID0gZmFsc2U7XG4gICAgdXBwZXIgPSAxO1xuICAgIGxvd2VyID0gMDtcbiAgfSBlbHNlIGlmICggdHlwZW9mIHVwcGVyID09PSAndW5kZWZpbmVkJyApIHtcblxuICAgIC8vIF8ucmFuZG9tKCBmbG9hdGluZyApO1xuXG4gICAgaWYgKCB0eXBlb2YgbG93ZXIgPT09ICdib29sZWFuJyApIHtcbiAgICAgIGZsb2F0aW5nID0gbG93ZXI7XG4gICAgICB1cHBlciA9IDE7XG5cbiAgICAvLyBfLnJhbmRvbSggdXBwZXIgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBmbG9hdGluZyA9IGZhbHNlO1xuICAgICAgdXBwZXIgPSBsb3dlcjtcbiAgICB9XG5cbiAgICBsb3dlciA9IDA7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBmbG9hdGluZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cbiAgICAvLyBfLnJhbmRvbSggdXBwZXIsIGZsb2F0aW5nICk7XG5cbiAgICBpZiAoIHR5cGVvZiB1cHBlciA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgZmxvYXRpbmcgPSB1cHBlcjtcbiAgICAgIHVwcGVyID0gbG93ZXI7XG4gICAgICBsb3dlciA9IDA7XG5cbiAgICAvLyBfLnJhbmRvbSggbG93ZXIsIHVwcGVyICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgZmxvYXRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIGZsb2F0aW5nIHx8IGxvd2VyICUgMSB8fCB1cHBlciAlIDEgKSB7XG4gICAgcmV0dXJuIGJhc2VSYW5kb20oIGxvd2VyLCB1cHBlciApO1xuICB9XG5cbiAgcmV0dXJuIE1hdGgucm91bmQoIGJhc2VSYW5kb20oIGxvd2VyLCB1cHBlciApICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNQcmltaXRpdmUgPSByZXF1aXJlKCAnLi9pcy1wcmltaXRpdmUnICk7XG52YXIgRVJSICAgICAgICAgPSByZXF1aXJlKCAnLi9jb25zdGFudHMnICkuRVJSO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZiAoIHRhcmdldCwgcHJvdG90eXBlICkge1xuICBpZiAoIHRhcmdldCA9PT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoIEVSUi5VTkRFRklORURfT1JfTlVMTCApO1xuICB9XG5cbiAgaWYgKCBwcm90b3R5cGUgIT09IG51bGwgJiYgaXNQcmltaXRpdmUoIHByb3RvdHlwZSApICkge1xuICAgIHRocm93IFR5cGVFcnJvciggJ09iamVjdCBwcm90b3R5cGUgbWF5IG9ubHkgYmUgYW4gT2JqZWN0IG9yIG51bGw6ICcgKyBwcm90b3R5cGUgKTtcbiAgfVxuXG4gIGlmICggJ19fcHJvdG9fXycgaW4gdGFyZ2V0ICkge1xuICAgIHRhcmdldC5fX3Byb3RvX18gPSBwcm90b3R5cGU7IC8vIGpzaGludCBpZ25vcmU6IGxpbmVcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FzdFBhdGggPSByZXF1aXJlKCAnLi9jYXN0LXBhdGgnICk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCAnLi90by1vYmplY3QnICk7XG52YXIgYmFzZVNldCAgPSByZXF1aXJlKCAnLi9iYXNlL2Jhc2Utc2V0JyApO1xudmFyIEVSUiAgICAgID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXQgKCBvYmosIHBhdGgsIHZhbCApIHtcbiAgdmFyIGwgPSAoIHBhdGggPSBjYXN0UGF0aCggcGF0aCApICkubGVuZ3RoO1xuXG4gIGlmICggISBsICkge1xuICAgIHRocm93IEVycm9yKCBFUlIuTk9fUEFUSCApO1xuICB9XG5cbiAgaWYgKCBsID4gMSApIHtcbiAgICByZXR1cm4gYmFzZVNldCggdG9PYmplY3QoIG9iaiApLCBwYXRoLCB2YWwgKTtcbiAgfVxuXG4gIHJldHVybiAoIHRvT2JqZWN0KCBvYmogKVsgcGF0aFsgMCBdIF0gPSB2YWwgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0O1xuXG5mdW5jdGlvbiB0ZXN0ICggdGFyZ2V0ICkge1xuICB0cnkge1xuICAgIGlmICggJycgaW4gT2JqZWN0LmRlZmluZVByb3BlcnR5KCB0YXJnZXQsICcnLCB7fSApICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoICggZSApIHt9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5pZiAoIHRlc3QoIHt9ICkgKSB7XG4gIHN1cHBvcnQgPSAnZnVsbCc7XG59IGVsc2UgaWYgKCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHRlc3QoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApICkgKSB7XG4gIHN1cHBvcnQgPSAnZG9tJztcbn0gZWxzZSB7XG4gIHN1cHBvcnQgPSAnbm90LXN1cHBvcnRlZCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3VwcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcblxudHJ5IHtcbiAgaWYgKCBzcGFuLnNldEF0dHJpYnV0ZSggJ3gnLCAneScgKSwgc3Bhbi5nZXRBdHRyaWJ1dGUoICd4JyApID09PSAneScgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VxdWVuY2VzXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG51bGw7XG4gIH1cbn0gY2F0Y2ggKCBlcnJvciApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbn1cblxuc3BhbiA9IG51bGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdXBwb3J0O1xuXG5pZiAoIE9iamVjdC5rZXlzICkge1xuICB0cnkge1xuICAgIHN1cHBvcnQgPSBPYmplY3Qua2V5cyggJycgKSwgJ2VzMjAxNSc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zLCBuby1zZXF1ZW5jZXNcbiAgfSBjYXRjaCAoIGVycm9yICkge1xuICAgIHN1cHBvcnQgPSAnZXM1JztcbiAgfVxufSBlbHNlIGlmICggeyB0b1N0cmluZzogbnVsbCB9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCAndG9TdHJpbmcnICkgKSB7XG4gIHN1cHBvcnQgPSAnaGFzLWEtYnVnJztcbn0gZWxzZSB7XG4gIHN1cHBvcnQgPSAnbm90LXN1cHBvcnRlZCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3VwcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNhZmU6ICc8JT1cXFxccyooW15dKj8pXFxcXHMqJT4nLFxuICBodG1sOiAnPCUtXFxcXHMqKFteXSo/KVxcXFxzKiU+JyxcbiAgY29tbTogJzwlIyhbXl0qPyklPicsXG4gIGNvZGU6ICc8JVxcXFxzKihbXl0qPylcXFxccyolPidcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZWdleHBzID0gcmVxdWlyZSggJy4vdGVtcGxhdGUtcmVnZXhwcycgKTtcbnZhciBlc2NhcGUgID0gcmVxdWlyZSggJy4vZXNjYXBlJyApO1xuXG5mdW5jdGlvbiByZXBsYWNlciAoIG1hdGNoLCBzYWZlLCBodG1sLCBjb21tLCBjb2RlICkge1xuICBpZiAoIHNhZmUgIT09IG51bGwgJiYgdHlwZW9mIHNhZmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgIHJldHVybiBcIicrX2UoXCIgKyBzYWZlLnJlcGxhY2UoIC9cXFxcbi9nLCAnXFxuJyApICsgXCIpKydcIjtcbiAgfVxuXG4gIGlmICggaHRtbCAhPT0gbnVsbCAmJiB0eXBlb2YgaHRtbCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIFwiJysoXCIgKyBodG1sLnJlcGxhY2UoIC9cXFxcbi9nLCAnXFxuJyApICsgXCIpKydcIjtcbiAgfVxuXG4gIGlmICggY29kZSAhPT0gbnVsbCAmJiB0eXBlb2YgY29kZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgcmV0dXJuIFwiJztcIiArIGNvZGUucmVwbGFjZSggL1xcXFxuL2csICdcXG4nICkgKyBcIjtfcis9J1wiO1xuICB9XG5cbiAgLy8gY29tbWVudCBpcyBtYXRjaGVkIC0gZG8gbm90aGluZ1xuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogQG1lbWJlcm9mIHBlYWtvXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlIFRoZSB0ZW1wbGF0ZSBzb3VyY2UuXG4gKiBAZXhhbXBsZVxuICogdmFyIHRlbXBsYXRlID0gcGVha28udGVtcGxhdGUoJzx0aXRsZT48JS0gZGF0YS51c2VybmFtZSAlPjwvdGl0bGU+Jyk7XG4gKiB2YXIgaHRtbCA9IHRlbXBsYXRlLnJlbmRlcih7IHVzZXJuYW1lOiAnSm9obicgfSk7XG4gKiAvLyAtPiAnPHRpdGxlPkpvaG48L3RpdGxlPidcbiAqL1xuZnVuY3Rpb24gdGVtcGxhdGUgKCBzb3VyY2UgKSB7XG4gIHZhciByZWdleHAgPSBSZWdFeHAoIHJlZ2V4cHMuc2FmZSArXG4gICAgJ3wnICsgcmVnZXhwcy5odG1sICtcbiAgICAnfCcgKyByZWdleHBzLmNvbW0gK1xuICAgICd8JyArIHJlZ2V4cHMuY29kZSwgJ2cnICk7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgdmFyIF9yZW5kZXI7XG5cbiAgcmVzdWx0ICs9IFwiZnVuY3Rpb24gcHJpbnQoKXtfcis9QXJyYXkucHJvdG90eXBlLmpvaW4uY2FsbChhcmd1bWVudHMsJycpO31cIjtcblxuICByZXN1bHQgKz0gXCJ2YXIgX3I9J1wiO1xuXG4gIHJlc3VsdCArPSBzb3VyY2VcbiAgICAucmVwbGFjZSggL1xcbi9nLCAnXFxcXG4nIClcbiAgICAucmVwbGFjZSggcmVnZXhwLCByZXBsYWNlciApO1xuXG4gIHJlc3VsdCArPSBcIic7cmV0dXJuIF9yO1wiO1xuXG4gIF9yZW5kZXIgPSBGdW5jdGlvbiggJ2RhdGEnLCAnX2UnLCByZXN1bHQgKTsgLy8ganNoaW50IGlnbm9yZTogbGluZVxuXG4gIHJldHVybiB7XG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKCBkYXRhICkge1xuICAgICAgcmV0dXJuIF9yZW5kZXIuY2FsbCggdGhpcywgZGF0YSwgZXNjYXBlICk7XG4gICAgfSxcblxuICAgIHJlc3VsdDogcmVzdWx0LFxuICAgIHNvdXJjZTogc291cmNlXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG4iLCIvKipcbiAqIEJhc2VkIG9uIEVyaWsgTcO2bGxlciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGw6XG4gKlxuICogQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxIHdoaWNoIGRlcml2ZWQgZnJvbVxuICogaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiAqIGh0dHA6Ly9teS5vcGVyYS5jb20vZW1vbGxlci9ibG9nLzIwMTEvMTIvMjAvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1lci1hbmltYXRpbmdcbiAqXG4gKiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyLlxuICogRml4ZXMgZnJvbSBQYXVsIElyaXNoLCBUaW5vIFppamRlbCwgQW5kcmV3IE1hbywgS2xlbWVuIFNsYXZpxI0sIERhcml1cyBCYWNvbi5cbiAqXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHRpbWVzdGFtcCA9IHJlcXVpcmUoICcuL3RpbWVzdGFtcCcgKTtcblxudmFyIHJlcXVlc3RBRjtcbnZhciBjYW5jZWxBRjtcblxuaWYgKCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gIGNhbmNlbEFGID0gc2VsZi5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgcmVxdWVzdEFGID0gc2VsZi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBzZWxmLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHNlbGYubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xufVxuXG52YXIgbm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAhIHJlcXVlc3RBRiB8fCAhIGNhbmNlbEFGIHx8XG4gIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIC9pUChhZHxob25lfG9kKS4qT1NcXHM2Ly50ZXN0KCBuYXZpZ2F0b3IudXNlckFnZW50ICk7XG5cbmlmICggbm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKSB7XG4gIHZhciBsYXN0UmVxdWVzdFRpbWUgPSAwO1xuICB2YXIgZnJhbWVEdXJhdGlvbiAgID0gMTAwMCAvIDYwO1xuXG4gIGV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QgKCBhbmltYXRlICkge1xuICAgIHZhciBub3cgICAgICAgICAgICAgPSB0aW1lc3RhbXAoKTtcbiAgICB2YXIgbmV4dFJlcXVlc3RUaW1lID0gTWF0aC5tYXgoIGxhc3RSZXF1ZXN0VGltZSArIGZyYW1lRHVyYXRpb24sIG5vdyApO1xuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxhc3RSZXF1ZXN0VGltZSA9IG5leHRSZXF1ZXN0VGltZTtcbiAgICAgIGFuaW1hdGUoIG5vdyApO1xuICAgIH0sIG5leHRSZXF1ZXN0VGltZSAtIG5vdyApO1xuICB9O1xuXG4gIGV4cG9ydHMuY2FuY2VsID0gY2xlYXJUaW1lb3V0O1xufSBlbHNlIHtcbiAgZXhwb3J0cy5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdCAoIGFuaW1hdGUgKSB7XG4gICAgcmV0dXJuIHJlcXVlc3RBRiggYW5pbWF0ZSApO1xuICB9O1xuXG4gIGV4cG9ydHMuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsICggaWQgKSB7XG4gICAgcmV0dXJuIGNhbmNlbEFGKCBpZCApO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbm93ID0gcmVxdWlyZSggJy4vbm93JyApO1xudmFyIG5hdmlnYXRvclN0YXJ0O1xuXG5pZiAoIHR5cGVvZiBwZXJmb3JtYW5jZSA9PT0gJ3VuZGVmaW5lZCcgfHwgISBwZXJmb3JtYW5jZS5ub3cgKSB7XG4gIG5hdmlnYXRvclN0YXJ0ID0gbm93KCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0aW1lc3RhbXAgKCkge1xuICAgIHJldHVybiBub3coKSAtIG5hdmlnYXRvclN0YXJ0O1xuICB9O1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0aW1lc3RhbXAgKCkge1xuICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF91bmVzY2FwZSA9IHJlcXVpcmUoICcuL2ludGVybmFsL3VuZXNjYXBlJyApO1xuXG52YXIgaXNTeW1ib2wgID0gcmVxdWlyZSggJy4vaXMtc3ltYm9sJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gX3VuZXNjYXBlKCB2YWx1ZSApO1xuICB9XG5cbiAgaWYgKCBpc1N5bWJvbCggdmFsdWUgKSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICB2YXIga2V5ID0gJycgKyB2YWx1ZTtcblxuICBpZiAoIGtleSA9PT0gJzAnICYmIDEgLyB2YWx1ZSA9PT0gLUluZmluaXR5ICkge1xuICAgIHJldHVybiAnLTAnO1xuICB9XG5cbiAgcmV0dXJuIF91bmVzY2FwZSgga2V5ICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVJSID0gcmVxdWlyZSggJy4vY29uc3RhbnRzJyApLkVSUjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b09iamVjdCAoIHZhbHVlICkge1xuICBpZiAoIHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCBFUlIuVU5ERUZJTkVEX09SX05VTEwgKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QoIHZhbHVlICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIFN0cmluZy5wcm90b3R5cGUudHJpbUVuZCApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCAnLi9iaW5kJyApKCBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbCwgU3RyaW5nLnByb3RvdHlwZS50cmltRW5kICk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL1tcXHNcXHVGRUZGXFx4QTBdKyQvICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggU3RyaW5nLnByb3RvdHlwZS50cmltU3RhcnQgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vYmluZCcgKSggRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwsIFN0cmluZy5wcm90b3R5cGUudHJpbVN0YXJ0ICk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtdHJpbScgKSggL15bXFxzXFx1RkVGRlxceEEwXSsvICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICggU3RyaW5nLnByb3RvdHlwZS50cmltICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2JpbmQnICkoIEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsLCBTdHJpbmcucHJvdG90eXBlLnRyaW0gKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3JlYXRlL2NyZWF0ZS10cmltJyApKCAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskLyApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlID0gcmVxdWlyZSggJy4vY3JlYXRlJyApO1xuXG52YXIgY2FjaGUgPSBjcmVhdGUoIG51bGwgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0eXBlICggdmFsdWUgKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbiAgfVxuXG4gIGlmICggdmFsdWUgPT09IG51bGwgKSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuXG4gIHZhciBzdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHZhbHVlICk7XG5cbiAgaWYgKCAhIGNhY2hlWyBzdHJpbmcgXSApIHtcbiAgICBjYWNoZVsgc3RyaW5nIF0gPSBzdHJpbmcuc2xpY2UoIDgsIC0xICkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHJldHVybiBjYWNoZVsgc3RyaW5nIF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZXNjYXBlJyApKCAvJig/Omx0fGd0fCMzNHwjMzl8YW1wKTsvZywge1xuICAnJmx0Oyc6ICAnPCcsXG4gICcmZ3Q7JzogICc+JyxcbiAgJyYjMzQ7JzogJ1wiJyxcbiAgJyYjMzk7JzogXCInXCIsXG4gICcmYW1wOyc6ICcmJ1xufSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL2NyZWF0ZS9jcmVhdGUtZmlyc3QnICkoICd0b1VwcGVyQ2FzZScgKTtcbiJdfQ==
