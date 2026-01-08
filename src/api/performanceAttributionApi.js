/**
 * 业绩归因模块 - API调用
 * 用于获取股票市值分布数据
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
 * 获取市值分布数据
 * 从账户信息API中获取持仓数据，用于业绩归因分析
 * API: /api/account-info/ 或 /api/asset_comparison/
 */
export async function fetchMarketCapData() {
  try {
    // 优先使用资产对比API，因为它有更详细的市值数据
    const response = await api.get('/api/asset_comparison/', {
      params: { account_id: ACCOUNT_ID }
    });
    console.log('✅ 市值分布 - 后端数据:', response.data);
    
    // 转换为前端需要的格式
    const transformed = transformMarketCapData(response.data);
    console.log('✅ 市值分布 - 转换后数据:', transformed);
    
    return transformed;
  } catch (error) {
    console.error('❌ 获取市值分布数据失败:', error);
    throw error;
  }
}

/**
 * 将后端数据转换为前端市值分布格式
 * 返回格式：{ stocks: [...], summary: { small: 0, medium: 0, large: 0 } }
 */
function transformMarketCapData(backendData) {
  // 兼容两种数据格式：asset_data 或 positions
  const assetData = backendData.asset_data || backendData.positions || [];
  
  if (!Array.isArray(assetData) || assetData.length === 0) {
    console.warn('⚠️ 没有持仓数据');
    return {
      stocks: [],
      summary: { small: 0, medium: 0, large: 0, total: 0 }
    };
  }
  
  // 转换为市值分布格式，并统计分类
  const summary = { small: 0, medium: 0, large: 0, total: assetData.length };
  
  const stocks = assetData.map(item => {
    const marketCap = calculateMarketCapInBillion(item.market_value);
    const category = categorizeMarketCapByBillion(marketCap);
    
    // 统计各分类数量
    if (category === 'small') summary.small++;
    else if (category === 'medium') summary.medium++;
    else if (category === 'large') summary.large++;
    
    return {
      name: item.stock_name || item.stock_code,
      marketCap: marketCap,
      category: category
    };
  });
  
  return {
    stocks: stocks,
    summary: summary
  };
}

/**
 * 将市值从元转换为亿元
 */
function calculateMarketCapInBillion(marketValue) {
  if (!marketValue) return 0;
  // 将元转换为亿元，保留2位小数
  return Number((marketValue / 100000000).toFixed(2));
}

/**
 * 根据市值（亿元）分类
 * 小市值: < 50亿
 * 中市值: 50亿 - 500亿
 * 大市值: >= 500亿
 */
function categorizeMarketCapByBillion(marketCapInBillion) {
  if (marketCapInBillion < 50) return 'small';
  if (marketCapInBillion >= 50 && marketCapInBillion < 500) return 'medium';
  return 'large';
}


