import request from '@/plugins/request';
import settings from '@/settings';

// 列表
export function goodsList(params) {
  return request({
    method: 'GET',
    url: '/api/goods/selectPage',
    params
  })
}

// 增
export function addGoods(params) {
  return request({
    method: 'POST',
    url: '/api/goods/insert',
    data: params
  })
}

// 删除
export function deleteGoods(params) {
  return request({
    method: 'DELETE',
    url: '/api/goods/delete',
    params
  })
}

// 改
export function updateGoods(params) {
  return request({
    method: 'PUT',
    url: '/api/goods/update',
    data: params
  })
}

// 查询单个
export function goodsDetail(params) {
  return request({
    method: 'GET',
    url: '/api/goods/selectOne',
    params
  })
}
