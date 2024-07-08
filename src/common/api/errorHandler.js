import { Message } from "element-ui";
export default function errorHandler(error) {
  if (error.response) {
    const { status } = error.response;
    if (status === 403) {
      Message.error("无权限使用此功能");
    } else if (status === 405) {
      Message.error("请求方法类型错误");
    } else if (status === 500) {
      Message.error("服务器内部错误");
    } else {
      Message.error("请求错误");
    }
  } else if (error.response == undefined) {
    Message.error("服务器开小差了，请联系管理员");
  } else if (error.request) {
    Message.error("请求发送失败");
  } else {
    Message.error("发生错误");
  }
}
