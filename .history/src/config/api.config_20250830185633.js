// API配置文件
// 用于管理不同环境的API配置

// 环境配置
const ENV = import.meta.env.MODE || 'development';

// API基础配置
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8000',
    timeout: 30000,
    useMockData: true,
    retryCount: 3,
    retryDelay: 1000
  },
  production: {
    baseURL: 'https://your-production-api.com',
    timeout: 30000,
    useMockData: false,
    retryCount: 3,
    retryDelay: 2000
  },
  test: {
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    useMockData: true,
    retryCount: 1,
    retryDelay: 500
  }
};

// 获取当前环境配置
export const getApiConfig = () => {
  return API_CONFIG[ENV] || API_CONFIG.development;
};

// API端点配置
export const API_ENDPOINTS = {
  // 账户相关
  ACCOUNT: {
    INFO: '/api/account-info/',
    ASSET_CATEGORY: '/api/asset-category/',
    REGION_DATA: '/api/region-data/'
  },

  // 对比分析相关
  COMPARISON: {
    REGION: '/api/areacomparsion/area_comparison/',
    YEARLY_TIME: '/api/timecomparison/yearly_comparison/',
    WEEKLY_TIME: '/api/timecomparison/weekly_comparison/'
  },

  // 策略相关
  STRATEGY: {
    EXECUTE: '/api/strategy/execute/',
    RESULT: '/api/strategy/result/',
    CONFIG: '/api/strategy/config/'
  },

  // 股票数据相关
  STOCK: {
    QUOTE: '/api/stock/quote/',
    HISTORY: '/api/stock/history/',
    REAL_TIME: '/api/stock/realtime/'
  }
};

// HTTP状态码映射
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// 错误消息映射
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  UNAUTHORIZED: '未授权访问，请重新登录',
  FORBIDDEN: '访问被拒绝，权限不足',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '数据验证失败，请检查输入',
  UNKNOWN_ERROR: '未知错误，请联系技术支持'
};

// 请求重试配置
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
    // 只对网络错误和5xx错误进行重试
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }
};

// 缓存配置
export const CACHE_CONFIG = {
  // 缓存时间（毫秒）
  TTL: {
    ACCOUNT_INFO: 5 * 60 * 1000,      // 账户信息5分钟
    STOCK_QUOTE: 30 * 1000,           // 股票报价30秒
    CHART_DATA: 10 * 60 * 1000,       // 图表数据10分钟
    STRATEGY_RESULT: 2 * 60 * 1000    // 策略结果2分钟
  },

  // 缓存键前缀
  PREFIX: {
    ACCOUNT: 'account_',
    STOCK: 'stock_',
    CHART: 'chart_',
    STRATEGY: 'strategy_'
  }
};

// 导出默认配置
export default {
  getApiConfig,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  RETRY_CONFIG,
  CACHE_CONFIG
};
