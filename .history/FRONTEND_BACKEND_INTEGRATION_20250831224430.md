# 前端后端登录注册功能交接文档

## 📋 项目概述

**StockVueVision** 是一个股票投资决策可视化系统，前端基于Vue 3 + Element Plus开发，需要与后端Django API进行用户认证集成。

## 🎯 功能需求说明

### **核心功能定位**
- **登录界面**: 主要起装饰作用，为用户提供美观的入口
- **真实数据**: 用户通过国金APP账号密码获取真实交易数据
- **数据流程**: 用户输入 → 前端验证 → 后端API → 国金接口 → 数据展示

### **用户认证流程**
1. 用户访问系统 → 自动跳转到登录页
2. 用户选择登录或注册模式
3. 输入用户名、手机号、密码
4. 前端验证 → 后端API处理 → 返回JWT token
5. 登录成功后跳转到数据展示页面
6. 右上角显示用户信息，支持退出登录

## 🔐 前端已实现功能

### **1. 登录页面 (LoginPage.vue)**
- ✅ 美观的玻璃拟态设计界面
- ✅ 支持登录/注册模式切换
- ✅ 用户名、手机号、密码输入
- ✅ 实时密码强度检测
- ✅ 表单验证（用户名2-20字符，手机号格式，密码6位+）
- ✅ 动态粒子背景效果

### **2. 路由配置 (router/index.js)**
- ✅ 默认重定向到登录页 (`/login`)
- ✅ 路由守卫保护，未登录用户无法访问受保护页面
- ✅ 已登录用户访问登录页自动跳转到数据展示页

### **3. 用户菜单 (MenuBar.vue)**
- ✅ 右上角用户头像和用户名显示
- ✅ 下拉菜单：个人资料、切换账号、退出登录
- ✅ 实时时间显示和系统状态指示

### **4. 认证API (authApi.js)**
- ✅ 统一的登录/注册API调用
- ✅ JWT token管理（access_token, refresh_token）
- ✅ 用户信息本地存储
- ✅ 错误处理和用户提示

## 📡 后端需要实现的API接口

### **1. 用户注册接口**

#### **接口信息**
- **路径**: `POST /api/auth/register/`
- **功能**: 新用户注册
- **认证**: 无需认证

#### **请求参数**
```json
{
  "username": "用户名",
  "phone": "手机号",
  "password": "密码"
}
```

#### **参数验证规则**
- `username`: 必填，2-20个字符，支持中文、英文、数字、下划线
- `phone`: 必填，11位手机号，格式：1[3-9]xxxxxxxxx
- `password`: 必填，最少6位字符，支持字母、数字、特殊字符

#### **响应格式**
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "user_id": "user_123456",
      "username": "用户名",
      "phone": "手机号",
      "nickname": "昵称",
      "avatar": "",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-01T00:00:00Z"
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

#### **错误响应**
```json
{
  "success": false,
  "message": "用户名已存在",
  "error_code": "USERNAME_EXISTS"
}
```

### **2. 用户登录接口**

#### **接口信息**
- **路径**: `POST /api/auth/login/`
- **功能**: 用户登录
- **认证**: 无需认证

#### **请求参数**
```json
{
  "username": "用户名或手机号",
  "password": "密码"
}
```

#### **参数验证规则**
- `username`: 必填，支持用户名或手机号登录
- `password`: 必填，密码验证

#### **响应格式**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "user_id": "user_123456",
      "username": "用户名",
      "phone": "手机号",
      "nickname": "昵称",
      "avatar": "",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-01T00:00:00Z"
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

#### **错误响应**
```json
{
  "success": false,
  "message": "用户名或密码错误",
  "error_code": "INVALID_CREDENTIALS"
}
```

### **3. Token刷新接口**

#### **接口信息**
- **路径**: `POST /api/auth/refresh/`
- **功能**: 刷新访问令牌
- **认证**: 需要refresh_token

#### **请求头**
```
Authorization: Bearer {refresh_token}
```

#### **响应格式**
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

### **4. 用户信息接口**

#### **接口信息**
- **路径**: `GET /api/auth/profile/`
- **功能**: 获取当前用户信息
- **认证**: 需要access_token

#### **请求头**
```
Authorization: Bearer {access_token}
```

#### **响应格式**
```json
{
  "success": true,
  "data": {
    "user_id": "user_123456",
    "username": "用户名",
    "phone": "手机号",
    "nickname": "昵称",
    "avatar": "",
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-01T00:00:00Z",
    "account_status": "active",
    "permissions": ["read", "write"]
  }
}
```

### **5. 退出登录接口**

#### **接口信息**
- **路径**: `POST /api/auth/logout/`
- **功能**: 用户退出登录
- **认证**: 需要access_token

#### **请求头**
```
Authorization: Bearer {access_token}
```

#### **响应格式**
```json
{
  "success": true,
  "message": "退出登录成功"
}
```

## 🗄️ 数据库设计要求

### **用户表 (users)**
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    avatar VARCHAR(255),
    account_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_phone (phone),
    INDEX idx_user_id (user_id)
);
```

### **Token表 (user_tokens)**
```sql
CREATE TABLE user_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_access_token (access_token(100)),
    INDEX idx_refresh_token (refresh_token(100))
);
```

## 🔒 安全要求

### **1. 密码安全**
- 密码必须加密存储（推荐使用bcrypt或Argon2）
- 密码强度要求：最少6位，建议包含大小写字母、数字、特殊字符
- 前端实时显示密码强度指示器

### **2. JWT Token安全**
- access_token有效期：1小时
- refresh_token有效期：7天
- 使用强密钥签名JWT
- 支持token黑名单机制

### **3. 接口安全**
- 登录/注册接口无需认证
- 其他接口需要有效的access_token
- 实现请求频率限制防止暴力破解
- 支持CORS跨域配置

## 🚀 部署和测试建议

### **1. 开发环境**
- 后端服务运行在 `http://localhost:8000`
- 前端开发服务器运行在 `http://localhost:5173`
- 使用Django开发服务器进行API测试

### **2. 测试用例**
- 用户注册：用户名、手机号、密码验证
- 用户登录：用户名/手机号登录、密码验证
- Token管理：刷新、过期处理
- 用户信息：获取、更新、权限验证

### **3. 错误处理**
- 400: 请求参数错误
- 401: 认证失败
- 403: 权限不足
- 409: 用户名或手机号已存在
- 500: 服务器内部错误

## 📝 注意事项

### **1. 前端特性**
- 支持用户名或手机号登录
- 首次使用自动注册模式
- 实时表单验证和用户反馈
- 响应式设计，支持移动端

### **2. 后端要求**
- 实现完整的用户认证系统
- 支持JWT token管理
- 实现用户数据持久化
- 提供详细的错误信息

### **3. 集成要点**
- 前端已实现完整的UI和交互逻辑
- 后端需要按照API规范实现对应接口
- 确保数据格式一致性
- 实现适当的错误处理和用户提示

## 🔗 相关文件

### **前端文件**
- `src/views/LoginPage.vue` - 登录页面组件
- `src/api/authApi.js` - 认证API接口
- `src/router/index.js` - 路由配置
- `src/components/layout/MenuBar.vue` - 用户菜单组件

### **后端需要创建**
- 用户认证相关的Django应用
- 用户模型和序列化器
- 认证视图和URL配置
- 数据库迁移文件

---

**文档版本**: v1.0  
**更新日期**: 2024-08-31  
**维护人员**: 前端开发团队 