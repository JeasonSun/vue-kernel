import { proxyRefs } from "@vue-kernel/reactivity";
import {
  ShapeFlags,
  isObject,
  isPromise,
  isFunction,
} from "@vue-kernel/shared";
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
  const setupResult = isStateful ? setupStatefulComponent(instance) : undefined;
  return setupResult;
}

export function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT;
}
function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    const setupResult = setup();

    handleSetupResult(instance, setupResult);
  }
}
// TODO: 需要根据setupResult的结果做不同的处理。
function handleSetupResult(instance: any, setupResult: any) {
  if (isPromise(setupResult)) {
    // TODO: 如果setupResult是Promise
  } else if (isFunction(setupResult)) {
    // 如果setupResult是函数Function
    instance.render = setupResult;
  } else if (isObject(setupResult)) {
    // 如果setupResult是对象
    // proxyRefs:
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}

/**
 * 完成Component Setup
 * 确保instance上面有render函数
 * @param instance 
 */
function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if(!instance.render){
    // TODO: 如果compile有值，需要将template编译成render函数
    
    instance.render = Component.render;
  }
}

