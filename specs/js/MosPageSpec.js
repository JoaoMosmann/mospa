describe("A MosPage", function() {
 	var application;
	beforeEach(function() {
		application = new MosApplication();
	});
 	
	it("should throw a error if not provided with a hash", function() {
    
		expect(function() { 

			var page = new MosPage();

		}).toThrow();

	});	

});
