<template>
    <div id="user">
        <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/system' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>字典管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin-bottom: 18px">
            <el-input
                      v-model="params.name"
                      clearable
                      placeholder="名称/编码"
                      size="small"
                      style="width: 200px"
                      class="filter-item" />
            <el-button
                       class="filter-item"
                       icon="el-icon-search"
                       size="mini"
                       @click="getList">
                搜索
            </el-button>
            <el-button
                       class="filter-item"
                       style="margin-left: 10px"
                       type="primary"
                       size="mini"
                       icon="el-icon-edit"
                       @click="handleCreate">
                添加
            </el-button>
        </div>
        <el-table
                  ref="mainTable"
                  v-loading="listLoading"
                  :data="tableData"
                  highlight-current-row
                  style="width: 100%"
                  @sort-change="sortChange"
                  :row-key="getRowKeys"
                  @expand-change="expandChange"
                  :row-class-name="getRowClass">
            >
            <el-table-column
                             type="selection"
                             width="55"
                             :selectable="selectable"></el-table-column>
            <el-table-column type="expand" width="100px">
                <template slot="header" slot-scope="{}">
                    <el-button type="text" @click="change">{{ isExpand ? '收起' : '展开' }}</el-button>
                </template>
                <template slot-scope="props">
                    <el-table
                              v-if="props.row.childrenData.length > 0"
                              :data="props.row.childrenData"
                              v-loading="props.row.loading"
                              :row-key="getRowKeys"
                              border
                              style="width: 100%">
                        <el-table-column prop="item" label="代码">
                        </el-table-column>
                        <el-table-column prop="label" label="码值">
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button
                                           size="mini"
                                           type="danger"
                                           @click="handleDeleteItem(scope.$index, scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                                   background
                                   v-if="props.row.childrenData.length > 10"
                                   layout="prev, pager, next, sizes, total, jumper"
                                   :page-sizes="[1, 5, 10, 15]"
                                   :page-size="chrild.pageSize"
                                   :total="chrild.total"
                                   @current-change="chrildhandleCurrentChange"
                                   @size-change="chrildhandleSizeChange">
                    </el-pagination>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="字典名称"> </el-table-column>
            <el-table-column prop="code" label="字典编码"> </el-table-column>
            <el-table-column prop="addUser" label="添加人" width="180">
            </el-table-column>
            <el-table-column prop="addTime" label="添加日期" width="200">
            </el-table-column>
            <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="handleAddItem(scope.$index, scope.row)">添加项
                    </el-button>
                    <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">修改
                    </el-button>
                    <el-button
                               size="mini"
                               type="danger"
                               @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                    <!-- <el-button type="text" @click="toogleExpand(scope.row)">查看详情</el-button> -->
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

        <el-drawer
                   title="消息列表"
                   :visible.sync="item.drawer"
                   :with-header="false"
                   height="250"
                   max-height="250">
            <el-form ref="itemForm" :model="item.form" label-width="80px" :rules="item.rules">
                <el-form-item label="值" style="width: 90%" prop="label">
                    <el-input v-model="item.form.label"></el-input>
                </el-form-item>
                <el-form-item label="关键字" style="width: 90%" prop="item">
                    <el-input v-model="item.form.item"></el-input>
                </el-form-item>
                <el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="itemFormAdd()" size="small">添加</el-button>
                    <el-button @click="itemFormCancel()" size="small">取消</el-button>
                    <el-button type="success" @click="itemFormSubmit()" size="small">保存</el-button>
                </el-form-item>
            </el-form>
            <el-table
                      size="mini"
                      :data="item.tempList">
                <el-table-column property="label" label="值"></el-table-column>
                <el-table-column property="item" label="关键字"></el-table-column>
            </el-table>
        </el-drawer>
    </div>
</template>

<script>
import { pageDict, getDict, addDictItem, delDict, delDictItem } from "@/common/api/api";

