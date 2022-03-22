import { isObject } from "./../../shared/src/index";
import { hasChanged } from "../../shared/src";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

export class RefImpl {
  private _rawValue: any;
  private _value: any;
  public dep: Set<unknown>; // TODO:定义一下type Dep
  public __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    if (isTracking()) {
      trackEffect(this.dep);
    }
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffect(this.dep);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      // 如果set的value不是一个Ref，那么就代理更改.value
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        // 如果value是一个Ref，那么直接替换。
        return Reflect.set(target, key, value);
      }
    },
  });
}
