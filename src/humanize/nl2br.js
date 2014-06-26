/**
 * Converts all newlines in a piece of plain text to HTML line breaks (<br />).
 */
(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
    "use strict";

    var nl2br = function (str) {
        return str.replace(/(\r\n|\n|\r)/g, "<br/>");
    };

    return nl2br;
});
