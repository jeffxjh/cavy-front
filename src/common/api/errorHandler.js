export default function errorHandler(error) {
  // 根据不同的错误类型进行处理
  if (error.response) {
    // 后端返回错误
    const { status } = error.response;
    if (status === 403) {
      // 处理权限不足的情况
      alert("无权限使用此功能");
    } else if (status === 500) {
      // 处理服务器内部错误
      alert("服务器内部错误");
    } else {
      // 处理其他错误
      alert("请求错误");
    }
  } else if (error.response == undefined) {
    //服务没准备好
    alert("服务器开小差了，请联系管理员");
  } else if (error.request) {
    // 请求发送失败
    alert("请求发送失败");
  } else {
    // 其他错误
    alert("发生错误");
  }
}
