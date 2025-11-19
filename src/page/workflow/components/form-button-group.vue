<template>
    <div class="component-container">
        <el-button-group style="margin-left: 10px;">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button type="info" @click="submitBack">提交并返回</el-button>
            <el-button @click="back">返回</el-button>
        </el-button-group>
    </div>
</template>

<script>
export default {
    name: 'forem-button-group',
    props: {
        submitMethod: {
            type: Function,
            default: () => {},
        },
        submitBackMethod: {
            type: Function,
            default: () => {},
        },
        backMethod: {
            type: Function,
            default: () => {},
        },
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        // 方法
        submit() {
            this.submitMethod();
            // this.$emit('button-click', this.count);
        },
        submitBack() {
            this.submitBackMethod();
            // this.$emit('button-click', this.count);
        },
        back() {
            this.backMethod();
            // this.$emit('button-click', this.count);
        },
    },
    mounted() {
        // 生命周期钩子
    },
};
</script>

<style scoped>
/* .component-container {
    padding: 20px;
    border: 1px solid #ddd;
} */
</style>
