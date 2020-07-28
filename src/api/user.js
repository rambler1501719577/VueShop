import request from '@/plugins/request'
const Mock = require('mockjs')

/**
 * 登录
 */
export function login(user) {
  return request({
    method: 'GET',
    params: user,
    url: '/api/user/login'
  })
}

/**
 * 获取用户分页数据
 * @param {param} param
 */
export function userList(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/user/selectAll'
  })
}

/**
 * 更新用户
 * @param {data} data
 */
export function updateUser(data) {
  return request({
    method: 'PUT',
    url: '/api/user/update',
    data
  })
}

/**
 * 新增用户
 * @param {data} data
 */
export function saveUser(data) {
  return request({
    method: 'POST',
    url: '/api/user/save',
    data
  })
}

/**
 * 通过ID查询单条数据
 * @param {params} params
 */
export function userDetail(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/user/selectOne'
  })
}

/**
 * 删除用户
 * @param {params} params 
 */
export function deleteUser(params) {
  return request({
    method: 'DELETE',
    params,
    url: '/api/user/delete'
  })
}
