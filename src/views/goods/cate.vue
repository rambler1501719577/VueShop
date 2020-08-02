<template>
  <div class="cate-container">
    <div class="top-btn">
      <el-button type="primary" @click="showAddClassifyDialog">新增分类</el-button>
    </div>

    <!-- 添加分类的对话框 -->
    <div class="addClassifyDialog">
      <el-dialog
        title="添加分类"
        :visible.sync="addClassifyVisiable"
        width="50%"
        @close="addDialogClose"
      >
        <!-- 添加分类的表单 -->
        <el-form
          :model="addClassifyForm"
          :rules="addClassifyFormRules"
          ref="addClassifyDialog"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="classifyName">
            <el-input v-model="addClassifyForm.classifyName"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              change-on-select
              clearable
              :disabled="this.mode == 'edit' ? true : false"
              v-model="selectedKeys"
              :options="options"
              :props="{ expandTrigger: 'hover', value: 'id', children: 'children', label: 'name' }"
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addClassifyVisiable = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">{{ this.mode == 'edit' ? '保存' : '新增' }}</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 树形表格 -->
    <div class="tree-table">
      <tree-table
        v-loading="loading"
        :data="categoryList"
        :show-row-hover="false"
        :border="true"
        :columns="columns"
        index-text="#"
        :show-index="true"
        stripe
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效模版 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color:green;font-size: 20px;" v-if="scope.row.state"></i>
          <i class="el-icon-error" style="color:red;font-size: 20px;" v-else></i>
        </template>
        <!-- 分类等级 -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.level == 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作按钮 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editClassify(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteClassify(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
    </div>
    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="4"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import '@/mock/category'
import {
    categoryList,
    parentCategoryList,
    addCategory,
    updateCategory,
    categoryDetail,
    deleteCategory,
} from '@/api/category'
import settings from '@/settings'
export default {
    name: 'cate',
    data() {
        return {
            queryParam: {
                start: 0,
                limit: 0,
            },
            categoryList: [],
            total: 0,
            // 表头
            columns: [
                {
                    label: '分类名称',
                    prop: 'name',
                },
                {
                    label: '是否有效',
                    type: 'template',
                    prop: 'state',
                    template: 'isOk',
                },
                {
                    label: '分类等级',
                    prop: 'level',
                    type: 'template',
                    template: 'level',
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'operation',
                },
            ],
            locading: true,
            addClassifyVisiable: false,
            addClassifyFormRules: {
                classifyName: [
                    {
                        required: true,
                        message: '分类名不能为空',
                        trigger: 'blur',
                    },
                ],
            },
            addClassifyForm: {
                classifyName: '',
                parentId: 0,
                level: '',
            },
            selectedKeys: [], //级联选择框的model
            mode: 'add',
            options: {},
        }
    },
    methods: {
        // 获取分类数据
        getCateList: async function () {
            this.loading = true
            const { code, data } = await categoryList(this.queryInfo)
            this.categoryList = data.records
            this.total = data.total
            this.loading = false
        },
        // 翻页
        handlePageChange: function (current) {
            this.queryParam.start = settings.defaultPageSize * (current - 1)
            this.categoryList = []
            this.getCateList()
        },
        // 展示新增分类对话框
        showAddClassifyDialog: async function () {
            this.mode = 'add'
            const { code, data: result } = await parentCategoryList({})
            if (code === 200) {
                this.options = result
            } else {
                this.$message.error('获取父级菜单失败')
            }
            this.addClassifyVisiable = true
        },
        // 新增/修改
        submitForm: async function () {
            console.log(this.addClassifyForm)
            this.$refs.addClassifyDialog.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error('参数校验失败')
                }
                if (this.mode == 'add') {
                    const { code, message } = await addCategory(
                        this.addClassifyForm
                    )
                    if (code != 200) {
                        this.$message.error('新增失败')
                    } else {
                        this.$message.success(message)
                        this.getCateList()
                    }
                } else {
                    const { code, message } = await updateCategory(
                        this.addClassifyForm
                    )
                    if (code != 200) {
                        this.$message.error('修改失败')
                    } else {
                        this.$message.success(message)
                        this.getCateList()
                    }
                }
                this.addClassifyVisiable = false
            })
        },
        // 级联选择框选中处理函数
        getParentId: function (value) {
            this.addClassifyForm.parentId = value[value.length - 1]
            this.addClassifyForm.level = value.length
        },
        // 关闭对话框清空值
        addDialogClose: function () {
            console.log('清空')
            this.$refs.addClassifyDialog.resetFields()
            this.selectedKeys = []
            this.addClassifyForm.level = 0
            this.addClassifyForm.parentId = 0
        },
        // 编辑分类
        editClassify: async function (category) {
            this.mode = 'edit'
            this.options = []
            const { code, data } = await categoryDetail({ id: category.name })
            if (code == 200) {
                this.addClassifyVisiable = true
                this.addClassifyForm.classifyName = data.classifyName
            } else {
                this.$message.error('查询分类失败')
            }
        },
        deleteClassify: async function (row) {
            this.$confirm('是否要删除当前分类', '删除提醒提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    const { code, message } = await deleteCategory({
                        username: row.name,
                    })
                    if (code === 200) {
                        this.$message.success(
                            '删除分类【' + row.name + '】成功'
                        )
                        this.categoryList = []
                        this.getCateList()
                    } else {
                        this.$message.error('删除用户失败，分类不存在')
                    }
                })
                .catch(() => {
                    this.$message.info('取消删除')
                })
        },
    },
    created() {
        this.queryParam.limit = settings.defaultPageSize
        this.getCateList()
    },
}
</script>
<style scoped lang="stylus">
.cate-container {
    .top-btn {
        margin-bottom: 15px;
    }

    .addClassifyDialog {
        .el-cascader {
            width: 100%;
        }
    }

    .pagination {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
