// 统一的HTTP客户端配置
import axios from 'axios';
import { getApiConfig, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, RETRY_CONFIG } from '../config/api.config.js';

// 创建axios实例
const createHttpClient = () => {
  const config = getApiConfig();

  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加认证token
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 添加请求ID用于追踪
      config.requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);

      console.log(`🚀 API请求: ${config.method?.toUpperCase()} ${config.url}`, {
        requestId: config.requestId,
        params: config.params,
        data: config.data
      });

      return config;
    },
    (error) => {
      console.error('❌ 请求拦截器错误:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      console.log(`✅ API响应: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        requestId: response.config.requestId,
        status: response.status,
        data: response.data
      });

      // 检查响应数据格式
      if (response.data && typeof response.data === 'object') {
        // 添加响应时间戳
        response.data._responseTime = new Date().toISOString();
        response.data._requestId = response.config.requestId;
      }

      return response;
    },
    (error) => {
      console.error(`❌ API错误: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        requestId: error.config?.requestId,
        error: error.message,
        response: error.response?.data
      });

      // 统一错误处理
      return handleApiError(error);
    }
  );

  return instance;
};

// 错误处理函数
const handleApiError = (error) => {
  let errorInfo = {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    code: 'UNKNOWN_ERROR',
    status: 0,
    details: null
  };

  if (error.response) {
    // 服务器响应了错误状态码
    const { status, data } = error.response;
    errorInfo.status = status;

    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        errorInfo.message = ERROR_MESSAGES.UNAUTHORIZED;
        errorInfo.code = 'UNAUTHORIZED';
        // 清除本地token，跳转到登录页
        localStorage.removeItem('access_token');
        // 可以在这里添加路由跳转逻辑
        break;

      case HTTP_STATUS.FORBIDDEN:
        errorInfo.message = ERROR_MESSAGES.FORBIDDEN;
        errorInfo.code = 'FORBIDDEN';
        break;

      case HTTP_STATUS.NOT_FOUND:
        errorInfo.message = ERROR_MESSAGES.NOT_FOUND;
        errorInfo.code = 'NOT_FOUND';
        break;

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        errorInfo.message = ERROR_MESSAGES.SERVER_ERROR;
        errorInfo.code = 'SERVER_ERROR';
        break;

      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        errorInfo.message = ERROR_MESSAGES.SERVER_ERROR;
        errorInfo.code = 'SERVICE_UNAVAILABLE';
        break;

      default:
        if (status >= 400 && status < 500) {
          errorInfo.message = data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          errorInfo.code = 'CLIENT_ERROR';
        } else if (status >= 500) {
          errorInfo.message = ERROR_MESSAGES.SERVER_ERROR;
          errorInfo.code = 'SERVER_ERROR';
        }
    }

    errorInfo.details = data;
  } else if (error.request) {
    // 请求已发送但没有收到响应
    errorInfo.message = ERROR_MESSAGES.NETWORK_ERROR;
    errorInfo.code = 'NETWORK_ERROR';
  } else if (error.code === 'ECONNABORTED') {
    // 请求超时
    errorInfo.message = ERROR_MESSAGES.TIMEOUT_ERROR;
    errorInfo.code = 'TIMEOUT_ERROR';
  }

  // 创建自定义错误对象
  const customError = new Error(errorInfo.message);
  customError.code = errorInfo.code;
  customError.status = errorInfo.status;
  customError.details = errorInfo.details;
  customError.originalError = error;

  return Promise.reject(customError);
};

// 重试机制
const retryRequest = async (fn, retryCount = 0) => {
  try {
    return await fn();
  } catch (error) {
    if (retryCount < RETRY_CONFIG.maxRetries && RETRY_CONFIG.retryCondition(error)) {
      console.log(`🔄 重试请求 (${retryCount + 1}/${RETRY_CONFIG.maxRetries})`);

      // 延迟重试
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelay * (retryCount + 1)));

      return retryRequest(fn, retryCount + 1);
    }

    throw error;
  }
};

// 创建HTTP客户端实例
const httpClient = createHttpClient();

// 添加调试日志
console.log('🚀 HTTP客户端已创建:', {
  baseURL: httpClient.defaults.baseURL,
  timeout: httpClient.defaults.timeout,
  headers: httpClient.defaults.headers
});

// 导出HTTP客户端和工具函数
export {
  httpClient,
  retryRequest,
  handleApiError
};

// 导出默认实例
export default httpClient;
