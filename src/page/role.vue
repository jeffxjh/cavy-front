<style></style>
<template>
  <div id="role">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom: 10px">
      <el-input
                :size="btnSize"
                v-model="params.roleName"
                clearable
                placeholder="名称"
                style="width: 200px"
                class="filter-item" />
      <el-button :size="btnSize" class="filter-item" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <el-button
                 :size="btnSize"
                 class="filter-item"
                 style="margin-left: 10px"
                 type="primary"
                 icon="el-icon-document"
                 @click="handleCreate">
        添加
      </el-button>
      <el-button
                 :size="btnSize"
                 class="filter-item"
                 style="margin-left: 10px"
                 type="danger"
                 icon="el-icon-delete"
                 @click="handleBatchDelete">
        删除
      </el-button>

      <uploadFile
                  :addOrUpdateVisible="addOrUpdateVisible"
                  :excelUrl="excelUrl"
                  :width="width"
                  @changeShow="showAddOrUpdate"
                  @close="close"
                  ref="addOrUpdateRef"></uploadFile>
    </div>
    <el-table
              :header-cell-style="{background:'#eee',color:'black'}"
              :cell-style=" cellStyle"
              v-loading="listLoading"
              :data="tableData"
              highlight-current-row
              style="width: 100%"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange"
              @row-dblclick="dbSelected">
      <el-table-column
                       type="selection"
                       width="55"
                       :selectable="selectable"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="addUser" label="添加人" width="180">
      </el-table-column>
      <el-table-column prop="addTime" label="添加日期" width="200">
      </el-table-column>
      <el-table-column label="操作" width="255">
        <template slot-scope="scope">
          <!-- :disabled="scope.row.defaultUser == '1'" -->
          <el-button
                     :size="btnSize"
                     type="success"
                     @click="handleRowDetail(scope.$index, scope.row)">明细
          </el-button>
          <el-button
                     :size="btnSize"
                     type="warning"
                     :disabled="scope.row.defaultUser == '1'"
                     @click="handleRowEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
                     :disabled="scope.row.defaultUser == '1'"
                     :size="btnSize"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
                   background
                   layout="prev, pager, next, sizes, total, jumper"
                   :page-sizes="[1, 10, 15, 20]"
                   :page-size="params.pageSize"
                   :total="total"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange">
    </el-pagination>
  </div>
</template>

