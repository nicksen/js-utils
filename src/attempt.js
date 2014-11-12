"use strict";

function attempt(fn, args, binding) {
    try {
        return fn.apply(args, binding);
    } catch (e) {}
}

module.exports = attempt;
