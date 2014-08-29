"use strict";

describe("type.js", function() {

    var type = utils.type;

    it("should be 'boolean'", function() {
        expect(type(true)).toBe("boolean");
    });

    it("should be 'number'", function() {
        expect(type(1)).toBe("number");
    });

    it("should be 'string'", function() {
        expect(type("")).toBe("string");
    });

    it("should be 'function'", function() {
        expect(type(function() {})).toBe("function");
    });

    it("should be 'array'", function() {
        expect(type([])).toBe("array");
    });

    it("should be 'date'", function() {
        expect(type(new Date())).toBe("date");
    });

    it("should be 'regexp'", function() {
        expect(type(/\d+/)).toBe("regexp");
    });

    it("should be 'undefined'", function() {
        expect(type(undefined)).toBe("undefined");
    });

    it("should be 'null'", function() {
        expect(type(null)).toBe("null");
    });

    it("should be 'object'", function() {
        expect(type({})).toBe("object");
    });
});
