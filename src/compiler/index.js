import { parseHTML } from "./parse-html";
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
// <div id="app"><p>hi {{msg}}</p> hello</div>
// 核心思路 将上面的模板转换成 下面的render函数
//  _c(
//   'div', 
//   {id: app}, 
//   _c('p', undefined, _v('hi' + _s(msg))),
//   _v('hello')
// )


// 处理属性   === 拼接成属性的字符串
// [{id: app}, {msg: xxx}]  ===> {id: app, msg: xxx}
function genProps(attrs) {
  let str = ''
  
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]

    if(attr.name === 'style') {
      // style="color: aqua;"  ==> {style: {color: aqua}}
      let obj = {}
      
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        if(key) {
          obj[key] = value.trim()
        }
      });

      attr.value = obj
    }

    str += `${attr.name}: ${JSON.stringify(attr.value)},`
  }

  return `{${str.slice(0, -1)}}`
}


function gen(node) {
  if(node.type === 1) { // 元素标签
    return generator(node)
  } else {
    let text = node.text
    let tokens = []
    let match = null
    let index = null
    let lastIndex = defaultTagRE.lastIndex = 0
    
    while (match = defaultTagRE.exec(text)) {
      index = match.index
      
      if(index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }

      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if(lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    return `_v(${tokens.join('+')})`
  }
}

function genChildren(el) {
  let children = el.children

  if(children && children.length) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false
  }
}

function generator(el) {
  const children = genChildren(el)
  
  let code = `_c(
    "${el.tag}", 
    ${el.attrs.length  ? genProps(el.attrs) : 'undefined'}
    ${children ? `,${children}` : ''}
  )`

  return code;
}

export function compileToFunction(template) {
  // 1. 解析HTML 字符串 -》 编程AST语法树
  let root = parseHTML(template);
  // console.log(root);

  // 2. 需要将 AST语法树 生成 render 函数
  let code = generator(root)
  // console.log('code...',code);
  
  // 所有的 模版引擎实现 都需要 new Function + with
  let renderFn = new Function(`with(this) { 
    return ${code} 
  }`)
  // console.log(renderFn);
  
  // renderFn 返回的是虚拟DOM
  return renderFn
}

