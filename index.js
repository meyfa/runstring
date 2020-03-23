'use strict'

module.exports = function (func /*, arg1, arg2, ... */) {
  if (typeof func !== 'function') {
    throw new Error('expected a function but got ' + typeof func)
  }
  const args = Array.prototype.slice.call(arguments, 1)
  return ';(' + func + ')(' + args.map(serialize).join(', ') + ');'
}

function serialize (obj) {
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
  switch (typeof obj) {
    case 'undefined':
      return 'undefined'
    case 'boolean':
      return obj.toString()
    case 'number':
      return obj.toString()
    case 'string':
      return serializeString(obj)
    case 'function':
      return obj.toString()
    case 'object':
      return serializeObject(obj)
    default:
      return 'null'
  }
}

function serializeObject (obj) {
  if (obj === null) {
    return 'null'
  }
  // array
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return '[' + Array.prototype.map.call(obj, serialize).join(', ') + ']'
  }
  // plain object
  return '{' + Object.keys(obj).map((key) => {
    return serialize(key) + ': ' + serialize(obj[key])
  }).join(', ') + '}'
}

function serializeString (string) {
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
