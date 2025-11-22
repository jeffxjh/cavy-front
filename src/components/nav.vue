<template>
    <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-row class="tac">
            <el-col>
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
                    <!-- 遍历一级菜单 -->
                    <template v-for="item in menuList">
                        <!-- 三级菜单：有子菜单且子菜单还有子菜单 -->
                        <el-submenu
                            v-if="
                                item.children && item.children.length > 0 && hasGrandChildren(item)
                            "
                            :key="item.id"
                            :index="item.url || item.id"
                        >
                            <template slot="title">
                                <i v-if="item.icon" :class="item.icon"></i>
                                <span>{{ item.menuName }}</span>
                            </template>

                            <!-- 遍历二级菜单 -->
                            <template v-for="child in item.children">
                                <!-- 二级菜单还有子菜单（三级菜单） -->
                                <el-submenu
                                    v-if="child.children && child.children.length > 0"
                                    :key="child.id"
                                    :index="child.url || child.id"
                                >
                                    <template slot="title">
                                        <i v-if="child.icon" :class="child.icon"></i>
                                        <span>{{ child.menuName }}</span>
                                    </template>

                                    <!-- 遍历三级菜单 -->
                                    <el-menu-item
                                        v-for="grandChild in child.children"
                                        :key="grandChild.id"
                                        :index="grandChild.url"
                                        @click="goPage(grandChild)"
                                    >
                                        <i v-if="grandChild.icon" :class="grandChild.icon"></i>
                                        <span>{{ grandChild.menuName }}</span>
                                    </el-menu-item>
                                </el-submenu>

                                <!-- 二级菜单没有子菜单 -->
                                <el-menu-item
                                    v-else
                                    :key="`child-${child.id}`"
                                    :index="child.url"
                                    @click="goPage(child)"
                                >
                                    <i v-if="child.icon" :class="child.icon"></i>
                                    <span>{{ child.menuName }}</span>
                                </el-menu-item>
                            </template>
                        </el-submenu>

                        <!-- 二级菜单：有子菜单但没有孙子菜单 -->
                        <el-submenu
                            v-else-if="item.children && item.children.length > 0"
                            :key="`item-${item.id}`"
                            :index="item.url || item.id"
                        >
                            <template slot="title">
                                <i v-if="item.icon" :class="item.icon"></i>
                                <span>{{ item.menuName }}</span>
                            </template>

                            <el-menu-item
                                v-for="child in item.children"
                                :key="child.id"
                                :index="child.url"
                                @click="goPage(child)"
                            >
                                <i v-if="child.icon" :class="child.icon"></i>
                                <span>{{ child.menuName }}</span>
                            </el-menu-item>
                        </el-submenu>

                        <!-- 一级菜单：没有子菜单 -->
                        <el-menu-item v-else :key="`main-${item.id}`" :index="item.url" @click="goPage(item)">
                            <i v-if="item.icon" :class="item.icon"></i>
                            <span slot="title">{{ item.menuName }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-col>
        </el-row>
    </el-aside>
</template>

<script>
import { treeMenu } from '../common/api/api';

export default {
    name: 'sideMeuns',
    data() {
        return {
            menuList: [],
            actionIndex: 'main',
            isCollapse: false,
        };
    },
    created() {
        let activePath = window.sessionStorage.getItem('activePath');
        if (activePath != null) {
            this.actionIndex = activePath;
        }
    },
    mounted() {
        this.getMenu();
    },
    methods: {
        async getMenu() {
            try {
                let result = await treeMenu();
                this.menuList = result.data.data;
            } catch (error) {
                console.error('获取菜单失败:', error);
            }
        },

        // 检查是否有孙子菜单（三级菜单）
        hasGrandChildren(menuItem) {
            return menuItem.children.some((child) => child.children && child.children.length > 0);
        },

        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },

        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },

        //跳转到某个导航页
        goPage(item) {
            if (!item.url) return;

            let link = item.url;
            if (link == undefined || link == null || link == '') {
                this.$router.push(`/`).catch((error) => error);
                return;
            }

            this.$router.push(`/${link}`).catch((error) => error);
            this.saveNavState(item.url);
            this.actionIndex = item.url;
        },

        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath);
        },

        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
    },
};
</script>

<style scoped>
/* 原有样式保持不变 */
::-webkit-scrollbar {
    display: none;
}
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

.el-menu--collapse .el-submenu__title span {
    display: none;
}

.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
    display: none;
}

/* 三级菜单缩进样式 */
.el-submenu .el-menu-item {
    padding-left: 40px !important;
}

.el-submenu .el-submenu .el-menu-item {
    padding-left: 60px !important;
}

</style>
