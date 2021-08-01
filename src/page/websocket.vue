<template>
  <div class="test">
    <el-button type="text" @click="open">发送ws消息</el-button>
  </div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      websock: null
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
      //const wsuri = "ws://localhost:8011/cavy/websocket/DPS007";
      const wsuri = "ws://localhost:8011/cavy/ws/serverTwo";
      let token = localStorage.getItem("token")
      this.websock = new WebSocket(wsuri, [token]);
      // this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let actions = {test: "12345"};
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    open() {
      this.$prompt("请输入邮箱", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({value}) => {
          // this.$message({
          //   type: "success",
          //   message: "你的邮箱是: " + value
          // });
          this.websocketsend(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    }
  }
};
</script>
