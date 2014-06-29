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

}