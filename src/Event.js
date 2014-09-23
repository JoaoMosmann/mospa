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

/**
 * Dispatch the event to all related functions.
 * @method dispatchEvent
 * @param {Number} startAt Call functions starting from this index.
 *
 * @example Dispatching a event.
 *
 *     myEventObject.dispatchEvent();   
 *
 */
mospa.Event.prototype.dispatchEvent = function (startAt) {

	var l = this.eventList.length,
		i, r;

    for (i = startAt || 0; i < l; i += 1) {
        if (this.isStopped) {
            break;
        }
        if (this.isFreezed) {
            this. = i;
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

/**
 * Stop the propagation. No function will be called after this being called.
 * @method stop
 *
 * @example Stoping the event propagation.
 *
 *     myEventObject.stop();   
 *
 */
mospa.Event.prototype.stop = function () {
	this.isStopped = true;
}

/**
 * Freezes the event propagations. Like the stop function, but it can be unfreezed to continue the propagation.
 * @method freeze
 *
 * @example Freezing the event propagation.
 *
 *     myEventObject.freeze();   
 *
 */
mospa.Event.prototype.freeze = function () {
	this.isFreezed = true;
}

/**
 * Unfreezes the freezed event propagation. It'll continue to call the functions from the freezing point.
 * @method unfreeze
 *
 * @example Unfreezing a event.
 *
 *     myEventObject.unfreeze();   
 *
 */
mospa.Event.prototype.unfreeze = function () {
	this.isFreezed = false;
    this.dispatchEvent(this.freezedAt);
}