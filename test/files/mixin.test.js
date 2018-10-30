'use strict';

var mixin = require( '../../mixin' );

describe( 'peako.mixin', function ()
{
  it( 'works', function ()
  {
    var target = {
      array: [ 1, 2, 3 ],

      plain: {
        a: 1,
        b: 2,
        c: 3
      },

      other: null
    };

    var x = {
      array: [ 1, 42, 3, 4 ]
    };

    var y = {
      plain: {
        b: 42,
        d: 4
      },

      other: 'string'
    };

    mixin( true, target, x, y ).should.equal( target ).that.is.like( {
      array: [ 1, 42, 3, 4 ],

      plain: {
        a: 1,
        b: 42,
        c: 3,
        d: 4
      },

      other: 'string'
    } );
  } );
} );
