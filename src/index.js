(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(["closest", "debounce", "forEach", "getFloat", "getInt", "humanize", "log", "raf", "type"], factory);
    } else if ("object" === typeof exports) {
        module.exports = factory(require("./closest"), require("./debounce"), require("./forEach"), require("./getFloat"), require("./getInt"), require("./humanize"), require("./log"), require("./raf"), require("./type"));
    }
})(function (closest, debounce, forEach, getFloat, getInt, humanize, log, raf, type) {
    "use strict";

    return {
        closest: closest,
        debounce: debounce,
        forEach: forEach,
        getFloat: getFloat,
        getInt: getInt,
        humanize: humanize,
        log: log,
        raf: raf,
        type: type
    };
});
