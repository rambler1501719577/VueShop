<template>
  <div class="user-container">
    <!-- 搜索栏 + 添加按钮 -->
    <el-row :gutter="15" class="operate-box">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryParam.keyword" clearable @clear="resetSearch">
          <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="addDialogVisiable = true;mode = 'add'">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisiable" width="50%" @close="clearForm">
      <!-- 添加用户的表单 -->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" :disabled="mode=='edit'?true:false"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <div class="set-role-dialog">
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="clearForm">
        <div class="box">
          <p>当前用户：{{userInfo.username}}</p>
          <p>当前用户的角色为：{{userInfo.roleName}}</p>
          <p>
            分配新角色:
            <el-select size="mini" v-model="userRole" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.roleName"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setUserRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="userList" style="width: 100%" border stripe>
      <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="roleName" label="角色名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="ip" label="IP" width="150"></el-table-column>
      <el-table-column align="center" prop="state" label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#ccc"
            @change="changeUserState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190" align="center">
        <template slot-scope="scope">
          <el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUser(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip :enterable="false" effect="dark" content="分配权限" placement="top">
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-s-tools"
              @click="setRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="15"
        hide-on-single-page
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import '@/mock/user'
import {
  userList,
  updateUser,
  saveUser,
  userDetail,
  deleteUser,
} from '@/api/user'
import '@/mock/role'
import { getRoleData } from '@/api/role'
export default {
  name: 'users',
  data() {
    // 手机号验证器
    var mobileValidator = (rule, mobile, callback) => {
      if (mobile == '') {
        callback(new Error('电话不能为空'))
      }
      if (!/^1[3456789]\d{9}$/.test(mobile)) {
        callback(new Error('电话格式错误'))
      }
      callback()
    }
    // 邮箱验证器
    var emailValidator = (rule, email, callback) => {
      if (email == '') {
        callback(new Error('邮箱不能为空'))
      }
      if (
        !/^([a-zA-Z0-9_-]){1}\.([a-zA-Z0-9_-])+@[a-zA-Z0-9_-]+\.(\w){2,10}$/.test(
          email
        )
      ) {
        callback(new Error('邮箱格式错误'))
      }
      callback()
    }
    return {
      userList: [],
      roleList: [], //所有角色列表
      total: 0,
      queryParam: {
        keyword: '',
        start: 0,
        limit: 0,
      }, //查询参数
      mode: 'edit', //当前操作模式,新增为add,修改为edit
      userInfo: {}, //正在分配权限的用户信息
      userRole: '', //用户即将分配的角色
      loading: false,
      addDialogVisiable: false,
      addUserForm: {
        username: '',
        password: '',
        mobile: '',
        email: '',
      },
      setRoleDialogVisible: false, //分配角色对话框
      addUserFormRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '用户名不能为空',
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空',
          },
          {
            max: 15,
            min: 6,
            trigger: 'blur',
            message: '密码长度为6-15',
          },
        ],
        mobile: [
          {
            validator: mobileValidator,
            trigger: 'blur',
          },
        ],
        email: [
          {
            validator: emailValidator,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  components: {},
  created() {
    this.queryParam.limit = settings.defaultPageSize
    this.getUsers()
  },
  methods: {
    // 获取用户列表
    getUsers: async function () {
      this.loading = true
      const { code, data } = await userList(this.queryParam)
      this.loading = false
      const { start, limit, keyword } = this.queryParam
      if (keyword != '') {
        let message = '获取第 ' + (start + limit) / limit + ' 页数据成功'
        message += ',关键字为' + keyword
        this.$message.success(message)
      }
      this.userList = data.records
      this.total = data.total
    },
    // 翻页功能
    handlePageChange: function (current) {
      this.queryParam.start = settings.defaultPageSize * (current - 1)
      this.getUsers()
    },
    // 搜索功能
    searchUsers: function () {
      this.queryParam.start = 0
      this.getUsers()
    },
    // 更改用户状态
    changeUserState: async function (newUserValue) {
      this.loading = true
      const { code } = await updateUser(newUserValue)
      this.loading = false
      if (code === 200) {
        this.$message.success('更新用户成功')
      } else {
        newUserValue.state = !newUserValue.state
        this.$message.error('更新用户失败')
      }
    },
    // 重置搜索功能
    resetSearch: function () {
      this.queryParam.start = 0
      this.getUsers()
    },
    // 清空增加用户表单
    clearForm: function () {
      this.$refs.addUserFormRef.resetFields()
      this.addUserForm = {}
    },
    // 提交表单
    submitForm: function () {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return
        // 验证通过
        if (this.mode == 'add') {
          const { code, message } = await saveUser(this.addUserForm)
          if (code === 200) {
            this.$message.success(message)
            this.getUsers()
          } else {
            this.$message.error('新增用户失败')
          }
        } else {
          const { code } = await updateUser(this.addUserForm)
          if (code === 200) {
            this.$message.success('更新用户成功')
            this.getUsers()
          } else {
            this.$message.error('更新用户失败')
          }
        }
        this.$refs.addUserFormRef.resetFields()
        this.addDialogVisiable = false
      })
    },
    // 修改用户
    edit: async function (row) {
      // 切换到edit模式
      this.mode = 'edit'
      const { username } = row
      const { code, data } = await userDetail({ username: username })
      if (code === 200) {
        this.addUserForm = data
        this.addUserForm.username = username
        this.addDialogVisiable = true
      } else {
        this.$message.error('获取用户信息失败')
      }
    },
    // 删除用户
    deleteUser: function (user) {
      const { username } = user
      const alertMessage = '是否删除用户【' + username + '】?'
      this.$confirm(alertMessage, '删除提醒提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { code, message } = await deleteUser({ username: username })
          if (code === 200) {
            this.$message.success(message)
            this.getUsers()
          } else {
            this.$message.error('删除用户失败，用户不存在')
          }
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    // 展示分配角色对话框
    setRole: async function (userInfo) {
      const { code, data } = await getRoleData({})
      if (code === 200) {
        this.roleList = data
        this.setRoleDialogVisible = true
        this.userInfo = userInfo
      } else {
        this.$message.error('获取角色列表失败')
      }
    },
    setUserRole: async function () {
      const { code, data } = await updateUser({ role: this.userRole })
      if (code === 200) {
        this.$message.success(
          '成功将【' + this.userInfo.username + '】角色设置为：' + this.userRole
        )
        this.getUsers()
      } else {
        this.$message.error('更新失败')
      }
      this.setRoleDialogVisible = false
    },
  },
}
</script>

<style lang="stylus" scoped>
.user-container {
  .operate-box {
    margin-bottom: 15px;
  }

  .set-role-dialog {
    .box>p {
      margin: 0 0 15px 0;
      padding: 0;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
}
</style>
