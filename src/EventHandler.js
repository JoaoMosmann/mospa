var EventHandler = function () {
    'use strict';
    var events = {};

    this.bind = function (event, fn, one) {
        if (fn === undefined) {
            throw new Error('The second parameter of bind must be passed.');
        }
        if (!events[event]) {
            events[event] = [];
        }

        events[event].push({callback: fn, one: one});
    };

    this.one = function (event, fn) {
        this.bind(event, fn, true);
    };

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

    this.trigger = function (event, data) {
        var e, r, i, l,
            eventList = events[event];

        if (!eventList) {
            return false;
        }

        l = eventList.length;

        if (data === undefined) {
            data = {};
        }

        e = {
            stopped: false,
            stop: function () { this.stopped = true; },
            data: data
        };

        for (i = 0; i < l; i += 1) {
            if (e.stopped) {
                break;
            }
            if (eventList[i] !== null) {
                r = eventList[i].callback.call(this, e);
                if (eventList[i].one) {
                    eventList[i] = null;
                }
                if (r === false) {
                    break;
                }
            }
        }
    };

};