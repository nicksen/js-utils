/**
 * Truncates a string if it is longer than the specified number of characters.
 * Truncated strings will end with a translatable ellipsis sequence ("…").
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

    var truncatechars = function (string, length) {
        if (string.length <= length) {
            return string;
        }

        return string.substr(0, length) + "…";
    };

    return truncatechars;
});
