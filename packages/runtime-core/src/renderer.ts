import { Fragment, Text } from "./vnode";
import { ShapeFlags } from "@vue-kernel/shared";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  const { type, shapeFlag } = vnode;
  // TODO: 暂时只处理statefulComponent & Element & Text
  switch (type) {
    case Text:
      processText(vnode, container);
      break;
    case Fragment:
      processFragment(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(vnode, container);
      }
  }
}

function processText(vnode: any, container: any) {
  throw new Error("Function processText not implemented.");
}

function processFragment(vnode: any, container: any) {
  throw new Error("Function processFragment not implemented.");
}

function processElement(vnode: any, container: any) {
  throw new Error("Function processElement not implemented.");
}

/**
 * 处理组件
 * @param vnode 
 * @param container 
 */
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
/**
 * 初始化组件
 * @param vnode 
 * @param container 
 */
function mountComponent(initialVnode: any, container: any) {
  // 1.创建组件实例
  const instance = (initialVnode.component = createComponentInstance(initialVnode))
  // 2.setup instance，初始化组件
  setupComponent(instance);

  // 3. 创建render的副作用
  setupRenderEffect(instance, initialVnode, container);
}

// effect里面可以进行收集依赖，初次渲染就是需要收集所有的响应式依赖
function setupRenderEffect(instance: any, initialVnode: any, container: any) {
  //
  const componentUpdateFn = () => {
    instance.render();
  }

  
}

