<template>
  <div id="div1">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/power/user' }"
        >用户管理</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="this.$route.params.id == undefined"
        >新增用户</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="this.$route.params.id != undefined"
        >编辑用户</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="form-container" shadow="never">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="rules"
        :disabled="disabled"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" style="width: 80%" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入用户账号"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码" style="width: 80%" prop="password">
              <el-input
                v-model="form.password"
                placeholder="请输入登录密码"
                show-password
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" style="width: 80%" prop="realName">
              <el-input
                v-model="form.realName"
                placeholder="请输入真实姓名"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" style="width: 80%" prop="gender">
              <!-- :label=“1”，表示label的值应为数字1-->
              <!-- label=“1”，表示label的值应为字符串1 -->
              <el-radio v-model="form.gender" :label="1">男</el-radio>
              <el-radio v-model="form.gender" :label="2">女</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" style="width: 80%" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" style="width: 80%" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="默认用户"
              style="width: 80%"
              prop="defaultUser"
            >
              <el-switch
                v-model="form.defaultUser"
                active-text="是"
                inactive-text="否"
                active-value="1"
                inactive-value="0"
              >
                <!-- active-color="#13ce66" -->
                <!-- inactive-color="#ff4949" -->
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户状态" style="width: 30%" prop="email">
              <el-select v-model="form.status" placeholder="请选择用户状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit(1)">保存</el-button>
          <el-button type="success" @click="onSubmit(0)">保存并返回</el-button>
          <el-button @click="cancel()">返回</el-button>
        </el-form-item> -->
      </el-form>
    </el-card>
    <el-card
      class="form-button-group"
      body-style="padding:10px;text-align:right"
    >
      <el-button v-if="!this.disabled" type="primary" @click="onSubmit(1)"
        >保存</el-button
      >
      <el-button v-if="!this.disabled" type="success" @click="onSubmit(0)"
        >保存并返回</el-button
      >
      <el-button @click="cancel()">返回</el-button>
    </el-card>
  </div>
</template>

<script>
import Editor from "@/components/editor";
import { addUser, getUser, updateUser } from "@/common/api/api";

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
      disabled: false,
      statusOptions: [
        {
          value: "0",
          label: "已新建",
        },
        {
          value: "1",
          label: "已使用",
        },
        {
          value: "2",
          label: "已禁用",
        },
        {
          value: "3",
          label: "已冻结",
        },
      ],
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
          { min: 1, max: 20, message: "长度不超过20个字符", trigger: "blur" },
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
  mounted() {
    if (this.$route.params.id) {
      if (this.$route.params.view != undefined) {
        this.disabled = true;
      }
      getUser({ id: this.$route.params.id })
        .then((response) => {
          if (response.status == 200 && response.data.code == 1000) {
            this.form = response.data.data;
          }
        })
        .catch(function (error) {});
    }
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
      const valid = await this.$refs.form.validate().catch((err) => {
        console.info(err);
      });
      if (valid === true) {
        let form = null;
        form = this.form;
        const params = form;
        let res = {};
        if (this.form.id == undefined) {
          res = await addUser(params);
        } else {
          res = await updateUser(params);
        }
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
.form-button-group {
  width: 80%;
  margin-top: 5px;
  border: none;
}
</style>
