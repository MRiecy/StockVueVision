/**
 * 对比评估模块 - API调用
 * 专门用于ComparisonPage的三个对比模块
 */

import axios from 'axios';

// 创建一个axios实例配置后端地址
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const ACCOUNT_ID = 'DEMO000001';

/**
 * 获取资产对比数据
 * API: /api/asset_comparison/?account_id=DEMO000001
 */
export async function fetchAssetComparison() {
  try {
    const response = await api.get('/api/asset_comparison/', {
      params: { account_id: ACCOUNT_ID }
    });
    console.log('✅ 资产对比 - 后端数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 获取资产对比数据失败:', error);
    throw error;
  }
}

/**
 * 获取年度对比数据
 * API: /api/timecomparison/yearly_comparison/?account_id=DEMO000001
 */
export async function fetchYearlyComparisonData() {
  try {
    const response = await api.get('/api/timecomparison/yearly_comparison/', {
      params: { account_id: ACCOUNT_ID }
    });
    console.log('✅ 年度对比 - 后端数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 获取年度对比数据失败:', error);
    throw error;
  }
}

/**
 * 获取地区对比数据
 * API: /api/areacomparsion/area_comparison/?account_id=DEMO000001
 */
export async function fetchAreaComparison() {
  try {
    const response = await api.get('/api/areacomparsion/area_comparison/', {
      params: { account_id: ACCOUNT_ID }
    });
    console.log('✅ 地区对比 - 后端数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 获取地区对比数据失败:', error);
    throw error;
  }
}

