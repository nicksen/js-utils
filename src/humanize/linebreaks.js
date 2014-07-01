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
