import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus' // 引入 Element Plus
import 'element-plus/dist/index.css' // 引入 Element Plus 的样式
import App from './App.vue'
import router from './router'

// 添加调试信息
console.log('🚀 应用启动:', {
  mode: import.meta.env.MODE,
  base: import.meta.env.BASE_URL,
  timestamp: new Date().toISOString()
});

const app = createApp(App)

app.use(ElementPlus) // 使用 Element Plus
app.use(router)

app.mount('#app')
