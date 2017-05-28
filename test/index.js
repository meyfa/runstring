"use strict";

var index = require("../");

describe("index", function () {

    it("should return a string", function () {
        var result = index(function () {});
        if (typeof result !== "string") {
            throw new Error("expected a string but got " + typeof result);
        }
    });

});
