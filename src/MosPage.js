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
