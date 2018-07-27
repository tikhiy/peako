'use strict';

var qs        = require( './qs' ),
    defaults  = require( './defaults' ),
    o         = require( './ajax-options' );

var hasOwnProperty = {}.hasOwnProperty;

/**
 * Cross-browser XMLHttpRequest: https://stackoverflow.com/a/2557268
 */
function createHTTPRequest () {
  var HTTPFactories, i;

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
      // jshint -W067, -W021
      return ( createHTTPRequest = HTTPFactories[ i ] )();
      // jshint +W067, +W021
    } catch ( ex ) {}
  }

  throw Error( 'Cannot create XMLHttpRequest object' );
}

function ajax ( path, options ) {
  var data = null,
      xhr = createHTTPRequest(),
      async, timeoutID, ContentType, name;

  // _.ajax( options );
  // async = options.async || true
  if ( typeof path !== 'string' ) {
    options = defaults( o, path );
    async = ! ( 'async' in options ) || options.async;
    path = options.path;

  // _.ajax( path );
  // async = false
  } else if ( options == null ) {
    options = o;
    async = false;

  // _.ajax( path, options );
  // async = options.async || true
  } else {
    options = defaults( o, options );
    async = ! ( 'async' in options ) || options.async;
  }

  xhr.onreadystatechange = function () {
    var status, ContentType;

    if ( this.readyState !== 4 ) {
      return;
    }

    status = this.status;

    // normalize status code in IE
    // https://stackoverflow.com/questions/10046972/
    if ( status === 1223 ) {
      status = 204;
    }

    data = this.responseText;

    if ( ( ContentType = this.getResponseHeader( 'Content-Type' ) ) ) {
      try {
        if ( ! ContentType.indexOf( 'application/x-www-form-urlencoded' ) ) {
          data = qs.parse( data );
        } else if ( ! ContentType.indexOf( 'application/json' ) ) {
          data = JSON.parse( data );
        }
      } catch ( ex ) {}
    }

    if ( status === 200 ) {
      if ( timeoutID != null ) {
        clearTimeout( timeoutID );
      }

      if ( options.success ) {
        options.success.call( this, data, path, options );
      }
    } else if ( options.error ) {
      options.error.call( this, data, path, options );
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

      if ( name === 'Content-Type' ) {
        ContentType = options.headers[ name ];
      }

      xhr.setRequestHeader( name, options.headers[ name ] );
    }
  }

  if ( async && options.timeout != null ) {
    timeoutID = setTimeout( function () {
      xhr.abort();
    }, options.timeout );
  }

  if ( ContentType != null && 'data' in options ) {
    if ( ! ContentType.indexOf( 'application/x-www-form-urlencoded' ) ) {
      xhr.send( qs.stringify( options.data ) );
    } else if ( ! ContentType.indexOf( 'application/json' ) ) {
      xhr.send( JSON.stringify( options.data ) );
    } else {
      xhr.send( options.data );
    }
  } else {
    xhr.send();
  }

  return data;
}

module.exports = ajax;
