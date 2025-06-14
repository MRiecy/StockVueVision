# 模拟数据使用说明

## 概述

此应用已配置为使用模拟数据模式，让您在后端服务未连接的情况下也能预览完整的应用效果。

## 功能特性

### 🎯 模拟数据涵盖范围

- **账户信息**: 包含完整的账户资产和持仓数据
- **资产类别分布**: 各类股票的投资分布情况
- **地区分布**: 不同地区的投资比例分析
- **时间序列**: 12个月的历史资产变化趋势
- **年度对比**: 2022-2024年的年度投资表现
- **每周对比**: 最近6周的投资变化情况
- **地区对比**: 各地区投资回报率对比分析

### 📊 模拟数据内容

#### 账户信息
- 总资产：410万元
- 现金：125万元
- 市值：285万元
- 包含5只不同类型的股票持仓

#### 投资组合
- 银行股（浦发银行、平安银行）
- 白酒股（贵州茅台、五粮液）
- 科技股（海康威视）

#### 地区分布
- 上海：28.8%（82万元）
- 深圳：25.0%（71.25万元）
- 北京：20.0%（57万元）
- 其他地区：26.2%

## 如何使用

### 启动应用

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打开浏览器访问应用，您会在右上角看到"模拟数据模式"提示

### 切换数据模式

要在模拟数据和真实API之间切换，请修改 `src/api/mockData.js` 文件中的配置：

```javascript
// 设置为 true 使用模拟数据，false 使用真实API
export const USE_MOCK_DATA = true;
```

### 自定义模拟数据

您可以在 `src/api/mockData.js` 文件中修改模拟数据：

- `mockAccountData`: 账户和持仓信息
- `mockAssetCategoryData`: 资产类别分布
- `mockRegionData`: 地区分布数据
- `mockTimeData`: 时间序列数据
- `mockYearlyComparisonData`: 年度对比数据
- `mockRegionComparisonData`: 地区对比数据

## 页面展示效果

### 主页面（DisplayPage）
- 账户总览卡片
- 资产分布饼图
- 地区分布图表
- 时间序列趋势图

### 对比分析页面（ComparisonPage）
- 年度投资表现对比
- 每周收益率变化
- 地区投资回报率排名

## 开发提示

### 网络延迟模拟
所有模拟API都包含300-700ms的延迟，模拟真实网络请求体验。

### 控制台日志
在浏览器控制台中，您可以看到详细的API调用日志：
- ✅ 表示使用模拟数据
- 🔄 表示从错误中回退到模拟数据

### 响应数据格式
模拟数据严格按照后端API的预期格式设计，确保前端组件正常工作。

## 后端连接

当后端服务准备就绪时：

1. 将 `USE_MOCK_DATA` 设置为 `false`
2. 确保后端服务在 `http://localhost:8000` 运行
3. 所有API调用将自动切换到真实后端

如果后端连接失败，应用会自动回退到模拟数据，确保用户体验不中断。

## 故障排除

### 如果看不到数据
1. 检查浏览器控制台是否有错误
2. 确认 `USE_MOCK_DATA` 为 `true`
3. 检查组件是否正确导入API函数

### 如果样式异常
1. 确保所有CSS文件正确加载
2. 检查Vue组件的style标签
3. 验证响应式设计在不同屏幕尺寸下的表现

## 技术实现

- **Vue 3 Composition API**: 现代化的组件开发方式
- **Promise延迟**: 模拟真实网络请求
- **错误处理**: 优雅的错误降级到模拟数据
- **类型安全**: 严格的数据格式验证

---

🚀 现在您可以体验完整的股票投资管理系统功能！ 