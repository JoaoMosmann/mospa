describe("A EventHandler", function() {
  var object;

  beforeEach(function () {
    object = new EventHandler();
  });

  it("should be able to BIND a function to a event", function() {

    object.bind('some_event', function () {
    	console.log('Hey!');
    });

  });

  it("should be able to TRIGGER a event", function() {

  	var myCounter = 0;
    object.bind('some_event', function () {
    	myCounter = 5;
    })

    object.trigger('some_event');

    expect(myCounter).toEqual(5);

  });

  it("should be able to pass a value through a event", function() {

  	var myCounter = 100;
    object.bind('some_event', function (e) {
    	myCounter += e.data.add;
    });

    object.trigger('some_event', {add:10});
    object.trigger('some_event', {add:5});
    object.trigger('some_event', {add:3});

    expect(myCounter).toEqual(118);

  });

  it("should be able to BIND more than one function to a event", function() {

  	var myCounter = 0;
    object.bind('some_event', function (e) {
    	myCounter += e.data.add * 1;
    });

    object.bind('some_event', function (e) {
    	myCounter += e.data.add * 2;
    });

    object.trigger('some_event', {add:10});
    object.trigger('some_event', {add:5});

    expect(myCounter).toEqual(45);

  });

  it("should be able to UNBIND a event", function() {

  	var myCounter = 0;
    object.bind('some_event', function (e) {
    	myCounter += e.data.add;
    });

    object.trigger('some_event', {add:10});
   	
    object.unbind('some_event');

    object.trigger('some_event', {add:3});

    expect(myCounter).toEqual(10);

  });

  it("should be able to UNBIND a specific function from a event", function() {

  	var myCounter = 0;

  	var fn1 = function (e) {
  		myCounter += e.data.add * 1;
  	}

  	var fn2 = function (e) {
  		myCounter += e.data.add * 2;
  	}

  	var fn3 = function (e) {
  		myCounter += e.data.add * 3;
  	}

    object.bind('some_event', fn1);
    object.bind('some_event', fn2);
    object.bind('some_event', fn3);

    object.trigger('some_event', {add:10});

    object.unbind('some_event', fn2);

    object.trigger('some_event', {add:100});
    
    expect(myCounter).toEqual(460);

  });


});