var EventHandler = function(){
	var events = [];

	this.bind = function(event,fn){
		if(fn === undefined) throw new Error('The second parameter of bind must be passed.');
		events.push({type:event, callback: fn});
	};
	this.unbind = function(event,fn){
		for(var i=0; i<events.length; i++){
			if(events[i] !== null && events[i].type == event && (events[i].callback == fn || fn === undefined)) {
				events[i] = null;
			}
		}
	};
	this.trigger = function(event,data){
		if(data === undefined) data = {};
		var e = {
			stopped: false,
			stop: function(){this.stopped = true;},
			data:data
		}

		for(var i=0; i<events.length; i++){
			if(e.stopped) break;
			if(events[i] !== null && events[i].type == event) {
				var r = events[i].callback.call(this,e);
				if(r === false) break;
			}
		}
	};

};
var MosApplication = function(config){
	EventHandler.call(this);

	console.log('MosApplication :: config',config);
	var pages = [];


	this.addPage = function(p){
		console.log('MosApplication :: addPage :: config',config);
		if(p.constructor != MosPage){
			throw new Error('The addPage first parameter must be a MosPage instance.');
		}

		if(pages.indexOf(p) > -1){
			throw new Error('This page is already in this application.');
		}

		for(var x in pages){
			if(pages[x].getSlug() == p.getSlug()){
				throw new Error('The slug "'+p.getSlug()+'" is already used in this application ('+config.id+').');
			}
		}


		p.application = this;
		pages.push(p);

		return true;
	};
	this.getPages = function(){
		return pages.concat();
	}

	var that = this;
	window.addEventListener("hashchange", function(e){
		
		console.log(e);

	}, false);




};

MosApplication.prototype.createPage = function(config, constructor){
	console.log('MosApplication :: createPage :: config',config);

	var page = new MosPage(config);
	
	if(typeof constructor == 'function')
		constructor.call(page,config);

	this.addPage(page);


	return page;
};
var MosPage = function(config){
	EventHandler.call(this);

	var slug,
		domElement;

	if(config === undefined) throw new Error('A configuration objective is required to create a new MosPage');
	if(config.slug === undefined) throw new Error('The config slug property is required');
	if(config.domElement === undefined) throw new Error('The config domElement property is required');


	
	this.application = null;
	slug = config.slug;
	domElement = config.domElement; 


	this.getSlug = function(){
		return slug;
	}

	this.getDomElement = function(){
		return domElement;
	}
};
;
var MosScrollApp = function(config){
	this.constructor.call(this,config);
	console.log('MosScrollApp :: config',config);
	


};

MosScrollApp.prototype = Object.create(MosApplication.prototype);;
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
 