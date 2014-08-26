describe("A mospa.MosApplication", function() {
  var objectapp;

  beforeEach(function () {
    app = mospa.createApplication(null, {},
        function(b){

        });
  });

  it("constructor function should have access to the MosApplication instance", function() {

    app = mospa.createApplication(null, null,
      function(){
        expect(this.constructor).toEqual(mospa.MosApplication);
      });

  });

  it("should be able to have access to the config variable inside it constructor scope", function() {

    app = mospa.createApplication(null, {myProperty:10},
      function(config){
        expect(config.myProperty).toEqual(10);
      });

  });


  it("should be able to create a new Page", function() {

    var imCreated = false;

    app.createPage(
      {
        slug    : "teste-page", 
        domElement  : document.createElement('div')
      },
      function(config){    

        imCreated = true;

      }
    );

    expect(imCreated).toBe(true);

  });



});