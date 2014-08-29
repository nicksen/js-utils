"use strict";

var getFloat = utils.getFloat;

describe("getFloat.js", function() {
    it("should be `10.2`", function() {
        expect(getFloat("10.2")).toBe(10.2);
    });

    it("should be `10.2`", function() {
        expect(getFloat(10.2)).toBe(10.2);
    });

    it("should be `1`", function() {
        expect(getFloat("1")).toBe(1);
    });

    it("should be `1`", function() {
        expect(getFloat(1)).toBe(1);
    });

    it("should be `0`", function() {
        expect(getFloat("")).toBe(0);
    });
});
