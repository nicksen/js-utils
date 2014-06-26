/**
 * For dates that are the current day or within one day, return 'today', 'tomorrow' or 'yesterday', as appropriate.
 * Otherwise, format the date using the passed in format string.
 *
 * Examples (when 'today' is 17 Feb 2007):
 * 16 Feb 2007 becomes yesterday.
 * 17 Feb 2007 becomes today.
 * 18 Feb 2007 becomes tomorrow.
 * Any other day is formatted according to given argument or the DATE_FORMAT setting if no argument is given.
 */
(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(["time", "date"], factory);
    } else if ("object" === typeof exports) {
        module.exports = factory(require("./time"), require("./date"));
    }
})(function (time, date) {
    "use strict";

    var naturalDay = function (timestamp, format) {
        timestamp = null == timestamp ? time() : timestamp;
        format = null == format ? "Y-m-d" : format;

        var oneDay = 86400,
            d = new Date(),
            today = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 1000;

        if (timestamp < today && timestamp >= today - oneDay) {
            return "yesterday";
        }
        if (timestamp >= today && timestamp < today + oneDay) {
            return "today";
        }
        if (timestamp >= today + oneDay && timestamp < today + 2 * oneDay) {
            return "tomorrow";
        }

        return date(format, timestamp);
    };

    return naturalDay;
});
