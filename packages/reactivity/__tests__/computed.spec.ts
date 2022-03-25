import { computed, reactive } from "../src";

describe("computed", () => {
  it("happy path", () => {
    const value = reactive({
      foo: 1,
    });

    const getter = computed(() => {
      return value.foo;
    });

    value.foo = 2;
    expect(getter.value).toBe(2);
  });

  it("should compute lazy", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });

    const cValue = computed(getter);

    // lazy: 在没有调用cValue.value之前，并不会触发getter
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again： 如果依赖的值并没有更改，即使get，也不在触发getter
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
