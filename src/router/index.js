import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由表
const router = new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/common/login')
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/welcome',
      meta: {
        title: '首页'
      },
      component: () => import('@/layout/home'),
      children: [{
          path: '/welcome',
          name: 'welcome',
          meta: {
            title: '权限列表'
          },
          component: () => import('@/views/welcome')
        },
        {
          path: '/users',
          name: 'users',
          meta: {
            title: '用户列表'
          },
          component: () => import('@/views/users/users')
        },
        {
          path: '/permission',
          name: 'permission',
          meta: {
            title: '权限列表'
          },
          component: () => import('@/views/power/permission')
        },
        {
          path: '/role',
          name: 'role',
          meta: {
            title: '角色列表'
          },
          component: () => import('@/views/power/role')
        },
        {
          path: '/categories',
          name: 'categories',
          meta: {
            title: '分类列表'
          },
          component: () => import('@/views/goods/cate')
        },
        {
          path: '/params',
          name: 'params',
          meta: {
            title: '分类参数'
          },
          component: () => import('@/views/goods/params')
        },
        {
          path: '/list',
          name: 'list',
          meta: {
            title: '商城列表'
          },
          component: () => import('@/views/goods/list')
        },
        {
          path: '/goods/add',
          name: 'add',
          meta: {
            title: '添加商品页面'
          },
          component: () => import('@/views/goods/add')
        },
        {
          path: '/order',
          name: 'order',
          meta: {
            title: '所有订单'
          },
          component: () => import('@/views/order/order')
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  if (!token) next('/login')
  next()
})

export default router
