"use strict";

var __toString = Object.prototype.toString,
    classToType = {},
    names = ("Boolean|Number|String|Function|Array|Date|RegExp|Undefined|Null").split("|"),
    n = null;

while(null != (n = names.pop())) {
    classToType["[object " + n + "]"] = n.toLowerCase();
}

function type(obj) {
    var strType = __toString.call(obj);
    return classToType[strType] || "object";
}

module.exports = type;
