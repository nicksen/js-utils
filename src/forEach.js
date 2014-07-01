"use strict";

var type = require("./type");

var __hasProp = Object.prototype.hasOwnProperty;

function forEach(collection, fn, context) {
    fn = "function" === type(fn) ? fn : function () {};

    if ("object" === type(collection)) {
        for (var prop in collection) {
            if (__hasProp.call(collection, prop)) {
                fn.call(context, collection[prop], prop, collection);
            }
        }
    } else {
        for (var i = 0, len = collection.length; i < len; i++) {
            fn.call(context, collection[i], i, collection);
        }
    }
}

module.exports = forEach;
