"use strict";

var clsList = "classList" in document.documentElement;

function classReg(className) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

var criteria = {
    isElement: function(e) {
        return e instanceof HTMLElement;
    },
    hasClass: function(cls) {
        return function(e) {
            return criteria.isElement(e) && clsList ? e.classList.contains(cls) : classReg(cls).test(e.className);
        };
    }
};

module.exports = criteria;
