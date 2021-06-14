/**
 * 判断是不是对象
 */
export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

/**
 * 不可配置 不可枚举
 */
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value,
  });
}

/**
 * 代理
 */
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}

/**
 * 合并
 */
const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  'beforeDestroy',
  'destroyed'
];

let strats = {
}

/** 
 * 合并钩子
*/
function mergeHook(parentVal, childVal) {
  if(childVal) { // 有child
    if(parentVal) { // parent child 都有， 需要变成数组
      return parentVal.concat(childVal)
    }else {
      return [childVal]
    }
  }else { // 没有child  直接使用老的
    return parentVal
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {};

  /**
   * 默认的合并策略， 但是有些属性 需要特殊的合并方: 生命周期的合并
   */
  function mergeField(key) {
    // 生命周期的合并方式
    if(strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }

    // 都是对象
    if (typeof parent[key] === "object" && typeof child[key] === "object") {
      options[key] = {
        ...parent[key],
        ...child[key],
      };
    } else if (child[key] === null) {
      // 儿子没有 父亲有
      options[key] = parent[key];
    } else {
      options[key] = child[key];
    }
  }

  // 遍历 parent
  for (const key in parent) {
    mergeField(key);
  }

  // 遍历 child， 如果已经合并过了， 就不需要再次合并了
  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  return options;
}
