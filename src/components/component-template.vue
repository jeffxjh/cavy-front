<template>
    <div class="component-container">
        <!-- 组件内容 -->
        <h1>{{ title }}</h1>
        <button @click="handleClick">点击我</button>
    </div>
</template>

<script>
export default {
    name: 'MyComponent',
    props: {
        // 定义 props
        initialTitle: {
            type: String,
            default: '默认标题',
        },
    },
    data() {
        return {
            title: this.initialTitle,
            count: 0,
        };
    },
    computed: {
        // 计算属性
        reversedTitle() {
            return this.title
                .split('')
                .reverse()
                .join('');
        },
    },
    methods: {
        // 方法
        handleClick() {
            this.count++;
            this.$emit('button-click', this.count);
        },
    },
    mounted() {
        // 生命周期钩子
        console.log('组件已挂载');
    },
};
</script>

<style scoped>
.component-container {
    padding: 20px;
    border: 1px solid #ddd;
}

h1 {
    color: #2c3e50;
}
</style>
