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

