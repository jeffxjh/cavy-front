<style></style>
<template>
  <div id="user">
    <el-breadcrumb separator="/" style="margin-bottom: 10px;font-size: 15px;">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>问答管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom:10px;">
      <el-input
        v-model="params.title"
        clearable
        placeholder="标题"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
      >
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      row-key="keyId"
      @expand-change="expandChange"
      :row-class-name="getRowClass">
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
      ></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props" >
        <el-table
                   v-if="props.row.hasAnswer !== null"
                   :data="props.row.childrenData"
                   v-loading="props.row.loading"
                   border
                   style="width: 100%"
        >
          <el-table-column prop="addUser" label="添加人" width="180">
          </el-table-column>
          <el-table-column prop="addTime" label="添加日期" width="200">
          </el-table-column>
          <el-table-column prop="content" label="内容" width="180">
          </el-table-column>
          <el-table-column prop="content" label="审核状态" width="180">
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
            v-if="props.row.hasAnswer !== null"
            layout="prev, pager, next, sizes, total, jumper"
            :page-sizes="[1, 5, 10, 15]"
            :page-size="chrild.pageSize"
            :total="chrild.total"
            @current-change="chrildhandleCurrentChange"
            @size-change="chrildhandleSizeChange"
          >
          </el-pagination>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180">

      </el-table-column>
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
import {questionList, findAnswerByQuestionId} from "@/common/api/api";

export default {
  name: "User",
  data() {
    return {
      currentId: null,
      expands: [],
      tableExpandData: [],
      listLoading: true,
      total: 0,
      tableData: [],
      chrild:{
        pageIndex: 1,
        pageSize: 5,
        total: 0,
      },
      params: {
        title: "",
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
      questionList(that.params)
        .then(response => {
          console.info(123123,response)
          that.tableData = response.data.data.data.map((item, index) => {
            item.keyId = index;
            item.childrenData = []; // 添加子表格数据
            return item;
          });
          that.total = response.data.data.total;
          that.params.pageIndex = response.data.data.pageIndex;
          that.listLoading = false;
        })
        .catch(function (error) {
          console.info(321321,error)
          that.listLoading = false;
          that.$message.error("加载失败");
        });
    },
    getRowKeys(row) {
      return row.id // 通过此方法，可以为表格中的每一行设置一个唯一的key值
    },
    toggleRowExpansion(row) {
      this.currentId=row.id
      this.expands = [row.id] // 要展开的当前行

      findAnswerByQuestionId(param)
        .then((res) => {
            this.tableExpandData = res.data.data.data
          }
        );
    },
    // 获取子层表格数据并更新allRules数据
    expandChange (row, expandedRows) {
      let that = this;
      this.currentId=row.id
      if (!row.children) {
        // 通过$set属性可设置loading实现实时加载loading效果(经过测试,通过$set直接给父层数据声明子层数据时会出现报错,所以才在获取父层表格数据时声明子层表格数据)
        this.$set(row, 'loading', true);
        let param = {questionId: row.id, pageIndex: that.chrild.pageIndex,pageSize: that.chrild.pageSize}
        findAnswerByQuestionId( param ).then((res) => {
          that.chrild.total = res.data.data.total;
            // 遍历父层表格数据
          that.tableData.forEach((temp, index) => {
              // 找到当前展开的行，把获取到的数据赋值进去
              if (temp.keyId === row.keyId) {
                that.tableData[index].childrenData = res.data.data.data || [];
              }
            });
          this.$set(row, 'loading', false);
        }, (err) => {
          this.$set(row, 'loading', false);
        });
      }
    },
    // 判断表格是否有子项，无子项不显示展开按钮
    getRowClass (row, rowIndex) {
      // children 是你子项的数组 key
      if (row.row.hasAnswer === null) {
        return 'row-expand-cover'
      }
    },
    handleCreate() {
      this.$router.push(`/form/questionform`).catch(error => error);
    },
    sortChange(data) {
      const {prop, order} = data;
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
    chrildhandleSizeChange(val) {
      let that=this
      that.chrild.pageSize = val;
      console.info(that.currentId,2)
      let param = {questionId: that.currentId, pageIndex: that.chrild.pageIndex,pageSize: that.chrild.pageSize}
      findAnswerByQuestionId( param ).then((res) => {
        // 遍历父层表格数据
        that.tableData.forEach((temp, index) => {
          // 找到当前展开的行，把获取到的数据赋值进去
            that.tableData[index].childrenData = res.data.data.data || [];
        });
      })
    },
    chrildhandleCurrentChange(val) {
      let that=this
      this.chrild.pageIndex = val;
      console.info(that.currentId,2)
      let param = {questionId: that.currentId, pageIndex: that.chrild.pageIndex,pageSize: that.chrild.pageSize}
      findAnswerByQuestionId( param ).then((res) => {
        // 遍历父层表格数据
        that.tableData.forEach((temp, index) => {
          // 找到当前展开的行，把获取到的数据赋值进去
          that.tableData[index].childrenData = res.data.data.data || [];
        });
      })
    },
  }
};
</script>
<style scoped>
.el-table th > .cell {
  padding-left: 14px;
}
/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon {
  display: none;
}
</style>
