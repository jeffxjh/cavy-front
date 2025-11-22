<template>
    <div>
        <workflow-process
            :process-instance-id="'123456'"
            :business-id="'BUS001'"
            :api-methods="apiMethods"
            @load-success="handleLoadSuccess"
            @commit-success="handleCommitSuccess"
            @error="handleError"
            @back="handleBack"
        >
            <!-- 使用具名插槽或默认插槽 -->
            <template v-slot:default="{ formData, loading }">
                <el-form v-if="!loading" :model="formData" label-width="100px">
                    <el-form-item label="申请人">
                        <el-input v-model="formData.applicant" />
                    </el-form-item>
                    <el-form-item label="申请事由">
                        <el-input v-model="formData.reason" type="textarea" />
                    </el-form-item>
                </el-form>
                <div v-else>加载中...</div>
            </template>
        </workflow-process>
    </div>
</template>

<script>
import WorkflowProcess from '../../../components/workflow-process/index.vue';

export default {
    name: 'demo',
    components: {
        WorkflowProcess,
    },
    data() {
        return {
            apiMethods: {
                load: this.loadData,
                commit: this.commitData,
            },
        };
    },
    methods: {
        // 加载数据方法
        async loadData(params) {
            // 这里调用你的后端接口
            console.log('加载参数:', params);
            return {
                data: {
                    applicant: '张三',
                    reason: '测试申请',
                },
            };
        },

        // 提交数据方法
        async commitData(data) {
            // 这里调用你的后端接口
            console.log('提交数据:', data);
            return {
                data: { success: true },
            };
        },

        handleLoadSuccess(data) {
            console.log('表单数据加载成功:', data);
        },

        handleCommitSuccess(result) {
            console.log('操作成功:', result);
        },

        handleError(error) {
            console.error('发生错误:', error);
        },

        handleBack() {
            this.$router.back();
        },
    },
};
</script>
