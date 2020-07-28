<template>
  <div class="menu-container">
    <!-- 收缩展开图标 -->
    <div :class="{'collapse-icon':true,collapse:isCollapse}">
      <i :class="{'el-icon-s-fold':!isCollapse,'el-icon-s-unfold':true}" @click="collapseMenu"></i>
    </div>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
      :unique-opened="true"
      @select="saveSelectedMenu"
      router
    >
      <template v-for="(item,index) of menuList">
        <!--  一级菜单  -->
        <el-menu-item
          class="menu-item"
          v-if="hasOneChild(item)"
          :index="item.path"
          :route="item.url"
          :key="index"
        >
          <i class="el-icon-star-on"></i>
          <span slot="title">{{ item.authName }}</span>
        </el-menu-item>
        <!--  二级菜单  -->
        <el-submenu v-else :index="item.id+''" :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.authName }}</span>
          </template>
          <!--  递归整个组件  -->
          <div v-for="(subItem, index) of item.children" :key="index">
            <!--  一级菜单  -->
            <el-menu-item v-if="hasOneChild(subItem)" :index="subItem.path" :route="subItem.url">
              <i class="el-icon-star-on"></i>
              <span slot="title">{{ subItem.authName }}</span>
            </el-menu-item>
            <!--  二级菜单  -->
            <el-submenu v-else :index="subItem.id+''" :key="index">
              <template slot="title">
                <i :class="subItem.icon"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-submenu>
          </div>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import '../mock/menu';
import { getMenuList } from '@/api/menu'
export default {
  name: 'asidemenu',
  data() {
    return {
      menuList: [],
      activeMenu: '/users',
      isCollapse: false,
    }
  },
  components: {},
  methods: {
    getInitMenu: async function () {
      const { code, data: menu } = await getMenuList()
      if (code === 200) {
        this.menuList = menu
      }
    },
    hasOneChild: function (item) {
      if (item.children == null) return true
      if (item.children != null && item.children.length == 0) return true
      return false
    },
    collapseMenu: function () {
      this.isCollapse = !this.isCollapse
      this.$emit('collapse', this.isCollapse)
    },
    saveSelectedMenu: function (index, path) {
      this.activeMenu = path[1]
      window.sessionStorage.setItem('activeItem', path[1])
    },
  },
  created() {
    const lastMemoryMenu = window.sessionStorage.getItem('activeItem')
    this.activeMenu = lastMemoryMenu
    this.getInitMenu()
  },
}
</script>

<style scoped="scoped" lang="stylus">
.menu-container {
  height: 100%;

  .collapse-icon {
    position: absolute;
    left: 230px;
    top: 50%;
    display: block;
    width: 40px;
    height: 40px;
    color: #fff;
    background-color: #333744;
    text-align: center;
    line-height: 40px;
    font-size: 25px;
    cursor: pointer;
    border-radius: 50%;
    transform: translateX(-50%);
    z-index: 9;
  }

  .collapse {
    left: 64px !important;
  }

  .el-menu {
    border: none !important;
  }
}
</style>
