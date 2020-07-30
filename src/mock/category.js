import Mock from 'mockjs';
import settings from '@/settings';

// 全部分类
Mock.mock(RegExp(settings.baseUrl + '/api/category/selectAll.*'), {
  code: 200,
  message: '获取全部分类成功',
  data: {
    total: 8,
    'records|4': [{
      id: '@guid',
      name: '@cword(2,5)',
      state: '@boolean',
      level: 0,
      'children|3': [{
        id: '@guid',
        name: '@cword(2,5)',
        level: 1,
        state: '@boolean',
        'children|3': [{
          id: '@guid',
          name: '@cword(2,5)',
          level: 2,
          state: '@boolean',
        }]
      }]
    }]
  }
})


// 全部分类
Mock.mock(RegExp(settings.baseUrl + '/api/category/selectParentList.*'), {
  code: 200,
  message: '获取全部分类成功',
  'data|4': [{
    id: '@guid',
    name: '@cword(2,5)',
    state: '@boolean',
    level: 0,
    'children|3': [{
      id: '@guid',
      name: '@cword(2,5)',
      level: 1,
      state: '@boolean',
    }]
  }]
})

// 增加分类
Mock.mock(RegExp(settings.baseUrl + '/api/category/insert'), {
  code: 200,
  message: '新增成功',
  data: {}
})

// 修改分类
Mock.mock(RegExp(settings.baseUrl + '/api/category/update'), {
  code: 200,
  message: '修改成功',
  data: {}
})

// 删除分类
Mock.mock(RegExp(settings.baseUrl + '/api/category/delete.*'), {
  code: 200,
  message: '删除成功',
  data: {}
})

// 查询分类
Mock.mock(RegExp(settings.baseUrl + '/api/category/selectOne'), {
  code: 200,
  message: '查询成功',
  data: {
    classifyName: '@cword(2,5)'
  }
})
