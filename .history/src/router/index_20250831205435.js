import { createRouter, createWebHistory } from 'vue-router'
import DisplayPage from '@/views/DisplayPage.vue'
import ComparisonPage from '@/views/ComparisonPage.vue'
import LoginPage from '@/views/LoginPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/display'  // 默认重定向到数据展示页
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/display',
    name: 'Display',
    component: DisplayPage
  },
  {
    path: '/comparison',
    name: 'Comparison',
    component: ComparisonPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 开发阶段：移除路由守卫，所有页面都可以直接访问
// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.meta.requiresAuth !== false
//
//   if (requiresAuth && !isAuthenticated()) {
//     // 需要认证但未登录，重定向到登录页
//     next('/login')
//   } else if (to.path === '/login' && isAuthenticated()) {
//     // 已登录用户访问登录页，重定向到数据展示页
//     next('/display')
//   } else {
//     // 其他情况正常跳转
//     next()
//   }
// })

export default router
