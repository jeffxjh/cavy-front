<template>
  <div>
    <el-form-item>
      <el-button v-if="showAdd" type="primary" @click="onSubmit(1)"
        >创建</el-button
      >
      <el-button v-if="showAddAndBack" type="info" @click="onSubmit(0)"
        >创建并返回</el-button
      >
      <el-button v-if="showCancel" @click="cancel()">取消</el-button>
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    showAdd: { type: Boolean, default: true },
    showAddAndBack: { type: Boolean, default: true },
    showCancel: { type: Boolean, default: true },
    submitCall: {
      type: Function,
      default: null,
    },
    cancelCall: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      showAdd: showAdd,
      showAddAndBack: showAddAndBack,
      showCancel: showCancel,
    };
  },
  methods: {
    onSubmit(type) {
      if (this.submitCall == null) {
        console.error("未传递父组件提交函数");
        return;
      }
      this.submitCall(type);
    },
    cancel(type) {
      if (this.cancelCall == null) {
        console.error("未传递父组件提交函数");
        return;
      }
      this.cancelCall(type);
    },
  },
};
</script>

<style scoped>
</style>