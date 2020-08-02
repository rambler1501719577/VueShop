import settings from '@/settings'
import Mock from 'mockjs'

// 商品列表
Mock.mock(RegExp(settings.baseUrl + '/api/goods/selectPage.*'), {
  code: 200,
  message: '成功',
  data: {
    total: 120,
    'records|10': [{
      id: '@guid',
      title: '@ctitle',
      price: '@natural(30,50000)',
      addTime: '@date("yyyy-MM-dd HH:mm:ss")',
      weight: '@natural(1,5)'
    }]
  }
})

// 增
Mock.mock(RegExp(settings.baseUrl + '/api/goods/insert'), {
  code: 200,
  message: '成功',
  data: {}
})

// 删除
Mock.mock(RegExp(settings.baseUrl + '/api/goods/delete'), {
  code: 200,
  message: '成功',
  data: {}
})

// 改
Mock.mock(RegExp(settings.baseUrl + '/api/goods/update'), {
  code: 200,
  message: '成功',
  data: {}
})

// 查询单个
Mock.mock(RegExp(settings.baseUrl + '/api/goods/selectOne.*'), {
  code: 200,
  message: '成功',
  data: {
    id: '@guid',
    title: '@title',
    price: '@natural(30,50000)',
  }
})
