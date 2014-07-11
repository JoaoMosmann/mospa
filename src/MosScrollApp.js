var MosScrollApp = function (config) {
    'use strict';
    this.constructor.call(this, config);
   
    this.bind('pageadded', function (e){
        console.log(e);
    });

};

MosScrollApp.prototype = Object.create(MosApplication.prototype);