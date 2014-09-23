/**
 * @module mospa
 * @class mospa.Event
 * @constructor
 */
mospa.Event = function (type, data, context, eventList) {

	this.type = type;
	this.data = data;
	this.isStopped = false;
    this.isFreezed = false;
    this.freezedAt = 0;
	this.eventList = eventList;
	this.context = context;
}

mospa.Event.prototype.dispatchEvent = function (startAt) {

	var l = this.eventList.length,
		i, r;

    for (i = startAt || 0; i < l; i += 1) {
        if (this.isStopped) {
            break;
        }
        if (this.isFreezed) {
            this.freezedAt = i;
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
	this.isStopped = true;
}

mospa.Event.prototype.freeze = function () {
	this.isFreezed = true;
}

mospa.Event.prototype.unfreeze = function () {
	this.isFreezed = false;
    this.dispatchEvent(this.freezedAt);
}