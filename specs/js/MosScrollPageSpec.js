describe("A MosScrollPage", function() {
 	
	it("should have a DomElement", function() {
    	
		var page = new MosPage({
			hash: 'a-page',
			element: document.createElement('div')
		});

		expect(page.element).toBeTruthy();

	});	

});
