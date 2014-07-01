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
