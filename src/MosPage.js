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
