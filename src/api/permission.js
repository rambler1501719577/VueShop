import request from '@/plugins/request'

// 所有权限列表
export function permissionList(params) {
  return request({
    method: 'GET',
    url: '/api/permission/selectPage',
    params
  })
}
