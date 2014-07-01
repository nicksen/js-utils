"use strict";

var __toString = Object.prototype.toString,
    classToType = {},
    names = ("Boolean|Number|String|Function|Array|Date|RegExp|Undefined|Null").split("|"),
    n;

for (n in names) {
    if (names.hasOwnProperty(name)) {
        classToType["[object " + name + "]"] = name.toLowerCase();
    }
}

function type(obj) {
    var strType = __toString.call(obj);
    return classToType[strType] || "object";
}

module.exports = type;
