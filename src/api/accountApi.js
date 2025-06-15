import axios from 'axios'
import {
  mockAccountData,
  USE_MOCK_DATA
} from './mockData.js'

// 创建一个axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000',  // 添加后端服务器地址
  timeout: 30000, // 增加超时时间到30秒
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * 从后端获取账户资产及持仓数据
 * @returns {Promise<Object>} 返回后端的 JSON 数据，例如 { accounts: [...] }
 */
export async function fetchAccountInfo() {
  // 如果启用模拟数据模式，直接返回模拟数据
  if (USE_MOCK_DATA) {
    console.log('✅ 使用模拟数据 - 账户信息');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...mockAccountData,
          is_mock: true
        });
      }, 500); // 模拟网络延迟
    });
  }

  try {
    console.log('请求账户信息API...');
    const response = await api.get('/api/account-info/');
    console.log('账户信息API响应:', response.status);
    return response.data;
  } catch (error) {
    console.error('账户信息API错误:', error);
    if (error.response) {
      // 服务器响应了错误状态码
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('请求已发送但未收到响应');
    } else {
      // 设置请求时发生错误
      console.error('请求设置错误:', error.message);
    }

    // 回退到模拟数据
    console.log('🔄 回退到模拟数据 - 账户信息');
    return {
      ...mockAccountData,
      is_mock: true
    };
  }
}
