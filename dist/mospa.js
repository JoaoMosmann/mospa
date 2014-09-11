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
        var e, r, i, l,
            eventList = events[event];

        if (data === undefined) {
            data = {};
        }

        e = {
            stopped: false,
            stop: function () { this.stopped = true; },
            data: data
        };

        if (!!hijackedEvents[event] && hijackedEvents[event].constructor === Function) {

            delete e.stopped;
            delete e.stop;
            
            hijackedEvents[event].call(this, e);

            return true;
        }

        if (!eventList) {
            return false;
        }

        l = eventList.length;


        for (i = 0; i < l; i += 1) {
            if (e.stopped) {
                break;
            }
            if (eventList[i] !== null) {
                r = eventList[i].callback.call(this, e);
                if (!!eventList[i] && eventList[i].one) {
                    eventList[i] = null;
                }
                if (r === false) {
                    break;
                }
            }
        }
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
                // SAME HASH... SHOULD DO NOTHING.

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
        offsetParent = config.offsetParent || null,
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

              

            if(!page) {
                offsetCache = {};
                p = this.getPages();
                l = p.length;

                for (x = 0; x < l; x += 1) {
                    doCacheOffsets(p[x]);
                }

            } else if (page.constructor === mospa.MosPage) {

                pdom = page.getDomElement();

                tempParent = pdom.offsetParent;
                extraOffset = 0;

                while (tempParent != offsetParent && tempParent != document.body) {
                    extraOffset += tempParent.offsetTop;
                    tempParent = tempParent.offsetParent;
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

        if (offsetParent === null) {
            offsetParent = d.offsetParent;
        } else if (d.offsetParent !== offsetParent) {
            console.warn('OffsetParent inconsistency! Some pages have different offsetParents. It can cost more process to calculate the pages visibility.');
        }

        p.offset = null;

        doCacheOffsets.call(this, p);      
    });

    this.calculateVisibility = function () {

        var wBegin = document.body.scrollTop,
            wEnd = wBegin + window.innerHeight,
            pagesPercData = {},
            scrollDirection = 'stopped',
            cBegin, cEnd, perc1, perc2, tempBegin, tempEnd, x;

        // console.clear();

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

    window.addEventListener('scroll', function () {
        that.calculateVisibility();
    });

};

mospa.MosScrollApp.prototype = Object.create(mospa.MosApplication.prototype);
})(this);