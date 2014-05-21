var MosScrollPage = function(config){
	this.constructor.call(this,config);
	
	this.behavior = 'scroll';
};

MosScrollPage.prototype = Object.create(MosPage.prototype);