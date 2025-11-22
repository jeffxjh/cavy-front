<!-- views/dashboard/components/StatCard.vue -->
<template>
    <div class="stat-card" :class="{ clickable: clickable }" @click="handleClick">
        <div class="card-content">
            <div class="card-icon" :style="{ backgroundColor: color }">
                <i :class="icon"></i>
            </div>
            <div class="card-info">
                <div class="card-value">{{ value }}</div>
                <div class="card-title">{{ title }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StatCard',
    props: {
        title: {
            type: String,
            required: true,
        },
        value: {
            type: [String, Number],
            default: 0,
        },
        icon: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: '#409EFF',
        },
        clickable: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        handleClick() {
            if (this.clickable) {
                this.$emit('click');
            }
        },
    },
};
</script>

<style scoped>
.stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.stat-card.clickable:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
    cursor: pointer;
}

.card-content {
    display: flex;
    align-items: center;
}

.card-icon {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
}

.card-icon i {
    font-size: 24px;
    color: white;
}

.card-info {
    flex: 1;
}

.card-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 5px;
}

.card-title {
    font-size: 14px;
    color: #909399;
}
</style>