<script>
  import { roleList, exportUser, deleteRole } from "@/common/api/api";
  import uploadFile from "../view/home/uploadExcelFile";
  export default {
    components: {
      uploadFile,
    },
    name: "Role",
    data() {
      return {
        listLoading: true,
        multipleSelection: [],
        total: 0,
        tableData: [],

        params: {
          userName: "",
          pageIndex: 1,
          pageSize: 10,
        },
        // 控制新增编辑弹窗的显示与隐藏
        addOrUpdateVisible: false,
        excelUrl: "/role/import",
        width: "30%",
      };
    },
    watch: {},
    created() {
      this.getList();
    },
    methods: {
      add(row) {
        debugger;
      },
      edit(row) {
        debugger;
      },
      del(row) {
        debugger;
      },
      selectable(row, index) {
        // return row.defaultUser != "1";
        return true;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getList() {
        console.info("查询中。。。");
        let that = this;
        that.listLoading = true;
        roleList(that.params)
          .then((response) => {
            that.tableData = response.data.data;
            console.info(response.data.data, 3);
            that.total = response.data.total;
            that.params.pageIndex = response.data.pageIndex;
            that.listLoading = false;
          })
          .catch(function (error) {
            that.listLoading = false;
            that.$message.error("加载失败");
          });
      },
      handleCreate() {
        // this.$router.push(`/form/roleform`).catch((error) => error);
        this.$router.push({name:'RoleForm',params:{operate:"add"}}).catch((error) => {
          console.error(error)
        });
      },
      handleRowEdit(index, row) {
        let that = this;
        let id = this.$router.push({ name: "RoleForm", params: { id: row.id ,operate:"edit" } }).catch((error) => error);
      },
      handleRowDetail(index, row) {
        let that = this;
        let id = this.$router.push({ name: "RoleForm", params: { id: row.id, view: "view"  ,operate:"view"} }).catch((error) => error);
      },
      // handleEdit() {
      //   let that = this;
      //   if (this.multipleSelection.length == 0) {
      //     that.$message.error("请勾选一条需要修改的数据");
      //   }
      //   if (this.multipleSelection.length > 1) {
      //     that.$message.error("请只选择一条数据");
      //   }
      //   let id = this.$router
      //     .push({
      //       name: "RoleForm",
      //       params: { id: this.multipleSelection[0].id ,operate:"edit"},
      //     })
      //     .catch((error) => error);
      // },
      dbSelected(row) {
        let that = this;
        let id = this.$router
          .push({ name: "RoleForm", params: { id: row.id, view: "view" } })
          .catch((error) => error);
      },
      // handleDetail() {
      //   let that = this;
      //   if (this.multipleSelection.length == 0) {
      //     that.$message.error("请勾选一条需要查看的数据");
      //   }
      //   if (this.multipleSelection.length > 1) {
      //     that.$message.error("请只选择一条数据");
      //   }
      //   let id = this.$router
      //     .push({
      //       name: "RoleForm",
      //       params: { id: this.multipleSelection[0].id, view: "view",operateType:"view" },
      //     })
      //     .catch((error) => error);
      // },
      handleDelete(index, row) {
        this.$confirm("此操作将永久删除角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteRole({ ids: [row.id] })
              .then((response) => {
                if (response.status == 200 && response.data.code == 1000) {
                  this.$message.success("删除成功");
                  this.getList();
                }
              })
              .catch(function (error) { });
          })
          .catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "已取消删除",
            // });
          });
      },
      handleBatchDelete() {
        let that = this;
        if (this.multipleSelection.length == 0) {
          that.$message.error("请勾选需要删除的数据");
        }
        let defaultUsers = [];
        let ids = this.multipleSelection.map(function (item) {
          if (item["defaultUser"] == "1") {
            defaultUsers.push(item);
          }
          return item["id"];
        });
        if (defaultUsers.length != 0) {
          that.$message.error("请不要选择默认用户");
          return;
        }
        this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteRole({ ids: ids })
              .then((response) => {
                if (response.status == 200 && response.data.code == 1000) {
                  that.$message.success("删除成功");
                  this.getList();
                }
              })
              .catch(function (error) { });
          })
          .catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "已取消删除",
            // });
          });
      },
      sortChange(data) {
        const { prop, order } = data;
        if (prop === "id") {
          that.sortByID(order);
        }
      },
      handleSizeChange(val) {
        this.params.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.params.pageIndex = val;
        this.getList();
      },
      downTemplate() {
        let that = this;
        exportUser(that.params)
          .then((res) => {
            if (!res) return;
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8",
            });
            let url = window.URL.createObjectURL(blob);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", "用户信息.xlsx"); // 下载的文件
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
            window.URL.revokeObjectURL(url);
          })
          .catch(function (error) {
            that.listLoading = false;
            that.$message.error("加载失败");
          });
      },
      // 按钮点击事件 显示新增编辑弹窗组件
      show() {
        this.addOrUpdateVisible = true;
      },
      close() {
        this.addOrUpdateVisible = false;
      },
      // 监听 子组件弹窗关闭后触发，有子组件调用
      showAddOrUpdate(data) {
        if (data === "false") {
          this.addOrUpdateVisible = false;
        } else {
          this.addOrUpdateVisible = true;
        }
      },
      formatStatus(row, column) {
        switch (row.status) {
          case "3":
            return "已冻结";
            break;
          case "2":
            return "已禁用";
            break;
          case "1":
            return "已使用";
            break;
          case "0":
            return "已新建";
            break;
          default:
            return row.status;
        }
      },
      formatDefaultUser(row, column) {
        switch (row.defaultUser) {
          case "1":
            return "是";
            break;
          case "0":
            return "否";
            break;
          default:
            return row.defaultUser;
        }
      }, cellStyle({ row, column, rowIndex, columnIndex }) {
        //根据报警级别显示颜色
        if (
          row.status == "0" && columnIndex == 5
        ) {
          return "color:black;";
        } else if (
          row.status == "1" && columnIndex == 5
        ) {
          return "color:green;";
        } else if (
          row.status == "2" && columnIndex == 5
        ) {
          return "color:red;";
        } else if (
          row.status == "3" && columnIndex == 5
        ) {
          return "color:orange;";
        }

      },
    },
  };
</script>
<style>
  .el-table th>.cell {
    padding-left: 14px;
  }
</style>