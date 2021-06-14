
## 记录

### runtime && full

- vue-full
vue-full 是 compiler + runtime， compiler 可以将模版转换为render函数

- vue-runtime
没有compiler, 在开发的时候不能使用 template 语法， .vue 文件的是通过 vue-loader进行处理的，和compiler 无关
不能直接这么使用

```vue
new Vue({
  template: '<div>xxxx</div>'
})
```

### 打包模式
- cjs: commonJS 规范
- esm: esModule 规范
- umd: AMD 和 commonJS 的结合体