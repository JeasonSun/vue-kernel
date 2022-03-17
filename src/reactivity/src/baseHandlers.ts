import { isObject } from "../../shared/src";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const readonlyGet = createGetter(true);

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

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }

    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      track(target, key);
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  }
}