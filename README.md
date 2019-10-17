# runstring

[![Build Status](https://travis-ci.com/meyfa/runstring.svg?branch=master)](https://travis-ci.com/meyfa/runstring)
[![Test Coverage](https://api.codeclimate.com/v1/badges/39e38e2764a453e66a43/test_coverage)](https://codeclimate.com/github/meyfa/runstring/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/39e38e2764a453e66a43/maintainability)](https://codeclimate.com/github/meyfa/runstring/maintainability)

Convert JS functions to runnable strings. With parameter serialization!

This was made for Electron's `executeJavaScript()` method, so that the code does
not need to be constructed as a string but can be passed as an IIFE string with
specific arguments.

## Usage

### Basic Usage

Simply invoke the module with a function and the parameters that should be
passed to that function.

```javascript
const runstring = require("runstring");

let code = runstring(myFunction, arg1, arg2, ...);
// do something with `code`
```

### Example 1

```javascript
const runstring = require("runstring");

let code = runstring(function (a, b) {
    return a + b;
}, 5, 7);
```

`code` would now store a string similar to this:
`";(function (a, b) { return a + b; })(5, 7);"`. That string could be passed to
Electron's `executeJavaScript()`, or the standard `eval()` (eval is evil, but if
you have your reasons to use it, might as well do it right).

### Example 2

Any parameter type is supported &mdash; numbers, strings, objects, arrays, and
even other functions can all be passed to the module for stringification:

```javascript
const runstring = require("runstring");

let code = runstring(function (predicate, action) {
    const elements = document.getElementsByClassName("item");
    for (let i = 0; i < elements.length; ++i) {
        if (predicate(elements[i])) {
            action(elements[i]);
        }
    }
}, function (e) {
    return e.tagName.toLowerCase() === "div";
}, removeElement);

function removeElement(e) {
    e.parentNode.removeChild(e);
}
```

`code` would now store the following string:

```
";(function (predicate, action) {
    const elements = document.getElementsByClassName("item");
    for (let i = 0; i < elements.length; ++i) {
        if (predicate(elements[i])) {
            action(elements[i]);
        }
    }
})(function (e) {
    return e.tagName.toLowerCase() === "div";
}, function removeElement(e) {
    e.parentNode.removeChild(e);
});"
```
