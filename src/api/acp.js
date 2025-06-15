import axios from 'axios';
import {
  mockAssetCategoryData,
  USE_MOCK_DATA
} from './mockData.js';

// 创建一个axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 获取资产类别数据
export async function fetchAssetCategoryData(accountId) {
  // 如果启用模拟数据模式，直接返回模拟数据
  if (USE_MOCK_DATA) {
    console.log('✅ 使用模拟数据 - 资产类别分布');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          accounts: [{
            account_id: accountId,
            positions: mockAssetCategoryData.categoryData.map(item => ({
              stock_code: item.name,
              market_value: item.value,
              daily_return: item.percentage,
              asset_ratio: item.percentage / 100
            }))
          }]
        });
      }, 300);
    });
  }

  try {
    console.log('请求资产类别数据API...', accountId);
    const response = await api.get('/api/asset_comparison/');
    console.log('资产类别数据API响应:', response.status);
    return response.data;
  } catch (error) {
    console.error('获取资产类别数据失败:', error);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求已发送但未收到响应');
    } else {
      console.error('请求设置错误:', error.message);
    }

    // 回退到模拟数据
    console.log('🔄 回退到模拟数据 - 资产类别分布');
    return {
      accounts: [{
        account_id: accountId,
        positions: mockAssetCategoryData.categoryData.map(item => ({
          stock_code: item.name,
          market_value: item.value,
          daily_return: item.percentage,
          asset_ratio: item.percentage / 100
        }))
      }]
    };
  }
}
