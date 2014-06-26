(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
    "use strict";

    function getFloat(input, abs) {
        if (null == abs) {
            abs = false;
        }

        var val = (input + "").replace(/\s+/, "").replace(",", ".");
        val = parseFloat(val);

        if (abs) {
            val = Math.abs(val);
        }

        if (isNaN(val)) {
            val = 0;
        }

        return val;
    }

    return getFloat;
});
