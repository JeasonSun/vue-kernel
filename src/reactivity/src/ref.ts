import { hasChanged } from "../../shared/src";

export class RefImpl {
  private _rawValue: any;
  private _value: any;
  constructor(value) {
    this._rawValue = value;
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue;
      this._value = newValue;
    }
  }
}

export function ref(value) {
  return new RefImpl(value);
}
