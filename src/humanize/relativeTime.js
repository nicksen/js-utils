/**
 * Returns a string representing how many seconds, minutes or hours ago it was or will be in the future
 * Will always return a relative time, most granular of seconds to least granular of years. See unit tests for more details
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

    var relativeTime = function (timestamp) {
        timestamp = null == timestamp ? time() : timestamp;

        var currTime = time(),
            timeDiff = currTime - timestamp;

        // within 2 seconds
        if (2 > timeDiff && -2 < timeDiff) {
            return (0 <= timeDiff ? "just " : "") + "now";
        }

        // within a minute
        if (60 > timeDiff && -60 < timeDiff) {
            return 0 <= timeDiff ? Math.floor(timeDiff) + " seconds ago" : "in " + Math.floor(-timeDiff) + " seconds";
        }

        // within 2 minutes
        if (120 > timeDiff && -120 < timeDiff) {
            return 0 <= timeDiff ? "about a minute ago" : "in about a minute";
        }

        // within an hour
        if (3600 > timeDiff && -3600 < timeDiff) {
            return 0 <= timeDiff ? Math.floor(timeDiff / 60) + " minutes ago" : "in " + Math.floor(-timeDiff / 60) + " minutes";
        }

        // within 2 hours
        if (7200 > timeDiff && -7200 < timeDiff) {
            return 0 <= timeDiff ? "about an hour ago" : "in about an hour";
        }

        // within 24 hours
        if (86400 > timeDiff && -86400 < timeDiff) {
            return 0 <= timeDiff ? Math.floor(timeDiff / 3600) + " hours ago" : "in " + Math.floor(timeDiff / 3600) + " hours";
        }

        // within 2 days
        var days2 = 2 * 86400;
        if (days2 > timeDiff && -days2 < timeDiff) {
            return 0 <= timeDiff ? Math.floor(timeDiff / 86400) + " days ago" : "in " + Math.floor(-timeDiff / 86400) + " days";
        }

        // within 60 days
        var days60 = 60 * 86400;
        if (days60 > timeDiff && -days60 < timeDiff) {
            return 0 <= timeDiff ? "about a month ago" : "in about a month";
        }

        var currTimeYears = parseInt(date("Y", currTime), 10),
            timestampYears = parseInt(date("Y", timestamp), 10),
            currTimeMonths = currTimeYears * 12 + parseInt(date("n", currTime), 10),
            timestampMonths = timestampYears * 12 + parseInt(date("n", timestamp), 10);

        // within a year
        var monthDiff = currTimeMonths - timestampMonths;
        if (12 > monthDiff && -12 < monthDiff) {
            return 0 <= monthDiff ? monthDiff + " months ago" : "in " + (-monthDiff) + " months";
        }

        var yearDiff = currTimeYears - timestampYears;
        if (2 > yearDiff && -2 < yearDiff) {
            return 0 <= yearDiff ? "a year ago" : "in a year";
        }

        return 0 <= yearDiff ? yearDiff + " years ago" : "in " + (-yearDiff) + " years";
    };

    return relativeTime;
});
