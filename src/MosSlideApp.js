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

    function scrollPage(e) {
        
    }

    function mouseWheelHandler (e) { 
        if (mouseWheelHijacked) return;

        var delta = e.wheelDeltaY || e.wheelDelta || -e.deltaY,
            currentPage = self.getCurrentPage(),
            tempIndex = currentIndex,
            tempPage,
            transitionInCompleted = function (e) {
                mouseWheelHijacked = false;
                currentIndex = tempIndex;
                self.setCurrentPage(pages[tempIndex]);
            };
        
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
        
        tempPage = pages[tempIndex];

        mouseWheelHijacked = true;
        console.log(currentPage);
        if (currentPage instanceof mospa.MosPage) {

            currentPage.one('transition_out', function (e) {

                if (tempPage instanceof mospa.MosPage) {

                    tempPage.one('transition_in', transitionInCompleted);
                    tempPage.trigger('transition_in');

                }

            });
            currentPage.trigger('transition_out');

        } else {

            if (tempPage instanceof mospa.MosPage) {

                tempPage.one('transition_in', transitionInCompleted);
                tempPage.trigger('transition_in');

            }

        }

    }

    console.log(wrapper);
    wrapper.addEventListener('mousewheel', mouseWheelHandler);
    wrapper.addEventListener('DOMMouseScroll', mouseWheelHandler);
};

mospa.MosSlideApp.prototype = Object.create(mospa.MosApplication.prototype);