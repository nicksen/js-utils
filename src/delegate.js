"use strict";

function delegate(criteria, listener) {
    return function(e) {
        var el = e.target;
        do {
            if (!criteria(el)) {
                continue;
            }

            e.delegateTarget = el;
            listener.apply(this, arguments);
            return;
        } while ((el = el.parentNode));
    };
}

module.exports = function partialDelegate(criteria) {
    return function(handler) {
        return delegate(criteria, handler);
    };
};
