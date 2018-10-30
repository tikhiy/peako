'use strict';

var each = require( '../../each' );
var type = require( '../../type' );

describe( 'peako.type', function ()
{
  each( {
    'null':              [ null ],
    'undefined':         [ void 0 ],
    'boolean':           [ false, Object( false ) ],
    'number':            [ 42, Object( 42 ) ],
    'string':            [ 'abc', Object( 'abc' ) ],
    'symbol':            [ Symbol(), Object( Symbol() ) ],
    'asyncfunction':     [ async function () {} ],
    'generatorfunction': [ function * () {} ],
    'function':          [ function () {} ],
    'object':            [ {}, new function () {} ],
    'math':              [ Math ]
  }, function ( values, result )
  {
    describe( result, function ()
    {
      each( values, function ( value, index )
      {
        it( 'works #' + ( index + 1 ), function ()
        {
          type( value ).should.equal( result );
        } );
      } );
    } );
  } );
} );
