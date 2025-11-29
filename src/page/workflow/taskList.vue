<template>
    <div class="task-management">
        <query-list
            ref="queryListRef"
            :columns="columns"
            :operations="operations"
            :api="'todoTaskPageList'"
            :show-search="true"
            :show-pagination="true"
            :show-index="true"
            :search-placeholder="'请输入任务名称 / 编码'"
            @operation-click="handleOperation"
            @link-click="handleLinkClick"
            @load-success="handleLoadSuccess"
        >
            <!-- 自定义面包屑 -->
            <template #breadcrumb>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/system' }">任务列表</el-breadcrumb-item>
                    <el-breadcrumb-item>待办任务</el-breadcrumb-item>
                </el-breadcrumb>
            </template>

            <!-- 自定义按钮组 -->
            <template #buttonList>
                <el-button type="primary" :size="btnSize" @click="handleCreate">
                    新建任务
                </el-button>
                <el-button type="success" :size="btnSize" @click="handleExport">
                    导出数据
                </el-button>
            </template>

            <!-- 自定义状态列模板 -->
            <template #statusTemplate="{ row }">
                <div class="status-cell">
                    <el-tag :type="getStatusType(row.status)" size="medium">
                        {{ getStatusText(row.status) }}
                    </el-tag>
                    <span v-if="row.status === '进行中'" class="progress-text">
                        (进度: {{ row.progress }}%)
                    </span>
                </div>
            </template>

            <!-- 自定义操作列模板 -->
            <template #actionTemplate="{ row, index }">
                <div class="action-buttons">
                    <el-button size="mini" type="primary" @click="handleViewDetail(row)">
                        查看详情
                    </el-button>
                    <el-button
                        size="mini"
                        type="warning"
                        :disabled="row.status === '已完成'"
                        @click="handleEdit(row)"
                    >
                        编辑
                    </el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(row, index)">
                        删除
                    </el-button>
                </div>
            </template>

            <!-- 自定义用户信息模板 -->
            <template #userInfoTemplate="{ row }">
                <div class="user-info">
                    <el-avatar v-if="row.avatar" :size="30" :src="row.avatar" />
                    <div class="user-details">
                        <div class="user-name">{{ row.assignee }}</div>
                        <div class="user-department">{{ row.department }}</div>
                    </div>
                </div>
            </template>
        </query-list>
    </div>
</template>

<script>
import QueryList from '@/components/ui/query-list.vue';

export default {
    name: 'TaskManagement',
    components: {
        QueryList,
    },
    data() {
        return {
            columns: [
                {
                    prop: 'taskDefinitionKey',
                    label: '流程定义',
                    sortable: true,
                    minWidth: 120,
                },
                {
                    prop: 'assignee',
                    label: '处理人',
                    template: 'userInfoTemplate', // 使用自定义模板
                },
                {
                    prop: 'originalAssignee',
                    label: '发起人',
                    minWidth: 100,
                },
                // {
                //     prop: 'state',
                //     label: '流程状态',
                //     tag: true,
                //     tagTypeMap: {
                //         进行中: 'primary',
                //         已完成: 'success',
                //         已暂停: 'warning',
                //         已取消: 'danger',
                //     },
                // },
                {
                    prop: 'state',
                    label: '流程状态',
                    tag: true,
                    dictName: 'WORKFLOW_STATUS', // 使用字典显示
                },
                {
                    prop: 'status',
                    label: '任务状态',
                    template: 'statusTemplate', // 使用自定义模板
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    formatter: (row) => this.formatTime(row.createTime),
                    minWidth: 150,
                },
                {
                    prop: 'priority',
                    label: '优先级',
                    render: (row) => {
                        const priorityMap = {
                            high: '<span style="color: #F56C6C">🔥 高</span>',
                            medium: '<span style="color: #E6A23C">⚡ 中</span>',
                            low: '<span style="color: #67C23A">💧 低</span>',
                        };
                        return priorityMap[row.priority] || row.priority;
                    },
                },
                {
                    label: '自定义操作',
                    template: 'actionTemplate', // 完全自定义的操作列
                    fixed: 'right',
                },
            ],
            operations: [], // 为空，因为使用了自定义操作模板
        };
    },
    computed: {
        // btnSize() {
        //     return this.$store.state.app.btnSize;
        // },
    },
    methods: {
        handleOperation(operation, row, index) {
            // 处理操作按钮点击
        },

        handleLinkClick(column, row) {
            console.log('链接点击:', column, row);
        },

        handleViewDetail(row) {
            console.log('查看详情:', row);
        },

        handleEdit(row) {
            console.log('编辑:', row);
        },

        handleDelete(row, index) {
            this.$confirm('确认删除该任务?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                console.log('删除:', row);
                this.$refs.queryListRef.refresh();
            });
        },

        handleCreate() {
            this.$router.push('/workflow/definitionForm');
        },

        handleExport() {
            console.log('导出数据');
        },

        handleLoadSuccess({ data, total }) {
            console.log('数据加载成功:', data.length, total);
        },

        getStatusType(status) {
            const map = {
                进行中: 'primary',
                已完成: 'success',
                已暂停: 'warning',
                已取消: 'danger',
            };
            return map[status] || 'info';
        },

        getStatusText(status) {
            return status;
        },

        formatTime(time) {
            return time;
        },
    },
};
</script>

<style scoped>
.status-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.progress-text {
    font-size: 12px;
    color: #666;
}

.action-buttons {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 500;
    font-size: 14px;
}

.user-department {
    font-size: 12px;
    color: #999;
}
</style>
