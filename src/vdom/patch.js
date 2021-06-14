import { createElement } from "./create-element";

export function patch(oldVnode, vnode) {
  // console.log(oldVnode, vnode);
  /**
   * 判断是更新还是渲染
   */
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 是真实节点 渲染
    const oldEle = oldVnode;
    const parentEle = oldEle.parentNode; // body

    let el = createEle(vnode);
    parentEle.insertBefore(el, oldEle.nextSibling);
    parentEle.removeChild(oldEle);

    // 需要将渲染好的结果 返回
    return el
  }

  // 递归创建真实节点 替换老的节点
}

/**
 * 根据虚拟节点 创建真实DOM
 */
function createEle(vnode) {
  const { tag, children, key, data, text } = vnode;

  // 是标签
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag)

    updateProperties(vnode) // 增加属性

    children.forEach(child => {
      // 递归创建儿子节点， 将儿子节点放到父节点中
      return vnode.el.appendChild(createEle(child))
    })
  } else {
    // 是文本
    // 虚拟dom上映射着真实dom， 方便后续更新操作
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}


/** 
 * 增加属性
*/
function updateProperties(vnode) {
  let newProps = vnode.data;
  let el = vnode.el

  for (const key in newProps) {
    if(key === 'style') {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    }else if(key === 'class'){
      el.className = newProps[key]
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
