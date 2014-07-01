!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.utils=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var __slice = Array.prototype.slice;

function closest(node, search) {
    var matches = [],
        hits = __slice.call(document.querySelectorAll(search));

    while (null != node) {
        if (0 <= hits.indexOf(node)) {
            matches.push(node);
        }

        node = node.parentNode;
    }

    return matches;
}

module.exports = closest;

},{}],2:[function(_dereq_,module,exports){
"use strict";

function debounce(fn, wait, immediate) {
    if (null == immediate) {
        immediate = false;
    }

    var timeout = null;

    return function () {
        var context = this,
            args = arguments;

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) {
                fn.apply(context, args);
            }
        }, wait);

        if (immediate && !timeout) {
            fn.apply(context, args);
        }
    };
}

module.exports = debounce;

},{}],3:[function(_dereq_,module,exports){
"use strict";

var type = _dereq_("./type");

var __hasProp = Object.prototype.hasOwnProperty;

function forEach(collection, fn, context) {
    fn = "function" === type(fn) ? fn : function () {};

    if ("object" === type(collection)) {
        for (var prop in collection) {
            if (__hasProp.call(collection, prop)) {
                fn.call(context, collection[prop], prop, collection);
            }
        }
    } else {
        for (var i = 0, len = collection.length; i < len; i++) {
            fn.call(context, collection[i], i, collection);
        }
    }
}

module.exports = forEach;

},{"./type":23}],4:[function(_dereq_,module,exports){
"use strict";

function getFloat(input, abs) {
    if (null == abs) {
        abs = false;
    }

    var val = (input + "").replace(/\s+/, "").replace(",", ".");
    val = parseFloat(val);

    if (abs) {
        val = Math.abs(val);
    }

    if (isNaN(val)) {
        val = 0;
    }

    return val;
}

module.exports = getFloat;

},{}],5:[function(_dereq_,module,exports){
"use strict";

var getFloat = _dereq_("./getFloat");

function getInt(input, abs) {
    return parseInt(getFloat(input, abs), 10);
}

module.exports = parseInt;

},{"./getFloat":4}],6:[function(_dereq_,module,exports){
/**
 * PHP-inspired date
 */
"use strict";

var pad = _dereq_("./pad");

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

module.exports = date;

},{"./pad":15}],7:[function(_dereq_,module,exports){
/**
 * Formats the value like a "human-readable" file size (i.e. "13 KB", "4.1 MB", "102 bytes", etc).
 *
 * For example:
 * If value is 123456789, the output would be 117.7 MB.
 */
"use strict";

var intword = _dereq_("./intword");

var filesize = function (filesize, kilo, decimals, decPoint, thousandsSep, suffixSep) {
    kilo = null == kilo ? 1024 : kilo;
    if (0 >= filesize) {
        return "0 bytes";
    }
    if (filesize < kilo && null == decimals) {
        decimals = 0;
    }
    if (null == suffixSep) {
        suffixSep = " ";
    }
    return intword(filesize, [ "bytes", "KB", "MB", "GB", "TB", "PB" ], kilo, decimals, decPoint, thousandsSep, suffixSep);
};

module.exports = filesize;

},{"./intword":9}],8:[function(_dereq_,module,exports){
"use strict";

module.exports = {
    date: _dereq_("./date"),
    filesize: _dereq_("./filesize"),
    intword: _dereq_("./intword"),
    linebreaks: _dereq_("./linebreaks"),
    naturalDay: _dereq_("./naturalDay"),
    nl2br: _dereq_("./nl2br"),
    numberFormat: _dereq_("./numberFormat"),
    ordinal: _dereq_("./ordinal"),
    pad: _dereq_("./pad"),
    relativeTime: _dereq_("./relativeTime"),
    time: _dereq_("./time"),
    truncatechars: _dereq_("./truncatechars"),
    truncatewords: _dereq_("./truncatewords")
};

},{"./date":6,"./filesize":7,"./intword":9,"./linebreaks":10,"./naturalDay":11,"./nl2br":12,"./numberFormat":13,"./ordinal":14,"./pad":15,"./relativeTime":16,"./time":17,"./truncatechars":18,"./truncatewords":19}],9:[function(_dereq_,module,exports){
/**
 * Formats the value like a "human-readable" number (i.e. "13 K", "4.1 M", "102", etc).
 *
 * For example:
 * If value is 123456789, the output would be 117.7 M.
 */
"use strict";

var numberFormat = _dereq_("./numberFormat");

var intword = function (number, units, kilo, decimals, decPoint, thousandsSep, suffixSep) {
    var humanized, unit;

    units = units || ["", "K", "M", "B", "T"];
    unit = units.length - 1;
    kilo = kilo || 1000;
    decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
    decPoint = decPoint || ".";
    thousandsSep = thousandsSep || ",";
    suffixSep = suffixSep || "";

    for (var i = 0, len = units.length; i < len; i++) {
        if (Math.pow(kilo, i + 1) > number) {
            unit = i;
            break;
        }
    }
    humanized = number / Math.pow(kilo, unit);

    var suffix = units[unit] ? suffixSep + units[unit] : "";
    return numberFormat(humanized, decimals, decPoint, thousandsSep) + suffix;
};

module.exports = intword;

},{"./numberFormat":13}],10:[function(_dereq_,module,exports){
/**
 * Replaces line breaks in plain text with appropriate HTML
 * A single newline becomes an HTML line break (<br/>) and a new line followed by a blank line becomes a paragraph break (</p>).
 *
 * For example:
 * If value is Joel\nis a\n\nslug, the output will be <p>Joel<br />is a</p><p>slug</p>
 */
"use strict";

var linebreaks = function (str) {
    // remove beginning and ending newlines
    str = str.replace(/^([\n|\r]*)/, "");
    str = str.replace(/([\n|\r]*)$/, "");

    // normalize all to \n
    str = str.replace(/(\r\n|\n|\r)/g, "\n");

    // any consecutive new lines more than 2 gets turned into p tags
    str = str.replace(/(\n{2,})/g, "</p><p>");

    // any that are singletons get turned into br
    str = str.replace(/\n/g, "<br />");
    return "<p>" + str + "</p>";
};

module.exports = linebreaks;

},{}],11:[function(_dereq_,module,exports){
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
"use strict";

var time = _dereq_("./time"),
    date = _dereq_("./date");

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

module.exports = naturalDay;

},{"./date":6,"./time":17}],12:[function(_dereq_,module,exports){
/**
 * Converts all newlines in a piece of plain text to HTML line breaks (<br />).
 */
"use strict";

var nl2br = function (str) {
    return str.replace(/(\r\n|\n|\r)/g, "<br/>");
};

module.exports = nl2br;

},{}],13:[function(_dereq_,module,exports){
/**
 * Format number by adding thousands separaters and significant digits while rounding
 */
"use strict";

var numberFormat = function (number, decimals, decPoint, thousandsSep) {
    decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
    decPoint = null == decPoint ? "." : decPoint;
    thousandsSep = (null == thousandsSep) ? "," : thousandsSep;

    var sign = 0 > number ? "-" : "";
    number = Math.abs(+number || 0);

    var intPart = parseInt(number.toFixed(decimals), 10) + "",
        j = intPart.length > 3 ? intPart.length % 3 : 0;

    return sign + (j ? intPart.substr(0, j) + thousandsSep : "") + intPart.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : "");
};

module.exports = numberFormat;

},{}],14:[function(_dereq_,module,exports){
/**
 * Converts an integer to its ordinal as a string.
 *
 * 1 becomes 1st
 * 2 becomes 2nd
 * 3 becomes 3rd etc
 */
"use strict";

var ordinal = function (number) {
    number = parseInt(number, 10);
    number = isNaN(number) ? 0 : number;
    var sign = number < 0 ? "-" : "";
    number = Math.abs(number);
    var tens = number % 100;

    return sign + number + (tens > 4 && tens < 21 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th");
};

module.exports = ordinal;

},{}],15:[function(_dereq_,module,exports){
"use strict";

var pad = function (str, count, padChar, type) {
    str += ""; // Ensure string

    if (!padChar) {
        padChar = " ";
    } else if (1 < padChar.length) {
        padChar = padChar.charAt(0);
    }

    type = null == type ? "left" : "right";

    if ("right" === type) {
        while (count > str.length) {
            str += padChar;
        }
    } else {
        // Default to left
        while (count > str.length) {
            str = padChar + str;
        }
    }

    return str;
};

module.exports = pad;

},{}],16:[function(_dereq_,module,exports){
/**
 * Returns a string representing how many seconds, minutes or hours ago it was or will be in the future
 * Will always return a relative time, most granular of seconds to least granular of years. See unit tests for more details
 */
"use strict";

var time = _dereq_("./time"),
    date = _dereq_("./date");

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

module.exports = relativeTime;

},{"./date":6,"./time":17}],17:[function(_dereq_,module,exports){
"use strict";

var time = function () {
    return (null != Date.now ? Date.now() : new Date().getTime()) / 1000;
};

module.exports = time;

},{}],18:[function(_dereq_,module,exports){
/**
 * Truncates a string if it is longer than the specified number of characters.
 * Truncated strings will end with a translatable ellipsis sequence ("…").
 */
"use strict";

var truncatechars = function (string, length) {
    if (string.length <= length) {
        return string;
    }

    return string.substr(0, length) + "…";
};

module.exports = truncatechars;

},{}],19:[function(_dereq_,module,exports){
/**
 * Truncates a string after a certain number of words.
 * Newlines within the string will be removed.
 */
"use strict";

var truncatewords = function (string, numWords) {
    var words = string.split(' ');

    if (words.length < numWords) {
        return string;
    }

    return words.slice(0, numWords).join(' ') + "…";
};

module.exports = truncatewords;

},{}],20:[function(_dereq_,module,exports){
"use strict";

module.exports = {
    closest: _dereq_("./closest"),
    debounce: _dereq_("./debounce"),
    forEach: _dereq_("./forEach"),
    getFloat: _dereq_("./getFloat"),
    getInt: _dereq_("./getInt"),
    humanize: _dereq_("./humanize"),
    log: _dereq_("./log"),
    raf: _dereq_("./raf"),
    type: _dereq_("./type")
};

},{"./closest":1,"./debounce":2,"./forEach":3,"./getFloat":4,"./getInt":5,"./humanize":8,"./log":21,"./raf":22,"./type":23}],21:[function(_dereq_,module,exports){
"use strict";

function log() {
    log.history.push(arguments);
    console.log(Array.prototype.slice.call(arguments));
}

log.history = [];

log.dbg = function (str) {
    str = "DEBUG: " + str;
    log.history.push(str);
    console.debug(str);
};

log.err = function (str) {
    log.history.push("ERROR: " + str);
    console.error(str);
};

module.exports = log;

},{}],22:[function(_dereq_,module,exports){
"use strict";

var nativeRaf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
    lastTime = 0;

var raf = nativeRaf || function (fn) {
    var currTime = Date.now(),
        timeDelay = Math.max(0, 16 - (currTime - lastTime));
    lastTime = currTime + timeDelay;
    return setTimeout(function() {
        fn(Date.now());
    }, timeDelay);
};

module.exports = raf;

},{}],23:[function(_dereq_,module,exports){
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

},{}]},{},[20])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvY2xvc2VzdC5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvZGVib3VuY2UuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2ZvckVhY2guanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2dldEZsb2F0LmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9nZXRJbnQuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2h1bWFuaXplL2RhdGUuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2h1bWFuaXplL2ZpbGVzaXplLmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9odW1hbml6ZS9pbmRleC5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvaW50d29yZC5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvbGluZWJyZWFrcy5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvbmF0dXJhbERheS5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvbmwyYnIuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2h1bWFuaXplL251bWJlckZvcm1hdC5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvb3JkaW5hbC5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvcGFkLmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9odW1hbml6ZS9yZWxhdGl2ZVRpbWUuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2h1bWFuaXplL3RpbWUuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2h1bWFuaXplL3RydW5jYXRlY2hhcnMuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2h1bWFuaXplL3RydW5jYXRld29yZHMuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2luZGV4LmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9sb2cuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL3JhZi5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvdHlwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfX3NsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBjbG9zZXN0KG5vZGUsIHNlYXJjaCkge1xuICAgIHZhciBtYXRjaGVzID0gW10sXG4gICAgICAgIGhpdHMgPSBfX3NsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWFyY2gpKTtcblxuICAgIHdoaWxlIChudWxsICE9IG5vZGUpIHtcbiAgICAgICAgaWYgKDAgPD0gaGl0cy5pbmRleE9mKG5vZGUpKSB7XG4gICAgICAgICAgICBtYXRjaGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaGVzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb3Nlc3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gZGVib3VuY2UoZm4sIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIGlmIChudWxsID09IGltbWVkaWF0ZSkge1xuICAgICAgICBpbW1lZGlhdGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB3YWl0KTtcblxuICAgICAgICBpZiAoaW1tZWRpYXRlICYmICF0aW1lb3V0KSB7XG4gICAgICAgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHR5cGUgPSByZXF1aXJlKFwiLi90eXBlXCIpO1xuXG52YXIgX19oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBmbiwgY29udGV4dCkge1xuICAgIGZuID0gXCJmdW5jdGlvblwiID09PSB0eXBlKGZuKSA/IGZuIDogZnVuY3Rpb24gKCkge307XG5cbiAgICBpZiAoXCJvYmplY3RcIiA9PT0gdHlwZShjb2xsZWN0aW9uKSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChfX2hhc1Byb3AuY2FsbChjb2xsZWN0aW9uLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIGZuLmNhbGwoY29udGV4dCwgY29sbGVjdGlvbltwcm9wXSwgcHJvcCwgY29sbGVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29sbGVjdGlvbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgZm4uY2FsbChjb250ZXh0LCBjb2xsZWN0aW9uW2ldLCBpLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGdldEZsb2F0KGlucHV0LCBhYnMpIHtcbiAgICBpZiAobnVsbCA9PSBhYnMpIHtcbiAgICAgICAgYWJzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHZhbCA9IChpbnB1dCArIFwiXCIpLnJlcGxhY2UoL1xccysvLCBcIlwiKS5yZXBsYWNlKFwiLFwiLCBcIi5cIik7XG4gICAgdmFsID0gcGFyc2VGbG9hdCh2YWwpO1xuXG4gICAgaWYgKGFicykge1xuICAgICAgICB2YWwgPSBNYXRoLmFicyh2YWwpO1xuICAgIH1cblxuICAgIGlmIChpc05hTih2YWwpKSB7XG4gICAgICAgIHZhbCA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRGbG9hdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZ2V0RmxvYXQgPSByZXF1aXJlKFwiLi9nZXRGbG9hdFwiKTtcblxuZnVuY3Rpb24gZ2V0SW50KGlucHV0LCBhYnMpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoZ2V0RmxvYXQoaW5wdXQsIGFicyksIDEwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUludDtcbiIsIi8qKlxuICogUEhQLWluc3BpcmVkIGRhdGVcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBwYWQgPSByZXF1aXJlKFwiLi9wYWRcIik7XG5cbnZhciBkYXlUYWJsZUNvbW1vbiA9IFsgMCwgMCwgMzEsIDU5LCA5MCwgMTIwLCAxNTEsIDE4MSwgMjEyLCAyNDMsIDI3MywgMzA0LCAzMzQgXSxcbiAgICBkYXlUYWJsZUxlYXAgPSBbIDAsIDAsIDMxLCA2MCwgOTEsIDEyMSwgMTUyLCAxODIsIDIxMywgMjQ0LCAyNzQsIDMwNSwgMzM1IF0sXG4gICAgc2hvcnREYXlUeHQgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXSxcbiAgICBtb250aFR4dCA9IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdO1xuXG52YXIgZGF0ZSA9IGZ1bmN0aW9uIChmb3JtYXQsIHRpbWVzdGFtcCkge1xuICAgIHZhciBqc2RhdGUgPSAobnVsbCA9PSB0aW1lc3RhbXAgPyBuZXcgRGF0ZSgpIDogLy8gVGltZXN0YW1wIG5vdCBwcm92aWRlZFxuICAgICAgICAgICAgICAgICAgdGltZXN0YW1wIGluc3RhbmNlb2YgRGF0ZSA/IG5ldyBEYXRlKHRpbWVzdGFtcCkgOiAvLyBKUyBEYXRlKClcbiAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKHRpbWVzdGFtcCAqIDEwMDApKSwgLy8gVU5JWCB0aW1lc3RhbXAgKGF1dG8tY29udmVydCB0byBpbnQpXG4gICAgICAgIGZvcm1hdENociA9IC9cXFxcPyhbYS16XSkvZ2ksXG4gICAgICAgIGZvcm1hdENockNiID0gZnVuY3Rpb24gKHQsIHMpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsICE9IGZbdF0gPyBmW3RdKCkgOiBzO1xuICAgICAgICB9O1xuXG4gICAgdmFyIGYgPSB7XG4gICAgICAgIC8qIERheSAqL1xuICAgICAgICAvLyBEYXkgb2YgbW9udGggdy9sZWFkaW5nIDA7IDAxLi4uMzFcbiAgICAgICAgZDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFkKGYuaigpLCAyLCBcIjBcIik7IH0sXG5cbiAgICAgICAgLy8gU2hvcnRoYW5kIGRheSBuYW1lOyBNb24uLlN1blxuICAgICAgICBEOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmLmwoKS5zbGljZSgwLCAzKTsgfSxcblxuICAgICAgICAvLyBEYXkgb2YgbW9udGg7IDEuLjMxXG4gICAgICAgIGo6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGpzZGF0ZS5nZXREYXRlKCk7IH0sXG5cbiAgICAgICAgLy8gRnVsbCBkYXkgbmFtZTsgTW9uZGF5Li5TdW5kYXlcbiAgICAgICAgbDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2hvcnREYXlUeHRbZi53KCldOyB9LFxuXG4gICAgICAgIC8vIElTTy04NjAxIGRheSBvZiB3ZWVrOyAxW01vbl0uLjdbU3VuXVxuICAgICAgICBOOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmLncoKSB8fCA3OyB9LFxuXG4gICAgICAgIC8vIE9yZGluYWwgc3VmZml4IGZvciBkYXkgb2YgbW9udGg7IHN0LCBuZCwgcmQsIHRoXG4gICAgICAgIFM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBqID0gZi5qKCk7XG4gICAgICAgICAgICByZXR1cm4gNCA8IGogJiYgMjEgPiBqID8gXCJ0aFwiIDogeyAxOiBcInN0XCIsIDI6IFwibmRcIiwgMzogXCJyZFwiIH1baiAlIDEwXSB8fCBcInRoXCI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRGF5IG9mIHdlZWs7IDBbU3VuXS4uNltTYXRdXG4gICAgICAgIHc6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGpzZGF0ZS5nZXREYXkoKTsgfSxcblxuICAgICAgICAvLyBEYXkgb2YgeWVhcjsgMC4uMzY1XG4gICAgICAgIHo6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIChmLkwoKSA/IGRheVRhYmxlTGVhcFtmLm4oKV0gOiBkYXlUYWJsZUNvbW1vbltmLm4oKV0pICsgZi5qKCkgLSAxOyB9LFxuXG4gICAgICAgIC8qIFdlZWsgKi9cbiAgICAgICAgLy8gSVNPLTg2MDEgd2VlayBudW1iZXJcbiAgICAgICAgVzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gZGF5cyBiZXR3ZWVuIG1pZHdlZWsgb2YgdGhpcyB3ZWVrIGFuZCBqYW4gNFxuICAgICAgICAgICAgLy8gKGYueigpIC0gZi5OKCkgKyAxICsgMy41KSAtIDNcbiAgICAgICAgICAgIHZhciBtaWRXZWVrRGF5c0Zyb21KYW40ID0gZi56KCkgLSBmLk4oKSArIDEuNTtcbiAgICAgICAgICAgIC8vIDEgKyBudW1iZXIgb2Ygd2Vla3MgKyByb3VuZGVkIHdlZWtcbiAgICAgICAgICAgIHJldHVybiBwYWQoMSArIE1hdGguZmxvb3IoTWF0aC5hYnMobWlkV2Vla0RheXNGcm9tSmFuNCkgLyA3KSArICgzLjUgPCBtaWRXZWVrRGF5c0Zyb21KYW40ICUgNyA/IDEgOiAwKSwgMiwgXCIwXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIE1vbnRoICovXG4gICAgICAgIC8vIEZ1bGwgbW9udGggbmFtZTsgSmFudWFyeS4uLkRlY2VtYmVyXG4gICAgICAgIEY6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vbnRoVHh0W2pzZGF0ZS5nZXRNb250aCgpXTsgfSxcblxuICAgICAgICAvLyBNb250aCB3L2xlYWRpbmcgMDsgMDEuLjEyXG4gICAgICAgIG06IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBhZChmLm4oKSwgMiwgXCIwXCIpOyB9LFxuXG4gICAgICAgIC8vIFNob3J0aGFuZCBtb250aCBuYW1lOyBKYW4uLkRlY1xuICAgICAgICBNOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmLkYoKS5zbGljZSgwLCAzKTsgfSxcblxuICAgICAgICAvLyBNb250aDsgMS4uLjEyXG4gICAgICAgIG46IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGpzZGF0ZS5nZXRNb250aCgpICsgMTsgfSxcblxuICAgICAgICAvLyBEYXlzIGluIG1vbnRoOyAyOC4uMzFcbiAgICAgICAgdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IERhdGUoZi5ZKCksIGYubigpLCAwKS5nZXREYXRlKCk7IH0sXG5cbiAgICAgICAgLyogWWVhciAqL1xuICAgICAgICAvLyBJcyBsZWFwIHllYXI/OyAwIG9yIDFcbiAgICAgICAgTDogZnVuY3Rpb24gKCkgeyByZXR1cm4gMSA9PT0gbmV3IERhdGUoZi5ZKCksIDEsIDI5KS5nZXRNb250aCgpID8gMSA6IDA7IH0sXG5cbiAgICAgICAgLy8gSVNPLTg2MDEgeWVhclxuICAgICAgICBvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbiA9IGYubigpLFxuICAgICAgICAgICAgICAgIFcgPSBmLlcoKTtcbiAgICAgICAgICAgIHJldHVybiBmLlkoKSArICgxMiA9PT0gbiAmJiA5ID4gVyA/IC0xIDogMSA9PT0gbiAmJiA5IDwgVyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRnVsbCB5ZWFyOyBlLmcuIDE5ODAuLjIwMTBcbiAgICAgICAgWTogZnVuY3Rpb24gKCkgeyByZXR1cm4ganNkYXRlLmdldEZ1bGxZZWFyKCk7IH0sXG5cbiAgICAgICAgLy8gTGFzdCB0d28gZGlnaXRzIG9mIHllYXI7IDAwLi45OVxuICAgICAgICB5OiBmdW5jdGlvbiAoKSB7IHJldHVybiBTdHJpbmcoZi5ZKCkpLnNsaWNlKC0yKTsgfSxcblxuICAgICAgICAvKiBUaW1lICovXG4gICAgICAgIC8vIGFtIG9yIHBtXG4gICAgICAgIGE6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGpzZGF0ZS5nZXRIb3VycygpID4gMTEgPyBcInBtXCIgOiBcImFtXCI7IH0sXG5cbiAgICAgICAgLy8gQU0gb3IgUE1cbiAgICAgICAgQTogZnVuY3Rpb24gKCkgeyByZXR1cm4gZi5hKCkudG9VcHBlckNhc2UoKTsgfSxcblxuICAgICAgICAvLyBTd2F0Y2ggSW50ZXJuZXQgdGltZTsgMDAwLi4uOTk5XG4gICAgICAgIEI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1bml4VGltZSA9IGpzZGF0ZS5nZXRUaW1lKCkgLyAxMDAwLFxuICAgICAgICAgICAgICAgIHNlY29uZHNQYXNzZWRUb2RheSA9IHVuaXhUaW1lICUgODY0MDAgKyAzNjAwOyAvLyBzaW5jZSBpdFwicyBiYXNlZCBvZmYgb2YgVVRDKzFcblxuICAgICAgICAgICAgaWYgKHNlY29uZHNQYXNzZWRUb2RheSA8IDApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzUGFzc2VkVG9kYXkgKz0gODY0MDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBiZWF0cyA9ICgoc2Vjb25kc1Bhc3NlZFRvZGF5KSAvIDg2LjQpICUgMTAwMDtcblxuICAgICAgICAgICAgaWYgKHVuaXhUaW1lIDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoYmVhdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoYmVhdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIDEyLUhvdXJzOyAxLi4uMTJcbiAgICAgICAgZzogZnVuY3Rpb24gKCkgeyByZXR1cm4gZi5HKCkgJSAxMiB8fCAxMjsgfSxcblxuICAgICAgICAvLyAyNC1Ib3VyczsgMC4uLjIzXG4gICAgICAgIEc6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGpzZGF0ZS5nZXRIb3VycygpOyB9LFxuXG4gICAgICAgIC8vIDEyLUhvdXJzIHcvbGVhZGluZyAwOyAwMS4uLjEyXG4gICAgICAgIGg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBhZChmLmcoKSwgMiwgXCIwXCIpOyB9LFxuXG4gICAgICAgIC8vIDI0LUhvdXJzIHcvbGVhZGluZyAwOyAwMC4uLjIzXG4gICAgICAgIEg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBhZChmLkcoKSwgMiwgXCIwXCIpOyB9LFxuXG4gICAgICAgIC8vIE1pbnV0ZXMgdy9sZWFkaW5nIDA7IDAwLi4uNTlcbiAgICAgICAgaTogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFkKGpzZGF0ZS5nZXRNaW51dGVzKCksIDIsIFwiMFwiKTsgfSxcblxuICAgICAgICAvLyBTZWNvbmRzIHcvbGVhZGluZyAwOyAwMC4uLjU5XG4gICAgICAgIHM6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBhZChqc2RhdGUuZ2V0U2Vjb25kcygpLCAyLCBcIjBcIik7IH0sXG5cbiAgICAgICAgLy8gTWljcm9zZWNvbmRzOyAwMDAwMDAtOTk5MDAwXG4gICAgICAgIHU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBhZChqc2RhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgKiAxMDAwLCA2LCBcIjBcIik7IH0sXG5cbiAgICAgICAgLy8gV2hldGhlciBvciBub3QgdGhlIGRhdGUgaXMgaW4gZGF5bGlnaHQgc2F2aW5ncyB0aW1lXG4gICAgICAgIC8qXG4gICAgICAgIEk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIENvbXBhcmVzIEphbiAxIG1pbnVzIEphbiAxIFVUQyB0byBKdWwgMSBtaW51cyBKdWwgMSBVVEMuXG4gICAgICAgICAgICAvLyBJZiB0aGV5IGFyZSBub3QgZXF1YWwsIHRoZW4gRFNUIGlzIG9ic2VydmVkLlxuICAgICAgICAgICAgdmFyIFkgPSBmLlkoKTtcbiAgICAgICAgICAgIHJldHVybiAwICsgKG5ldyBEYXRlKFksIDApIC0gRGF0ZS5VVEMoWSwgMCkpICE9PSAobmV3IERhdGUoWSwgNikgLSBEYXRlLlVUQyhZLCA2KSk7XG4gICAgICAgIH0sXG4gICAgICAgICovXG5cbiAgICAgICAgLy8gRGlmZmVyZW5jZSB0byBHTVQgaW4gaG91ciBmb3JtYXQ7IGUuZy4gKzAyMDBcbiAgICAgICAgTzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHR6byA9IGpzZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpLFxuICAgICAgICAgICAgICAgIHR6b051bSA9IE1hdGguYWJzKHR6byk7XG4gICAgICAgICAgICByZXR1cm4gKDAgPCB0em8gPyBcIi1cIiA6IFwiK1wiKSArIHBhZChNYXRoLmZsb29yKHR6b051bSAvIDYwKSAqIDEwMCArIHR6b051bSAlIDYwLCA0LCBcIjBcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRGlmZmVyZW5jZSB0byBHTVQgdy9jb2xvbjsgZS5nLiArMDI6MDBcbiAgICAgICAgUDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIE8gPSBmLk8oKTtcbiAgICAgICAgICAgIHJldHVybiAoTy5zdWJzdHIoMCwgMykgKyBcIjpcIiArIE8uc3Vic3RyKDMsIDIpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaW1lem9uZSBvZmZzZXQgaW4gc2Vjb25kcyAoLTQzMjAwLi41MDQwMClcbiAgICAgICAgWjogZnVuY3Rpb24gKCkgeyByZXR1cm4gLWpzZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjA7IH0sXG5cbiAgICAgICAgLy8gRnVsbCBEYXRlL1RpbWUsIElTTy04NjAxIGRhdGVcbiAgICAgICAgYzogZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJZLW0tZFxcXFxUSDppOnNQXCIucmVwbGFjZShmb3JtYXRDaHIsIGZvcm1hdENockNiKTsgfSxcblxuICAgICAgICAvLyBSRkMgMjgyMlxuICAgICAgICByOiBmdW5jdGlvbiAoKSB7IHJldHVybiBcIkQsIGQgTSBZIEg6aTpzIE9cIi5yZXBsYWNlKGZvcm1hdENociwgZm9ybWF0Q2hyQ2IpOyB9LFxuXG4gICAgICAgIC8vIFNlY29uZHMgc2luY2UgVU5JWCBlcG9jaFxuICAgICAgICBVOiBmdW5jdGlvbiAoKSB7IHJldHVybiBqc2RhdGUuZ2V0VGltZSgpIC8gMTAwMCB8fCAwOyB9XG4gICAgfTtcblxuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZShmb3JtYXRDaHIsIGZvcm1hdENockNiKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZGF0ZTtcbiIsIi8qKlxuICogRm9ybWF0cyB0aGUgdmFsdWUgbGlrZSBhIFwiaHVtYW4tcmVhZGFibGVcIiBmaWxlIHNpemUgKGkuZS4gXCIxMyBLQlwiLCBcIjQuMSBNQlwiLCBcIjEwMiBieXRlc1wiLCBldGMpLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICogSWYgdmFsdWUgaXMgMTIzNDU2Nzg5LCB0aGUgb3V0cHV0IHdvdWxkIGJlIDExNy43IE1CLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludHdvcmQgPSByZXF1aXJlKFwiLi9pbnR3b3JkXCIpO1xuXG52YXIgZmlsZXNpemUgPSBmdW5jdGlvbiAoZmlsZXNpemUsIGtpbG8sIGRlY2ltYWxzLCBkZWNQb2ludCwgdGhvdXNhbmRzU2VwLCBzdWZmaXhTZXApIHtcbiAgICBraWxvID0gbnVsbCA9PSBraWxvID8gMTAyNCA6IGtpbG87XG4gICAgaWYgKDAgPj0gZmlsZXNpemUpIHtcbiAgICAgICAgcmV0dXJuIFwiMCBieXRlc1wiO1xuICAgIH1cbiAgICBpZiAoZmlsZXNpemUgPCBraWxvICYmIG51bGwgPT0gZGVjaW1hbHMpIHtcbiAgICAgICAgZGVjaW1hbHMgPSAwO1xuICAgIH1cbiAgICBpZiAobnVsbCA9PSBzdWZmaXhTZXApIHtcbiAgICAgICAgc3VmZml4U2VwID0gXCIgXCI7XG4gICAgfVxuICAgIHJldHVybiBpbnR3b3JkKGZpbGVzaXplLCBbIFwiYnl0ZXNcIiwgXCJLQlwiLCBcIk1CXCIsIFwiR0JcIiwgXCJUQlwiLCBcIlBCXCIgXSwga2lsbywgZGVjaW1hbHMsIGRlY1BvaW50LCB0aG91c2FuZHNTZXAsIHN1ZmZpeFNlcCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVzaXplO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRhdGU6IHJlcXVpcmUoXCIuL2RhdGVcIiksXG4gICAgZmlsZXNpemU6IHJlcXVpcmUoXCIuL2ZpbGVzaXplXCIpLFxuICAgIGludHdvcmQ6IHJlcXVpcmUoXCIuL2ludHdvcmRcIiksXG4gICAgbGluZWJyZWFrczogcmVxdWlyZShcIi4vbGluZWJyZWFrc1wiKSxcbiAgICBuYXR1cmFsRGF5OiByZXF1aXJlKFwiLi9uYXR1cmFsRGF5XCIpLFxuICAgIG5sMmJyOiByZXF1aXJlKFwiLi9ubDJiclwiKSxcbiAgICBudW1iZXJGb3JtYXQ6IHJlcXVpcmUoXCIuL251bWJlckZvcm1hdFwiKSxcbiAgICBvcmRpbmFsOiByZXF1aXJlKFwiLi9vcmRpbmFsXCIpLFxuICAgIHBhZDogcmVxdWlyZShcIi4vcGFkXCIpLFxuICAgIHJlbGF0aXZlVGltZTogcmVxdWlyZShcIi4vcmVsYXRpdmVUaW1lXCIpLFxuICAgIHRpbWU6IHJlcXVpcmUoXCIuL3RpbWVcIiksXG4gICAgdHJ1bmNhdGVjaGFyczogcmVxdWlyZShcIi4vdHJ1bmNhdGVjaGFyc1wiKSxcbiAgICB0cnVuY2F0ZXdvcmRzOiByZXF1aXJlKFwiLi90cnVuY2F0ZXdvcmRzXCIpXG59O1xuIiwiLyoqXG4gKiBGb3JtYXRzIHRoZSB2YWx1ZSBsaWtlIGEgXCJodW1hbi1yZWFkYWJsZVwiIG51bWJlciAoaS5lLiBcIjEzIEtcIiwgXCI0LjEgTVwiLCBcIjEwMlwiLCBldGMpLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICogSWYgdmFsdWUgaXMgMTIzNDU2Nzg5LCB0aGUgb3V0cHV0IHdvdWxkIGJlIDExNy43IE0uXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgbnVtYmVyRm9ybWF0ID0gcmVxdWlyZShcIi4vbnVtYmVyRm9ybWF0XCIpO1xuXG52YXIgaW50d29yZCA9IGZ1bmN0aW9uIChudW1iZXIsIHVuaXRzLCBraWxvLCBkZWNpbWFscywgZGVjUG9pbnQsIHRob3VzYW5kc1NlcCwgc3VmZml4U2VwKSB7XG4gICAgdmFyIGh1bWFuaXplZCwgdW5pdDtcblxuICAgIHVuaXRzID0gdW5pdHMgfHwgW1wiXCIsIFwiS1wiLCBcIk1cIiwgXCJCXCIsIFwiVFwiXTtcbiAgICB1bml0ID0gdW5pdHMubGVuZ3RoIC0gMTtcbiAgICBraWxvID0ga2lsbyB8fCAxMDAwO1xuICAgIGRlY2ltYWxzID0gaXNOYU4oZGVjaW1hbHMpID8gMiA6IE1hdGguYWJzKGRlY2ltYWxzKTtcbiAgICBkZWNQb2ludCA9IGRlY1BvaW50IHx8IFwiLlwiO1xuICAgIHRob3VzYW5kc1NlcCA9IHRob3VzYW5kc1NlcCB8fCBcIixcIjtcbiAgICBzdWZmaXhTZXAgPSBzdWZmaXhTZXAgfHwgXCJcIjtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB1bml0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoTWF0aC5wb3coa2lsbywgaSArIDEpID4gbnVtYmVyKSB7XG4gICAgICAgICAgICB1bml0ID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGh1bWFuaXplZCA9IG51bWJlciAvIE1hdGgucG93KGtpbG8sIHVuaXQpO1xuXG4gICAgdmFyIHN1ZmZpeCA9IHVuaXRzW3VuaXRdID8gc3VmZml4U2VwICsgdW5pdHNbdW5pdF0gOiBcIlwiO1xuICAgIHJldHVybiBudW1iZXJGb3JtYXQoaHVtYW5pemVkLCBkZWNpbWFscywgZGVjUG9pbnQsIHRob3VzYW5kc1NlcCkgKyBzdWZmaXg7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludHdvcmQ7XG4iLCIvKipcbiAqIFJlcGxhY2VzIGxpbmUgYnJlYWtzIGluIHBsYWluIHRleHQgd2l0aCBhcHByb3ByaWF0ZSBIVE1MXG4gKiBBIHNpbmdsZSBuZXdsaW5lIGJlY29tZXMgYW4gSFRNTCBsaW5lIGJyZWFrICg8YnIvPikgYW5kIGEgbmV3IGxpbmUgZm9sbG93ZWQgYnkgYSBibGFuayBsaW5lIGJlY29tZXMgYSBwYXJhZ3JhcGggYnJlYWsgKDwvcD4pLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICogSWYgdmFsdWUgaXMgSm9lbFxcbmlzIGFcXG5cXG5zbHVnLCB0aGUgb3V0cHV0IHdpbGwgYmUgPHA+Sm9lbDxiciAvPmlzIGE8L3A+PHA+c2x1ZzwvcD5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBsaW5lYnJlYWtzID0gZnVuY3Rpb24gKHN0cikge1xuICAgIC8vIHJlbW92ZSBiZWdpbm5pbmcgYW5kIGVuZGluZyBuZXdsaW5lc1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eKFtcXG58XFxyXSopLywgXCJcIik7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoLyhbXFxufFxccl0qKSQvLCBcIlwiKTtcblxuICAgIC8vIG5vcm1hbGl6ZSBhbGwgdG8gXFxuXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZywgXCJcXG5cIik7XG5cbiAgICAvLyBhbnkgY29uc2VjdXRpdmUgbmV3IGxpbmVzIG1vcmUgdGhhbiAyIGdldHMgdHVybmVkIGludG8gcCB0YWdzXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoLyhcXG57Mix9KS9nLCBcIjwvcD48cD5cIik7XG5cbiAgICAvLyBhbnkgdGhhdCBhcmUgc2luZ2xldG9ucyBnZXQgdHVybmVkIGludG8gYnJcbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvXFxuL2csIFwiPGJyIC8+XCIpO1xuICAgIHJldHVybiBcIjxwPlwiICsgc3RyICsgXCI8L3A+XCI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVicmVha3M7XG4iLCIvKipcbiAqIEZvciBkYXRlcyB0aGF0IGFyZSB0aGUgY3VycmVudCBkYXkgb3Igd2l0aGluIG9uZSBkYXksIHJldHVybiAndG9kYXknLCAndG9tb3Jyb3cnIG9yICd5ZXN0ZXJkYXknLCBhcyBhcHByb3ByaWF0ZS5cbiAqIE90aGVyd2lzZSwgZm9ybWF0IHRoZSBkYXRlIHVzaW5nIHRoZSBwYXNzZWQgaW4gZm9ybWF0IHN0cmluZy5cbiAqXG4gKiBFeGFtcGxlcyAod2hlbiAndG9kYXknIGlzIDE3IEZlYiAyMDA3KTpcbiAqIDE2IEZlYiAyMDA3IGJlY29tZXMgeWVzdGVyZGF5LlxuICogMTcgRmViIDIwMDcgYmVjb21lcyB0b2RheS5cbiAqIDE4IEZlYiAyMDA3IGJlY29tZXMgdG9tb3Jyb3cuXG4gKiBBbnkgb3RoZXIgZGF5IGlzIGZvcm1hdHRlZCBhY2NvcmRpbmcgdG8gZ2l2ZW4gYXJndW1lbnQgb3IgdGhlIERBVEVfRk9STUFUIHNldHRpbmcgaWYgbm8gYXJndW1lbnQgaXMgZ2l2ZW4uXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgdGltZSA9IHJlcXVpcmUoXCIuL3RpbWVcIiksXG4gICAgZGF0ZSA9IHJlcXVpcmUoXCIuL2RhdGVcIik7XG5cbnZhciBuYXR1cmFsRGF5ID0gZnVuY3Rpb24gKHRpbWVzdGFtcCwgZm9ybWF0KSB7XG4gICAgdGltZXN0YW1wID0gbnVsbCA9PSB0aW1lc3RhbXAgPyB0aW1lKCkgOiB0aW1lc3RhbXA7XG4gICAgZm9ybWF0ID0gbnVsbCA9PSBmb3JtYXQgPyBcIlktbS1kXCIgOiBmb3JtYXQ7XG5cbiAgICB2YXIgb25lRGF5ID0gODY0MDAsXG4gICAgICAgIGQgPSBuZXcgRGF0ZSgpLFxuICAgICAgICB0b2RheSA9IG5ldyBEYXRlKGQuZ2V0RnVsbFllYXIoKSwgZC5nZXRNb250aCgpLCBkLmdldERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMDtcblxuICAgIGlmICh0aW1lc3RhbXAgPCB0b2RheSAmJiB0aW1lc3RhbXAgPj0gdG9kYXkgLSBvbmVEYXkpIHtcbiAgICAgICAgcmV0dXJuIFwieWVzdGVyZGF5XCI7XG4gICAgfVxuICAgIGlmICh0aW1lc3RhbXAgPj0gdG9kYXkgJiYgdGltZXN0YW1wIDwgdG9kYXkgKyBvbmVEYXkpIHtcbiAgICAgICAgcmV0dXJuIFwidG9kYXlcIjtcbiAgICB9XG4gICAgaWYgKHRpbWVzdGFtcCA+PSB0b2RheSArIG9uZURheSAmJiB0aW1lc3RhbXAgPCB0b2RheSArIDIgKiBvbmVEYXkpIHtcbiAgICAgICAgcmV0dXJuIFwidG9tb3Jyb3dcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0ZShmb3JtYXQsIHRpbWVzdGFtcCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdHVyYWxEYXk7XG4iLCIvKipcbiAqIENvbnZlcnRzIGFsbCBuZXdsaW5lcyBpbiBhIHBpZWNlIG9mIHBsYWluIHRleHQgdG8gSFRNTCBsaW5lIGJyZWFrcyAoPGJyIC8+KS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBubDJiciA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZywgXCI8YnIvPlwiKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmwyYnI7XG4iLCIvKipcbiAqIEZvcm1hdCBudW1iZXIgYnkgYWRkaW5nIHRob3VzYW5kcyBzZXBhcmF0ZXJzIGFuZCBzaWduaWZpY2FudCBkaWdpdHMgd2hpbGUgcm91bmRpbmdcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBudW1iZXJGb3JtYXQgPSBmdW5jdGlvbiAobnVtYmVyLCBkZWNpbWFscywgZGVjUG9pbnQsIHRob3VzYW5kc1NlcCkge1xuICAgIGRlY2ltYWxzID0gaXNOYU4oZGVjaW1hbHMpID8gMiA6IE1hdGguYWJzKGRlY2ltYWxzKTtcbiAgICBkZWNQb2ludCA9IG51bGwgPT0gZGVjUG9pbnQgPyBcIi5cIiA6IGRlY1BvaW50O1xuICAgIHRob3VzYW5kc1NlcCA9IChudWxsID09IHRob3VzYW5kc1NlcCkgPyBcIixcIiA6IHRob3VzYW5kc1NlcDtcblxuICAgIHZhciBzaWduID0gMCA+IG51bWJlciA/IFwiLVwiIDogXCJcIjtcbiAgICBudW1iZXIgPSBNYXRoLmFicygrbnVtYmVyIHx8IDApO1xuXG4gICAgdmFyIGludFBhcnQgPSBwYXJzZUludChudW1iZXIudG9GaXhlZChkZWNpbWFscyksIDEwKSArIFwiXCIsXG4gICAgICAgIGogPSBpbnRQYXJ0Lmxlbmd0aCA+IDMgPyBpbnRQYXJ0Lmxlbmd0aCAlIDMgOiAwO1xuXG4gICAgcmV0dXJuIHNpZ24gKyAoaiA/IGludFBhcnQuc3Vic3RyKDAsIGopICsgdGhvdXNhbmRzU2VwIDogXCJcIikgKyBpbnRQYXJ0LnN1YnN0cihqKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgXCIkMVwiICsgdGhvdXNhbmRzU2VwKSArIChkZWNpbWFscyA/IGRlY1BvaW50ICsgTWF0aC5hYnMobnVtYmVyIC0gaW50UGFydCkudG9GaXhlZChkZWNpbWFscykuc2xpY2UoMikgOiBcIlwiKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbnVtYmVyRm9ybWF0O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBhbiBpbnRlZ2VyIHRvIGl0cyBvcmRpbmFsIGFzIGEgc3RyaW5nLlxuICpcbiAqIDEgYmVjb21lcyAxc3RcbiAqIDIgYmVjb21lcyAybmRcbiAqIDMgYmVjb21lcyAzcmQgZXRjXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgb3JkaW5hbCA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICBudW1iZXIgPSBwYXJzZUludChudW1iZXIsIDEwKTtcbiAgICBudW1iZXIgPSBpc05hTihudW1iZXIpID8gMCA6IG51bWJlcjtcbiAgICB2YXIgc2lnbiA9IG51bWJlciA8IDAgPyBcIi1cIiA6IFwiXCI7XG4gICAgbnVtYmVyID0gTWF0aC5hYnMobnVtYmVyKTtcbiAgICB2YXIgdGVucyA9IG51bWJlciAlIDEwMDtcblxuICAgIHJldHVybiBzaWduICsgbnVtYmVyICsgKHRlbnMgPiA0ICYmIHRlbnMgPCAyMSA/IFwidGhcIiA6IHsgMTogXCJzdFwiLCAyOiBcIm5kXCIsIDM6IFwicmRcIiB9W251bWJlciAlIDEwXSB8fCBcInRoXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBvcmRpbmFsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBwYWQgPSBmdW5jdGlvbiAoc3RyLCBjb3VudCwgcGFkQ2hhciwgdHlwZSkge1xuICAgIHN0ciArPSBcIlwiOyAvLyBFbnN1cmUgc3RyaW5nXG5cbiAgICBpZiAoIXBhZENoYXIpIHtcbiAgICAgICAgcGFkQ2hhciA9IFwiIFwiO1xuICAgIH0gZWxzZSBpZiAoMSA8IHBhZENoYXIubGVuZ3RoKSB7XG4gICAgICAgIHBhZENoYXIgPSBwYWRDaGFyLmNoYXJBdCgwKTtcbiAgICB9XG5cbiAgICB0eXBlID0gbnVsbCA9PSB0eXBlID8gXCJsZWZ0XCIgOiBcInJpZ2h0XCI7XG5cbiAgICBpZiAoXCJyaWdodFwiID09PSB0eXBlKSB7XG4gICAgICAgIHdoaWxlIChjb3VudCA+IHN0ci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN0ciArPSBwYWRDaGFyO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGVmYXVsdCB0byBsZWZ0XG4gICAgICAgIHdoaWxlIChjb3VudCA+IHN0ci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN0ciA9IHBhZENoYXIgKyBzdHI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYWQ7XG4iLCIvKipcbiAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50aW5nIGhvdyBtYW55IHNlY29uZHMsIG1pbnV0ZXMgb3IgaG91cnMgYWdvIGl0IHdhcyBvciB3aWxsIGJlIGluIHRoZSBmdXR1cmVcbiAqIFdpbGwgYWx3YXlzIHJldHVybiBhIHJlbGF0aXZlIHRpbWUsIG1vc3QgZ3JhbnVsYXIgb2Ygc2Vjb25kcyB0byBsZWFzdCBncmFudWxhciBvZiB5ZWFycy4gU2VlIHVuaXQgdGVzdHMgZm9yIG1vcmUgZGV0YWlsc1xuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHRpbWUgPSByZXF1aXJlKFwiLi90aW1lXCIpLFxuICAgIGRhdGUgPSByZXF1aXJlKFwiLi9kYXRlXCIpO1xuXG52YXIgcmVsYXRpdmVUaW1lID0gZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuICAgIHRpbWVzdGFtcCA9IG51bGwgPT0gdGltZXN0YW1wID8gdGltZSgpIDogdGltZXN0YW1wO1xuXG4gICAgdmFyIGN1cnJUaW1lID0gdGltZSgpLFxuICAgICAgICB0aW1lRGlmZiA9IGN1cnJUaW1lIC0gdGltZXN0YW1wO1xuXG4gICAgLy8gd2l0aGluIDIgc2Vjb25kc1xuICAgIGlmICgyID4gdGltZURpZmYgJiYgLTIgPCB0aW1lRGlmZikge1xuICAgICAgICByZXR1cm4gKDAgPD0gdGltZURpZmYgPyBcImp1c3QgXCIgOiBcIlwiKSArIFwibm93XCI7XG4gICAgfVxuXG4gICAgLy8gd2l0aGluIGEgbWludXRlXG4gICAgaWYgKDYwID4gdGltZURpZmYgJiYgLTYwIDwgdGltZURpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0gdGltZURpZmYgPyBNYXRoLmZsb29yKHRpbWVEaWZmKSArIFwiIHNlY29uZHMgYWdvXCIgOiBcImluIFwiICsgTWF0aC5mbG9vcigtdGltZURpZmYpICsgXCIgc2Vjb25kc1wiO1xuICAgIH1cblxuICAgIC8vIHdpdGhpbiAyIG1pbnV0ZXNcbiAgICBpZiAoMTIwID4gdGltZURpZmYgJiYgLTEyMCA8IHRpbWVEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IHRpbWVEaWZmID8gXCJhYm91dCBhIG1pbnV0ZSBhZ29cIiA6IFwiaW4gYWJvdXQgYSBtaW51dGVcIjtcbiAgICB9XG5cbiAgICAvLyB3aXRoaW4gYW4gaG91clxuICAgIGlmICgzNjAwID4gdGltZURpZmYgJiYgLTM2MDAgPCB0aW1lRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSB0aW1lRGlmZiA/IE1hdGguZmxvb3IodGltZURpZmYgLyA2MCkgKyBcIiBtaW51dGVzIGFnb1wiIDogXCJpbiBcIiArIE1hdGguZmxvb3IoLXRpbWVEaWZmIC8gNjApICsgXCIgbWludXRlc1wiO1xuICAgIH1cblxuICAgIC8vIHdpdGhpbiAyIGhvdXJzXG4gICAgaWYgKDcyMDAgPiB0aW1lRGlmZiAmJiAtNzIwMCA8IHRpbWVEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IHRpbWVEaWZmID8gXCJhYm91dCBhbiBob3VyIGFnb1wiIDogXCJpbiBhYm91dCBhbiBob3VyXCI7XG4gICAgfVxuXG4gICAgLy8gd2l0aGluIDI0IGhvdXJzXG4gICAgaWYgKDg2NDAwID4gdGltZURpZmYgJiYgLTg2NDAwIDwgdGltZURpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0gdGltZURpZmYgPyBNYXRoLmZsb29yKHRpbWVEaWZmIC8gMzYwMCkgKyBcIiBob3VycyBhZ29cIiA6IFwiaW4gXCIgKyBNYXRoLmZsb29yKHRpbWVEaWZmIC8gMzYwMCkgKyBcIiBob3Vyc1wiO1xuICAgIH1cblxuICAgIC8vIHdpdGhpbiAyIGRheXNcbiAgICB2YXIgZGF5czIgPSAyICogODY0MDA7XG4gICAgaWYgKGRheXMyID4gdGltZURpZmYgJiYgLWRheXMyIDwgdGltZURpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0gdGltZURpZmYgPyBNYXRoLmZsb29yKHRpbWVEaWZmIC8gODY0MDApICsgXCIgZGF5cyBhZ29cIiA6IFwiaW4gXCIgKyBNYXRoLmZsb29yKC10aW1lRGlmZiAvIDg2NDAwKSArIFwiIGRheXNcIjtcbiAgICB9XG5cbiAgICAvLyB3aXRoaW4gNjAgZGF5c1xuICAgIHZhciBkYXlzNjAgPSA2MCAqIDg2NDAwO1xuICAgIGlmIChkYXlzNjAgPiB0aW1lRGlmZiAmJiAtZGF5czYwIDwgdGltZURpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0gdGltZURpZmYgPyBcImFib3V0IGEgbW9udGggYWdvXCIgOiBcImluIGFib3V0IGEgbW9udGhcIjtcbiAgICB9XG5cbiAgICB2YXIgY3VyclRpbWVZZWFycyA9IHBhcnNlSW50KGRhdGUoXCJZXCIsIGN1cnJUaW1lKSwgMTApLFxuICAgICAgICB0aW1lc3RhbXBZZWFycyA9IHBhcnNlSW50KGRhdGUoXCJZXCIsIHRpbWVzdGFtcCksIDEwKSxcbiAgICAgICAgY3VyclRpbWVNb250aHMgPSBjdXJyVGltZVllYXJzICogMTIgKyBwYXJzZUludChkYXRlKFwiblwiLCBjdXJyVGltZSksIDEwKSxcbiAgICAgICAgdGltZXN0YW1wTW9udGhzID0gdGltZXN0YW1wWWVhcnMgKiAxMiArIHBhcnNlSW50KGRhdGUoXCJuXCIsIHRpbWVzdGFtcCksIDEwKTtcblxuICAgIC8vIHdpdGhpbiBhIHllYXJcbiAgICB2YXIgbW9udGhEaWZmID0gY3VyclRpbWVNb250aHMgLSB0aW1lc3RhbXBNb250aHM7XG4gICAgaWYgKDEyID4gbW9udGhEaWZmICYmIC0xMiA8IG1vbnRoRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSBtb250aERpZmYgPyBtb250aERpZmYgKyBcIiBtb250aHMgYWdvXCIgOiBcImluIFwiICsgKC1tb250aERpZmYpICsgXCIgbW9udGhzXCI7XG4gICAgfVxuXG4gICAgdmFyIHllYXJEaWZmID0gY3VyclRpbWVZZWFycyAtIHRpbWVzdGFtcFllYXJzO1xuICAgIGlmICgyID4geWVhckRpZmYgJiYgLTIgPCB5ZWFyRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSB5ZWFyRGlmZiA/IFwiYSB5ZWFyIGFnb1wiIDogXCJpbiBhIHllYXJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gMCA8PSB5ZWFyRGlmZiA/IHllYXJEaWZmICsgXCIgeWVhcnMgYWdvXCIgOiBcImluIFwiICsgKC15ZWFyRGlmZikgKyBcIiB5ZWFyc1wiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZWxhdGl2ZVRpbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChudWxsICE9IERhdGUubm93ID8gRGF0ZS5ub3coKSA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSAvIDEwMDA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRpbWU7XG4iLCIvKipcbiAqIFRydW5jYXRlcyBhIHN0cmluZyBpZiBpdCBpcyBsb25nZXIgdGhhbiB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBjaGFyYWN0ZXJzLlxuICogVHJ1bmNhdGVkIHN0cmluZ3Mgd2lsbCBlbmQgd2l0aCBhIHRyYW5zbGF0YWJsZSBlbGxpcHNpcyBzZXF1ZW5jZSAoXCLigKZcIikuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgdHJ1bmNhdGVjaGFycyA9IGZ1bmN0aW9uIChzdHJpbmcsIGxlbmd0aCkge1xuICAgIGlmIChzdHJpbmcubGVuZ3RoIDw9IGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmcuc3Vic3RyKDAsIGxlbmd0aCkgKyBcIuKAplwiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0cnVuY2F0ZWNoYXJzO1xuIiwiLyoqXG4gKiBUcnVuY2F0ZXMgYSBzdHJpbmcgYWZ0ZXIgYSBjZXJ0YWluIG51bWJlciBvZiB3b3Jkcy5cbiAqIE5ld2xpbmVzIHdpdGhpbiB0aGUgc3RyaW5nIHdpbGwgYmUgcmVtb3ZlZC5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB0cnVuY2F0ZXdvcmRzID0gZnVuY3Rpb24gKHN0cmluZywgbnVtV29yZHMpIHtcbiAgICB2YXIgd29yZHMgPSBzdHJpbmcuc3BsaXQoJyAnKTtcblxuICAgIGlmICh3b3Jkcy5sZW5ndGggPCBudW1Xb3Jkcykge1xuICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH1cblxuICAgIHJldHVybiB3b3Jkcy5zbGljZSgwLCBudW1Xb3Jkcykuam9pbignICcpICsgXCLigKZcIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdHJ1bmNhdGV3b3JkcztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjbG9zZXN0OiByZXF1aXJlKFwiLi9jbG9zZXN0XCIpLFxuICAgIGRlYm91bmNlOiByZXF1aXJlKFwiLi9kZWJvdW5jZVwiKSxcbiAgICBmb3JFYWNoOiByZXF1aXJlKFwiLi9mb3JFYWNoXCIpLFxuICAgIGdldEZsb2F0OiByZXF1aXJlKFwiLi9nZXRGbG9hdFwiKSxcbiAgICBnZXRJbnQ6IHJlcXVpcmUoXCIuL2dldEludFwiKSxcbiAgICBodW1hbml6ZTogcmVxdWlyZShcIi4vaHVtYW5pemVcIiksXG4gICAgbG9nOiByZXF1aXJlKFwiLi9sb2dcIiksXG4gICAgcmFmOiByZXF1aXJlKFwiLi9yYWZcIiksXG4gICAgdHlwZTogcmVxdWlyZShcIi4vdHlwZVwiKVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gICAgbG9nLmhpc3RvcnkucHVzaChhcmd1bWVudHMpO1xuICAgIGNvbnNvbGUubG9nKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xufVxuXG5sb2cuaGlzdG9yeSA9IFtdO1xuXG5sb2cuZGJnID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHN0ciA9IFwiREVCVUc6IFwiICsgc3RyO1xuICAgIGxvZy5oaXN0b3J5LnB1c2goc3RyKTtcbiAgICBjb25zb2xlLmRlYnVnKHN0cik7XG59O1xuXG5sb2cuZXJyID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGxvZy5oaXN0b3J5LnB1c2goXCJFUlJPUjogXCIgKyBzdHIpO1xuICAgIGNvbnNvbGUuZXJyb3Ioc3RyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbG9nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBuYXRpdmVSYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUsXG4gICAgbGFzdFRpbWUgPSAwO1xuXG52YXIgcmFmID0gbmF0aXZlUmFmIHx8IGZ1bmN0aW9uIChmbikge1xuICAgIHZhciBjdXJyVGltZSA9IERhdGUubm93KCksXG4gICAgICAgIHRpbWVEZWxheSA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZURlbGF5O1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmbihEYXRlLm5vdygpKTtcbiAgICB9LCB0aW1lRGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByYWY7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9fdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGNsYXNzVG9UeXBlID0ge30sXG4gICAgbmFtZXMgPSAoXCJCb29sZWFufE51bWJlcnxTdHJpbmd8RnVuY3Rpb258QXJyYXl8RGF0ZXxSZWdFeHB8VW5kZWZpbmVkfE51bGxcIikuc3BsaXQoXCJ8XCIpLFxuICAgIG47XG5cbmZvciAobiBpbiBuYW1lcykge1xuICAgIGlmIChuYW1lcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBjbGFzc1RvVHlwZVtcIltvYmplY3QgXCIgKyBuYW1lICsgXCJdXCJdID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdHlwZShvYmopIHtcbiAgICB2YXIgc3RyVHlwZSA9IF9fdG9TdHJpbmcuY2FsbChvYmopO1xuICAgIHJldHVybiBjbGFzc1RvVHlwZVtzdHJUeXBlXSB8fCBcIm9iamVjdFwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGU7XG4iXX0=
(20)
});
