# runstring

[![Build Status](https://travis-ci.org/JangoBrick/runstring.svg?branch=master)](https://travis-ci.org/JangoBrick/runstring)
[![Code Climate](https://codeclimate.com/github/JangoBrick/runstring/badges/gpa.svg)](https://codeclimate.com/github/JangoBrick/runstring)

Convert JS functions to runnable strings. With parameter serialization!

## Example

```javascript
var runstring = require("runstring");

console.log(runstring(function (a, b) {
    return a + b;
}, 5, 7));

// Logs something like:
// ";(function (a, b) { return a + b; })(5, 7);"
// Or in other words: an IIFE that can be executed
```
