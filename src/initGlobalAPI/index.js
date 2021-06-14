import { mergeOptions } from "../utils/index";

export function initGlobalAPI(Vue) {
  // 整合了所有的全局相关的内容
  Vue.options = {};

  Vue.mixin = function (mixin) {
    // 将用户传递的 mixin 合并
    this.options = mergeOptions(this.options, mixin);
  };

  Vue.mixin({
    a: 1,
    beforeCreate() {
      console.log('mixin 1');
    },
  })
  
  Vue.mixin({
    b: 2,
    beforeCreate() {
      console.log('mixin 2');
    },
  })

  console.log(Vue.options);
  
}

/**
 * 生命周期的合并策略
 *   存放 到 Vue.options中 -- [beforeCreate, beforeCreate]
 *   按照顺序执行
 */
/* 
Vue.mixin({
  beforeCreate() {
  },
})

Vue.mixin({
  beforeCreate() {
  },
}) 
*/
