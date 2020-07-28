import request from '@/plugins/request'

export function getMenuList() {
  return request({
    method: 'GET',
    url: '/api/menu/selectAll'
  })
}
