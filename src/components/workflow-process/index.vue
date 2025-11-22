<!-- components/workflow-process/index.vue -->
<template>
    <div class="workflow-process">
        <!-- 表单插槽 -->
        <div class="form-container">
            <slot :formData="formData" :loading="loading" :submitting="submitting"></slot>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
            <el-button
                type="primary"
                :loading="submitting"
                @click="handleSubmit('submit')"
                v-if="showButtons.submit"
            >
                提交
            </el-button>

            <el-button
                type="warning"
                :loading="submitting"
                @click="handleSubmit('revoke')"
                v-if="showButtons.revoke"
            >
                撤销
            </el-button>

            <el-button
                type="danger"
                :loading="submitting"
                @click="handleSubmit('reject')"
                v-if="showButtons.reject"
            >
                驳回
            </el-button>

            <el-button
                type="success"
                :loading="submitting"
                @click="handleSubmit('approve')"
                v-if="showButtons.approve"
            >
                同意
            </el-button>

            <el-button @click="handleBack" v-if="showButtons.back">
                返回
            </el-button>
        </div>

        <!-- 驳回理由弹窗 -->
        <el-dialog :visible.sync="rejectDialogVisible" title="驳回理由" width="500px">
            <el-input
                v-model="rejectReason"
                type="textarea"
                :rows="4"
                placeholder="请输入驳回理由"
            />
            <template slot="footer">
                <el-button @click="rejectDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmReject">确认驳回</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'WorkflowProcess',
    props: {
        // 流程实例ID
        processInstanceId: {
            type: String,
            default: '',
        },
        // 业务ID
        businessId: {
            type: String,
            default: '',
        },
        // 返回路径
        backPath: {
            type: String,
            default: '/workflow/workflowDashboard',
        },
        // 是否显示按钮
        showButtons: {
            type: Object,
            default: () => ({
                submit: true,
                revoke: true,
                reject: true,
                approve: true,
                back: true,
            }),
        },
        // 自定义API方法
        apiMethods: {
            type: Object,
            default: () => ({}),
        },
        // 初始表单数据
        initialFormData: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            formData: { ...this.initialFormData },
            loading: false,
            submitting: false,
            rejectDialogVisible: false,
            rejectReason: '',
            pendingAction: '',
        };
    },
    mounted() {
        this.loadFormData();
    },
    methods: {
        // 加载表单数据
        async loadFormData() {
            try {
                this.loading = true;

                // 如果没有提供API方法，则不调用
                if (!this.apiMethods.load) {
                    console.warn('未提供 load API 方法');
                    return;
                }

                const response = await this.apiMethods.load({
                    processInstanceId: this.processInstanceId,
                    businessId: this.businessId,
                });

                // 更新表单数据
                this.formData = { ...response.data };

                this.$emit('load-success', this.formData);
            } catch (error) {
                console.error('加载表单数据失败:', error);
                this.$message.error('加载表单数据失败');
                this.$emit('error', error);
            } finally {
                this.loading = false;
            }
        },

        // 提交操作
        async commitAction(actionType, extraData = {}) {
            try {
                this.submitting = true;

                const commitData = {
                    processInstanceId: this.processInstanceId,
                    businessId: this.businessId,
                    action: actionType,
                    formData: { ...this.formData },
                    ...extraData,
                };

                const response = await this.apiMethods.commit(commitData);

                this.$message.success(this.getSuccessMessage(actionType));
                this.$emit('commit-success', {
                    action: actionType,
                    data: response.data,
                });

                // 提交成功后处理
                this.handleAfterCommit(actionType);
            } catch (error) {
                console.error('操作失败:', error);
                this.$message.error(this.getErrorMessage(actionType));
                this.$emit('error', error);
            } finally {
                this.submitting = false;
            }
        },

        // 处理提交操作
        handleSubmit(actionType) {
            switch (actionType) {
                case 'reject':
                    // 驳回需要输入理由
                    this.pendingAction = actionType;
                    this.rejectDialogVisible = true;
                    break;
                case 'revoke':
                    // 撤销操作需要确认
                    this.$confirm('确定要撤销此流程吗？', '确认撤销', {
                        type: 'warning',
                    }).then(() => {
                        this.commitAction(actionType);
                    });
                    break;
                default:
                    this.commitAction(actionType);
            }
        },

        // 确认驳回
        confirmReject() {
            if (!this.rejectReason.trim()) {
                this.$message.warning('请输入驳回理由');
                return;
            }

            this.commitAction(this.pendingAction, {
                rejectReason: this.rejectReason,
            });
            this.rejectDialogVisible = false;
            this.rejectReason = '';
            this.pendingAction = '';
        },

        // 返回操作
        handleBack() {
            this.$emit('back');
        },

        // 提交后的处理
        handleAfterCommit(actionType) {
            // 根据业务需求处理提交后的逻辑
            switch (actionType) {
                case 'submit':
                case 'approve':
                    // 可以跳转到列表页或其他页面
                    setTimeout(() => {
                        this.$router.push(this.backPath);
                    }, 1500);
                    break;
                case 'reject':
                case 'revoke':
                    // 可以刷新数据
                    this.loadFormData();
                    break;
            }
        },

        // 获取成功消息
        getSuccessMessage(actionType) {
            const messages = {
                submit: '提交成功',
                revoke: '撤销成功',
                reject: '驳回成功',
                approve: '同意成功',
            };
            return messages[actionType] || '操作成功';
        },

        // 获取错误消息
        getErrorMessage(actionType) {
            const messages = {
                submit: '提交失败',
                revoke: '撤销失败',
                reject: '驳回失败',
                approve: '同意失败',
            };
            return messages[actionType] || '操作失败';
        },
    },
};
</script>

<style scoped>
.workflow-process {
    padding: 20px;
}

.form-container {
    margin-bottom: 20px;
}

.action-buttons {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #eee;
}

.action-buttons .el-button {
    margin: 0 8px;
    min-width: 80px;
}
</style>
