import { createRouter, createWebHistory } from 'vue-router'
import DisplayPage from '@/views/DisplayPage.vue'
import ComparisonPage from '@/views/ComparisonPage.vue'
import LoginPage from '@/views/LoginPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/display'  // 临时改为数据展示页面，方便开发
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

export default router
