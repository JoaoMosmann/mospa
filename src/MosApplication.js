var MosApplication = function(config){
	EventHandler.call(this);

	console.log('MosApplication :: config',config);
	var pages = [],
		thisApp = this,
		currentHash = null,
		currentPage = null;


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

	this.getCurrentPage = function(){
		return currentPage;
	}

	this.setCurrentPage = function(p){
		console.log('page '+p.getSlug()+' setted as currentPage');
		currentPage = p;
	}

	window.addEventListener("hashchange", function(e){

		var newHash = location.hash.split('/').slice(1);

		if(currentHash != null && newHash.join('/') == currentHash.join('/')){
			// SAME HASH... SHOULD DO NOTHING.

		} else if(currentHash != null && newHash[0] == currentHash[0]){
			// SAME PAGE. TRIGGER EVENT FOR THE PAGE

			currentPage.trigger('hashchange',newHash);
		} else {
			// A DIFFERENT PAGE. GO TO THIS PAGE.
			for(var x in pages){
				if(pages[x].getSlug() == newHash[0]){
					currentHash = newHash;
					thisApp.setCurrentPage(pages[x]);
					break;
				}
			}

		}

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