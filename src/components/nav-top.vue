<template>
  <el-container>
    <el-aside width="auto" class="header-logo tap">
      <img class="logo" src="@/assets/icons/logo.png" alt="Logo" />
    </el-aside>
    <el-aside width="auto" class="header-logo tap">
      <!-- :value="messageNum" -->
           <el-badge :is-dot="hasMessage"  :max="99" class="item">
              <el-button class="share-button" icon="el-icon-share" type="primary">通知</el-button>
           </el-badge>

      <el-dropdown @command="handleCommand" style="overflow: hidden">
          <el-avatar style="vertical-align: middle;"
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
  </el-container>
</template>

<script>
// import { logout } from "../common/api/api";
var $this = {};
export default {
  data() {
    return {
      activeIndex: "1",
      hasMessage:true,
      messageNum:0,
    };
  },
  beforeCreate() {
    $this = this;
  },
  methods: {
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
</style>
