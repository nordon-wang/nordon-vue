import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";

// Vue 核心代码 ， 只是Vue 的一个声明
function Vue(options) {
  // 进行Vue 的初始化操作
  this._init(options);
}

// 通过引入文件的方式 给Vue 原型增加方法
initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);

export default Vue;
