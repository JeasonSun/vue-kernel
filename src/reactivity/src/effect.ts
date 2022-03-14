
const targetMap = new WeakMap();
let activeEffect = void 0;

export class ReactiveEffect {

  constructor(public fn, public scheduler?) {
    console.log('创建ReactiveEffect对象');
  }

  run() {
    console.log('run');

    activeEffect = this as any;
    const result = this.fn();

    return result;
  }
}

export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn);

  _effect.run();
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
  deps.forEach(effect => effect.run())
}