<!-- views/dashboard/components/TaskList.vue -->
<template>
    <div class="task-list">
        <div v-if="tasks.length === 0" class="empty-tips">
            暂无任务
        </div>
        <div
            v-else
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
            @click="handleTaskClick(task)"
        >
            <div class="task-main">
                <div class="task-title">{{ task.title }}</div>
                <div class="task-meta">
                    <span class="task-type">{{ task.type }}</span>
                    <span class="task-time">{{ task.createTime }}</span>
                </div>
            </div>
            <div class="task-status" :class="getStatusClass(task.status)">
                {{ getStatusText(task.status) }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TaskList',
    props: {
        tasks: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: 'pending',
        },
    },
    methods: {
        // 任务点击事件
        handleTaskClick(task) {
            this.$emit('task-click', task);
        },

        // 获取状态样式类
        getStatusClass(status) {
            const classMap = {
                pending: 'status-pending',
                processing: 'status-processing',
                completed: 'status-completed',
                rejected: 'status-rejected',
            };
            return classMap[status] || 'status-default';
        },

        // 获取状态文本
        getStatusText(status) {
            const textMap = {
                pending: '待处理',
                processing: '进行中',
                completed: '已完成',
                rejected: '已驳回',
            };
            return textMap[status] || '未知状态';
        },
    },
};
</script>

<style scoped>
.task-list {
    max-height: 400px;
    overflow-y: auto;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    transition: background-color 0.3s;
}

.task-item:hover {
    background-color: #f5f7fa;
}

.task-item:last-child {
    border-bottom: none;
}

.task-main {
    flex: 1;
}

.task-title {
    font-size: 14px;
    color: #303133;
    margin-bottom: 4px;
    line-height: 1.4;
}

.task-meta {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #909399;
}

.task-type {
    margin-right: 10px;
    padding: 2px 6px;
    background: #f4f4f5;
    border-radius: 3px;
}

.task-status {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
}

.status-pending {
    background: #fdf6ec;
    color: #e6a23c;
}

.status-processing {
    background: #f0f9ff;
    color: #409eff;
}

.status-completed {
    background: #f0f9eb;
    color: #67c23a;
}

.status-rejected {
    background: #fef0f0;
    color: #f56c6c;
}

.empty-tips {
    text-align: center;
    color: #909399;
    padding: 20px;
    font-size: 14px;
}
</style>
