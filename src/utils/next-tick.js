let callbacks = [];
let waiting = false; // 防止多次调用nextTick

function flushCallback() {
  callbacks.forEach((cb) => cb());
  waiting = false
  callbacks = []
}

export function nextTick(cb) {
  // 多次调用 textTick 如果没有刷新的时候 就先把它放到数组中
  // 刷新后 更改waiting
  callbacks.push(cb);
  if(!waiting) {
    setTimeout(flushCallback, 0);
    waiting = true
  }
}
