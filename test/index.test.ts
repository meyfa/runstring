import index from '../src/index.js'

describe('index.js', function () {
  describe('function stringification', function () {
    it('should accept nothing but functions', function () {
      function test (value: any): void {
        try {
          index(value)
        } catch (e) {
          return
        }
        throw new Error('not thrown for type: ' + typeof value)
      }
      test(undefined)
      test(null)
      test(true)
      test('function')
      test(42)
      test([1, 2, 3])
      test({ foo: 'bar' })
    })

    it('should return a string', function () {
      const result: string = index(function () {})
      if (typeof result !== 'string') {
        throw new Error('expected a string but got ' + typeof result)
      }
    })

    it('should start with a semicolon', function () {
      const result: string = index(function () {})
      if (!result.startsWith(';')) {
        throw new Error('not starting with a semicolon: ' + result)
      }
    })

    it('should end with a semicolon', function () {
      const result: string = index(function () {})
      if (!result.endsWith(';')) {
        throw new Error('not ending with a semicolon: ' + result)
      }
    })

    it('should be an IIFE', function () {
      const result: string = index(function () {})
      if (!/\(function .*\)\(.*\)/.test(result)) {
        throw new Error('not an immediately-invoked function expression: ' + result)
      }
    })

    it('should keep the parameters', function () {
      const result: string = index(function (foo: any, bar: any) {}, undefined, undefined)
      if (!/function\s*\(foo,\s*bar\)/.test(result)) {
        throw new Error('parameters not kept: ' + result)
      }
    })

    it('should allow optional parameters', function () {
      const result: string = index(function (foo: any, bar?: any) {}, undefined)
      if (!/function\s*\(foo,\s*bar\)/.test(result)) {
        throw new Error('parameters not kept: ' + result)
      }
    })

    it('should allow default parameters', function () {
      const result: string = index(function (foo: any, bar: any = 42) {}, undefined)
      if (!/function\s*\(foo,\s*bar\s*=\s*42\)/.test(result)) {
        throw new Error('parameters not kept: ' + result)
      }
    })

    it('should stringify the contents', function () {
      const result: string = index(function (a: boolean, b: boolean) {
        return a || b
      }, true, false)
      if (!/\{\s*return a \|\| b;?\s*\}/.test(result)) {
        throw new Error('contents not stringified correctly: ' + result)
      }
    })

    it('should stringify arrow functions', function () {
      const result: string = index((a: boolean, b: boolean) => {
        return a || b
      }, true, false)
      if (!/\(a,\s*b\)\s*=>\s*\{\s*return a \|\| b;?\s*\}/.test(result)) {
        throw new Error('invalid stringification: ' + result)
      }
    })
  })

  describe('parameter serialization', function () {
    it('should serialize undefined', function () {
      const result: string = index(function (undef0: any, undef1: any) {
        return undef0 === undef1
      }, undefined, undefined)
      if (!/\)\(undefined,\s*undefined\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize numbers', function () {
      const result: string = index(function (a: number, b: number) {
        return a + b
      }, 42, 13.37)
      if (!/\)\(42,\s*13\.37\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize strings', function () {
      const result: string = index(function (a: string, b: string) {
        return a + ' ' + b
      }, 'hello', 'world')
      if (!/\)\("hello",\s*"world"\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should escape serialized strings', function () {
      const result: string = index(function (a: string, b: string) {
        return a + ' ' + b
      }, 'foo"bar\\"\n-\u0000\u2028\u2029\u0007', 'baz')
      if (!result.includes(')("foo\\"bar\\\\\\"\\n-\\u0000\\u2028\\u2029\\u0007", "baz")')) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize booleans', function () {
      const result: string = index(function (a: boolean, b: boolean) {
        return a || b
      }, true, false)
      if (!/\)\(true,\s*false\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize null', function () {
      const result: string = index(function (a: any) {
        console.log(a)
      }, null)
      if (!result.includes(')(null)')) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize objects', function () {
      const result: string = index(function (a: any) {
        console.log(a)
      }, {
        foo: 'bar',
        baz: true
      })
      if (!/\)\(\{\s*"?foo"?:\s*"bar",\s*"?baz"?:\s*true\s*\}\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize arrays', function () {
      const result: string = index(function (a: any) {
        console.log(a)
      }, [42, 'foo', true])
      if (!/\)\(\[\s*42,\s*"foo",\s*true\s*\]\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize functions', function () {
      const result: string = index(function (aFunc: any) {
        aFunc('hello world')
      }, function (str: any) {
        console.log(str)
      })
      if (!/\)\(function\s+\(str\)\s*\{\s*console\.log\(str\);?\s*\}\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize functions in objects', function () {
      const result: string = index(function (obj: any) {
        obj.func('hello world')
      }, {
        func: function (str: any) {
          console.log(str)
        }
      })
      if (!/\)\(\{\s*"?func"?:\s*function\s+\(str\)\s*\{\s*console\.log\(str\);?\s*\},?\s*\}\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize functions in arrays', function () {
      const result: string = index(function (obj: any) {
        obj.func('hello world')
      }, [
        function (str: any) {
          console.log(str)
        }
      ])
      if (!/\)\(\[\s*function\s+\(str\)\s*\{\s*console\.log\(str\);?\s*\},?\s*\]\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should serialize arrow functions', function () {
      const result: string = index(function (aFunc: any) {
        aFunc('hello world')
      }, (str: any) => {
        console.log(str)
      })
      if (!/\)\(\(str\)\s*=>\s*\{\s*console\.log\(str\);?\s*\}\)/.test(result)) {
        throw new Error('incorrect serialization: ' + result)
      }
    })

    it('should use null for unsupported types', function () {
      const result: string = index(function (val: any) {
        return val === null
      }, Symbol('some description'))
      if (!result.includes(')(null)')) {
        throw new Error('incorrect serialization: ' + result)
      }
    })
  })

  describe('evaluation', function () {
    it('should not run on its own', function () {
      let hasRun = false
      index(function () {
        hasRun = true
      })
      if (hasRun) {
        throw new Error('function was run')
      }
    })

    it('should produce evaluatable strings', function () {
      const string: string = index(function (a: number, b: number) {
        return a + b
      }, 5, 7)
      // eslint-disable-next-line no-eval
      const result: number = eval(string)
      if (result !== 12) {
        throw new Error(`wrong eval result: ${result}`)
      }
    })
  })
})
