var MosScrollApp = function (config) {
    'use strict';
    this.constructor.call(this, config);

    var offsetCache = {},
        offsetParent = null,
        cacheOffsets = function () {
            var x, l, p;
            offsetCache = {};
            console.log(this);
            p = this.getPages();
            l = p.length;

            for (x = 0; x < l; x += 1) {
                offsetCache[p[x].getSlug()] = p[x].getDomElement().offsetTop;
            }

            console.log(offsetCache);
        };


    this.bind('pageadded', function (e) {
        var p = e.data.page,
            d = p.getDomElement();

        offsetCache[p.getSlug()] = d.offsetTop;

        console.log(p.getSlug(), d.offsetParent);

        if (offsetParent === null) {
            offsetParent = d.offsetParent;
        } else if (d.offsetParent !== offsetParent) {
            console.error('OffsetParent inconsistency! Some pages have different offsetParents.');
        }

    });

    this.bind('windowresize', function () {

        cacheOffsets.call(this);

    });

    window.addEventListener('scroll', function () {
        console.log(offsetParent.scrollTop);
    });

};

MosScrollApp.prototype = Object.create(MosApplication.prototype);