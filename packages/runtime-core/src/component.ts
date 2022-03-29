import { initProps } from "./componentProps";
import { initSlots } from "./componentSlots";

/**
 *
 * @param vnode
 *
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
}
