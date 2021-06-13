// 重写数组的一些方法（会改变数组本身的一些方法）
const methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "sort",
  "splice",
  "reverse",
];

let oldArrayMethods = Array.prototype;
export let arrayMethods = Object.create(oldArrayMethods);

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    // console.log('用户调用了', method);
    // AOP 切片编程
    const result = oldArrayMethods[method].apply(this, args)

    // push unshift 添加的元素可能还是一个对象
    let inserted; // 当前用户插入的元素
    let ob = this.__ob__ // 

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
    
      case 'splice': // splice 有新增 删除的功能，
        inserted = args.slice(2); // 截取 新增的数据
        break;
      default:
        break;
    }

    if(inserted) {
      // 将新增属性 继续观测
      ob.observeArray(inserted)
    }

    return result
  };
});
