# StockVueVision 前端后端API对接指南

> **📝 更新说明**: 2024年最新版本已更新为手机号密码登录方式，首次使用自动注册，不再需要验证码。

## 项目概述
这是一个基于Vue 3 + Element Plus的股票投资决策系统前端项目，需要与后端API进行数据交互。

## 技术栈
- **前端框架**: Vue 3 + Composition API
- **UI组件库**: Element Plus
- **图表库**: ECharts 5
- **HTTP客户端**: Axios
- **构建工具**: Vite

## API基础配置

### 1. 基础URL配置
```javascript
// 当前配置在 src/api/accountApi.js
const api = axios.create({
  baseURL: 'http://localhost:8000',  // 后端服务器地址
  timeout: 30000,                    // 超时时间30秒
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

### 2. 环境变量配置建议
建议创建 `.env` 文件来管理不同环境的API地址：
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_DATA=true

# .env.production  
VITE_API_BASE_URL=https://your-production-api.com
VITE_USE_MOCK_DATA=false
```

### 3. 认证Token管理
```javascript
// 在 src/utils/httpClient.js 中配置请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器处理token过期
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token过期，尝试刷新
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await api.post('/api/auth/refresh/', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          const { access_token } = response.data.data;
          localStorage.setItem('access_token', access_token);
          // 重新发送原请求
          error.config.headers.Authorization = `Bearer ${access_token}`;
          return api.request(error.config);
        } catch (refreshError) {
          // 刷新失败，跳转到登录页
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        // 没有refresh_token，直接跳转登录页
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## 需要对接的API接口

### 1. 用户认证相关接口

#### 1.1 手机号密码登录/注册
- **接口路径**: `/api/auth/login/`
- **请求方法**: POST
- **功能**: 使用手机号和密码进行登录，首次使用自动注册
- **请求参数**:
```javascript
{
  phone: '13888888888',  // 手机号码，必填
  password: 'password123' // 密码，必填，最少6位字符
}
```
- **响应数据**:
```javascript
{
  success: true,
  message: '登录成功',
  data: {
    user: {
      user_id: 'user_123456',
      phone: '13888888888',
      nickname: '用户123456',
      avatar: '',
      is_new_user: false,    // 是否为新注册用户
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-01-01T00:00:00Z'
    },
    token: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      token_type: 'Bearer',
      expires_in: 3600       // access_token有效期（秒）
    }
  }
}
```

#### 1.2 密码验证规则
- **密码要求**:
  - 最少6位字符
  - 支持字母、数字、特殊字符
  - 建议包含大小写字母和数字的组合
- **前端验证**:
  - 实时验证密码长度
  - 显示密码强度提示
- **后端验证**:
  - 密码长度检查
  - 密码强度评估（可选）
  - 密码加密存储

#### 1.3 刷新访问令牌
- **接口路径**: `/api/auth/refresh/`
- **请求方法**: POST
- **功能**: 使用refresh_token刷新access_token
- **请求头**: 
```javascript
{
  'Authorization': 'Bearer refresh_token_here'
}
```
- **响应数据**:
```javascript
{
  success: true,
  message: 'Token刷新成功',
  data: {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    expires_in: 3600
  }
}
```

#### 1.4 退出登录
- **接口路径**: `/api/auth/logout/`
- **请求方法**: POST
- **功能**: 注销当前用户会话，使token失效
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```
- **响应数据**:
```javascript
{
  success: true,
  message: '退出登录成功'
}
```

