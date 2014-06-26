(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
    "use strict";

    function log() {
        log.history.push(arguments);
        console.log(Array.prototype.slice.call(arguments));
    }

    log.history = [];

    log.dbg = function (str) {
        str = "DEBUG: " + str;
        log.history.push(str);
        console.debug(str);
    };

    log.err = function (str) {
        log.history.push("ERROR: " + str);
        console.error(str);
    };

    return log;
});
