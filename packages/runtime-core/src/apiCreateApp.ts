import { render } from "./renderer";
import { createVNode } from "./vnode";
export function createAppAPI(render) {}

export function createApp(rootComponent) {
  const app = {
    _component: rootComponent,
    mount(rootContainer) {
      console.info("基于根组件创建 vnode", rootComponent);
      const vnode = createVNode(rootComponent);
      console.info("调用 render(), 基于vnode进行开箱",rootContainer);
      render(vnode, rootContainer);
    },
  };
  return app;
}
