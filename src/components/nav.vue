<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
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
        <div class="toggle-button" @click="toggleCollapse">
          <div v-if="isCollapse">
            <i class="el-icon-s-unfold"></i>
          </div>
          <div v-else>
            <i class="el-icon-s-fold"></i>
          </div>
        </div>

        <el-menu
          :default-active="actionIndex"
          @open="handleOpen"
          @close="handleClose"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <div
            :key="key"
            :index="item.url"
            v-for="(item, key) in menuList"
          >
            <!-- 有二级菜单 -->
            <div v-if="item.children && item.children.length !== 0">
              <el-submenu
                :key="item.id"
                :index="item.url"
                @click="goPage(item)"
              >
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{ item.menuName }}</span>
                </template>
                <el-menu-item
                  :key="subKey"
                  :index="subItem.url"
                  v-for="(subItem, subKey) in item.children"
                >
                  <div @click="goPage(subItem)">
                    <i :class="subItem.icon"></i>
                    <span slot="title">{{ subItem.menuName }}</span>
                  </div>
                </el-menu-item>
              </el-submenu>
            </div>
            <!-- 没有二级菜单 -->
            <div v-else>
              <el-menu-item :index="item.url" @click="goPage(item)">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.menuName }}</span>
              </el-menu-item>
            </div>
          </div>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
import { treeMenu } from "../common/api/api";
var $this = {};
export default {
  name: "sideMeuns",
  data() {
    return {
      menuList: [],
      actionIndex: "main",
      //是否折叠菜单
      isCollapse: false
    };
  },
  beforeCreate() {
    $this = this;
  },
  mounted() {
    this.getMenu();
  },
  created() {
    let activePath=window.sessionStorage.getItem('activePath')
    if (activePath!=null){
      this.actionIndex=activePath
    }
  },
  methods: {
    async getMenu() {
      let result = await treeMenu();
      // console.info(result, 1);
      this.menuList = result.data.data;
      // let aa = treeMenu().then(res => {
      //   console.info(result, 2);
      // });

      // console.info(aa, 3);

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
    goPage(item) {
      let link =item.url
      // console.info("左侧菜单栏跳转地址", link);
      if (link == undefined || link == null || link == "") {
        $this.$router.push(`/`).catch(error => error);
      }
      $this.$router.push(`/${link}`).catch(error => error);
      this.saveNavState(item.url)
      this.actionIndex=item.url
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
    },
    //左侧菜单折叠展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
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
  font-size: 14px;
  font-weight: bold;
}
.el-aside {
  border-right: 1px solid #f5f1f1;
  background-color: #333744;
}
.toggle-button {
  padding-left: 10px;
  background-color: #4a5064;
  font-size: 20px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.5em;
  cursor: pointer;
}

/*隐藏文字*/
.el-menu--collapse .el-submenu__title span {
  display: none;
}
/*隐藏 > */
.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}
</style>
