<template>
  <div><el-button @click="logout">退出</el-button></div>
</template>

<script>
export default {
  name: 'home',
  data: {},
  methods: {
    logout: function() {
      window.sessionStorage.clear();
      this.$message.info('注销成功');
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="stylus" scoped>

</style>
