import { pushTarget, popTarget } from "./dep.js";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.options = options;
    this.id = id++;
    this.getter = exprOrFn; // 将内部传过来的回调函数 放到 getter 属性上
    this.depsID = new Set();
    this.deps = [];
    this.get(); // 调用get方法， 会让渲染 watcher 执行
  }

  get() {
    pushTarget(this); // 存储watcher， Dep.target
    // console.log('watcher get ===>',this);

    this.getter(); // 渲染 watcher 执行
    popTarget(); // 移除 watcher
  }

  update() {
    // watcher 里不能放重复的 dep， dep里也不能放重复的 watcher
    this.get();
  }

  addDep(dep) {
    let id = dep.id;

    if (!this.depsID.has(id)) {
      this.depsID.add(id);
      this.deps.push(dep);
      dep.addSub(this)
    }
  }
}

export default Watcher;
