(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
    "use strict";

    function debounce(fn, wait, immediate) {
        if (null == immediate) {
            immediate = false;
        }

        var timeout = null;

        return function () {
            var context = this,
                args = arguments;

            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) {
                    fn.apply(context, args);
                }
            }, wait);

            if (immediate && !timeout) {
                fn.apply(context, args);
            }
        };
    }

    return debounce;
})();
