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
		



	}, false);




};

MosApplication.prototype.createPage = function(config, constructor){
	console.log('MosApplication :: createPage :: config',config);

	var page = new MosPage(config);
	
	if(typeof constructor == 'function')
		constructor.call(page,config);

	this.addPage(page);


	return page;
}