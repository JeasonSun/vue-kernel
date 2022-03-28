const extend = Object.assign;
const isObject = (value) => {
    return value !== null && typeof value === "object";
};
const hasChanged = (value, newValue) => {
    return !Object.is(value, newValue);
};

const targetMap = new WeakMap();
let activeEffect = void 0;
let shouldTrack = false;
class ReactiveEffect {
    fn;
    scheduler;
    deps = [];
    active = true;
    constructor(fn, scheduler) {
        this.fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        if (!this.active) {
            return this.fn();
        }
        activeEffect = this;
        shouldTrack = true;
        const result = this.fn();
        activeEffect = undefined;
        shouldTrack = false;
        return result;
    }
    stop() {
        if (this.active) {
            this.deps.forEach((dep) => {
                dep.delete(this);
            });
            this.deps.length = 0;
            this.active = false;
        }
    }
}
function effect(fn, options) {
    const _effect = new ReactiveEffect(fn);
    if (options) {
        extend(_effect, options);
    }
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
function stop(runner) {
    runner.effect.stop();
}
function track(target, key) {
    if (!isTracking()) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffect(dep);
}
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const deps = depsMap.get(key);
    triggerEffect(deps);
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
function trackEffect(dep) {
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}
function triggerEffect(deps) {
    deps.forEach((effect) => {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    });
}

const get = createGetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);
const mutableHandlers = {
    get,
    set: (target, key, newValue, receiver) => {
        const res = Reflect.set(target, key, newValue, receiver);
        trigger(target, key);
        return res;
    }
};
const readonlyHandlers = {
    get: readonlyGet,
    set: (target, key) => {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`);
        return true;
    }
};
const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set: (target, key) => {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`);
        return true;
    }
};
const shallowReactiveHandlers = {
    get: shallowReactiveGet,
    set: (target, key, newValue, receiver) => {
        const res = Reflect.set(target, key, newValue, receiver);
        trigger(target, key);
        return res;
    }
};
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === "__v_isReadonly") {
            return isReadonly;
        }
        if (key === "__v_isReactive") {
            return !isReadonly;
        }
        if (key === "__v_isShallow") {
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
    };
}

var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags["IS_READONLY"] = "__v_isReadonly";
    ReactiveFlags["IS_SHALLOW"] = "__v_isShallow";
    ReactiveFlags["RAW"] = "__v_raw";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(raw) {
    return new Proxy(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
function shallowReactive(raw) {
    return createReactiveObject(raw, shallowReactiveHandlers);
}
function createReactiveObject(raw, baseHandlers) {
    const proxy = new Proxy(raw, baseHandlers);
    return proxy;
}
function isReactive(value) {
    return !!value["__v_isReactive"];
}
function isReadonly(value) {
    return !!value["__v_isReadonly"];
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function isShallow(value) {
    return !!value["__v_isShallow"];
}

class RefImpl {
    _rawValue;
    _value;
    dep;
    __v_isRef = true;
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
function ref(value) {
    return new RefImpl(value);
}
function isRef(ref) {
    return !!ref.__v_isRef;
}
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value);
            }
            else {
                return Reflect.set(target, key, value);
            }
        },
    });
}

class ComputedRefImpl {
    _value;
    _dirty = true;
    effect;
    constructor(getter) {
        this.effect = new ReactiveEffect(getter, () => {
            this._dirty = true;
        });
    }
    get value() {
        if (this._dirty) {
            this._dirty = false;
            this._value = this.effect.run();
        }
        return this._value;
    }
}
function computed(getter) {
    return new ComputedRefImpl(getter);
}

export { computed, effect, isProxy, isReactive, isReadonly, isRef, isShallow, proxyRefs, reactive, readonly, ref, shallowReactive, shallowReadonly, stop, unRef };
//# sourceMappingURL=reactivity.esm-bundler.js.map
