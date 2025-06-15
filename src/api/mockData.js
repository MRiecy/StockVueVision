// 模拟数据配置文件
// 用于在后端未连接时提供完整的模拟数据

// 是否使用模拟数据
export const USE_MOCK_DATA = false;

// 账户信息模拟数据
export const mockAccountData = {
  accounts: [
    {
      account_id: 'A123456',
      total_asset: 10000000,
      cash: 5000000,
      frozen_cash: 0,
      market_value: 5000000,
      positions: [
        {
          stock_code: '600000',
          stock_name: '浦发银行',
          volume: 10000,
          avg_price: 10.5,
          open_price: 11.2,
          market_value: 112000
        },
        {
          stock_code: '601318',
          stock_name: '中国平安',
          volume: 5000,
          avg_price: 45.8,
          open_price: 46.5,
          market_value: 232500
        }
      ]
    },
    {
      account_id: 'B789012',
      total_asset: 8000000,
      cash: 3000000,
      frozen_cash: 0,
      market_value: 5000000,
      positions: [
        {
          stock_code: '000001',
          stock_name: '平安银行',
          volume: 8000,
          avg_price: 12.3,
          open_price: 12.8,
          market_value: 102400
        }
      ]
    }
  ]
};

// 资产类别分布模拟数据
export const mockAssetCategoryData = {
  categoryData: [
    { name: '股票', value: 5000000, percentage: 50 },
    { name: '债券', value: 2000000, percentage: 20 },
    { name: '基金', value: 1500000, percentage: 15 },
    { name: '现金', value: 1000000, percentage: 10 },
    { name: '其他', value: 500000, percentage: 5 }
  ]
};

// 交易所分布模拟数据
export const mockRegionData = {
  regionData: [
    { name: '上海证券交易所', totalAssets: 5000000, returnRate: 5.2, investmentRate: 50 },
    { name: '深圳证券交易所', totalAssets: 3000000, returnRate: 4.8, investmentRate: 30 },
    { name: '香港交易所', totalAssets: 1000000, returnRate: 3.5, investmentRate: 10 },
    { name: '纳斯达克', totalAssets: 500000, returnRate: 6.2, investmentRate: 5 },
    { name: '纽约证券交易所', totalAssets: 300000, returnRate: 5.8, investmentRate: 3 },
    { name: '其他交易所', totalAssets: 200000, returnRate: 4.5, investmentRate: 2 }
  ]
};

// 时间序列模拟数据
export const mockTimeData = {
  timeData: [
    { period: '1月', totalAssets: 10000000, returnRate: 5.2, growthRate: 3.8 },
    { period: '2月', totalAssets: 10500000, returnRate: 5.0, growthRate: 3.5 },
    { period: '3月', totalAssets: 11000000, returnRate: 4.8, growthRate: 3.2 },
    { period: '4月', totalAssets: 11500000, returnRate: 4.5, growthRate: 3.0 },
    { period: '5月', totalAssets: 12000000, returnRate: 4.2, growthRate: 2.8 },
    { period: '6月', totalAssets: 12500000, returnRate: 4.0, growthRate: 2.5 }
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
