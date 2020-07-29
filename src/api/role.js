import request from '@/plugins/request'

// 角色列表
export function getRoleData(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/role/selectAll'
  })
}

// 根据id查询角色信息
export function roleDetail(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/role/selectOne'
  })
}

// 删除角色
export function deleteRole(params) {
  return request({
    method: 'DELETE',
    params,
    url: '/api/role/delete'
  })
}

// 新增
export function saveRole(params) {
  return request({
    method: 'POST',
    data: params,
    url: '/api/role/insert'
  })
}

// 更新
export function updateRole(params) {
  return request({
    method: 'PUT',
    data: params,
    url: '/api/role/update'
  })
}

// 删除单个权限
export function deleteRightById(params) {
  return request({
    method: 'DELETE',
    params,
    url: '/api/role/deleteRightById'
  })
}

// 获取树形菜单
export function getTreePermission(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/role/treePermission'
  })
}

export function updateRolePermission(params){
  return request({
    method:'PUT',
    data:params,
    url:'/api/role/updateRolePermission'
  })
}