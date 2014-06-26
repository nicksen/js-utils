(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(["getFloat"], factory);
    } else if ("object" === typeof exports) {
        module.exports = factory(require("./getFloat"));
    }
})(function (getFloat) {
    "use strict";

    function getInt(input, abs) {
        return parseInt(getFloat(input, abs), 10);
    }

    return parseInt;
});
