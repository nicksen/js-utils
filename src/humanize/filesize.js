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
