<template>
    <div class="query-list">
        <!-- 面包屑插槽 -->
        <div class="breadcrumb">
            <slot name="breadcrumb"></slot>
        </div>

        <!-- 按钮组插槽 -->
        <div class="button-group"><slot name="buttonList"></slot></div>

        <!-- 搜索区域插槽 -->
        <slot name="searchArea">
            <!-- 默认搜索区域 -->
            <div v-if="showSearch" class="search-area">
                <el-input
                    v-model="searchParams.keyword"
                    clearable
                    :placeholder="searchPlaceholder"
                    size="small"
                    style="width: 200px"
                    class="filter-item"
                    @keyup.enter.native="handleSearch"
                />
                <el-button
                    class="filter-item"
                    icon="el-icon-search"
                    :size="btnSize"
                    @click="handleSearch"
                >
                    搜索
                </el-button>
                <el-button
                    class="filter-item"
                    icon="el-icon-refresh"
                    :size="btnSize"
                    @click="handleReset"
                >
                    重置
                </el-button>
            </div>
        </slot>

        <!-- 表格区域 -->
        <div class="table-container">
            <slot name="dataList" :data="tableData" :loading="listLoading">
                <!-- 默认表格 -->
                <el-table
                    ref="mainTable"
                    v-loading="listLoading"
                    :data="tableData"
                    :header-cell-style="{ background: '#eee', color: 'black' }"
                    highlight-current-row
                    style="width: 100%"
                    @sort-change="handleSortChange"
                    :row-key="getRowKeys"
                    @selection-change="handleSelectionChange"
                    :fit="true"
                >
                    <!-- 选择列 -->
                    <el-table-column
                        v-if="showSelection"
                        type="selection"
                        width="55"
                    ></el-table-column>

                    <!-- 序号列 -->
                    <el-table-column
                        v-if="showIndex"
                        type="index"
                        label="序号"
                        width="60"
                        align="center"
                    ></el-table-column>

                    <!-- 展开列 -->
                    <el-table-column v-if="showExpand" type="expand" width="60">
                        <template slot-scope="props">
                            <slot name="expandContent" :row="props.row">
                                <!-- 默认展开内容 -->
                                <div v-if="props.row.children && props.row.children.length > 0">
                                    <el-table
                                        :data="props.row.children"
                                        :row-key="getRowKeys"
                                        border
                                        size="mini"
                                        style="width: 100%"
                                    >
                                        <el-table-column
                                            v-for="col in childColumns"
                                            :key="col.prop"
                                            :prop="col.prop"
                                            :label="col.label"
                                            :min-width="col.minWidth || getAutoWidth(col.label)"
                                            :formatter="col.formatter"
                                        >
                                            <template slot-scope="scope">
                                                <!-- 支持子列模板 -->
                                                <template v-if="col.template">
                                                    <slot
                                                        :name="col.template"
                                                        :row="scope.row"
                                                        :index="scope.$index"
                                                    ></slot>
                                                </template>
                                                <template v-else-if="col.formatter">
                                                    {{ col.formatter(scope.row, col) }}
                                                </template>
                                                <template v-else>
                                                    {{ scope.row[col.prop] }}
                                                </template>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            v-if="childOperations && childOperations.length > 0"
                                            label="操作"
                                            :min-width="
                                                getAutoWidth('操作', childOperations.length)
                                            "
                                            fixed="right"
                                        >
                                            <template slot-scope="scope">
                                                <el-button
                                                    v-for="op in childOperations"
                                                    :key="op.name"
                                                    :size="btnSize"
                                                    :type="op.type || 'primary'"
                                                    :icon="op.icon"
                                                    @click="
                                                        handleChildOperation(
                                                            op.name,
                                                            scope.row,
                                                            props.row,
                                                        )
                                                    "
                                                >
                                                    {{ op.label }}
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div v-else class="empty-expand">
                                    暂无数据
                                </div>
                            </slot>
                        </template>
                    </el-table-column>

                    <!-- 动态列 -->
                    <el-table-column
                        v-for="column in processedColumns"
                        :key="column.prop || column.label"
                        :prop="column.prop"
                        :label="column.label"
                        :min-width="getColumnMinWidth(column)"
                        :sortable="column.sortable || false"
                        :align="column.align || 'left'"
                        :fixed="column.fixed"
                        :show-overflow-tooltip="column.tooltip !== false"
                    >
                        <template slot-scope="scope">
                            <!-- 模板内容 - 最高优先级 -->
                            <template v-if="column.template">
                                <slot
                                    :name="column.template"
                                    :row="scope.row"
                                    :index="scope.$index"
                                    :column="column"
                                ></slot>
                            </template>

                            <!-- 自定义渲染函数 -->
                            <template v-else-if="column.render">
                                <div v-html="column.render(scope.row, scope.$index)"></div>
                            </template>

                            <!-- 自定义列内容插槽 -->
                            <slot
                                v-else-if="column.slot"
                                :name="column.slot"
                                :row="scope.row"
                                :index="scope.$index"
                            ></slot>
                            <!-- 字典显示 -->
                            <template v-else-if="column.dictName">
                                {{ safeFmtDic(column.dictName, scope.row[column.prop]) }}
                            </template>
                            <!-- 格式化显示 -->
                            <template v-else-if="column.formatter">
                                {{ column.formatter(scope.row, column) }}
                            </template>

                            <!-- 标签显示 -->
                            <template v-else-if="column.tag">
                                <el-tag
                                    :type="getTagType(scope.row[column.prop], column.tagTypeMap)"
                                    :size="column.tagSize || 'medium'"
                                    :effect="column.tagEffect || 'light'"
                                >
                                    {{ getTagText(scope.row[column.prop], column.tagMap) }}
                                </el-tag>
                            </template>

                            <!-- 链接显示 -->
                            <template v-else-if="column.link">
                                <el-link
                                    :type="column.linkType || 'primary'"
                                    :underline="column.underline !== false"
                                    @click="handleLinkClick(column, scope.row)"
                                >
                                    {{ scope.row[column.prop] }}
                                </el-link>
                            </template>

                            <!-- 图片显示 -->
                            <template v-else-if="column.image">
                                <el-image
                                    style="width: 50px; height: 50px"
                                    :src="scope.row[column.prop]"
                                    :preview-src-list="[scope.row[column.prop]]"
                                    fit="cover"
                                ></el-image>
                            </template>

                            <!-- 默认显示 -->
                            <template v-else>
                                {{ scope.row[column.prop] }}
                            </template>
                        </template>
                    </el-table-column>

                    <!-- 操作列 -->
                    <el-table-column
                        v-if="operations && operations.length > 0"
                        label="操作"
                        :min-width="getAutoWidth('操作', operations.length)"
                        :fixed="operationFixed"
                    >
                        <template slot-scope="scope">
                            <el-button
                                v-for="op in operations"
                                :key="op.name"
                                :size="btnSize"
                                :type="op.type || 'primary'"
                                :icon="op.icon"
                                :disabled="op.disabled && op.disabled(scope.row)"
                                @click="handleOperation(op.name, scope.row, scope.$index)"
                            >
                                {{ op.label }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </slot>
        </div>

        <!-- 分页区域 -->
        <div v-if="showPagination" class="pagination-container">
            <el-pagination
                background
                :page-sizes="paginationConfig.pageSizes"
                :page-size="pagination.pageSize"
                :total="pagination.total"
                :current-page="pagination.pageIndex"
                :layout="paginationConfig.layout"
                @current-change="handlePageChange"
                @size-change="handleSizeChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'QueryList',
    props: {
        // 列配置
        columns: {
            type: Array,
            default: () => [],
        },
        // 操作按钮配置
        operations: {
            type: Array,
            default: () => [],
        },
        // 子表格列配置
        childColumns: {
            type: Array,
            default: () => [],
        },
        // 子表格操作按钮
        childOperations: {
            type: Array,
            default: () => [],
        },
        // 接口地址或接口函数
        api: {
            type: [String, Function],
            required: true,
        },
        // 搜索参数
        searchParams: {
            type: Object,
            default: () => ({}),
        },
        // 是否显示搜索区域
        showSearch: {
            type: Boolean,
            default: true,
        },
        // 搜索框占位符
        searchPlaceholder: {
            type: String,
            default: '请输入关键词',
        },
        // 是否显示分页
        showPagination: {
            type: Boolean,
            default: true,
        },
        // 是否显示选择列
        showSelection: {
            type: Boolean,
            default: false,
        },
        // 是否显示序号列
        showIndex: {
            type: Boolean,
            default: false,
        },
        // 是否显示展开列
        showExpand: {
            type: Boolean,
            default: false,
        },
        // 操作列是否固定
        operationFixed: {
            type: [String, Boolean],
            default: 'right',
        },
        // 分页配置
        paginationConfig: {
            type: Object,
            default: () => ({
                pageSizes: [10, 20, 50, 100],
                layout: 'total, sizes, prev, pager, next, jumper',
            }),
        },
        // 数据转换函数
        dataTransform: {
            type: Function,
            default: null,
        },
        // 是否自动加载
        autoLoad: {
            type: Boolean,
            default: true,
        },
        // 列宽配置
        columnWidthConfig: {
            type: Object,
            default: () => ({
                baseWidth: 100, // 基础宽度
                charWidth: 14, // 每个字符宽度
                buttonWidth: 80, // 每个按钮宽度
                minOperationWidth: 120, // 操作列最小宽度
            }),
        },
    },
    data() {
        return {
            // 加载状态
            listLoading: false,
            // 表格数据
            tableData: [],
            // 选中行数据
            selectedRows: [],
            // 分页数据
            pagination: {
                pageIndex: 1,
                pageSize: 10,
                total: 0,
            },
            // 内部搜索参数
            internalSearchParams: {
                keyword: '',
                ...this.searchParams,
            },
        };
    },
    computed: {
        ...mapGetters(['fmtDic']),
        // btnSize() {
        //     return this.$store?.state?.app?.btnSize || 'small';
        // },
        // 处理后的列配置
        processedColumns() {
            return this.columns.map((column) => {
                return {
                    align: 'left',
                    sortable: false,
                    tooltip: true,
                    ...column,
                };
            });
        },
    },
    watch: {
        searchParams: {
            deep: true,
            handler(newVal) {
                this.internalSearchParams = { ...this.internalSearchParams, ...newVal };
            },
        },
    },
    mounted() {
        if (this.autoLoad) {
            this.loadData();
        }
        // 加载需要的字典
        this.loadRequiredDicts();
    },
    methods: {
        loadRequiredDicts() {
            // 从列配置中提取需要的字典
            const requiredDicts = this.columns
                .filter((col) => col.dictName)
                .map((col) => col.dictName);

            if (requiredDicts.length > 0) {
                this.$store.dispatch('fetchDictionary', {
                    items: [...new Set(requiredDicts)], // 去重
                });
            }
        },

        // 安全的字典转换方法
        safeFmtDic(code, key) {
            try {
                return this.fmtDic(code, key);
            } catch (error) {
                console.error('字典转换失败:', error);
                return key;
            }
        },
        // 获取列的最小宽度
        getColumnMinWidth(column) {
            if (column.minWidth) return column.minWidth;
            if (column.width) return column.width;

            // 自动计算宽度
            return this.getAutoWidth(column.label, column.buttonsCount);
        },

        // 自动计算宽度
        getAutoWidth(label, buttonsCount = 0) {
            const config = this.columnWidthConfig;

            if (buttonsCount > 0) {
                // 操作列宽度计算
                return Math.max(config.minOperationWidth, buttonsCount * config.buttonWidth);
            }

            // 普通列宽度计算
            const charCount = label ? label.length : 8;
            return Math.max(config.baseWidth, charCount * config.charWidth);
        },

        // 加载数据
        async loadData() {
            this.listLoading = true;
            try {
                const params = {
                    pageIndex: this.pagination.pageIndex,
                    pageSize: this.pagination.pageSize,
                    ...this.internalSearchParams,
                };

                let response;
                if (typeof this.api === 'function') {
                    response = await this.api(params);
                } else {
                    // 如果是字符串，使用动态导入
                    const apiModule = await import('@/common/api/api');
                    response = await apiModule[this.api](params);
                }

                // 处理响应数据
                let result = response.data.data;
                if (this.dataTransform) {
                    result = this.dataTransform(result);
                }

                this.tableData = result.data || result.list || [];
                this.pagination.total = result.total || result.count || 0;

                this.$emit('load-success', {
                    data: this.tableData,
                    total: this.pagination.total,
                });
            } catch (error) {
                console.error('加载数据失败:', error);
                this.$emit('load-error', error);
                this.$message.error('数据加载失败');
            } finally {
                this.listLoading = false;
            }
        },

        // 刷新数据
        refresh() {
            this.pagination.pageIndex = 1;
            this.loadData();
        },

        // 搜索
        handleSearch() {
            this.refresh();
        },

        // 重置
        handleReset() {
            this.internalSearchParams.keyword = '';
            this.pagination.pageIndex = 1;
            this.loadData();
        },

        // 分页变化
        handlePageChange(page) {
            this.pagination.pageIndex = page;
            this.loadData();
        },

        // 分页大小变化
        handleSizeChange(size) {
            this.pagination.pageSize = size;
            this.pagination.pageIndex = 1;
            this.loadData();
        },

        // 排序变化
        handleSortChange(sort) {
            this.$emit('sort-change', sort);
        },

        // 选择变化
        handleSelectionChange(selection) {
            this.selectedRows = selection;
            this.$emit('selection-change', selection);
        },

        // 操作按钮点击
        handleOperation(operationName, row, index) {
            this.$emit('operation-click', operationName, row, index);
        },

        // 子表格操作按钮点击
        handleChildOperation(operationName, childRow, parentRow) {
            this.$emit('child-operation-click', operationName, childRow, parentRow);
        },

        // 链接点击
        handleLinkClick(column, row) {
            this.$emit('link-click', column, row);
        },

        // 获取行key
        getRowKeys(row) {
            return row.id ? row.id.toString() : JSON.stringify(row);
        },

        // 获取标签类型
        getTagType(value, typeMap = {}) {
            return typeMap[value] || 'primary';
        },

        // 获取标签文本
        getTagText(value, tagMap = {}) {
            return tagMap[value] || value;
        },

        // 获取选中行
        getSelectedRows() {
            return this.selectedRows;
        },

        // 设置搜索参数
        setSearchParams(params) {
            this.internalSearchParams = { ...this.internalSearchParams, ...params };
        },

        // 清空选中
        clearSelection() {
            this.$refs.mainTable?.clearSelection();
        },

        // 重新计算表格布局
        doLayout() {
            this.$refs.mainTable?.doLayout();
        },
    },
};
</script>

