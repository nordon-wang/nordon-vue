let id = 0;

/** 
 * Watcher 和 Dep 是多对多的关系
*/
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = [] // msg : [watcher, watcher]
  }

  depend() {
    // this.subs.push(Dep.target)
    
    // 让这个 watcher 记住当前的 dep
    // 如果 watcher 没有存过 dep， dep 肯定不能村过watcher
    Dep.target.addDep(this)
  }

  // 通知 watcher 更新
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }
}

// 将watcher 保留起来
let stack = [];

/**
 * 存储 target
 */
export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}

/**
 * 移除 target
 */
export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}
