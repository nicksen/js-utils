/**
 * Truncates a string after a certain number of words.
 * Newlines within the string will be removed.
 */
"use strict";

var truncatewords = function (string, numWords) {
    var words = string.split(' ');

    if (words.length < numWords) {
        return string;
    }

    return words.slice(0, numWords).join(' ') + "…";
};

module.exports = truncatewords;
