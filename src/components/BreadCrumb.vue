<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) of navList" :key="index">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'breadcrumb',
  data() {
    return {
      navList: [],
    }
  },
  watch: {
    $route: function () {
      this.navList = this.$route.matched.slice(1,2);
    },
  },
  components: {},
  created() {
      this.navList = this.$route.matched.slice(1,2);
  },
  methods: {},
}
</script>

<style lang="stylus" scoped>
.breadcrumb-container{
    margin-bottom: 20px;
}
</style>