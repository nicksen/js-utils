(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(factory);
    } else if ("object" === typeof exports) {
        module.exports = factory();
    }
})(function () {
    "use strict";

    var __toString = Object.prototype.toString,
        classToType = {},
        names = ("Boolean|Number|String|Function|Array|Date|RegExp|Undefined|Null").split("|");

    for (var name in names) {
        if (names.hasOwnProperty(name)) {
            classToType["[object " + name + "]"] = name.toLowerCase();
        }
    }

    function type(obj) {
        var strType = __toString.call(obj);
        return classToType[strType] || "object";
    }

    return type;
});
