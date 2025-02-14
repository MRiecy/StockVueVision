<template>
  <div class="asset-display-module">
    <div class="title">所有账户总资产数据</div>
    <div class="select-container">
      <el-select
        v-model="selectedAccount"
        placeholder="请选择账户"
        @change="handleAccountChange"
      >
        <el-option
          v-for="(account, index) in accounts"
          :key="index"
          :label="account.name"
          :value="account.name"
        />
      </el-select>
    </div>
    <el-table :data="selectedAccountData" style="width: 100%">
      <el-table-column prop="name" label="账户名"></el-table-column>
      <el-table-column prop="rate" label="总收益率"></el-table-column>
      <el-table-column prop="stocks" label="持股数量"></el-table-column>
      <el-table-column prop="fund" label="初始资金"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const accounts = ref([
  { name: '账户1', rate: '10%', stocks: 100, fund: 1000 },
  { name: '账户2', rate: '8%', stocks: 150, fund: 1500 },
  { name: '账户A', rate: '5%', stocks: 50, fund: 500 },
  { name: '账户B', rate: '7%', stocks: 75, fund: 750 },
])

const selectedAccount = ref('')

const selectedAccountData = computed(() => {
  return accounts.value.filter(account => account.name === selectedAccount.value) || []
})

const handleAccountChange = (accountName: string) => {
  selectedAccount.value = accountName
}
</script>

<style scoped>
.asset-display-module {
  width: 100%;
  padding: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.select-container {
  margin-bottom: 20px;
}

.el-select {
  width: 100%;
}
</style>