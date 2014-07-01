/**
 * Formats the value like a "human-readable" number (i.e. "13 K", "4.1 M", "102", etc).
 *
 * For example:
 * If value is 123456789, the output would be 117.7 M.
 */
"use strict";

var numberFormat = require("./numberFormat");

var intword = function (number, units, kilo, decimals, decPoint, thousandsSep, suffixSep) {
    var humanized, unit;

    units = units || ["", "K", "M", "B", "T"];
    unit = units.length - 1;
    kilo = kilo || 1000;
    decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
    decPoint = decPoint || ".";
    thousandsSep = thousandsSep || ",";
    suffixSep = suffixSep || "";

    for (var i = 0, len = units.length; i < len; i++) {
        if (Math.pow(kilo, i + 1) > number) {
            unit = i;
            break;
        }
    }
    humanized = number / Math.pow(kilo, unit);

    var suffix = units[unit] ? suffixSep + units[unit] : "";
    return numberFormat(humanized, decimals, decPoint, thousandsSep) + suffix;
};

module.exports = intword;
