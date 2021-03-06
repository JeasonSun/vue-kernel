export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const isString = (value) => typeof value === "string";

export const isFunction = (value) => typeof value === "function";

export const isPromise = (value) =>
  isObject(value) && isFunction(value.then) && isFunction(value.catch);

export const hasChanged = (value, newValue) => {
  return !Object.is(value, newValue);
};

export function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isOn(key) {
  return /^on[A-Z]/.test(key);
}

export { ShapeFlags } from "./shapeFlags";
