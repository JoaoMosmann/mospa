mospa.MosSlideApp = function (config) {
    this.constructor.call(this, config);

    var self = this,
        wrapper = config.wrapper || window;


    this.bind('pageadded', function (e) {
        var p = e.data.page,
            d = p.getDomElement();

    });

    function scrollPage(e) {
        
    }

    function mouseWheelHandler (e) { 
        console.log(e);
        var delta = e.wheelDeltaY || e.wheelDelta || e.deltaY;
        console.log(delta);
    }

    console.log(wrapper);
    document.body.addEventListener('mousewheel', mouseWheelHandler);
    document.body.addEventListener('DOMMouseScroll', mouseWheelHandler);
};

mospa.MosSlideApp.prototype = Object.create(mospa.MosApplication.prototype);