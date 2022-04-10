# vue-kernel

深入学习 Vue3 核心逻辑，从零构建 Vue3 模型。


## Task

### reactivity
目标是用自己的 reactivity 支持现有的 demo 运行

- [x] reactive 的实现
- [x] track 依赖收集
- [x] trigger 触发依赖
- [x] effect 的实现
- [x] 支持 effect.scheduler
- [x] 支持 effect.stop
- [x] readonly 的实现
- [x] 支持 isReactive
- [x] 支持 isReadonly
- [x] 支持 isProxy
- [x] 支持嵌套 reactive
- [x] 支持嵌套 readonly
- [x] 支持 shallowReadonly
- [x] 支持 shallowReactive
- [x] ref 的实现
- [x] isRef和unRef的实现
- [x] 支持 proxyRefs
- [x] computed 的实现
- [ ] 支持 toRaw

### runtime-core
- [x] 支持组件类型
- [x] 支持 element 类型
- [x] 初始化 props
- [x] 处理事件绑定
- [x] setup 可获取 props 和 context
- [ ] 支持 component emit
- [x] 支持 proxy
- [x] 可以在 render 函数中获取 setup 返回的对象
- [ ] nextTick 的实现
- [ ] 支持 getCurrentInstance
- [ ] 支持 provide/inject
- [ ] 支持最基础的 slots
- [ ] 支持 Text 类型节点
- [ ] 支持 $el api

### runtime-dom

### compile-core


## example

## docs
* [1-1.搭建开发环境](./docs/1-1.setupDevEnv.md)
