"use strict";

var slicer = require("./slicer");

function log() {
    log.history.push(arguments);
    console.log(slicer(arguments));
}

log.history = [];

log.dbg = function (str) {
    str = "DEBUG: " + str;
    log.history.push(str);
    console.debug(str);
};

log.err = function (str) {
    log.history.push("ERROR: " + str);
    console.error(str);
};

module.exports = log;
