import { extend } from "../../shared/src";

const targetMap = new WeakMap();
let activeEffect = void 0;

export class ReactiveEffect {

  constructor(public fn, public scheduler?) {
    console.log('创建ReactiveEffect对象');
  }

  run() {

    activeEffect = this as any;
    const result = this.fn();

    return result;
  }
}

export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn);
  if (options) {
    extend(_effect, options)
  }
  _effect.run();

  // 返回runner，让用户自行选择调用时机(effectFn)
  const runner = _effect.run.bind(_effect);

  return runner;
}

export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  deps.add(activeEffect);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  deps.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}