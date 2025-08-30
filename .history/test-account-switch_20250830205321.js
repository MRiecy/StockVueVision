// 账户切换功能测试脚本
// 在浏览器控制台中运行此脚本来测试账户切换功能

console.log('=== 账户切换功能测试 ===');

// 导入账户状态管理
import { currentAccountId, availableAccounts, setCurrentAccountId, setAvailableAccounts } from '@/utils/accountStore.js';

// 1. 测试获取账户列表
async function testAccountList() {
  console.log('🔍 测试获取账户列表...');

  try {
    const response = await fetch('http://localhost:8000/api/account-info/');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 获取账户列表成功');
      console.log('账户数量:', data.accounts.length);

      data.accounts.forEach((account, index) => {
        console.log(`账户${index + 1}: ${account.account_id} (${account.account_type === 2 ? '股票' : '其他'})`);
      });

      // 设置可用账户列表
      setAvailableAccounts(data.accounts);

      return data.accounts;
    }
  } catch (error) {
    console.error('❌ 获取账户列表失败:', error);
    return [];
  }
}

// 2. 测试账户切换
function testAccountSwitch(accounts) {
  console.log('🔍 测试账户切换...');

  if (accounts.length === 0) {
    console.log('⚠️ 没有可用账户进行切换测试');
    return;
  }

  console.log('当前账户ID:', currentAccountId.value);

  // 切换到第一个账户
  if (accounts.length > 0) {
    const firstAccount = accounts[0];
    console.log(`切换到账户: ${firstAccount.account_id}`);
    setCurrentAccountId(firstAccount.account_id);
    console.log('切换后账户ID:', currentAccountId.value);
  }

  // 如果有多个账户，切换到第二个
  if (accounts.length > 1) {
    setTimeout(() => {
      const secondAccount = accounts[1];
      console.log(`切换到账户: ${secondAccount.account_id}`);
      setCurrentAccountId(secondAccount.account_id);
      console.log('切换后账户ID:', currentAccountId.value);
    }, 2000);
  }
}

// 3. 测试数据更新
async function testDataUpdate() {
  console.log('🔍 测试数据更新...');

  const accountId = currentAccountId.value;
  console.log('当前账户ID:', accountId);

  try {
    // 测试获取该账户的数据
    const response = await fetch(`http://localhost:8000/api/account-info/`);
    if (response.ok) {
      const data = await response.json();
      const account = data.accounts.find(acc => acc.account_id === accountId);

      if (account) {
        console.log('✅ 获取账户数据成功');
        console.log(`账户ID: ${account.account_id}`);
        console.log(`总资产: ${account.total_asset.toLocaleString()} 元`);
        console.log(`持仓数量: ${account.positions.length} 只股票`);
      } else {
        console.log('❌ 未找到指定账户的数据');
      }
    }
  } catch (error) {
    console.error('❌ 获取账户数据失败:', error);
  }
}

// 4. 运行完整测试
async function runAccountSwitchTest() {
  console.log('\n🚀 开始账户切换功能测试...\n');

  // 获取账户列表
  const accounts = await testAccountList();
  console.log('');

  // 测试账户切换
  testAccountSwitch(accounts);
  console.log('');

  // 等待切换完成后测试数据更新
  setTimeout(async () => {
    await testDataUpdate();
    console.log('');

    console.log('📋 账户切换功能测试完成！');
    console.log('💡 请检查：');
    console.log('   1. 下拉列表是否显示所有可用账户');
    console.log('   2. 切换账户后图表数据是否更新');
    console.log('   3. 账户ID是否正确传递到各个组件');
  }, 3000);
}

// 自动运行测试
setTimeout(() => {
  runAccountSwitchTest();
}, 2000);
