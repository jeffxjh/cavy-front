<template>
  <div id="div2">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/power/role' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.params.operate == 'add'">新增角色</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.params.operate == 'edit'">编辑角色</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.params.operate == 'view'">查看角色</el-breadcrumb-item>
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
            <el-form-item label="角色名称" style="width: 50%" prop="roleName">
              <span v-if="disabled">{{ form.roleName }}</span>
              <el-input
                        v-else
                        v-model="form.roleName"
                        placeholder="请输入角色名称"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色菜单资源" prop="menuTreeList">
              <div class="edit_dev">
                <el-tree
                         :data="menuTree"
                         show-checkbox
                         default-expand-all
                         node-key="id"
                         ref="tree"
                         @check-change="menuTreeChange"
                         :highlight-current="true"
                         :expand-on-click-node="false"
                         :check-on-click-node="true"
                         :props="defaultProps">
                </el-tree>
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
  import { listMenu, addRole, updateRole, getRole } from "@/common/api/api";

  export default {
    components: {
    },
    data() {
      var validatePass = (rule, value, callback) => {
      let arr = this.$refs.tree.getCheckedKeys()
      if (arr.length == 0 || !arr) {
        callback(new Error("请选择菜单"));
      } else {
        callback();
      }
    };
      return {
        selectKeys: [],
        disabled: false,
        isClear: false,
        form: {},
        rules: {
          roleName: [
            { required: true, message: "请输入角色名称", trigger: "blur" },
            { min: 1, max: 20, message: "长度不超过20个字符", trigger: "blur" },
          ],
          menuTreeList: [{ required: true, validator: validatePass, trigger: "change" }]
        },
        menuTree: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 查询参数
        queryParams: {
          menuName: undefined,
          status: undefined,
          disabled: false,
        },
      };
    },
    mounted() {
      if (this.$route.params.operate == 'view') {
        this.queryParams.disabled = true
      }

      listMenu(this.queryParams).then(response => {
        this.menuTree = response.data.data;
      });

      if (this.$route.params.id) {
        if (this.$route.params.view != undefined) {
          this.disabled = true;
        }
        getRole({ id: this.$route.params.id })
          .then((response) => {
            if (response.status == 200 && response.data.code == 1000) {
              this.form = response.data.data;
              this.selectKeys = response.data.data.selectKeys;
              this.$refs.tree.setCheckedKeys(this.selectKeys);
              //       this.$refs.tree.setCheckedNodes([{
              //   id: 5,
              //   label: '二级 2-1'
              // }, {
              //   id: 9,
              //   label: '三级 1-1-1'
              // }]);
            }
          })
          .catch(function (error) { });
      }
    },
    computed: {

    },
    methods: {
      async onSubmit(type) {
        // console.log(this.$refs.tree.getCheckedNodes());
        // console.log(this.$refs.tree.getCheckedKeys());
        const valid = await this.$refs.form.validate().catch((err) => {
          console.info(err);
        });
        if (valid === true) {
          let form = null;
          form = this.form;
          form.menuTreeList = this.$refs.tree.getCheckedNodes();
          const params = form;
          let res = {};
          if (this.form.id == undefined) {
            res = await addRole(params);
          } else {
            res = await updateRole(params);
          }
          if (res.status == "200" && res.data.code == "1000") {
            this.$message({
              type: "success",
              message: "保存成功",
            });
            if (type === 0) {
              this.$router.push(`/power/role`).catch((error) => error);
            }
            return;
          }
        }
      },
      menuTreeChange() {
      // this.form.menuTreeList = this.$refs.tree.getCheckedNodes();
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