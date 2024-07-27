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
        v-model="params.roleName"
        clearable
        placeholder="名称"
        style="width: 200px"
        class="filter-item"
      />
      <el-button class="filter-item" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-document"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="danger"
        icon="el-icon-delete"
        @click="handleBatchDelete"
      >
        删除
      </el-button>

      <uploadFile
        :addOrUpdateVisible="addOrUpdateVisible"
        :excelUrl="excelUrl"
        :width="width"
        @changeShow="showAddOrUpdate"
        @close="close"
        ref="addOrUpdateRef"
      ></uploadFile>
    </div>
    /*分类表格 :data(设置数据源) :columns(设置表格中列配置信息)
    :selection-type(是否有复选框) :expand-type(是否展开数据)
    show-index(是否设置索引列) index-text(设置索引列头) border(是否添加纵向边框)
    :show-row-hover(是否鼠标悬停高亮) */
    <tree-table
      :data="tableData"
      :columns="columns"
      :selection-type="true"
      :expand-type="true"
      show-index
      index-text="#"
      border
      :show-row-hover="true"
    >
      <!-- 是否有效 -->
      <template slot="isok" slot-scope="scope">
        <i
          v-if="scope.row.cat_deleted == false"
          class="el-icon-success cGreen"
        ></i>
        <i v-else class="el-icon-error cRed"></i>
      </template>
      <!-- 排序 -->
      <template slot="order" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level == 0" type="warning">一级</el-tag>
        <el-tag v-else-if="scope.row.cat_level == 1" type="info">二级</el-tag>
        <el-tag v-else type="primary">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="opt" slot-scope="scope">
        <div class="optbox">
          <el-button
            type="primary"
            size="mini"
            class="el-icon-plus"
            @click="add(scope.row)"
            >添加</el-button
          >
          <el-button type="primary" size="mini" class="el-icon-edit"  @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            class="el-icon-delete"
            @click="del(scope.row)"
            >删除</el-button
          >
        </div>
      </template>
    </tree-table>
  </div>
</template>

<script>
import { roleList, exportUser, deleteUser } from "@/common/api/api";
import uploadFile from "../view/home/uploadExcelFile";
export default {
  components: {
    uploadFile,
  },
  name: "User",
  data() {
    return {
      listLoading: true,
      multipleSelection: [],
      total: 0,
      tableData: [],
      columns: [
        // tree-table 配置项
        { label: "角色名称", prop: "roleName" },
        { label: "是否有效", prop: "", type: "template", template: "isok" },
        { label: "排序", prop: "", type: "template", template: "order" },
        { label: "操作", prop: "", type: "template", template: "opt" },
      ],
      params: {
        userName: "",
        pageIndex: 1,
        pageSize: 10,
      },
      // 控制新增编辑弹窗的显示与隐藏
      addOrUpdateVisible: false,
      excelUrl: "/user/import",
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
          debugger
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
      this.$router.push(`/form/userform`).catch((error) => error);
    },
    handleRowEdit(index, row) {
      let that = this;
      let id = this.$router
        .push({ name: "Userform", params: { id: row.id } })
        .catch((error) => error);
    },
    handleRowDetail(index, row) {
      let that = this;
      let id = this.$router
        .push({ name: "Userform", params: { id: row.id, view: "view" } })
        .catch((error) => error);
    },
    handleEdit() {
      let that = this;
      if (this.multipleSelection.length == 0) {
        that.$message.error("请勾选一条需要修改的数据");
      }
      if (this.multipleSelection.length > 1) {
        that.$message.error("请只选择一条数据");
      }
      let id = this.$router
        .push({
          name: "Userform",
          params: { id: this.multipleSelection[0].id },
        })
        .catch((error) => error);
    },
    dbSelected(row) {
      let that = this;
      let id = this.$router
        .push({ name: "Userform", params: { id: row.id, view: "view" } })
        .catch((error) => error);
    },
    handleDetail() {
      let that = this;
      if (this.multipleSelection.length == 0) {
        that.$message.error("请勾选一条需要查看的数据");
      }
      if (this.multipleSelection.length > 1) {
        that.$message.error("请只选择一条数据");
      }
      let id = this.$router
        .push({
          name: "Userform",
          params: { id: this.multipleSelection[0].id, view: "view" },
        })
        .catch((error) => error);
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser({ ids: [row.id] })
            .then((response) => {
              if (response.status == 200 && response.data.code == 1000) {
                this.$message.success("删除成功");
                this.getList();
              }
            })
            .catch(function (error) {});
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
          deleteUser({ ids: ids })
            .then((response) => {
              if (response.status == 200 && response.data.code == 1000) {
                that.$message.success("删除成功");
                this.getList();
              }
            })
            .catch(function (error) {});
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
    },
  },
};
</script>
<style>
.el-table th > .cell {
  padding-left: 14px;
}
</style>
