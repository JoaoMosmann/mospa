mospa.MosScrollApp = function (config) {
    this.constructor.call(this, config);

    var that = this,
        offsetCache = {},
        offsetParent = null,
        prevPagesPercData = {},
        prevScrollTop = null,
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

                    p[x].offset = {
                        topStart: o.begin,
                        topEnd: o.end
                    };
                }

            } else if (page.constructor === mospa.MosPage) {
                o = {
                    begin: extraOffset + page.getDomElement().offsetTop
                };
                o.end = o.begin + page.getDomElement().offsetHeight;
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
            console.error('OffsetParent inconsistency! Some pages have different offsetParents.');
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