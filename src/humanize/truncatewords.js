/**
 * Truncates a string after a certain number of words.
 * Newlines within the string will be removed.
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

    var truncatewords = function (string, numWords) {
        var words = string.split(' ');

        if (words.length < numWords) {
            return string;
        }

        return words.slice(0, numWords).join(' ') + "…";
    };

    return truncatewords;
});
