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
/**
 * Adds `preventDefault`, `stopPropagation`, `addEventListener`
 * and `removeEventListener` in IE 8
 * TODO: Find a way to add for older browsers as well
 */
"use strict";

var Event = window.Event,
    HTMLDocument = window.HTMLDocument,
    Window = window.Window;

if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault = function () {
        this.returnValue = false;
    };
}

if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation = function () {
        this.cancelBubble = true;
    };
}

if (!Element.prototype.addEventListener) {
    var eventListeners = [],
        add, remove;

    add = function(type, listener /*, useCapture (will be ignored) */) {
        var self = this;
        var wrapper = function (e) {
            e.target = e.srcElement;
            e.currentTarget = self;
            if (listener.handleEvent) {
                listener.handleEvent(e);
            } else {
                listener.call(self, e);
            }
        };

        if ("DOMContentLoaded" === type) {
            var wrapper2 = function (e) {
                if ("complete" === document.readyState) {
                    wrapper(e);
                }
            };

            document.attachEvent("onreadystatechange", wrapper2);
            eventListeners.push({
                object: this,
                type: type,
                listener: listener,
                wrapper: wrapper2
            });

            if ("complete" === document.readyState) {
                var e = new Event();
                e.srcElement = window;
                wrapper2(e);
            }
        } else {
            this.attachEvent("on" + type, wrapper);
            eventListeners.push({
                object: this,
                type: type,
                listener: listener,
                wrapper: wrapper
            });
        }
    };

    remove = function (type,listener /*, useCapture (will be ignored) */) {
        eventListeners.some(function (eventListener) {
            if (this === eventListener.object && eventListener.type === type && eventListener.listener === listener) {
                if ("DOMContentLoaded" === type) {
                    this.detachEvent("onreadystatechange", eventListener.wrapper);
                } else {
                    this.detachEvent("on" + type, eventListener.wrapper);
                }
                return true;
            }

            return false;
        });
    };

    Element.prototype.addEventListener = add;
    Element.prototype.removeEventListener = remove;

    if (HTMLDocument) {
        HTMLDocument.prototype.addEventListener = add;
        HTMLDocument.prototype.removeEventListener = remove;
    }

    if (Window) {
        Window.prototype.addEventListener = add;
        Window.prototype.removeEventListener = remove;
    }
}

},{}],4:[function(_dereq_,module,exports){
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

},{"./type":24}],5:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
"use strict";

var getFloat = _dereq_("./getFloat");

function getInt(input, abs) {
    return parseInt(getFloat(input, abs), 10);
}

