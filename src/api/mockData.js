// 模拟数据配置文件
// 用于在后端未连接时提供完整的模拟数据

// 账户信息模拟数据
export const mockAccountData = {
  accounts: [
    {
      account_id: 'DEMO000001',
      account_type: 'STOCK',
      cash: 1250000,
      frozen_cash: 75000,
      market_value: 2850000,
      total_asset: 4100000,
      positions: [
        {
          account_id: 'DEMO000001',
          account_type: 'STOCK',
          stock_code: '600000.SH',
          stock_name: '浦发银行',
          volume: 10000,
          can_use_volume: 10000,
          open_price: 12.5,
          market_value: 125000,
          frozen_volume: 0,
          on_road_volume: 0,
          yesterday_volume: 10000,
          avg_price: 11.8
        },
        {
          account_id: 'DEMO000001',
          account_type: 'STOCK',
          stock_code: '000001.SZ',
          stock_name: '平安银行',
          volume: 5000,
          can_use_volume: 5000,
          open_price: 18.2,
          market_value: 91000,
          frozen_volume: 0,
          on_road_volume: 0,
          yesterday_volume: 5000,
          avg_price: 17.5
        },
        {
          account_id: 'DEMO000001',
          account_type: 'STOCK',
          stock_code: '600519.SH',
          stock_name: '贵州茅台',
          volume: 100,
          can_use_volume: 100,
          open_price: 1800.0,
          market_value: 180000,
          frozen_volume: 0,
          on_road_volume: 0,
          yesterday_volume: 100,
          avg_price: 1750.0
        },
        {
          account_id: 'DEMO000001',
          account_type: 'STOCK',
          stock_code: '000858.SZ',
          stock_name: '五粮液',
          volume: 300,
          can_use_volume: 300,
          open_price: 160.0,
          market_value: 48000,
          frozen_volume: 0,
          on_road_volume: 0,
          yesterday_volume: 300,
          avg_price: 155.0
        },
        {
          account_id: 'DEMO000001',
          account_type: 'STOCK',
          stock_code: '002415.SZ',
          stock_name: '海康威视',
          volume: 2000,
          can_use_volume: 2000,
          open_price: 35.0,
          market_value: 70000,
          frozen_volume: 0,
          on_road_volume: 0,
          yesterday_volume: 2000,
          avg_price: 33.5
        }
      ]
    }
  ]
};

// 资产类别分布模拟数据
export const mockAssetCategoryData = {
  categoryData: [
    { name: '银行股', value: 216000, percentage: 7.6 },
    { name: '白酒股', value: 228000, percentage: 8.0 },
    { name: '科技股', value: 342000, percentage: 12.0 },
    { name: '医药股', value: 285000, percentage: 10.0 },
    { name: '新能源', value: 513000, percentage: 18.0 },
    { name: '消费股', value: 399000, percentage: 14.0 },
    { name: '房地产', value: 171000, percentage: 6.0 },
    { name: '金融服务', value: 228000, percentage: 8.0 },
    { name: '制造业', value: 342000, percentage: 12.0 },
    { name: '其他', value: 126000, percentage: 4.4 }
  ]
};

// 交易所分布模拟数据
export const mockRegionData = {
  regionData: [
    { region: '上海证券交易所', value: 820000, percentage: 28.8 },
    { region: '深圳证券交易所', value: 712500, percentage: 25.0 },
    { region: '北京证券交易所', value: 570000, percentage: 20.0 },
    { region: '上海科创板', value: 342000, percentage: 12.0 },
    { region: '深圳创业板', value: 228000, percentage: 8.0 },
    { region: '香港交易所', value: 114000, percentage: 4.0 },
    { region: '其他', value: 63500, percentage: 2.2 }
  ]
};

