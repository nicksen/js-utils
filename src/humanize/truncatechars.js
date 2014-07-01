/**
 * Truncates a string if it is longer than the specified number of characters.
 * Truncated strings will end with a translatable ellipsis sequence ("…").
 */
"use strict";

var truncatechars = function (string, length) {
    if (string.length <= length) {
        return string;
    }

    return string.substr(0, length) + "…";
};

module.exports = truncatechars;
