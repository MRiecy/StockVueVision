import { createRouter, createWebHistory } from 'vue-router'
import DisplayPage from '@/views/DisplayPage.vue'
import ComparisonPage from '@/views/ComparisonPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import { isAuthenticated } from '@/api/authApi'

const routes = [
  {
    path: '/',
    redirect: '/display'  // 默认重定向到数据展示页
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }  // 登录页不需要认证
  },
  {
    path: '/display',
    name: 'Display',
    component: DisplayPage,
    meta: { requiresAuth: true }  // 需要认证
  },
  {
    path: '/comparison',
    name: 'Comparison',
    component: ComparisonPage,
    meta: { requiresAuth: true }  // 需要认证
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 启用路由守卫：确保用户必须先登录
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth !== false
  const isLoggedIn = isAuthenticated()

  if (requiresAuth && !isLoggedIn) {
    // 需要认证但未登录，重定向到登录页
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    // 已登录用户访问登录页，重定向到数据展示页
    next('/display')
  } else {
    // 其他情况正常跳转
    next()
  }
})

export default router
