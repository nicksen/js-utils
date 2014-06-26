(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
    "use strict";

    function trim(text) {
        return text.replace(/^\s+|\s+$/, "");
    }

    return trim;
});
