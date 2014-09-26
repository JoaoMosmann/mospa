(function(window) {
	'use strict';



if (typeof Object.create !== 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o) {
            if (arguments.length > 1) {
                throw new Error('Second argument not supported');
            }
            if (o === null) {
                throw new Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o !== 'object') {
                throw new TypeError('Argument must be an object');
            }
            F.prototype = o;
            return new F();
        };
    }());
}

var mospa = (function () {
    
    return {
        createApplication: function (type, config, constructor) {
            var AppClass = mospa.MosApplication,
                app;

            !config && (config = {});
            config.type = type;

            if (type === 'scrollapp') {
                AppClass = mospa.MosScrollApp;
            } else if (type === 'slideapp') {
                AppClass = mospa.MosSlideApp;
            } else if (!!type && type.constructor === Function) {
                /* With this you can implament your own kind of application flow. */
                AppClass = type;
            }

            app = new AppClass(config);

            if (typeof constructor === 'function') {
                constructor.call(app, config);
            }

            return app;

        }
    };

}());

window.mospa = mospa;
/**
 * @module mospa
 * @class mospa.Event
 * @constructor
 */
mospa.Event = function (type, data, context, eventList) {

	this.type = type;
	this.data = data;
	this.isStopped = false;
    this.isFreezed = false;
    this.freezedAt = 0;
	this.eventList = eventList;
	this.context = context;
}

/**
 * Dispatch the event to all related functions.
 * @method dispatchEvent
 * @param {Number} startAt Call functions starting from this index.
 *
 * @example Dispatching a event.
 *
 *     myEventObject.dispatchEvent();   
 *
 */
mospa.Event.prototype.dispatchEvent = function (startAt) {

	var l = this.eventList.length,
		i, r;

    for (i = startAt || 0; i < l; i += 1) {
        if (this.isStopped) {
            break;
        }
        if (this.isFreezed) {
            this.freezedAt = i;
            break;
        }
        if (this.eventList[i] !== null) {
            r = this.eventList[i].callback.call(this.context, this);
            if (!!this.eventList[i] && this.eventList[i].one) {
                this.eventList[i] = null;
            }
            if (r === false) {
                break;
            }
        }
    }

}

/**
 * Stop the propagation. No function will be called after this being called.
 * @method stop
 *
 * @example Stoping the event propagation.
 *
 *     myEventObject.stop();   
 *
 */
mospa.Event.prototype.stop = function () {
	this.isStopped = true;
}

/**
 * Freezes the event propagations. Like the stop function, but it can be unfreezed to continue the propagation.
 * @method freeze
 *
 * @example Freezing the event propagation.
 *
 *     myEventObject.freeze();   
 *
 */
mospa.Event.prototype.freeze = function () {
	this.isFreezed = true;
}

/**
 * Unfreezes the freezed event propagation. It'll continue to call the functions from the freezing point.
 * @method unfreeze
 *
 * @example Unfreezing a event.
 *
 *     myEventObject.unfreeze();   
 *
 */
mospa.Event.prototype.unfreeze = function () {
    if (this.isFreezed) {
    	this.isFreezed = false;
        this.dispatchEvent(this.freezedAt);
    }
}
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
mospa.MosApplication = function (config) {
    mospa.EventHandler.call(this);

    var pages = [],
        thisApp = this,
        currentHash = null,
        currentPage = null;

    if (!config.history_mode) {
        config.history_mode = 'location_hash';
    }

    this.addPage = function (p) {
        var x;

        if (p.constructor !== mospa.MosPage) {
            throw new Error('The addPage first parameter must be a MosPage instance.');
        }

        if (pages.indexOf(p) > -1) {
            throw new Error('This page is already in this application.');
        }

        for (x = 0; x < pages.length; x += 1) {
            if (pages[x].getSlug() === p.getSlug()) {
                throw new Error('The slug "' + p.getSlug() + '" is already used in this application (' + config.id + ').');
            }
        }

        p.application = this;
        pages.push(p);

        this.trigger('pageadded', {
            page: p
        });

        return true;
    };

    this.getPages = function () {
        return pages.concat();
    };

    this.countPages = function () {
        return pages.length;
    };

    this.getPageBySlug = function (s) {
        var x,
            l = pages.length;
        for (x = 0; x < l; x+=1) {
            if(pages[x].getSlug() === s) {
                return pages[x];
            }
        }
        return null;
    };

    this.getCurrentPage = function () {
        return currentPage;
    };

    this.setCurrentPageByHash = function (h) {
        var page = this.getPageBySlug(h);

        if (!!page) {
            this.setCurrentPage(page);
        }
        
    };

    this.setCurrentPage = function (p) {

        if (currentPage === p) {
            return false;
        }

        this.trigger('page_change', {
            oldPage: currentPage,
            newPage: p
        });
        currentPage = p;
    };

    if (config.history_mode === 'location_hash') {

        window.addEventListener("hashchange", function () {

            var newHash = location.hash.split('/').slice(1),
                x;

            if (currentHash !== null && newHash.join('/') === currentHash.join('/')) {

                thisApp.setCurrentPageByHash(newHash[0]);

            } else if (currentHash !== null && newHash[0] === currentHash[0]) {
                // SAME PAGE. TRIGGER EVENT FOR THE PAGE

                currentPage.trigger('hashchange', newHash);
            } else {
                // A DIFFERENT PAGE. GO TO THIS PAGE.
                for (x = 0; x < pages.length; x += 1) {
                    if (pages[x].getSlug() === newHash[0]) {
                        currentHash = newHash;
                        thisApp.setCurrentPage(pages[x]);
                        break;
                    }
                }

            }

        }, false);
        
    }





};