// 时间序列模拟数据
export const mockTimeData = {
  timeData: [
    { date: '2024-01-01', totalAssets: 3800000, marketValue: 2600000, returnRate: 5.2 },
    { date: '2024-02-01', totalAssets: 3850000, marketValue: 2650000, returnRate: 5.5 },
    { date: '2024-03-01', totalAssets: 3920000, marketValue: 2720000, returnRate: 6.1 },
    { date: '2024-04-01', totalAssets: 3780000, marketValue: 2580000, returnRate: 4.8 },
    { date: '2024-05-01', totalAssets: 3950000, marketValue: 2750000, returnRate: 6.5 },
    { date: '2024-06-01', totalAssets: 4020000, marketValue: 2820000, returnRate: 7.2 },
    { date: '2024-07-01', totalAssets: 3980000, marketValue: 2780000, returnRate: 6.8 },
    { date: '2024-08-01', totalAssets: 4080000, marketValue: 2880000, returnRate: 7.8 },
    { date: '2024-09-01', totalAssets: 4050000, marketValue: 2850000, returnRate: 7.5 },
    { date: '2024-10-01', totalAssets: 4120000, marketValue: 2920000, returnRate: 8.2 },
    { date: '2024-11-01', totalAssets: 4090000, marketValue: 2890000, returnRate: 7.9 },
    { date: '2024-12-01', totalAssets: 4100000, marketValue: 2850000, returnRate: 8.0 }
  ]
};

// 年度对比模拟数据
export const mockYearlyComparisonData = {
  yearly_data: [
    { 
      timePeriod: '2022', 
      totalAssets: 3200000, 
      marketValue: 2400000, 
      returnRate: 4.2, 
      growthRate: 8.5 
    },
    { 
      timePeriod: '2023', 
      totalAssets: 3650000, 
      marketValue: 2650000, 
      returnRate: 5.8, 
      growthRate: 14.1 
    },
    { 
      timePeriod: '2024', 
      totalAssets: 4100000, 
      marketValue: 2850000, 
      returnRate: 8.0, 
      growthRate: 12.3 
    }
  ],
  current_total_assets: 4100000,
  current_market_value: 2850000,
  current_return_rate: 8.0,
  is_mock: true
};

// 每周对比模拟数据生成函数
export const generateMockWeeklyData = () => {
  const currentDate = new Date();
  const weekly_data = [];
  
  // 生成最近6周的模拟数据
  for (let i = 0; i < 6; i++) {
    const weekDate = new Date(currentDate);
    weekDate.setDate(currentDate.getDate() - (i * 7));
    
    const year = weekDate.getFullYear();
    const weekNum = getWeekNumber(weekDate);
    
    weekly_data.push({
      timePeriod: `${year}-W${weekNum}`,
      totalAssets: Math.round(4100000 * (1 - i * 0.02)),
      marketValue: Math.round(2850000 * (1 - i * 0.02)),
      returnRate: Math.round((8.0 - i * 0.3) * 10) / 10,
      growthRate: Math.round((12.3 - i * 0.5) * 10) / 10
    });
  }
  
  // 按时间顺序排序（从早到晚）
  weekly_data.reverse();
  
  return {
    weekly_data: weekly_data,
    current_total_assets: 4100000,
    current_market_value: 2850000,
    current_return_rate: 8.0,
    is_mock: true
  };
};

// 获取ISO周数的辅助函数
function getWeekNumber(date) {
  const temp = new Date(date);
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - (temp.getDay() + 6) % 7);
  const week1 = new Date(temp.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((temp.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  
  return weekNum.toString().padStart(2, '0');
}

// 交易所对比模拟数据
export const mockRegionComparisonData = {
  region_data: [
    { 
      region: '上海证券交易所', 
      totalAssets: 820000, 
      returnRate: '8.5%', 
      investmentRate: '28.8%' 
    },
    { 
      region: '深圳证券交易所', 
      totalAssets: 712500, 
      returnRate: '7.8%', 
      investmentRate: '25.0%' 
    },
    { 
      region: '北京证券交易所', 
      totalAssets: 570000, 
      returnRate: '9.2%', 
      investmentRate: '20.0%' 
    },
    { 
      region: '上海科创板', 
      totalAssets: 342000, 
      returnRate: '6.5%', 
      investmentRate: '12.0%' 
    },
    { 
      region: '深圳创业板', 
      totalAssets: 228000, 
      returnRate: '7.0%', 
      investmentRate: '8.0%' 
    },
    { 
      region: '香港交易所', 
      totalAssets: 114000, 
      returnRate: '5.8%', 
      investmentRate: '4.0%' 
    },
    { 
      region: '其他', 
      totalAssets: 63500, 
      returnRate: '4.2%', 
      investmentRate: '2.2%' 
    }
  ]
};

// 导出是否使用模拟数据的标志
export const USE_MOCK_DATA = false; 