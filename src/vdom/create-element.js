/**
 * 虚拟节点 -- 通过 _c _v 实现用对象来描述dom的操作
 */

/**
 * 1. 将 template 转换 ast 语法树 -- 生成 render 方法 -- 生成虚拟dom -- 真实dom
 */

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text,
  };
}

/**
 * 创建元素的虚拟节点
 */
export function createElement(tag, data, ...children) {
  // console.log("createElement", tag, data, ...children);
  let key = data && data.key

  if(key) {
    delete data.key
  }

  return vnode(tag, data, key, children, undefined);
}

/**
 * 创建文本的虚拟节点
 */
export function createTextNode(text) {
  // console.log("createTextNode", text);
  return vnode(undefined, undefined, undefined, undefined, text);
}
