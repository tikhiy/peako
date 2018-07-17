'use strict';

var create      = require( './create' ),
    closestNode = require( './closest-node' ),
    Event       = require( './classes/event' ),
    root        = require( './root' );

var events = create( null ),
    eventTypes = [],
    isSupported = 'addEventListener' in this;

function on ( target, type, selector, listener, useCapture, one ) {
  var item;

  if ( useCapture === undefined ) {
    useCapture = false;
  }

  item = {
    useCapture: useCapture,
    listener: listener,
    selector: selector,
    target: target,
    one: one
  };

  if ( isSupported ) {
    item.wrapper = function ( ev, el ) {
      if ( selector && ! el && ! ( el = closestNode( ev.target, selector ) ) ) {
        return;
      }

      if ( one ) {
        event.off( target, type, selector, listener, useCapture );
      }

      listener.call( el || target, new Event( ev ) );
    };

    target.addEventListener( type, item.wrapper, useCapture );
  } else if ( typeof listener === 'function' ) {
    // el to call from trigger
    item.wrapper = function ( ev, el ) {
      if ( selector && ! el && ! ( el = closestNode( ev.target, selector ) ) ) {
        return;
      }

      if ( type === 'DOMContentLoaded' && target.readyState !== 'complete' ) {
        return;
      }

      if ( one ) {
        event.off( target, type, selector, listener, useCapture );
      }

      ev = new Event( ev || root.event );
      ev.type = type;
      listener.call( el || target, ev );
    };

    target.attachEvent( item.fixedType = fixType( type ), item.wrapper );
  } else {
    throw TypeError( 'This functionality not implemented' );
  }

  if ( events[ type ] ) {
    events[ type ].push( item );
  } else {
    events[ type ] = [ item ];
    // to remove using of indexOf later (in off())
    events[ type ].index = eventTypes.length;
    eventTypes.push( type );
  }
}

function off ( target, type, selector, listener, useCapture ) {
  var i, removeAllEvents, items, item;

  // remove all listeners.
  // event.off( target );
  if ( type === undefined ) {
    for ( i = __event_list_types.length - 1; i >= 0; --i ) {
      event.off( target, __event_list_types[ i ], selector );
    }

    return;
  }

  items = __event_list[ type ];

  if ( !items ) {
    return;
  }

  // event.off( target, type );
  removeAllEvents = listener === undefined;

  if ( useCapture === undefined ) {
    useCapture = false;
  }

  for ( i = items.length - 1; i >= 0; --i ) {
    item = items[ i ];

    if ( item.target !== target || ( item.selector || selector ) && item.selector !== selector ||
      !removeAllEvents && ( item.listener !== listener || item.useCapture !== useCapture ) )
    {
      continue;
    }

    items.splice( i, 1 );

    if ( !items.length ) {
      __event_list_types.splice( items.index, 1 );
      __event_list[ type ] = null;
    }

    if ( support.addEventListener ) {
      target.removeEventListener( type, item.wrapper, item.useCapture );
    } else {
      target.detachEvent( item.fixed_type, item.wrapper );
    }
  }
}

var event = {
  on: on,
  off: off,

  // event.on( window, 'some-event', function ( event ) {
  //   alert( event.some_data );
  // } );
  //
  // event.trigger( window, 'some-event', {
  //   some_data: 'something'
  // } );
  //
  // // trigger all 'some-event' listeners.
  // event.trigger( null, 'some-event' );

  trigger: function ( target, type, data ) {
    var i = 0,
        items = __event_list[ type ],
        item, clos;

    if ( !items ) {
      return;
    }

    for ( ; i < items.length; ++i ) {
      item = items[ i ];

      if ( target ) {
        clos = closestNode( target, item.selector || item.target );
      } else if ( item.selector ) {
        // Disable "Functions declared within loops referencing an outer scoped
        // variable may lead to confusing semantics.". Possibly it's temporary
        // solution.
        // jshint -W083
        new DOMWrapper( item.selector ).each( function () {
          item.wrapper( event.__create( type, data, this ), this );
        } );
        // jshint +W083

        continue;
      } else {
        clos = item.target;
      }

      if ( clos ) {
        item.wrapper( event.__create( type, data, target || clos ), clos );
      }
    }
  },

  __create: function ( type, data, target ) {
    var ev = new Event( type, data );
    ev.target = target;
    return ev;
  },

  copy: function ( target, source, deep ) {
    var i = __event_list_types.length - 1,
        type, items, item, j, len,
        t_children, s_children;

    for ( ; i >= 0; --i ) {
      items = __event_list[ type = __event_list_types[ i ] ];

      if ( !items ) {
        continue;
      }

      for ( j = 0, len = items.length; j < len; ++j ) {
        item = items[ j ];

        if ( item.target === source ) {
          event.on( target, type, null, item.listener, item.useCapture, item.one );
        }
      }
    }

    if ( deep ) {
      t_children = target.childNodes;
      s_children = source.childNodes;

      for ( i = t_children.length - 1; i >= 0; --i ) {
        event.copy( t_children[ i ], s_children[ i ], deep );
      }
    }

    return target;
  },

  // from jQuery
  which: function ( event ) {
    var button;

    if ( !event.type.indexOf( 'touch' ) ) {
      // It seems to me that this isn't correctly
      return 1;
    }

    // Add which for key events
    if ( event.which == null && !event.type.indexOf( 'key' ) ) {
      return event.charCode != null ? event.charCode : event.keyCode;
    }

    button = event.button;

    if ( event.which || button === undefined ||
      !/^(?:mouse|pointer|contextmenu|drag|drop)|click/.test( event.type ) )
    {
      return event.which;
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right

    if ( button & 1 ) {
      return 1;
    }

    if ( button & 2 ) {
      return 3;
    }

    if ( button & 4 ) {
      return 2;
    }

    return 0;
  },

  __fix_type: function ( type ) {
    if ( type === 'DOMContentLoaded' ) {
      return 'onreadystatechange';
    }

    return 'on' + type;
  }
};
