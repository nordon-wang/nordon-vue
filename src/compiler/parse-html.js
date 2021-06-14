const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //  asd-asd
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <asd:asd>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

/**
 * AST 语法树： 是用对象来描述 HTML、JS等原生语法的
 * 虚拟DOM： 使用对象来描述 DOM节点的
 */

export function parseHTML(html) {
  let root = null; //  ast树的树根
  let currentParent = null; // 标识当前的parent
  let stack = [];
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    };
  }

  function start(tagName, attrs) {
    // console.log("开始标签", tagName, "属性", attrs);
    // 遇到开始标签 创建一个 ast 元素
    let element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    // 把当前元素标记为 parent
    currentParent = element;
    stack.push(element); // 将开始标签 存放到栈中
  }

  function chars(text) {
    // console.log("文本是", text);
    text = text.replace(/\s/g, "");

    if (text) {
      currentParent.children.push({
        text,
        type: TEXT_TYPE,
      });
    }
  }

  function end(tagName) {
    // console.log("结束", tagName);
    let element = stack.pop();

    // 标识当前这个元素是属于parent的children
    currentParent = stack[stack.length - 1];

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element); // 实现一个树的父子关系
    }
  }
  
  // 不停的解析HTML字符串
  while (html) {
    let textEnd = html.indexOf("<");

    if (textEnd === 0) {
      // 如果当前的索引为0 肯定是一个标签：开始标签、结束标签

      // 通过这个方法获取到匹配的结果 tagName attrs
      let startTagMatch = parseeStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue; // 如果开始标签匹配结束了 继续下一次匹配
      }

      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }

    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd);
    }

    if (text) {
      advance(text.length);
      chars(text);
    }
  }

  function advance(n) {
    html = html.substring(n);
  }

  function parseeStartTag() {
    let start = html.match(startTagOpen);
    // 匹配到内容
    if (start) {
      let match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length); // 将标签删除

      let end, attr;

      // 匹配到标签结束 && 有属性
      // 将属性进行解析
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length); // 将属性移除
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
      }

      // 结束标签
      if (end) {
        // 去掉开始标签的 >
        advance(end[0].length);
        return match;
      }
    }
  }

  return root;
}
