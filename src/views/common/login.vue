<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box"><img src="../../assets/logo.png" alt /></div>
      <el-form ref="loginFormRef" :model="user" class="login-form" status-icon :rules="loginFormRules">
        <el-form-item prop="username"><el-input v-model="user.username" prefix-icon="iconfont iconuser"></el-input></el-form-item>
        <el-form-item prop="password"><el-input type="password" v-model="user.password" prefix-icon="iconfont iconsuo"></el-input></el-form-item>
        <el-form-item class="form-btn">
          <el-button type="primary" @click="login" :disabled="loading" :loading="loading">登录</el-button>
          <el-button type="info" @click="clearField">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/mock/user';
import { login } from '@/api/user';
export default {
  name: 'login',
  data() {
    return {
      user: {
        username: 'rambler',
        password: '123456'
      },
      loading: false,
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '密码长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  components: {},
  methods: {
    clearField: function() {
      this.$refs.loginFormRef.resetFields();
    },
    login: function() {
      var _this = this;
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          _this.loading = true;
          var { code, data: user } = await login(_this.user);
          _this.loading = false;
          if (code === 200) {
            _this.$message.success('欢迎您,' + user.username);
            sessionStorage.setItem('token', JSON.stringify(user));
            _this.$router.push('/home');
          } else {
            _this.$message.error('登录失败');
          }
        } else {
          this.$message.error('请检查用户名和密码');
        }
      });
    }
  },
  created() {}
};
</script>

<style scoped="scoped" lang="stylus">
.login-container
  background #2b4b6b
  height 100%
  .login-box
    width 450px
    height 300px
    background #fff
    border-radius 3px
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    .avatar-box
      background-color #fff
      width 130px
      height 130px
      border 1px solid #eee
      border-radius 50%
      padding 10px
      box-shadow 0 0 5px #eee
      position absolute
      left 50%
      top 0
      transform translate(-50%, -50%)
      img
        width 100%
        height 100%
        border-radius 50%
        background-color #eee
    .login-form
      position absolute
      bottom 0
      width 100%
      box-sizing border-box
      padding 15px
      .form-btn
        display flex
        justify-content flex-end
</style>
