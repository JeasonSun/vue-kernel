import { Fragment, normalizeVNode, Text } from "./vnode";
import { ShapeFlags } from "@vue-kernel/shared";
import { createComponentInstance, setupComponent } from "./component";
import { effect } from "@vue-kernel/reactivity";

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
  mountElement(vnode, container);
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
  const instance = (initialVnode.component =
    createComponentInstance(initialVnode));
  // 2.setup instance，初始化组件
  setupComponent(instance);

  // 3. 创建render的副作用
  setupRenderEffect(instance, initialVnode, container);
}

// effect里面可以进行收集依赖，初次渲染就是需要收集所有的响应式依赖
function setupRenderEffect(instance: any, initialVnode: any, container: any) {
  //
  const componentUpdateFn = () => {
    // mount阶段
    const proxyToUse = instance.proxy;
    const subTree = (instance.subTree = normalizeVNode(
      // render的入参
      instance.render.call(proxyToUse, proxyToUse)
    ));
    console.log("subTree", subTree);
    // TODO: 添加生命钩子
    console.log(`${instance.type.name}: 触发 beforeMount hook`);
    console.log(`${instance.type.name}: 触发 onVnodeBeforeMount hook`);

    // 这里基于subTree再次调用patch
    // 基于render返回的vnode，再次进行渲染
    patch(subTree, container);
    // 把root element 赋值给组件的vnode.el， 后续调用$el获取值
    initialVnode.el = subTree.el;
    console.log(`${instance.type.name}: 触发 mounted hook`);
    instance.isMounted = true;
  };

  effect(componentUpdateFn);
}

function mountElement(vnode, container) {
  const { shapeFlag, props, type } = vnode;
  console.log("mountElement", vnode);
  console.log("container", container);
  // 1. 先创建element
  const el = (vnode.el = document.createElement(type));
  // 2. 处理子组件：支持单子组件和多子组件的创建
  if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 如果是数组children
    mountChildren(vnode.children, el);
  } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    console.log(`处理文本节点: ${vnode.children}`);
    el.textContent = vnode.children;
  }
  // 处理props
  if (props) {
    for (const key in props) {
      // TODO: 需要过滤一些Vue自身用的key
      // 比如生命周期相关的key  beforeMount/mounted
      const nextVal = props[key];
      hostPatchProp(el, key, nextVal);
    }
  }

  // TODO:  触发钩子
  console.log("vnodeHook -> onVnodeBeforeMount");
  console.log("DirectiveHook -> beforeMount");
  console.log("transition -> beforeEnter");

  container.insertBefore(el, null);
}

function mountChildren(children, container) {
  children.forEach((vNodeChild) => {
    console.log("mount Children :", vNodeChild);
    patch(vNodeChild, container);
  });
}

function hostPatchProp(el, key, value) {
  el.setAttribute(key, value);
}
