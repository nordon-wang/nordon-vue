import { initState } from "./state";
import { compileToFunction } from "./compiler/index";
import { mountComponent, callHook } from "./lifecycle";
import { mergeOptions } from "./utils/index";

// 在原型上添加一个 init 方法
export function initMixin(Vue) {
  // 初始化流程
  Vue.prototype._init = function (options) {
    // console.log("初始化流程", options);

    // 数据劫持
    const vm = this; // Vue 中使用 this.$options 指代的就是用户传递的属性
    // vm.$options = options;
    /**
     * 合并
     *   将用户传递的和全局的 进行合并
     *   不能直接写 Vue.options 应该写 vm.constructor.options
     *      因为如果写成Vue.options， 会导致后续的options指向不对
     *      Foo extend Vue
     *      const foo = new Foo()
     *      foo._init 的时候 options应该是要指向 Foo, 而不是 Vue
     */
    vm.$options = mergeOptions(vm.constructor.options, options);

    callHook(vm, "beforeCreate");
    // 初始化状态
    initState(vm); // 分割代码

    callHook(vm, "created");
    // 如果传入了 el 属性， 需要将页面渲染出来
    // 传入 el ， 实现挂载流程
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    let options = vm.$options;
    el = document.querySelector(el);

    // 渲染优先级 render -- template -- el内容
    if (!options.render) {
      // 对 template 编译
      let template = options.template;

      if (!template && el) {
        // 模版
        // 如果没有传入 template， 将 el 中的内容当作 template
        template = el.outerHTML;
      }

      // 需要将 template 转换为 render 方法
      const render = compileToFunction(template);
      // 将生成的 render 函数 放到 options上， 后续使用
      options.render = render;
    }

    //  执行render函数， 挂载组件
    mountComponent(vm, el);
  };
}


