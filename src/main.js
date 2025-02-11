import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus' // 引入 Element Plus
import 'element-plus/dist/index.css' // 引入 Element Plus 的样式
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus) // 使用 Element Plus
app.mount('#app')
