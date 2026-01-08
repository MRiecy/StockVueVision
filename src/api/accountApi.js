// src/api/accountApi.js
import axios from 'axios'
import {
  mockAccountData,
  mockAssetCategoryData,
  mockRegionData,
  mockTimeData,
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
  // if (USE_MOCK_DATA) {
  //   console.log('✅ 使用模拟数据 - 账户信息');
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve({
  //         ...mockAccountData,
  //         is_mock: true
  //       });
  //     }, 500); // 模拟网络延迟
  //   });
  // }

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
      // 请求已发送但没有收到响应（后端关闭或网络问题）
      console.error('❌ 后端服务未响应，请检查后端服务是否启动');
      // throw new Error('后端服务连接失败，请确保后端服务已启动');
    } else {
      // 设置请求时发生错误
      console.error('请求设置错误:', error.message);
    }

    // 回退到模拟数据
    console.log('❌ 请求真实账户信息失败，回退到模拟数据');
    return {
      ...mockAccountData,
      is_mock: true
    };
  }
}

/**
 * 从账户信息获取资产类别数据
 * 此API用于账户总览页面的资产分类展示
 */
export async function fetchAssetCategoryData() {
  // 如果启用模拟数据模式，直接返回模拟数据
  if (USE_MOCK_DATA) {
    console.log('✅ 使用模拟数据 - 资产类别分布');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...mockAssetCategoryData,
          is_mock: true
        });
      }, 300);
    });
  }

  try {
    const response = await api.get('/api/asset-category/');
    return response.data;
  } catch (error) {
    console.error('获取资产类别数据失败:', error);
    if (error.request) {
      console.error('❌ 后端服务未响应，请检查后端服务是否启动');
      throw new Error('后端服务连接失败，请确保后端服务已启动');
    }
    throw error;
  }
}

/**
 * 从账户信息获取地区分布数据
 * 此API用于账户总览页面的地区分布展示
 */
export async function fetchRegionDataFromBackend() {
  // 如果启用模拟数据模式，直接返回模拟数据
  if (USE_MOCK_DATA) {
    console.log('✅ 使用模拟数据 - 地区分布');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...mockRegionData,
          is_mock: true
        });
      }, 400);
    });
  }

  try {
    const response = await api.get('/api/region-data/');
    return response.data;
  } catch (error) {
    console.error('获取地区分布数据失败:', error);
    if (error.request) {
      console.error('❌ 后端服务未响应，请检查后端服务是否启动');
      throw new Error('后端服务连接失败，请确保后端服务已启动');
    }
    throw error;
  }
}

/**
 * 从账户信息获取时间序列数据
 * 此API用于账户总览页面的时间序列展示
 */
export async function fetchTimeDataFromBackend(params) {
  // 如果启用模拟数据模式，直接返回模拟数据
  if (USE_MOCK_DATA) {
    console.log('✅ 使用模拟数据 - 时间序列');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...mockTimeData,
          is_mock: true
        });
      }, 600);
    });
  }

  try {
    const response = await api.get('/api/time-data/', { params });
    return response.data;
  } catch (error) {
    console.error('获取时间序列数据失败:', error);
    if (error.request) {
      console.error('❌ 后端服务未响应，请检查后端服务是否启动');
      throw new Error('后端服务连接失败，请确保后端服务已启动');
    }
    throw error;
  }
}

