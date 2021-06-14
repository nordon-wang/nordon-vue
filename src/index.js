import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import { initGlobalAPI } from "./initGlobalAPI/index";
// Vue 核心代码 ， 只是Vue 的一个声明
function Vue(options) {
  // 进行Vue 的初始化操作
  this._init(options);
}

// 通过引入文件的方式 给Vue 原型增加方法
initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);

// 初始化全局 API
initGlobalAPI(Vue);
export default Vue;
