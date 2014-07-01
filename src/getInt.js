"use strict";

var getFloat = require("./getFloat");

function getInt(input, abs) {
    return parseInt(getFloat(input, abs), 10);
}

module.exports = parseInt;
