"use strict";

function slicer(/* arr */ items, /* int */ start) {
    if (null == start) {
        start = 0;
    }

    var len = items.length;
    var arr = new Array(len - start);

    for (var i = start; i < len; i++) {
        arr[i - start] = items[i];
    }

    return arr;
}

module.exports = slicer;
