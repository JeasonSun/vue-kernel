import { extend } from "../../shared/src";

const targetMap = new WeakMap();
let activeEffect = void 0;
let shouldTrack = false;

export class ReactiveEffect {
  deps: any[] = [];
  active = true;
  constructor(public fn, public scheduler?) {

  }

  run() {

    if (!this.active) {
      return this.fn();
    }

    activeEffect = this as any;
    shouldTrack = true;

    const result = this.fn();

    activeEffect = undefined;
    shouldTrack = false;

    return result;
  }

  stop() {
    if (this.active) {
      this.deps.forEach(dep => {
        dep.delete(this)
      })
      this.deps.length = 0;
      this.active = false;
    }

  }
}

export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn);
  if (options) {
    extend(_effect, options)
  }
  _effect.run();

  // 返回runner，让用户自行选择调用时机(effectFn)
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

export function track(target, key) {
  // 如果响应式数据不在effect中，那直接不用收集了，因为收集了也没有触发更新的时机。
  if (!activeEffect) {
    return;
  }
  if (!shouldTrack) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    (activeEffect as any).deps.push(dep);
  }

}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if(!depsMap){
    // 没有被track， 比如 shallowReactive.spec.ts中，shallowReactive，没有收集依赖，但是在修改props.n时候触发更新，找不到depsMap
    return;
  }
  const deps = depsMap.get(key);
  deps.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}