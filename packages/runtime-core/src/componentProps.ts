export function initProps(instance, rawProps) {
  console.log("initProps");
  // TODO: initProps需要处理attrs
  // 如果组件声明了 props 的话， 才可以进入props 属性内
  // 不然的话需要存储在attrs内
  // 还要根据isStatefulComponent做额外处理
  // 具体参见源码： runtime-core/src/componentProps.ts
  instance.props = rawProps;
}
