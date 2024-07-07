<template>
  <div id="div1">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/power/user' }"
        >用户管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>新增用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="form-container" shadow="never">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" style="width: 80%" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码" style="width: 80%" prop="password">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" style="width: 80%" prop="realName">
              <el-input v-model="form.realName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" style="width: 80%" prop="gender">
              <el-input v-model="form.gender"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" style="width: 80%" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" style="width: 80%" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import Editor from "@/components/editor";
import { addUser } from "@/common/api/api";

export default {
  components: {
    Editor,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value == undefined || value.length < 3) {
        callback(new Error("密码不能小于3位"));
      } else {
        callback();
      }
    };
    //rule表示要验证的规则,value表示输入值,callback回调
    const checkEmail = (rule, value, callback) => {
      let mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        //如果输入为空直接返回
        callback();
      } else {
        //如果字符串 string 中含有与 RegExpObject 匹配的文本，则返回 true，否则返回 false。
        if (mailReg.test(value)) {
          //匹配成功返回
          callback();
        } else {
          //匹配不成功返回错误显示
          callback(
            new Error("邮箱格式:xx@xx.xx，只含数字、大小写字母、下划线、横杠")
          );
        }
      }
    };
    const checkPhone = (rule, value, callback) => {
      let phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!value) {
        callback();
      } else {
        if (phoneReg.test(value)) {
          callback();
        } else {
          callback(new Error("电话格式:13、14、15、17、18开头+9位阿拉伯数字"));
        }
      }
    };
    return {
      editor: {
        info: "",
      },
      isClear: false,
      form: {
        title: "",
        content: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 10, message: "长度不超过10个字符", trigger: "blur" },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePass,
          },
        ],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          { min: 1, max: 100, message: "长度不超过100个字符", trigger: "blur" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        phone: [
          {
            trigger: "blur",
            validator: checkPhone,
          },
        ],
        email: [
          {
            trigger: "blur",
            validator: checkEmail,
          },
        ],
      },
    };
  },
  mounted() {},
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
      const valid = await this.$refs.form.validate().catch((err) =>
      {
        console.info(err)
      });
      if (valid === true) {
        let form = null;
        form = this.form;
        const params = form;
        const res = await addUser(params);
        if (res.status == "200" && res.data.code == "1000") {
          this.$message({
            type: "success",
            message: "保存成功",
          });
          if (type === 0) {
            this.$router.push(`/power/user`).catch((error) => error);
          }
          return;
        }
        this.$message({
          type: "error",
          message: "保存失败",
        });
      }
    },
    cancel() {
      this.$router.push(`/power/user`).catch((error) => error);
    },
  },
};
</script>

<style scoped>
.form-container {
  width: 80%;
}
</style>
