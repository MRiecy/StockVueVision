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
          <el-table-column prop="name" label="账户名"></el-table-column>
          <el-table-column prop="rate" label="总收益率"></el-table-column>
          <el-table-column prop="stocks" label="持股数量"></el-table-column>
          <el-table-column prop="fund" label="初始资金"></el-table-column>
        </el-table>
      </div>
    </div>

    <div class="asset-details">
      <div class="title">账户资产数据详情</div>
      <div class="table-stock">
        <el-table :data="selectedStocks" style="width: 100%">
          <el-table-column prop="name" label="股票名称"></el-table-column>
          <el-table-column prop="currentPrice" label="当前价格"></el-table-column>
          <el-table-column prop="turnoverRate" label="换手率"></el-table-column>
          <el-table-column prop="volume" label="交易量"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const accounts = ref([
  {
    name: '账户1',
    rate: '10%',
    fund: 1000,
    stocks: [
      { name: '股票A', currentPrice: '100', turnoverRate: '2%', volume: 1000 },
      { name: '股票B', currentPrice: '50', turnoverRate: '5%', volume: 500 },
    ],
  },
  {
    name: '账户2',
    rate: '8%',
    fund: 1500,
    stocks: [{ name: '股票C', currentPrice: '200', turnoverRate: '3%', volume: 2000 }],
  },
  {
    name: '账户A',
    rate: '5%',
    fund: 500,
    stocks: [],
  },
  {
    name: '账户B',
    rate: '7%',
    fund: 750,
    stocks: [{ name: '股票D', currentPrice: '150', turnoverRate: '4%', volume: 1500 }],
  },
])

const selectedAccount = ref('')

const selectedAccountData = computed(() => {
  const account = accounts.value.find((acc) => acc.name === selectedAccount.value)
  if (!account) return []
  return [
    {
      name: account.name,
      rate: account.rate,
      stocks: account.stocks.length,
      fund: account.fund,
    },
  ]
})

const handleAccountChange = () => {}

const selectedStocks = computed(() => {
  const account = accounts.value.find((acc) => acc.name === selectedAccount.value)
  return account ? account.stocks : []
})
</script>

<style scoped>
.left-aside {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
}

.asset-display-module {
  width: 100%;
  padding: 20px;
  border: 1px solid #dcdcdc; /* 添加浅灰色边框 */
  border-radius: 8px; /* 添加圆角 */
  background-color: #ffffff; /* 组件背景色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /*添加阴影效果 */
}

.asset-details {
  width: 100%;
  flex-grow: 1; /* 自动填充剩余空间 */
  margin-top: 20px; /* 与上方模块的间距 */
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
  height: calc(100% - 100px); /* 动态调整高度 */
  padding: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  overflow: hidden;
}

.table-stock {
  height: 100%; /* 表格容器高度铺满父容器 */
  overflow-y: auto; /* 内容溢出时显示滚动条 */
}

.el-select {
  width: 100%;
}

/* 修改下拉框样式 */
.el-select .el-input__inner {
  border-radius: 8px;
  border: 1px solid #dcdcdc;
}

.el-select-dropdown__item.selected {
  color: #3366cc; /* 选中项颜色 */
}
</style>
