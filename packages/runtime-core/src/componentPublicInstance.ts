import { hasOwn } from "@vue-kernel/shared";

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $emit: (i) => i.emit,
  $slots: (i) => i.slots,
  $props: (i) => i.props,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    console.log(`触发 proxy hook, key -> : ${key}`);
    if (key[0] !== "$") {
      // TODO: 处理非 $ 开头的
      // 先看setupState中有没有
      if (hasOwn(setupState, key)) {
        return setupState[key];
      }
      if (hasOwn(props, key)) {
        return props[key];
      }

      // 再看 props 中有没有
    }
    // publicGetter其实就是代理获取instance上的属性的方法
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },

  set({ _: instance }, key, value) {
    const { setupState } = instance;
    // TODO: 这部分有些疑问， setupState != {}
    if (setupState != {} && hasOwn(setupState, key)) {
      setupState[key] = value;
    }
    return true;
  },
};
