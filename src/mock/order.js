import Mock from 'mockjs'
import settings from '../settings'

Mock.mock(RegExp(settings.baseUrl + '/api/order/selectAll.*'), {
  code: 200,
  message: '获取订单成功',
  data: {
    total: 35,
    'records|15': [{
      orderId: '@guid',
      userId: '@guid',
      price: '@natural(1,1000)',
      'orderPay|1': [true, false],
      'isSend|1': [true, false],
      createTime: '@date(yyyy-MM-dd HH:mm:ss)',
      'type|1': ['办公用品', '生活用品', '厨房用品', '体育用品'],
      address: '@county(true)',
      detail: '@cword(2,5)'
    }]
  }
})
