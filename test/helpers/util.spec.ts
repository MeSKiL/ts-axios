import {
  isDate,
  isPlainObject,
  isFormData,
  isURLSearchParams,
  extend,
  deepMerge
} from "../../src/helpers/util";

describe('helpers:util', () => { // 定义一组测试，name：测试组名 可以嵌套
  describe('isXX', () => {
    test('should validate Date', () => { // 编写单个测试用例，测试最小单元
      expect(isDate(new Date())).toBeTruthy(); // 断言函数，代码结果与预测结果是否一致
      expect(isDate(Date.now())).toBeFalsy();
    });

    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy();
      expect(isPlainObject(new Date())).toBeFalsy();
    });

    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy();
      expect(isFormData({})).toBeFalsy();
    });

    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy();
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy();
    });
  });

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null);
      const b = {foo: 123};
      extend(a, b);
      expect(a.foo).toBe(123);
    });

    test('should extend properties', () => {
      const a = {foo: 123, bar: 456};
      const b = {bar: 789};
      const c = extend(a, b);

      expect(c.foo).toBe(123);
      expect(c.bar).toBe(789);
    })
  });

  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null);
      const b: any = {foo: 123};
      const c: any = {bar: 456};

      deepMerge(a, b, c);

      expect(typeof a.foo).toBe('undefined');
      expect(typeof a.bar).toBe('undefined');
      expect(typeof a.bar).toBe('undefined');
      expect(typeof c.foo).toBe('undefined');
    });

    test('should deepMerge properties', () => {
      const a = {foo: 123};
      const b = {foo: 789};
      const c = {bar: 456};

      const d = deepMerge(a, b, c);

      expect(d.foo).toBe(789);
      expect(d.bar).toBe(456);
    })
  });

  test('should deepMerge recursively', () => {
    const a = {foo: {bar: 123}};
    const b = {foo: {baz: 456}, bar: {qux: 789}};
    const c = deepMerge(a, b);
    expect(c).toEqual({ // 对象引用类型，需要用toEqual
      foo: {
        bar:123,
        baz: 456
      },
      bar: {
        qux: 789
      }
    })
  });

  test('should remove all references from nested objects', () => {
    const a = {foo: {bar: 123}};
    const b = {};
    const c = deepMerge(a, b);
    expect(c).toEqual({
      foo: {
        bar: 123
      }
    });
    expect(c.foo).not.toBe(a.foo)
  });

  test('should handle null and undefined arguments', () => {
    expect(deepMerge(undefined, undefined)).toEqual({});
    expect(deepMerge(undefined, {foo: 123})).toEqual({foo: 123});
    expect(deepMerge({foo: 123}, undefined)).toEqual({foo: 123});
    expect(deepMerge(null, null)).toEqual({});
    expect(deepMerge(null, {foo: 123})).toEqual({foo: 123});
    expect(deepMerge({foo: 123}, null)).toEqual({foo: 123});
  })

});

