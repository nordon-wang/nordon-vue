import { isObject, def } from "../utils/index";
import { arrayMethods } from "./array";

class Observer {
  constructor(value) {
    // 给每一个监控过的对象都增加一个 __ob__ 属性
    // value.__ob__  = this // 存在循环调用的风险
    // Object.defineProperty(value, '__ob__', {
    //   enumerable: false,
    //   configurable: false,
    //   value: this
    // })
    def(value, '__ob__', this)

    // 如果是数组的话 并不会对索引进行观测， 因为会导致性能问题
    // 前端开发中很少 去直接操作索引
    if (Array.isArray(value)) {
      // 重写数组的一些方法
      value.__proto__  = arrayMethods
      // 如果数组中放的是对象 再监控
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(data) {
    let keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];

      defineReactive(data, key, value);
    }
  }

  observeArray(data) {
    // 监控数组中的对象
    for (let i = 0; i < data.length; i++) {
      observe(data[i]);
    }
  }
}

function defineReactive(data, key, value) {
  observe(value); //  递归

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) {
        return;
      }

      // console.log("set...");
      observe(newValue); // 继续劫持用户设置的值， 可能会设置新的对象
      value = newValue;
    },
  });
}

// 把 data 中的数据 都使用 Object.defineProperty 重新定义
export function observe(data) {
  // 容错
  if (!isObject(data)) {
    return;
  }

  return new Observer(data); // 观测数据
}
