var MosApplication = function(config){

	var pages = [];

	this.addPage = function(p){
		if(p.constructor != MosPage){
			throw new Error('The addPage first parameter must be a MosPage instance.');
		}

		if(pages.indexOf(p) > -1){
			throw new Error('This page is already in this application.');
		}

		pages.push(p);

		return true;
	};

	this.getPages = function(){
		return pages.concat();
	}


};

MosApplication.prototype.setDefaultPage = function(p){
	
};

;
var MosPage = function(config){
	var events = [],
		hash;

	if(config === undefined) throw new Error('A configuration objective is required to create a new MosPage');
	if(config.hash === undefined) throw new Error('The config hash property is required');

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
	this.trigger = function(event){
		for(var i=0; i<events.length; i++){
			if(events[i] !== null && events[i].type == event) events[i].callback.apply(this);
		}
	};
};
;
var MosScrollPage = function(config){
	this.constructor.call(this,config);
	
	this.behavior = 'scroll';
};

MosScrollPage.prototype = Object.create(MosPage.prototype);