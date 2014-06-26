(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(["date", "filesize", "intword", "linebreaks", "naturalDay", "nl2br", "numberFormat", "ordinal", "pad", "relativeTime", "time", "truncatechars", "truncatewords"], factory);
    } else if ("object" === typeof exports) {
        module.exports = factory(require("./date"), require("./filesize"), require("./intword"), require("./linebreaks"), require("./naturalDay"), require("./nl2br"), require("./numberFormat"), require("./ordinal"), require("./pad"), require("./relativeTime"), require("./time"), require("./truncatechars"), require("./truncatewords"));
    }
})(function (date, filesize, intword, linebreaks, naturalDay, nl2br, numberFormat, ordinal, pad, relativeTime, time, truncatechars, truncatewords) {
    "use strict";

    return {
        date: date,
        filesize: filesize,
        intword: intword,
        linebreaks: linebreaks,
        naturalDay: naturalDay,
        nl2br: nl2br,
        numberFormat: numberFormat,
        ordinal: ordinal,
        pad: pad,
        relativeTime: relativeTime,
        time: time,
        truncatechars: truncatechars,
        truncatewords: truncatewords
    };
});
