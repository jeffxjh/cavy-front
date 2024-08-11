<template>
  <div id="div1">
    <el-breadcrumb separator="/" style="margin-bottom: 10px;font-size: 15px;">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/system/dict' }">字典管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增字典</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="form-container" shadow="never">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="字典名称" style="width: 80%">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="字典编码">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)">{{ action }}</el-button>
          <el-button type="info" @click="onSubmit(0)">{{ action }}并返回</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<script>
import {addDict,updateDict} from "@/common/api/api";

export default {
  components: {
  },
  data() {
    return {
      isClear: false,
      action:"创建",
      form: {
        id:'',
        name: '',
        code: '',

      }
    }
  },
  mounted() {
   this.form.id= this.$route.params.id
   this.form.code= this.$route.params.code
   this.form.name= this.$route.params.name
   if(this.$route.params.action!=undefined){
    this.action= this.$route.params.action
   }
  },
  methods: {
    async onSubmit(type) {
      let form = null;
      form = this.form;
      const params = form;
      let res;
      if(this.action==="创建"){
         res = await addDict(params);
      }else{
         res = await updateDict(params);
      }
      if (res.status=='200'&&res.data.code=='1000') {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        if (type===0){
          this.$router.push(`/system/dict`).catch(error => error);
        }
        return;
      }
      this.$message({
        type: "error",
        message: "保存失败",
      });
    },
    cancel() {
      this.$router.push(`/system/dict`).catch(error => error);
    }
  }
}
</script>

<style scoped>
.form-container {
  width: 80%;
}
</style>
