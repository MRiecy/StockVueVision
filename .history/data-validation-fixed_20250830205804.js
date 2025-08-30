// 数据验证脚本 - 修复后版本
// 在浏览器控制台中运行此脚本来验证图表数据是否正确

console.log('=== 数据验证脚本（修复后版本） ===');

// 1. 验证API返回的真实数据
async function verifyApiData() {
  console.log('🔍 验证API返回的真实数据...');

  try {
    const response = await fetch('http://localhost:8000/api/account-info/');
    if (response.ok) {
      const data = await response.json();
      const account = data.accounts[0];

      console.log('✅ API数据验证:');
      console.log(`  总资产: ${account.total_asset.toLocaleString()} 元`);
      console.log(`  现金: ${account.cash.toLocaleString()} 元`);
      console.log(`  市值: ${account.market_value.toLocaleString()} 元`);
      console.log(`  持仓数量: ${account.positions.length} 只股票`);

      // 验证持仓数据
      console.log('  持仓详情:');
      account.positions.forEach((position, index) => {
        console.log(`    股票${index + 1}: ${position.stock_code} - 市值: ${position.market_value.toLocaleString()} 元`);
      });

      return account;
    }
  } catch (error) {
    console.error('❌ API数据验证失败:', error);
    return null;
  }
}

// 2. 验证图表组件数据
function verifyChartComponents() {
  console.log('🔍 验证图表组件数据...');

  // 检查AssetComparisonAnalysis组件
  const assetComponent = document.querySelector('.asset-comparison-analysis');
  if (assetComponent) {
    console.log('✅ 找到AssetComparisonAnalysis组件');

    // 检查表格数据
    const tables = assetComponent.querySelectorAll('.el-table');
    console.log(`  表格数量: ${tables.length}`);

    // 检查是否有模拟数据
    const tableContent = assetComponent.textContent;
    if (tableContent.includes('5.2%') || tableContent.includes('6.8%') || tableContent.includes('8.0%')) {
      console.log('⚠️ 发现可能的模拟数据（收益率）');
    } else {
      console.log('✅ 未发现明显的模拟数据');
    }
  } else {
    console.log('❌ 未找到AssetComparisonAnalysis组件');
  }

  // 检查ComparisonChart组件
  const comparisonChart = document.querySelector('.comparison-chart');
  if (comparisonChart) {
    console.log('✅ 找到ComparisonChart组件');

    // 检查图表实例
    const chartElement = comparisonChart.querySelector('.chart-container');
    if (chartElement) {
      try {
        const chartInstance = echarts.getInstanceByDom(chartElement);
        if (chartInstance) {
          const option = chartInstance.getOption();
          console.log('✅ 获取到图表配置');

          if (option.series && option.series.length > 0) {
            option.series.forEach((series, index) => {
              console.log(`  系列${index + 1}: ${series.name}, 数据点: ${series.data.length}`);
              // 检查是否有模拟数据
              if (series.data.length > 0) {
                const hasMockData = series.data.some(value => value > 1000); // 检查是否有异常大的数值
                if (hasMockData) {
                  console.log(`    ⚠️ 系列${index + 1}可能包含模拟数据`);
                } else {
                  console.log(`    ✅ 系列${index + 1}数据正常`);
                }
              }
            });
          }
        }
      } catch (error) {
        console.log('⚠️ 获取图表配置失败:', error.message);
      }
    }
  }
}

// 3. 验证数据一致性
async function verifyDataConsistency() {
  console.log('🔍 验证数据一致性...');

  const apiAccount = await verifyApiData();
  if (!apiAccount) return;

  const totalAsset = apiAccount.total_asset;
  const marketValue = apiAccount.market_value;

  console.log(`API总资产: ${totalAsset.toLocaleString()} 元`);
  console.log(`API市值: ${marketValue.toLocaleString()} 元`);

  // 检查图表数据是否与API数据一致
  const assetComponent = document.querySelector('.asset-comparison-analysis');
  if (assetComponent) {
    const componentText = assetComponent.textContent;

    // 检查是否包含正确的总资产数值
    if (componentText.includes(totalAsset.toString().slice(0, 6))) {
      console.log('✅ 图表显示的总资产与API数据一致');
    } else {
      console.log('❌ 图表显示的总资产与API数据不一致');
    }

    // 检查是否包含正确的市值数值
    if (componentText.includes(marketValue.toString().slice(0, 6))) {
      console.log('✅ 图表显示的市值与API数据一致');
    } else {
      console.log('❌ 图表显示的市值与API数据不一致');
    }
  }
}

// 4. 检查模拟数据残留
function checkMockDataResidue() {
  console.log('🔍 检查模拟数据残留...');

  const pageText = document.body.textContent;
  const mockDataPatterns = [
    '5.2%', '6.8%', '8.0%', '8.5%', '12.3%', '15.8%', // 模拟收益率
    '3800000', '3850000', '3920000', '3950000', '4020000', // 模拟总资产
    '820000', '712500', '570000', '342000', '228000' // 模拟地区数据
  ];

  let foundMockData = false;
  mockDataPatterns.forEach(pattern => {
    if (pageText.includes(pattern)) {
      console.log(`⚠️ 发现模拟数据残留: ${pattern}`);
      foundMockData = true;
    }
  });

  if (!foundMockData) {
    console.log('✅ 未发现明显的模拟数据残留');
  }
}

// 5. 运行所有验证
async function runAllValidations() {
  console.log('\n🚀 开始运行所有验证...\n');

  await verifyApiData();
  console.log('');

  verifyChartComponents();
  console.log('');

  await verifyDataConsistency();
  console.log('');

  checkMockDataResidue();
  console.log('');

  console.log('📋 验证完成！');
  console.log('💡 修复后的预期效果：');
  console.log('   1. 图表应该显示真实的API数据');
  console.log('   2. 不应该有模拟的收益率数据');
  console.log('   3. 总资产和市值应该与API返回一致');
  console.log('   4. 如果没有真实数据，应该显示空图表而不是模拟数据');
}

// 自动运行验证
setTimeout(() => {
  runAllValidations();
}, 2000);
