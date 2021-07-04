<template>
  <div id="user">
    <body id="poster">
      <el-form
        ref="loginForm"
        class="login-container"
        label-position="left"
        label-width="0px"
        :rules="rules"
      >
        <h3 class="login_title">登录</h3>
        <el-form-item prop="loginForm.username">
          <el-input
            type="text"
            v-model="loginForm.username"
            auto-complete="off"
            placeholder="账号"
          ></el-input>
        </el-form-item>

        <el-form-item prop="loginForm.password">
          <el-input
            type="password"
            v-model="loginForm.password"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>

        <el-form-item style="width: 100%">
          <el-button
            type="primary"
            style="width: 100%;background: #505458;border: none"
            v-on:click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </body>
  </div>
</template>

<script>
import { login } from "../common/api/api";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      responseResult: [],
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    login() {
      let that = this;
      login({
        username: this.loginForm.username,
        password: this.loginForm.password
      })
        .then(res => {
          console.info(res, '登录接口返回值');
          if (
            res.status == 200 &&
            res.data.data.token &&
            res.data.msg === "登录成功"
          ) {
            window.localStorage["token"] = res.data.data.token;
            that.$router.replace({ path: "/index" });
            console.info(JSON.stringify(res.data.data), '用户信息');
            JSON.parse('jsonString');
            window.localStorage["userinfo"] = JSON.stringify(res.data.data);
          } else {
          that.$message.error(res.data.msg);
          }
        })
        .catch(failResponse => {});
    }
  }
};
</script>
<style>
#poster {
  background: url("../assets/imgs/backgroud.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
body {
  margin: 0px;
  padding: 0;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
