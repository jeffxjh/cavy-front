<style></style>
<template>
  <div id="user">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom: 18px">
      <el-input
                v-model="params.userName"
                clearable
                placeholder="账号/姓名/邮箱"
                style="width: 200px"
                :size="btnSize"
                class="filter-item" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button class="filter-item" icon="el-icon-search" @click="getList" :size="btnSize">
        搜索
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="success"
        icon="el-icon-search"
        @click="handleDetail"
      >
        明细
      </el-button>     -->
      <el-button
                 class="filter-item"
                 style="margin-left: 10px"
                 type="primary"
                 icon="el-icon-document"
                 :size="btnSize"
                 @click="handleCreate">
        添加
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="warning"
        icon="el-icon-edit"
        @click="handleEdit"
      >
        编辑
      </el-button> -->
      <el-button
                 class="filter-item"
                 style="margin-left: 10px"
                 type="danger"
                 icon="el-icon-delete"
                 :size="btnSize"
                 @click="handleBatchDelete">
        删除
      </el-button>
      <el-button
                 class="filter-item"
                 style="margin-left: 10px"
                 type="success"
                 icon="el-icon-download"
                 :size="btnSize"
                 @click="downTemplate">
        导出
      </el-button>
      <el-button
                 class="filter-item"
                 style="margin-left: 10px"
                 type="success"
                 icon="el-icon-upload"
                 :size="btnSize"
                 @click="show">
        导入
      </el-button>
      <uploadFile
                  :addOrUpdateVisible="addOrUpdateVisible"
                  :excelUrl="excelUrl"
                  :width="width"
                  :size="btnSize"
                  @changeShow="showAddOrUpdate"
                  @close="close"
                  ref="addOrUpdateRef"></uploadFile>
    </div>
    <el-table
              :header-cell-style="{background:'#eee',color:'black'}"
              :cell-style="cellStyle"
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
      <el-table-column prop="userName" label="用户名"> </el-table-column>
      <el-table-column prop="realName" label="真实姓名"> </el-table-column>
      <el-table-column prop="phone" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮件" width="180"></el-table-column>
      <el-table-column
                       prop="status"
                       label="状态"
                       width="180">
        <template slot-scope="scope">
          {{ fmtDic('USER_STATUS', scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
                       prop="defaultUser"
                       label="是否默认用户"
                       width="180">
        <template slot-scope="scope">
          {{ fmtDic('IS_OR_NOT', scope.row.defaultUser) }}
        </template>
      </el-table-column>
      <el-table-column prop="addUser" label="添加人" width="180">
      </el-table-column>
      <el-table-column prop="addTime" label="添加日期" width="180">
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
  import { mapGetters } from 'vuex';
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
      // 获取字典项数据
      this.$store.dispatch('fetchDictionary', { items: ['IS_OR_NOT', 'USER_STATUS'] });
      this.getList();
    },
    computed: {
      ...mapGetters(['fmtDic'])
    },
    methods: {
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
        userList(that.params)
          .then((response) => {
            that.tableData = response.data.data.data;
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
        let defaultUsers = []
        let ids = this.multipleSelection.map(function (item) {
          if (item['defaultUser'] == '1') {
            defaultUsers.push(item)
          }
          return item["id"];
        });
        if (defaultUsers.length != 0) {
          that.$message.error("请不要选择默认用户");
          return
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
      cellStyle({ row, column, rowIndex, columnIndex }) {
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