<template>
  <div id="div1">
    <el-breadcrumb separator="/" style="margin-bottom: 10px;font-size: 15px;">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/task' }">定时任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增问题</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="form-container" shadow="never">
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item label="任务名:" style="width: 80%">
          <el-input v-model="form.jobName"></el-input>
        </el-form-item>
        <el-form-item label="表达式:" style="width: 80%">
          <el-input v-model="form.cronExpression"></el-input>
        </el-form-item>
        <el-form-item label="任务调用的方法名:" style="width: 80%">
          <el-input v-model="form.methodName"></el-input>
        </el-form-item>
        <el-form-item label="任务是否有状态:" style="width: 80%">
          <el-input v-model="form.isConcurrent"></el-input>
        </el-form-item>
        <el-form-item label="完全限定名:" style="width: 80%">
          <el-input v-model="form.beanName"></el-input>
        </el-form-item>
        <el-form-item label="触发器名称:" style="width: 80%">
          <el-input v-model="form.triggerName"></el-input>
        </el-form-item>
        <el-form-item label="任务状态:" style="width: 80%">
          <el-input v-model="form.jobStatus"></el-input>
        </el-form-item>
        <el-form-item label="bean名称:" style="width: 80%">
          <el-input v-model="form.springBean"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <editor v-model="form.description"></editor>
        </el-form-item>
        <el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)">创建</el-button>
          <el-button type="info" @click="onSubmit(0)">创建并返回</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<script>
import Editor from '@/components/editor'
import {addTask} from "@/common/api/api";

export default {
  components: {
    Editor
  },
  data() {
    return {
      editor: {
        info: ''
      },
      isClear: false,
      form: {
        title: '',
        content: '',

      }
    }
  },
  mounted() {

  },
  methods: {
    // onSubmit() {
    //   console.log(this.form);
    //   addQuestion(that.params)
    //     .then(response => {
    //
    //     })
    //     .catch(function (error) {
    //       that.$message.error("加载失败");
    //     });
    // },
    //添加增加题目
    async onSubmit(type) {
      let form = null;
      form = this.form;
      const params = form;
      const res = await addTask(params);
      if (res.status=='200'&&res.data.code=='1000') {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        if (type===0){
          this.$router.push(`/task`).catch(error => error);
        }
        return;
      }
      this.$message({
        type: "error",
        message: "保存失败",
      });
    },
    cancel() {
      this.$router.push(`/task`).catch(error => error);
    }
  }
}
</script>

<style scoped>
.form-container {
  width: 80%;
}
</style>