#### 1.5 获取当前用户信息
- **接口路径**: `/api/auth/profile/`
- **请求方法**: GET
- **功能**: 获取当前登录用户的详细信息
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```
- **响应数据**:
```javascript
{
  success: true,
  data: {
    user_id: 'user_123456',
    phone: '13888888888',
    nickname: '用户123456',
    avatar: '',
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2024-01-01T00:00:00Z',
    account_status: 'active',
    permissions: ['read', 'write', 'admin']
  }
}
```

## 前端实现说明

### 1. 密码登录系统架构

#### 1.1 技术栈
- **Vue 3**: 使用Composition API
- **Element Plus**: UI组件库
- **Vue Router**: 路由管理
- **Axios**: HTTP客户端

#### 1.2 核心功能
- **密码登录**: 手机号 + 密码登录方式
- **自动注册**: 首次使用手机号自动注册账号
- **密码强度**: 实时显示密码强度指示器
- **Token管理**: JWT访问令牌和刷新令牌
- **路由守卫**: 未登录用户无法访问受保护页面

#### 1.3 用户界面特性
- **现代化设计**: 玻璃拟态效果，动态粒子背景
- **响应式布局**: 适配不同屏幕尺寸
- **交互反馈**: 实时表单验证，密码强度提示
- **用户体验**: 登录状态管理，用户信息显示

### 2. 认证流程

#### 2.1 登录流程
1. 用户输入手机号和密码
2. 前端验证表单数据（手机号格式、密码长度）
3. 调用后端登录API (`POST /api/auth/login/`)
4. 保存Token到localStorage
5. 跳转到受保护页面

#### 2.2 密码强度检测
- **弱**: 少于6位字符（红色）
- **中**: 6-8位字符（黄色）
- **强**: 8位以上，包含大小写字母和数字（蓝色）

#### 2.3 Token自动刷新
- 访问令牌有效期为1小时
- 过期时自动使用refresh_token刷新
- 刷新失败时清除认证信息，跳转登录页

### 3. 路由配置

#### 3.1 页面权限设置
```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false }  // 无需认证
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }  // 无需认证
  },
  {
    path: '/display',
    name: 'Display',
    component: DisplayPage,
    meta: { requiresAuth: true }   // 需要认证
  },
  {
    path: '/comparison',
    name: 'Comparison',
    component: ComparisonPage,
    meta: { requiresAuth: true }   // 需要认证
  }
]
```

#### 3.2 路由守卫逻辑
```javascript
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth !== false
  
  if (requiresAuth && !isAuthenticated()) {
    // 需要认证但未登录，重定向到登录页
    next('/login')
  } else if (to.path === '/login' && isAuthenticated()) {
    // 已登录用户访问登录页，重定向到首页
    next('/')
  } else {
    // 其他情况正常跳转
    next()
  }
})
```

### 4. 开发模式

#### 4.1 Mock数据测试
在开发环境中，系统使用Mock数据进行测试：
- **默认手机号**: `13888888888`
- **密码要求**: 任意6位以上密码即可登录
- **模拟延迟**: 模拟网络延迟，提供真实体验
- **测试账号**: 自动生成演示用户信息

#### 4.2 生产环境配置
在生产环境中，系统将调用真实的后端API：
- 需要配置正确的API端点
- 实现真实的用户认证
- 处理网络错误和异常情况
- 启用HTTPS安全传输

### 5. 文件结构

```
src/
├── views/
│   ├── LoginPage.vue          # 登录页面（密码登录）
│   ├── HomeView.vue           # 首页（显示登录状态）
│   ├── DisplayPage.vue        # 数据展示页（需认证）
│   └── ComparisonPage.vue     # 资产对比页（需认证）
├── api/
│   └── authApi.js             # 认证相关API接口
├── utils/
│   ├── httpClient.js          # HTTP客户端配置
│   └── accountStore.js        # 账户状态管理
└── router/
    └── index.js               # 路由配置和守卫
```

### 6. 使用方法

#### 6.1 用户登录
1. 访问登录页面 (`/login`)
2. 输入手机号（11位数字格式）
3. 输入密码（至少6位字符）
4. 点击"登录 / 注册"按钮
5. 系统自动处理登录或注册流程

#### 6.2 系统导航
- **首页** (`/`): 显示登录状态和用户信息
- **数据展示** (`/display`): 需要登录认证
- **资产对比** (`/comparison`): 需要登录认证
- **退出登录**: 清除认证信息，返回首页

### 7. 安全特性

#### 7.1 前端安全
- 密码强度实时检测
- 表单数据验证
- XSS防护
- CSRF防护

#### 7.2 认证安全
- JWT Token加密
- Token过期管理
- 自动刷新机制
- 安全退出登录

#### 7.3 路由安全
- 权限控制
- 未授权访问拦截
- 登录状态验证
- 安全重定向

### 8. 注意事项

1. **密码安全**: 建议用户使用强密码，包含大小写字母、数字和特殊字符
2. **Token管理**: 访问令牌有效期为1小时，过期后需要刷新
3. **浏览器兼容**: 需要支持ES6+的现代浏览器
4. **移动端适配**: 登录页面已优化移动端体验
5. **错误处理**: 完善的网络错误和异常情况处理
6. **用户体验**: 加载状态、错误提示、成功反馈等

### 9. 故障排除

#### 9.1 常见问题
1. **登录失败**: 检查手机号格式和密码长度
2. **页面跳转**: 确保路由配置正确
3. **Token失效**: 清除浏览器缓存或重新登录
4. **API错误**: 检查网络连接和API端点配置

#### 9.2 调试信息
- 打开浏览器开发者工具查看控制台日志
- 检查Network标签页的API请求
- 验证localStorage中的Token存储
- 查看路由守卫的执行日志

### 10. 更新日志

- **v2.0.0**: 从验证码登录改为密码登录
- **v2.0.1**: 添加密码强度指示器
- **v2.0.2**: 优化路由守卫和用户体验
- **v2.0.3**: 完善错误处理和Mock数据
- **v2.0.4**: 集成到API集成指南文档

### 2. 账户信息相关接口

#### 2.1 获取账户基本信息
- **接口路径**: `/api/account-info/`
- **请求方法**: GET
- **功能**: 获取账户资产、持仓等基本信息
- **当前实现**: `src/api/accountApi.js` - `fetchAccountInfo()`
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```
- **数据结构**:
```javascript
{
  accounts: [
    {
      account_id: 'DEMO000001',
      account_type: 'STOCK',
      cash: 1250000,           // 现金余额
      frozen_cash: 75000,      // 冻结资金
      market_value: 2850000,   // 股票市值
      total_asset: 4100000,    // 总资产
      positions: [...]         // 持仓信息
    }
  ]
}
```

