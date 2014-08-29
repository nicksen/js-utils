"use strict";

var trim = utils.trim;

describe("trim.js", function() {
    it("should trim empty string", function() {
        expect(trim("")).toBe("");
        expect(trim(" ")).toBe("");
        expect(trim("  ")).toBe("");
    });

    it("should trim start and end", function() {
        expect(trim("a ")).toBe("a");
        expect(trim(" a")).toBe("a");
    });

    it("should not trim in between", function() {
        expect(trim("a b")).toBe("a b");
    });
});
