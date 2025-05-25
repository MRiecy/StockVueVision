import { createRouter, createWebHistory } from 'vue-router'
import DisplayPage from '@/views/DisplayPage.vue'
import ComparisonPage from '@/views/ComparisonPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/display'
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
