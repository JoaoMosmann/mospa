/**
 * @module mospa
 * @class mospa.EventHandler
 * @constructor
 */
mospa.EventHandler = function () {
    var events = {},
        hijackedEvents = {};

    /**
     * Bind a function to a event namespace.
     * @method bind
     * @param {String} event Event namespace.
     * @param {Function} fn Function to be called.
     * @param {Boolean} one If true. Call function only once.
     *
     * @example Binding a function
     *
     *     myobj.bind('when_visible', function(e) {
     *        
     *     });
     *
     */
    this.bind = function (event, fn, one) {
        if (fn === undefined) {
            throw new Error('The second parameter of bind must be passed.');
        }
        if (!events[event]) {
            events[event] = [];
        }

        events[event].push({callback: fn, one: one});
    };

    /**
     * Shortcut for biding a function to a event namespace that is called only once.
     * @method one
     * @param {String} event Event namespace.
     * @param {Function} fn Function to be called.
     *
     * @example Binding a function that is called only once.
     *
     *     myobj.one('when_visible', function(e) {
     *        
     *     });
     *
     */
    this.one = function (event, fn) {
        this.bind(event, fn, true);
    };

    /**
     * Unbind a function, or all function from a event namespace.
     * @method unbind
     * @param {String} event Event namespace.
     * @param {Function} fn Function to be unbinded.
     *
     * @example unbinding a function
     *
     *     myobj.unbind('when_visible', myFunction);   
     *
     * @example unbinding all functions from the event namespace in the object.
     *
     *     myobj.unbind('when_visible');   
     */
    this.unbind = function (event, fn) {
        var i, l,
            eventList = events[event];

        if (!eventList) {
            return false;
        }

        l = eventList.length;

        for (i = 0; i < l; i += 1) {
            if (eventList[i] !== null && (eventList[i].callback === fn || fn === undefined)) {
                eventList[i] = null;
            }
        }
    };

    /**
     * Triggers the event namespace, and call all related functions.
     * @method trigger
     * @param {String} event Event namespace.
     * @param {Object} data Data to passed to the binded functions through the triggering.
     *
     * @example Triggering a event
     *
     *     myobj.trigger('when_visible');   
     *
     */
    this.trigger = function (event, data) {
        var e, eventList = events[event];

        if (data === undefined) {
            data = {};
        }

        e = new mospa.Event(event, data, this, eventList);

        if (!!hijackedEvents[event] && hijackedEvents[event].constructor === Function) {

            // Check if this is really needed.
            delete e.stopped;
            delete e.stop;
            
            hijackedEvents[event].call(this, e);

            return true;
        }

        if (!eventList) {
            return false;
        }


        e.dispatchEvent();
    };

    /**
     * Hijack the event namespace. Making all triggers to call the passed function instead of binded functions, until the event namespace is freed by calling EventHandler.freeEvent
     * @method hijackEvent
     * @param {String} event Event namespace.
     * @param {Function} fn Function to be called instead of the binded functions.
     *
     * @example Hijacking a event
     *
     *     myobj.hijackEvent('when_visible', function(){ 
     *         // Now only me knows that you're visible
     *     });   
     *
     */
    this.hijackEvent = function (event, fn) {

        hijackedEvents[event] = fn;

    }

    /**
     * Free a hijacked event.
     * @method freeEvent
     * @param {String} event Event namespace.
     *
     * @example Freeing a event
     *
     *     myobj.freeEvent('when_visible');
     *
     */
    this.freeEvent = function (event) {

        hijackedEvents[event] = null;

    }

};