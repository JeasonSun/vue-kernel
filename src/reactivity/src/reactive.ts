import { mutableHandlers, readonlyHandlers } from "./baseHandlers";
import { track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw',
}

export function reactive(target) {
  return new Proxy(target, mutableHandlers)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

function createReactiveObject(target, baseHandlers) {
  const proxy = new Proxy(target, baseHandlers);
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

