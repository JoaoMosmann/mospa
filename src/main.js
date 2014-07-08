if (typeof Object.create !== 'function') {
    (function () {
        'use strict';
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
    'use strict';
    return {
        createApplication: function (type, id, constructor) {
            var AppClass,
                app,
                config;

            if (type === 'scrollapp') {
                AppClass = MosScrollApp;
            }

            config = {
                type: type,
                id: id
            };

            app = new AppClass(config);

            if (typeof constructor === 'function') {
                constructor.call(app, config);
            }

            return app;


        }
    };

}());