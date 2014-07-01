/**
 * Converts all newlines in a piece of plain text to HTML line breaks (<br />).
 */
"use strict";

var nl2br = function (str) {
    return str.replace(/(\r\n|\n|\r)/g, "<br/>");
};

module.exports = nl2br;
