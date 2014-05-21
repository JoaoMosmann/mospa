describe("MosApplication", function() {
  var application;

  beforeEach(function() {
    application = new MosApplication();
  });

  it("should be able to add a page", function() {
    
    var page = new MosPage({
      hash: 'home'
    });

    

    expect(application.addPage(page)).toBeTruthy();
    
    expect(application.getPages().length).toEqual(1);
  });


});
