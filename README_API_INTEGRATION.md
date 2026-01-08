# StockVueVision API对接方案总结

## 📋 项目概述

StockVueVision是一个基于Vue 3的股票投资决策系统前端项目，本文档总结了前端与后端API对接的完整方案。

## 📑 目录

- [项目概述](#-项目概述)
- [架构设计](#-架构设计)
- [核心功能](#-核心功能)
- [API接口清单](#-api接口清单)
- [**后端数据格式规范**](#-后端数据格式规范) ⭐ 重点
  - [用户认证接口](#1-用户认证接口)
  - [账户管理接口](#2-账户管理接口)
  - [对比分析接口](#3-对比分析接口)
  - [策略执行接口](#4-策略执行接口)
  - [股票数据接口](#5-股票数据接口)
- [数据格式注意事项](#-数据格式注意事项)
- [前端数据使用场景](#-前端数据使用场景)
- [使用方法](#-使用方法)
- [安全特性](#-安全特性)
- [性能优化](#-性能优化)
- [常见问题（FAQ）](#-常见问题faq) ⭐ 必读
- [调试建议](#-调试建议)
- [重要提醒](#-重要提醒) ⭐ 测试清单

---

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
| 策略暂停 | `/api/strategy/pause/` | POST | 暂停策略执行 | 🔑 |
| 策略恢复 | `/api/strategy/resume/` | POST | 恢复策略执行 | 🔑 |
| 交易日志 | `/api/strategy/trade-log/` | GET | 获取交易日志 | 🔑 |
| 导出交易数据 | `/api/strategy/export/` | GET | 导出交易数据（CSV/Excel） | 🔑 |

### 股票数据（历史与实时行情）
| 接口 | 路径 | 方法 | 功能 | 认证 |
|------|------|------|------|------|
| 历史行情数据 | `/api/market/history/` | GET | 获取历史K线数据（日线） | 🔑 |
| 实时行情订阅 | `/api/market/realtime/` | GET | 获取实时行情数据 | 🔑 |
| 批量下载历史数据 | `/api/market/batch-download/` | POST | 批量下载历史行情数据 | 🔑 |

### 风险监控
| 接口 | 路径 | 方法 | 功能 | 认证 |
|------|------|------|------|------|
| 风险指标 | `/api/risk/indicators/` | GET | 获取实时风险指标 | 🔑 |
| 风险阈值设置 | `/api/risk/threshold/` | POST | 设置风险预警阈值 | 🔑 |
| 风险预警历史 | `/api/risk/warnings/` | GET | 获取风险预警历史 | 🔑 |

## 📝 后端数据格式规范

### 1. 用户认证接口

#### 1.1 发送验证码 - POST `/api/auth/send-code/`

**请求参数：**
```json
{
  "phone": "13888888888"
}
```

**响应格式：**
```json
{
  "success": true,
  "message": "验证码已发送",
  "data": {
    "expire_time": 300,
    "can_resend_time": 60
  }
}
```

**字段说明：**
- `success`: 布尔值，是否成功
- `message`: 字符串，提示信息
- `data.expire_time`: 整数，验证码过期时间（秒）
- `data.can_resend_time`: 整数，可重新发送时间（秒）

#### 1.2 登录/注册 - POST `/api/auth/login/`

**请求参数：**
```json
{
  "phone": "13888888888",
  "code": "123456"
}
```

**响应格式：**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "user_id": "user_001",
      "phone": "13888888888",
      "nickname": "用户昵称",
      "avatar": "https://example.com/avatar.jpg",
      "is_new_user": false,
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-25T10:30:00Z"
    },
    "token": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 3600
    }
  }
}
```

**字段说明：**
- `user.user_id`: 字符串，用户唯一标识
- `user.phone`: 字符串，手机号
- `user.nickname`: 字符串，用户昵称
- `user.avatar`: 字符串，头像URL（可选）
- `user.is_new_user`: 布尔值，是否新用户
- `user.created_at`: 字符串，注册时间（ISO 8601格式）
- `user.last_login`: 字符串，最后登录时间（ISO 8601格式）
- `token.access_token`: 字符串，访问令牌
- `token.refresh_token`: 字符串，刷新令牌
- `token.token_type`: 字符串，令牌类型（固定为"Bearer"）
- `token.expires_in`: 整数，令牌过期时间（秒）

#### 1.3 刷新令牌 - POST `/api/auth/refresh/`

**请求头：**
```
Authorization: Bearer {refresh_token}
```

**响应格式：**
```json
{
  "success": true,
  "message": "Token刷新成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

#### 1.4 用户信息 - GET `/api/auth/profile/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "user_id": "user_001",
    "phone": "13888888888",
    "nickname": "用户昵称",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-25T10:30:00Z",
    "account_status": "active",
    "permissions": ["read", "write", "admin"]
  }
}
```

### 2. 账户管理接口

#### 2.1 账户信息 - GET `/api/account-info/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "accounts": [
    {
      "account_id": "DEMO000001",
      "account_type": "STOCK",
      "cash": 1250000.00,
      "frozen_cash": 75000.00,
      "market_value": 2850000.00,
      "total_asset": 4100000.00,
      "positions": [
        {
          "account_id": "DEMO000001",
          "account_type": "STOCK",
          "stock_code": "600000.SH",
          "stock_name": "浦发银行",
          "volume": 10000,
          "can_use_volume": 10000,
          "open_price": 12.50,
          "market_value": 125000.00,
          "frozen_volume": 0,
          "on_road_volume": 0,
          "yesterday_volume": 10000,
          "avg_price": 11.80
        }
      ]
    }
  ]
}
```

**字段说明：**
- `accounts`: 数组，账户列表
  - `account_id`: 字符串，账户ID
  - `account_type`: 字符串，账户类型（STOCK/FUTURE/OPTION等）
  - `cash`: 数字，可用现金（元）
  - `frozen_cash`: 数字，冻结资金（元）
  - `market_value`: 数字，持仓市值（元）
  - `total_asset`: 数字，总资产（元）
  - `positions`: 数组，持仓列表
    - `stock_code`: 字符串，股票代码（如"600000.SH"）
    - `stock_name`: 字符串，股票名称
    - `volume`: 整数，持仓数量（股）
    - `can_use_volume`: 整数，可用数量（股）
    - `open_price`: 数字，当前价格（元）
    - `market_value`: 数字，持仓市值（元）
    - `frozen_volume`: 整数，冻结数量（股）
    - `on_road_volume`: 整数，在途数量（股）
    - `yesterday_volume`: 整数，昨日持仓（股）
    - `avg_price`: 数字，持仓成本价（元）

#### 2.2 资产分类 - GET `/api/asset-category/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "categoryData": [
    {
      "name": "银行股",
      "value": 216000.00,
      "percentage": 7.6
    },
    {
      "name": "白酒股",
      "value": 228000.00,
      "percentage": 8.0
    }
  ]
}
```

**字段说明：**
- `categoryData`: 数组，资产类别列表
  - `name`: 字符串，类别名称
  - `value`: 数字，类别市值（元）
  - `percentage`: 数字，占比（百分比，不带%符号）

#### 2.3 地区分布 - GET `/api/region-data/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "regionData": [
    {
      "region": "上海",
      "value": 820000.00,
      "percentage": 28.8
    },
    {
      "region": "深圳",
      "value": 712500.00,
      "percentage": 25.0
    }
  ]
}
```

**字段说明：**
- `regionData`: 数组，地区分布列表
  - `region`: 字符串，地区名称
  - `value`: 数字，地区资产（元）
  - `percentage`: 数字，占比（百分比，不带%符号）

### 3. 对比分析接口

#### 3.1 地区对比 - GET `/api/areacomparsion/area_comparison/`

**请求参数：**
```
account_id=DEMO000001
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "region_data": [
    {
      "region": "上海",
      "totalAssets": 820000.00,
      "returnRate": "8.5%",
      "investmentRate": "28.8%"
    },
    {
      "region": "深圳",
      "totalAssets": 712500.00,
      "returnRate": "7.8%",
      "investmentRate": "25.0%"
    }
  ]
}
```

**字段说明：**
- `region_data`: 数组，地区对比数据
  - `region`: 字符串，地区名称
  - `totalAssets`: 数字，总资产（元）
  - `returnRate`: 字符串，收益率（带%符号）
  - `investmentRate`: 字符串，投资占比（带%符号）

#### 3.2 年度对比 - GET `/api/timecomparison/yearly_comparison/`

**请求参数：**
```
account_id=DEMO000001
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "yearly_data": [
    {
      "timePeriod": "2022",
      "totalAssets": 3200000.00,
      "marketValue": 2400000.00,
      "returnRate": 4.2,
      "growthRate": 8.5
    },
    {
      "timePeriod": "2023",
      "totalAssets": 3650000.00,
      "marketValue": 2650000.00,
      "returnRate": 5.8,
      "growthRate": 14.1
    },
    {
      "timePeriod": "2024",
      "totalAssets": 4100000.00,
      "marketValue": 2850000.00,
      "returnRate": 8.0,
      "growthRate": 12.3
    }
  ],
  "current_total_assets": 4100000.00,
  "current_market_value": 2850000.00,
  "current_return_rate": 8.0,
  "is_mock": false
}
```

**字段说明：**
- `yearly_data`: 数组，年度对比数据
  - `timePeriod`: 字符串，年份（如"2024"）
  - `totalAssets`: 数字，总资产（元）
  - `marketValue`: 数字，市值（元）
  - `returnRate`: 数字，收益率（百分比，不带%）
  - `growthRate`: 数字，增长率（百分比，不带%）
- `current_total_assets`: 数字，当前总资产（元）
- `current_market_value`: 数字，当前市值（元）
- `current_return_rate`: 数字，当前收益率（百分比，不带%）
- `is_mock`: 布尔值，是否为模拟数据

#### 3.3 周度对比 - GET `/api/timecomparison/weekly_comparison/`

**请求参数：**
```
account_id=DEMO000001
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "weekly_data": [
    {
      "timePeriod": "2024-W01",
      "totalAssets": 3984000.00,
      "marketValue": 2772000.00,
      "returnRate": 6.2,
      "growthRate": 9.8
    },
    {
      "timePeriod": "2024-W02",
      "totalAssets": 4018000.00,
      "marketValue": 2793000.00,
      "returnRate": 6.5,
      "growthRate": 10.3
    }
  ],
  "current_total_assets": 4100000.00,
  "current_market_value": 2850000.00,
  "current_return_rate": 8.0,
  "is_mock": false
}
```

**字段说明：**
- `weekly_data`: 数组，周度对比数据
  - `timePeriod`: 字符串，周期标识（格式："YYYY-WXX"，如"2024-W01"）
  - `totalAssets`: 数字，总资产（元）
  - `marketValue`: 数字，市值（元）
  - `returnRate`: 数字，收益率（百分比，不带%）
  - `growthRate`: 数字，增长率（百分比，不带%）
- `current_total_assets`: 数字，当前总资产（元）
- `current_market_value`: 数字，当前市值（元）
- `current_return_rate`: 数字，当前收益率（百分比，不带%）
- `is_mock`: 布尔值，是否为模拟数据

### 4. 策略执行接口

#### 4.1 策略执行 - POST `/api/strategy/execute/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**请求参数：**
```json
{
  "strategy_id": "strategy_001",
  "account_id": "DEMO000001",
  "parameters": {
    "stop_loss": 0.05,
    "take_profit": 0.15,
    "position_size": 0.3
  }
}
```

**响应格式：**
```json
{
  "success": true,
  "message": "策略执行成功",
  "data": {
    "execution_id": "exec_20240125_001",
    "strategy_id": "strategy_001",
    "status": "running",
    "start_time": "2024-01-25T10:30:00Z"
  }
}
```

#### 4.2 策略结果 - GET `/api/strategy/result/`

**请求参数：**
```
execution_id=exec_20240125_001
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "execution_id": "exec_20240125_001",
    "strategy_id": "strategy_001",
    "status": "completed",
    "start_time": "2024-01-25T10:30:00Z",
    "end_time": "2024-01-25T15:00:00Z",
    "total_return": 12.5,
    "total_trades": 15,
    "win_rate": 73.3,
    "max_drawdown": -3.2,
    "sharpe_ratio": 1.85,
    "trades": [
      {
        "trade_id": "trade_001",
        "stock_code": "600000.SH",
        "stock_name": "浦发银行",
        "direction": "buy",
        "price": 12.50,
        "volume": 1000,
        "timestamp": "2024-01-25T10:35:00Z",
        "profit": 250.00
      }
    ]
  }
}
```

**字段说明：**
- `execution_id`: 字符串，执行ID
- `strategy_id`: 字符串，策略ID
- `status`: 字符串，状态（running/completed/failed）
- `start_time`: 字符串，开始时间（ISO 8601格式）
- `end_time`: 字符串，结束时间（ISO 8601格式，可选）
- `total_return`: 数字，总收益率（百分比，不带%）
- `total_trades`: 整数，交易次数
- `win_rate`: 数字，胜率（百分比，不带%）
- `max_drawdown`: 数字，最大回撤（百分比，负数，不带%）
- `sharpe_ratio`: 数字，夏普比率
- `trades`: 数组，交易记录
  - `trade_id`: 字符串，交易ID
  - `stock_code`: 字符串，股票代码
  - `stock_name`: 字符串，股票名称
  - `direction`: 字符串，方向（buy/sell）
  - `price`: 数字，价格（元）
  - `volume`: 整数，数量（股）
  - `timestamp`: 字符串，时间戳（ISO 8601格式）
  - `profit`: 数字，盈亏（元）

### 5. 历史与实时行情数据接口

#### 5.1 历史行情数据 - GET `/api/market/history/`

**请求参数：**
```
stock_code=600000.SH
start_date=2024-01-01
end_date=2024-01-25
period=day
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "symbol": "600000.SH",
    "period": "day",
    "data": [
      {
        "time": 1704124800,
        "date": "2024-01-02",
        "open": 12.30,
        "high": 12.58,
        "low": 12.25,
        "close": 12.50,
        "volume": 98560000,
        "amount": 1232500000.00,
        "preClose": 12.25,
        "suspendFlag": 0
      }
    ]
  }
}
```

**字段说明：**
- `symbol`: 字符串，股票代码
- `period`: 字符串，周期类型（day/week/month）
- `data`: 数组，历史数据列表
  - `time`: 整数，时间戳（秒）
  - `date`: 字符串，日期（YYYY-MM-DD格式）
  - `open`: 数字，开盘价（元）
  - `high`: 数字，最高价（元）
  - `low`: 数字，最低价（元）
  - `close`: 数字，收盘价（元）
  - `volume`: 数字，成交量（股）
  - `amount`: 数字，成交额（元）
  - `preClose`: 数字，前收盘价（元）
  - `suspendFlag`: 整数，停牌标志（1停牌，0不停牌）

#### 5.2 实时行情订阅 - GET `/api/market/realtime/`

**请求参数：**
```
stock_codes=600000.SH,000001.SZ
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "600000.SH",
      "time": 1706172600,
      "timestamp": "2024-01-25T14:30:00Z",
      "open": 12.38,
      "high": 12.68,
      "low": 12.35,
      "close": 12.50,
      "lastPrice": 12.50,
      "volume": 125680000,
      "amount": 1570850000.00,
      "preClose": 12.25,
      "change": 0.25,
      "changePercent": "2.04%",
      "suspendFlag": 0
    }
  ]
}
```

**字段说明：**
- `symbol`: 字符串，股票代码
- `time`: 整数，时间戳（秒）
- `timestamp`: 字符串，时间戳（ISO 8601格式）
- `open`: 数字，今开盘价（元）
- `high`: 数字，今最高价（元）
- `low`: 数字，今最低价（元）
- `close`: 数字，最新价（元）
- `lastPrice`: 数字，最新价（元）
- `volume`: 数字，成交量（股）
- `amount`: 数字，成交额（元）
- `preClose`: 数字，昨收盘价（元）
- `change`: 数字，涨跌额（元）
- `changePercent`: 字符串，涨跌幅（带%符号）
- `suspendFlag`: 整数，停牌标志（1停牌，0不停牌）

#### 5.3 批量下载历史数据 - POST `/api/market/batch-download/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**请求参数：**
```json
{
  "stock_codes": ["600000.SH", "000001.SZ", "300001.SZ"],
  "start_date": "2024-01-01",
  "end_date": "2024-01-25",
  "period": "day"
}
```

**响应格式：**
```json
{
  "success": true,
  "message": "批量下载任务已创建",
  "data": {
    "task_id": "download_task_20240125_001",
    "total_stocks": 3,
    "status": "processing",
    "created_at": "2024-01-25T10:30:00Z"
  }
}
```

**字段说明：**
- `task_id`: 字符串，任务ID
- `total_stocks`: 整数，股票总数
- `status`: 字符串，任务状态（processing/completed/failed）
- `created_at`: 字符串，创建时间（ISO 8601格式）

### 6. 策略执行扩展接口

#### 6.1 策略暂停 - POST `/api/strategy/pause/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**请求参数：**
```json
{
  "execution_id": "exec_20240125_001"
}
```

**响应格式：**
```json
{
  "success": true,
  "message": "策略已暂停",
  "data": {
    "execution_id": "exec_20240125_001",
    "status": "paused",
    "paused_at": "2024-01-25T14:30:00Z"
  }
}
```

#### 6.2 策略恢复 - POST `/api/strategy/resume/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**请求参数：**
```json
{
  "execution_id": "exec_20240125_001"
}
```

**响应格式：**
```json
{
  "success": true,
  "message": "策略已恢复",
  "data": {
    "execution_id": "exec_20240125_001",
    "status": "running",
    "resumed_at": "2024-01-25T14:35:00Z"
  }
}
```

#### 6.3 交易日志 - GET `/api/strategy/trade-log/`

**请求参数：**
```
execution_id=exec_20240125_001
page=1
page_size=50
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "execution_id": "exec_20240125_001",
    "logs": [
      {
        "log_id": "log_001",
        "timestamp": "2024-01-25T10:35:00Z",
        "level": "info",
        "event_type": "trade",
        "message": "买入成功",
        "details": {
          "stock_code": "600000.SH",
          "stock_name": "浦发银行",
          "direction": "buy",
          "price": 12.50,
          "volume": 1000,
          "amount": 12500.00
        }
      },
      {
        "log_id": "log_002",
        "timestamp": "2024-01-25T11:20:00Z",
        "level": "warning",
        "event_type": "risk",
        "message": "持仓波动率超过阈值",
        "details": {
          "indicator": "volatility",
          "current_value": 15.2,
          "threshold": 15.0
        }
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 50,
      "total": 156,
      "total_pages": 4
    }
  }
}
```

**字段说明：**
- `log_id`: 字符串，日志ID
- `timestamp`: 字符串，时间戳（ISO 8601格式）
- `level`: 字符串，日志级别（info/warning/error）
- `event_type`: 字符串，事件类型（trade/risk/system/strategy）
- `message`: 字符串，日志信息
- `details`: 对象，详细信息

#### 6.4 导出交易数据 - GET `/api/strategy/export/`

**请求参数：**
```
execution_id=exec_20240125_001
format=csv
start_date=2024-01-01
end_date=2024-01-25
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
文件下载（CSV或Excel格式）

**响应头：**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="trade_data_20240125.csv"
```

**CSV内容示例：**
```csv
交易ID,时间,股票代码,股票名称,方向,价格,数量,金额,盈亏
trade_001,2024-01-25 10:35:00,600000.SH,浦发银行,买入,12.50,1000,12500.00,0.00
trade_002,2024-01-25 14:20:00,600000.SH,浦发银行,卖出,12.75,1000,12750.00,250.00
```

### 7. 风险监控接口

#### 7.1 风险指标 - GET `/api/risk/indicators/`

**请求参数：**
```
account_id=DEMO000001
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "account_id": "DEMO000001",
    "timestamp": "2024-01-25T15:00:00Z",
    "indicators": {
      "volatility": {
        "value": 12.5,
        "unit": "%",
        "status": "normal",
        "threshold": 15.0,
        "description": "波动率"
      },
      "max_drawdown": {
        "value": -8.3,
        "unit": "%",
        "status": "warning",
        "threshold": -10.0,
        "description": "最大回撤"
      },
      "var": {
        "value": 3.2,
        "unit": "%",
        "status": "normal",
        "threshold": 5.0,
        "description": "VaR值（95%置信度）"
      },
      "sharpe_ratio": {
        "value": 1.85,
        "unit": "",
        "status": "normal",
        "threshold": 1.0,
        "description": "夏普比率"
      },
      "position_concentration": {
        "value": 28.5,
        "unit": "%",
        "status": "normal",
        "threshold": 30.0,
        "description": "持仓集中度（最大单股占比）"
      }
    }
  }
}
```

**字段说明：**
- `account_id`: 字符串，账户ID
- `timestamp`: 字符串，计算时间（ISO 8601格式）
- `indicators`: 对象，风险指标集合
  - 每个指标包含：
    - `value`: 数字，当前值
    - `unit`: 字符串，单位
    - `status`: 字符串，状态（normal/warning/danger）
    - `threshold`: 数字，预警阈值
    - `description`: 字符串，指标描述

#### 7.2 风险阈值设置 - POST `/api/risk/threshold/`

**请求头：**
```
Authorization: Bearer {access_token}
```

**请求参数：**
```json
{
  "account_id": "DEMO000001",
  "thresholds": {
    "volatility": 15.0,
    "max_drawdown": -10.0,
    "var": 5.0,
    "sharpe_ratio": 1.0,
    "position_concentration": 30.0
  }
}
```

**响应格式：**
```json
{
  "success": true,
  "message": "风险阈值设置成功",
  "data": {
    "account_id": "DEMO000001",
    "thresholds": {
      "volatility": 15.0,
      "max_drawdown": -10.0,
      "var": 5.0,
      "sharpe_ratio": 1.0,
      "position_concentration": 30.0
    },
    "updated_at": "2024-01-25T15:00:00Z"
  }
}
```

#### 7.3 风险预警历史 - GET `/api/risk/warnings/`

**请求参数：**
```
account_id=DEMO000001
start_date=2024-01-01
end_date=2024-01-25
page=1
page_size=20
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "account_id": "DEMO000001",
    "warnings": [
      {
        "warning_id": "warn_001",
        "timestamp": "2024-01-25T14:30:00Z",
        "level": "warning",
        "indicator": "max_drawdown",
        "indicator_name": "最大回撤",
        "current_value": -8.5,
        "threshold": -10.0,
        "message": "最大回撤接近预警线",
        "action": "建议适当降低仓位",
        "status": "active"
      },
      {
        "warning_id": "warn_002",
        "timestamp": "2024-01-25T11:20:00Z",
        "level": "danger",
        "indicator": "volatility",
        "indicator_name": "波动率",
        "current_value": 16.2,
        "threshold": 15.0,
        "message": "波动率超过预警阈值",
        "action": "立即检查持仓并考虑风控措施",
        "status": "resolved",
        "resolved_at": "2024-01-25T13:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

**字段说明：**
- `warning_id`: 字符串，预警ID
- `timestamp`: 字符串，预警时间（ISO 8601格式）
- `level`: 字符串，预警级别（warning/danger）
- `indicator`: 字符串，指标代码
- `indicator_name`: 字符串，指标名称
- `current_value`: 数字，当前值
- `threshold`: 数字，阈值
- `message`: 字符串，预警信息
- `action`: 字符串，建议操作
- `status`: 字符串，状态（active/resolved）
- `resolved_at`: 字符串，解决时间（可选）

### 8. 原有股票数据接口（已弃用，建议使用5.x接口）

#### 8.1 实时报价 - GET `/api/stock/quote/`

**请求参数：**
```
stock_code=600000.SH
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "stock_code": "600000.SH",
  "stock_name": "浦发银行",
  "current_price": 12.50,
  "price_change": 0.25,
  "change_percent": "2.04%",
  "volume": 125680000,
  "turnover": 1570850000.00,
  "high_price": 12.68,
  "low_price": 12.35,
  "open_price": 12.38,
  "prev_close": 12.25,
  "timestamp": "2024-01-25T15:00:00Z"
}
```

**字段说明：**
- `stock_code`: 字符串，股票代码
- `stock_name`: 字符串，股票名称
- `current_price`: 数字，当前价格（元）
- `price_change`: 数字，价格变化（元）
- `change_percent`: 字符串，涨跌幅（带%符号）
- `volume`: 整数，成交量（股）
- `turnover`: 数字，成交额（元）
- `high_price`: 数字，最高价（元）
- `low_price`: 数字，最低价（元）
- `open_price`: 数字，开盘价（元）
- `prev_close`: 数字，昨收价（元）
- `timestamp`: 字符串，时间戳（ISO 8601格式）

#### 5.2 历史数据 - GET `/api/stock/history/`

**请求参数：**
```
stock_code=600000.SH
start_date=2024-01-01
end_date=2024-01-25
```

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应格式：**
```json
{
  "stock_code": "600000.SH",
  "stock_name": "浦发银行",
  "data": [
    {
      "date": "2024-01-02",
      "open": 12.30,
      "high": 12.58,
      "low": 12.25,
      "close": 12.50,
      "volume": 98560000,
      "turnover": 1232500000.00
    },
    {
      "date": "2024-01-03",
      "open": 12.52,
      "high": 12.75,
      "low": 12.48,
      "close": 12.68,
      "volume": 105230000,
      "turnover": 1334560000.00
    }
  ]
}
```

**字段说明：**
- `stock_code`: 字符串，股票代码
- `stock_name`: 字符串，股票名称
- `data`: 数组，历史数据列表
  - `date`: 字符串，日期（YYYY-MM-DD格式）
  - `open`: 数字，开盘价（元）
  - `high`: 数字，最高价（元）
  - `low`: 数字，最低价（元）
  - `close`: 数字，收盘价（元）
  - `volume`: 整数，成交量（股）
  - `turnover`: 数字，成交额（元）

## 📋 数据格式注意事项

### 通用规范
1. **日期时间格式**：统一使用 ISO 8601 格式（如：`2024-01-25T10:30:00Z`）
2. **金额单位**：统一使用人民币元，保留2位小数
3. **百分比**：
   - 带%符号的字符串：用于显示（如：`"8.5%"`）
   - 不带%的数字：用于计算（如：`8.5`）
4. **股票代码格式**：使用标准格式（如：`600000.SH`、`000001.SZ`）
5. **响应状态**：所有接口应包含 `success` 字段表示操作是否成功

### 错误响应格式
所有接口在发生错误时应返回统一格式：
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息",
    "details": {
      "field": "具体错误字段",
      "reason": "错误原因"
    }
  }
}
```

### 分页格式（如需要）
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### HTTP状态码
- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权，需要登录
- `403 Forbidden`: 禁止访问，权限不足
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误
- `503 Service Unavailable`: 服务不可用

## 🎯 前端数据使用场景

### 页面1：资产展示页面（DisplayPage）

**功能模块：账户信息展示模块（需求3.1）**

**使用的API：**
- `/api/account-info/` - 获取账户信息和持仓数据
- `/api/asset-category/` - 获取资产分类分布
- `/api/region-data/` - 获取地区分布

**前端展示内容：**
1. **账户总资产表格**：显示账户ID、总资产、可用金额、持仓市值、总收益率、持仓股数
   - 总收益率计算：`(总资产 - 1000万) / 1000万 × 100%`
2. **持仓明细表格**：显示股票代码、当前价格、持仓数量、成本价、股票市值
   - 按市值降序排序，显示前10条
3. **资产分类饼图/柱状图**：展示不同类别资产的分布
4. **地区分布图表**：展示不同地区的资产配置

### 页面2：对比分析页面（ComparisonPage）

**功能模块：账户资产多维度对比分析模块（需求3.3）**

**使用的API：**
- `/api/areacomparsion/area_comparison/` - 地区对比分析
- `/api/timecomparison/yearly_comparison/` - 年度时间段对比
- `/api/timecomparison/weekly_comparison/` - 周度时间段对比

**前端展示内容：**
1. **地区对比图表**：展示不同地区的总资产、收益率、投资占比
2. **时间段对比图表**：展示不同时期的总资产变化、收益率变化、增长率
3. **对比表格**：详细列出各维度的对比数据
4. **趋势分析**：基于历史数据展示趋势线

### 页面3：登录页面（LoginPage）

**功能模块：用户认证模块**

**使用的API：**
- `/api/auth/send-code/` - 发送验证码
- `/api/auth/login/` - 手机号登录

**前端交互流程：**
1. 用户输入手机号（通过迅投交易终端登录）
2. 点击"发送验证码"按钮，调用发送验证码API
3. 显示倒计时，60秒后允许重新发送
4. 用户输入验证码
5. 点击"登录"按钮，调用登录API
6. 保存token到localStorage
7. 跳转到主页面

### 页面4：策略交易页面（StrategyPage）- 规划中

**功能模块：自动化股票策略实时交易（需求3.4、3.5）**

**使用的API：**
- `/api/strategy/execute/` - 执行策略
- `/api/strategy/result/` - 获取策略结果
- `/api/strategy/pause/` - 暂停策略
- `/api/strategy/resume/` - 恢复策略
- `/api/strategy/trade-log/` - 查看交易日志
- `/api/strategy/export/` - 导出交易数据

**前端展示内容：**
1. **策略配置面板**：设置交易策略、买卖条件、止盈止损
2. **实时交易曲线**：展示策略触发点与交易执行效果
3. **交易详情信息**：实时显示交易价格、成交数量、账户余额变化
4. **盈亏统计**：直观展示实时盈利或亏损情况
5. **交易日志**：记录策略触发与执行情况
6. **数据导出**：支持CSV、Excel等格式导出

### 页面5：风险监控页面（RiskMonitorPage）- 规划中

**功能模块：风险指标实时监控与预警（需求3.6）**

**使用的API：**
- `/api/risk/indicators/` - 获取实时风险指标
- `/api/risk/threshold/` - 设置风险阈值
- `/api/risk/warnings/` - 查看风险预警历史

**前端展示内容：**
1. **风险指标仪表盘**：实时展示波动率、最大回撤、VaR值、夏普比率、持仓集中度
2. **风险阈值设置**：用户可自定义各项风险指标的预警阈值
3. **实时预警面板**：风险指标超过阈值时主动提示
4. **预警历史记录**：查看历史预警信息和处理情况
5. **风险等级显示**：通过颜色区分正常/警告/危险状态

### 页面6：行情数据管理页面（MarketDataPage）- 规划中

**功能模块：资产历史行情数据和实时行情数据（需求3.2）**

**使用的API：**
- `/api/market/history/` - 获取历史行情数据
- `/api/market/realtime/` - 获取实时行情数据
- `/api/market/batch-download/` - 批量下载历史数据

**前端展示内容：**
1. **股票代码管理**：支持Excel批量导入ETF和股票代码
2. **历史数据下载**：按日期范围批量下载历史行情
3. **实时行情订阅**：实时监控选定股票的行情变化
4. **数据可视化**：K线图展示历史数据
5. **下载任务管理**：查看批量下载任务进度

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

### 4. 前端调用示例

#### 4.1 获取账户信息
```javascript
import { fetchAccountInfo } from '@/api/accountApi.js';

// 组件中调用
const loadAccountData = async () => {
  try {
    const data = await fetchAccountInfo();
    if (data && data.accounts) {
      // 处理账户数据
      accounts.value = data.accounts;
    }
  } catch (error) {
    console.error('获取账户信息失败：', error);
  }
};
```

#### 4.2 用户登录
```javascript
import { loginWithPhone } from '@/api/authApi.js';

const handleLogin = async () => {
  try {
    const response = await loginWithPhone({
      phone: '13888888888',
      code: '123456'
    });
    
    if (response.success) {
      // Token已自动保存到localStorage
      // 跳转到主页
      router.push('/display');
    }
  } catch (error) {
    console.error('登录失败：', error);
  }
};
```

#### 4.3 获取年度对比数据
```javascript
import { fetchYearlyComparisonData } from '@/api/timecomparisonApi.js';

const loadYearlyData = async () => {
  try {
    const data = await fetchYearlyComparisonData('DEMO000001');
    if (data && data.yearly_data) {
      // 处理年度数据用于图表展示
      chartData.value = data.yearly_data;
    }
  } catch (error) {
    console.error('获取年度对比数据失败：', error);
  }
};
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

## ❓ 常见问题（FAQ）

### Q1: 为什么有些接口的百分比字段有的带%符号，有的不带？

**A:** 这是为了区分显示和计算两种场景：
- **带%符号的字符串**（如 `"8.5%"`）：用于直接在前端展示，前端不需要再添加%
- **不带%的数字**（如 `8.5`）：用于计算和比较，前端可以进行数学运算

**示例：**
```json
// 地区对比接口 - 用于展示的字符串格式
{
  "returnRate": "8.5%"
}

// 年度对比接口 - 用于计算的数字格式
{
  "returnRate": 8.5
}
```

### Q2: 股票代码格式有什么要求？

**A:** 使用标准的中国股市代码格式：
- **上海A股**：6位代码 + `.SH`（如：`600000.SH`）
- **深圳A股**：6位代码 + `.SZ`（如：`000001.SZ`）
- **创业板**：6位代码 + `.SZ`（如：`300001.SZ`）
- **科创板**：6位代码 + `.SH`（如：`688001.SH`）

### Q3: 日期时间格式为什么使用ISO 8601？

**A:** ISO 8601格式（如 `2024-01-25T10:30:00Z`）是国际标准，具有以下优势：
- 包含时区信息，避免时区混淆
- JavaScript原生支持，可以直接 `new Date(isoString)`
- 可读性好，易于调试
- 前后端统一，减少转换错误

### Q4: 为什么账户信息接口返回的是数组而不是单个对象？

**A:** 考虑到用户可能有多个交易账户：
- 同一用户可能有股票账户、期货账户等多个账户
- 前端需要支持账户切换功能
- 便于未来扩展多账户管理功能

### Q5: 前端如何处理API请求失败的情况？

**A:** 前端实现了完善的容错机制：
1. **自动重试**：网络错误和5xx错误会自动重试（最多3次）
2. **回退到模拟数据**：如果API完全不可用，会使用本地模拟数据
3. **用户友好提示**：显示具体的错误信息给用户
4. **错误日志**：记录所有API错误便于排查

### Q6: Token过期了怎么办？

**A:** 前端实现了自动刷新机制：
1. 每次请求都会检查token是否即将过期
2. 如果access_token过期，自动使用refresh_token刷新
3. 如果refresh_token也过期，清除本地数据并跳转到登录页
4. 用户无需手动处理，体验无缝

### Q7: 持仓数据需要按什么顺序返回？

**A:** 建议按持仓市值降序返回：
- 前端会显示持仓市值最大的前10条记录
- 后端排序比前端排序更高效
- 如果后端未排序，前端也会在本地进行排序

### Q8: 是否需要实现分页功能？

**A:** 目前的接口不需要分页：
- 账户持仓数据：前端只展示前10条，数据量小
- 对比分析数据：通常是固定数量的统计数据
- 如果未来数据量增大，可以通过文档中的分页格式扩展

### Q9: 验证码有什么安全要求？

**A:** 建议实现以下安全措施：
- 验证码有效期：5分钟（300秒）
- 重发间隔：60秒
- 每个手机号每天最多发送10次
- 验证码长度：6位数字
- 验证错误次数限制：连续错误3次后锁定10分钟

### Q10: 前端是否需要处理大数字精度问题？

**A:** 是的，前端已经做了处理：
- 金额使用2位小数显示
- 百分比使用1-2位小数显示
- 持仓数量使用整数显示
- 建议后端也保持相同精度返回，避免前端四舍五入

### Q11: 迅投API返回的数据如何转换为前端需要的格式？

**A:** 后端需要进行数据转换：
- **迅投账户信息** → 转换为统一的账户数据格式
- **迅投持仓信息** → 按市值排序后返回前10条
- **总收益率计算**：后端需要计算 `(asset.total_asset - 10000000) / 10000000 × 100%`
- 字段命名统一：迅投的字段名转换为文档中规定的字段名

**迅投字段映射示例：**
```python
# xt_trader.query_stock_asset() 返回的字段 → 前端需要的字段
{
  "total_asset": asset.total_asset,        # 总资产
  "cash": asset.cash,                      # 可用金额
  "frozen_cash": asset.frozen_cash,        # 冻结金额
  "market_value": asset.market_value       # 持仓市值
}
```

### Q12: 行情数据存储在MongoDB中，如何保证查询效率？

**A:** 建议的数据库设计：
1. **创建索引**：
   - `symbol` + `time` 复合索引（用于时间范围查询）
   - `symbol` 单字段索引（用于单股票查询）
2. **数据分表策略**：
   - 按年份或季度分表，避免单表过大
   - 历史数据和实时数据分开存储
3. **缓存策略**：
   - 热门股票数据缓存到Redis
   - 实时数据优先从缓存读取

### Q13: 批量下载历史数据时，如何避免接口超时？

**A:** 采用异步任务机制：
1. 接收批量下载请求后，立即返回任务ID
2. 后台异步执行下载任务
3. 前端轮询或WebSocket推送任务进度
4. 任务完成后通知前端

**响应示例：**
```json
{
  "task_id": "download_task_20240125_001",
  "status": "processing",
  "progress": 45,
  "total": 100
}
```

### Q14: 风险指标如何实时计算？

**A:** 建议采用以下方案：
1. **定时计算**：每分钟或每5分钟计算一次风险指标
2. **缓存结果**：将计算结果缓存，减少重复计算
3. **增量更新**：当有新交易时，增量更新相关指标
4. **指标计算公式**：
   - **波动率**：基于最近N个交易日的收益率标准差
   - **最大回撤**：`(当前净值 - 历史最高净值) / 历史最高净值`
   - **夏普比率**：`(年化收益率 - 无风险利率) / 年化波动率`

### Q15: 策略执行状态如何实时同步到前端？

**A:** 推荐使用WebSocket或SSE（Server-Sent Events）：
1. **WebSocket方案**：双向通信，实时性最好
2. **SSE方案**：单向推送，实现简单
3. **轮询方案**：兼容性最好，但实时性较差

**状态推送示例：**
```json
{
  "event": "strategy_status",
  "execution_id": "exec_20240125_001",
  "status": "running",
  "data": {
    "total_trades": 15,
    "current_profit": 12500.00,
    "timestamp": "2024-01-25T14:30:00Z"
  }
}
```

## 🔧 调试建议

### 1. API测试工具
推荐使用以下工具测试API：
- **Postman**：图形化界面，适合手动测试
- **curl**：命令行工具，适合脚本测试
- **Apifox**：国产工具，支持协作

### 2. 测试数据建议
提供以下测试账户数据：
```json
{
  "test_user_1": {
    "phone": "13800138000",
    "code": "123456",
    "accounts": ["TEST000001"],
    "description": "正常测试账户，有完整持仓"
  },
  "test_user_2": {
    "phone": "13800138001", 
    "code": "123456",
    "accounts": [],
    "description": "空账户测试，无持仓"
  },
  "test_user_3": {
    "phone": "13800138002",
    "code": "123456",
    "accounts": ["TEST000003"],
    "description": "大量持仓测试，100+持仓"
  }
}
```

### 3. 响应时间要求
- **登录接口**：< 2秒
- **账户信息**：< 3秒
- **图表数据**：< 5秒
- **实时报价**：< 1秒

### 4. 跨域配置（CORS）
后端需要配置CORS允许前端跨域访问：
```python
# Django示例
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite开发服务器
    "http://localhost:3000",
    "https://your-frontend-domain.com"
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ['*']
```

## 📞 技术支持

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 技术文档: [项目Wiki](https://github.com/your-repo/wiki)
- 开发团队: dev-team@yourcompany.com

---

## 📌 重要提醒

### 给后端开发人员的建议：

1. **严格按照文档中的数据格式返回**，字段名、数据类型都要完全一致
2. **所有接口统一返回JSON格式**，Content-Type设置为 `application/json`
3. **认证接口要正确设置Authorization请求头**，格式为 `Bearer {token}`
4. **错误时也要返回JSON格式**，包含 `success: false` 和 `error` 对象
5. **时间字段统一使用ISO 8601格式**，包含时区信息
6. **金额字段使用数字类型**，不要用字符串（除非包含货币符号）
7. **接口响应要包含适当的HTTP状态码**，不要所有情况都返回200
8. **支持OPTIONS预检请求**，正确配置CORS

### 测试清单：

- [ ] 所有接口返回正确的Content-Type
- [ ] 认证token验证正常工作
- [ ] 错误响应格式统一
- [ ] 日期时间格式正确
- [ ] 数字字段精度合适
- [ ] 股票代码格式标准
- [ ] 跨域CORS配置正确
- [ ] 接口响应时间在要求范围内
- [ ] 空数据情况处理正确
- [ ] 数据验证和错误提示清晰

---

**最后更新时间**: 2025-01-25  
**文档版本**: v1.0  
**注意**: 本文档会随着项目发展持续更新，请关注最新版本。
