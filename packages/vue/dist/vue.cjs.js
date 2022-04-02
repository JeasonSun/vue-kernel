'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["FUNCTIONAL_COMPONENT"] = 2] = "FUNCTIONAL_COMPONENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
    ShapeFlags[ShapeFlags["TELEPORT"] = 64] = "TELEPORT";
    ShapeFlags[ShapeFlags["SUSPENSE"] = 128] = "SUSPENSE";
    ShapeFlags[ShapeFlags["COMPONENT_SHOULD_KEEP_ALIVE"] = 256] = "COMPONENT_SHOULD_KEEP_ALIVE";
    ShapeFlags[ShapeFlags["COMPONENT_KEPT_ALIVE"] = 512] = "COMPONENT_KEPT_ALIVE";
    ShapeFlags[ShapeFlags["COMPONENT"] = 6] = "COMPONENT";
})(ShapeFlags || (ShapeFlags = {}));

const extend = Object.assign;
const isObject = (value) => {
    return value !== null && typeof value === "object";
};
const isString = (value) => typeof value === "string";
const isFunction = (value) => typeof value === "function";
const isPromise = (value) => isObject(value) && isFunction(value.then) && isFunction(value.catch);
const hasChanged = (value, newValue) => {
    return !Object.is(value, newValue);
};
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

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
const shallowUnwrapHandlers = {
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
};
function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, shallowUnwrapHandlers);
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

const createVNode = function (type, props, children) {
    const shapeFlag = isString(type)
        ? 1
        : 4;
    const vnode = {
        el: null,
        component: null,
        key: props?.key,
        type,
        props: props || {},
        children,
        shapeFlag,
    };
    return vnode;
};
const Text = Symbol("Text");
const Fragment = Symbol("Fragment");
function normalizeVNode(child) {
    if (typeof child === "string" || typeof child === "number") {
        return createVNode(Text, null, String(child));
    }
    else {
        return child;
    }
}

function initProps(instance, rawProps) {
    console.log("initProps");
    instance.props = rawProps;
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $emit: (i) => i.emit,
    $slots: (i) => i.slots,
    $props: (i) => i.props,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        console.log(`触发 proxy hook, key -> : ${key}`);
        if (key[0] !== "$") ;
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
    set({ _: instance }, key, value) {
        const { setupState } = instance;
        if (setupState != {} && hasOwn(setupState, key)) {
            setupState[key] = value;
        }
        return true;
    },
};

function initSlots(instance, children) {
    if (instance.vnode.shapeFlag & 32) ;
}

function createComponentInstance(vnode) {
    const instance = {
        type: vnode.type,
        vnode,
        isMounted: false,
        setupState: {},
        proxy: null,
        ctx: {},
    };
    instance.ctx = {
        _: instance,
    };
    return instance;
}
function setupComponent(instance) {
    console.log("setupComponent", instance);
    const { props, children } = instance.vnode;
    initProps(instance, props);
    initSlots(instance);
    const isStateful = isStatefulComponent(instance);
    const setupResult = isStateful ? setupStatefulComponent(instance) : undefined;
    return setupResult;
}
function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
}
function setupStatefulComponent(instance) {
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (isPromise(setupResult)) ;
    else if (isFunction(setupResult)) {
        instance.render = setupResult;
    }
    else if (isObject(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (!instance.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    const { type, shapeFlag } = vnode;
    switch (type) {
        case Text:
            processText();
            break;
        case Fragment:
            processFragment();
            break;
        default:
            if (shapeFlag & 1) {
                processElement();
            }
            else if (shapeFlag & 6) {
                processComponent(vnode);
            }
    }
}
function processText(vnode, container) {
    throw new Error("Function processText not implemented.");
}
function processFragment(vnode, container) {
    throw new Error("Function processFragment not implemented.");
}
function processElement(vnode, container) {
    throw new Error("Function processElement not implemented.");
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(initialVnode, container) {
    const instance = (initialVnode.component =
        createComponentInstance(initialVnode));
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, initialVnode, container) {
    const componentUpdateFn = () => {
        const proxyToUse = instance.proxy;
        const subTree = (instance.subTree = normalizeVNode(instance.render.call(proxyToUse, proxyToUse)));
        console.log(subTree);
    };
    effect(componentUpdateFn);
}

function createApp(rootComponent) {
    const app = {
        _component: rootComponent,
        mount(rootContainer) {
            console.info("基于根组件创建 vnode");
            const vnode = createVNode(rootComponent);
            console.info("调用 render(), 基于vnode进行开箱");
            render(vnode);
        },
    };
    return app;
}

const h = (type, props, children) => {
    return createVNode(type, props, children);
};

exports.computed = computed;
exports.createApp = createApp;
exports.createVNode = createVNode;
exports.effect = effect;
exports.h = h;
exports.isProxy = isProxy;
exports.isReactive = isReactive;
exports.isReadonly = isReadonly;
exports.isRef = isRef;
exports.isShallow = isShallow;
exports.proxyRefs = proxyRefs;
exports.reactive = reactive;
exports.readonly = readonly;
exports.ref = ref;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;
exports.stop = stop;
exports.unRef = unRef;
//# sourceMappingURL=vue.cjs.js.map
