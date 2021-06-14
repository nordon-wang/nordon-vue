import { isObject, def } from "../utils/index";
import { arrayMethods } from "./array";
import Dep from "./dep";
class Observer {
  constructor(value) {
    this.dep = new Dep(); // 这里的 dep 是给数组使用的

    // 给每一个监控过的对象都增加一个 __ob__ 属性
    // value.__ob__  = this // 存在循环调用的风险
    // Object.defineProperty(value, '__ob__', {
    //   enumerable: false,
    //   configurable: false,
    //   value: this
    // })
    def(value, "__ob__", this);

    // 如果是数组的话 并不会对索引进行观测， 因为会导致性能问题
    // 前端开发中很少 去直接操作索引
    if (Array.isArray(value)) {
      // 重写数组的一些方法
      value.__proto__ = arrayMethods;
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
  // 这个dep 是给对象使用的， 数组是不能使用的
  let dep = new Dep();

  /**
   * value 可能是数组 也可能是对象
   * 返回的结果是 observe 实例， 当前这个 value 对应的 observe
   */
  let childOb = observe(value); //  递归

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      // console.log("get....", value);
      /**
       * 每个属性 都对应着 自己的 watcher,
       * 需要给每个属性都增加 watcher
       * msg: [watcher, watcher]
       * foo: [watcher]
       */
      if (Dep.target) {
        // 有值  代表渲染watcher 已经放上去了
        // 如果当前存在 watcher， 将watcher 和  dep 建立一个双向的关系
        dep.depend(); // 我要将 watcher 存起来

        if (childOb) {
          // 收集了数组的相关依赖
          childOb.dep.depend();

          // 如果数组中 还有数组, 需要将数组中的每一项再收集一下依赖
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
      }

      return value;
    },
    set(newValue) {
      if (newValue === value) {
        return;
      }

      // console.log("set...");
      observe(newValue); // 继续劫持用户设置的值， 可能会设置新的对象
      value = newValue;

      dep.notify(); // 通知依赖的 watcher 进行更新操作
    },
  });
}

/** 
 * 多维数组 收集依赖
*/
function dependArray(val) {
  for (let i = 0; i < val.length; i++) {
    const current = val[i];
    
    // 将数组中的每一个都取出来， 数据变化后 更新视图
    current.__ob__ && current.__ob__.dep.depend()

    if(Array.isArray(current)) {
      dependArray(current)
    }
  }
}

// 把 data 中的数据 都使用 Object.defineProperty 重新定义
export function observe(data) {
  // 容错
  if (!isObject(data)) {
    return;
  }

  return new Observer(data); // 观测数据
}
