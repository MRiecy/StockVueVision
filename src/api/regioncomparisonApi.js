import axios from 'axios';
import { 
  mockRegionComparisonData,
  USE_MOCK_DATA 
} from './mockData.js';

/**
 * 获取地区对比数据
 */
export async function fetchRegionComparisonData() {
  // 如果启用模拟数据模式，直接返回模拟数据
  if (USE_MOCK_DATA) {
    console.log('✅ 使用模拟数据 - 地区对比数据');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...mockRegionComparisonData,
          is_mock: true
        });
      }, 500);
    });
  }

  try {
    const response = await axios.get('/api/areacomparsion/area_comparison/', {
      params: { account_id: 'DEMO000001' }
    });
    console.log('地区对比数据API响应:', response.status);
    const data = response.data;
    
    // 处理数据格式，使其与组件期望的格式一致
    return {
      region_data: data.area_data.map(item => ({
        region: item.region,
        totalAssets: item.totalAssets,
        returnRate: item.returnRate,
        investmentRate: item.maxDrawdown // 使用最大回撤率作为投资率
      }))
    };
  } catch (error) {
    console.error('获取地区对比数据失败:', error);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求已发送但未收到响应');
    } else {
      console.error('请求设置错误:', error.message);
    }
    
    // 回退到模拟数据
    console.log('🔄 回退到模拟数据 - 地区对比数据');
    return {
      ...mockRegionComparisonData,
      is_mock: true
    };
  }
} 