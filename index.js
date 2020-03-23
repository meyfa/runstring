'use strict'

// HELPER FUNCTIONS

/**
 * Stringify something. This determines the value type and then applies
 * type-specific stringification logic.
 *
 * @param {*} obj The 'thing' that should be stringified.
 * @returns {string} The object, stringified.
 */
function stringify (obj) {
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
  switch (typeof obj) {
    case 'undefined':
      return 'undefined'
    case 'boolean':
      return obj.toString()
    case 'number':
      return obj.toString()
    case 'string':
      return stringifyString(obj)
    case 'function':
      return obj.toString()
    case 'object':
      return stringifyObject(obj)
    default:
      return 'null'
  }
}

/**
 * Stringify a true object. This is vaguely similar to JSON serialization.
 *
 * @param {object} obj The object to stringify.
 * @returns {string} The object, stringified.
 */
function stringifyObject (obj) {
  if (obj === null) {
    return 'null'
  }
  // array
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return '[' + Array.prototype.map.call(obj, stringify).join(', ') + ']'
  }
  // plain object
  return '{' + Object.keys(obj).map((key) => {
    return stringify(key) + ': ' + stringify(obj[key])
  }).join(', ') + '}'
}

/**
 * Stringify a string (wrap it in quotes and escape special characters).
 *
 * @param {string} string The string to stringify.
 * @returns {string} The string escaped and wrapped in quotes.
 */
function stringifyString (string) {
  const escMap = {
    '"': '\\"',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t'
  }
  // eslint-disable-next-line no-control-regex
  return '"' + string.replace(/[\\"\u0000-\u001F\u2028\u2029]/g, (m) => {
    return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1)
  }) + '"'
}

// EXPORT

/**
 * Create a runnable string for the given function.
 *
 * Arguments after the 'func' argument will map one-to-one onto arguments in
 * the resulting string.
 *
 * @param {function} func  The function.
 * @param {*}        args  Function arguments.
 * @returns {string} The runnable string.
 */
function createRunString (func, ...args) {
  if (typeof func !== 'function') {
    throw new Error('expected a function but got ' + typeof func)
  }
  return ';(' + func + ')(' + args.map(stringify).join(', ') + ');'
}

module.exports = createRunString
