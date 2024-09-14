<template>
  <div class="app-container">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; font-size: 15px">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="" prop="menuName">
        <el-input
                  v-model="queryParams.menuName"
                  placeholder="请输入菜单名称/菜单编号"
                  clearable
                  @change="menuNameQueryChange"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
          <!-- <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          /> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" :size="btnSize" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" :size="btnSize" @click="resetQuery">重置</el-button>
        <el-button
                   type="primary"
                   plain
                   icon="el-icon-plus"
                   :size="btnSize"
                   @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
              :header-cell-style="{background:'#eee',color:'black'}"
              v-if="refreshTable"
              v-loading="loading"
              :data="menuList"
              row-key="menuId"
              :default-expand-all="isExpandAll"
              :tree-props="{ children: 'children' }">
      <el-table-column
                       type="selection"
                       width="55"
                       :selectable="selectable"></el-table-column>
      <!-- <el-table-column type="" prop="id" label="id" width="160"></el-table-column> -->
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" align="left"
                       width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <!-- <svg-icon :icon-class="scope.row.icon" /> -->
          <i slot="prefix" :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="菜单编号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="url" label="路由地址" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="menuType" label="菜单类型" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ fmtDic('MENU_TYPE', scope.row.menuType) }}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>
      <el-table-column prop="weight" label="权重" width="80"></el-table-column>
      <el-table-column prop="isDefault" label="是否默认" width="80">
        <template slot-scope="scope">
          {{ fmtDic('IS_OR_NOT', scope.row.isDefault) }}
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="是否隐藏" width="80">
        <template slot-scope="scope">
          {{ fmtDic('IS_OR_NOT', scope.row.hidden) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
                     :size="btnSize"
                     type="warning"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button
                     :size="btnSize"
                     type="success"
                     icon="el-icon-plus"
                     @click="handleAdd(scope.row)">添加</el-button>
          <el-button
                     :size="btnSize"
                     type="danger"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <!-- <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              /> -->
              <span>【{{ form.parentName }}】</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <icon-select :form="form" v-bind:icon.sync="form.icon" ref="iconSelectRef">

              </icon-select>
              <!-- <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                 <IconSelect ref="iconSelect" @selected="selected" /> 
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="isFrame">
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否外链
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item prop="url">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.url" placeholder="请输入路由地址">
                <template slot="prepend">{{ form.parentUrl }}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="url">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="menuCode">
              <el-input v-model="form.menuCode" placeholder="请输入菜单编码" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                菜单编码
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              <span slot="label">
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由参数
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="isCache">
              <span slot="label">
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否缓存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio :label="1">缓存</el-radio>
                <el-radio :label="0">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="hidden">
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
              <el-radio-group v-model="form.hidden">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="status">
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="btnSize" type="primary" @click="submitForm">确 定</el-button>
        <el-button :size="btnSize" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import iconSelect from '@/components/iconSelect'
  import { mapGetters } from 'vuex';
  import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/common/api/api";
  export default {
    name: "Menu",
    components: { iconSelect },
    data() {
      return {
        // 遮罩层
        loading: false,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        // 查询参数
        queryParams: {
          menuName: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          menuCode: [
            { required: true, message: "菜单编号不能为空", trigger: "blur" }
          ],
          menuType: [
            { required: true, message: "菜单类型不能为空", trigger: "blur" }
          ],
          menuName: [
            { required: true, message: "菜单名称不能为空", trigger: "blur" }
          ],
          sort: [
            { required: true, message: "菜单顺序不能为空", trigger: "blur" }
          ],
          url: [
            { required: true, message: "路由地址不能为空", trigger: "blur" }
          ]
        }
      };
    },
    computed: {
      ...mapGetters(['fmtDic'])
    },
    created() {
      // 获取字典项数据
      this.$store.dispatch('fetchDictionary', { items: ['IS_OR_NOT', 'MENU_TYPE'] });
      this.getList();
    },
    watch: {
      'form.icon': function (newVlaue, oldVlaue) {
      }
    },
    methods: {
      menuNameQueryChange() {
        if (this.queryParams.menuName == "") {
          this.queryParams.menuName = undefined
        }
      },
      selectable(row, index) {
        return true;
      },
      // 选择图标
      iconChange(name) {
        debugger
        this.form.icon = name;
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        listMenu(this.queryParams).then(response => {
          this.menuList = response.data.data;
          this.loading = false;
        });
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        };
      },
      /** 查询菜单下拉树结构 */
      getTreeselect() {
        listMenu({}).then(response => {
          this.menuOptions = [];
          const menu = { menuId: 0, menuName: '主类目', children: [] };
          menu.children = response.data.data;
          this.menuOptions.push(menu);
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          menuId: undefined,
          parentId: 0,
          parentName: undefined,
          parentUrl: undefined,
          menuName: undefined,
          menuCode: undefined,
          icon: undefined,
          url: undefined,
          query: undefined,
          menuType: "C",
          sort: 1,
          isFrame: 1,
          isCache: 1,
          isDefault: 0,
          hidden: 0,
          status: 1
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        this.getTreeselect();
        if (row != null && row.menuId) {
          this.form.parentId = row.menuId;
          this.form.parentName = row.menuName;
          this.form.parentUrl = row.url;
        } else {
          this.form.parentId = 0;
          this.form.parentName = "根菜单";
        }
        this.open = true;
        this.$nextTick(() => {
          this.$refs.iconSelectRef.clear();
        })
        this.title = "添加菜单";
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getTreeselect();
        getMenu(row.menuId).then(response => {
          this.form = response.data.data;
          this.form.parentUrl = response.data.data.parentUrl
          this.form.url = response.data.data.curUrl
          this.open = true;
          this.title = "修改菜单";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.parentUrl != undefined && this.form.parentUrl != "") {
              this.form.url = this.form.parentUrl + "/" + this.form.url
            }
            if (this.form.menuId != undefined) {
              updateMenu(this.form).then(response => {
                this.$message.success("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addMenu(this.form).then(
                (response) => {
                  if (response.status == 200 && response.data.code == 1000) {
                    this.$message.success("添加成功");
                    this.open = false;
                    this.getList();
                  }
                }
              );
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项？').then(function () {
          return delMenu(row.id);
        }).then(() => {
          this.getList();
          this.$message.success("删除成功");
        }).catch(() => { });
      }
    }
  };
</script>