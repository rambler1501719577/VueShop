<template>
  <div class="list-container">
    <!-- 搜索栏 + 添加按钮 -->
    <el-row :gutter="15" class="operate-box">
      <el-col :span="8">
        <el-input
          placeholder="请输入商品关键字"
          v-model="queryParam.keyword"
          clearable
          @clear="resetSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="goAddPage">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 数据区域 -->
    <div class="data">
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
        <el-table-column label="商品重量">
          <template slot-scope="scope">{{scope.row.weight}} KG</template>
        </el-table-column>
        <el-table-column label="商品价格" sortable>
          <template slot-scope="scope">{{scope.row.price}} 元</template>
        </el-table-column>
        <el-table-column prop="addTime" label="上架时间"></el-table-column>
        <el-table-column label="操作" width="125">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="editGoods(scope.row)"></el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import '@/mock/goods'
import settings from '@/settings'
import {
    goodsList,
    addGoods,
    deleteGoods,
    updateGoods,
    goodsDetail,
} from '@/api/goods'
export default {
    name: 'list',
    data() {
        return {
            queryParam: {
                keyword: '',
                start: 0,
                limit: 0,
            },
            total: 0,
            mode: 'add',
            dialogVisible: false,
            goodsList: [], //商品列表
        }
    },
    components: {},
    methods: {
        resetSearch: function () {
            this.queryParam.keyword = ''
            this.goodsList = []
            this.getGoodsList()
        },
        searchGoods: function () {
            this.goodsList = []
            this.$message.success('搜索完成')
            this.getGoodsList()
        },
        // 获取商品列表
        getGoodsList: async function () {
            const { code, data } = await goodsList(this.queryParam)
            if (code === 200) {
                this.goodsList = data.records
                this.total = data.total
            } else {
                this.$message.error('获取商品列表失败')
            }
        },
        goAddPage: function () {
            this.$router.push('/goods/add')
        },
        // 编辑商品
        editGoods: async function (goods) {},
        // 删除商品
        handleDelete: async function (goods) {
            this.$confirm('是否要删除当前商品', '删除提醒提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    const { code, message } = await deleteGoods({
                        id: goods.id,
                    })
                    if (code === 200) {
                        this.$message.success(
                            '删除商品【' + goods.title + '】成功'
                        )
                        this.goodsList = []
                        this.getGoodsList()
                    } else {
                        this.$message.error('删除用户失败，商品不存在')
                    }
                })
                .catch(() => {
                    this.$message.info('取消删除')
                })
        },
        handlePageChange: function (current) {
            this.queryParam.start = (current - 1) * this.queryParam.limit
            this.getGoodsList(this.queryParam)
        },
    },
    created() {
        this.queryParam.limit = settings.defaultPageSize
        this.getGoodsList()
    },
}
</script>

<style scoped="scoped" lang="stylus">
.list-container {
    .data {
        margin-top: 15px;
    }

    .pagination {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
