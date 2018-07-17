'use strict';

module.exports = function apply ( target, context, args ) {
  switch ( args.length ) {
    case 0:
      return target.call( context );
    case 1:
      return target.call( context, args[ 0 ] );
    case 2:
      return target.call( context, args[ 0 ], args[ 1 ] );
    case 3:
      return target.call( context, args[ 0 ], args[ 1 ], args[ 2 ] );
  }

  return target.apply( context, args );
};