export default {
    name: "Dict",
    data() {
        return {
            isExpand: false,//默认收起
            item: {
                drawer: false,
                tempList: [],
                form: {
                    dicId: "",
                    item: "",
                    label: "",
                },
                rules: {
                    item: [{
                        required: true,
                        message: '关键字必须填写',
                        trigger: 'blur'
                    }],
                    label: [{
                        required: true,
                        message: '值必须填写',
                        trigger: 'blur'
                    }],
                }
            },
            currentId: null,
            expands: [],
            tableExpandData: [],
            listLoading: true,
            total: 0,
            tableData: [],
            chrild: {
                pageIndex: 1,
                pageSize: 5,
                total: 0,
            },
            params: {
                name: "",
                pageIndex: 1,
                pageSize: 10,
            },
        };
    },
    watch: {},
    created() {
        this.getList();
    },
    methods: {
        toogleExpand(row) {
            this.tableData.map((item) => {
                this.$refs.mainTable.toggleRowExpansion(item, false)
            })
            this.$refs.mainTable.toggleRowExpansion(row);
        },
        change() {
            //如果表格没有数据，操作不起作用
            if (this.tableData.length == 0)
                return
            //取反
            this.isExpand = !this.isExpand
            //遍历设置
            this.tableData.forEach(e => {
                //没有子节点的不操作
                 if(e.childrenData.length!==0){
                    this.$refs.mainTable.toggleRowExpansion(e, this.isExpand)
                 }
            });
        },
        selectable(row, index) {
            return true;
        },
        getList() {
            this.listLoading = true;
            pageDict(this.params)
                .then((response) => {
                    //   that.tableData = response.data.data.data.map((item, index) => {
                    //     // item.id = index;
                    //     item.childrenData = item.children; // 添加子表格数据
                    //     return item;
                    //   });
                    this.tableData = response.data.data.data;
                    this.total = response.data.data.total;
                    this.params.pageIndex = response.data.data.pageIndex;
                    this.listLoading = false;
                })
                .catch(function (error) {
                    this.listLoading = false;
                    this.$message.error("加载失败");
                });
        },
        getRowKeys(row) {
            return JSON.stringify(row); // 通过此方法，可以为表格中的每一行设置一个唯一的key值
        },

        toggleRowExpansion(row) {
            this.currentId = row.id;
            this.expands = [row.id]; // 要展开的当前行

            // getDict().then((res) => {
            //     this.tableExpandData = res.data.data.data;
            // });
        },
        // 获取子层表格数据并更新allRules数据
        expandChange(row, expandedRows) {
            let that = this;
            this.currentId = row.id;
            if (!row.childrenData) {
                // 通过$set属性可设置loading实现实时加载loading效果(经过测试,通过$set直接给父层数据声明子层数据时会出现报错,所以才在获取父层表格数据时声明子层表格数据)
                // this.$set(row, "loading", true);
                // let param = {
                //     questionId: row.id,
                //     pageIndex: that.chrild.pageIndex,
                //     pageSize: that.chrild.pageSize,
                // };
                // getDict(param).then(
                //     (res) => {
                //         that.chrild.total = res.data.data.total;
                //         // 遍历父层表格数据
                //         // that.tableData.forEach((temp, index) => {
                //         //     // 找到当前展开的行，把获取到的数据赋值进去
                //         //     if (temp.keyId === row.keyId) {
                //         //         that.tableData[index].childrenData = res.data.data.data || [];
                //         //     }
                //         // });
                //         this.$set(row, "loading", false);
                //     },
                //     (err) => {
                //         this.$set(row, "loading", false);
                //     }
                // );
            }
        },
        // 判断表格是否有子项，无子项不显示展开按钮
        getRowClass(row, rowIndex) {
            // children 是你子项的数组 key
            if (row.row.childrenData.length === 0) {
                return "row-expand-cover";
            }
        },
        handleCreate() {
            this.$router.push(`/form/dictform`).catch((error) => error);
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
        chrildhandleSizeChange(val) {
            let that = this;
            that.chrild.pageSize = val;
            let param = {
                questionId: that.currentId,
                pageIndex: that.chrild.pageIndex,
                pageSize: that.chrild.pageSize,
            };
            // getDict(param).then((res) => {
            //     // 遍历父层表格数据
            //     that.tableData.forEach((temp, index) => {
            //         // 找到当前展开的行，把获取到的数据赋值进去
            //         that.tableData[index].childrenData = res.data.data.data || [];
            //     });
            // });
        },
        chrildhandleCurrentChange(val) {
            let that = this;
            this.chrild.pageIndex = val;
            console.info(that.currentId, 2);
            let param = {
                questionId: that.currentId,
                pageIndex: that.chrild.pageIndex,
                pageSize: that.chrild.pageSize,
            };
            // getDict(param).then((res) => {
            // 遍历父层表格数据
            // that.tableData.forEach((temp, index) => {
            //     // 找到当前展开的行，把获取到的数据赋值进去
            //     that.tableData[index].childrenData = res.data.data.data || [];
            // });
            // });
        },

        handleDeleteItem(index, row) {
            this.$confirm("确认删除该字典项?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delDictItem(row.id)
                        .then((response) => {
                            if (response.status == 200 && response.data.code == 1000) {
                                this.$message.success("删除成功")
                                this.getList();
                            }
                        })
                        .catch(function (error) {
                            this.$message.error("删除失败");
                        });
                })
                .catch(() => {
                    // this.$message({
                    //   type: "info",
                    //   message: "已取消删除",
                    // });
                });
        },
        handleEdit(index, row) {
            //this.$router.push(`/form/dictform`).catch((error) => error);
            this.$router.push({ name: 'Dictform', params: { id: row.id, code: row.code, name: row.name, action: "修改" } }).catch((error) => error);
        },
        handleDelete(index, row) {
            this.$confirm("确认删除该字典?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delDict(row.id)
                        .then((response) => {
                            if (response.status == 200 && response.data.code == 1000) {
                                this.$message.success("删除成功")
                                this.getList();
                            }
                        })
                        .catch(function (error) {
                            this.$message.error("删除失败");
                        });
                })
                .catch(() => {
                    // this.$message({
                    //   type: "info",
                    //   message: "已取消删除",
                    // });
                });
        },
        handleAddItem(index, row) {
            this.item.drawer = true
            this.item.tempList = []
            this.item.form = {}
            this.item.form.dicId = row.id
        },
        itemFormCancel() {
            this.item.drawer = true
            this.item.tempList = []
            this.item.form = {}
            this.item.drawer = false
        },
        async itemFormAdd() {
            const valid = await this.$refs.itemForm.validate().catch((err) => {
                console.info(err);
            });
            if (valid === true) {
                this.item.tempList.push(this.item.form)
            }

        },
        async itemFormSubmit() {
            if (this.item.tempList.length == 0) {
                this.$message.error("请先添加项");
            }
            addDictItem({ items: this.item.tempList, dicId: this.item.form.dicId })
                .then((response) => {
                    if (response.status == 200 && response.data.code == 1000) {
                        this.item.drawer = false
                        this.$message.success("添加成功")
                        this.getList();
                    }
                })
                .catch(function (error) {
                    this.$message.error("添加失败");
                });

        }
    },
};
</script>
<style scoped>
.el-table th>.cell {
    padding-left: 14px;
}
</style>
