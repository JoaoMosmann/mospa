var MosScrollApp = function (config) {
    'use strict';
    this.constructor.call(this, config);

    var offsetCache = {},
        offsetParent = null,
        prevPagesPercData = {},
        /*
            Calculates and store the starting and ending points for each page.
            Storing this values improves the performance by avoiding further
            access to the DOM, making a good difference in the scroll event, as it
            is called very often.
        */
        doCacheOffsets = function (page) {
            var x, l, p, o, 
                tempParent = offsetParent, 
                extraOffset = 0;

            while (tempParent != document.body) {
                extraOffset += tempParent.offsetTop;
                tempParent = tempParent.offsetParent;
            }    

            if(!page) {
                offsetCache = {};
                p = this.getPages();
                l = p.length;

                for (x = 0; x < l; x += 1) {
                    o = {
                        begin: extraOffset + p[x].getDomElement().offsetTop
                    };
                    o.end = o.begin + p[x].getDomElement().offsetHeight;
                    offsetCache[p[x].getSlug()] = o;
                }

            } else if (page.constructor === MosPage) {
                o = {
                    begin: extraOffset + page.getDomElement().offsetTop
                };
                o.end = o.begin + page.getDomElement().offsetHeight;
                offsetCache[page.getSlug()] = o;
            }
        };


    this.bind('pageadded', function (e) {
        var p = e.data.page,
            d = p.getDomElement();        

        if (offsetParent === null) {
            offsetParent = d.offsetParent;
        } else if (d.offsetParent !== offsetParent) {
            console.error('OffsetParent inconsistency! Some pages have different offsetParents.');
        }

        doCacheOffsets.call(this, p);
    });

    this.bind('windowresize', function () {

        doCacheOffsets.call(this);

    });

    window.addEventListener('scroll', function () {
        var wBegin = document.body.scrollTop,
            wEnd = wBegin + window.innerHeight,
            pagesPercData = {},
            cBegin, cEnd, perc1, perc2, tempBegin, tempEnd, x;

        // console.clear();

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
                    
                // console.log(x);
                // console.log(' - ', perc1);
                // console.log(' - ', perc2);
            }

        }


        /*
            Checking which pages appeared and disappeared in this scroll event.
            And triggering a event if it does.
        */
        for (x in prevPagesPercData) {
            if (!pagesPercData.hasOwnProperty(x)) {
                this.getPageBySlug(x).trigger('disappeared');
            }
        }

        for (x in pagesPercData) {
            if (!prevPagesPercData.hasOwnProperty(x)) {
                this.getPageBySlug(x).trigger('appeared');
            }
        }

        /*
            Storing the current pagesPercData for further checks.
        */
        prevPagesPercData = pagesPercData;
    });

};

MosScrollApp.prototype = Object.create(MosApplication.prototype);