mospa.MosApplication.prototype.createPage = function (config, constructor) {

    var page = new mospa.MosPage(config);

    if (typeof constructor === 'function') {
        constructor.call(page, config);
    }

    this.addPage(page);


    return page;
};
/**
 * @module mospa
 * @class mospa.MosPage
 * @constructor
 * @uses EventHandler
 */

/**
 * @config config
 * @type Object
 * @required
 */

/**
 * @config config.slug
 * @type String
 * @required
 * Fuck you 
 */

/**
 * @config config.domElement
 * @type HTMLElement
 * @required 
 */
mospa.MosPage = function (config) {
    mospa.EventHandler.call(this);

    var slug,
        domElement;

    if (config === undefined) {
        throw new Error('A configuration objective is required to create a new MosPage');
    }

    if (config.slug === undefined) {
        throw new Error('The config slug property is required');
    }

    if (config.domElement === undefined) {
        throw new Error('The config domElement property is required');
    }

    this.application = null;
    slug = config.slug;
    domElement = config.domElement;

    /**
     * Get pages slug.
     * @method getSlug
     * @return {String}
     *
     * @example Getting page slug
     *
     *     var pageSlug = pageInstance.getSlug();
     *
     */
    this.getSlug = function () {
        return slug;
    };

    /**
     * Get page's dom element.
     * @method getDomElement
     * @return {HTMLElement} Returns HTMLElement if available.
     *
     * @example Getting the page's dom element.
     *
     *     var domEl = pageInstance.getDomElement();
     *     console.log(domEl.innerHTML);
     *
     */
    this.getDomElement = function () {
        return domElement;
    };
};
mospa.MosScrollApp = function (config) {
    this.constructor.call(this, config);

    var that = this,
        offsetCache = {},
        offsetParent = config.offsetParent || window,
        offsetParentHeight = 0,
        prevPagesPercData = {},
        prevScrollTop = null,
        /*
            Calculates and store the starting and ending points for each page.
            Storing this values improves the performance by avoiding further
            access to the DOM, making a good difference in the scroll event, as it
            is called very often.
        */
        doCacheOffsets = function (page) {
            var x, l, p, o, pdom,
                tempParent, 
                extraOffset;

            offsetParentHeight = (offsetParent.offsetHeight || offsetParent.innerHeight || 0);

            if(!page) {
                offsetCache = {};
                p = this.getPages();
                l = p.length;

                for (x = 0; x < l; x += 1) {
                    doCacheOffsets(p[x]);
                }

            } else if (page.constructor === mospa.MosPage) {

                pdom = page.getDomElement();

                tempParent = pdom.offsetParent || window;
                extraOffset = 0;

                while (tempParent != offsetParent && tempParent != window) {
                    extraOffset += tempParent.offsetTop || 0;
                    tempParent = tempParent.offsetParent || window;
                }  

                o = {
                    begin: extraOffset + pdom.offsetTop
                };
                o.end = o.begin + pdom.offsetHeight;
                offsetCache[page.getSlug()] = o;

                page.offset = {
                    topStart: o.begin,
                    topEnd: o.end
                };
            }            
        };


    this.bind('pageadded', function (e) {
        var p = e.data.page,
            d = p.getDomElement();

        p.offset = null;

        doCacheOffsets.call(this, p);      
    });

    this.calculateVisibility = function () {

        var wBegin = offsetParent.scrollTop || offsetParent.scrollY || 0,
            wEnd = wBegin + offsetParentHeight,
            pagesPercData = {},
            scrollDirection = 'stopped',
            cBegin, cEnd, perc1, perc2, tempBegin, tempEnd, x;

        if (prevScrollTop !== null) {

            if (prevScrollTop > wBegin) {
                scrollDirection = 'up';
            } else if (prevScrollTop < wBegin) {
                scrollDirection = 'down';
            }

        }


        /*
            Calculates the visibility and up space percentage for each page
        */
        for (x in offsetCache) {
            if (!offsetCache.hasOwnProperty(x)) {
                continue;
            }

            cBegin = offsetCache[x].begin;
            cEnd = offsetCache[x].end;
            perc1 = perc2 = 0;

            if (!((cBegin < wBegin && cEnd < wBegin) || (cBegin > wEnd && cEnd > wEnd))) {

                tempBegin = cBegin;
                tempEnd = cEnd;
                if (tempBegin < wBegin) {
                    tempBegin = wBegin;
                }

                if (tempEnd > wEnd) {
                    tempEnd = wEnd;
                }

                perc1 = ((tempEnd-tempBegin)/(wEnd-wBegin));
                perc2 = ((tempEnd-tempBegin)/(cEnd-cBegin));
                
                pagesPercData[x] = {
                    occupying: perc1,
                    visible: perc2
                };
                    
            }

        }


        /*
            Checking which pages appeared and disappeared in this scroll event.
            And triggering a event if it does.
        */        
        for (x in prevPagesPercData) {            
            if (!pagesPercData.hasOwnProperty(x)) {
                that.getPageBySlug(x).trigger('disappeared',{
                    scrollDirection: scrollDirection
                });
            }
        }

        for (x in pagesPercData) {
            if (!prevPagesPercData.hasOwnProperty(x)) {
                that.getPageBySlug(x).trigger('appeared',{
                    scrollDirection: scrollDirection
                });
                that.getPageBySlug(x).trigger('when_visible',{
                    scrollDirection: scrollDirection,
                    visibility: pagesPercData[x]
                });
            } else {

                that.getPageBySlug(x).trigger('when_visible',{
                    scrollDirection: scrollDirection,
                    visibility: pagesPercData[x]
                });

            }
        }

        that.trigger('after_scroll',{
            scrollDirection: scrollDirection,
            visibility: pagesPercData
        });

        /*
            Storing the current pagesPercData for further checks. 
        */
        prevPagesPercData = pagesPercData;
        prevScrollTop = wBegin;

        return pagesPercData;
    }   

    window.addEventListener('resize', function () {
        doCacheOffsets.call(that);
        that.calculateVisibility();
    });

    offsetParent.addEventListener('scroll', function () {
        that.calculateVisibility();
    });

    this.recalcOffsets = doCacheOffsets;

};

