<template>
  <div id="div2">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/power/role' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.params.id == undefined">新增角色</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.params.id != undefined">编辑角色</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="form-container" shadow="never">
      <el-form
               ref="form"
               :model="form"
               label-width="auto"
               :rules="rules"
               :disabled="disabled">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" style="width: 80%" prop="userName">
              <span v-if="disabled">{{ form.userName }}</span>
              <el-input
                        v-else
                        v-model="form.userName"
                        placeholder="请输入角色名称"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色菜单资源">
              <div v-if="disabled">
                <el-tag
                        :key="role.id"
                        v-for="role in form.roleList"
                        :disable-transitions="true">
                  {{ role.roleName }}
                </el-tag>
              </div>
              <div  v-else class="edit_dev">
                <el-transfer
                             
                filterable
                filter-placeholder="请输入菜单名称"
                :titles="['可选', '已选']"
                v-model="form.roleList"
                :data="roleOptions">
   </el-transfer>
              </div>
               
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-card>
    <el-card
             class="form-button-group"
             body-style="padding:10px;text-align:right">
      <el-button v-if="!this.disabled" type="primary" @click="onSubmit(1)">保存</el-button>
      <el-button v-if="!this.disabled" type="success" @click="onSubmit(0)">保存并返回</el-button>
      <el-button @click="cancel()">返回</el-button>
    </el-card>
  </div>
</template>

<script>
  import { menuList } from "@/common/api/api";

  export default {
    components: {
    },
    data() {
      return {
        value: [],
        disabled: false,
        isClear: false,
        form: {},
        rules: {
          userName: [
            { required: true, message: "请输入账号", trigger: "blur" },
            { min: 1, max: 20, message: "长度不超过20个字符", trigger: "blur" },
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
              if (!this.disabled) {
                // 穿梭框在右侧只需要赋值id就可以显示
                const initSelectRoleList = [];
                this.form.roleList.map((item) => {
                  initSelectRoleList.push(item.id);
                });
                this.form.roleList = initSelectRoleList;
              }
            }
          })
          .catch(function (error) { });
      }
    },
    computed: {
     
    },
    methods: {
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
        this.$router.push(`/power/role`).catch((error) => error);
      },
    },
  };
</script>

<style scoped>
  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .form-container {
    width: 80%;
  }

  .form-button-group {
    width: 80%;
    margin-top: 5px;
    border: none;
  }

  .edit_dev>>>.el-transfer-panel {
    width: 40%;
  }
</style>