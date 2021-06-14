import { nextTick } from "../utils/next-tick";
/**
 * 批量更新
 */
let queue = [];
let has = {};

function flushSchedularQueue() {
  queue.forEach((watcher) => watcher.run());
  // 下一次继续使用
  queue = [];
  has = {};
}

export function queueWatcher(watcher) {
  const { id } = watcher;

  // 如果不存在 放到队列中
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;

    // textTick ==> promise / mutationObserver / setImmediate / setTimeout
    nextTick(flushSchedularQueue);
    // setTimeout(flushSchedularQueue, 0);
  }
}
