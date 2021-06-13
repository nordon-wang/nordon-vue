import { observe } from "./observe/index";
import { proxy } from "./utils/index";

export function initState(vm) {
  const ops = vm.$options;

  // Vue 的数据来源 -- 属性 方法 数据 计算属性 watch 等
  if (ops.props) {
    initProps(vm);
  }

  if (ops.methods) {
    initMethod(vm);
  }

  if (ops.data) {
    initData(vm);
  }

  if (ops.computed) {
    initComputed(vm);
  }

  if (ops.watch) {
    initWatch(vm);
  }
}

function initProps(vm) {}
function initMethod(vm) {}

function initData(vm) {
  // console.log('初始化数据', vm.$options.data);
  // 用户传递的data
  let data = vm.$options.data;
  // 确保data 是一个 对象
  // vm._data 方便用户获取data的数据
  data = vm._data = typeof data === "function" ? data.call(vm) : data;

  // 为了让用户更好的使用  直接vm.xxx 取值
  for (const key in data) {
    proxy(vm, "_data", key);
  }

  // 数据劫持
  observe(data);
}
function initComputed(vm) {}
function initWatch(vm) {}
