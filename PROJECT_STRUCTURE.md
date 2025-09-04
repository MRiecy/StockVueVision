# StockVueVision 项目结构

## 项目概述
专业的股票投资策略分析与执行平台，连接国金平台，提供实时数据分析和智能策略执行。

## 目录结构

### 核心文件
- \package.json\ - 项目依赖配置
- \ite.config.js\ - Vite构建配置
- \index.html\ - 应用入口HTML
- \README.md\ - 项目说明文档

### 源代码目录 (src/)

#### 页面组件 (views/) - 3个核心页面
- \LoginPage.vue\ - 用户登录页面
- \DisplayPage.vue\ - 数据展示页面（默认首页）
- \ComparisonPage.vue\ - 对比分析页面

#### 布局组件 (components/layout/) - 6个核心组件
- \MenuBar.vue\ - 顶部导航菜单
- \ChartSection.vue\ - 图表展示组件
- \StrategyExecution.vue\ - 策略执行组件
- \StrategyExecutionResult.vue\ - 策略执行结果组件
- \AssetDisplayModule.vue\ - 资产展示模块
- \DataAuthenticityIndicator.vue\ - 数据真实性指示器

#### 对比分析组件 (components/comparison/)
- 包含各种对比分析相关的子组件

#### 图标组件 (components/icons/)
- 包含项目中使用的图标组件

#### API接口 (api/) - 5个核心API
- \uthApi.js\ - 用户认证相关API
- \ccountApi.js\ - 账户信息API
- \chartApi.js\ - 图表数据API
- \	imecomparisonApi.js\ - 时间对比API
- \egioncomparisonApi.js\ - 地区对比API

#### 工具函数 (utils/)
- \httpClient.js\ - HTTP客户端配置
- \dataTransformers.js\ - 数据转换工具
- \cacheManager.js\ - 缓存管理
- \ccountStore.js\ - 账户状态管理

#### 配置文件 (config/)
- \pi.config.js\ - API配置文件

#### 静态资源 (assets/)
- \main.css\ - 主样式文件
- \ase.css\ - 基础样式
- \logo.svg\ - 项目Logo

#### 路由配置 (router/)
- \index.js\ - 路由配置和导航守卫

## 主要功能

### 1. 用户认证
- 用户登录/注册
- Token管理和刷新
- 路由权限控制

### 2. 数据展示（默认首页）
- 账户资产信息展示
- 持仓数据展示
- 策略执行结果展示

### 3. 对比分析
- 多维度数据对比
- 风险分析
- 地区分布分析

### 4. 图表功能
- 实时数据图表
- 策略收益走势图
- 交互式数据可视化

## 路由配置
- \/\ - 自动重定向到 \/display\
- \/login\ - 登录页面
- \/display\ - 数据展示页面（主页面）
- \/comparison\ - 对比分析页面

## 技术栈
- Vue 3 + Composition API
- Vue Router 4
- Element Plus UI组件库
- ECharts 图表库
- Axios HTTP客户端
- Vite 构建工具

## 开发环境
- Node.js 16+
- npm/yarn 包管理器
- 现代浏览器支持

## 部署说明
1. 安装依赖: \
pm install\
2. 启动开发服务器: \
pm run dev\
3. 构建生产版本: \
pm run build\
4. 预览生产版本: \
pm run preview\

## 注意事项
- 确保后端服务运行在 localhost:8000
- 图表数据需要后端提供相应的API接口
- 所有模拟数据功能已移除，仅使用真实API数据
- 应用默认进入数据展示页面，无需额外的主页
