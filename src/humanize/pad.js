"use strict";

var pad = function (str, count, padChar, type) {
    str += ""; // Ensure string

    if (!padChar) {
        padChar = " ";
    } else if (1 < padChar.length) {
        padChar = padChar.charAt(0);
    }

    type = null == type ? "left" : "right";

    if ("right" === type) {
        while (count > str.length) {
            str += padChar;
        }
    } else {
        // Default to left
        while (count > str.length) {
            str = padChar + str;
        }
    }

    return str;
};

module.exports = pad;
