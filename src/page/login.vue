<template>
  <div id="user">

    <body id="poster">
      <el-form
               :model="loginForm"
               ref="loginForm"
               class="login-container"
               label-position="left"
               label-width="0px"
               :rules="rules">
        <!--      v-loading="loading"
        element-loading-text="登录中"
        element-loading-spinner="el-icon-loading" 
      element-loading-background="rgba(0, 0, 0, 0.8)" -->
        <h3 class="login_title">Cavy</h3>
        <el-form-item prop="username">
          <el-input
                    class="login-el-input"
                    type="text"
                    v-model="loginForm.username"
                    auto-complete="off"
                    placeholder="账号"></el-input>
        </el-form-item>

        <el-form-item prop="pwd">
          <el-input
                    class="login-el-input"
                    type="password"
                    v-model="loginForm.pwd"
                    auto-complete="off"
                    placeholder="密码"></el-input>
          <!--  @keyup.enter.native="login" -->
        </el-form-item>
        <el-checkbox
                     v-model="remenber"
                     label="记住密码"
                     name="type"></el-checkbox>
        <el-form-item style="width: 100%">
          <el-button
                     class="loginbutton"
                     type="primary"
                     @click="login"
                     @keyup.enter="keyDown(e)">登录
          </el-button>
        </el-form-item>
      </el-form>
    </body>
  </div>
</template>

<script>
import { login } from "../common/api/api";
const Base64 = require('js-base64').Base64
export default {
  name: "Login",
  data() {
    return {
      // loading:false,
      loginForm: {
        username: "",
        pwd: ""
      },
      remenber: false,
      responseResult: [],
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown, true);
    this.loadStore();
  },
  destroyed() {
    window.removeEventListener("keydown", this.keyDown, false);
  },
  methods: {
    keyDown(e) {
      if (e.keyCode == 13) {
        //在密码框监听了回车事件，这里可以不用了
        if (
          this.loginForm.username != undefined &&
          this.loginForm.pwd != undefined
        ) {
          this.login();
        }
      }
    },
    async login() {
      let that = this;
      let valid = await this.$refs.loginForm.validate();
      if (!valid) {
        that.$message.error("表单验证不通过！");
        return;
      }
      login({
        username: this.loginForm.username,
        pwd: this.loginForm.pwd,
      })
        .then((res) => {
          console.info(res, "登录接口返回值");
          if (
            res.status == 200 &&
            res.data.data.token &&
            res.data.msg === "登录成功"
          ) {
            window.localStorage["token"] = res.data.data.token;
            that.$router.replace({ path: "/index" });
            console.info(JSON.stringify(res.data.data), "用户信息");
            window.localStorage["userinfo"] = JSON.stringify(res.data.data);
            this.stroeInfo()
          } else {
            that.$message.error(res.data.msg);
          }
        })
        .catch((failResponse) => { });
    },
    stroeInfo() {
      if (this.remenber) {
        let pwd = Base64.encode(this.loginForm.pwd); // base64加密
        window.localStorage.setItem('username', this.loginForm.username);
        window.localStorage.setItem('pwd', pwd);
      } else {
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('pwd');
      }
    },
    loadStore() {
      let username = localStorage.getItem('username')
      if (username) {
        this.loginForm.username = localStorage.getItem('username')
        this.loginForm.pwd = Base64.decode(localStorage.getItem('pwd'))// base64解密
        this.remenber = true
      }
    }
  },
};
</script>
<style >
#poster {
  background-image: linear-gradient(to left, #fd79a8, #a29bfe);
  /*background: url("../assets/imgs/backgroud.jpg") no-repeat;*/
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

.loginbutton {
  display: block;
  margin: 0 auto;
  text-align: center;
  /*height: 24px;*/
  padding: 12px;
  font: 900 20px "";
  color: #333744;
  width: 50%;
  border: none;
  justify-content: center;
  border-radius: 10px;
  background-image: linear-gradient(to left, #fd79a8, #a29bfe);
}

.login-container {
  border-radius: 10px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  /*border: 1px solid #eaeaea;*/
  /*box-shadow: 0 0 25px #cac6c6;*/
}

.login-el-input {
  border: 0;
  /* border-bottom: 2px solid rgb(60, 60, 70); */
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
  font: 900 40px "";
  letter-spacing: 2px;
}
</style>
<style scoped>
.el-input__inner {
  border: 0;
}

.el-input__inner::placeholder {
  color: #000;
  text-align: left;
}

/* 谷歌 */
.el-input__inner::-webkit-input-placeholder {
  color: #000;
  text-align: left;
  font-weight: bold;
}
</style>
