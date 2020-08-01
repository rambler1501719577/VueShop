import request from '@/plugins/request';

// 分类数据
export function categoryList(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/category/selectAll'
  })
}

// 父级分类(一级和二级)
export function parentCategoryList(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/category/selectParentList'
  })
}

// 增加分类
export function addCategory(params) {
  return request({
    method: 'POST',
    data: params,
    url: '/api/category/insert'
  })
}

// 更新分类
export function updateCategory(params) {
  return request({
    method: 'PUT',
    data: params,
    url: '/api/category/update'
  })
}

// 根据id查询分类
export function categoryDetail(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/category/selectOne'
  })
}

// 删除分类
export function deleteCategory(params) {
  return request({
    method: 'DELETE',
    params,
    url: '/api/category/delete'
  })
}

// 获取某个分类的静态/动态参数
export function classifyParam(params) {
  return request({
    method: 'GET',
    params,
    url: '/api/category/params'
  })
}

// 移除标签
export function removeClassifyTag(params) {
  return request({
    method: 'DELETE',
    params,
    url: '/api/category/removeTag'
  })
}

// 增加标签
export function addCategoryTag(params) {
  return request({
    method: 'POST',
    data: params,
    url: '/api/category/addTag'
  })
}
