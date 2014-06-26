(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
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

    return pad;
});
