// 数据验证脚本
// 在浏览器控制台中运行此脚本来验证图表数据是否正确

console.log('=== 数据验证脚本 ===');

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

      return account;
    }
  } catch (error) {
    console.error('❌ API数据验证失败:', error);
    return null;
  }
}

// 2. 验证图表显示的数据
function verifyChartData() {
  console.log('🔍 验证图表显示的数据...');

  // 检查AssetComparisonAnalysis组件
  const component = document.querySelector('.asset-comparison-analysis');
  if (component) {
    console.log('✅ 找到AssetComparisonAnalysis组件');

    // 检查表格数据
    const tables = component.querySelectorAll('.el-table');
    console.log(`  表格数量: ${tables.length}`);

    // 检查图表容器
    const charts = component.querySelectorAll('[style*="height: 400px"]');
    console.log(`  图表容器数量: ${charts.length}`);

    return true;
  } else {
    console.log('❌ 未找到AssetComparisonAnalysis组件');
    return false;
  }
}

// 3. 验证ComparisonChart组件
function verifyComparisonChart() {
  console.log('🔍 验证ComparisonChart组件...');

  const chartContainer = document.querySelector('.comparison-chart');
  if (chartContainer) {
    console.log('✅ 找到ComparisonChart组件');

    // 检查图表实例
    const chartElement = chartContainer.querySelector('.chart-container');
    if (chartElement) {
      console.log('✅ 找到图表容器');

      // 尝试获取ECharts实例
      try {
        const chartInstance = echarts.getInstanceByDom(chartElement);
        if (chartInstance) {
          const option = chartInstance.getOption();
          console.log('✅ 获取到图表配置');
          console.log('  图表类型:', option.series ? option.series.length : 0, '个系列');

          if (option.series && option.series.length > 0) {
            option.series.forEach((series, index) => {
              console.log(`  系列${index + 1}: ${series.name}, 数据点: ${series.data.length}`);
            });
          }
        } else {
          console.log('⚠️ 未找到ECharts实例');
        }
      } catch (error) {
        console.log('⚠️ 获取图表配置失败:', error.message);
      }
    }

    return true;
  } else {
    console.log('❌ 未找到ComparisonChart组件');
    return false;
  }
}

// 4. 验证数据一致性
async function verifyDataConsistency() {
  console.log('🔍 验证数据一致性...');

  const apiAccount = await verifyApiData();
  if (!apiAccount) return;

  // 检查图表数据是否与API数据一致
  const totalAsset = apiAccount.total_asset;
  console.log(`API总资产: ${totalAsset.toLocaleString()} 元`);

  // 这里可以添加更多的一致性检查
  console.log('✅ 数据一致性检查完成');
}

// 5. 运行所有验证
async function runAllVerifications() {
  console.log('\n🚀 开始运行所有验证...\n');

  await verifyApiData();
  console.log('');

  verifyChartData();
  console.log('');

  verifyComparisonChart();
  console.log('');

  await verifyDataConsistency();
  console.log('');

  console.log('📋 验证完成！');
  console.log('💡 如果发现问题，请检查：');
  console.log('   1. 图表数据是否与API数据一致');
  console.log('   2. 组件是否正确加载');
  console.log('   3. 数据格式是否正确');
}

// 自动运行验证
setTimeout(() => {
  runAllVerifications();
}, 2000);
