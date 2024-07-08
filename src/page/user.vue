<style></style>
<template>
  <div id="user">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom: 10px">
      <el-input
        v-model="params.userName"
        clearable
        placeholder="账号/姓名/邮箱"
        style="width: 200px"
        class="filter-item"
      />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button class="filter-item" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="warning"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        修改
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="danger"
        icon="el-icon-edit"
        @click="handleBatchDelete"
      >
        删除
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="info"
        icon="el-icon-download"
        @click="downTemplate"
      >
        导出
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="info"
        icon="el-icon-upload"
        @click="show"
      >
        导入
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
    <el-table
      v-loading="listLoading"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
      ></el-table-column>
      <el-table-column prop="userName" label="用户名"> </el-table-column>
      <el-table-column prop="realName" label="真实姓名"> </el-table-column>
      <el-table-column prop="phone" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮件" width="180"></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="formatStatus"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="defaultUser"
        label="是否默认用户"
        :formatter="formatDefaultUser"
        width="180"
      ></el-table-column>
      <el-table-column prop="adduser" label="添加人" width="180">
      </el-table-column>
      <el-table-column prop="addtime" label="添加日期" width="180">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.defaultUser == '1'"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >修改
          </el-button>
          <el-button
            :disabled="scope.row.defaultUser == '1'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除
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
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { userList, exportUser, deleteUser } from "@/common/api/api";
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
    selectable(row, index) {
      return row.defaultUser != "1";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList() {
      console.info("查询中。。。");
      let that = this;
      that.listLoading = true;
      userList(that.params)
        .then((response) => {
          that.tableData = response.data.data.data;
          console.info(response.data.data, 3);
          that.total = response.data.data.total;
          that.params.pageIndex = response.data.data.pageIndex;
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
      let ids = this.multipleSelection.map(function (item) {
        return item["id"];
      });

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
