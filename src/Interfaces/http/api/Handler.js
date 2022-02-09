const autoBind = require('auto-bind');

class Handler {
    constructor(container) {
        this._container = container;

        autoBind(this);
    }
}
module.exports = Handler;
