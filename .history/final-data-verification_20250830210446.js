// 最终数据验证脚本
// 在浏览器控制台中运行此脚本来确认图表数据的真实性

console.log('=== 最终数据验证脚本 ===');

// 1. 检查图表标题中的真实性标识
function checkChartTitles() {
  console.log('🔍 检查图表标题中的真实性标识...');

  const chartTitles = document.querySelectorAll('text');
  let foundAuthenticTitles = 0;
  let foundMockTitles = 0;

  chartTitles.forEach(title => {
    const text = title.textContent || '';
    if (text.includes('真实数据')) {
      foundAuthenticTitles++;
      console.log('✅ 找到真实数据标识:', text);
    } else if (text.includes('模拟数据') || text.includes('无数据')) {
      foundMockTitles++;
      console.log('⚠️ 找到模拟数据或无数据标识:', text);
    }
  });

  console.log(`真实数据标识: ${foundAuthenticTitles} 个`);
  console.log(`模拟数据标识: ${foundMockTitles} 个`);

  return foundAuthenticTitles > 0;
}

// 2. 检查数据真实性指示器
function checkAuthenticityIndicator() {
  console.log('🔍 检查数据真实性指示器...');

  const indicator = document.querySelector('.data-authenticity-indicator');
  if (indicator) {
    console.log('✅ 找到数据真实性指示器');

    const statusBadge = indicator.querySelector('.status-badge');
    if (statusBadge) {
      const status = statusBadge.textContent;
      const statusClass = statusBadge.className;

      console.log('状态文本:', status);
      console.log('状态样式:', statusClass);

      if (statusClass.includes('authentic')) {
        console.log('✅ 数据状态: 真实数据');
        return true;
      } else if (statusClass.includes('unknown')) {
        console.log('⚠️ 数据状态: 未知状态');
        return false;
      }
    }
  } else {
    console.log('❌ 未找到数据真实性指示器');
  }

  return false;
}

// 3. 验证API数据与图表数据的一致性
async function verifyDataConsistency() {
  console.log('🔍 验证API数据与图表数据的一致性...');

  try {
    // 获取API数据
    const response = await fetch('http://localhost:8000/api/account-info/');
    if (!response.ok) {
      throw new Error(`API响应错误: ${response.status}`);
    }

    const apiData = await response.json();
    const account = apiData.accounts[0];

    console.log('API数据:');
    console.log(`  账户ID: ${account.account_id}`);
    console.log(`  总资产: ${account.total_asset.toLocaleString()} 元`);
    console.log(`  市值: ${account.market_value.toLocaleString()} 元`);
    console.log(`  持仓数量: ${account.positions.length} 只股票`);

    // 检查图表中是否包含这些真实数据
    const pageText = document.body.textContent;

    // 检查总资产
    const totalAssetStr = account.total_asset.toString();
    if (pageText.includes(totalAssetStr.slice(0, 6))) {
      console.log('✅ 图表包含正确的总资产数据');
    } else {
      console.log('❌ 图表不包含正确的总资产数据');
    }

    // 检查市值
    const marketValueStr = account.market_value.toString();
    if (pageText.includes(marketValueStr.slice(0, 6))) {
      console.log('✅ 图表包含正确的市值数据');
    } else {
      console.log('❌ 图表不包含正确的市值数据');
    }

    // 检查股票代码
    let foundStockCodes = 0;
    account.positions.forEach(position => {
      if (pageText.includes(position.stock_code)) {
        foundStockCodes++;
      }
    });

    console.log(`找到 ${foundStockCodes}/${account.positions.length} 个真实股票代码`);

    return foundStockCodes > 0;

  } catch (error) {
    console.error('❌ 数据一致性验证失败:', error);
    return false;
  }
}

// 4. 检查是否有模拟数据残留
function checkMockDataResidue() {
  console.log('🔍 检查模拟数据残留...');

  const pageText = document.body.textContent;
  const mockDataPatterns = [
    // 模拟收益率
    '5.2%', '6.8%', '8.0%', '8.5%', '12.3%', '15.8%',
    // 模拟总资产
    '3800000', '3850000', '3920000', '3950000', '4020000',
    // 模拟地区数据
    '820000', '712500', '570000', '342000', '228000'
  ];

  let foundMockData = [];
  mockDataPatterns.forEach(pattern => {
    if (pageText.includes(pattern)) {
      foundMockData.push(pattern);
    }
  });

  if (foundMockData.length > 0) {
    console.log('⚠️ 发现模拟数据残留:', foundMockData);
    return false;
  } else {
    console.log('✅ 未发现模拟数据残留');
    return true;
  }
}

// 5. 检查图表数据来源
function checkChartDataSource() {
  console.log('🔍 检查图表数据来源...');

  // 检查控制台日志中是否有API调用记录
  const consoleLogs = [];
  const originalLog = console.log;

  console.log = function(...args) {
    consoleLogs.push(args.join(' '));
    originalLog.apply(console, args);
  };

  // 检查是否有API调用的日志
  const hasApiCalls = consoleLogs.some(log =>
    log.includes('正在获取') ||
    log.includes('API') ||
    log.includes('fetch')
  );

  if (hasApiCalls) {
    console.log('✅ 发现API调用记录');
  } else {
    console.log('⚠️ 未发现API调用记录');
  }

  return hasApiCalls;
}

// 6. 运行最终验证
async function runFinalVerification() {
  console.log('\n🚀 开始最终数据验证...\n');

  let passedChecks = 0;
  const totalChecks = 5;

  // 检查1: 图表标题
  if (checkChartTitles()) {
    passedChecks++;
    console.log('✅ 图表标题验证通过\n');
  } else {
    console.log('❌ 图表标题验证失败\n');
  }

  // 检查2: 真实性指示器
  if (checkAuthenticityIndicator()) {
    passedChecks++;
    console.log('✅ 真实性指示器验证通过\n');
  } else {
    console.log('❌ 真实性指示器验证失败\n');
  }

  // 检查3: 数据一致性
  if (await verifyDataConsistency()) {
    passedChecks++;
    console.log('✅ 数据一致性验证通过\n');
  } else {
    console.log('❌ 数据一致性验证失败\n');
  }

  // 检查4: 模拟数据残留
  if (checkMockDataResidue()) {
    passedChecks++;
    console.log('✅ 模拟数据残留检查通过\n');
  } else {
    console.log('❌ 模拟数据残留检查失败\n');
  }

  // 检查5: 图表数据来源
  if (checkChartDataSource()) {
    passedChecks++;
    console.log('✅ 图表数据来源检查通过\n');
  } else {
    console.log('❌ 图表数据来源检查失败\n');
  }

  // 最终结果
  console.log('📋 最终验证结果:');
  console.log(`通过检查: ${passedChecks}/${totalChecks}`);

  if (passedChecks === totalChecks) {
    console.log('🎉 所有检查通过！图表确实使用了真实数据！');
  } else if (passedChecks >= 3) {
    console.log('✅ 大部分检查通过，图表很可能使用了真实数据');
  } else {
    console.log('⚠️ 多项检查失败，图表可能仍在使用模拟数据');
  }

  console.log('\n💡 验证要点:');
  console.log('1. 图表标题应包含"真实数据"标识');
  console.log('2. 数据真实性指示器应显示"真实数据"状态');
  console.log('3. 图表数值应与API返回数据一致');
  console.log('4. 不应有模拟数据残留');
  console.log('5. 应有API调用记录');
}

// 自动运行验证
setTimeout(() => {
  runFinalVerification();
}, 3000);
