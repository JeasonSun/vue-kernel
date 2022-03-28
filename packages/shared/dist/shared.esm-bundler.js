const extend = Object.assign;
const isObject = (value) => {
    return value !== null && typeof value === "object";
};
const hasChanged = (value, newValue) => {
    return !Object.is(value, newValue);
};

export { extend, hasChanged, isObject };
//# sourceMappingURL=shared.esm-bundler.js.map
