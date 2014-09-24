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

        mouseWheelHijacked = true;

        if (oldPage instanceof mospa.MosPage) {

            oldPage.one('transition_out', function (e) {

                if (newPage instanceof mospa.MosPage) {

                    newPage.one('transition_in', transitionInCompleted);
                    newPage.trigger('transition_in');

                }

            });
            oldPage.trigger('transition_out');

        } else {

            if (newPage instanceof mospa.MosPage) {

                newPage.one('transition_in', transitionInCompleted);
                newPage.trigger('transition_in');

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
        console.log(tempIndex);
        
        if (tempIndex === currentIndex) {
            return;
        }

        tempPage = pages[tempIndex];

        currentIndex = tempIndex;
        self.setCurrentPage(pages[tempIndex]);

    }

    console.log(wrapper);
    wrapper.addEventListener('mousewheel', mouseWheelHandler);
    wrapper.addEventListener('DOMMouseScroll', mouseWheelHandler);
};

mospa.MosSlideApp.prototype = Object.create(mospa.MosApplication.prototype);