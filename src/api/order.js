import request from '@/plugins/request'

// 所有订单
export function orderList(params) {
  return request({
    method: 'GET',
    url: '/api/order/selectAll',
    params
  })
}

export function updateAddress(params) {
  return request({
    method: 'GET',
    url: '/api/order/selectAll',
    params
  })
}
