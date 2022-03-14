import { reactive, effect } from "../src";

describe('reactive', () => {
  test('Object', () => {
    const original = { count: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);

    let dummy;
    const counter = reactive({ num: 0 });
    effect(() => (dummy = counter.num));

    expect(dummy).toBe(0);
    counter.num = 7;
    expect(dummy).toBe(7);
  })
})