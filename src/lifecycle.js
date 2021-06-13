import Watcher from "./observe/watcher";
import { patch } from "./vdom/patch";

/**
 * 生命周期
 */

export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el; // 真实的DOM元素
  // console.log(options, vm.$el);

  /**
   * Watcher 就是用来渲染的
   * vm._render 通过解析的render方法 渲染出虚拟dom
   * vm._update 通过虚拟dom 创建 真实dom
   */
  
  // 渲染页面
  // 无论渲染还是更新 都会执行
  let updateComponent = () => {
    // vm._render() 返回的是虚拟DOM
    vm._update(vm._render());
  };

  // 渲染 watcher， 每一个组件都有一个watcher
  // true 表示他是一个渲染watcher
  new Watcher(vm, updateComponent, () => {}, true);
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    
    // 通过虚拟节点 渲染出来真实dom
    // 需要用虚拟节点创建出来真实节点 替换掉 真实的 $el
    vm.$el = patch(vm.$el, vnode)

  };
}
