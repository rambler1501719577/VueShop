import Mock from 'mockjs'
import settings from '../settings'
import menuData from './data/menu.json'

Mock.mock(RegExp(settings.baseUrl + '/api/menu/selectAll.*'), {
  code: 200,
  message: '获取菜单成功',
  data: menuData
})
