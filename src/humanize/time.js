"use strict";

var time = function () {
    return (null != Date.now ? Date.now() : new Date().getTime()) / 1000;
};

module.exports = time;
