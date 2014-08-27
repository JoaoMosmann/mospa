/**
 * @module mospa
 * @class mospa.MosPage
 * @constructor
 * @uses EventHandler
 */

/**
 * @config config
 * @type Object
 * @required
 */

/**
 * @config config.slug
 * @type String
 * @required
 * Fuck you 
 */

/**
 * @config config.domElement
 * @type HTMLElement
 * @required 
 */
mospa.MosPage = function (config) {
    mospa.EventHandler.call(this);

    var slug,
        domElement;

    if (config === undefined) {
        throw new Error('A configuration objective is required to create a new MosPage');
    }

    if (config.slug === undefined) {
        throw new Error('The config slug property is required');
    }

    if (config.domElement === undefined) {
        throw new Error('The config domElement property is required');
    }

    this.application = null;
    slug = config.slug;
    domElement = config.domElement;

    /**
     * Get pages slug.
     * @method getSlug
     * @return {String}
     *
     * @example Getting page slug
     *
     *     var pageSlug = pageInstance.getSlug();
     *
     */
    this.getSlug = function () {
        return slug;
    };

    /**
     * Get page's dom element.
     * @method getDomElement
     * @return {HTMLElement} Returns HTMLElement if available.
     *
     * @example Getting the page's dom element.
     *
     *     var domEl = pageInstance.getDomElement();
     *     console.log(domEl.innerHTML);
     *
     */
    this.getDomElement = function () {
        return domElement;
    };
};