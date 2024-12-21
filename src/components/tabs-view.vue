<template>
    <div style="margin-bottom: 20px;">
        <el-tabs v-model="currentTabName" type="card" @tab-remove="removeTab" @tab-click="clickTab">
            <el-tab-pane
                         v-for="item in openTab"
                         :key="item.name"
                         :label="item.title"
                         :name="item.name"
                         :closable="item.closable">
            </el-tab-pane>
        </el-tabs>
        <div class="view-container">
            <keep-alive :include="openTab.map(i => i.name)">
                <router-view v-if="isRouterAlive"></router-view>
            </keep-alive>
        </div>
    </div>

</template>
<script>
export default {
    name: "tabsView",
    data() {
        return {
            isRouterAlive: false,
            currentTabName: '',
            openTab: [{
                title: '主页',
                name: '/main',
                closable: false,
            }],
        }
    },
    mounted() {
        let openTab = sessionStorage.getItem('openTab')
        this.openTab = openTab ? JSON.parse(openTab) : this.openTab
        let currentTabName = sessionStorage.getItem('currentTabName')
        // 判断是否存在currentTabName，即tab页之前是否被点击切换到别的页面
        if (currentTabName) {
            this.currentTabName = currentTabName
        }
    },
    methods: {
        removeTab(target) {
            // 删除的是当前选中的页面
            if (this.currentTabName === target) {
                this.openTab.forEach((item, index) => {
                    if (item.name == target) {
                        let nextTab = item[index + 1] || item[index - 1];
                        if (nextTab) {
                            this.currentTabName = nextTab.name;
                        }
                    }
                });

            }
            var i = 0;
            this.openTab.forEach((item, index) => {
                if (item.name == target) {
                    return (i = index);
                }
            });
            this.openTab.splice(i, 1);
            sessionStorage.setItem('openTab', JSON.stringify(this.openTab))
            // 更新路由
            if (this.currentTabName === target) {
                this.$router.push({ path: this.openTab[this.openTab.length - 1].name });
            }
        },
        clickTab(target) {
            sessionStorage.setItem('currentTabName', target.name)
            this.$router.push(`${target.name}`).catch(error => error);
        }
    },
    watch: {
        $route(to, form) {
            //当路由更新进行tab切换
            var flag = false;
            // 当前页面菜单已打开,直接切换过去
            if (this.openTab) {
                for (let i = 0; i < this.openTab.length; i++) {
                    if (
                        to.path == this.openTab[i].name || to.path.includes(this.openTab[i].name)
                    ) {
                        //openTab中已存在？
                        this.currentTabName = this.openTab[i].name;
                        flag = true;
                        break;
                    }
                }
            }

            // 打开新的页面tab
            if (!flag) {
                let obj = {
                    title: to.meta.title,
                    name: to.path,
                    closable: true,
                    content: to.matched[1].components.default.name //路由只缓存到第1层，更深层的视图不考虑
                };
                this.currentTabName = to.path;
                this.openTab.push(obj);
                this.currentTabName = to.path
            }
            sessionStorage.setItem('openTab', JSON.stringify(this.openTab))
            sessionStorage.setItem('currentTabName', this.currentTabName)
        },
    }
}
</script>
<style>
.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #409EFF !important;
    border-bottom-width: 2px !important;
}
</style>
