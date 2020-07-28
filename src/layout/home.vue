<template>
  <div class="home-container" ref="home_container">
    <el-container>
      <el-header>
        <div>
          <span>Rambler商城管理系统</span>
        </div>
        <el-button type="primary" class="logout-btn" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <aside-menu @collapse="handleCollapse"></aside-menu>
        </el-aside>
        <el-main>
          <!-- 面包屑 -->
          <bread-nav></bread-nav>
          <!-- 路由占位符 -->
          <el-card>
            <router-view></router-view>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import BreadNav from '@/components/BreadCrumb'
import AsideMenu from '@/components/AsideMenu'
export default {
  name: 'home',
  data() {
    return {
      asideWidth: '230px',
    }
  },
  components: {
    AsideMenu,
    BreadNav,
  },
  created() {},
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$message.info('注销成功')
      this.$router.push('/login')
    },
    handleCollapse: function (isCollapse) {
      this.asideWidth = isCollapse ? '64px' : '230px'
    },
  },
}
</script>

<style lang="stylus" scoped>
.home-container {
  height: 100%;

  .el-container {
    height: 100%;

    .el-header {
      padding-left: 0 !important;
      background-color: #373d41;
      display: flex;
      justify-content: space-between;

      > div {
        width: 230px;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          display: inline-block;
          font-size: 20px;
          color: #fff;
        }
      }

      .logout-btn {
        margin-top: 10px;
        height: 40px;
      }
    }

    .el-container {
      .el-aside {
        background-color: #333744;

        .el-menu {
          border: none;
        }
      }

      .el-main {
        background-color: #EAEDF1;

        .el-card {
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
          height: calc(100vh - 136px);
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