<style scoped>
.query-list {
    padding: 18px;
    background: #fff;
    border-radius: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.breadcrumb {
    margin-bottom: 18px;
}
.search-area {
    margin: 18px 0; /* 上下18px，左右0 */
    flex-shrink: 0;
}

.table-container {
    flex: 1;
    margin-bottom: 18px;
    min-height: 0; /* 重要：防止表格溢出 */
}

.pagination-container {
    flex-shrink: 0;
    text-align: right;
    padding: 18px 0;
}

.empty-expand {
    padding: 18px;
    text-align: center;
    color: #999;
}

/* 确保表格占满容器 */
::v-deep .el-table {
    width: 100% !important;
}

::v-deep .el-table__body-wrapper,
::v-deep .el-table__header-wrapper {
    width: 100% !important;
}

::v-deep .el-table th > .cell {
    padding-left: 14px;
    white-space: nowrap;
}

/* 响应式表格 */
@media (max-width: 768px) {
    .query-list {
        padding: 10px;
    }

    .search-area {
        flex-direction: column;
        gap: 10px;
    }

    .search-area .filter-item {
        width: 100% !important;
    }
}
/* 按钮组 - 操作按钮在一行 */
.button-group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

/* 确保按钮不换行 */
.button-group .el-button {
    flex-shrink: 0;
    white-space: nowrap;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .search-row {
        gap: 8px;
    }

    .button-group {
        gap: 8px;
    }

    .search-row .filter-item,
    .button-group .el-button {
        flex: 1;
        min-width: auto;
    }
}
</style>
