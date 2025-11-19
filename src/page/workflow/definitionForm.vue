<template>
    <div class="model">
        <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/system' }">
                系统管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>字典管理</el-breadcrumb-item>
        </el-breadcrumb>
        <bpmn />
    </div>
</template>

<script>
import bpmn from '../../components/bpmn/bpmn.vue';

export default {
    name: 'model',
    components: {
        bpmn,
    },
    data() {
        return {
            params: {
                name: '',
            },
            btnSize: 'small',
        };
    },
    methods: {
        getList() {
            console.log('搜索', this.params);
        },
        handleCreate() {
            console.log('添加');
        },
    },
};
</script>
<style scoped></style>
