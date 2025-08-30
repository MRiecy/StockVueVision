// 调试数据模式脚本
// 在浏览器控制台中运行此脚本来检查数据模式状态

console.log('🔍 开始检查数据模式状态...');

// 检查localStorage设置
const localStorageSetting = localStorage.getItem('useMockData');
console.log('📦 localStorage中的useMockData设置:', localStorageSetting);

// 检查mockData.js中的默认设置
console.log('⚙️ mockData.js中的USE_MOCK_DATA默认值: false');

// 计算当前实际使用的数据模式
const currentMode = localStorageSetting === 'true' ? '模拟数据' : '真实数据';
console.log('🎯 当前实际使用的数据模式:', currentMode);

// 检查API配置
console.log('🌐 API基础URL: http://localhost:8000');

// 测试API连接
async function testApiConnection() {
  console.log('🔗 测试API连接...');

  try {
    const response = await fetch('http://localhost:8000/api/account-info/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API连接成功，返回数据:', data);
      console.log('📊 数据是否包含is_mock标记:', data.hasOwnProperty('is_mock'));
      console.log('📊 is_mock值:', data.is_mock);
    } else {
      console.log('❌ API连接失败，状态码:', response.status);
    }
  } catch (error) {
    console.log('❌ API连接错误:', error.message);
  }
}

// 检查组件数据状态
function checkComponentData() {
  console.log('🔍 检查组件数据状态...');

  // 检查AssetComparisonAnalysis组件
  const categoryData = document.querySelector('.asset-comparison-analysis');
  if (categoryData) {
    console.log('✅ AssetComparisonAnalysis组件已加载');

    // 检查是否有加载状态
    const loadingStates = categoryData.querySelectorAll('.loading-state');
    console.log('⏳ 加载状态数量:', loadingStates.length);

    // 检查是否有错误状态
    const errorStates = categoryData.querySelectorAll('.error-state');
    console.log('❌ 错误状态数量:', errorStates.length);

    // 检查表格数据
    const tables = categoryData.querySelectorAll('.el-table');
    console.log('📊 表格数量:', tables.length);
  } else {
    console.log('❌ AssetComparisonAnalysis组件未找到');
  }
}

// 运行所有检查
console.log('\n🚀 开始执行检查...\n');

// 延迟执行API测试，确保页面完全加载
setTimeout(() => {
  testApiConnection();
  checkComponentData();

  console.log('\n📋 检查完成！');
  console.log('💡 如果看到模拟数据，请检查：');
  console.log('   1. 后端服务是否运行在 http://localhost:8000');
  console.log('   2. API接口是否返回正确的数据格式');
  console.log('   3. 网络连接是否正常');
  console.log('   4. 浏览器控制台是否有错误信息');
}, 2000);
