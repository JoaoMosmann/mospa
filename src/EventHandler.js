var EventHandler = function () {
    'use strict';
    var events = [];

    this.bind = function (event, fn, one) {
        if (fn === undefined) {
            throw new Error('The second parameter of bind must be passed.');
        }

        events.push({type: event, callback: fn, one: one});
    };

    this.one = function (event, fn) {
        this.bind(event, fn, true);
    };

    this.unbind = function (event, fn) {
        var i;
        for (i = 0; i < events.length; i += 1) {
            if (events[i] !== null && events[i].type === event && (events[i].callback === fn || fn === undefined)) {
                events[i] = null;
            }
        }
    };

    this.trigger = function (event, data) {
        var e, r, i;

        if (data === undefined) {
            data = {};
        }

        e = {
            stopped: false,
            stop: function () { this.stopped = true; },
            data: data
        };

        for (i = 0; i < events.length; i += 1) {
            if (e.stopped) {
                break;
            }
            if (events[i] !== null && events[i].type === event) {
                r = events[i].callback.call(this, e);
                if (events[i].one) {
                    events[i] = null;
                }
                if (r === false) {
                    break;
                }
            }
        }
    };

};