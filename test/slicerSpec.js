"use strict";

var slicer = utils.slicer,
    type = utils.type;

describe("slicer.js", function() {
    it("should be `[1, 2]`", function() {
        expect(slicer([1, 2])).toEqual([1, 2]);
    });

    it("should be `['a', 'b']`", function() {
        function fake() {
            return arguments;
        }

        var ret = slicer(fake("a", "b"));
        expect(type(ret)).toBe("array");
        expect(ret).toEqual(["a", "b"]);
    });
});
