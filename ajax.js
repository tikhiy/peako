'use strict';

var defaults = require( './defaults' ),
    urlencode = require( './urlencode' ),
    hasOwnProperty = {}.hasOwnProperty;

var defaultOptions = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },

  timeout: 1000 * 60,
  type: 'GET'
};

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
      return ( createHTTPRequest = HTTPFactories[ i ] )();
    } catch ( ex ) {}
  }

  throw Error( "Can't create a request object." );
}

function ajax ( path, options ) {
  var data = null,
      xhr = createHTTPRequest(),
      async, timeoutID, ContentType, name;

  // _.ajax( options );
  // async = options.async || true
  if ( typeof path !== 'string' ) {
    options = defaults( defaultOptions, path );
    async = ! ( 'async' in options ) || options.async;
    path = options.path;

  // _.ajax( path );
  // async = false
  } else if ( options == null ) {
    options = defaultOptions;
    async = false;

  // _.ajax( path, options );
  // async = options.async || true
  } else {
    options = defaults( defaultOptions, options );
    async = ! ( 'async' in options ) || options.async;
  }

  xhr.onreadystatechange = function () {
    var status;

    if ( this.readyState !== 4 ) {
      return;
    }

    status = this.status;

    // normalize status code in IE
    // https://stackoverflow.com/questions/10046972/
    if ( status === 1223 ) {
      status = 204;
    }

    if ( status === 200 ) {
      if ( timeoutID != null ) {
        clearTimeout( timeoutID );
      }

      data = this.responseText;

      if ( options.success ) {
        options.success.call( this, data, path, options );
      }
    } else if ( options.error ) {
      options.error.call( this, path, options );
    }
  };

  if ( options.type === 'POST' || 'data' in options ) {
    xhr.open( 'POST', path, async );
  } else {
    xhr.open( 'GET', path, async );
  }

  if ( options.headers ) {
    for ( name in options.headers ) {
      if ( ! hasOwnProperty.call( options.headers ) ) {
        continue;
      }

      if ( name === 'Content-Type' ) {
        ContentType = options.headers[ name ];
      }

      xhr.setRequestHeader( name, options.headers[ name ] );
    }
  }

  if ( async ) {
    timeoutID = setTimeout( function () {
      xhr.abort();
    }, options.timeout );
  }

  if ( ContentType != null && ( options.type === 'POST' || 'data' in options ) ) {
    if ( ! ContentType.indexOf( 'application/x-www-form-urlencoded' ) ) {
      xhr.send( urlencode( options.data ) );
    } else if ( ! ContentType.indexOf( 'application/json' ) ) {
      xhr.send( JSON.stringify( options.data ) );
    } else {
      throw Error( 'Unknown Content-Type: ' + ContentType );
    }
  } else {
    xhr.send();
  }

  return data;
}

module.exports = ajax;
