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

module.exports = raf;
