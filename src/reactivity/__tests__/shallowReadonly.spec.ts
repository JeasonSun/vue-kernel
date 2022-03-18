import { isReactive, isReadonly, readonly } from "../src";

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReactive(props.n)).toBe(false);
  });

  test('should differentiate from normal readonly calls', async () => {
    const original = { foo: {} };
    const shallowProxy = shallowReadonly(original);
    const readonlyProxy = readonly(original);
    expect(shallowProxy).not.toBe(reactiveProxy);
    // 使用shallowReadonly函数包装过的对象，只有最外层属性是只读的，内层仍然可以改写。
    expect(isReadonly(shallowProxy.foo)).toBe(false);
    // 
    expect(isReadonly(readonlyProxy.foo)).toBe(true);
  })
})