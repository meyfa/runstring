"use strict";

module.exports = function (func /*, arg1, arg2, ... */) {
    if (typeof func !== "function") {
        throw new Error("expected a function but got " + typeof func);
    }
    var args = Array.prototype.slice.call(arguments, 1);
    return ";(" + func.toString() + ")(" + serializeArguments(args) + ");";
};

function serializeArguments(args) {
    return args.map(function (arg) {
        return JSON.stringify(arg);
    }).join(", ");
}
