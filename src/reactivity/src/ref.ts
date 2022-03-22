import { hasChanged } from "../../shared/src";
import { isTracking, trackEffect, triggerEffect } from "./effect";

export class RefImpl {
  private _rawValue: any;
  private _value: any;
  public dep: Set<unknown>; // TODO:定义一下type Dep

  constructor(value) {
    this._rawValue = value;
    this._value = value;
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
      this._value = newValue;
      triggerEffect(this.dep);
    }
  }
}

export function ref(value) {
  return new RefImpl(value);
}
