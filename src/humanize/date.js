/**
 * PHP-inspired date
 */
(function (factory) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(["pad"], factory);
    } else if ("object" === typeof exports) {
        module.exports = factory(require("./pad"));
    }
})(function (pad) {
    "use strict";

    var dayTableCommon = [ 0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ],
        dayTableLeap = [ 0, 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ],
        shortDayTxt = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        monthTxt = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var date = function (format, timestamp) {
        var jsdate = (null == timestamp ? new Date() : // Timestamp not provided
                      timestamp instanceof Date ? new Date(timestamp) : // JS Date()
                      new Date(timestamp * 1000)), // UNIX timestamp (auto-convert to int)
            formatChr = /\\?([a-z])/gi,
            formatChrCb = function (t, s) {
                return null != f[t] ? f[t]() : s;
            };

        var f = {
            /* Day */
            // Day of month w/leading 0; 01...31
            d: function () { return pad(f.j(), 2, "0"); },

            // Shorthand day name; Mon..Sun
            D: function () { return f.l().slice(0, 3); },

            // Day of month; 1..31
            j: function () { return jsdate.getDate(); },

            // Full day name; Monday..Sunday
            l: function () { return shortDayTxt[f.w()]; },

            // ISO-8601 day of week; 1[Mon]..7[Sun]
            N: function () { return f.w() || 7; },

            // Ordinal suffix for day of month; st, nd, rd, th
            S: function () {
                var j = f.j();
                return 4 < j && 21 > j ? "th" : { 1: "st", 2: "nd", 3: "rd" }[j % 10] || "th";
            },

            // Day of week; 0[Sun]..6[Sat]
            w: function () { return jsdate.getDay(); },

            // Day of year; 0..365
            z: function () { return (f.L() ? dayTableLeap[f.n()] : dayTableCommon[f.n()]) + f.j() - 1; },

            /* Week */
            // ISO-8601 week number
            W: function () {
                // days between midweek of this week and jan 4
                // (f.z() - f.N() + 1 + 3.5) - 3
                var midWeekDaysFromJan4 = f.z() - f.N() + 1.5;
                // 1 + number of weeks + rounded week
                return pad(1 + Math.floor(Math.abs(midWeekDaysFromJan4) / 7) + (3.5 < midWeekDaysFromJan4 % 7 ? 1 : 0), 2, "0");
            },

            /* Month */
            // Full month name; January...December
            F: function () { return monthTxt[jsdate.getMonth()]; },

            // Month w/leading 0; 01..12
            m: function () { return pad(f.n(), 2, "0"); },

            // Shorthand month name; Jan..Dec
            M: function () { return f.F().slice(0, 3); },

            // Month; 1...12
            n: function () { return jsdate.getMonth() + 1; },

            // Days in month; 28..31
            t: function () { return new Date(f.Y(), f.n(), 0).getDate(); },

            /* Year */
            // Is leap year?; 0 or 1
            L: function () { return 1 === new Date(f.Y(), 1, 29).getMonth() ? 1 : 0; },

            // ISO-8601 year
            o: function () {
                var n = f.n(),
                    W = f.W();
                return f.Y() + (12 === n && 9 > W ? -1 : 1 === n && 9 < W);
            },

            // Full year; e.g. 1980..2010
            Y: function () { return jsdate.getFullYear(); },

            // Last two digits of year; 00..99
            y: function () { return String(f.Y()).slice(-2); },

            /* Time */
            // am or pm
            a: function () { return jsdate.getHours() > 11 ? "pm" : "am"; },

            // AM or PM
            A: function () { return f.a().toUpperCase(); },

            // Swatch Internet time; 000...999
            B: function () {
                var unixTime = jsdate.getTime() / 1000,
                    secondsPassedToday = unixTime % 86400 + 3600; // since it"s based off of UTC+1

                if (secondsPassedToday < 0) {
                    secondsPassedToday += 86400;
                }

                var beats = ((secondsPassedToday) / 86.4) % 1000;

                if (unixTime < 0) {
                    return Math.ceil(beats);
                }
                return Math.floor(beats);
            },

            // 12-Hours; 1...12
            g: function () { return f.G() % 12 || 12; },

            // 24-Hours; 0...23
            G: function () { return jsdate.getHours(); },

            // 12-Hours w/leading 0; 01...12
            h: function () { return pad(f.g(), 2, "0"); },

            // 24-Hours w/leading 0; 00...23
            H: function () { return pad(f.G(), 2, "0"); },

            // Minutes w/leading 0; 00...59
            i: function () { return pad(jsdate.getMinutes(), 2, "0"); },

            // Seconds w/leading 0; 00...59
            s: function () { return pad(jsdate.getSeconds(), 2, "0"); },

            // Microseconds; 000000-999000
            u: function () { return pad(jsdate.getMilliseconds() * 1000, 6, "0"); },

            // Whether or not the date is in daylight savings time
            /*
            I: function () {
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                var Y = f.Y();
                return 0 + (new Date(Y, 0) - Date.UTC(Y, 0)) !== (new Date(Y, 6) - Date.UTC(Y, 6));
            },
            */

            // Difference to GMT in hour format; e.g. +0200
            O: function () {
                var tzo = jsdate.getTimezoneOffset(),
                    tzoNum = Math.abs(tzo);
                return (0 < tzo ? "-" : "+") + pad(Math.floor(tzoNum / 60) * 100 + tzoNum % 60, 4, "0");
            },

            // Difference to GMT w/colon; e.g. +02:00
            P: function () {
                var O = f.O();
                return (O.substr(0, 3) + ":" + O.substr(3, 2));
            },

            // Timezone offset in seconds (-43200..50400)
            Z: function () { return -jsdate.getTimezoneOffset() * 60; },

            // Full Date/Time, ISO-8601 date
            c: function () { return "Y-m-d\\TH:i:sP".replace(formatChr, formatChrCb); },

            // RFC 2822
            r: function () { return "D, d M Y H:i:s O".replace(formatChr, formatChrCb); },

            // Seconds since UNIX epoch
            U: function () { return jsdate.getTime() / 1000 || 0; }
        };

        return format.replace(formatChr, formatChrCb);
    };

    return date;
});
