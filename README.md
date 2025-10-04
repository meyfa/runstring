# runstring

[![CI](https://github.com/meyfa/runstring/actions/workflows/main.yml/badge.svg)](https://github.com/meyfa/runstring/actions/workflows/main.yml)

Convert JS functions to runnable strings, with parameter serialization!
(We also support TypeScript natively!)

This was made for Electron's `executeJavaScript()` method, so that the code does
not need to be constructed as a string but can be passed as a function.
runstring will convert that function and its parameters to an IIFE string.

The following parameter types are supported:

- Literals `null`, `undefined`, `true`, `false`
- Numbers
- Strings
- Functions (both standard notation and arrow notation)
- Arrays
- Objects

Strings will be escaped. Nesting of values (in objects and arrays) is supported
without limit.

## Usage

### Basic Usage

Simply invoke the module with a function and its parameters to obtain the IIFE
string.

```js
const runstring = require('runstring')

const code = runstring(myFunction, arg1, arg2 /* , ... */)
// do something with `code`
```

### Example 1

```js
const runstring = require('runstring')

const code = runstring(function (a, b) {
  return a + b
}, 5, 7)
```

`code` would now store a string similar to this:
`';(function (a, b) { return a + b })(5, 7);'`. That string could be passed to
Electron's `executeJavaScript()`, or the standard `eval()` (eval is evil, but if
you have your reasons to use it, might as well do it right).

### Example 2

Any parameter type is supported &mdash; numbers, strings, objects, arrays, and
even other functions can all be passed to the module for stringification:

```js
const runstring = require('runstring')

const code = runstring(function (predicate, action) {
  const elements = document.getElementsByClassName('item')
  for (let i = 0; i < elements.length; ++i) {
    if (predicate(elements[i])) {
      action(elements[i])
    }
  }
}, (e) => e.tagName.toLowerCase() === 'div', removeElement)

function removeElement (e) {
  e.parentNode.removeChild(e)
}
```

`code` would now store the following string:

```
';(function (predicate, action) {
  const elements = document.getElementsByClassName('item')
  for (let i = 0; i < elements.length; ++i) {
    if (predicate(elements[i])) {
      action(elements[i])
    }
  }
})((e) => e.tagName.toLowerCase() === 'div', function removeElement (e) {
  e.parentNode.removeChild(e)
});'
```
