import Mock from 'mockjs'
import settings from '@/settings'

// 角色列表
Mock.mock(RegExp(settings.baseUrl + '/api/role/selectAll.*'), {
  code: 200,
  message: '获取角色列表成功',
  'data|8': [
    {
      id: '@increment',
      'roleName|+1': ['技术主管', '项目经理','测试人员1','测试人员2','测试人员3','测试人员4','测试人员5','测试人员6'],
      'roleDesc|+1': ['技术负责人', '打杂的'],
      'children|2': [
        {
          id: '@increment',
          'name|+1': ['商品管理', '三个字', '我有五个子', '测试'],
          path: null,
          'children|3': [
            {
              id: '@increment',
              'name|+1': ['单', '一对', '三人行', '驷马难追'],
              path: '@word(3,8)',
              'children|10': [
                {
                  id: '@increment',
                  'name|1': [
                    '添加商品',
                    '修改商品',
                    '修改地址',
                    '端茶送水',
                    '配送',
                    '客服'
                  ],
                  path: '@word(3,6)'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
})

// 增
Mock.mock(RegExp(settings.baseUrl + '/api/role/insert'), {
  code: 200,
  message: '新增角色成功'
})

// 删
Mock.mock(RegExp(settings.baseUrl + '/api/role/delete.*'), {
  code: 200,
  message: '删除角色成功'
})

// 改
Mock.mock(RegExp(settings.baseUrl + '/api/role/update'), {
  code: 200,
  message: '更新角色成功'
})

// 查
Mock.mock(RegExp(settings.baseUrl + '/api/role/selectOne.*'), {
  code: 200,
  message: '查询角色成功',
  data: {
    id: '@guid',
    'roleName|+1': ['技术主管', '项目经理'],
    'roleDesc|+1': ['技术负责人', '打杂的'],
    'permissionList|3': ['@natural(1,100)']
  }
})

// 删除单个权限
Mock.mock(RegExp(settings.baseUrl + '/api/role/deleteRightById.*'), {
  code: 200,
  message: '删除成功'
})

Mock.mock(RegExp(settings.baseUrl + '/api/role/treePermission.*'), {
  code: 200,
  message: '获取树形菜单成功',
  'data|8': [
    {
      id: '@increment',
      isLeaf: false,
      'label|+1': ['商品管理', '地址管理', '用户管理', '订单管理', '参数管理'],
      'children|2': [
        {
          id: '@increment',
          isLeaf: false,
          'label|+1': ['商品列表', '参数设置'],
          'children|3': [
            {
              id: '@increment',
              isLeaf: true,
              'label|+1': [
                '添加商品',
                '修改商品',
                '修改地址',
                '端茶送水',
                '配送',
                '客服'
              ]
            }
          ]
        }
      ]
    }
  ]
})

// 给角色分配权限
Mock.mock(RegExp(settings.baseUrl + '/api/role/updateRolePermission'), {
  code: 200,
  message: '重新分配权限成功'
})
