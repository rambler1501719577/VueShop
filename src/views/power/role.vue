<template>
  <div class="role-container">
    <el-button class="add-btn" type="primary" @click="handleAddEvent">添加角色</el-button>

    <!-- 新增/修改对话框 -->
    <div class="add-update-dialog">
      <el-dialog title="添加用户" :visible.sync="dialogViaiable" width="50%" @close="clearForm">
        <!-- 添加用户的表单 -->
        <el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="90px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="roleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogViaiable = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 分配权限对话框 -->
    <div class="permission-dialog">
      <el-dialog title="分配权限" :visible.sync="setPermissionDialogVisible" width="50%">
        <!-- 权限树 -->
        <div class="tree-container">
          <el-tree
            ref="permissionTree"
            show-checkbox
            :data="treePermission"
            :props="defaultProps"
            :default-checked-keys="rolePermission"
            node-key="id"
            default-expand-all
          ></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setPermissionDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRolePermission">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="roleList"
      style="width: 100%"
      border
      stripe
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 第一列 -->
          <el-row
            :class="['first-row','border-bottom']"
            v-for="(item,index) of scope.row.children"
            :key="index"
          >
            <el-col :span="5">
              <el-tag closable @close="removeSingleRight(scope.row,item)">{{item.name}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="16">
              <!-- 第二列 -->
              <el-row
                v-for="(subChild,subIndex) of item.children"
                :class="['second-row',subIndex == 0?'':'border-top']"
                :key="subIndex"
              >
                <el-col :span="8">
                  <el-tag
                    closable
                    @close="removeSingleRight(scope.row,subChild)"
                    type="success"
                  >{{subChild.name}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="16">
                  <el-tag
                    closable
                    type="warning"
                    v-for="(lastChild,lastIndex) of subChild.children"
                    :key="lastIndex"
                    @close="removeSingleRight(scope.row,lastChild)"
                  >{{lastChild.name}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <!-- 渲染标签 -->
      <el-table-column align="center" prop="level" label="权限等级" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteEvent(scope.row)"
          >删除</el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-setting"
            @click="openSetPermissionDialog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getRoleData,
  roleDetail,
  deleteRole,
  deleteRightById,
  saveRole,
  updateRolePermission,
  updateRole,
  getTreePermission,
} from '@/api/role'
import settings from '@/settings'
import '@/mock/role'
export default {
  name: 'role',
  data() {
    return {
      loading: false,
      roleList: [],
      rolePermission: [], // 权限树展开时默认选中的权限
      roleForm: {
        roleName: '',
        roleDesc: '',
      },
      dialogViaiable: false, //增改表单对话框
      setPermissionDialogVisible: false, //分配权限对话框
      mode: 'add', //标识是新增还是修改
      currentRole: '',
      roleFormRules: {
        roleName: [
          {
            required: true,
            message: '角色名不能为空',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          {
            required: true,
            message: '角色描述不能为空',
            trigger: 'blur',
          },
        ],
      },
      // 权限树形数据
      treePermission: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  components: {},
  created() {
    this.getRoleList()
    this.getTreeData()
  },
  methods: {
    // 保存角色分配的权限
    saveRolePermission: async function () {
      const selected = this.$refs.permissionTree.getCheckedNodes()
      const leafChildren = selected.filter((item) => {
        return item.isLeaf
      })
      let ids = ''
      let nameArr = ''
      leafChildren.forEach((item, index, arr) => {
        ids = ids + item.id + ','
        nameArr = nameArr + '【' + item.label + '】'
      })
      const { code, message } = await updateRolePermission({ ids: ids })
      if (code === 200) {
        this.$message.success(
          '【' + this.currentRole + '】分配的权限为:' + nameArr
        )
      } else {
        this.$message.error('更新权限失败')
      }
      this.setPermissionDialogVisible = false
    },
    openSetPermissionDialog: async function (role) {
      this.currentRole = role.roleName
      const { data } = await roleDetail({})
      this.rolePermission = data.permissionList
      this.setPermissionDialogVisible = true
    },
    // 获取权限树形结构数据
    getTreeData: async function () {
      const { code, data } = await getTreePermission({})
      if (code === 200) {
        this.treePermission = data
      } else {
        this.$message.error('获取权限树数据错误')
      }
    },

    // 获取用户角色列表
    getRoleList: async function () {
      const { code, data: result } = await getRoleData()
      this.roleList = result
    },
    // 添加角色点击事件
    handleAddEvent: function () {
      this.mode = 'add'
      this.dialogViaiable = true
    },
    // 关闭对话框后清空表单
    clearForm: function () {
      this.$refs.roleFormRef.resetFields()
    },
    // 编辑事件
    edit: async function (role) {
      this.mode = 'edit'
      const { code, data } = await roleDetail(role.roleName)
      if (code === 200) {
        this.roleForm = data
        this.dialogViaiable = true
      } else {
        this.$message.error('获取角色失败')
      }
    },
    deleteEvent: function (role) {
      const { roleName } = role
      const alertMessage = '是否删除角色【' + roleName + '】?'
      this.$confirm(alertMessage, '删除提醒提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { code, message } = await deleteRole({ roleName: roleName })
          if (code === 200) {
            this.$message.success(message)
            this.roleList = []
            this.getRoleList()
          } else {
            this.$message.error('删除用户失败，角色不存在')
          }
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    // 移除单个权限
    removeSingleRight: function (role, permission) {
      this.$confirm('是否要删除当前权限', '删除提醒提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { code, message } = await deleteRightById({
            permissionName: permission.name,
          })
          if (code === 200) {
            this.$message.success('取消【' + permission.name + '】权限成功')
          } else {
            this.$message.error('删除用户失败，角色不存在')
          }
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    // 提交表单
    submitForm: function () {
      this.$refs.roleFormRef.validate(async (valid) => {
        if (valid) {
          if (this.mode === 'add') {
            const { code, message } = await saveRole(this.roleForm)
            if (code === 200) {
              this.$message.success(message)

              this.getRoleList()
            } else {
              this.$message.error('新增角色失败')
            }
          } else {
            const { code, message } = await updateRole(this.roleForm)
            if (code === 200) {
              this.$message.success(message)
              this.getRoleList()
            } else {
              this.$message.error('更新角色失败')
            }
          }
          // 最后都要关闭对话框
          this.dialogViaiable = false
        }
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.role-container {
  .add-btn {
    margin-bottom: 15px;
  }

  // 新增修改对话框样式
  .add-update-dialog {
  }

  // 分配权限对话框
  .permission-dialog {
    .el-dialog {
      margin-top: 0 !important;
    }

    .tree-container {
      height: calc(100vh - 15vh - 50px - 54px - 70px - 60px);
      overflow-y: auto;
    }
  }

  .first-row {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .second-row {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-around;
    align-items: center;
    padding-top: 10px;
  }

  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .border-top {
    border-top: 1px solid #eee;
  }

  .border-bottom {
    border-bottom: 1px solid #eee;
  }

  .permission-dialog {
    overflow-y: auto !important;
  }
}
</style>
