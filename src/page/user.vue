<style></style>
<template>
  <div id="user">
    <el-breadcrumb separator="/" style="margin-bottom: 10px;font-size: 15px;">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom:10px;">
      <el-input
        v-model="params.userName"
        clearable
        placeholder="姓名"
        style="width: 200px;"
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
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
      >
        Search
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
      ></el-table-column>
      <el-table-column prop="userName" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="realName" label="真实姓名" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮件" width="180"> </el-table-column>
      <el-table-column prop="adduser" label="添加人" width="180">
      </el-table-column>
      <el-table-column prop="addtime" label="添加日期" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >修改
          </el-button>
          <el-button
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
import { userList } from "@/common/api/api";
export default {
  name: "User",
  data() {
    return {
      listLoading: true,
      total: 0,
      tableData: [],
      params: {
        userName: "",
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    selectable(row, index) {
      return true;
    },
    getList() {
      console.info("查询中。。。");
      let that = this;
      that.listLoading = true;
      userList(that.params)
        .then(response => {
          that.tableData = response.data.data.data;
          console.info(response.data.data, 3);
          that.total = response.data.data.total;
          that.params.pageIndex = response.data.data.pageIndex;
          that.listLoading = false;
        })
        .catch(function(error) {
          that.listLoading = false;
          that.$message.error("加载失败");
        });
    },
    handleCreate() {},
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
    }
  }
};
</script>
<style>
.el-table th > .cell {
  padding-left: 14px;
}
</style>