mospa.MosScrollApp.prototype = Object.create(mospa.MosApplication.prototype);
mospa.MosSlideApp = function (config) {
    this.constructor.call(this, config);

    var self = this,
        wrapper = config.wrapper || window,
        pagesLength = 0,
        currentIndex = 0,
        mouseWheelHijacked = false,
        pages = [];


    this.bind('pageadded', function (e) {
        var p = e.data.page,
            d = p.getDomElement();

        pages = this.getPages();
        pagesLength = pages.length;

    });

    this.bind('page_change', function (e) {
        var oldPage = e.data.oldPage,
            newPage = e.data.newPage,
            transitionInCompleted = function (e) {
                mouseWheelHijacked = false;
            };

        currentIndex = pages.indexOf(e.data.newPage);

        mouseWheelHijacked = true;

        if (oldPage instanceof mospa.MosPage) {

            oldPage.one('transition_out', function (e) {

                if (newPage instanceof mospa.MosPage) {

                    newPage.one('transition_in', transitionInCompleted);
                    newPage.trigger('transition_in', e.data);

                }

            });
            oldPage.trigger('transition_out', e.data);

        } else {

            if (newPage instanceof mospa.MosPage) {

                newPage.one('transition_in', transitionInCompleted);
                newPage.trigger('transition_in', e.data);

            }

        }

    });

    function scrollPage(e) {
        
    }

    function mouseWheelHandler (e) { 
        if (mouseWheelHijacked) {
            return;
        }

        var delta = e.wheelDeltaY || e.wheelDelta || -e.deltaY,
            currentPage = self.getCurrentPage(),
            tempIndex = currentIndex,
            tempPage;           
        
        if (delta > 0) {
            // up

            tempIndex -= 1;

        } else if (delta < 0) {
            // down

            tempIndex += 1;
        }

        tempIndex = Math.max(0, tempIndex);
        tempIndex = Math.min(pagesLength-1, tempIndex);
        
        if (tempIndex === currentIndex) {
            return;
        }

        tempPage = pages[tempIndex];

        self.setCurrentPage(pages[tempIndex]);
    }

    wrapper.addEventListener('mousewheel', mouseWheelHandler);
    wrapper.addEventListener('DOMMouseScroll', mouseWheelHandler);
};

mospa.MosSlideApp.prototype = Object.create(mospa.MosApplication.prototype);
})(this);