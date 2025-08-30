# StockVueVision API对接方案总结

## 📋 项目概述

StockVueVision是一个基于Vue 3的股票投资决策系统前端项目，本文档总结了前端与后端API对接的完整方案。

## 🏗️ 架构设计

### 1. 分层架构
```
┌─────────────────────────────────────┐
│            Vue组件层                │
├─────────────────────────────────────┤
│            API服务层                │
├─────────────────────────────────────┤
│           数据转换层                │
├─────────────────────────────────────┤
│           缓存管理层                │
├─────────────────────────────────────┤
│            HTTP客户端层             │
├─────────────────────────────────────┤
│           配置管理层                │
└─────────────────────────────────────┘
```

### 2. 核心模块
- **配置管理**: `src/config/api.config.js`
- **HTTP客户端**: `src/utils/httpClient.js`
- **数据转换**: `src/utils/dataTransformers.js`
- **缓存管理**: `src/utils/cacheManager.js`
- **API服务**: `src/api/*.js`

## 🔧 核心功能

### 1. 统一HTTP客户端
- ✅ 请求/响应拦截器
- ✅ 统一错误处理
- ✅ 自动重试机制
- ✅ 请求追踪和日志
- ✅ 认证token管理

### 2. 智能缓存系统
- ✅ 多级缓存策略
- ✅ 自动过期清理
- ✅ 缓存命中统计
- ✅ 内存使用监控
- ✅ 灵活的TTL配置

### 3. 数据格式转换
- ✅ 后端数据标准化
- ✅ 前端组件适配
- ✅ 数据验证和清理
- ✅ 错误容错处理
- ✅ 类型安全检查

### 4. 环境配置管理
- ✅ 开发/测试/生产环境
- ✅ 动态配置加载
- ✅ API端点管理
- ✅ 超时和重试配置

## 📡 API接口清单

### 用户认证
| 接口 | 路径 | 方法 | 功能 | 认证 |
|------|------|------|------|------|
| 发送验证码 | `/api/auth/send-code/` | POST | 发送手机验证码 | ❌ |
| 登录/注册 | `/api/auth/login/` | POST | 手机号验证码登录 | ❌ |
| 刷新令牌 | `/api/auth/refresh/` | POST | 刷新访问令牌 | 🔑 |
| 退出登录 | `/api/auth/logout/` | POST | 注销用户会话 | 🔑 |
| 用户信息 | `/api/auth/profile/` | GET | 获取当前用户信息 | 🔑 |

### 账户管理
| 接口 | 路径 | 方法 | 功能 | 认证 |
|------|------|------|------|------|
| 账户信息 | `/api/account-info/` | GET | 获取账户资产和持仓 | 🔑 |
| 资产分类 | `/api/asset-category/` | GET | 获取资产类别分布 | 🔑 |
| 地区分布 | `/api/region-data/` | GET | 获取地区资产分布 | 🔑 |

### 对比分析
| 接口 | 路径 | 方法 | 功能 | 认证 |
|------|------|------|------|------|
| 地区对比 | `/api/areacomparsion/area_comparison/` | GET | 地区资产对比分析 | 🔑 |
| 年度对比 | `/api/timecomparison/yearly_comparison/` | GET | 年度时间段对比 | 🔑 |
| 周度对比 | `/api/timecomparison/weekly_comparison/` | GET | 周度时间段对比 | 🔑 |

### 策略执行
| 接口 | 路径 | 方法 | 功能 | 认证 |
|------|------|------|------|------|
| 策略执行 | `/api/strategy/execute/` | POST | 执行投资策略 | 🔑 |
| 策略结果 | `/api/strategy/result/` | GET | 获取执行结果 | 🔑 |
| 策略配置 | `/api/strategy/config/` | GET | 获取策略配置 | 🔑 |

