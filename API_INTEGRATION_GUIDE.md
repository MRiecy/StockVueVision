# StockVueVision 前端后端API对接指南

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

#### 1.1 发送手机验证码
- **接口路径**: `/api/auth/send-code/`
- **请求方法**: POST
- **功能**: 向指定手机号发送登录验证码
- **请求参数**:
```javascript
{
  phone: '13888888888'  // 手机号码，必填
}
```
- **响应数据**:
```javascript
{
  success: true,
  message: '验证码已发送',
  data: {
    expire_time: 300,     // 验证码有效期（秒）
    can_resend_time: 60   // 可重新发送时间（秒）
  }
}
```

#### 1.2 手机号登录/注册
- **接口路径**: `/api/auth/login/`
- **请求方法**: POST
- **功能**: 使用手机号和验证码进行登录，首次使用自动注册
- **请求参数**:
```javascript
{
  phone: '13888888888',  // 手机号码，必填
  code: '123456'         // 验证码，必填，6位数字
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
    account_status: 'active',  // 账户状态: active, inactive, suspended
    permissions: ['read', 'write']  // 用户权限列表
  }
}
```

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
5. 实现用户认证和授权 ✅
6. 添加API调用监控
7. 编写测试用例
8. 部署和配置生产环境

## 登录功能使用示例

### 1. 在LoginPage.vue中集成authApi
```javascript
import { sendVerificationCode, loginWithPhone, validatePhone, validateCode } from '@/api/authApi'

// 发送验证码
const sendCode = async () => {
  try {
    await loginFormRef.value.validateField('phone')
    
    const result = await sendVerificationCode(loginForm.phone)
    if (result.success) {
      ElMessage.success('验证码已发送')
      // 开始倒计时
      countdown.value = result.data.can_resend_time || 60
    }
  } catch (error) {
    ElMessage.error('发送验证码失败')
  }
}

// 处理登录
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    const result = await loginWithPhone({
      phone: loginForm.phone,
      code: loginForm.code
    })
    
    if (result.success) {
      ElMessage.success('登录成功')
      router.push('/display')
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查输入信息')
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