#### 2.2 获取资产类别分布
- **接口路径**: `/api/asset-category/`
- **请求方法**: GET
- **功能**: 获取按行业分类的资产分布
- **当前实现**: `src/api/accountApi.js` - `fetchAssetCategoryData()`
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```
- **数据结构**:
```javascript
{
  categoryData: [
    {
      name: '银行股',      // 行业名称
      value: 216000,      // 市值
      percentage: 7.6     // 占比百分比
    }
  ]
}
```

#### 2.3 获取地区分布数据
- **接口路径**: `/api/region-data/`
- **请求方法**: GET
- **功能**: 获取按地区分类的资产分布
- **当前实现**: `src/api/accountApi.js` - `fetchRegionDataFromBackend()`
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```

### 3. 对比分析相关接口

#### 3.1 地区对比分析
- **接口路径**: `/api/areacomparsion/area_comparison/`
- **请求方法**: GET
- **请求参数**: `account_id` (账户ID)
- **当前实现**: `src/api/regioncomparisonApi.js` - `fetchRegionComparisonData()`
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```
- **数据结构**:
```javascript
{
  area_data: [
    {
      region: '上海',           // 地区名称
      totalAssets: 820000,     // 总资产
      returnRate: '8.5%',      // 收益率
      maxDrawdown: '28.8%'     // 最大回撤率
    }
  ]
}
```

#### 3.2 时间段对比分析
- **接口路径**: `/api/timecomparison/yearly_comparison/`
- **请求方法**: GET
- **请求参数**: `account_id` (账户ID)
- **当前实现**: `src/api/timecomparisonApi.js` - `fetchYearlyComparisonData()`
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```

- **接口路径**: `/api/timecomparison/weekly_comparison/`
- **请求方法**: GET
- **请求参数**: `account_id` (账户ID)
- **当前实现**: `src/api/timecomparisonApi.js` - `fetchWeeklyComparisonData()`
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```

### 4. 策略执行相关接口

#### 4.1 策略执行
- **功能**: 执行投资策略
- **当前实现**: 在 `src/components/layout/StrategyExecution.vue` 中
- **需要对接**: 策略执行API、参数配置API
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```

#### 4.2 策略执行结果
- **功能**: 获取策略执行结果
- **当前实现**: 在 `src/components/layout/StrategyExecutionResult.vue` 中
- **需要对接**: 策略结果查询API
- **请求头**:
```javascript
{
  'Authorization': 'Bearer access_token_here'
}
```

## 数据格式转换

### 1. 前端组件期望的数据格式

#### 资产类别对比表
```javascript
// 组件期望格式 (AssetComparisonAnalysis.vue)
categoryData: [
  {
    stock_code: '600000.SH',    // 股票代码
    asset_ratio: '7.6%',        // 资产占比
    market_value: 216000,       // 股票市值
    daily_return: '8.5%'        // 收益率
  }
]
```

#### 时间段对比表
```javascript
// 组件期望格式
timeData: [
  {
    timePeriod: '2024-01',      // 时间段
    totalAssets: 3800000,       // 总资产
    returnRate: '5.2%',         // 收益率
    growthRate: '8.5%'          // 增长率
  }
]
```

