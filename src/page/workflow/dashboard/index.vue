<!-- views/Dashboard.vue -->
<template>
    <div class="dashboard">
        <!-- 顶部统计卡片 -->
        <div class="stat-cards">
            <el-row :gutter="20">
                <el-col :xs="12" :sm="6" :lg="3">
                    <stat-card
                        title="待办任务"
                        :value="stats.pendingTasks"
                        icon="el-icon-time"
                        color="#409EFF"
                        @click="handleCardClick('pending')"
                    />
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3">
                    <stat-card
                        title="参与任务"
                        :value="stats.involvedTasks"
                        icon="el-icon-user"
                        color="#67C23A"
                        @click="handleCardClick('involved')"
                    />
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3">
                    <stat-card
                        title="已完成任务"
                        :value="stats.completedTasks"
                        icon="el-icon-success"
                        color="#E6A23C"
                        @click="handleCardClick('completed')"
                    />
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3">
                    <stat-card
                        title="今日完成"
                        :value="stats.todayCompleted"
                        icon="el-icon-date"
                        color="#F56C6C"
                        @click="handleCardClick('today')"
                    />
                </el-col>
            </el-row>
        </div>

        <!-- 主要内容区域 -->
        <div class="main-content">
            <el-row :gutter="20">
                <!-- 左侧：趋势图表 -->
                <el-col :xs="24" :lg="16">
                    <div class="chart-container">
                        <el-card class="chart-card">
                            <template #header>
                                <div class="chart-header">
                                    <span>完成任务趋势</span>
                                    <div class="time-filter">
                                        <el-radio-group
                                            v-model="timeRange"
                                            @change="handleTimeRangeChange"
                                        >
                                            <el-radio-button label="month">月</el-radio-button>
                                            <el-radio-button label="quarter">季</el-radio-button>
                                            <el-radio-button label="year">年</el-radio-button>
                                        </el-radio-group>
                                    </div>
                                </div>
                            </template>
                            <div class="chart-wrapper">
                                <trend-chart
                                    :data="trendData"
                                    :loading="chartLoading"
                                    :time-range="timeRange"
                                />
                            </div>
                        </el-card>
                    </div>
                </el-col>

                <!-- 右侧：任务列表 -->
                <el-col :xs="24" :lg="8">
                    <div class="task-lists">
                        <!-- 待办任务 -->
                        <el-card class="task-card">
                            <template #header>
                                <div class="task-header" @click="handleCardClick('pending')">
                                    <span class="title">待办任务</span>
                                    <el-badge :value="stats.pendingTasks" class="badge" />
                                </div>
                            </template>
                            <task-list
                                :tasks="pendingTasks"
                                type="pending"
                                @task-click="handleTaskClick"
                            />
                        </el-card>

                        <!-- 最近完成 -->
                        <el-card class="task-card">
                            <template #header>
                                <div class="task-header" @click="handleCardClick('recent')">
                                    <span class="title">最近完成</span>
                                </div>
                            </template>
                            <task-list
                                :tasks="recentTasks"
                                type="completed"
                                @task-click="handleTaskClick"
                            />
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import StatCard from './components/StatCard.vue';
import TrendChart from './components/TrendChart.vue';
import TaskList from './components/TaskList.vue';

export default {
    name: 'Dashboard',
    components: {
        StatCard,
        TrendChart,
        TaskList,
    },
    data() {
        return {
            timeRange: 'month',
            chartLoading: false,
            stats: {
                pendingTasks: 0,
                involvedTasks: 0,
                completedTasks: 0,
                todayCompleted: 0,
            },
            trendData: [],
            pendingTasks: [],
            recentTasks: [],
        };
    },
    mounted() {
        this.loadDashboardData();
    },
    methods: {
        // 加载工作台数据
        async loadDashboardData() {
            try {
                this.chartLoading = true;

                // 并行加载所有数据
                await Promise.all([this.loadStats(), this.loadTrendData(), this.loadTaskLists()]);
            } catch (error) {
                console.error('加载工作台数据失败:', error);
                this.$message.error('加载数据失败');
            } finally {
                this.chartLoading = false;
            }
        },

        // 加载统计数据
        async loadStats() {
            // 模拟API调用
            const response = await this.$api.dashboard.getStats();
            this.stats = response.data;
        },

        // 加载趋势数据
        async loadTrendData() {
            const params = {
                range: this.timeRange,
                startDate: this.getStartDate(),
                endDate: this.getEndDate(),
            };
            const response = await this.$api.dashboard.getTrendData(params);
            this.trendData = response.data;
        },

        // 加载任务列表
        async loadTaskLists() {
            const [pendingResponse, recentResponse] = await Promise.all([
                this.$api.dashboard.getPendingTasks({ limit: 5 }),
                this.$api.dashboard.getRecentTasks({ limit: 5 }),
            ]);

            this.pendingTasks = pendingResponse.data;
            this.recentTasks = recentResponse.data;
        },

        // 时间范围改变
        handleTimeRangeChange() {
            this.loadTrendData();
        },

        // 卡片点击事件
        handleCardClick(type) {
            const routes = {
                pending: '/task/pending',
                involved: '/task/involved',
                completed: '/task/completed',
                today: '/task/today',
                recent: '/task/recent',
            };

            if (routes[type]) {
                this.$router.push(routes[type]);
            }
        },

        // 任务点击事件
        handleTaskClick(task) {
            this.$router.push({
                path: '/task/detail',
                query: { id: task.id },
            });
        },

        // 获取开始日期
        getStartDate() {
            const now = new Date();
            switch (this.timeRange) {
                case 'month':
                    return new Date(now.getFullYear(), now.getMonth(), 1);
                case 'quarter':
                    const quarter = Math.floor(now.getMonth() / 3);
                    return new Date(now.getFullYear(), quarter * 3, 1);
                case 'year':
                    return new Date(now.getFullYear(), 0, 1);
                default:
                    return new Date(now.getFullYear(), now.getMonth(), 1);
            }
        },

        // 获取结束日期
        getEndDate() {
            return new Date();
        },
    },
};
</script>

<style scoped>
.dashboard {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

.stat-cards {
    margin-bottom: 20px;
}

.main-content {
    margin-top: 20px;
}

.chart-container {
    margin-bottom: 20px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chart-wrapper {
    height: 400px;
}

.task-lists {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.task-card {
    cursor: pointer;
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.task-header .title {
    font-weight: bold;
    font-size: 16px;
}

.task-header:hover .title {
    color: #409eff;
}

.badge {
    margin-left: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .dashboard {
        padding: 10px;
    }

    .chart-wrapper {
        height: 300px;
    }
}
</style>
