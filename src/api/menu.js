import request from '@/plugins/request'

export function getMenuList(params) {
  return request({
    method: 'GET',
    url: '/api/menu/selectAll',
    params
  })
}
