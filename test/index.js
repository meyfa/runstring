"use strict";

var index = require("../");

describe("index", function () {

    describe("function stringification", function () {

        it("should return a string", function () {
            var result = index(function () {});
            if (typeof result !== "string") {
                throw new Error("expected a string but got " + typeof result);
            }
        });

        it("should start with a semicolon", function () {
            var result = index(function () {});
            if (!/^;/.test(result)) {
                throw new Error("not starting with a semicolon: " + result);
            }
        });

        it("should end with a semicolon", function () {
            var result = index(function () {});
            if (!/;$/.test(result)) {
                throw new Error("not ending with a semicolon: " + result);
            }
        });

        it("should be an IIFE", function () {
            var result = index(function () {});
            if (!/\(function .*\)\(.*\)/.test(result)) {
                throw new Error("not an immediately-invoked function expression: " + result);
            }
        });

        it("should keep the parameters", function () {
            // eslint-disable-next-line no-unused-vars
            var result = index(function (foo, bar) {});
            if (!/function\s*\(foo,\s*bar\)/.test(result)) {
                throw new Error("parameters not kept: " + result);
            }
        });

        it("should stringify the contents", function () {
            var result = index(function (a, b) {
                return a || b;
            });
            if (!/\{\s*return a \|\| b;\s*\}/.test(result)) {
                throw new Error("contents not stringified correctly: " + result);
            }
        });

    });

    describe("parameter serialization", function () {

        it("should serialize numbers", function () {
            var result = index(function (a, b) {
                return a + b;
            }, 42, 13.37);
            if (!/\)\(42,\s*13.37\)/.test(result)) {
                throw new Error("incorrect serialization: " + result);
            }
        });

        it("should serialize strings", function () {
            var result = index(function (a, b) {
                return a + " " + b;
            }, "hello", "world");
            if (!/\)\("hello",\s*"world"\)/.test(result)) {
                throw new Error("incorrect serialization: " + result);
            }
        });

        it("should serialize booleans", function () {
            var result = index(function (a, b) {
                return a || b;
            }, true, false);
            if (!/\)\(true,\s*false\)/.test(result)) {
                throw new Error("incorrect serialization: " + result);
            }
        });

        it("should serialize null", function () {
            var result = index(function (a) {
                console.log(a);
            }, null);
            if (!/\)\(null\)/.test(result)) {
                throw new Error("incorrect serialization: " + result);
            }
        });

        it("should serialize objects", function () {
            var result = index(function (a) {
                console.log(a);
            }, {
                foo: "bar",
                baz: true,
            });
            if (!/\)\(\{\s*"?foo"?:\s*"bar",\s*"?baz"?:\s*true\s*\}\)/.test(result)) {
                throw new Error("incorrect serialization: " + result);
            }
        });

    });

    describe("evaluation", function () {

        it("should not run on its own", function () {
            var hasRun = false;
            index(function () {
                hasRun = true;
            });
            if (hasRun) {
                throw new Error("function was run");
            }
        });

        it("should produce evaluatable strings", function () {
            var string = index(function (a, b) {
                return a + b;
            }, 5, 7);
            // eslint-disable-next-line no-eval
            var result = eval(string);
            if (result !== 12) {
                throw new Error("wrong eval result: " + result);
            }
        });

    });

});
