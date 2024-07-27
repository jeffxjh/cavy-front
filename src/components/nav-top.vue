<template>
  <el-container>
    <el-aside width="auto" class="header-logo tap">
      <img class="logo" src="@/assets/icons/logo.png" alt="Logo" />
    </el-aside>
    <el-aside width="auto" class="header-logo tap">
      <!-- :value="messageNum" :is-dot="hasMessage"  -->
      <el-badge :value="messageNum" :max="99" class="item">
        <el-button
          class="share-button"
          icon="el-icon-share"
          type="primary"
          size="small"
          @click="drawer = true"
          >通知</el-button
        >
        <ws
          ref="ws"
          :path="wsPath"
          :compoment-name="compomentName"
          @on-message="onMessage"
        ></ws>
      </el-badge>

      <el-dropdown @command="handleCommand" style="overflow: hidden">
        <el-avatar
          style="vertical-align: middle"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          @error="errorHandler"
        >
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人信息</el-dropdown-item>
          <el-dropdown-item>通知</el-dropdown-item>
          <el-dropdown-item command="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-aside>

    <el-drawer
      title="消息列表"
      :visible.sync="drawer"
      :with-header="false"
      height="250"
      max-height="250"
    >
      <el-table
        :data="messageData"
        :row-class-name="tableRowClassName"
        @row-dblclick="rowDblclickHandler"
      >
        <el-table-column label="日期" width="255">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.addTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msgLevel" label="等级" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.msgLevel === '1'
                  ? 'danger'
                  : scope.row.msgLevel === '2'
                  ? 'success'
                  : 'info'
              "
              disable-transitions
              >{{ scope.row.msgLevel | formatterMsgLevel }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="发送人" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.addUser }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.addUser }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="title" label="标题"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteMessageRow(scope.$index, messageData)"
              type="text"
              size="small"
            >
              清除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <el-dialog
      :title="messageDetail.title"
      :visible.sync="messageDetailDialogVisible"
      width="30%"
      center
    >
      <span>{{ messageDetail.content }}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDetailDialogCloseHandler('close')"
          >关 闭</el-button
        >
        <el-button
          type="primary"
          @click="messageDetailDialogCloseHandler('readed')"
          >已 读</el-button
        >
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { messageList, readedMessage } from "../common/api/api";
import ws from "@/components/ws.vue";
var $this = {};
export default {
  components: {
    ws,
  },
  data() {
    return {
      activeIndex: "1",
      hasMessage: true,
      drawer: false,
      messageNum: 0,
      messageData: [],
      wsPath: "/ws/message",
      compomentName: "message",
      messageDetailDialogVisible: false,
      messageDetail: {
        title: "",
        content: "",
      },
    };
  },
  beforeCreate() {
    $this = this;
  },
  computed: {
    // messageNum() {
    //   return this.messageData.length;
    // },
  },
  mounted() {
    this.messageList();
  },
  created() {
    this.$nextTick(() => {
      this.$refs.ws.websocketsend("首页初始化");
    });
  },
  watch: {
    // messageData: function (newVlaue, oldVlaue) {
    //   this.messageNum=newVlaue.length;
    //   debugger
    // }
  },
  methods: {
    onMessage(data) {
      let messageData = JSON.parse(data);
      if (messageData != undefined) {
        // this.$set(this.messageData, messageData);
        this.messageData = messageData;
        this.messageNum = messageData.length;
      } else {
        this.messageData = [];
        this.messageNum = 0;
      }
    },
    async messageList() {
      const res = await messageList();
      if (res.status == "200" && res.data.code == "1000") {
        this.messageData = res.data.data;
        return;
      }
    },
    rowDblclickHandler(row, column, event) {
      this.messageDetailDialogVisible = true;
      this.messageDetail.id = row.id;
      this.messageDetail.title = row.title;
      this.messageDetail.content = row.content;
    },
    messageDetailDialogCloseHandler(action) {
      if (action === "readed") {
        readedMessage({ id: this.messageDetail.id });
      }
      this.messageDetail.id = "";
      this.messageDetail.title = "";
      this.messageDetail.content = "";
      this.messageDetailDialogVisible = false;
    },
    deleteMessageRow(index, rows) {
      readedMessage({ id: rows[index].id });
      },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    errorHandler() {
      return true;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCommand(command) {
      if (command === "logout") {
        console.info("登出");
        window.localStorage["token"] = "";
        window.localStorage["userinfo"] = "";
        //可能需要调接口清除token有效性或者用户在线状态来统计在线状态
        $this.$router.push(`/login`).catch((error) => error);
      }
      // this.$message("click on item " + command);
    },
  },
};
</script>

<style scoped>
.el-aside {
  display: flex;
  justify-content: center;
  align-items: center;
}

section {
  height: 100%;
  display: flex;
  /*background-color: #4a5064;*/
  justify-content: space-between;
  align-items: center;
  padding: 0 0px;
}
.logo {
  /*width: 200px;*/
  cursor: pointer;
  height: 60px;
  margin-left: 0;
}

.item {
  margin-top: 4px;
  margin-right: 40px;
}
.tap {
  height: 100%;
}
</style>