module.exports = parseInt;

},{"./getFloat":5}],7:[function(_dereq_,module,exports){
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

},{"./pad":16}],8:[function(_dereq_,module,exports){
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

},{"./intword":10}],9:[function(_dereq_,module,exports){
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

},{"./date":7,"./filesize":8,"./intword":10,"./linebreaks":11,"./naturalDay":12,"./nl2br":13,"./numberFormat":14,"./ordinal":15,"./pad":16,"./relativeTime":17,"./time":18,"./truncatechars":19,"./truncatewords":20}],10:[function(_dereq_,module,exports){
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

},{"./numberFormat":14}],11:[function(_dereq_,module,exports){
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

},{}],12:[function(_dereq_,module,exports){
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

},{"./date":7,"./time":18}],13:[function(_dereq_,module,exports){
/**
 * Converts all newlines in a piece of plain text to HTML line breaks (<br />).
 */
"use strict";

var nl2br = function (str) {
    return str.replace(/(\r\n|\n|\r)/g, "<br/>");
};

module.exports = nl2br;

},{}],14:[function(_dereq_,module,exports){
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

},{}],15:[function(_dereq_,module,exports){
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

},{}],16:[function(_dereq_,module,exports){
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

},{}],17:[function(_dereq_,module,exports){
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

},{"./date":7,"./time":18}],18:[function(_dereq_,module,exports){
"use strict";

var time = function () {
    return (null != Date.now ? Date.now() : new Date().getTime()) / 1000;
};

module.exports = time;

},{}],19:[function(_dereq_,module,exports){
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

},{}],20:[function(_dereq_,module,exports){
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

},{}],21:[function(_dereq_,module,exports){
"use strict";

_dereq_("./events");

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

},{"./closest":1,"./debounce":2,"./events":3,"./forEach":4,"./getFloat":5,"./getInt":6,"./humanize":9,"./log":22,"./raf":23,"./type":24}],22:[function(_dereq_,module,exports){
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

},{}],23:[function(_dereq_,module,exports){
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

},{}],24:[function(_dereq_,module,exports){
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

},{}]},{},[21])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvY2xvc2VzdC5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvZGVib3VuY2UuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2V2ZW50cy5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvZm9yRWFjaC5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvZ2V0RmxvYXQuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2dldEludC5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvZGF0ZS5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvZmlsZXNpemUuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2h1bWFuaXplL2luZGV4LmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9odW1hbml6ZS9pbnR3b3JkLmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9odW1hbml6ZS9saW5lYnJlYWtzLmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9odW1hbml6ZS9uYXR1cmFsRGF5LmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9odW1hbml6ZS9ubDJici5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvbnVtYmVyRm9ybWF0LmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9odW1hbml6ZS9vcmRpbmFsLmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy9odW1hbml6ZS9wYWQuanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2h1bWFuaXplL3JlbGF0aXZlVGltZS5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvdGltZS5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvdHJ1bmNhdGVjaGFycy5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaHVtYW5pemUvdHJ1bmNhdGV3b3Jkcy5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvaW5kZXguanMiLCIvVXNlcnMvbmlja3MvUHJvamVjdHMvdXRpbHMvc3JjL2xvZy5qcyIsIi9Vc2Vycy9uaWNrcy9Qcm9qZWN0cy91dGlscy9zcmMvcmFmLmpzIiwiL1VzZXJzL25pY2tzL1Byb2plY3RzL3V0aWxzL3NyYy90eXBlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9fc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGNsb3Nlc3Qobm9kZSwgc2VhcmNoKSB7XG4gICAgdmFyIG1hdGNoZXMgPSBbXSxcbiAgICAgICAgaGl0cyA9IF9fc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlYXJjaCkpO1xuXG4gICAgd2hpbGUgKG51bGwgIT0gbm9kZSkge1xuICAgICAgICBpZiAoMCA8PSBoaXRzLmluZGV4T2Yobm9kZSkpIHtcbiAgICAgICAgICAgIG1hdGNoZXMucHVzaChub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvc2VzdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgaWYgKG51bGwgPT0gaW1tZWRpYXRlKSB7XG4gICAgICAgIGltbWVkaWF0ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHdhaXQpO1xuXG4gICAgICAgIGlmIChpbW1lZGlhdGUgJiYgIXRpbWVvdXQpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKlxuICogQWRkcyBgcHJldmVudERlZmF1bHRgLCBgc3RvcFByb3BhZ2F0aW9uYCwgYGFkZEV2ZW50TGlzdGVuZXJgXG4gKiBhbmQgYHJlbW92ZUV2ZW50TGlzdGVuZXJgIGluIElFIDhcbiAqIFRPRE86IEZpbmQgYSB3YXkgdG8gYWRkIGZvciBvbGRlciBicm93c2VycyBhcyB3ZWxsXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgRXZlbnQgPSB3aW5kb3cuRXZlbnQsXG4gICAgSFRNTERvY3VtZW50ID0gd2luZG93LkhUTUxEb2N1bWVudCxcbiAgICBXaW5kb3cgPSB3aW5kb3cuV2luZG93O1xuXG5pZiAoIUV2ZW50LnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgIEV2ZW50LnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgIH07XG59XG5cbmlmICghRXZlbnQucHJvdG90eXBlLnN0b3BQcm9wYWdhdGlvbikge1xuICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICB9O1xufVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB2YXIgZXZlbnRMaXN0ZW5lcnMgPSBbXSxcbiAgICAgICAgYWRkLCByZW1vdmU7XG5cbiAgICBhZGQgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lciAvKiwgdXNlQ2FwdHVyZSAod2lsbCBiZSBpZ25vcmVkKSAqLykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciB3cmFwcGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUudGFyZ2V0ID0gZS5zcmNFbGVtZW50O1xuICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gc2VsZjtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lci5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLmhhbmRsZUV2ZW50KGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5jYWxsKHNlbGYsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChcIkRPTUNvbnRlbnRMb2FkZWRcIiA9PT0gdHlwZSkge1xuICAgICAgICAgICAgdmFyIHdyYXBwZXIyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJjb21wbGV0ZVwiID09PSBkb2N1bWVudC5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiwgd3JhcHBlcjIpO1xuICAgICAgICAgICAgZXZlbnRMaXN0ZW5lcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgb2JqZWN0OiB0aGlzLFxuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgIHdyYXBwZXI6IHdyYXBwZXIyXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKFwiY29tcGxldGVcIiA9PT0gZG9jdW1lbnQucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEV2ZW50KCk7XG4gICAgICAgICAgICAgICAgZS5zcmNFbGVtZW50ID0gd2luZG93O1xuICAgICAgICAgICAgICAgIHdyYXBwZXIyKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCB3cmFwcGVyKTtcbiAgICAgICAgICAgIGV2ZW50TGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIG9iamVjdDogdGhpcyxcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgICB3cmFwcGVyOiB3cmFwcGVyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZW1vdmUgPSBmdW5jdGlvbiAodHlwZSxsaXN0ZW5lciAvKiwgdXNlQ2FwdHVyZSAod2lsbCBiZSBpZ25vcmVkKSAqLykge1xuICAgICAgICBldmVudExpc3RlbmVycy5zb21lKGZ1bmN0aW9uIChldmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gZXZlbnRMaXN0ZW5lci5vYmplY3QgJiYgZXZlbnRMaXN0ZW5lci50eXBlID09PSB0eXBlICYmIGV2ZW50TGlzdGVuZXIubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKFwiRE9NQ29udGVudExvYWRlZFwiID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiwgZXZlbnRMaXN0ZW5lci53cmFwcGVyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGV2ZW50TGlzdGVuZXIud3JhcHBlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBFbGVtZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gYWRkO1xuICAgIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSByZW1vdmU7XG5cbiAgICBpZiAoSFRNTERvY3VtZW50KSB7XG4gICAgICAgIEhUTUxEb2N1bWVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGFkZDtcbiAgICAgICAgSFRNTERvY3VtZW50LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gcmVtb3ZlO1xuICAgIH1cblxuICAgIGlmIChXaW5kb3cpIHtcbiAgICAgICAgV2luZG93LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gYWRkO1xuICAgICAgICBXaW5kb3cucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSByZW1vdmU7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB0eXBlID0gcmVxdWlyZShcIi4vdHlwZVwiKTtcblxudmFyIF9faGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgZm4sIGNvbnRleHQpIHtcbiAgICBmbiA9IFwiZnVuY3Rpb25cIiA9PT0gdHlwZShmbikgPyBmbiA6IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgaWYgKFwib2JqZWN0XCIgPT09IHR5cGUoY29sbGVjdGlvbikpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoX19oYXNQcm9wLmNhbGwoY29sbGVjdGlvbiwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGNvbnRleHQsIGNvbGxlY3Rpb25bcHJvcF0sIHByb3AsIGNvbGxlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvbGxlY3Rpb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGZuLmNhbGwoY29udGV4dCwgY29sbGVjdGlvbltpXSwgaSwgY29sbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBnZXRGbG9hdChpbnB1dCwgYWJzKSB7XG4gICAgaWYgKG51bGwgPT0gYWJzKSB7XG4gICAgICAgIGFicyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB2YWwgPSAoaW5wdXQgKyBcIlwiKS5yZXBsYWNlKC9cXHMrLywgXCJcIikucmVwbGFjZShcIixcIiwgXCIuXCIpO1xuICAgIHZhbCA9IHBhcnNlRmxvYXQodmFsKTtcblxuICAgIGlmIChhYnMpIHtcbiAgICAgICAgdmFsID0gTWF0aC5hYnModmFsKTtcbiAgICB9XG5cbiAgICBpZiAoaXNOYU4odmFsKSkge1xuICAgICAgICB2YWwgPSAwO1xuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RmxvYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGdldEZsb2F0ID0gcmVxdWlyZShcIi4vZ2V0RmxvYXRcIik7XG5cbmZ1bmN0aW9uIGdldEludChpbnB1dCwgYWJzKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGdldEZsb2F0KGlucHV0LCBhYnMpLCAxMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VJbnQ7XG4iLCIvKipcbiAqIFBIUC1pbnNwaXJlZCBkYXRlXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgcGFkID0gcmVxdWlyZShcIi4vcGFkXCIpO1xuXG52YXIgZGF5VGFibGVDb21tb24gPSBbIDAsIDAsIDMxLCA1OSwgOTAsIDEyMCwgMTUxLCAxODEsIDIxMiwgMjQzLCAyNzMsIDMwNCwgMzM0IF0sXG4gICAgZGF5VGFibGVMZWFwID0gWyAwLCAwLCAzMSwgNjAsIDkxLCAxMjEsIDE1MiwgMTgyLCAyMTMsIDI0NCwgMjc0LCAzMDUsIDMzNSBdLFxuICAgIHNob3J0RGF5VHh0ID0gW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXG4gICAgbW9udGhUeHQgPSBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXTtcblxudmFyIGRhdGUgPSBmdW5jdGlvbiAoZm9ybWF0LCB0aW1lc3RhbXApIHtcbiAgICB2YXIganNkYXRlID0gKG51bGwgPT0gdGltZXN0YW1wID8gbmV3IERhdGUoKSA6IC8vIFRpbWVzdGFtcCBub3QgcHJvdmlkZWRcbiAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCBpbnN0YW5jZW9mIERhdGUgPyBuZXcgRGF0ZSh0aW1lc3RhbXApIDogLy8gSlMgRGF0ZSgpXG4gICAgICAgICAgICAgICAgICBuZXcgRGF0ZSh0aW1lc3RhbXAgKiAxMDAwKSksIC8vIFVOSVggdGltZXN0YW1wIChhdXRvLWNvbnZlcnQgdG8gaW50KVxuICAgICAgICBmb3JtYXRDaHIgPSAvXFxcXD8oW2Etel0pL2dpLFxuICAgICAgICBmb3JtYXRDaHJDYiA9IGZ1bmN0aW9uICh0LCBzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbCAhPSBmW3RdID8gZlt0XSgpIDogcztcbiAgICAgICAgfTtcblxuICAgIHZhciBmID0ge1xuICAgICAgICAvKiBEYXkgKi9cbiAgICAgICAgLy8gRGF5IG9mIG1vbnRoIHcvbGVhZGluZyAwOyAwMS4uLjMxXG4gICAgICAgIGQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBhZChmLmooKSwgMiwgXCIwXCIpOyB9LFxuXG4gICAgICAgIC8vIFNob3J0aGFuZCBkYXkgbmFtZTsgTW9uLi5TdW5cbiAgICAgICAgRDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZi5sKCkuc2xpY2UoMCwgMyk7IH0sXG5cbiAgICAgICAgLy8gRGF5IG9mIG1vbnRoOyAxLi4zMVxuICAgICAgICBqOiBmdW5jdGlvbiAoKSB7IHJldHVybiBqc2RhdGUuZ2V0RGF0ZSgpOyB9LFxuXG4gICAgICAgIC8vIEZ1bGwgZGF5IG5hbWU7IE1vbmRheS4uU3VuZGF5XG4gICAgICAgIGw6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNob3J0RGF5VHh0W2YudygpXTsgfSxcblxuICAgICAgICAvLyBJU08tODYwMSBkYXkgb2Ygd2VlazsgMVtNb25dLi43W1N1bl1cbiAgICAgICAgTjogZnVuY3Rpb24gKCkgeyByZXR1cm4gZi53KCkgfHwgNzsgfSxcblxuICAgICAgICAvLyBPcmRpbmFsIHN1ZmZpeCBmb3IgZGF5IG9mIG1vbnRoOyBzdCwgbmQsIHJkLCB0aFxuICAgICAgICBTOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaiA9IGYuaigpO1xuICAgICAgICAgICAgcmV0dXJuIDQgPCBqICYmIDIxID4gaiA/IFwidGhcIiA6IHsgMTogXCJzdFwiLCAyOiBcIm5kXCIsIDM6IFwicmRcIiB9W2ogJSAxMF0gfHwgXCJ0aFwiO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIERheSBvZiB3ZWVrOyAwW1N1bl0uLjZbU2F0XVxuICAgICAgICB3OiBmdW5jdGlvbiAoKSB7IHJldHVybiBqc2RhdGUuZ2V0RGF5KCk7IH0sXG5cbiAgICAgICAgLy8gRGF5IG9mIHllYXI7IDAuLjM2NVxuICAgICAgICB6OiBmdW5jdGlvbiAoKSB7IHJldHVybiAoZi5MKCkgPyBkYXlUYWJsZUxlYXBbZi5uKCldIDogZGF5VGFibGVDb21tb25bZi5uKCldKSArIGYuaigpIC0gMTsgfSxcblxuICAgICAgICAvKiBXZWVrICovXG4gICAgICAgIC8vIElTTy04NjAxIHdlZWsgbnVtYmVyXG4gICAgICAgIFc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGRheXMgYmV0d2VlbiBtaWR3ZWVrIG9mIHRoaXMgd2VlayBhbmQgamFuIDRcbiAgICAgICAgICAgIC8vIChmLnooKSAtIGYuTigpICsgMSArIDMuNSkgLSAzXG4gICAgICAgICAgICB2YXIgbWlkV2Vla0RheXNGcm9tSmFuNCA9IGYueigpIC0gZi5OKCkgKyAxLjU7XG4gICAgICAgICAgICAvLyAxICsgbnVtYmVyIG9mIHdlZWtzICsgcm91bmRlZCB3ZWVrXG4gICAgICAgICAgICByZXR1cm4gcGFkKDEgKyBNYXRoLmZsb29yKE1hdGguYWJzKG1pZFdlZWtEYXlzRnJvbUphbjQpIC8gNykgKyAoMy41IDwgbWlkV2Vla0RheXNGcm9tSmFuNCAlIDcgPyAxIDogMCksIDIsIFwiMFwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBNb250aCAqL1xuICAgICAgICAvLyBGdWxsIG1vbnRoIG5hbWU7IEphbnVhcnkuLi5EZWNlbWJlclxuICAgICAgICBGOiBmdW5jdGlvbiAoKSB7IHJldHVybiBtb250aFR4dFtqc2RhdGUuZ2V0TW9udGgoKV07IH0sXG5cbiAgICAgICAgLy8gTW9udGggdy9sZWFkaW5nIDA7IDAxLi4xMlxuICAgICAgICBtOiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYWQoZi5uKCksIDIsIFwiMFwiKTsgfSxcblxuICAgICAgICAvLyBTaG9ydGhhbmQgbW9udGggbmFtZTsgSmFuLi5EZWNcbiAgICAgICAgTTogZnVuY3Rpb24gKCkgeyByZXR1cm4gZi5GKCkuc2xpY2UoMCwgMyk7IH0sXG5cbiAgICAgICAgLy8gTW9udGg7IDEuLi4xMlxuICAgICAgICBuOiBmdW5jdGlvbiAoKSB7IHJldHVybiBqc2RhdGUuZ2V0TW9udGgoKSArIDE7IH0sXG5cbiAgICAgICAgLy8gRGF5cyBpbiBtb250aDsgMjguLjMxXG4gICAgICAgIHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBEYXRlKGYuWSgpLCBmLm4oKSwgMCkuZ2V0RGF0ZSgpOyB9LFxuXG4gICAgICAgIC8qIFllYXIgKi9cbiAgICAgICAgLy8gSXMgbGVhcCB5ZWFyPzsgMCBvciAxXG4gICAgICAgIEw6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDEgPT09IG5ldyBEYXRlKGYuWSgpLCAxLCAyOSkuZ2V0TW9udGgoKSA/IDEgOiAwOyB9LFxuXG4gICAgICAgIC8vIElTTy04NjAxIHllYXJcbiAgICAgICAgbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG4gPSBmLm4oKSxcbiAgICAgICAgICAgICAgICBXID0gZi5XKCk7XG4gICAgICAgICAgICByZXR1cm4gZi5ZKCkgKyAoMTIgPT09IG4gJiYgOSA+IFcgPyAtMSA6IDEgPT09IG4gJiYgOSA8IFcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEZ1bGwgeWVhcjsgZS5nLiAxOTgwLi4yMDEwXG4gICAgICAgIFk6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGpzZGF0ZS5nZXRGdWxsWWVhcigpOyB9LFxuXG4gICAgICAgIC8vIExhc3QgdHdvIGRpZ2l0cyBvZiB5ZWFyOyAwMC4uOTlcbiAgICAgICAgeTogZnVuY3Rpb24gKCkgeyByZXR1cm4gU3RyaW5nKGYuWSgpKS5zbGljZSgtMik7IH0sXG5cbiAgICAgICAgLyogVGltZSAqL1xuICAgICAgICAvLyBhbSBvciBwbVxuICAgICAgICBhOiBmdW5jdGlvbiAoKSB7IHJldHVybiBqc2RhdGUuZ2V0SG91cnMoKSA+IDExID8gXCJwbVwiIDogXCJhbVwiOyB9LFxuXG4gICAgICAgIC8vIEFNIG9yIFBNXG4gICAgICAgIEE6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGYuYSgpLnRvVXBwZXJDYXNlKCk7IH0sXG5cbiAgICAgICAgLy8gU3dhdGNoIEludGVybmV0IHRpbWU7IDAwMC4uLjk5OVxuICAgICAgICBCOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdW5peFRpbWUgPSBqc2RhdGUuZ2V0VGltZSgpIC8gMTAwMCxcbiAgICAgICAgICAgICAgICBzZWNvbmRzUGFzc2VkVG9kYXkgPSB1bml4VGltZSAlIDg2NDAwICsgMzYwMDsgLy8gc2luY2UgaXRcInMgYmFzZWQgb2ZmIG9mIFVUQysxXG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzUGFzc2VkVG9kYXkgPCAwKSB7XG4gICAgICAgICAgICAgICAgc2Vjb25kc1Bhc3NlZFRvZGF5ICs9IDg2NDAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYmVhdHMgPSAoKHNlY29uZHNQYXNzZWRUb2RheSkgLyA4Ni40KSAlIDEwMDA7XG5cbiAgICAgICAgICAgIGlmICh1bml4VGltZSA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGJlYXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKGJlYXRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAxMi1Ib3VyczsgMS4uLjEyXG4gICAgICAgIGc6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGYuRygpICUgMTIgfHwgMTI7IH0sXG5cbiAgICAgICAgLy8gMjQtSG91cnM7IDAuLi4yM1xuICAgICAgICBHOiBmdW5jdGlvbiAoKSB7IHJldHVybiBqc2RhdGUuZ2V0SG91cnMoKTsgfSxcblxuICAgICAgICAvLyAxMi1Ib3VycyB3L2xlYWRpbmcgMDsgMDEuLi4xMlxuICAgICAgICBoOiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYWQoZi5nKCksIDIsIFwiMFwiKTsgfSxcblxuICAgICAgICAvLyAyNC1Ib3VycyB3L2xlYWRpbmcgMDsgMDAuLi4yM1xuICAgICAgICBIOiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYWQoZi5HKCksIDIsIFwiMFwiKTsgfSxcblxuICAgICAgICAvLyBNaW51dGVzIHcvbGVhZGluZyAwOyAwMC4uLjU5XG4gICAgICAgIGk6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBhZChqc2RhdGUuZ2V0TWludXRlcygpLCAyLCBcIjBcIik7IH0sXG5cbiAgICAgICAgLy8gU2Vjb25kcyB3L2xlYWRpbmcgMDsgMDAuLi41OVxuICAgICAgICBzOiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYWQoanNkYXRlLmdldFNlY29uZHMoKSwgMiwgXCIwXCIpOyB9LFxuXG4gICAgICAgIC8vIE1pY3Jvc2Vjb25kczsgMDAwMDAwLTk5OTAwMFxuICAgICAgICB1OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYWQoanNkYXRlLmdldE1pbGxpc2Vjb25kcygpICogMTAwMCwgNiwgXCIwXCIpOyB9LFxuXG4gICAgICAgIC8vIFdoZXRoZXIgb3Igbm90IHRoZSBkYXRlIGlzIGluIGRheWxpZ2h0IHNhdmluZ3MgdGltZVxuICAgICAgICAvKlxuICAgICAgICBJOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBDb21wYXJlcyBKYW4gMSBtaW51cyBKYW4gMSBVVEMgdG8gSnVsIDEgbWludXMgSnVsIDEgVVRDLlxuICAgICAgICAgICAgLy8gSWYgdGhleSBhcmUgbm90IGVxdWFsLCB0aGVuIERTVCBpcyBvYnNlcnZlZC5cbiAgICAgICAgICAgIHZhciBZID0gZi5ZKCk7XG4gICAgICAgICAgICByZXR1cm4gMCArIChuZXcgRGF0ZShZLCAwKSAtIERhdGUuVVRDKFksIDApKSAhPT0gKG5ldyBEYXRlKFksIDYpIC0gRGF0ZS5VVEMoWSwgNikpO1xuICAgICAgICB9LFxuICAgICAgICAqL1xuXG4gICAgICAgIC8vIERpZmZlcmVuY2UgdG8gR01UIGluIGhvdXIgZm9ybWF0OyBlLmcuICswMjAwXG4gICAgICAgIE86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0em8gPSBqc2RhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSxcbiAgICAgICAgICAgICAgICB0em9OdW0gPSBNYXRoLmFicyh0em8pO1xuICAgICAgICAgICAgcmV0dXJuICgwIDwgdHpvID8gXCItXCIgOiBcIitcIikgKyBwYWQoTWF0aC5mbG9vcih0em9OdW0gLyA2MCkgKiAxMDAgKyB0em9OdW0gJSA2MCwgNCwgXCIwXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIERpZmZlcmVuY2UgdG8gR01UIHcvY29sb247IGUuZy4gKzAyOjAwXG4gICAgICAgIFA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBPID0gZi5PKCk7XG4gICAgICAgICAgICByZXR1cm4gKE8uc3Vic3RyKDAsIDMpICsgXCI6XCIgKyBPLnN1YnN0cigzLCAyKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVGltZXpvbmUgb2Zmc2V0IGluIHNlY29uZHMgKC00MzIwMC4uNTA0MDApXG4gICAgICAgIFo6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIC1qc2RhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwOyB9LFxuXG4gICAgICAgIC8vIEZ1bGwgRGF0ZS9UaW1lLCBJU08tODYwMSBkYXRlXG4gICAgICAgIGM6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwiWS1tLWRcXFxcVEg6aTpzUFwiLnJlcGxhY2UoZm9ybWF0Q2hyLCBmb3JtYXRDaHJDYik7IH0sXG5cbiAgICAgICAgLy8gUkZDIDI4MjJcbiAgICAgICAgcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJELCBkIE0gWSBIOmk6cyBPXCIucmVwbGFjZShmb3JtYXRDaHIsIGZvcm1hdENockNiKTsgfSxcblxuICAgICAgICAvLyBTZWNvbmRzIHNpbmNlIFVOSVggZXBvY2hcbiAgICAgICAgVTogZnVuY3Rpb24gKCkgeyByZXR1cm4ganNkYXRlLmdldFRpbWUoKSAvIDEwMDAgfHwgMDsgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoZm9ybWF0Q2hyLCBmb3JtYXRDaHJDYik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGU7XG4iLCIvKipcbiAqIEZvcm1hdHMgdGhlIHZhbHVlIGxpa2UgYSBcImh1bWFuLXJlYWRhYmxlXCIgZmlsZSBzaXplIChpLmUuIFwiMTMgS0JcIiwgXCI0LjEgTUJcIiwgXCIxMDIgYnl0ZXNcIiwgZXRjKS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqIElmIHZhbHVlIGlzIDEyMzQ1Njc4OSwgdGhlIG91dHB1dCB3b3VsZCBiZSAxMTcuNyBNQi5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbnR3b3JkID0gcmVxdWlyZShcIi4vaW50d29yZFwiKTtcblxudmFyIGZpbGVzaXplID0gZnVuY3Rpb24gKGZpbGVzaXplLCBraWxvLCBkZWNpbWFscywgZGVjUG9pbnQsIHRob3VzYW5kc1NlcCwgc3VmZml4U2VwKSB7XG4gICAga2lsbyA9IG51bGwgPT0ga2lsbyA/IDEwMjQgOiBraWxvO1xuICAgIGlmICgwID49IGZpbGVzaXplKSB7XG4gICAgICAgIHJldHVybiBcIjAgYnl0ZXNcIjtcbiAgICB9XG4gICAgaWYgKGZpbGVzaXplIDwga2lsbyAmJiBudWxsID09IGRlY2ltYWxzKSB7XG4gICAgICAgIGRlY2ltYWxzID0gMDtcbiAgICB9XG4gICAgaWYgKG51bGwgPT0gc3VmZml4U2VwKSB7XG4gICAgICAgIHN1ZmZpeFNlcCA9IFwiIFwiO1xuICAgIH1cbiAgICByZXR1cm4gaW50d29yZChmaWxlc2l6ZSwgWyBcImJ5dGVzXCIsIFwiS0JcIiwgXCJNQlwiLCBcIkdCXCIsIFwiVEJcIiwgXCJQQlwiIF0sIGtpbG8sIGRlY2ltYWxzLCBkZWNQb2ludCwgdGhvdXNhbmRzU2VwLCBzdWZmaXhTZXApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlc2l6ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkYXRlOiByZXF1aXJlKFwiLi9kYXRlXCIpLFxuICAgIGZpbGVzaXplOiByZXF1aXJlKFwiLi9maWxlc2l6ZVwiKSxcbiAgICBpbnR3b3JkOiByZXF1aXJlKFwiLi9pbnR3b3JkXCIpLFxuICAgIGxpbmVicmVha3M6IHJlcXVpcmUoXCIuL2xpbmVicmVha3NcIiksXG4gICAgbmF0dXJhbERheTogcmVxdWlyZShcIi4vbmF0dXJhbERheVwiKSxcbiAgICBubDJicjogcmVxdWlyZShcIi4vbmwyYnJcIiksXG4gICAgbnVtYmVyRm9ybWF0OiByZXF1aXJlKFwiLi9udW1iZXJGb3JtYXRcIiksXG4gICAgb3JkaW5hbDogcmVxdWlyZShcIi4vb3JkaW5hbFwiKSxcbiAgICBwYWQ6IHJlcXVpcmUoXCIuL3BhZFwiKSxcbiAgICByZWxhdGl2ZVRpbWU6IHJlcXVpcmUoXCIuL3JlbGF0aXZlVGltZVwiKSxcbiAgICB0aW1lOiByZXF1aXJlKFwiLi90aW1lXCIpLFxuICAgIHRydW5jYXRlY2hhcnM6IHJlcXVpcmUoXCIuL3RydW5jYXRlY2hhcnNcIiksXG4gICAgdHJ1bmNhdGV3b3JkczogcmVxdWlyZShcIi4vdHJ1bmNhdGV3b3Jkc1wiKVxufTtcbiIsIi8qKlxuICogRm9ybWF0cyB0aGUgdmFsdWUgbGlrZSBhIFwiaHVtYW4tcmVhZGFibGVcIiBudW1iZXIgKGkuZS4gXCIxMyBLXCIsIFwiNC4xIE1cIiwgXCIxMDJcIiwgZXRjKS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqIElmIHZhbHVlIGlzIDEyMzQ1Njc4OSwgdGhlIG91dHB1dCB3b3VsZCBiZSAxMTcuNyBNLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIG51bWJlckZvcm1hdCA9IHJlcXVpcmUoXCIuL251bWJlckZvcm1hdFwiKTtcblxudmFyIGludHdvcmQgPSBmdW5jdGlvbiAobnVtYmVyLCB1bml0cywga2lsbywgZGVjaW1hbHMsIGRlY1BvaW50LCB0aG91c2FuZHNTZXAsIHN1ZmZpeFNlcCkge1xuICAgIHZhciBodW1hbml6ZWQsIHVuaXQ7XG5cbiAgICB1bml0cyA9IHVuaXRzIHx8IFtcIlwiLCBcIktcIiwgXCJNXCIsIFwiQlwiLCBcIlRcIl07XG4gICAgdW5pdCA9IHVuaXRzLmxlbmd0aCAtIDE7XG4gICAga2lsbyA9IGtpbG8gfHwgMTAwMDtcbiAgICBkZWNpbWFscyA9IGlzTmFOKGRlY2ltYWxzKSA/IDIgOiBNYXRoLmFicyhkZWNpbWFscyk7XG4gICAgZGVjUG9pbnQgPSBkZWNQb2ludCB8fCBcIi5cIjtcbiAgICB0aG91c2FuZHNTZXAgPSB0aG91c2FuZHNTZXAgfHwgXCIsXCI7XG4gICAgc3VmZml4U2VwID0gc3VmZml4U2VwIHx8IFwiXCI7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdW5pdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKE1hdGgucG93KGtpbG8sIGkgKyAxKSA+IG51bWJlcikge1xuICAgICAgICAgICAgdW5pdCA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBodW1hbml6ZWQgPSBudW1iZXIgLyBNYXRoLnBvdyhraWxvLCB1bml0KTtcblxuICAgIHZhciBzdWZmaXggPSB1bml0c1t1bml0XSA/IHN1ZmZpeFNlcCArIHVuaXRzW3VuaXRdIDogXCJcIjtcbiAgICByZXR1cm4gbnVtYmVyRm9ybWF0KGh1bWFuaXplZCwgZGVjaW1hbHMsIGRlY1BvaW50LCB0aG91c2FuZHNTZXApICsgc3VmZml4O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnR3b3JkO1xuIiwiLyoqXG4gKiBSZXBsYWNlcyBsaW5lIGJyZWFrcyBpbiBwbGFpbiB0ZXh0IHdpdGggYXBwcm9wcmlhdGUgSFRNTFxuICogQSBzaW5nbGUgbmV3bGluZSBiZWNvbWVzIGFuIEhUTUwgbGluZSBicmVhayAoPGJyLz4pIGFuZCBhIG5ldyBsaW5lIGZvbGxvd2VkIGJ5IGEgYmxhbmsgbGluZSBiZWNvbWVzIGEgcGFyYWdyYXBoIGJyZWFrICg8L3A+KS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqIElmIHZhbHVlIGlzIEpvZWxcXG5pcyBhXFxuXFxuc2x1ZywgdGhlIG91dHB1dCB3aWxsIGJlIDxwPkpvZWw8YnIgLz5pcyBhPC9wPjxwPnNsdWc8L3A+XG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgbGluZWJyZWFrcyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAvLyByZW1vdmUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgbmV3bGluZXNcbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvXihbXFxufFxccl0qKS8sIFwiXCIpO1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oW1xcbnxcXHJdKikkLywgXCJcIik7XG5cbiAgICAvLyBub3JtYWxpemUgYWxsIHRvIFxcblxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2csIFwiXFxuXCIpO1xuXG4gICAgLy8gYW55IGNvbnNlY3V0aXZlIG5ldyBsaW5lcyBtb3JlIHRoYW4gMiBnZXRzIHR1cm5lZCBpbnRvIHAgdGFnc1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oXFxuezIsfSkvZywgXCI8L3A+PHA+XCIpO1xuXG4gICAgLy8gYW55IHRoYXQgYXJlIHNpbmdsZXRvbnMgZ2V0IHR1cm5lZCBpbnRvIGJyXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoL1xcbi9nLCBcIjxiciAvPlwiKTtcbiAgICByZXR1cm4gXCI8cD5cIiArIHN0ciArIFwiPC9wPlwiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsaW5lYnJlYWtzO1xuIiwiLyoqXG4gKiBGb3IgZGF0ZXMgdGhhdCBhcmUgdGhlIGN1cnJlbnQgZGF5IG9yIHdpdGhpbiBvbmUgZGF5LCByZXR1cm4gJ3RvZGF5JywgJ3RvbW9ycm93JyBvciAneWVzdGVyZGF5JywgYXMgYXBwcm9wcmlhdGUuXG4gKiBPdGhlcndpc2UsIGZvcm1hdCB0aGUgZGF0ZSB1c2luZyB0aGUgcGFzc2VkIGluIGZvcm1hdCBzdHJpbmcuXG4gKlxuICogRXhhbXBsZXMgKHdoZW4gJ3RvZGF5JyBpcyAxNyBGZWIgMjAwNyk6XG4gKiAxNiBGZWIgMjAwNyBiZWNvbWVzIHllc3RlcmRheS5cbiAqIDE3IEZlYiAyMDA3IGJlY29tZXMgdG9kYXkuXG4gKiAxOCBGZWIgMjAwNyBiZWNvbWVzIHRvbW9ycm93LlxuICogQW55IG90aGVyIGRheSBpcyBmb3JtYXR0ZWQgYWNjb3JkaW5nIHRvIGdpdmVuIGFyZ3VtZW50IG9yIHRoZSBEQVRFX0ZPUk1BVCBzZXR0aW5nIGlmIG5vIGFyZ3VtZW50IGlzIGdpdmVuLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHRpbWUgPSByZXF1aXJlKFwiLi90aW1lXCIpLFxuICAgIGRhdGUgPSByZXF1aXJlKFwiLi9kYXRlXCIpO1xuXG52YXIgbmF0dXJhbERheSA9IGZ1bmN0aW9uICh0aW1lc3RhbXAsIGZvcm1hdCkge1xuICAgIHRpbWVzdGFtcCA9IG51bGwgPT0gdGltZXN0YW1wID8gdGltZSgpIDogdGltZXN0YW1wO1xuICAgIGZvcm1hdCA9IG51bGwgPT0gZm9ybWF0ID8gXCJZLW0tZFwiIDogZm9ybWF0O1xuXG4gICAgdmFyIG9uZURheSA9IDg2NDAwLFxuICAgICAgICBkID0gbmV3IERhdGUoKSxcbiAgICAgICAgdG9kYXkgPSBuZXcgRGF0ZShkLmdldEZ1bGxZZWFyKCksIGQuZ2V0TW9udGgoKSwgZC5nZXREYXRlKCkpLmdldFRpbWUoKSAvIDEwMDA7XG5cbiAgICBpZiAodGltZXN0YW1wIDwgdG9kYXkgJiYgdGltZXN0YW1wID49IHRvZGF5IC0gb25lRGF5KSB7XG4gICAgICAgIHJldHVybiBcInllc3RlcmRheVwiO1xuICAgIH1cbiAgICBpZiAodGltZXN0YW1wID49IHRvZGF5ICYmIHRpbWVzdGFtcCA8IHRvZGF5ICsgb25lRGF5KSB7XG4gICAgICAgIHJldHVybiBcInRvZGF5XCI7XG4gICAgfVxuICAgIGlmICh0aW1lc3RhbXAgPj0gdG9kYXkgKyBvbmVEYXkgJiYgdGltZXN0YW1wIDwgdG9kYXkgKyAyICogb25lRGF5KSB7XG4gICAgICAgIHJldHVybiBcInRvbW9ycm93XCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGUoZm9ybWF0LCB0aW1lc3RhbXApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXR1cmFsRGF5O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBhbGwgbmV3bGluZXMgaW4gYSBwaWVjZSBvZiBwbGFpbiB0ZXh0IHRvIEhUTUwgbGluZSBicmVha3MgKDxiciAvPikuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgbmwyYnIgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2csIFwiPGJyLz5cIik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5sMmJyO1xuIiwiLyoqXG4gKiBGb3JtYXQgbnVtYmVyIGJ5IGFkZGluZyB0aG91c2FuZHMgc2VwYXJhdGVycyBhbmQgc2lnbmlmaWNhbnQgZGlnaXRzIHdoaWxlIHJvdW5kaW5nXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgbnVtYmVyRm9ybWF0ID0gZnVuY3Rpb24gKG51bWJlciwgZGVjaW1hbHMsIGRlY1BvaW50LCB0aG91c2FuZHNTZXApIHtcbiAgICBkZWNpbWFscyA9IGlzTmFOKGRlY2ltYWxzKSA/IDIgOiBNYXRoLmFicyhkZWNpbWFscyk7XG4gICAgZGVjUG9pbnQgPSBudWxsID09IGRlY1BvaW50ID8gXCIuXCIgOiBkZWNQb2ludDtcbiAgICB0aG91c2FuZHNTZXAgPSAobnVsbCA9PSB0aG91c2FuZHNTZXApID8gXCIsXCIgOiB0aG91c2FuZHNTZXA7XG5cbiAgICB2YXIgc2lnbiA9IDAgPiBudW1iZXIgPyBcIi1cIiA6IFwiXCI7XG4gICAgbnVtYmVyID0gTWF0aC5hYnMoK251bWJlciB8fCAwKTtcblxuICAgIHZhciBpbnRQYXJ0ID0gcGFyc2VJbnQobnVtYmVyLnRvRml4ZWQoZGVjaW1hbHMpLCAxMCkgKyBcIlwiLFxuICAgICAgICBqID0gaW50UGFydC5sZW5ndGggPiAzID8gaW50UGFydC5sZW5ndGggJSAzIDogMDtcblxuICAgIHJldHVybiBzaWduICsgKGogPyBpbnRQYXJ0LnN1YnN0cigwLCBqKSArIHRob3VzYW5kc1NlcCA6IFwiXCIpICsgaW50UGFydC5zdWJzdHIoaikucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csIFwiJDFcIiArIHRob3VzYW5kc1NlcCkgKyAoZGVjaW1hbHMgPyBkZWNQb2ludCArIE1hdGguYWJzKG51bWJlciAtIGludFBhcnQpLnRvRml4ZWQoZGVjaW1hbHMpLnNsaWNlKDIpIDogXCJcIik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG51bWJlckZvcm1hdDtcbiIsIi8qKlxuICogQ29udmVydHMgYW4gaW50ZWdlciB0byBpdHMgb3JkaW5hbCBhcyBhIHN0cmluZy5cbiAqXG4gKiAxIGJlY29tZXMgMXN0XG4gKiAyIGJlY29tZXMgMm5kXG4gKiAzIGJlY29tZXMgM3JkIGV0Y1xuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIG9yZGluYWwgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgbnVtYmVyID0gcGFyc2VJbnQobnVtYmVyLCAxMCk7XG4gICAgbnVtYmVyID0gaXNOYU4obnVtYmVyKSA/IDAgOiBudW1iZXI7XG4gICAgdmFyIHNpZ24gPSBudW1iZXIgPCAwID8gXCItXCIgOiBcIlwiO1xuICAgIG51bWJlciA9IE1hdGguYWJzKG51bWJlcik7XG4gICAgdmFyIHRlbnMgPSBudW1iZXIgJSAxMDA7XG5cbiAgICByZXR1cm4gc2lnbiArIG51bWJlciArICh0ZW5zID4gNCAmJiB0ZW5zIDwgMjEgPyBcInRoXCIgOiB7IDE6IFwic3RcIiwgMjogXCJuZFwiLCAzOiBcInJkXCIgfVtudW1iZXIgJSAxMF0gfHwgXCJ0aFwiKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb3JkaW5hbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcGFkID0gZnVuY3Rpb24gKHN0ciwgY291bnQsIHBhZENoYXIsIHR5cGUpIHtcbiAgICBzdHIgKz0gXCJcIjsgLy8gRW5zdXJlIHN0cmluZ1xuXG4gICAgaWYgKCFwYWRDaGFyKSB7XG4gICAgICAgIHBhZENoYXIgPSBcIiBcIjtcbiAgICB9IGVsc2UgaWYgKDEgPCBwYWRDaGFyLmxlbmd0aCkge1xuICAgICAgICBwYWRDaGFyID0gcGFkQ2hhci5jaGFyQXQoMCk7XG4gICAgfVxuXG4gICAgdHlwZSA9IG51bGwgPT0gdHlwZSA/IFwibGVmdFwiIDogXCJyaWdodFwiO1xuXG4gICAgaWYgKFwicmlnaHRcIiA9PT0gdHlwZSkge1xuICAgICAgICB3aGlsZSAoY291bnQgPiBzdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdHIgKz0gcGFkQ2hhcjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQgdG8gbGVmdFxuICAgICAgICB3aGlsZSAoY291bnQgPiBzdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdHIgPSBwYWRDaGFyICsgc3RyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGFkO1xuIiwiLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGluZyBob3cgbWFueSBzZWNvbmRzLCBtaW51dGVzIG9yIGhvdXJzIGFnbyBpdCB3YXMgb3Igd2lsbCBiZSBpbiB0aGUgZnV0dXJlXG4gKiBXaWxsIGFsd2F5cyByZXR1cm4gYSByZWxhdGl2ZSB0aW1lLCBtb3N0IGdyYW51bGFyIG9mIHNlY29uZHMgdG8gbGVhc3QgZ3JhbnVsYXIgb2YgeWVhcnMuIFNlZSB1bml0IHRlc3RzIGZvciBtb3JlIGRldGFpbHNcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB0aW1lID0gcmVxdWlyZShcIi4vdGltZVwiKSxcbiAgICBkYXRlID0gcmVxdWlyZShcIi4vZGF0ZVwiKTtcblxudmFyIHJlbGF0aXZlVGltZSA9IGZ1bmN0aW9uICh0aW1lc3RhbXApIHtcbiAgICB0aW1lc3RhbXAgPSBudWxsID09IHRpbWVzdGFtcCA/IHRpbWUoKSA6IHRpbWVzdGFtcDtcblxuICAgIHZhciBjdXJyVGltZSA9IHRpbWUoKSxcbiAgICAgICAgdGltZURpZmYgPSBjdXJyVGltZSAtIHRpbWVzdGFtcDtcblxuICAgIC8vIHdpdGhpbiAyIHNlY29uZHNcbiAgICBpZiAoMiA+IHRpbWVEaWZmICYmIC0yIDwgdGltZURpZmYpIHtcbiAgICAgICAgcmV0dXJuICgwIDw9IHRpbWVEaWZmID8gXCJqdXN0IFwiIDogXCJcIikgKyBcIm5vd1wiO1xuICAgIH1cblxuICAgIC8vIHdpdGhpbiBhIG1pbnV0ZVxuICAgIGlmICg2MCA+IHRpbWVEaWZmICYmIC02MCA8IHRpbWVEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IHRpbWVEaWZmID8gTWF0aC5mbG9vcih0aW1lRGlmZikgKyBcIiBzZWNvbmRzIGFnb1wiIDogXCJpbiBcIiArIE1hdGguZmxvb3IoLXRpbWVEaWZmKSArIFwiIHNlY29uZHNcIjtcbiAgICB9XG5cbiAgICAvLyB3aXRoaW4gMiBtaW51dGVzXG4gICAgaWYgKDEyMCA+IHRpbWVEaWZmICYmIC0xMjAgPCB0aW1lRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSB0aW1lRGlmZiA/IFwiYWJvdXQgYSBtaW51dGUgYWdvXCIgOiBcImluIGFib3V0IGEgbWludXRlXCI7XG4gICAgfVxuXG4gICAgLy8gd2l0aGluIGFuIGhvdXJcbiAgICBpZiAoMzYwMCA+IHRpbWVEaWZmICYmIC0zNjAwIDwgdGltZURpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0gdGltZURpZmYgPyBNYXRoLmZsb29yKHRpbWVEaWZmIC8gNjApICsgXCIgbWludXRlcyBhZ29cIiA6IFwiaW4gXCIgKyBNYXRoLmZsb29yKC10aW1lRGlmZiAvIDYwKSArIFwiIG1pbnV0ZXNcIjtcbiAgICB9XG5cbiAgICAvLyB3aXRoaW4gMiBob3Vyc1xuICAgIGlmICg3MjAwID4gdGltZURpZmYgJiYgLTcyMDAgPCB0aW1lRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSB0aW1lRGlmZiA/IFwiYWJvdXQgYW4gaG91ciBhZ29cIiA6IFwiaW4gYWJvdXQgYW4gaG91clwiO1xuICAgIH1cblxuICAgIC8vIHdpdGhpbiAyNCBob3Vyc1xuICAgIGlmICg4NjQwMCA+IHRpbWVEaWZmICYmIC04NjQwMCA8IHRpbWVEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IHRpbWVEaWZmID8gTWF0aC5mbG9vcih0aW1lRGlmZiAvIDM2MDApICsgXCIgaG91cnMgYWdvXCIgOiBcImluIFwiICsgTWF0aC5mbG9vcih0aW1lRGlmZiAvIDM2MDApICsgXCIgaG91cnNcIjtcbiAgICB9XG5cbiAgICAvLyB3aXRoaW4gMiBkYXlzXG4gICAgdmFyIGRheXMyID0gMiAqIDg2NDAwO1xuICAgIGlmIChkYXlzMiA+IHRpbWVEaWZmICYmIC1kYXlzMiA8IHRpbWVEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IHRpbWVEaWZmID8gTWF0aC5mbG9vcih0aW1lRGlmZiAvIDg2NDAwKSArIFwiIGRheXMgYWdvXCIgOiBcImluIFwiICsgTWF0aC5mbG9vcigtdGltZURpZmYgLyA4NjQwMCkgKyBcIiBkYXlzXCI7XG4gICAgfVxuXG4gICAgLy8gd2l0aGluIDYwIGRheXNcbiAgICB2YXIgZGF5czYwID0gNjAgKiA4NjQwMDtcbiAgICBpZiAoZGF5czYwID4gdGltZURpZmYgJiYgLWRheXM2MCA8IHRpbWVEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IHRpbWVEaWZmID8gXCJhYm91dCBhIG1vbnRoIGFnb1wiIDogXCJpbiBhYm91dCBhIG1vbnRoXCI7XG4gICAgfVxuXG4gICAgdmFyIGN1cnJUaW1lWWVhcnMgPSBwYXJzZUludChkYXRlKFwiWVwiLCBjdXJyVGltZSksIDEwKSxcbiAgICAgICAgdGltZXN0YW1wWWVhcnMgPSBwYXJzZUludChkYXRlKFwiWVwiLCB0aW1lc3RhbXApLCAxMCksXG4gICAgICAgIGN1cnJUaW1lTW9udGhzID0gY3VyclRpbWVZZWFycyAqIDEyICsgcGFyc2VJbnQoZGF0ZShcIm5cIiwgY3VyclRpbWUpLCAxMCksXG4gICAgICAgIHRpbWVzdGFtcE1vbnRocyA9IHRpbWVzdGFtcFllYXJzICogMTIgKyBwYXJzZUludChkYXRlKFwiblwiLCB0aW1lc3RhbXApLCAxMCk7XG5cbiAgICAvLyB3aXRoaW4gYSB5ZWFyXG4gICAgdmFyIG1vbnRoRGlmZiA9IGN1cnJUaW1lTW9udGhzIC0gdGltZXN0YW1wTW9udGhzO1xuICAgIGlmICgxMiA+IG1vbnRoRGlmZiAmJiAtMTIgPCBtb250aERpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0gbW9udGhEaWZmID8gbW9udGhEaWZmICsgXCIgbW9udGhzIGFnb1wiIDogXCJpbiBcIiArICgtbW9udGhEaWZmKSArIFwiIG1vbnRoc1wiO1xuICAgIH1cblxuICAgIHZhciB5ZWFyRGlmZiA9IGN1cnJUaW1lWWVhcnMgLSB0aW1lc3RhbXBZZWFycztcbiAgICBpZiAoMiA+IHllYXJEaWZmICYmIC0yIDwgeWVhckRpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0geWVhckRpZmYgPyBcImEgeWVhciBhZ29cIiA6IFwiaW4gYSB5ZWFyXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIDAgPD0geWVhckRpZmYgPyB5ZWFyRGlmZiArIFwiIHllYXJzIGFnb1wiIDogXCJpbiBcIiArICgteWVhckRpZmYpICsgXCIgeWVhcnNcIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmVsYXRpdmVUaW1lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB0aW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAobnVsbCAhPSBEYXRlLm5vdyA/IERhdGUubm93KCkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSkgLyAxMDAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aW1lO1xuIiwiLyoqXG4gKiBUcnVuY2F0ZXMgYSBzdHJpbmcgaWYgaXQgaXMgbG9uZ2VyIHRoYW4gdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgY2hhcmFjdGVycy5cbiAqIFRydW5jYXRlZCBzdHJpbmdzIHdpbGwgZW5kIHdpdGggYSB0cmFuc2xhdGFibGUgZWxsaXBzaXMgc2VxdWVuY2UgKFwi4oCmXCIpLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHRydW5jYXRlY2hhcnMgPSBmdW5jdGlvbiAoc3RyaW5nLCBsZW5ndGgpIHtcbiAgICBpZiAoc3RyaW5nLmxlbmd0aCA8PSBsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cigwLCBsZW5ndGgpICsgXCLigKZcIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdHJ1bmNhdGVjaGFycztcbiIsIi8qKlxuICogVHJ1bmNhdGVzIGEgc3RyaW5nIGFmdGVyIGEgY2VydGFpbiBudW1iZXIgb2Ygd29yZHMuXG4gKiBOZXdsaW5lcyB3aXRoaW4gdGhlIHN0cmluZyB3aWxsIGJlIHJlbW92ZWQuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgdHJ1bmNhdGV3b3JkcyA9IGZ1bmN0aW9uIChzdHJpbmcsIG51bVdvcmRzKSB7XG4gICAgdmFyIHdvcmRzID0gc3RyaW5nLnNwbGl0KCcgJyk7XG5cbiAgICBpZiAod29yZHMubGVuZ3RoIDwgbnVtV29yZHMpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gd29yZHMuc2xpY2UoMCwgbnVtV29yZHMpLmpvaW4oJyAnKSArIFwi4oCmXCI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRydW5jYXRld29yZHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZShcIi4vZXZlbnRzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjbG9zZXN0OiByZXF1aXJlKFwiLi9jbG9zZXN0XCIpLFxuICAgIGRlYm91bmNlOiByZXF1aXJlKFwiLi9kZWJvdW5jZVwiKSxcbiAgICBmb3JFYWNoOiByZXF1aXJlKFwiLi9mb3JFYWNoXCIpLFxuICAgIGdldEZsb2F0OiByZXF1aXJlKFwiLi9nZXRGbG9hdFwiKSxcbiAgICBnZXRJbnQ6IHJlcXVpcmUoXCIuL2dldEludFwiKSxcbiAgICBodW1hbml6ZTogcmVxdWlyZShcIi4vaHVtYW5pemVcIiksXG4gICAgbG9nOiByZXF1aXJlKFwiLi9sb2dcIiksXG4gICAgcmFmOiByZXF1aXJlKFwiLi9yYWZcIiksXG4gICAgdHlwZTogcmVxdWlyZShcIi4vdHlwZVwiKVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gICAgbG9nLmhpc3RvcnkucHVzaChhcmd1bWVudHMpO1xuICAgIGNvbnNvbGUubG9nKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xufVxuXG5sb2cuaGlzdG9yeSA9IFtdO1xuXG5sb2cuZGJnID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHN0ciA9IFwiREVCVUc6IFwiICsgc3RyO1xuICAgIGxvZy5oaXN0b3J5LnB1c2goc3RyKTtcbiAgICBjb25zb2xlLmRlYnVnKHN0cik7XG59O1xuXG5sb2cuZXJyID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGxvZy5oaXN0b3J5LnB1c2goXCJFUlJPUjogXCIgKyBzdHIpO1xuICAgIGNvbnNvbGUuZXJyb3Ioc3RyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbG9nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBuYXRpdmVSYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUsXG4gICAgbGFzdFRpbWUgPSAwO1xuXG52YXIgcmFmID0gbmF0aXZlUmFmIHx8IGZ1bmN0aW9uIChmbikge1xuICAgIHZhciBjdXJyVGltZSA9IERhdGUubm93KCksXG4gICAgICAgIHRpbWVEZWxheSA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZURlbGF5O1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmbihEYXRlLm5vdygpKTtcbiAgICB9LCB0aW1lRGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByYWY7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9fdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGNsYXNzVG9UeXBlID0ge30sXG4gICAgbmFtZXMgPSAoXCJCb29sZWFufE51bWJlcnxTdHJpbmd8RnVuY3Rpb258QXJyYXl8RGF0ZXxSZWdFeHB8VW5kZWZpbmVkfE51bGxcIikuc3BsaXQoXCJ8XCIpLFxuICAgIG47XG5cbmZvciAobiBpbiBuYW1lcykge1xuICAgIGlmIChuYW1lcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBjbGFzc1RvVHlwZVtcIltvYmplY3QgXCIgKyBuYW1lICsgXCJdXCJdID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdHlwZShvYmopIHtcbiAgICB2YXIgc3RyVHlwZSA9IF9fdG9TdHJpbmcuY2FsbChvYmopO1xuICAgIHJldHVybiBjbGFzc1RvVHlwZVtzdHJUeXBlXSB8fCBcIm9iamVjdFwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGU7XG4iXX0=
(21)
});
