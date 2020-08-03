<template>
  <div class="permission-container">
    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="permissionData" style="width: 100%" border stripe>
      <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="name" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="访问路径"></el-table-column>
      <!-- 渲染标签 -->
      <el-table-column align="center" prop="level" label="权限等级">
        <template slot-scope="scope">
          <el-tag
            :type="levelTag[scope.row.level-1].type"
            effect="dark"
            :hit="false"
          >{{levelTag[scope.row.level-1].label}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { permissionList } from '@/api/permission'
import settings from '@/settings'
import '@/mock/permission'
export default {
  name: 'permission',
  data() {
    return {
      queryParam: {
        start: 0,
        limit: 0,
      },
      loading: false,
      permissionData: [],
      levelTag: [
        {
          label: '一级',
          type: '-',
        },
        {
          label: '二级',
          type: 'success',
        },
        {
          label: '三级',
          type: 'warning',
        },
      ],
    }
  },
  components: {},
  created() {
    this.queryParam.limit = settings.defaultPageSize
    this.getPermissionData()
  },
  methods: {
    getPermissionData: async function () {
      const { code, data: result } = await permissionList(this.queryParam)
      this.permissionData = result
    },
  },
}
</script>

<style lang="stylus" scoped></style>
