import axios from 'axios';
import {
  mockYearlyComparisonData,
  generateMockWeeklyData,
  getMockDataSetting
} from './mockData.js';

/**
 * 获取年度时间段对比数据
 * @param {string} accountId 账户ID
 * @returns {Promise<Object>} 年度对比数据
 */
export async function fetchYearlyComparisonData(accountId = 'DEMO000001') {
  // 如果启用模拟数据模式，直接返回模拟数据
  if (getMockDataSetting()) {
    console.log('✅ 使用模拟数据 - 年度对比数据');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockYearlyComparisonData);
      }, 700); // 模拟网络延迟
    });
  }

  try {
    console.log(`正在获取账户 ${accountId} 的年度对比数据...`);
    const response = await axios.get('/api/timecomparison/yearly_comparison/', {
      params: { account_id: accountId }
    });

    console.log('年度对比数据API响应:', response.status);

    // 检查是否使用模拟数据
    if (response.data.is_mock) {
      console.warn('警告: 使用的是模拟数据，而非真实历史数据');
    } else {
      console.log('成功获取真实历史数据');
    }

    return response.data;
  } catch (error) {
    console.error('获取年度对比数据失败:', error);

    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求已发送但未收到响应');
    } else {
      console.error('请求设置错误:', error.message);
    }

    // 不再回退到模拟数据，直接抛出错误
    console.error('❌ API失败，不返回模拟数据');
    throw new Error(`API请求失败: ${error.message}`);
  }
}

/**
 * 获取每周时间段对比数据
 * @param {string} accountId 账户ID
 * @returns {Promise<Object>} 每周对比数据
 */
export async function fetchWeeklyComparisonData(accountId = 'DEMO000001') {
  // 如果启用模拟数据模式，直接返回模拟数据
  if (getMockDataSetting()) {
    console.log('✅ 使用模拟数据 - 每周对比数据');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generateMockWeeklyData());
      }, 600); // 模拟网络延迟
    });
  }

  try {
    console.log(`正在获取账户 ${accountId} 的每周对比数据...`);
    const response = await axios.get('/api/timecomparison/weekly_comparison/', {
      params: { account_id: accountId }
    });

    console.log('每周对比数据API响应:', response.status);

    // 检查是否使用模拟数据
    if (response.data.is_mock) {
      console.warn('警告: 使用的是模拟数据，而非真实历史数据');
    } else {
      console.log('成功获取真实历史数据');
    }

    return response.data;
  } catch (error) {
    console.error('获取每周对比数据失败:', error);

    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求已发送但未收到响应');
    } else {
      console.error('请求设置错误:', error.message);
    }

    // 不再回退到模拟数据，直接抛出错误
    console.error('❌ API失败，不返回模拟数据');
    throw new Error(`API请求失败: ${error.message}`);
  }
}

/**
 * 获取日期所在的ISO周数
 * @param {Date} date 日期
 * @returns {string} 格式化的ISO周数，如"01"
 */
function getWeekNumber(date) {
  // ISO周从1开始，获取日期所在的ISO周
  const temp = new Date(date);
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - (temp.getDay() + 6) % 7);
  const week1 = new Date(temp.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((temp.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);

  // 返回格式化的周数，例如"01"而不是"1"
  return weekNum.toString().padStart(2, '0');
}
