<template>
  <el-container>
    <el-aside width="auto" class="header-logo tap">
      <img class="logo" src="@/assets/imgs/logo.png" alt="Logo" />
    </el-aside>
    <el-aside width="auto" class="header-logo tap">
      <!-- <el-badge is-dot class="item">
        <el-button class="share-button" icon="el-icon-share" type="primary"
          >通知</el-button
        >
      </el-badge> -->

      <el-dropdown @command="handleCommand">
        <el-avatar icon="el-icon-user-solid" class="headerLogo"
          ><i class="el-icon-arrow-down el-icon--right"></i
        ></el-avatar>
        <el-dropdown-menu slot="dropdown" >
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
      activeIndex: "1"
    };
  },
    beforeCreate() {
    $this = this;
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCommand(command) {
      if (command === "logout") {
        console.info("登出");
        window.localStorage["token"] = "";
        window.localStorage["userinfo"] = "";
        //可能需要调接口清除token有效性或者用户在线状态来统计在线状态
         $this.$router.push(`/login`).catch(error => error);
      }
      // this.$message("click on item " + command);
    }
  }
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
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.logo {
  width: 200px;
}
.headerLogo,
.logo {
  cursor: pointer;
}

.item {
  margin-top: 4px;
  margin-right: 40px;
}
</style>
