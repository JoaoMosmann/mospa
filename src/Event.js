/**
 * @module mospa
 * @class mospa.Event
 * @constructor
 */
mospa.Event = function (type, data, context, eventList) {

	this.type = type;
	this.data = data;
	this.stopped = false;
	this.eventList = eventList;
	this.context = context;
}

mospa.Event.prototype.dispatchEvent = function () {

	var l = this.eventList.length,
		i, r;

    for (i = 0; i < l; i += 1) {
        if (this.stopped) {
            break;
        }
        if (this.eventList[i] !== null) {
            r = this.eventList[i].callback.call(this.context, this);
            if (!!this.eventList[i] && this.eventList[i].one) {
                this.eventList[i] = null;
            }
            if (r === false) {
                break;
            }
        }
    }

}

mospa.Event.prototype.stop = function () {
	this.stopped = true;
}

mospa.Event.prototype.freeze = function () {
	
}

mospa.Event.prototype.unfreeze = function () {
	
}