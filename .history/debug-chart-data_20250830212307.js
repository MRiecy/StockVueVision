// 调试图表数据流和ECharts问题
console.log('=== 调试图表数据流 ===');

// 1. 检查组件数据状态
function checkComponentData() {
  console.log('🔍 检查组件数据状态...');

  // 查找AssetComparisonAnalysis组件
  const component = document.querySelector('[data-v-component="AssetComparisonAnalysis"]');
  if (component) {
    console.log('✅ 找到AssetComparisonAnalysis组件');

    // 检查Vue组件实例
    const vueInstance = component.__vueParentComponent?.ctx;
    if (vueInstance) {
      console.log('Vue实例数据:');
      console.log('  - categoryData:', vueInstance.categoryData);
      console.log('  - timeData:', vueInstance.timeData);
      console.log('  - regionData:', vueInstance.regionData);
      console.log('  - accountId:', vueInstance.accountId);
    } else {
      console.log('❌ 无法获取Vue实例');
    }
  } else {
    console.log('❌ 未找到AssetComparisonAnalysis组件');
  }
}

// 2. 检查ECharts实例
function checkEChartsInstances() {
  console.log('🔍 检查ECharts实例...');

  // 查找图表容器
  const chartContainers = document.querySelectorAll('.chart-container');
  console.log(`找到 ${chartContainers.length} 个图表容器`);

  chartContainers.forEach((container, index) => {
    console.log(`图表容器 ${index + 1}:`, container);

    // 尝试获取ECharts实例
    try {
      const chart = echarts.getInstanceByDom(container);
      if (chart) {
        console.log(`  ✅ ECharts实例 ${index + 1} 存在`);
        console.log('  图表选项:', chart.getOption());
      } else {
        console.log(`  ❌ ECharts实例 ${index + 1} 不存在`);
      }
    } catch (error) {
      console.error(`  获取ECharts实例 ${index + 1} 失败:`, error);
    }
  });
}

// 3. 检查API数据
async function checkApiData() {
  console.log('🔍 检查API数据...');

  try {
    // 检查账户信息
    const accountResponse = await fetch('http://localhost:8000/api/account-info/');
    if (accountResponse.ok) {
      const accountData = await accountResponse.json();
      console.log('账户信息API响应:', accountData);

      if (accountData.accounts && accountData.accounts.length > 0) {
        const account = accountData.accounts[0];
        console.log('账户详情:');
        console.log('  - 账户ID:', account.account_id);
        console.log('  - 总资产:', account.total_asset);
        console.log('  - 市值:', account.market_value);
        console.log('  - 持仓数量:', account.positions?.length || 0);
      }
    }

    // 检查时间段对比数据
    const timeResponse = await fetch('http://localhost:8000/api/timecomparison/yearly?account_id=40000326');
    if (timeResponse.ok) {
      const timeData = await timeResponse.json();
      console.log('时间段对比API响应:', timeData);
    }

    // 检查地区对比数据
    const regionResponse = await fetch('http://localhost:8000/api/areacomparsion/all?account_id=40000326');
    if (regionResponse.ok) {
      const regionData = await regionResponse.json();
      console.log('地区对比API响应:', regionData);
    }

  } catch (error) {
    console.error('检查API数据失败:', error);
  }
}

// 4. 检查图表DOM结构
function checkChartDOM() {
  console.log('🔍 检查图表DOM结构...');

  // 查找所有可能的图表容器
  const selectors = [
    '.chart-container',
    '[ref="timeChart"]',
    '[ref="regionChart"]',
    '[ref="categoryChart"]',
    '.echarts-for-vue'
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`选择器 "${selector}": 找到 ${elements.length} 个元素`);
    elements.forEach((el, index) => {
      console.log(`  ${index + 1}:`, el);
      console.log('    尺寸:', el.offsetWidth, 'x', el.offsetHeight);
      console.log('    可见性:', el.style.display, el.style.visibility);
    });
  });
}

// 5. 检查Vue组件挂载状态
function checkVueComponents() {
  console.log('🔍 检查Vue组件挂载状态...');

  // 查找所有Vue组件
  const vueComponents = document.querySelectorAll('[data-v-component]');
  console.log(`找到 ${vueComponents.length} 个Vue组件`);

  vueComponents.forEach((comp, index) => {
    const componentName = comp.getAttribute('data-v-component');
    console.log(`组件 ${index + 1}: ${componentName}`);

    // 检查组件是否已挂载
    if (comp.__vueParentComponent) {
      console.log(`  ✅ ${componentName} 已挂载`);
    } else {
      console.log(`  ❌ ${componentName} 未挂载`);
    }
  });
}

// 6. 运行所有检查
async function runAllChecks() {
  console.log('🚀 开始全面检查...\n');

  checkComponentData();
  console.log('');

  checkEChartsInstances();
  console.log('');

  await checkApiData();
  console.log('');

  checkChartDOM();
  console.log('');

  checkVueComponents();
  console.log('');

  console.log('📋 检查完成！');
}

// 自动运行检查
setTimeout(() => {
  runAllChecks();
}, 2000);

// 导出函数供手动调用
window.debugChartData = {
  checkComponentData,
  checkEChartsInstances,
  checkApiData,
  checkChartDOM,
  checkVueComponents,
  runAllChecks
};
