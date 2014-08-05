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
        createApplication: function (type, id, constructor) {
            var AppClass,
                app,
                config;

            if (type === 'scrollapp') {
                AppClass = mospa.MosScrollApp;
            } else if (!!type && type.constructor === Function) {
                /* With this you can implament your own kind of application flow. */
                AppClass = type;
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

window.mospa = mospa;