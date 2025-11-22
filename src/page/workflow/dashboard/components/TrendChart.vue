<!-- views/dashboard/components/TrendChart.vue -->
<template>
    <div class="trend-chart">
        <div v-if="loading" class="chart-loading">
            <el-skeleton :rows="5" animated />
        </div>
        <div v-else ref="chart" class="chart" style="height: 100%;"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'TrendChart',
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        timeRange: {
            type: String,
            default: 'month',
        },
    },
    data() {
        return {
            chart: null,
        };
    },
    watch: {
        data: {
            handler() {
                this.renderChart();
            },
            deep: true,
        },
        timeRange() {
            this.renderChart();
        },
    },
    mounted() {
        this.initChart();
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose();
        }
    },
    methods: {
        // 初始化图表
        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.renderChart();

            // 响应窗口大小变化
            window.addEventListener('resize', this.handleResize);
        },

        // 渲染图表
        renderChart() {
            if (!this.chart || this.loading) return;

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                legend: {
                    data: ['完成任务', '创建任务'],
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    data: this.data.map((item) => item.date),
                    axisLabel: {
                        rotate: this.timeRange === 'year' ? 45 : 0,
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '任务数量',
                },
                series: [
                    {
                        name: '完成任务',
                        type: 'line',
                        smooth: true,
                        data: this.data.map((item) => item.completed),
                        itemStyle: {
                            color: '#409EFF',
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                                { offset: 1, color: 'rgba(64, 158, 255, 0.1)' },
                            ]),
                        },
                    },
                    {
                        name: '创建任务',
                        type: 'bar',
                        data: this.data.map((item) => item.created),
                        itemStyle: {
                            color: '#E6A23C',
                        },
                    },
                ],
            };

            this.chart.setOption(option);
        },

        // 处理窗口大小变化
        handleResize() {
            if (this.chart) {
                this.chart.resize();
            }
        },
    },
};
</script>

<style scoped>
.trend-chart {
    height: 100%;
    position: relative;
}

.chart-loading {
    padding: 20px;
}
</style>
