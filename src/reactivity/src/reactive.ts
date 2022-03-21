import { mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
}

export function reactive(raw) {
  return new Proxy(raw, mutableHandlers)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

export function shallowReactive(raw) {
  return createReactiveObject(raw, shallowReactiveHandlers);
}

function createReactiveObject(raw, baseHandlers) {
  const proxy = new Proxy(raw, baseHandlers);
  return proxy;
}

/**
 * 判断是否是reactive响应式数据
 * isReactive会读取value[ReactiveFlags.IS_REACTIVE]的属性值，触发proxy.get
 * 普通对象因为没有new Proxy，所以返回undefined
 * 被reactive包裹的对象，在new Proxy() getHandlers中设置了IS_REACTIVE = true
 */
export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

export function isShallow(value) {
  return !!value[ReactiveFlags.IS_SHALLOW];
}

