"use strict";

var es = "contains" in document.documentElement;

var contains = es ? function(parent, child) {
    return parent.contains(child);
} : function(parent, child) {
    return parent.compareDocumentPosition(child);
};

module.exports = contains;
