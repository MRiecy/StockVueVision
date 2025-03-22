<template>
  <div class="left-aside">
    <div class="asset-display-module">
      <div class="title">所有账户总资产数据</div>
      <div class="select-container">
        <el-select v-model="selectedAccount" placeholder="请选择账户" @change="handleAccountChange">
          <el-option
            v-for="(account, index) in accounts"
            :key="index"
            :label="account.name"
            :value="account.name"
          />
        </el-select>
      </div>
      <div class="table-container">
        <el-table :data="selectedAccountData" style="width: 100%">
          <el-table-column prop="name" label="资金账号"></el-table-column>
          <el-table-column prop="rate" label="总收益率"></el-table-column>
          <el-table-column prop="stocks" label="持股数量"></el-table-column>
          <el-table-column prop="fund" label="总资产"></el-table-column>
        </el-table>
      </div>
    </div>

    <div class="asset-details">
      <div class="title">账户资产数据详情</div>
      <div class="table-stock">
        <el-table :data="selectedStocks" style="width: 100%">
          <el-table-column prop="name" label="股票代码"></el-table-column>
          <el-table-column prop="currentPrice" label="当前价格"></el-table-column>
          <el-table-column prop="turnoverRate" label="换手率"></el-table-column>
          <el-table-column prop="volume" label="持仓数量"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
//导入封装好的函数
import { fetchAccountInfo } from '@/api/accountApi'

// 用于存储后端API返回的账户数据
const accounts = ref([])
// 当前选择的账户（使用资金账号作为唯一标识）
const selectedAccount = ref('')

// 在组件挂载时调用后端API
onMounted(async () => {
  try {
    const data = await fetchAccountInfo()
    // data 形如 { accounts: [...] }
    if (data && data.accounts) {
      // 将后端返回的数据转换成前端所需结构
      accounts.value = data.accounts.map(acc => {
        return {
          // 这里用资金账号作为账户名称
          name: acc.account_id,
          // 如果后端返回收益率，可赋值；否则可为空字符串
          rate: '',
          // 使用总资产作为资金数据
          fund: acc.total_asset,
          // 将持仓列表转换为股票列表；注意：如果需要更详细的数据，可根据实际情况调整
          stocks: (acc.positions || []).map(pos => {
            // 若pos.volume非0，则用市值/volume计算近似价格，否则使用 open_price
            const currentPrice = pos.volume && pos.volume > 0
              ? (pos.market_value / pos.volume).toFixed(2)
              : pos.open_price
            return {
              name: pos.stock_code,
              currentPrice,
              // 后端没有换手率数据，此处可留空或显示占位符
              turnoverRate: '-',
              volume: pos.volume,
            }
          })
        }
      })
      // 默认选择第一个账户（如果存在）
      if (accounts.value.length > 0) {
        selectedAccount.value = accounts.value[0].name
      }
    }
  } catch (error) {
    console.error("获取账户信息失败：", error)
  }
})

// 计算当前选中账户的资产信息，转换为前端表格展示格式
const selectedAccountData = computed(() => {
  const account = accounts.value.find(acc => acc.name === selectedAccount.value)
  if (!account) return []
  return [{
    name: account.name,
    rate: account.rate,
    stocks: account.stocks.length,
    fund: account.fund,
  }]
})

// 当账户选择发生变化时的处理函数
const handleAccountChange = (value) => {
  console.log("选择账户:", value)
}

// 计算当前选中账户的股票持仓数据
const selectedStocks = computed(() => {
  const account = accounts.value.find(acc => acc.name === selectedAccount.value)
  return account ? account.stocks : []
})
</script>

<style scoped>
.left-aside {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.asset-display-module {
  width: 100%;
  padding: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.asset-details {
  width: 100%;
  flex-grow: 1;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.select-container {
  margin-bottom: 20px;
}

.table-container {
  height: calc(100% - 100px);
  padding: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  overflow: hidden;
}

.table-stock {
  height: 100%;
  overflow-y: auto;
}

.el-select {
  width: 100%;
}

.el-select .el-input__inner {
  border-radius: 8px;
  border: 1px solid #dcdcdc;
}

.el-select-dropdown__item.selected {
  color: #3366cc;
}
</style>
