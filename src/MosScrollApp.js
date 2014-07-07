var MosScrollApp = function (config) {
    this.constructor.call(this, config);
    console.log('MosScrollApp :: config', config);
};

MosScrollApp.prototype = Object.create(MosApplication.prototype);