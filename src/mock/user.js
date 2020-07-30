import Mock from 'mockjs'
import settings from '../settings'

// 登录成功返回的数据
Mock.mock(RegExp(settings.baseUrl + '/api/user/login.*'), {
  code: 200,
  message: '登录成功',
  data: {
    age: 18,
    username: '@name'
  }
})

// 用户分页数据
Mock.mock(RegExp(settings.baseUrl + '/api/user/selectPage.*'), {
  code: 200,
  message: '获取所有用户信息',
  data: {
    total: 54,
    'records|15': [{
      'username|1': '@first',
      state: '@boolean',
      email: '@email',
      ip: '@ip',
      'roleName|+1': ['超级管理员', '狗屁不是', '普通管理员'],
      createTime: '@date("yyyy-MM-dd HH:mm:ss")'
    }]
  }
})

// 更新用户
Mock.mock(RegExp(settings.baseUrl + '/api/user/update'), {
  'code|+1': [200, 201],
  message: '',
  data: {}
})

// 新增用户
Mock.mock(RegExp(settings.baseUrl + '/api/user/save'), {
  code: 200,
  message: '新增用户成功',
  data: {}
})

// ID查询单条数据
Mock.mock(RegExp(settings.baseUrl + '/api/user/selectOne.*'), {
  code: 200,
  message: '查询成功',
  data: {
    username: '@first',
    password: '@word(8,15)',
    mobile: '13956578452',
    email: '@email'
  }
})

// 删除用户
Mock.mock(RegExp(settings.baseUrl + '/api/user/delete'), {
  code: 200,
  message: '删除用户成功',
  data: {}
})
