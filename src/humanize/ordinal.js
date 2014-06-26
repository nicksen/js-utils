/**
 * Converts an integer to its ordinal as a string.
 *
 * 1 becomes 1st
 * 2 becomes 2nd
 * 3 becomes 3rd etc
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

    var ordinal = function (number) {
        number = parseInt(number, 10);
        number = isNaN(number) ? 0 : number;
        var sign = number < 0 ? "-" : "";
        number = Math.abs(number);
        var tens = number % 100;

        return sign + number + (tens > 4 && tens < 21 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th");
    };

    return ordinal;
});
