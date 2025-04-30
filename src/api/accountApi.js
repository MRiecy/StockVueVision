// src/api/accountApi.js
import axios from 'axios'

// 创建一个axios实例
const api = axios.create({
  baseURL: '',
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
    
    // 返回模拟数据以避免前端组件出错
    return {
      accounts: [
        {
          account_id: 'DEMO000001',
          account_type: 'STOCK',
          cash: 1000000,
          frozen_cash: 50000,
          market_value: 2000000,
          total_asset: 3000000,
          positions: [
            {
              account_id: 'DEMO000001',
              account_type: 'STOCK',
              stock_code: '600000.SH',
              volume: 10000,
              can_use_volume: 10000,
              open_price: 12.5,
              market_value: 125000,
              frozen_volume: 0,
              on_road_volume: 0,
              yesterday_volume: 10000,
              avg_price: 11.8
            }
          ]
        }
      ]
    };
  }
}

/**
 * 从账户信息获取资产类别数据
 * 此API用于账户总览页面的资产分类展示
 */
export async function fetchAssetCategoryData() {
  try {
    const response = await api.get('/api/asset-category/');
    return response.data;
  } catch (error) {
    console.error('获取资产类别数据失败:', error);
    return { categoryData: [] };
  }
}

/**
 * 从账户信息获取地区分布数据
 * 此API用于账户总览页面的地区分布展示
 */
export async function fetchRegionDataFromBackend() {
  try {
    const response = await api.get('/api/region-data/');
    return response.data;
  } catch (error) {
    console.error('获取地区分布数据失败:', error);
    return { regionData: [] };
  }
}

/**
 * 从账户信息获取时间序列数据
 * 此API用于账户总览页面的时间序列展示
 */
export async function fetchTimeDataFromBackend(params) {
  try {
    const response = await api.get('/api/time-data/', { params });
    return response.data;
  } catch (error) {
    console.error('获取时间序列数据失败:', error);
    return { timeData: [] };
  }
}