#### 地区对比表
```javascript
// 组件期望格式
regionData: [
  {
    region: '上海',              // 地区
    totalAssets: 820000,        // 资产总值
    returnRate: '8.5%',         // 收益率
    investmentRate: '28.8%'     // 最大回撤率
  }
]
```

### 2. 数据转换函数
建议在API层添加数据转换函数，确保后端数据格式与前端组件期望格式一致。

## 错误处理机制

### 1. 当前实现
- 使用 `try-catch` 包装API调用
- API失败时自动回退到模拟数据
- 控制台输出详细错误信息

### 2. 建议改进
- 统一错误处理中间件
- 用户友好的错误提示
- 重试机制
- 网络状态检测

## 模拟数据配置

### 1. 当前配置
- 通过 `USE_MOCK_DATA` 标志控制是否使用模拟数据
- 模拟数据存储在 `src/api/mockData.js` 中
- 包含完整的业务数据结构

### 2. 切换机制
```javascript
// 在 mockData.js 中设置
export const USE_MOCK_DATA = true;  // 开发时使用模拟数据
export const USE_MOCK_DATA = false; // 生产时使用真实API
```

## 开发建议

### 1. API接口规范
- 统一使用RESTful API设计
- 标准化的响应格式
- 完善的错误码体系

### 2. 数据验证
- 前端数据格式验证
- API响应数据校验
- 类型安全（建议使用TypeScript）

### 3. 性能优化
- 数据缓存策略
- 请求防抖/节流
- 分页加载

### 4. 安全性
- JWT Token认证
- 自动Token刷新
- 请求签名验证
- CORS配置
- 敏感信息加密存储

## 部署配置

### 1. 开发环境
```bash
npm run dev
# 后端API地址: http://localhost:8000
```

### 2. 生产环境
```bash
npm run build
# 需要配置生产环境的API地址
```

## 测试建议

### 1. 单元测试
- API函数测试
- 数据转换函数测试
- 组件逻辑测试

### 2. 集成测试
- API接口连通性测试
- 端到端数据流测试
- 错误处理测试

### 3. 模拟数据测试
- 确保模拟数据完整性
- 验证数据格式一致性
- 测试回退机制

## 注意事项

1. **数据一致性**: 确保后端返回的数据格式与前端组件期望的格式一致
2. **错误处理**: 实现完善的错误处理和用户提示
3. **性能优化**: 合理使用缓存和分页加载
4. **安全性**: 注意API密钥和敏感信息的保护
5. **兼容性**: 考虑不同浏览器的兼容性
6. **监控**: 添加API调用监控和性能指标

## 下一步工作

1. 配置后端API服务器
2. 实现数据格式转换函数
3. 完善错误处理机制
4. 添加数据验证
5. 实现用户认证和授权 ✅ (已更新为密码登录)
6. 添加API调用监控
7. 编写测试用例
8. 部署和配置生产环境

## 登录功能使用示例

### 1. 在LoginPage.vue中集成authApi
```javascript
import { loginWithPhone, validatePhone, validatePassword } from '@/api/authApi'

// 处理登录
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    const result = await loginWithPhone({
      phone: loginForm.phone,
      password: loginForm.password
    })
    
    if (result.success) {
      ElMessage.success('登录成功')
      router.push('/display')
    } else {
      ElMessage.error(result.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请检查输入信息')
  } finally {
    loading.value = false
  }
}
```

### 2. 路由守卫集成
```javascript
// src/router/index.js
import { isAuthenticated } from '@/api/authApi'

router.beforeEach((to, from, next) => {
  // 需要登录的页面
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !isAuthenticated()) {
    // 未登录，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && isAuthenticated()) {
    // 已登录，跳转到主页
    next('/display')
  } else {
    next()
  }
})
```

### 3. 全局状态管理（可选）
```javascript
// src/stores/auth.js (如果使用Pinia)
import { defineStore } from 'pinia'
import { getCurrentUser, logout, getLocalUserInfo } from '@/api/authApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    async fetchCurrentUser() {
      try {
        const result = await getCurrentUser()
        if (result.success) {
          this.user = result.data
          this.isLoggedIn = true
        }
      } catch (error) {
        this.user = null
        this.isLoggedIn = false
      }
    },
    
    async handleLogout() {
      try {
        await logout()
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        this.user = null
        this.isLoggedIn = false
      }
    },
    
    initFromLocalStorage() {
      const userInfo = getLocalUserInfo()
      if (userInfo) {
        this.user = userInfo
        this.isLoggedIn = true
      }
    }
  }
})
```
