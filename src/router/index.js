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
      component: () => import('@/components/login')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/components/home')
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login")
    return next();
  const token = sessionStorage.getItem("token");
  if (!token)
    next("/login");
  next();
})

export default router;
