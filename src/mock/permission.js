import Mock from 'mockjs'
import settings from '../settings'

Mock.mock(RegExp(settings.baseUrl + '/api/permission/selectPage.*'), {
  code: 200,
  message: '获取权限列表成功',
  'data|35': [
    {
      id: '@guid',
      name: '@csentence(5)',
      level: '@natural(1,3)',
      path: '@word(3,8)',
      pid: '@increment'
    }
  ]
})
