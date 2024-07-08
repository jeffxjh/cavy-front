import { Loading } from "element-ui"; // 装包方式这样引入,我这里通过cdn引入,通过window.ELEMENT调用
// loading对象
let loading;

// 当前正在请求的数量
let needLoadingRequestCount = 0;

// 显示loading
export function showLoading(target) {
  // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  console.log(needLoadingRequestCount, loading);
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      // 通过cdn引入的element-ui
      lock: true,
      text: "加载中...",
      background: "rgba(255, 255, 255, 0.7)",
      target: document.querySelector(target || "#app")
    });
  }
  needLoadingRequestCount++;
}

// 隐藏loading
export function hideLoading() {
  needLoadingRequestCount--;
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); // 做个保护
  if (needLoadingRequestCount === 0) {
    // 关闭loading
    toHideLoading();
  }
}

/**
 * @desc 函数防抖
 * @param func 目标函数
 * @param wait 延迟执行毫秒数
 * @param immediate true - 立即执行， false - 延迟执行
 *   立即执行版的意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果
   非立即执行版的意思是触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 */
export function debounce(func, wait, immediate) {
  let timer;
  return function() {
    let context = this;
    let args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}

// 防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
let toHideLoading = debounce(() => {
  if (loading != null && loading != undefined) {
    loading.close();
    loading = null;
  }
}, 300);
