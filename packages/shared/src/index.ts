export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const isString = (value) => typeof value === "string";

export const hasChanged = (value, newValue) => {
  return !Object.is(value, newValue);
};

export { ShapeFlags } from "./shapeFlags";
