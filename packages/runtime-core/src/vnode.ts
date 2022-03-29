import { isString, ShapeFlags } from "@vue-kernel/shared";

export const createVNode = function (type, props?, children?) {
  /**
   * type可能是string，也可能是对象 or Function
   *
   */

  // TODO: 暂时处理两种类型 STATEFUL_COMPONENT和 ELEMENT
  // 需要继续处理 FUNCTIONAL_COMPONENT等
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;

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

export const Text = Symbol("Text");
export const Fragment = Symbol("Fragment");

export function normalizeVNode(child) {
  if (typeof child === "string" || typeof child === "number") {
    return createVNode(Text, null, String(child));
  } else {
    return child;
  }
}
