export function formatDate(date, fmt) {
    date = new Date(date);
    if (typeof(fmt) === "undefined") {
        fmt = "yyyy-MM-dd HH:mm:ss";
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length));
        }
    }
    return fmt
}


export function formatterMsgLevel(value) {
    switch (value) {
      case "1":
        return "重要";
      case "2":
        return "一般";
      case "3":
        return "提醒";
    }
    return value;
  }