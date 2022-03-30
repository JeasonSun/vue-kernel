import { ShapeFlags } from "@vue-kernel/shared";
import { initProps } from "./componentProps";
import { initSlots } from "./componentSlots";

/**
 *
 * @param vnode
 * 对于Component Instance中， type就是包含render setup等的一个对象
 */
export function createComponentInstance(vnode): any {
  const instance = {
    type: vnode.type,
    vnode,
    isMounted: false,
    setupState: {},
  };

  return instance;
}

/**
 * 初始化组件实例
 * @param instance
 */
export function setupComponent(instance) {
  console.log("setupComponent", instance);
  const { props, children } = instance.vnode;
  // 1. 处理props
  initProps(instance, props);
  // 2. 处理slots
  initSlots(instance, children);

  const isStateful = isStatefulComponent(instance);
  // 3. 初始化状态组件
  // 3.1 运行setup()
  const setupResult = isStateful? setupStatefulComponent(instance) : undefined;
  return setupResult;
}

export function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT;
}
function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  console.log(Component)
}

