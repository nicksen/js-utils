!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.utils=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/index":[function(require,module,exports){
"use strict";

require("./events");

module.exports = {
    attempt: require("./attempt"),
    closest: require("./closest"),
    contains: require("./contains"),
    criteria: require("./criteria"),
    debounce: require("./debounce"),
    delegate: require("./delegate"),
    forEach: require("./forEach"),
    getFloat: require("./getFloat"),
    getInt: require("./getInt"),
    humanize: require("./humanize"),
    log: require("./log"),
    raf: require("./raf"),
    slicer: require("./slicer"),
    trim: require("./trim"),
    type: require("./type")
};

},{"./attempt":"/Users/nicks/Projects/utils/src/attempt.js","./closest":"/Users/nicks/Projects/utils/src/closest.js","./contains":"/Users/nicks/Projects/utils/src/contains.js","./criteria":"/Users/nicks/Projects/utils/src/criteria.js","./debounce":"/Users/nicks/Projects/utils/src/debounce.js","./delegate":"/Users/nicks/Projects/utils/src/delegate.js","./events":"/Users/nicks/Projects/utils/src/events.js","./forEach":"/Users/nicks/Projects/utils/src/forEach.js","./getFloat":"/Users/nicks/Projects/utils/src/getFloat.js","./getInt":"/Users/nicks/Projects/utils/src/getInt.js","./humanize":"/Users/nicks/Projects/utils/src/humanize/index.js","./log":"/Users/nicks/Projects/utils/src/log.js","./raf":"/Users/nicks/Projects/utils/src/raf.js","./slicer":"/Users/nicks/Projects/utils/src/slicer.js","./trim":"/Users/nicks/Projects/utils/src/trim.js","./type":"/Users/nicks/Projects/utils/src/type.js"}],"/Users/nicks/Projects/utils/src/attempt.js":[function(require,module,exports){
"use strict";

function attempt(fn, args, binding) {
    try {
        return fn.apply(args, binding);
    } catch (e) {}
}

module.exports = attempt;

},{}],"/Users/nicks/Projects/utils/src/closest.js":[function(require,module,exports){
"use strict";

var slicer = require("./slicer");

function closest(node, search) {
    var matches = [],
        hits = slicer(document.querySelectorAll(search));

    while (null != node) {
        if (0 <= hits.indexOf(node)) {
            matches.push(node);
        }

        node = node.parentNode;
    }

    return matches;
}

module.exports = closest;

},{"./slicer":"/Users/nicks/Projects/utils/src/slicer.js"}],"/Users/nicks/Projects/utils/src/contains.js":[function(require,module,exports){
"use strict";

var es = "contains" in document.documentElement;

var contains = es ? function(parent, child) {
    return parent.contains(child);
} : function(parent, child) {
    return parent.compareDocumentPosition(child);
};

module.exports = contains;

},{}],"/Users/nicks/Projects/utils/src/criteria.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/debounce.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/delegate.js":[function(require,module,exports){
"use strict";

function delegate(criteria, listener) {
    return function(e) {
        var el = e.target;
        do {
            if (!criteria(el)) {
                continue;
            }

            e.delegateTarget = el;
            listener.apply(this, arguments);
            return;
        } while ((el = el.parentNode));
    };
}

module.exports = function partialDelegate(criteria) {
    return function(handler) {
        return delegate(criteria, handler);
    };
};

},{}],"/Users/nicks/Projects/utils/src/events.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/forEach.js":[function(require,module,exports){
"use strict";

var type = require("./type");

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

},{"./type":"/Users/nicks/Projects/utils/src/type.js"}],"/Users/nicks/Projects/utils/src/getFloat.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/getInt.js":[function(require,module,exports){
"use strict";

var getFloat = require("./getFloat");

function getInt(input, abs) {
    return parseInt(getFloat(input, abs), 10);
}

module.exports = parseInt;

},{"./getFloat":"/Users/nicks/Projects/utils/src/getFloat.js"}],"/Users/nicks/Projects/utils/src/humanize/date.js":[function(require,module,exports){
/**
 * PHP-inspired date
 */
"use strict";

var pad = require("./pad");

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

},{"./pad":"/Users/nicks/Projects/utils/src/humanize/pad.js"}],"/Users/nicks/Projects/utils/src/humanize/filesize.js":[function(require,module,exports){
/**
 * Formats the value like a "human-readable" file size (i.e. "13 KB", "4.1 MB", "102 bytes", etc).
 *
 * For example:
 * If value is 123456789, the output would be 117.7 MB.
 */
"use strict";

var intword = require("./intword");

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

},{"./intword":"/Users/nicks/Projects/utils/src/humanize/intword.js"}],"/Users/nicks/Projects/utils/src/humanize/index.js":[function(require,module,exports){
"use strict";

module.exports = {
    date: require("./date"),
    filesize: require("./filesize"),
    intword: require("./intword"),
    linebreaks: require("./linebreaks"),
    naturalDay: require("./naturalDay"),
    nl2br: require("./nl2br"),
    numberFormat: require("./numberFormat"),
    ordinal: require("./ordinal"),
    pad: require("./pad"),
    relativeTime: require("./relativeTime"),
    time: require("./time"),
    truncatechars: require("./truncatechars"),
    truncatewords: require("./truncatewords")
};

},{"./date":"/Users/nicks/Projects/utils/src/humanize/date.js","./filesize":"/Users/nicks/Projects/utils/src/humanize/filesize.js","./intword":"/Users/nicks/Projects/utils/src/humanize/intword.js","./linebreaks":"/Users/nicks/Projects/utils/src/humanize/linebreaks.js","./naturalDay":"/Users/nicks/Projects/utils/src/humanize/naturalDay.js","./nl2br":"/Users/nicks/Projects/utils/src/humanize/nl2br.js","./numberFormat":"/Users/nicks/Projects/utils/src/humanize/numberFormat.js","./ordinal":"/Users/nicks/Projects/utils/src/humanize/ordinal.js","./pad":"/Users/nicks/Projects/utils/src/humanize/pad.js","./relativeTime":"/Users/nicks/Projects/utils/src/humanize/relativeTime.js","./time":"/Users/nicks/Projects/utils/src/humanize/time.js","./truncatechars":"/Users/nicks/Projects/utils/src/humanize/truncatechars.js","./truncatewords":"/Users/nicks/Projects/utils/src/humanize/truncatewords.js"}],"/Users/nicks/Projects/utils/src/humanize/intword.js":[function(require,module,exports){
/**
 * Formats the value like a "human-readable" number (i.e. "13 K", "4.1 M", "102", etc).
 *
 * For example:
 * If value is 123456789, the output would be 117.7 M.
 */
"use strict";

var numberFormat = require("./numberFormat");

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

},{"./numberFormat":"/Users/nicks/Projects/utils/src/humanize/numberFormat.js"}],"/Users/nicks/Projects/utils/src/humanize/linebreaks.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/humanize/naturalDay.js":[function(require,module,exports){
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

var time = require("./time"),
    date = require("./date");

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

},{"./date":"/Users/nicks/Projects/utils/src/humanize/date.js","./time":"/Users/nicks/Projects/utils/src/humanize/time.js"}],"/Users/nicks/Projects/utils/src/humanize/nl2br.js":[function(require,module,exports){
/**
 * Converts all newlines in a piece of plain text to HTML line breaks (<br />).
 */
"use strict";

var nl2br = function (str) {
    return str.replace(/(\r\n|\n|\r)/g, "<br/>");
};

module.exports = nl2br;

},{}],"/Users/nicks/Projects/utils/src/humanize/numberFormat.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/humanize/ordinal.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/humanize/pad.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/humanize/relativeTime.js":[function(require,module,exports){
/**
 * Returns a string representing how many seconds, minutes or hours ago it was or will be in the future
 * Will always return a relative time, most granular of seconds to least granular of years. See unit tests for more details
 */
"use strict";

var time = require("./time"),
    date = require("./date");

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

},{"./date":"/Users/nicks/Projects/utils/src/humanize/date.js","./time":"/Users/nicks/Projects/utils/src/humanize/time.js"}],"/Users/nicks/Projects/utils/src/humanize/time.js":[function(require,module,exports){
"use strict";

var time = function () {
    return (null != Date.now ? Date.now() : new Date().getTime()) / 1000;
};

module.exports = time;

},{}],"/Users/nicks/Projects/utils/src/humanize/truncatechars.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/humanize/truncatewords.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/log.js":[function(require,module,exports){
"use strict";

var slicer = require("./slicer");

function log() {
    log.history.push(arguments);
    console.log(slicer(arguments));
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

},{"./slicer":"/Users/nicks/Projects/utils/src/slicer.js"}],"/Users/nicks/Projects/utils/src/raf.js":[function(require,module,exports){
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

},{}],"/Users/nicks/Projects/utils/src/slicer.js":[function(require,module,exports){
"use strict";

function slicer(/* arr */ items, /* int */ start) {
    if (null == start) {
        start = 0;
    }

    var len = items.length;
    var arr = new Array(len - start);

    for (var i = start; i < len; i++) {
        arr[i - start] = items[i];
    }

    return arr;
}

module.exports = slicer;

},{}],"/Users/nicks/Projects/utils/src/trim.js":[function(require,module,exports){
"use strict";

function trim(text) {
    return text.replace(/^\s+|\s+$/, "");
}

module.exports = trim;

},{}],"/Users/nicks/Projects/utils/src/type.js":[function(require,module,exports){
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

},{}]},{},["./src/index"])("./src/index")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXgiLCJzcmMvYXR0ZW1wdC5qcyIsInNyYy9jbG9zZXN0LmpzIiwic3JjL2NvbnRhaW5zLmpzIiwic3JjL2NyaXRlcmlhLmpzIiwic3JjL2RlYm91bmNlLmpzIiwic3JjL2RlbGVnYXRlLmpzIiwic3JjL2V2ZW50cy5qcyIsInNyYy9mb3JFYWNoLmpzIiwic3JjL2dldEZsb2F0LmpzIiwic3JjL2dldEludC5qcyIsInNyYy9odW1hbml6ZS9kYXRlLmpzIiwic3JjL2h1bWFuaXplL2ZpbGVzaXplLmpzIiwic3JjL2h1bWFuaXplL2luZGV4LmpzIiwic3JjL2h1bWFuaXplL2ludHdvcmQuanMiLCJzcmMvaHVtYW5pemUvbGluZWJyZWFrcy5qcyIsInNyYy9odW1hbml6ZS9uYXR1cmFsRGF5LmpzIiwic3JjL2h1bWFuaXplL25sMmJyLmpzIiwic3JjL2h1bWFuaXplL251bWJlckZvcm1hdC5qcyIsInNyYy9odW1hbml6ZS9vcmRpbmFsLmpzIiwic3JjL2h1bWFuaXplL3BhZC5qcyIsInNyYy9odW1hbml6ZS9yZWxhdGl2ZVRpbWUuanMiLCJzcmMvaHVtYW5pemUvdGltZS5qcyIsInNyYy9odW1hbml6ZS90cnVuY2F0ZWNoYXJzLmpzIiwic3JjL2h1bWFuaXplL3RydW5jYXRld29yZHMuanMiLCJzcmMvbG9nLmpzIiwic3JjL3JhZi5qcyIsInNyYy9zbGljZXIuanMiLCJzcmMvdHJpbS5qcyIsInNyYy90eXBlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZShcIi4vZXZlbnRzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBhdHRlbXB0OiByZXF1aXJlKFwiLi9hdHRlbXB0XCIpLFxuICAgIGNsb3Nlc3Q6IHJlcXVpcmUoXCIuL2Nsb3Nlc3RcIiksXG4gICAgY29udGFpbnM6IHJlcXVpcmUoXCIuL2NvbnRhaW5zXCIpLFxuICAgIGNyaXRlcmlhOiByZXF1aXJlKFwiLi9jcml0ZXJpYVwiKSxcbiAgICBkZWJvdW5jZTogcmVxdWlyZShcIi4vZGVib3VuY2VcIiksXG4gICAgZGVsZWdhdGU6IHJlcXVpcmUoXCIuL2RlbGVnYXRlXCIpLFxuICAgIGZvckVhY2g6IHJlcXVpcmUoXCIuL2ZvckVhY2hcIiksXG4gICAgZ2V0RmxvYXQ6IHJlcXVpcmUoXCIuL2dldEZsb2F0XCIpLFxuICAgIGdldEludDogcmVxdWlyZShcIi4vZ2V0SW50XCIpLFxuICAgIGh1bWFuaXplOiByZXF1aXJlKFwiLi9odW1hbml6ZVwiKSxcbiAgICBsb2c6IHJlcXVpcmUoXCIuL2xvZ1wiKSxcbiAgICByYWY6IHJlcXVpcmUoXCIuL3JhZlwiKSxcbiAgICBzbGljZXI6IHJlcXVpcmUoXCIuL3NsaWNlclwiKSxcbiAgICB0cmltOiByZXF1aXJlKFwiLi90cmltXCIpLFxuICAgIHR5cGU6IHJlcXVpcmUoXCIuL3R5cGVcIilcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gYXR0ZW1wdChmbiwgYXJncywgYmluZGluZykge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShhcmdzLCBiaW5kaW5nKTtcbiAgICB9IGNhdGNoIChlKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGF0dGVtcHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHNsaWNlciA9IHJlcXVpcmUoXCIuL3NsaWNlclwiKTtcblxuZnVuY3Rpb24gY2xvc2VzdChub2RlLCBzZWFyY2gpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdLFxuICAgICAgICBoaXRzID0gc2xpY2VyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VhcmNoKSk7XG5cbiAgICB3aGlsZSAobnVsbCAhPSBub2RlKSB7XG4gICAgICAgIGlmICgwIDw9IGhpdHMuaW5kZXhPZihub2RlKSkge1xuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9zZXN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlcyA9IFwiY29udGFpbnNcIiBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbnZhciBjb250YWlucyA9IGVzID8gZnVuY3Rpb24ocGFyZW50LCBjaGlsZCkge1xuICAgIHJldHVybiBwYXJlbnQuY29udGFpbnMoY2hpbGQpO1xufSA6IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpIHtcbiAgICByZXR1cm4gcGFyZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGNoaWxkKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29udGFpbnM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNsc0xpc3QgPSBcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuZnVuY3Rpb24gY2xhc3NSZWcoY2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIgKyBjbGFzc05hbWUgKyBcIihcXFxccyt8JClcIik7XG59XG5cbnZhciBjcml0ZXJpYSA9IHtcbiAgICBpc0VsZW1lbnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICB9LFxuICAgIGhhc0NsYXNzOiBmdW5jdGlvbihjbHMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjcml0ZXJpYS5pc0VsZW1lbnQoZSkgJiYgY2xzTGlzdCA/IGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNscykgOiBjbGFzc1JlZyhjbHMpLnRlc3QoZS5jbGFzc05hbWUpO1xuICAgICAgICB9O1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY3JpdGVyaWE7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gZGVib3VuY2UoZm4sIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIGlmIChudWxsID09IGltbWVkaWF0ZSkge1xuICAgICAgICBpbW1lZGlhdGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB3YWl0KTtcblxuICAgICAgICBpZiAoaW1tZWRpYXRlICYmICF0aW1lb3V0KSB7XG4gICAgICAgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gZGVsZWdhdGUoY3JpdGVyaWEsIGxpc3RlbmVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGVsID0gZS50YXJnZXQ7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmICghY3JpdGVyaWEoZWwpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGUuZGVsZWdhdGVUYXJnZXQgPSBlbDtcbiAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gd2hpbGUgKChlbCA9IGVsLnBhcmVudE5vZGUpKTtcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnRpYWxEZWxlZ2F0ZShjcml0ZXJpYSkge1xuICAgIHJldHVybiBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZShjcml0ZXJpYSwgaGFuZGxlcik7XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIEFkZHMgYHByZXZlbnREZWZhdWx0YCwgYHN0b3BQcm9wYWdhdGlvbmAsIGBhZGRFdmVudExpc3RlbmVyYFxuICogYW5kIGByZW1vdmVFdmVudExpc3RlbmVyYCBpbiBJRSA4XG4gKiBUT0RPOiBGaW5kIGEgd2F5IHRvIGFkZCBmb3Igb2xkZXIgYnJvd3NlcnMgYXMgd2VsbFxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEV2ZW50ID0gd2luZG93LkV2ZW50LFxuICAgIEhUTUxEb2N1bWVudCA9IHdpbmRvdy5IVE1MRG9jdW1lbnQsXG4gICAgV2luZG93ID0gd2luZG93LldpbmRvdztcblxuaWYgKCFFdmVudC5wcm90b3R5cGUucHJldmVudERlZmF1bHQpIHtcbiAgICBFdmVudC5wcm90b3R5cGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICB9O1xufVxuXG5pZiAoIUV2ZW50LnByb3RvdHlwZS5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICBFdmVudC5wcm90b3R5cGUuc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgfTtcbn1cblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgdmFyIGV2ZW50TGlzdGVuZXJzID0gW10sXG4gICAgICAgIGFkZCwgcmVtb3ZlO1xuXG4gICAgYWRkID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIgLyosIHVzZUNhcHR1cmUgKHdpbGwgYmUgaWdub3JlZCkgKi8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgd3JhcHBlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnRhcmdldCA9IGUuc3JjRWxlbWVudDtcbiAgICAgICAgICAgIGUuY3VycmVudFRhcmdldCA9IHNlbGY7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIuaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5oYW5kbGVFdmVudChlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbChzZWxmLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoXCJET01Db250ZW50TG9hZGVkXCIgPT09IHR5cGUpIHtcbiAgICAgICAgICAgIHZhciB3cmFwcGVyMiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKFwiY29tcGxldGVcIiA9PT0gZG9jdW1lbnQucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIHdyYXBwZXIyKTtcbiAgICAgICAgICAgIGV2ZW50TGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIG9iamVjdDogdGhpcyxcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgICB3cmFwcGVyOiB3cmFwcGVyMlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChcImNvbXBsZXRlXCIgPT09IGRvY3VtZW50LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFdmVudCgpO1xuICAgICAgICAgICAgICAgIGUuc3JjRWxlbWVudCA9IHdpbmRvdztcbiAgICAgICAgICAgICAgICB3cmFwcGVyMihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgd3JhcHBlcik7XG4gICAgICAgICAgICBldmVudExpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICBvYmplY3Q6IHRoaXMsXG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgd3JhcHBlcjogd3JhcHBlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVtb3ZlID0gZnVuY3Rpb24gKHR5cGUsbGlzdGVuZXIgLyosIHVzZUNhcHR1cmUgKHdpbGwgYmUgaWdub3JlZCkgKi8pIHtcbiAgICAgICAgZXZlbnRMaXN0ZW5lcnMuc29tZShmdW5jdGlvbiAoZXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgaWYgKHRoaXMgPT09IGV2ZW50TGlzdGVuZXIub2JqZWN0ICYmIGV2ZW50TGlzdGVuZXIudHlwZSA9PT0gdHlwZSAmJiBldmVudExpc3RlbmVyLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGlmIChcIkRPTUNvbnRlbnRMb2FkZWRcIiA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIGV2ZW50TGlzdGVuZXIud3JhcHBlcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBldmVudExpc3RlbmVyLndyYXBwZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgRWxlbWVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGFkZDtcbiAgICBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gcmVtb3ZlO1xuXG4gICAgaWYgKEhUTUxEb2N1bWVudCkge1xuICAgICAgICBIVE1MRG9jdW1lbnQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBhZGQ7XG4gICAgICAgIEhUTUxEb2N1bWVudC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IHJlbW92ZTtcbiAgICB9XG5cbiAgICBpZiAoV2luZG93KSB7XG4gICAgICAgIFdpbmRvdy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGFkZDtcbiAgICAgICAgV2luZG93LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gcmVtb3ZlO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdHlwZSA9IHJlcXVpcmUoXCIuL3R5cGVcIik7XG5cbnZhciBfX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBmb3JFYWNoKGNvbGxlY3Rpb24sIGZuLCBjb250ZXh0KSB7XG4gICAgZm4gPSBcImZ1bmN0aW9uXCIgPT09IHR5cGUoZm4pID8gZm4gOiBmdW5jdGlvbiAoKSB7fTtcblxuICAgIGlmIChcIm9iamVjdFwiID09PSB0eXBlKGNvbGxlY3Rpb24pKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gY29sbGVjdGlvbikge1xuICAgICAgICAgICAgaWYgKF9faGFzUHJvcC5jYWxsKGNvbGxlY3Rpb24sIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjb250ZXh0LCBjb2xsZWN0aW9uW3Byb3BdLCBwcm9wLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2xsZWN0aW9uLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBmbi5jYWxsKGNvbnRleHQsIGNvbGxlY3Rpb25baV0sIGksIGNvbGxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gZ2V0RmxvYXQoaW5wdXQsIGFicykge1xuICAgIGlmIChudWxsID09IGFicykge1xuICAgICAgICBhYnMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgdmFsID0gKGlucHV0ICsgXCJcIikucmVwbGFjZSgvXFxzKy8sIFwiXCIpLnJlcGxhY2UoXCIsXCIsIFwiLlwiKTtcbiAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbCk7XG5cbiAgICBpZiAoYWJzKSB7XG4gICAgICAgIHZhbCA9IE1hdGguYWJzKHZhbCk7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOKHZhbCkpIHtcbiAgICAgICAgdmFsID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEZsb2F0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnZXRGbG9hdCA9IHJlcXVpcmUoXCIuL2dldEZsb2F0XCIpO1xuXG5mdW5jdGlvbiBnZXRJbnQoaW5wdXQsIGFicykge1xuICAgIHJldHVybiBwYXJzZUludChnZXRGbG9hdChpbnB1dCwgYWJzKSwgMTApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlSW50O1xuIiwiLyoqXG4gKiBQSFAtaW5zcGlyZWQgZGF0ZVxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHBhZCA9IHJlcXVpcmUoXCIuL3BhZFwiKTtcblxudmFyIGRheVRhYmxlQ29tbW9uID0gWyAwLCAwLCAzMSwgNTksIDkwLCAxMjAsIDE1MSwgMTgxLCAyMTIsIDI0MywgMjczLCAzMDQsIDMzNCBdLFxuICAgIGRheVRhYmxlTGVhcCA9IFsgMCwgMCwgMzEsIDYwLCA5MSwgMTIxLCAxNTIsIDE4MiwgMjEzLCAyNDQsIDI3NCwgMzA1LCAzMzUgXSxcbiAgICBzaG9ydERheVR4dCA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICAgIG1vbnRoVHh0ID0gW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl07XG5cbnZhciBkYXRlID0gZnVuY3Rpb24gKGZvcm1hdCwgdGltZXN0YW1wKSB7XG4gICAgdmFyIGpzZGF0ZSA9IChudWxsID09IHRpbWVzdGFtcCA/IG5ldyBEYXRlKCkgOiAvLyBUaW1lc3RhbXAgbm90IHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgICB0aW1lc3RhbXAgaW5zdGFuY2VvZiBEYXRlID8gbmV3IERhdGUodGltZXN0YW1wKSA6IC8vIEpTIERhdGUoKVxuICAgICAgICAgICAgICAgICAgbmV3IERhdGUodGltZXN0YW1wICogMTAwMCkpLCAvLyBVTklYIHRpbWVzdGFtcCAoYXV0by1jb252ZXJ0IHRvIGludClcbiAgICAgICAgZm9ybWF0Q2hyID0gL1xcXFw/KFthLXpdKS9naSxcbiAgICAgICAgZm9ybWF0Q2hyQ2IgPSBmdW5jdGlvbiAodCwgcykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGwgIT0gZlt0XSA/IGZbdF0oKSA6IHM7XG4gICAgICAgIH07XG5cbiAgICB2YXIgZiA9IHtcbiAgICAgICAgLyogRGF5ICovXG4gICAgICAgIC8vIERheSBvZiBtb250aCB3L2xlYWRpbmcgMDsgMDEuLi4zMVxuICAgICAgICBkOiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYWQoZi5qKCksIDIsIFwiMFwiKTsgfSxcblxuICAgICAgICAvLyBTaG9ydGhhbmQgZGF5IG5hbWU7IE1vbi4uU3VuXG4gICAgICAgIEQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGYubCgpLnNsaWNlKDAsIDMpOyB9LFxuXG4gICAgICAgIC8vIERheSBvZiBtb250aDsgMS4uMzFcbiAgICAgICAgajogZnVuY3Rpb24gKCkgeyByZXR1cm4ganNkYXRlLmdldERhdGUoKTsgfSxcblxuICAgICAgICAvLyBGdWxsIGRheSBuYW1lOyBNb25kYXkuLlN1bmRheVxuICAgICAgICBsOiBmdW5jdGlvbiAoKSB7IHJldHVybiBzaG9ydERheVR4dFtmLncoKV07IH0sXG5cbiAgICAgICAgLy8gSVNPLTg2MDEgZGF5IG9mIHdlZWs7IDFbTW9uXS4uN1tTdW5dXG4gICAgICAgIE46IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGYudygpIHx8IDc7IH0sXG5cbiAgICAgICAgLy8gT3JkaW5hbCBzdWZmaXggZm9yIGRheSBvZiBtb250aDsgc3QsIG5kLCByZCwgdGhcbiAgICAgICAgUzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGogPSBmLmooKTtcbiAgICAgICAgICAgIHJldHVybiA0IDwgaiAmJiAyMSA+IGogPyBcInRoXCIgOiB7IDE6IFwic3RcIiwgMjogXCJuZFwiLCAzOiBcInJkXCIgfVtqICUgMTBdIHx8IFwidGhcIjtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBEYXkgb2Ygd2VlazsgMFtTdW5dLi42W1NhdF1cbiAgICAgICAgdzogZnVuY3Rpb24gKCkgeyByZXR1cm4ganNkYXRlLmdldERheSgpOyB9LFxuXG4gICAgICAgIC8vIERheSBvZiB5ZWFyOyAwLi4zNjVcbiAgICAgICAgejogZnVuY3Rpb24gKCkgeyByZXR1cm4gKGYuTCgpID8gZGF5VGFibGVMZWFwW2YubigpXSA6IGRheVRhYmxlQ29tbW9uW2YubigpXSkgKyBmLmooKSAtIDE7IH0sXG5cbiAgICAgICAgLyogV2VlayAqL1xuICAgICAgICAvLyBJU08tODYwMSB3ZWVrIG51bWJlclxuICAgICAgICBXOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBkYXlzIGJldHdlZW4gbWlkd2VlayBvZiB0aGlzIHdlZWsgYW5kIGphbiA0XG4gICAgICAgICAgICAvLyAoZi56KCkgLSBmLk4oKSArIDEgKyAzLjUpIC0gM1xuICAgICAgICAgICAgdmFyIG1pZFdlZWtEYXlzRnJvbUphbjQgPSBmLnooKSAtIGYuTigpICsgMS41O1xuICAgICAgICAgICAgLy8gMSArIG51bWJlciBvZiB3ZWVrcyArIHJvdW5kZWQgd2Vla1xuICAgICAgICAgICAgcmV0dXJuIHBhZCgxICsgTWF0aC5mbG9vcihNYXRoLmFicyhtaWRXZWVrRGF5c0Zyb21KYW40KSAvIDcpICsgKDMuNSA8IG1pZFdlZWtEYXlzRnJvbUphbjQgJSA3ID8gMSA6IDApLCAyLCBcIjBcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogTW9udGggKi9cbiAgICAgICAgLy8gRnVsbCBtb250aCBuYW1lOyBKYW51YXJ5Li4uRGVjZW1iZXJcbiAgICAgICAgRjogZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9udGhUeHRbanNkYXRlLmdldE1vbnRoKCldOyB9LFxuXG4gICAgICAgIC8vIE1vbnRoIHcvbGVhZGluZyAwOyAwMS4uMTJcbiAgICAgICAgbTogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFkKGYubigpLCAyLCBcIjBcIik7IH0sXG5cbiAgICAgICAgLy8gU2hvcnRoYW5kIG1vbnRoIG5hbWU7IEphbi4uRGVjXG4gICAgICAgIE06IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGYuRigpLnNsaWNlKDAsIDMpOyB9LFxuXG4gICAgICAgIC8vIE1vbnRoOyAxLi4uMTJcbiAgICAgICAgbjogZnVuY3Rpb24gKCkgeyByZXR1cm4ganNkYXRlLmdldE1vbnRoKCkgKyAxOyB9LFxuXG4gICAgICAgIC8vIERheXMgaW4gbW9udGg7IDI4Li4zMVxuICAgICAgICB0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgRGF0ZShmLlkoKSwgZi5uKCksIDApLmdldERhdGUoKTsgfSxcblxuICAgICAgICAvKiBZZWFyICovXG4gICAgICAgIC8vIElzIGxlYXAgeWVhcj87IDAgb3IgMVxuICAgICAgICBMOiBmdW5jdGlvbiAoKSB7IHJldHVybiAxID09PSBuZXcgRGF0ZShmLlkoKSwgMSwgMjkpLmdldE1vbnRoKCkgPyAxIDogMDsgfSxcblxuICAgICAgICAvLyBJU08tODYwMSB5ZWFyXG4gICAgICAgIG86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuID0gZi5uKCksXG4gICAgICAgICAgICAgICAgVyA9IGYuVygpO1xuICAgICAgICAgICAgcmV0dXJuIGYuWSgpICsgKDEyID09PSBuICYmIDkgPiBXID8gLTEgOiAxID09PSBuICYmIDkgPCBXKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBGdWxsIHllYXI7IGUuZy4gMTk4MC4uMjAxMFxuICAgICAgICBZOiBmdW5jdGlvbiAoKSB7IHJldHVybiBqc2RhdGUuZ2V0RnVsbFllYXIoKTsgfSxcblxuICAgICAgICAvLyBMYXN0IHR3byBkaWdpdHMgb2YgeWVhcjsgMDAuLjk5XG4gICAgICAgIHk6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFN0cmluZyhmLlkoKSkuc2xpY2UoLTIpOyB9LFxuXG4gICAgICAgIC8qIFRpbWUgKi9cbiAgICAgICAgLy8gYW0gb3IgcG1cbiAgICAgICAgYTogZnVuY3Rpb24gKCkgeyByZXR1cm4ganNkYXRlLmdldEhvdXJzKCkgPiAxMSA/IFwicG1cIiA6IFwiYW1cIjsgfSxcblxuICAgICAgICAvLyBBTSBvciBQTVxuICAgICAgICBBOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmLmEoKS50b1VwcGVyQ2FzZSgpOyB9LFxuXG4gICAgICAgIC8vIFN3YXRjaCBJbnRlcm5ldCB0aW1lOyAwMDAuLi45OTlcbiAgICAgICAgQjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVuaXhUaW1lID0ganNkYXRlLmdldFRpbWUoKSAvIDEwMDAsXG4gICAgICAgICAgICAgICAgc2Vjb25kc1Bhc3NlZFRvZGF5ID0gdW5peFRpbWUgJSA4NjQwMCArIDM2MDA7IC8vIHNpbmNlIGl0XCJzIGJhc2VkIG9mZiBvZiBVVEMrMVxuXG4gICAgICAgICAgICBpZiAoc2Vjb25kc1Bhc3NlZFRvZGF5IDwgMCkge1xuICAgICAgICAgICAgICAgIHNlY29uZHNQYXNzZWRUb2RheSArPSA4NjQwMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGJlYXRzID0gKChzZWNvbmRzUGFzc2VkVG9kYXkpIC8gODYuNCkgJSAxMDAwO1xuXG4gICAgICAgICAgICBpZiAodW5peFRpbWUgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChiZWF0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihiZWF0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gMTItSG91cnM7IDEuLi4xMlxuICAgICAgICBnOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmLkcoKSAlIDEyIHx8IDEyOyB9LFxuXG4gICAgICAgIC8vIDI0LUhvdXJzOyAwLi4uMjNcbiAgICAgICAgRzogZnVuY3Rpb24gKCkgeyByZXR1cm4ganNkYXRlLmdldEhvdXJzKCk7IH0sXG5cbiAgICAgICAgLy8gMTItSG91cnMgdy9sZWFkaW5nIDA7IDAxLi4uMTJcbiAgICAgICAgaDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFkKGYuZygpLCAyLCBcIjBcIik7IH0sXG5cbiAgICAgICAgLy8gMjQtSG91cnMgdy9sZWFkaW5nIDA7IDAwLi4uMjNcbiAgICAgICAgSDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFkKGYuRygpLCAyLCBcIjBcIik7IH0sXG5cbiAgICAgICAgLy8gTWludXRlcyB3L2xlYWRpbmcgMDsgMDAuLi41OVxuICAgICAgICBpOiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYWQoanNkYXRlLmdldE1pbnV0ZXMoKSwgMiwgXCIwXCIpOyB9LFxuXG4gICAgICAgIC8vIFNlY29uZHMgdy9sZWFkaW5nIDA7IDAwLi4uNTlcbiAgICAgICAgczogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFkKGpzZGF0ZS5nZXRTZWNvbmRzKCksIDIsIFwiMFwiKTsgfSxcblxuICAgICAgICAvLyBNaWNyb3NlY29uZHM7IDAwMDAwMC05OTkwMDBcbiAgICAgICAgdTogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGFkKGpzZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAqIDEwMDAsIDYsIFwiMFwiKTsgfSxcblxuICAgICAgICAvLyBXaGV0aGVyIG9yIG5vdCB0aGUgZGF0ZSBpcyBpbiBkYXlsaWdodCBzYXZpbmdzIHRpbWVcbiAgICAgICAgLypcbiAgICAgICAgSTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gQ29tcGFyZXMgSmFuIDEgbWludXMgSmFuIDEgVVRDIHRvIEp1bCAxIG1pbnVzIEp1bCAxIFVUQy5cbiAgICAgICAgICAgIC8vIElmIHRoZXkgYXJlIG5vdCBlcXVhbCwgdGhlbiBEU1QgaXMgb2JzZXJ2ZWQuXG4gICAgICAgICAgICB2YXIgWSA9IGYuWSgpO1xuICAgICAgICAgICAgcmV0dXJuIDAgKyAobmV3IERhdGUoWSwgMCkgLSBEYXRlLlVUQyhZLCAwKSkgIT09IChuZXcgRGF0ZShZLCA2KSAtIERhdGUuVVRDKFksIDYpKTtcbiAgICAgICAgfSxcbiAgICAgICAgKi9cblxuICAgICAgICAvLyBEaWZmZXJlbmNlIHRvIEdNVCBpbiBob3VyIGZvcm1hdDsgZS5nLiArMDIwMFxuICAgICAgICBPOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdHpvID0ganNkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgdHpvTnVtID0gTWF0aC5hYnModHpvKTtcbiAgICAgICAgICAgIHJldHVybiAoMCA8IHR6byA/IFwiLVwiIDogXCIrXCIpICsgcGFkKE1hdGguZmxvb3IodHpvTnVtIC8gNjApICogMTAwICsgdHpvTnVtICUgNjAsIDQsIFwiMFwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBEaWZmZXJlbmNlIHRvIEdNVCB3L2NvbG9uOyBlLmcuICswMjowMFxuICAgICAgICBQOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgTyA9IGYuTygpO1xuICAgICAgICAgICAgcmV0dXJuIChPLnN1YnN0cigwLCAzKSArIFwiOlwiICsgTy5zdWJzdHIoMywgMikpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRpbWV6b25lIG9mZnNldCBpbiBzZWNvbmRzICgtNDMyMDAuLjUwNDAwKVxuICAgICAgICBaOiBmdW5jdGlvbiAoKSB7IHJldHVybiAtanNkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDsgfSxcblxuICAgICAgICAvLyBGdWxsIERhdGUvVGltZSwgSVNPLTg2MDEgZGF0ZVxuICAgICAgICBjOiBmdW5jdGlvbiAoKSB7IHJldHVybiBcIlktbS1kXFxcXFRIOmk6c1BcIi5yZXBsYWNlKGZvcm1hdENociwgZm9ybWF0Q2hyQ2IpOyB9LFxuXG4gICAgICAgIC8vIFJGQyAyODIyXG4gICAgICAgIHI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwiRCwgZCBNIFkgSDppOnMgT1wiLnJlcGxhY2UoZm9ybWF0Q2hyLCBmb3JtYXRDaHJDYik7IH0sXG5cbiAgICAgICAgLy8gU2Vjb25kcyBzaW5jZSBVTklYIGVwb2NoXG4gICAgICAgIFU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGpzZGF0ZS5nZXRUaW1lKCkgLyAxMDAwIHx8IDA7IH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKGZvcm1hdENociwgZm9ybWF0Q2hyQ2IpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkYXRlO1xuIiwiLyoqXG4gKiBGb3JtYXRzIHRoZSB2YWx1ZSBsaWtlIGEgXCJodW1hbi1yZWFkYWJsZVwiIGZpbGUgc2l6ZSAoaS5lLiBcIjEzIEtCXCIsIFwiNC4xIE1CXCIsIFwiMTAyIGJ5dGVzXCIsIGV0YykuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKiBJZiB2YWx1ZSBpcyAxMjM0NTY3ODksIHRoZSBvdXRwdXQgd291bGQgYmUgMTE3LjcgTUIuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW50d29yZCA9IHJlcXVpcmUoXCIuL2ludHdvcmRcIik7XG5cbnZhciBmaWxlc2l6ZSA9IGZ1bmN0aW9uIChmaWxlc2l6ZSwga2lsbywgZGVjaW1hbHMsIGRlY1BvaW50LCB0aG91c2FuZHNTZXAsIHN1ZmZpeFNlcCkge1xuICAgIGtpbG8gPSBudWxsID09IGtpbG8gPyAxMDI0IDoga2lsbztcbiAgICBpZiAoMCA+PSBmaWxlc2l6ZSkge1xuICAgICAgICByZXR1cm4gXCIwIGJ5dGVzXCI7XG4gICAgfVxuICAgIGlmIChmaWxlc2l6ZSA8IGtpbG8gJiYgbnVsbCA9PSBkZWNpbWFscykge1xuICAgICAgICBkZWNpbWFscyA9IDA7XG4gICAgfVxuICAgIGlmIChudWxsID09IHN1ZmZpeFNlcCkge1xuICAgICAgICBzdWZmaXhTZXAgPSBcIiBcIjtcbiAgICB9XG4gICAgcmV0dXJuIGludHdvcmQoZmlsZXNpemUsIFsgXCJieXRlc1wiLCBcIktCXCIsIFwiTUJcIiwgXCJHQlwiLCBcIlRCXCIsIFwiUEJcIiBdLCBraWxvLCBkZWNpbWFscywgZGVjUG9pbnQsIHRob3VzYW5kc1NlcCwgc3VmZml4U2VwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsZXNpemU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGF0ZTogcmVxdWlyZShcIi4vZGF0ZVwiKSxcbiAgICBmaWxlc2l6ZTogcmVxdWlyZShcIi4vZmlsZXNpemVcIiksXG4gICAgaW50d29yZDogcmVxdWlyZShcIi4vaW50d29yZFwiKSxcbiAgICBsaW5lYnJlYWtzOiByZXF1aXJlKFwiLi9saW5lYnJlYWtzXCIpLFxuICAgIG5hdHVyYWxEYXk6IHJlcXVpcmUoXCIuL25hdHVyYWxEYXlcIiksXG4gICAgbmwyYnI6IHJlcXVpcmUoXCIuL25sMmJyXCIpLFxuICAgIG51bWJlckZvcm1hdDogcmVxdWlyZShcIi4vbnVtYmVyRm9ybWF0XCIpLFxuICAgIG9yZGluYWw6IHJlcXVpcmUoXCIuL29yZGluYWxcIiksXG4gICAgcGFkOiByZXF1aXJlKFwiLi9wYWRcIiksXG4gICAgcmVsYXRpdmVUaW1lOiByZXF1aXJlKFwiLi9yZWxhdGl2ZVRpbWVcIiksXG4gICAgdGltZTogcmVxdWlyZShcIi4vdGltZVwiKSxcbiAgICB0cnVuY2F0ZWNoYXJzOiByZXF1aXJlKFwiLi90cnVuY2F0ZWNoYXJzXCIpLFxuICAgIHRydW5jYXRld29yZHM6IHJlcXVpcmUoXCIuL3RydW5jYXRld29yZHNcIilcbn07XG4iLCIvKipcbiAqIEZvcm1hdHMgdGhlIHZhbHVlIGxpa2UgYSBcImh1bWFuLXJlYWRhYmxlXCIgbnVtYmVyIChpLmUuIFwiMTMgS1wiLCBcIjQuMSBNXCIsIFwiMTAyXCIsIGV0YykuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKiBJZiB2YWx1ZSBpcyAxMjM0NTY3ODksIHRoZSBvdXRwdXQgd291bGQgYmUgMTE3LjcgTS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBudW1iZXJGb3JtYXQgPSByZXF1aXJlKFwiLi9udW1iZXJGb3JtYXRcIik7XG5cbnZhciBpbnR3b3JkID0gZnVuY3Rpb24gKG51bWJlciwgdW5pdHMsIGtpbG8sIGRlY2ltYWxzLCBkZWNQb2ludCwgdGhvdXNhbmRzU2VwLCBzdWZmaXhTZXApIHtcbiAgICB2YXIgaHVtYW5pemVkLCB1bml0O1xuXG4gICAgdW5pdHMgPSB1bml0cyB8fCBbXCJcIiwgXCJLXCIsIFwiTVwiLCBcIkJcIiwgXCJUXCJdO1xuICAgIHVuaXQgPSB1bml0cy5sZW5ndGggLSAxO1xuICAgIGtpbG8gPSBraWxvIHx8IDEwMDA7XG4gICAgZGVjaW1hbHMgPSBpc05hTihkZWNpbWFscykgPyAyIDogTWF0aC5hYnMoZGVjaW1hbHMpO1xuICAgIGRlY1BvaW50ID0gZGVjUG9pbnQgfHwgXCIuXCI7XG4gICAgdGhvdXNhbmRzU2VwID0gdGhvdXNhbmRzU2VwIHx8IFwiLFwiO1xuICAgIHN1ZmZpeFNlcCA9IHN1ZmZpeFNlcCB8fCBcIlwiO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHVuaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChNYXRoLnBvdyhraWxvLCBpICsgMSkgPiBudW1iZXIpIHtcbiAgICAgICAgICAgIHVuaXQgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaHVtYW5pemVkID0gbnVtYmVyIC8gTWF0aC5wb3coa2lsbywgdW5pdCk7XG5cbiAgICB2YXIgc3VmZml4ID0gdW5pdHNbdW5pdF0gPyBzdWZmaXhTZXAgKyB1bml0c1t1bml0XSA6IFwiXCI7XG4gICAgcmV0dXJuIG51bWJlckZvcm1hdChodW1hbml6ZWQsIGRlY2ltYWxzLCBkZWNQb2ludCwgdGhvdXNhbmRzU2VwKSArIHN1ZmZpeDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW50d29yZDtcbiIsIi8qKlxuICogUmVwbGFjZXMgbGluZSBicmVha3MgaW4gcGxhaW4gdGV4dCB3aXRoIGFwcHJvcHJpYXRlIEhUTUxcbiAqIEEgc2luZ2xlIG5ld2xpbmUgYmVjb21lcyBhbiBIVE1MIGxpbmUgYnJlYWsgKDxici8+KSBhbmQgYSBuZXcgbGluZSBmb2xsb3dlZCBieSBhIGJsYW5rIGxpbmUgYmVjb21lcyBhIHBhcmFncmFwaCBicmVhayAoPC9wPikuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKiBJZiB2YWx1ZSBpcyBKb2VsXFxuaXMgYVxcblxcbnNsdWcsIHRoZSBvdXRwdXQgd2lsbCBiZSA8cD5Kb2VsPGJyIC8+aXMgYTwvcD48cD5zbHVnPC9wPlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGxpbmVicmVha3MgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgLy8gcmVtb3ZlIGJlZ2lubmluZyBhbmQgZW5kaW5nIG5ld2xpbmVzXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoL14oW1xcbnxcXHJdKikvLCBcIlwiKTtcbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvKFtcXG58XFxyXSopJC8sIFwiXCIpO1xuXG4gICAgLy8gbm9ybWFsaXplIGFsbCB0byBcXG5cbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nLCBcIlxcblwiKTtcblxuICAgIC8vIGFueSBjb25zZWN1dGl2ZSBuZXcgbGluZXMgbW9yZSB0aGFuIDIgZ2V0cyB0dXJuZWQgaW50byBwIHRhZ3NcbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvKFxcbnsyLH0pL2csIFwiPC9wPjxwPlwiKTtcblxuICAgIC8vIGFueSB0aGF0IGFyZSBzaW5nbGV0b25zIGdldCB0dXJuZWQgaW50byBiclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXG4vZywgXCI8YnIgLz5cIik7XG4gICAgcmV0dXJuIFwiPHA+XCIgKyBzdHIgKyBcIjwvcD5cIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGluZWJyZWFrcztcbiIsIi8qKlxuICogRm9yIGRhdGVzIHRoYXQgYXJlIHRoZSBjdXJyZW50IGRheSBvciB3aXRoaW4gb25lIGRheSwgcmV0dXJuICd0b2RheScsICd0b21vcnJvdycgb3IgJ3llc3RlcmRheScsIGFzIGFwcHJvcHJpYXRlLlxuICogT3RoZXJ3aXNlLCBmb3JtYXQgdGhlIGRhdGUgdXNpbmcgdGhlIHBhc3NlZCBpbiBmb3JtYXQgc3RyaW5nLlxuICpcbiAqIEV4YW1wbGVzICh3aGVuICd0b2RheScgaXMgMTcgRmViIDIwMDcpOlxuICogMTYgRmViIDIwMDcgYmVjb21lcyB5ZXN0ZXJkYXkuXG4gKiAxNyBGZWIgMjAwNyBiZWNvbWVzIHRvZGF5LlxuICogMTggRmViIDIwMDcgYmVjb21lcyB0b21vcnJvdy5cbiAqIEFueSBvdGhlciBkYXkgaXMgZm9ybWF0dGVkIGFjY29yZGluZyB0byBnaXZlbiBhcmd1bWVudCBvciB0aGUgREFURV9GT1JNQVQgc2V0dGluZyBpZiBubyBhcmd1bWVudCBpcyBnaXZlbi5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB0aW1lID0gcmVxdWlyZShcIi4vdGltZVwiKSxcbiAgICBkYXRlID0gcmVxdWlyZShcIi4vZGF0ZVwiKTtcblxudmFyIG5hdHVyYWxEYXkgPSBmdW5jdGlvbiAodGltZXN0YW1wLCBmb3JtYXQpIHtcbiAgICB0aW1lc3RhbXAgPSBudWxsID09IHRpbWVzdGFtcCA/IHRpbWUoKSA6IHRpbWVzdGFtcDtcbiAgICBmb3JtYXQgPSBudWxsID09IGZvcm1hdCA/IFwiWS1tLWRcIiA6IGZvcm1hdDtcblxuICAgIHZhciBvbmVEYXkgPSA4NjQwMCxcbiAgICAgICAgZCA9IG5ldyBEYXRlKCksXG4gICAgICAgIHRvZGF5ID0gbmV3IERhdGUoZC5nZXRGdWxsWWVhcigpLCBkLmdldE1vbnRoKCksIGQuZ2V0RGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwO1xuXG4gICAgaWYgKHRpbWVzdGFtcCA8IHRvZGF5ICYmIHRpbWVzdGFtcCA+PSB0b2RheSAtIG9uZURheSkge1xuICAgICAgICByZXR1cm4gXCJ5ZXN0ZXJkYXlcIjtcbiAgICB9XG4gICAgaWYgKHRpbWVzdGFtcCA+PSB0b2RheSAmJiB0aW1lc3RhbXAgPCB0b2RheSArIG9uZURheSkge1xuICAgICAgICByZXR1cm4gXCJ0b2RheVwiO1xuICAgIH1cbiAgICBpZiAodGltZXN0YW1wID49IHRvZGF5ICsgb25lRGF5ICYmIHRpbWVzdGFtcCA8IHRvZGF5ICsgMiAqIG9uZURheSkge1xuICAgICAgICByZXR1cm4gXCJ0b21vcnJvd1wiO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRlKGZvcm1hdCwgdGltZXN0YW1wKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0dXJhbERheTtcbiIsIi8qKlxuICogQ29udmVydHMgYWxsIG5ld2xpbmVzIGluIGEgcGllY2Ugb2YgcGxhaW4gdGV4dCB0byBIVE1MIGxpbmUgYnJlYWtzICg8YnIgLz4pLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIG5sMmJyID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nLCBcIjxici8+XCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBubDJicjtcbiIsIi8qKlxuICogRm9ybWF0IG51bWJlciBieSBhZGRpbmcgdGhvdXNhbmRzIHNlcGFyYXRlcnMgYW5kIHNpZ25pZmljYW50IGRpZ2l0cyB3aGlsZSByb3VuZGluZ1xuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIG51bWJlckZvcm1hdCA9IGZ1bmN0aW9uIChudW1iZXIsIGRlY2ltYWxzLCBkZWNQb2ludCwgdGhvdXNhbmRzU2VwKSB7XG4gICAgZGVjaW1hbHMgPSBpc05hTihkZWNpbWFscykgPyAyIDogTWF0aC5hYnMoZGVjaW1hbHMpO1xuICAgIGRlY1BvaW50ID0gbnVsbCA9PSBkZWNQb2ludCA/IFwiLlwiIDogZGVjUG9pbnQ7XG4gICAgdGhvdXNhbmRzU2VwID0gKG51bGwgPT0gdGhvdXNhbmRzU2VwKSA/IFwiLFwiIDogdGhvdXNhbmRzU2VwO1xuXG4gICAgdmFyIHNpZ24gPSAwID4gbnVtYmVyID8gXCItXCIgOiBcIlwiO1xuICAgIG51bWJlciA9IE1hdGguYWJzKCtudW1iZXIgfHwgMCk7XG5cbiAgICB2YXIgaW50UGFydCA9IHBhcnNlSW50KG51bWJlci50b0ZpeGVkKGRlY2ltYWxzKSwgMTApICsgXCJcIixcbiAgICAgICAgaiA9IGludFBhcnQubGVuZ3RoID4gMyA/IGludFBhcnQubGVuZ3RoICUgMyA6IDA7XG5cbiAgICByZXR1cm4gc2lnbiArIChqID8gaW50UGFydC5zdWJzdHIoMCwgaikgKyB0aG91c2FuZHNTZXAgOiBcIlwiKSArIGludFBhcnQuc3Vic3RyKGopLnJlcGxhY2UoLyhcXGR7M30pKD89XFxkKS9nLCBcIiQxXCIgKyB0aG91c2FuZHNTZXApICsgKGRlY2ltYWxzID8gZGVjUG9pbnQgKyBNYXRoLmFicyhudW1iZXIgLSBpbnRQYXJ0KS50b0ZpeGVkKGRlY2ltYWxzKS5zbGljZSgyKSA6IFwiXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBudW1iZXJGb3JtYXQ7XG4iLCIvKipcbiAqIENvbnZlcnRzIGFuIGludGVnZXIgdG8gaXRzIG9yZGluYWwgYXMgYSBzdHJpbmcuXG4gKlxuICogMSBiZWNvbWVzIDFzdFxuICogMiBiZWNvbWVzIDJuZFxuICogMyBiZWNvbWVzIDNyZCBldGNcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBvcmRpbmFsID0gZnVuY3Rpb24gKG51bWJlcikge1xuICAgIG51bWJlciA9IHBhcnNlSW50KG51bWJlciwgMTApO1xuICAgIG51bWJlciA9IGlzTmFOKG51bWJlcikgPyAwIDogbnVtYmVyO1xuICAgIHZhciBzaWduID0gbnVtYmVyIDwgMCA/IFwiLVwiIDogXCJcIjtcbiAgICBudW1iZXIgPSBNYXRoLmFicyhudW1iZXIpO1xuICAgIHZhciB0ZW5zID0gbnVtYmVyICUgMTAwO1xuXG4gICAgcmV0dXJuIHNpZ24gKyBudW1iZXIgKyAodGVucyA+IDQgJiYgdGVucyA8IDIxID8gXCJ0aFwiIDogeyAxOiBcInN0XCIsIDI6IFwibmRcIiwgMzogXCJyZFwiIH1bbnVtYmVyICUgMTBdIHx8IFwidGhcIik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9yZGluYWw7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHBhZCA9IGZ1bmN0aW9uIChzdHIsIGNvdW50LCBwYWRDaGFyLCB0eXBlKSB7XG4gICAgc3RyICs9IFwiXCI7IC8vIEVuc3VyZSBzdHJpbmdcblxuICAgIGlmICghcGFkQ2hhcikge1xuICAgICAgICBwYWRDaGFyID0gXCIgXCI7XG4gICAgfSBlbHNlIGlmICgxIDwgcGFkQ2hhci5sZW5ndGgpIHtcbiAgICAgICAgcGFkQ2hhciA9IHBhZENoYXIuY2hhckF0KDApO1xuICAgIH1cblxuICAgIHR5cGUgPSBudWxsID09IHR5cGUgPyBcImxlZnRcIiA6IFwicmlnaHRcIjtcblxuICAgIGlmIChcInJpZ2h0XCIgPT09IHR5cGUpIHtcbiAgICAgICAgd2hpbGUgKGNvdW50ID4gc3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgc3RyICs9IHBhZENoYXI7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEZWZhdWx0IHRvIGxlZnRcbiAgICAgICAgd2hpbGUgKGNvdW50ID4gc3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgc3RyID0gcGFkQ2hhciArIHN0cjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdHI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZDtcbiIsIi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRpbmcgaG93IG1hbnkgc2Vjb25kcywgbWludXRlcyBvciBob3VycyBhZ28gaXQgd2FzIG9yIHdpbGwgYmUgaW4gdGhlIGZ1dHVyZVxuICogV2lsbCBhbHdheXMgcmV0dXJuIGEgcmVsYXRpdmUgdGltZSwgbW9zdCBncmFudWxhciBvZiBzZWNvbmRzIHRvIGxlYXN0IGdyYW51bGFyIG9mIHllYXJzLiBTZWUgdW5pdCB0ZXN0cyBmb3IgbW9yZSBkZXRhaWxzXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgdGltZSA9IHJlcXVpcmUoXCIuL3RpbWVcIiksXG4gICAgZGF0ZSA9IHJlcXVpcmUoXCIuL2RhdGVcIik7XG5cbnZhciByZWxhdGl2ZVRpbWUgPSBmdW5jdGlvbiAodGltZXN0YW1wKSB7XG4gICAgdGltZXN0YW1wID0gbnVsbCA9PSB0aW1lc3RhbXAgPyB0aW1lKCkgOiB0aW1lc3RhbXA7XG5cbiAgICB2YXIgY3VyclRpbWUgPSB0aW1lKCksXG4gICAgICAgIHRpbWVEaWZmID0gY3VyclRpbWUgLSB0aW1lc3RhbXA7XG5cbiAgICAvLyB3aXRoaW4gMiBzZWNvbmRzXG4gICAgaWYgKDIgPiB0aW1lRGlmZiAmJiAtMiA8IHRpbWVEaWZmKSB7XG4gICAgICAgIHJldHVybiAoMCA8PSB0aW1lRGlmZiA/IFwianVzdCBcIiA6IFwiXCIpICsgXCJub3dcIjtcbiAgICB9XG5cbiAgICAvLyB3aXRoaW4gYSBtaW51dGVcbiAgICBpZiAoNjAgPiB0aW1lRGlmZiAmJiAtNjAgPCB0aW1lRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSB0aW1lRGlmZiA/IE1hdGguZmxvb3IodGltZURpZmYpICsgXCIgc2Vjb25kcyBhZ29cIiA6IFwiaW4gXCIgKyBNYXRoLmZsb29yKC10aW1lRGlmZikgKyBcIiBzZWNvbmRzXCI7XG4gICAgfVxuXG4gICAgLy8gd2l0aGluIDIgbWludXRlc1xuICAgIGlmICgxMjAgPiB0aW1lRGlmZiAmJiAtMTIwIDwgdGltZURpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0gdGltZURpZmYgPyBcImFib3V0IGEgbWludXRlIGFnb1wiIDogXCJpbiBhYm91dCBhIG1pbnV0ZVwiO1xuICAgIH1cblxuICAgIC8vIHdpdGhpbiBhbiBob3VyXG4gICAgaWYgKDM2MDAgPiB0aW1lRGlmZiAmJiAtMzYwMCA8IHRpbWVEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IHRpbWVEaWZmID8gTWF0aC5mbG9vcih0aW1lRGlmZiAvIDYwKSArIFwiIG1pbnV0ZXMgYWdvXCIgOiBcImluIFwiICsgTWF0aC5mbG9vcigtdGltZURpZmYgLyA2MCkgKyBcIiBtaW51dGVzXCI7XG4gICAgfVxuXG4gICAgLy8gd2l0aGluIDIgaG91cnNcbiAgICBpZiAoNzIwMCA+IHRpbWVEaWZmICYmIC03MjAwIDwgdGltZURpZmYpIHtcbiAgICAgICAgcmV0dXJuIDAgPD0gdGltZURpZmYgPyBcImFib3V0IGFuIGhvdXIgYWdvXCIgOiBcImluIGFib3V0IGFuIGhvdXJcIjtcbiAgICB9XG5cbiAgICAvLyB3aXRoaW4gMjQgaG91cnNcbiAgICBpZiAoODY0MDAgPiB0aW1lRGlmZiAmJiAtODY0MDAgPCB0aW1lRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSB0aW1lRGlmZiA/IE1hdGguZmxvb3IodGltZURpZmYgLyAzNjAwKSArIFwiIGhvdXJzIGFnb1wiIDogXCJpbiBcIiArIE1hdGguZmxvb3IodGltZURpZmYgLyAzNjAwKSArIFwiIGhvdXJzXCI7XG4gICAgfVxuXG4gICAgLy8gd2l0aGluIDIgZGF5c1xuICAgIHZhciBkYXlzMiA9IDIgKiA4NjQwMDtcbiAgICBpZiAoZGF5czIgPiB0aW1lRGlmZiAmJiAtZGF5czIgPCB0aW1lRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSB0aW1lRGlmZiA/IE1hdGguZmxvb3IodGltZURpZmYgLyA4NjQwMCkgKyBcIiBkYXlzIGFnb1wiIDogXCJpbiBcIiArIE1hdGguZmxvb3IoLXRpbWVEaWZmIC8gODY0MDApICsgXCIgZGF5c1wiO1xuICAgIH1cblxuICAgIC8vIHdpdGhpbiA2MCBkYXlzXG4gICAgdmFyIGRheXM2MCA9IDYwICogODY0MDA7XG4gICAgaWYgKGRheXM2MCA+IHRpbWVEaWZmICYmIC1kYXlzNjAgPCB0aW1lRGlmZikge1xuICAgICAgICByZXR1cm4gMCA8PSB0aW1lRGlmZiA/IFwiYWJvdXQgYSBtb250aCBhZ29cIiA6IFwiaW4gYWJvdXQgYSBtb250aFwiO1xuICAgIH1cblxuICAgIHZhciBjdXJyVGltZVllYXJzID0gcGFyc2VJbnQoZGF0ZShcIllcIiwgY3VyclRpbWUpLCAxMCksXG4gICAgICAgIHRpbWVzdGFtcFllYXJzID0gcGFyc2VJbnQoZGF0ZShcIllcIiwgdGltZXN0YW1wKSwgMTApLFxuICAgICAgICBjdXJyVGltZU1vbnRocyA9IGN1cnJUaW1lWWVhcnMgKiAxMiArIHBhcnNlSW50KGRhdGUoXCJuXCIsIGN1cnJUaW1lKSwgMTApLFxuICAgICAgICB0aW1lc3RhbXBNb250aHMgPSB0aW1lc3RhbXBZZWFycyAqIDEyICsgcGFyc2VJbnQoZGF0ZShcIm5cIiwgdGltZXN0YW1wKSwgMTApO1xuXG4gICAgLy8gd2l0aGluIGEgeWVhclxuICAgIHZhciBtb250aERpZmYgPSBjdXJyVGltZU1vbnRocyAtIHRpbWVzdGFtcE1vbnRocztcbiAgICBpZiAoMTIgPiBtb250aERpZmYgJiYgLTEyIDwgbW9udGhEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IG1vbnRoRGlmZiA/IG1vbnRoRGlmZiArIFwiIG1vbnRocyBhZ29cIiA6IFwiaW4gXCIgKyAoLW1vbnRoRGlmZikgKyBcIiBtb250aHNcIjtcbiAgICB9XG5cbiAgICB2YXIgeWVhckRpZmYgPSBjdXJyVGltZVllYXJzIC0gdGltZXN0YW1wWWVhcnM7XG4gICAgaWYgKDIgPiB5ZWFyRGlmZiAmJiAtMiA8IHllYXJEaWZmKSB7XG4gICAgICAgIHJldHVybiAwIDw9IHllYXJEaWZmID8gXCJhIHllYXIgYWdvXCIgOiBcImluIGEgeWVhclwiO1xuICAgIH1cblxuICAgIHJldHVybiAwIDw9IHllYXJEaWZmID8geWVhckRpZmYgKyBcIiB5ZWFycyBhZ29cIiA6IFwiaW4gXCIgKyAoLXllYXJEaWZmKSArIFwiIHllYXJzXCI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbGF0aXZlVGltZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKG51bGwgIT0gRGF0ZS5ub3cgPyBEYXRlLm5vdygpIDogbmV3IERhdGUoKS5nZXRUaW1lKCkpIC8gMTAwMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGltZTtcbiIsIi8qKlxuICogVHJ1bmNhdGVzIGEgc3RyaW5nIGlmIGl0IGlzIGxvbmdlciB0aGFuIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIGNoYXJhY3RlcnMuXG4gKiBUcnVuY2F0ZWQgc3RyaW5ncyB3aWxsIGVuZCB3aXRoIGEgdHJhbnNsYXRhYmxlIGVsbGlwc2lzIHNlcXVlbmNlIChcIuKAplwiKS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB0cnVuY2F0ZWNoYXJzID0gZnVuY3Rpb24gKHN0cmluZywgbGVuZ3RoKSB7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPD0gbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHIoMCwgbGVuZ3RoKSArIFwi4oCmXCI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRydW5jYXRlY2hhcnM7XG4iLCIvKipcbiAqIFRydW5jYXRlcyBhIHN0cmluZyBhZnRlciBhIGNlcnRhaW4gbnVtYmVyIG9mIHdvcmRzLlxuICogTmV3bGluZXMgd2l0aGluIHRoZSBzdHJpbmcgd2lsbCBiZSByZW1vdmVkLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHRydW5jYXRld29yZHMgPSBmdW5jdGlvbiAoc3RyaW5nLCBudW1Xb3Jkcykge1xuICAgIHZhciB3b3JkcyA9IHN0cmluZy5zcGxpdCgnICcpO1xuXG4gICAgaWYgKHdvcmRzLmxlbmd0aCA8IG51bVdvcmRzKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdvcmRzLnNsaWNlKDAsIG51bVdvcmRzKS5qb2luKCcgJykgKyBcIuKAplwiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0cnVuY2F0ZXdvcmRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzbGljZXIgPSByZXF1aXJlKFwiLi9zbGljZXJcIik7XG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgICBsb2cuaGlzdG9yeS5wdXNoKGFyZ3VtZW50cyk7XG4gICAgY29uc29sZS5sb2coc2xpY2VyKGFyZ3VtZW50cykpO1xufVxuXG5sb2cuaGlzdG9yeSA9IFtdO1xuXG5sb2cuZGJnID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHN0ciA9IFwiREVCVUc6IFwiICsgc3RyO1xuICAgIGxvZy5oaXN0b3J5LnB1c2goc3RyKTtcbiAgICBjb25zb2xlLmRlYnVnKHN0cik7XG59O1xuXG5sb2cuZXJyID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGxvZy5oaXN0b3J5LnB1c2goXCJFUlJPUjogXCIgKyBzdHIpO1xuICAgIGNvbnNvbGUuZXJyb3Ioc3RyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbG9nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBuYXRpdmVSYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUsXG4gICAgbGFzdFRpbWUgPSAwO1xuXG52YXIgcmFmID0gbmF0aXZlUmFmIHx8IGZ1bmN0aW9uIChmbikge1xuICAgIHZhciBjdXJyVGltZSA9IERhdGUubm93KCksXG4gICAgICAgIHRpbWVEZWxheSA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZURlbGF5O1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmbihEYXRlLm5vdygpKTtcbiAgICB9LCB0aW1lRGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByYWY7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2xpY2VyKC8qIGFyciAqLyBpdGVtcywgLyogaW50ICovIHN0YXJ0KSB7XG4gICAgaWYgKG51bGwgPT0gc3RhcnQpIHtcbiAgICAgICAgc3RhcnQgPSAwO1xuICAgIH1cblxuICAgIHZhciBsZW4gPSBpdGVtcy5sZW5ndGg7XG4gICAgdmFyIGFyciA9IG5ldyBBcnJheShsZW4gLSBzdGFydCk7XG5cbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBhcnJbaSAtIHN0YXJ0XSA9IGl0ZW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2xpY2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHRyaW0odGV4dCkge1xuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL15cXHMrfFxccyskLywgXCJcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJpbTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX190b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgY2xhc3NUb1R5cGUgPSB7fSxcbiAgICBuYW1lcyA9IChcIkJvb2xlYW58TnVtYmVyfFN0cmluZ3xGdW5jdGlvbnxBcnJheXxEYXRlfFJlZ0V4cHxVbmRlZmluZWR8TnVsbFwiKS5zcGxpdChcInxcIiksXG4gICAgbiA9IG51bGw7XG5cbndoaWxlKG51bGwgIT0gKG4gPSBuYW1lcy5wb3AoKSkpIHtcbiAgICBjbGFzc1RvVHlwZVtcIltvYmplY3QgXCIgKyBuICsgXCJdXCJdID0gbi50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiB0eXBlKG9iaikge1xuICAgIHZhciBzdHJUeXBlID0gX190b1N0cmluZy5jYWxsKG9iaik7XG4gICAgcmV0dXJuIGNsYXNzVG9UeXBlW3N0clR5cGVdIHx8IFwib2JqZWN0XCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZTtcbiJdfQ==
