(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /** 
   * 判断是不是对象
  */
  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }
  /** 
   * 不可配置 不可枚举
  */

  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }
  /** 
   * 代理
  */

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }

  // 重写数组的一些方法（会改变数组本身的一些方法）
  var methods = ["push", "pop", "shift", "unshift", "sort", "splice", "reverse"];
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // console.log('用户调用了', method);
      // AOP 切片编程
      var result = oldArrayMethods[method].apply(this, args); // push unshift 添加的元素可能还是一个对象

      var inserted; // 当前用户插入的元素

      var ob = this.__ob__; // 

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // splice 有新增 删除的功能，
          inserted = args.slice(2); // 截取 新增的数据

          break;
      }

      if (inserted) {
        // 将新增属性 继续观测
        ob.observeArray(inserted);
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 给每一个监控过的对象都增加一个 __ob__ 属性
      // value.__ob__  = this // 存在循环调用的风险
      // Object.defineProperty(value, '__ob__', {
      //   enumerable: false,
      //   configurable: false,
      //   value: this
      // })
      def(value, '__ob__', this); // 如果是数组的话 并不会对索引进行观测， 因为会导致性能问题
      // 前端开发中很少 去直接操作索引

      if (Array.isArray(value)) {
        // 重写数组的一些方法
        value.__proto__ = arrayMethods; // 如果数组中放的是对象 再监控

        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key];
          defineReactive(data, key, value);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        // 监控数组中的对象
        for (var i = 0; i < data.length; i++) {
          observe(data[i]);
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); //  递归

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) {
          return;
        }

        console.log("set...");
        observe(newValue); // 继续劫持用户设置的值， 可能会设置新的对象

        value = newValue;
      }
    });
  } // 把 data 中的数据 都使用 Object.defineProperty 重新定义


  function observe(data) {
    // 容错
    if (!isObject(data)) {
      return;
    }

    return new Observer(data); // 观测数据
  }

  function initState(vm) {
    var ops = vm.$options; // Vue 的数据来源 -- 属性 方法 数据 计算属性 watch 等

    if (ops.props) ;

    if (ops.methods) ;

    if (ops.data) {
      initData(vm);
    }

    if (ops.computed) ;

    if (ops.watch) ;
  }

  function initData(vm) {
    // console.log('初始化数据', vm.$options.data);
    // 用户传递的data
    var data = vm.$options.data; // 确保data 是一个 对象
    // vm._data 方便用户获取data的数据

    data = vm._data = typeof data === "function" ? data.call(vm) : data; // 为了让用户更好的使用  直接vm.xxx 取值

    for (var key in data) {
      proxy(vm, "_data", key);
    } // 数据劫持


    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //  asd-asd

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <asd:asd>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  /**
   * AST 语法树： 是用对象来描述 HTML、JS等原生语法的
   * 虚拟DOM： 使用对象来描述 DOM节点的
   */

  var root = null; //  ast树的树根

  var currentParent = null; // 标识当前的parent

  var stack = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  function start(tagName, attrs) {
    // console.log("开始标签", tagName, "属性", attrs);
    // 遇到开始标签 创建一个 ast 元素
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    } // 把当前元素标记为 parent


    currentParent = element;
    stack.push(element); // 将开始标签 存放到栈中
  }

  function chars(text) {
    // console.log("文本是", text);
    text = text.replace(/\s/g, '');

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    // console.log("结束", tagName);
    var element = stack.pop(); // 标识当前这个元素是属于parent的children

    currentParent = stack[stack.length - 1];

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element); // 实现一个树的父子关系
    }
  }

  function parseHTML(html) {
    // 不停的解析HTML字符串
    while (html) {
      var textEnd = html.indexOf("<");

      if (textEnd === 0) {
        // 如果当前的索引为0 肯定是一个标签：开始标签、结束标签
        // 通过这个方法获取到匹配的结果 tagName attrs
        var startTagMatch = parseeStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; // 如果开始标签匹配结束了 继续下一次匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

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
      var start = html.match(startTagOpen); // 匹配到内容

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 将标签删除

        var _end, attr; // 匹配到标签结束 && 有属性
        // 将属性进行解析


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length); // 将属性移除

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        } // 结束标签


        if (_end) {
          // 去掉开始标签的 >
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // <div id="app"><p>hi {{msg}}</p> hello</div>
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
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          // style="color: aqua;"  ==> {style: {color: aqua}}
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            if (key) {
              obj[key] = value.trim();
            }
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ": ").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type === 1) {
      // 元素标签
      return generator(node);
    } else {
      var text = node.text;
      var tokens = [];
      var match = null;
      var index = null;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function generator(el) {
    var children = genChildren(el);
    var code = "_c(\n    \"".concat(el.tag, "\", \n    ").concat(el.attrs.length ? genProps(el.attrs) : 'undefined', "\n    ").concat(children ? ",".concat(children) : '', "\n  )");
    return code;
  }

  function compileToFunction(template) {
    // 1. 解析HTML 字符串 -》 编程AST语法树
    var root = parseHTML(template); // console.log(root);
    // 2. 需要将 AST语法树 生成 render 函数

    var code = generator(root); // console.log('code...',code);
    // 所有的 模版引擎实现 都需要 new Function + with

    var renderFn = new Function("with(this) { \n    return ".concat(code, " \n  }")); // console.log(renderFn);
    // renderFn 返回的是虚拟DOM

    return renderFn;
  }

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.getter = exprOrFn; // 将内部传过来的回调函数 放到 getter 属性上

      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        this.getter();
      }
    }]);

    return Watcher;
  }();

  /**
   * 虚拟节点 -- 通过 _c _v 实现用对象来描述dom的操作
   */

  /**
   * 1. 将 template 转换 ast 语法树 -- 生成 render 方法 -- 生成虚拟dom -- 真实dom
   */
  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }
  /**
   * 创建元素的虚拟节点
   */


  function createElement(tag, data) {
    // console.log("createElement", tag, data, ...children);
    var key = data && data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }
  /**
   * 创建文本的虚拟节点
   */

  function createTextNode(text) {
    // console.log("createTextNode", text);
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function patch(oldVnode, vnode) {
    // console.log(oldVnode, vnode);

    /**
     * 判断是更新还是渲染
     */
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 是真实节点 渲染
      var oldEle = oldVnode;
      var parentEle = oldEle.parentNode; // body

      var el = createEle(vnode);
      parentEle.insertBefore(el, oldEle.nextSibling);
      parentEle.removeChild(oldEle);
    } // 递归创建真实节点 替换老的节点

  }
  /**
   * 根据虚拟节点 创建真实DOM
   */

  function createEle(vnode) {
    var tag = vnode.tag,
        children = vnode.children;
        vnode.key;
        vnode.data;
        var text = vnode.text; // 是标签

    if (typeof tag === "string") {
      vnode.el = document.createElement(tag);
      updateProperties(vnode); // 增加属性

      children.forEach(function (child) {
        // 递归创建儿子节点， 将儿子节点放到父节点中
        return vnode.el.appendChild(createEle(child));
      });
    } else {
      // 是文本
      // 虚拟dom上映射着真实dom， 方便后续更新操作
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }
  /** 
   * 增加属性
  */


  function updateProperties(vnode) {
    var newProps = vnode.data;
    var el = vnode.el;

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps[key];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  /**
   * 生命周期
   */

  function mountComponent(vm, el) {
    vm.$options;
    vm.$el = el; // 真实的DOM元素
    // console.log(options, vm.$el);

    /**
     * Watcher 就是用来渲染的
     * vm._render 通过解析的render方法 渲染出虚拟dom
     * vm._update 通过虚拟dom 创建 真实dom
     */
    // 渲染页面
    // 无论渲染还是更新 都会执行

    var updateComponent = function updateComponent() {
      // vm._render() 返回的是虚拟DOM
      vm._update(vm._render());
    }; // 渲染 watcher， 每一个组件都有一个watcher
    // true 表示他是一个渲染watcher


    new Watcher(vm, updateComponent, function () {}, true);
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; // 通过虚拟节点 渲染出来真实dom
      // 需要用虚拟节点创建出来真实节点 替换掉 真实的 $el

      vm.$el = patch(vm.$el, vnode);
    };
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // console.log("初始化流程", options);
      // 数据劫持
      var vm = this; // Vue 中使用 this.$options 指代的就是用户传递的属性

      vm.$options = options; // 初始化状态

      initState(vm); // 分割代码
      // 如果传入了 el 属性， 需要将页面渲染出来
      // 传入 el ， 实现挂载流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 渲染优先级 render -- template -- el内容

      if (!options.render) {
        // 对 template 编译
        var template = options.template;

        if (!template && el) {
          // 模版
          // 如果没有传入 template， 将 el 中的内容当作 template
          template = el.outerHTML;
        } // 需要将 template 转换为 render 方法


        var render = compileToFunction(template); // 将生成的 render 函数 放到 options上， 后续使用

        options.render = render;
      } //  执行render函数， 挂载组件


      mountComponent(vm, el);
    };
  }

  function renderMixin(Vue) {
    /**
     * _c 创建元素的虚拟节点
     * _v 创建文本的虚拟节点
     * _s JSON.stringify
     */
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments);
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val === null ? "" : _typeof(val) === "object" ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; // console.log(render);

      return render.call(vm); // render 去实例上取值, 返回 vnode
    };
  }

  function Vue(options) {
    // 进行Vue 的初始化操作
    this._init(options);
  } // 通过引入文件的方式 给Vue 原型增加方法


  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
