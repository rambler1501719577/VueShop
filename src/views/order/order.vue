<template>
  <div class="order-container">
    <!-- 搜索栏 -->
    <!-- 搜索栏 + 添加按钮 -->
    <el-row :gutter="15" class="operate-box">
      <el-col :span="8">
        <el-input placeholder="搜索订单" v-model="queryParam.keyword" clearable @clear="resetSearch">
          <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="orderList" style="width: 100%" border stripe>
      <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="orderId" label="订单编号"></el-table-column>
      <el-table-column prop="price" label="订单价格"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.orderPay">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" align="center" width="80">
        <template slot-scope="scope">{{scope.row.isSend?'是':'否'}}</template>
      </el-table-column>
      <el-table-column label="下单时间" prop="createTime"></el-table-column>
      <el-table-column label="操作按钮" align="center" width="130">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="editAddress(scope.row)" type="primary" size="mini"></el-button>
          <el-button icon="el-icon-location" @click="showProgress" type="success" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 修改地址的对话框 -->
    <div class="address-dialog">
      <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="50%" @close="clearForm">
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="地区">
            <el-cascader
              clearable
              v-model="selectedKeys"
              :options="cityOptions"
              :props="{ expandTrigger: 'hover', value: 'name', children: 'children', label: 'name' }"
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="地址详情" prop="detail">
            <el-input v-model="addressForm.detail"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 物流信息对话框 -->
    <div class="address-dialog">
      <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="50%">
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(activity, index) in progressData"
            :key="index"
            :timestamp="activity.time"
          >{{activity.message}}</el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="progressDialogVisible = false">OK</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import allData from '@/plugins/city'
import '@/mock/order'
import { orderList } from '@/api/order'
import settings from '@/settings'
export default {
    name: 'order',
    data() {
        return {
            queryParam: {
                start: 0,
                limit: 0,
                keyword: '',
            },
            loading: false,
            total: 0,
            orderList: [],
            addressDialogVisible: false,
            progressDialogVisible: false,
            addressForm: {
                address: '',
                detail: '',
            },
            cityOptions: [],
            selectedKeys: [],
            addressFormRules: {
                detail: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '地址详情不能为空',
                    },
                ],
            },
            progressData: [
                {
                    time: '07-27 18:42',
                    title: '已下单',
                    message: '您的订单开始处理',
                },
                {
                    time: '07-27 21:36',
                    title: '已发货',
                    message: '您的包裹已出库',
                },
                {
                    time: '07-28 8:42',
                    title: '运输中',
                    message: '【广州白云区十九部】揽收成功',
                },
                {
                    time: '07-29 6:11',
                    title: '运输中',
                    message: '快递到达【青岛转运中心】',
                },
                {
                    time: '07-28 8:42',
                    title: '派件中',
                    message:
                        '【烟台市】烟台莱山一部派件员： 19818717777 当前正在为您派件',
                },
            ], //物流信息
        }
    },
    components: {},
    created() {
        this.queryParam.limit = settings.defaultPageSize
        this.getOrderData()
        this.cityOptions = allData
    },
    methods: {
        // 编辑地址
        editAddress: function (row) {
            this.selectedKeys = row.address.split(' ')
            this.addressForm.detail = row.detail
            this.addressForm.address = row.address.split(' ').join('-')
            this.addressDialogVisible = true
        },
        // 显示物流信息
        showProgress: function () {
            this.progressDialogVisible = true
        },
        // 保存地址
        submitForm: function () {},
        // 级联选择框选中处理函数
        getParentId: function (value) {
            if (value != null && value.length > 0) {
                this.addressForm.address = value.join('-')
            } else {
                this.addressForm.address = ''
            }
        },
        // 清空表单
        clearForm: function () {
            this.addressForm.detail = ''
            this.addressForm.area = ''
            this.selectedKeys = []
        },
        // 获取订单数据
        getOrderData: async function () {
            this.loading = true
            const { code, data: result } = await orderList(this.queryParam)
            this.orderList = result.records
            console.log(this.orderList)
            this.total = result.total
            this.loading = false
        },
        // 搜索功能
        searchOrder: function () {
            this.getOrderData()
        },
        // 重置搜索
        resetSearch: function () {
            this.queryParam.keyword = ''
            this.getOrderData()
        },
        // 翻页
        handlePageChange: function (current) {
            this.queryParam.start = settings.defaultPageSize * (current - 1)
            this.getOrderData()
        },
    },
}
</script>

<style lang="stylus" scoped>
.order-container {
    .operate-box {
        margin-bottom: 15px;
    }

    .pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
    }

    .address-dialog {
        .el-cascader {
            width: 100%;
        }
    }
}
</style>
