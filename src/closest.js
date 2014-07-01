"use strict";

var __slice = Array.prototype.slice;

function closest(node, search) {
    var matches = [],
        hits = __slice.call(document.querySelectorAll(search));

    while (null != node) {
        if (0 <= hits.indexOf(node)) {
            matches.push(node);
        }

        node = node.parentNode;
    }

    return matches;
}

module.exports = closest;
