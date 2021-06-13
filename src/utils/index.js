

/** 
 * 判断是不是对象
*/
export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

/** 
 * 不可配置 不可枚举
*/
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value
  })
}


/** 
 * 代理
*/
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })  
}