import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";


export const readonlyHandlers = {
  get: (target, key, receiver) => {
    if (key === ReactiveFlags.IS_READONLY) {
      return true;
    }

    const res = Reflect.get(target, key, receiver);
    // track(target, key);
    return res;
  },
  set: (target, key) => {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`)
    return true;
  }
}

export const mutableHandlers = {
  get: (target, key, receiver) => {

    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    const res = Reflect.get(target, key, receiver);
    track(target, key);
    return res;
  },
  set: (target, key, newValue, receiver) => {
    const res = Reflect.set(target, key, newValue, receiver);
    trigger(target, key);
    return res;
  }
}