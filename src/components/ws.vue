<template></template>

<script>
export default {
  name: "ws",
  props: {
    compomentName: {
      typeof: String,
      default: "default",
      required: true,
    },
    //ws地址
    path: {
      typeof: String,
      required: true,
    },
  },
  data() {
    return {
      websock: null,
    };
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      const ws_base_path = process.env.BASE_WEBSOCKET_PATH;
      const wsuri = ws_base_path + this.path;
      let token = localStorage.getItem("token");
      this.websock = new WebSocket(wsuri, [token]);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let actions = { compomentName: this.compomentName};
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      console.info("收到消息：" + e.data);
      if(redata.bussType===this.compomentName){
        this.$emit('on-message',redata.content);
      }
    },
    websocketsend(Data) {
      //延迟数据发送
      setTimeout(() => {
        if (this.websock.readyState === WebSocket.OPEN) {
          this.websock.send(Data);
        } else {
          this.websocketsend(Data);
        }
      }, 1000);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    open() {
      this.$prompt("请输入邮箱", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          // this.$message({
          //   type: "success",
          //   message: "你的邮箱是: " + value
          // });
          this.websocketsend(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
  },
};
</script>
