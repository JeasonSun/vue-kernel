'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extend = Object.assign;
const isObject = (value) => {
    return value !== null && typeof value === "object";
};
const hasChanged = (value, newValue) => {
    return !Object.is(value, newValue);
};

exports.extend = extend;
exports.hasChanged = hasChanged;
exports.isObject = isObject;
//# sourceMappingURL=shared.cjs.js.map
