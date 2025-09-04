// src/api/chartApi.js
import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * 获取策略执行结果图表数据
 * @returns {Promise<Object>} 返回图表数据
 */
export async function fetchStrategyChartData() {
  try {
    console.log('请求策略图表数据API...');
    const response = await api.get('/api/strategy-chart/');
    console.log('策略图表数据API响应:', response.status);
    return response.data;
  } catch (error) {
    console.error('策略图表数据API错误:', error);
    throw new Error(`获取策略图表数据失败: ${error.message}`);
  }
}

/**
 * 获取资产分布图表数据
 * @returns {Promise<Object>} 返回资产分布数据
 */
export async function fetchAssetDistributionChart() {
  try {
    console.log('请求资产分布图表数据API...');
    const response = await api.get('/api/asset-distribution/');
    console.log('资产分布图表数据API响应:', response.status);
    return response.data;
  } catch (error) {
    console.error('资产分布图表数据API错误:', error);
    throw new Error(`获取资产分布图表数据失败: ${error.message}`);
  }
}

/**
 * 获取收益走势图表数据
 * @returns {Promise<Object>} 返回收益走势数据
 */
export async function fetchReturnTrendChart() {
  try {
    console.log('请求收益走势图表数据API...');
    const response = await api.get('/api/return-trend/');
    console.log('收益走势图表数据API响应:', response.status);
    return response.data;
  } catch (error) {
    console.error('收益走势图表数据API错误:', error);
    throw new Error(`获取收益走势图表数据失败: ${error.message}`);
  }
}

/**
 * 获取风险分析图表数据
 * @returns {Promise<Object>} 返回风险分析数据
 */
export async function fetchRiskAnalysisChart() {
  try {
    console.log('请求风险分析图表数据API...');
    const response = await api.get('/api/risk-analysis/');
    console.log('风险分析图表数据API响应:', response.status);
    return response.data;
  } catch (error) {
    console.error('风险分析图表数据API错误:', error);
    throw new Error(`获取风险分析图表数据失败: ${error.message}`);
  }
}

/**
 * 获取交易记录图表数据
 * @returns {Promise<Object>} 返回交易记录数据
 */
export async function fetchTransactionChart() {
  try {
    console.log('请求交易记录图表数据API...');
    const response = await api.get('/api/transaction-chart/');
    console.log('交易记录图表数据API响应:', response.status);
    return response.data;
  } catch (error) {
    console.error('交易记录图表数据API错误:', error);
    throw new Error(`获取交易记录图表数据失败: ${error.message}`);
  }
}
