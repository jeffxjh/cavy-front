<template>
  <el-aside width="200px">
    <el-row class="tac">
      <el-col>
        <!--
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="1" @click="goPage('home')">
            <i class="el-icon-menu"></i>
            <span slot="title">后台中心</span>
          </el-menu-item>

          <el-menu-item index="2" @click="goPage('order')">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单列表</span>
          </el-menu-item>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>测试3</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">测试3-1</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu> -->

        <!-- 这里的 routerList  为 从 router.js动态获取到了路由信息 -->

        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <template v-for="(item, key) in menuList">
            <el-submenu
              :key="key"
              v-if="item.children && item.children.length !== 0"
              :index="item.id+''"
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.menuName }}</span>
              </template>
              <el-menu-item
                v-for="(val, index) in item.children"
                :index="val.id"
                :key="index"
              >
                <template slot="title">
                  <i :class="val.icon"></i>
                  <span>{{ val.menuName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-submenu v-else :key="item.parentID" :index="item.id+''">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.menuName }}</span>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
import { MenuService } from "../common/api/api";
var $this = {};
export default {
  name: "sideMeuns",
  data() {
    return {
      menuList: [
        { id: 1, parentId: 3, weight: 0, menuName: "后台中心", code: "main" },
        { id: 2, parentId: 2, weight: 0, menuName: "后台中心", code: "main" },
        { id: 3, parentId: 1, weight: 0, menuName: "后台中心", code: "main" }
      ]
    };
  },
  beforeCreate() {
    $this = this;
  },
  mounted() {
    this.getMenu();
  },
  methods: {
   async getMenu() {
      let res =await MenuService.tree();
      console.info(res, 123);
      // this.menuList = res.data;
      // this.$axios
      //   .get("/menu/list", {})
      //   .then(res => {
      //     console.log(res);

      //     console.log("ok");
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });

    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //跳转到某个导航页
    goPage(link) {
      if (link === "home") {
        $this.$router.push("/").catch(error => error);
      } else if ((link = "order")) {
        $this.$router.push("/order").catch(error => error);
      }
    }
  }
};
</script>

<style scoped>
.el-row {
  height: 100%;
}
.el-menu {
  border-right: none;
}
.el-aside {
  border-right: 1px solid #f5f1f1;
}
</style>
