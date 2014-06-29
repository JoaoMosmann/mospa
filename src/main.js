if (typeof Object.create != 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o) {
            if (arguments.length > 1) { 
              throw Error('Second argument not supported');
            }
            if (o === null) { 
              throw Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o != 'object') { 
              throw TypeError('Argument must be an object');
            }
            F.prototype = o;
            return new F();
        };
    })();
}

var mospa = (function () {
 


	return { 
		createApplication: function ( type, id, constructor ) {

			var appClass;


			/* 
				
				TO DO:
					Other types of Apps. Like "AjaxApp" that pages html are taken from urls.

			*/
			if(type == 'scrollapp') appClass = MosScrollApp;


			var config = {
				type: type,
				id: id
			};

			var app = new appClass(config);

			if(typeof constructor == 'function')
				constructor.call(app,config);

			return app;


		}
	};

})();
 