import { effect, reactive } from "../src";

describe('effect', () => {
  it('should run the passed function once (wrapped by a effect)', () => {
    const fnSpy = jest.fn(() => { });
    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  })

  it('should observe basic properties', () => {
    let dummy;
    const counter = reactive({ num: 0 });
    effect(() => (dummy = counter.num));
    expect(dummy).toBe(0);
    counter.num = 7;
    expect(dummy).toBe(7);
  })

  it('should return a runner function after execute effect', () => {
    let foo = 1;
    const runner = effect(() => {
      foo++;
      return 'foo';
    })
    expect(foo).toBe(2);
    const result = runner();
    expect(result).toBe('foo');
    expect(foo).toBe(3);
  })

  it('effect scheduler', () => {
    /**
     * 1. 通过effect的第二个参数给定的一个scheduler的fn
     * 2. effect 第一次执行的时候， 还会执行fn
     * 3. 当响应式对象 set update不会执行fn，而是执行scheduler
     * 4. 如果说当执行runner的时候，会再次执行fn
     * 
     */
    let dummy;
    const obj = reactive({ foo: 1 });
    const scheduler = jest.fn(() => {
      dummy = obj.foo + 2;
    });

    effect(() => {
      dummy = obj.foo
    }, {
      scheduler
    });
    // effect首次调用不使用scheduler
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // 后续的副作用需要使用scheduler函数
    obj.foo++;
    expect(scheduler).toBeCalledTimes(1);
    expect(dummy).toBe(4);
  })
})