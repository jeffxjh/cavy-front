<template>
    <div class="chooseIcons">
        <el-popover placement="top-start" :append-to-body="false" width="30vw" trigger="click">
            <div slot="reference" class="iconDiv">
                <div class="iconName">
                    <i :class="userChooseIcon"> {{ userChooseIcon }}</i>
                </div>
            </div>
            <!--图标选择页面-->
            <div class="iconList">
                <i
                   v-for="item in iconList"
                   :key="item"
                   :class="[item, 'icon']"
                   @click="setIcon(item)"
                   style="font-size: 20px"></i>
            </div>
        </el-popover>
    </div>
</template>
<script>
import { elementIcons } from '@/common/api/icon'

export default {
    name: 'iconSelect',
    props: {
        form: {
            typeof: Object,
            default: {},
            required: true
        }
    },
    data() {
        return {
            userChooseIcon: "请选择图标",
            iconList: elementIcons
        }
    },
    watch: {
        iconList(val) {
        },
        "form.icon"(n, o) {
            this.userChooseIcon = n
        }
    },
    beforeDestroy() {
        this.userChooseIcon = ""
    },
    mounted() {
        if (this.form != undefined) {
            this.userChooseIcon = this.form.icon
        }
    },
    methods: {
        //给icon绑定的点击事件
        setIcon(icon) {
            this.$emit('update:icon', icon)
            this.userChooseIcon = icon;//将i的样式设为选中的样式el-icon-xxx
        },
        clear() {
            this.userChooseIcon = "请选择图标"
        }

    }
}
</script>
 
<style scoped>
.chooseIcons {
    width: 100%;
}

.iconList {
    width: 30vw;
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}

.icon {
    display: inline-block;
    width: 60px;
    height: 45px;
    color: #000000;
    font-size: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    margin: 5px;

}

.icon:hover {
    color: red;
    border-color: red;
}

.iconDiv {
    width: 100%;
    height: 50%;

    display: flex;
    flex-direction: row;
    align-items: center;
}

.iconName {
    width: 50%;
    height: 45px !important;
    text-align: center;
    border: 1px solid #eee;
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    font: #DCDFE6;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
}
</style>
 