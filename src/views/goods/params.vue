<template>
  <div class="params-container">
    <el-alert title="注意:只允许修改三级分类的相关参数" type="warning" :closable="false" show-icon></el-alert>
    <el-row class="cals">
      <el-col>
        <span>选择商品分类:</span>
        <el-cascader
          clearable
          v-model="selectedKeys"
          :options="categoryList"
          :props="{ expandTrigger: 'hover', value: 'name', children: 'children', label: 'name' }"
          @change="getParentId"
        ></el-cascader>
      </el-col>
    </el-row>
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" @tab-click="tabChange">
      <el-tab-pane label="动态属性" name="dynamic">
        <el-button
          type="primary"
          :disabled="isBtnDisabled"
          @click="dialogVisible = true;mode='add'"
        >添加属性</el-button>
        <el-table :data="dynamicTableData" stripe border>
          <!-- 动态标签页 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                @close="removeTag(scope,item)"
                closable
                v-for="(item,index) of scope.row.value"
                :key="index"
              >{{item}}</el-tag>
              <!-- 动态可编辑tag -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.visible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(scope)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="name" label="属性名"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editParam(scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteParam(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 静态标签页 -->
      <el-tab-pane label="静态参数" name="static">
        <el-button
          type="primary"
          :disabled="isBtnDisabled"
          @click="dialogVisible = true;mode='add'"
        >添加参数</el-button>
        <el-table :data="staticTableData" stripe border>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                closable
                @close="removeTag(scope,item)"
                v-for="(item,index) of scope.row.value"
                :key="index"
              >{{item}}</el-tag>
              <!-- 动态可编辑tag -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.visible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(scope)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="name" label="属性名"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editParam(scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteParam(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加分类的对话框 -->
    <div class="addClassifyDialog">
      <el-dialog
        :title="activeTab=='dynamic'?'添加动态属性':'添加静态属性'"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClose"
      >
        <el-form :model="paramForm" :rules="paramFormRules" ref="paramFormRef" label-width="80px">
          <el-form-item :label="activeTab=='dynamic'?'动态参数':'静态参数'" prop="name">
            <el-input v-model="paramForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">{{ this.mode == 'edit' ? '保存' : '新增' }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import '@/mock/category'
import {
    categoryList,
    classifyParam,
    addCategory,
    updateCategory,
    categoryDetail,
    deleteCategory,
    removeClassifyTag,
    addCategoryTag,
} from '@/api/category'
import settings from '@/settings'
export default {
    name: 'cate',
    data() {
        return {
            inputVisible: false,
            inputValue: '', // 新标签内容
            activeTab: 'dynamic', // 当前选中的tab
            categoryList: [],
            dialogVisible: false,
            rules: {
                classifyName: [
                    {
                        required: true,
                        message: '分类名不能为空',
                        trigger: 'blur',
                    },
                ],
            },
            selectedKeys: [], //级联选择框的model
            mode: 'add',
            category: '',
            dynamicTableData: [], // 动态属性
            staticTableData: [], //静态参数
            paramForm: {
                name: '',
            },
            paramFormRules: {
                name: [
                    {
                        required: true,
                        message: '参数名不能为空',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    computed: {
        isBtnDisabled: function () {
            return this.category === ''
        },
    },
    methods: {
        // 显示新标签文本输入框
        showInput: function (scope) {
            scope.row.visible = true
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        // 确认新标签输入
        handleInputConfirm: async function (scope) {
            scope.row.visible = false
            if (scope.row.inputValue.trim() != '') {
                const { code } = await addCategoryTag({
                    name: scope.row.inputValue,
                })
                if (code === 200) {
                    scope.row.value.push(scope.row.inputValue)
                    scope.row.inputValue = ''
                    this.$message.success('新增标签成功')
                } else {
                    this.$message.error('新增标签失败')
                }
            } else {
                return
            }
        },
        // 切换tab栏
        tabChange: function () {
            if (this.category != '') this.getCategoryParam()
            else {
                if (this.activeTab == 'dynamic') this.dynamicTableData = []
                else this.staticTableData = []
            }
        },
        // 获取分类数据
        getCateList: async function () {
            const { code, data } = await categoryList()
            this.categoryList = data.records
        },
        // 新增/修改
        submitForm: async function () {
            this.$refs.paramFormRef.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error('参数校验失败')
                }
                if (this.mode == 'add') {
                    const { code } = await addCategory({ ...this.paramForm })
                    if (code === 200) {
                        this.$message.success('新增属性成功')
                        this.getCategoryParam()
                    } else {
                        this.$message.error('新增属性失败')
                    }
                } else {
                    const { code } = await updateCategory({
                        ...this.paramForm,
                    })
                    if (code === 200) {
                        this.$message.success('修改分类成功')
                        this.getCategoryParam()
                    } else {
                        this.$message.error('修改失败')
                    }
                }
                this.dialogVisible = false
            })
        },
        //获取分类下静态或者动态参数
        getCategoryParam: async function () {
            if (this.category == '') {
                return this.$message.error('没有选择具体分类')
            }
            const params = {
                type: this.activeTab,
                id: this.category,
            }
            const { code, message, data } = await classifyParam(params)
            if (code === 200) {
                data.forEach((item) => {
                    item.inputValue = ''
                    item.visible = false
                })
                if (this.activeTab == 'dynamic') this.dynamicTableData = data
                else this.staticTableData = data
            } else {
                this.$message.error('获取分类参数失败')
            }
        },
        // 级联选择框选中处理函数
        getParentId: function (value) {
            if (value != null && value.length > 0) {
                this.category = value[value.length - 1]
                this.getCategoryParam()
            } else {
                this.category = ''
                if (this.activeTab == 'dynamic') this.dynamicTableData = []
                else this.staticTableData = []
            }
        },
        // 关闭对话框清空值
        dialogClose: function () {
            this.paramForm = {}
            this.$refs.paramFormRef.resetFields()
        },
        // 编辑分类
        editParam: function (param) {
            this.paramForm = param
            this.dialogVisible = true
            this.mode = 'edit'
        },
        // 删除标签
        removeTag: async function (scope, item) {
            //
            this.$confirm('是否要删除当前标签', '删除提醒提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    const { code } = await removeClassifyTag({ ...scope.row })
                    if (code === 200) {
                        this.$message.success('删除成功')
                        // 重新为scope赋值,实现前端效果
                        scope.row.value.splice(scope.row.value.indexOf(item), 1)
                    } else {
                        this.$message.error('删除失败')
                    }
                })
                .catch(() => {
                    this.$message.info('取消删除')
                })
        },
        // 删除参数
        deleteParam: async function (row) {
            this.$confirm('是否要删除当前分类', '删除提醒提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    const { code } = await deleteCategory({ ...row })
                    if (code === 200) {
                        this.$message.success('删除成功')
                        this.getCategoryParam()
                    } else {
                        this.$message.error('删除失败')
                    }
                })
                .catch(() => {
                    this.$message.info('取消删除')
                })
        },
    },
    created() {
        this.getCateList()
    },
}
</script>
<style scoped lang="stylus">
.params-container {
    .cals {
        margin-top: 15px;
    }

    .el-tabs {
        .el-tab-pane {
            .el-button {
                margin-bottom: 15px;
            }

            .el-tag {
                margin-right: 15px;
            }

            .input-new-tag {
                width: 120px;
            }
        }
    }
}
</style>