### 股票数据
| 接口 | 路径 | 方法 | 功能 | 认证 |
|------|------|------|------|------|
| 实时报价 | `/api/stock/quote/` | GET | 获取股票实时价格 | 🔑 |
| 历史数据 | `/api/stock/history/` | GET | 获取历史K线数据 | 🔑 |
| 实时行情 | `/api/stock/realtime/` | GET | 获取实时行情 | 🔑 |

## 🚀 使用方法

### 1. 基础配置
```javascript
// 在组件中使用
import { httpClient } from '@/utils/httpClient';
import { cacheManager } from '@/utils/cacheManager';
import { transformAssetCategoryData } from '@/utils/dataTransformers';

// 发起API请求
const response = await httpClient.get('/api/asset-category/');
const data = transformAssetCategoryData(response.data);
```

### 2. 缓存使用
```javascript
// 设置缓存
cacheManager.set('account', 'info', accountData);

// 获取缓存
const cachedData = cacheManager.get('account', 'info');
if (cachedData) {
  return cachedData;
}
```

### 3. 数据转换
```javascript
// 转换后端数据格式
const transformedData = transformAssetCategoryData(backendData);

// 验证数据
if (validateData(transformedData, 'array')) {
  // 使用转换后的数据
}
```

## 🔒 安全特性

### 1. 认证授权
- JWT Bearer Token认证
- 双Token机制（access_token + refresh_token）
- 自动token刷新
- 未授权自动跳转登录页
- 手机号验证码登录

### 2. 数据安全
- 请求参数验证
- 响应数据校验
- XSS防护

### 3. 网络安全
- HTTPS强制
- CORS配置
- 请求签名验证

## 📊 性能优化

### 1. 缓存策略
- 用户信息: 30分钟
- 账户信息: 5分钟
- 股票报价: 30秒
- 图表数据: 10分钟
- 策略结果: 2分钟
- 验证码状态: 60秒

### 2. 请求优化
- 请求去重
- 批量请求
- 分页加载
- 懒加载

### 3. 错误处理
- 自动重试
- 降级策略
- 用户友好提示

## 🧪 测试策略

### 1. 单元测试
- API函数测试
- 数据转换测试
- 缓存功能测试

### 2. 集成测试
- API连通性测试
- 端到端数据流测试
- 错误处理测试

### 3. 性能测试
- 缓存命中率测试
- 响应时间测试
- 内存使用测试

## 🚀 部署配置

### 1. 开发环境
```bash
npm run dev
# API地址: http://localhost:8000
# 使用模拟数据: true
```

### 2. 生产环境
```bash
npm run build
# API地址: https://your-production-api.com
# 使用模拟数据: false
```

### 3. 环境变量
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_DATA=true
VITE_TOKEN_STORAGE_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token

# .env.production
VITE_API_BASE_URL=https://your-production-api.com
VITE_USE_MOCK_DATA=false
VITE_TOKEN_STORAGE_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token
```

## 📈 监控和日志

### 1. 性能监控
- API响应时间
- 缓存命中率
- 错误率统计
- 内存使用情况

### 2. 日志记录
- 请求日志
- 错误日志
- 性能日志
- 用户操作日志

### 3. 告警机制
- API异常告警
- 性能下降告警
- 错误率超标告警

## 🔄 维护和更新

### 1. 定期维护
- 缓存清理
- 日志归档
- 性能优化
- 安全更新

### 2. 版本管理
- API版本控制
- 向后兼容
- 渐进式升级
- 回滚机制

## 📚 相关文档

- [API对接指南](./API_INTEGRATION_GUIDE.md) - 详细的API对接说明
- [组件使用说明](./README.md) - 组件使用方法
- [开发指南](./DEVELOPMENT.md) - 开发环境搭建

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📞 技术支持

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 技术文档: [项目Wiki](https://github.com/your-repo/wiki)
- 开发团队: dev-team@yourcompany.com

---

**注意**: 本文档会随着项目发展持续更新，请关注最新版本。
