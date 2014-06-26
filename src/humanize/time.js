(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
    "use strict";

    var time = function () {
        return (null != Date.now ? Date.now() : new Date().getTime()) / 1000;
    };

    return time;
});
