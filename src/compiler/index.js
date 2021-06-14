import { parseHTML } from "./parse-html";
import { generator } from "./generator";

export function compileToFunction(template) {
  // 1. 解析HTML 字符串 -》 编程AST语法树
  let root = parseHTML(template);
  // console.log(root);

  // 2. 需要将 AST语法树 生成 render 函数
  let code = generator(root);
  // console.log('code...',code);

  // 所有的 模版引擎实现 都需要 new Function + with
  let renderFn = new Function(`with(this) { 
    return ${code} 
  }`);
  // console.log(renderFn);

  // renderFn 返回的是虚拟DOM
  return renderFn;
}
