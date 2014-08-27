"use strict";

var slicer = require("./slicer");

function closest(node, search) {
    var matches = [],
        hits = slicer(document.querySelectorAll(search));

    while (null != node) {
        if (0 <= hits.indexOf(node)) {
            matches.push(node);
        }

        node = node.parentNode;
    }

    return matches;
}

module.exports = closest;
