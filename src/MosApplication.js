var MosApplication = function (config) {
    'use strict';
    EventHandler.call(this);

    var pages = [],
        thisApp = this,
        currentHash = null,
        currentPage = null;


    this.addPage = function (p) {
        var x;

        if (p.constructor !== MosPage) {
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




};

MosApplication.prototype.createPage = function (config, constructor) {
    'use strict';

    var page = new MosPage(config);

    if (typeof constructor === 'function') {
        constructor.call(page, config);
    }

    this.addPage(page);


    return page;
};