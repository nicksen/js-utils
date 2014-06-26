(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
    "use strict";

    var nativeRaf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
        lastTime = 0;

    var raf = nativeRaf || function (fn) {
        var currTime = Date.now(),
            timeDelay = Math.max(0, 16 - (currTime - lastTime));
        lastTime = currTime + timeDelay;
        return setTimeout(function() {
            fn(Date.now());
        }, timeDelay);
    };

    return raf;
});
