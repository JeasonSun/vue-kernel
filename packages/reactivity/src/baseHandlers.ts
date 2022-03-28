
import { isObject } from "@vue-kernel/shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);

export const mutableHandlers = {
  get,
  set: (target, key, newValue, receiver) => {
    const res = Reflect.set(target, key, newValue, receiver);
    trigger(target, key);
    return res;
  }
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: (target, key) => {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`)
    return true;
  }
}

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set: (target, key) => {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`)
    return true;
  }
}

export const shallowReactiveHandlers = {
  get: shallowReactiveGet,
  set: (target, key, newValue, receiver) => {
    const res = Reflect.set(target, key, newValue, receiver);
    trigger(target, key);
    return res;
  }
}

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }

    if (key === ReactiveFlags.IS_SHALLOW){
      return shallow;
    }

    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      track(target, key);
    }

    if (shallow) {
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  }
}