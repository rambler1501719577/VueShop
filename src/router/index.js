import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由表
const router = new Router({
  routes: [
    {
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
      children: [
        {
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
