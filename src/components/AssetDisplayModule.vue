<template>
  <div class="left-aside">
    <!-- 总资产模块 -->
    <div class="asset-display-module">
      <div class="title">所有账户总资产数据</div>
      <div class="select-container">
        <el-select v-model="selectedAccount" placeholder="请选择账户" @change="handleAccountChange">
          <el-option
            v-for="(account, index) in accounts"
            :key="index"
            :label="account.account_id"
            :value="account.account_id"
          />
        </el-select>
      </div>
      <div class="table-container">
        <el-table :data="selectedAccountData" style="width: 100%" fit>
          <el-table-column
            v-for="(column, index) in columns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth"
            :width="column.width"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 子资产模块 -->
    <div class="asset-details">
      <div class="title">账户资产数据详情</div>
      <div class="table-stock">
        <el-table :data="selectedStocks" style="width: 100%" fit>
          <el-table-column
            v-for="(column, index) in stockColumns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth"
            :width="column.width"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { fetchAccountInfo } from '@/api/accountApi';

const accounts = ref([]);
const selectedAccount = ref('');
const columns = ref([
  { prop: 'account_id', label: '资金账号', minWidth: 100, width: 100 },
  { prop: 'total_asset', label: '总资产', minWidth: 100, width: 100 },
  { prop: 'cash', label: '可用金额', minWidth: 100, width: 100 },
  { prop: 'frozen_cash', label: '冻结金额', minWidth: 100, width: 100 },
  { prop: 'total_return_rate', label: '总收益率', minWidth: 100, width: 100 },
  { prop: 'total_positions', label: '持仓数量', minWidth: 100, width: 100 },
  { prop: 'market_value', label: '持仓市值', minWidth: 100, width: 100 },
]);
const stockColumns = ref([
  { prop: 'stock_code', label: '股票代码', minWidth: 100, width: 100 },
  { prop: 'open_price', label: '当前价格', minWidth: 100, width: 100 },
  { prop: 'volume', label: '持仓数量', minWidth: 100, width: 100 },
  { prop: 'avg_price', label: '成本价', minWidth: 100, width: 100 },
  { prop: 'market_value', label: '股票市值', minWidth: 100, width: 100 },
]);

onMounted(async () => {
  try {
    const data = await fetchAccountInfo();
    if (data && data.accounts) {
      accounts.value = data.accounts.map((account) => {
        // 初始总资产固定为 1000 万
        const initialTotalAsset = 10000000;
        // 计算总收益率
        const totalReturnRate = initialTotalAsset !== 0 ? ((account.total_asset - initialTotalAsset) / initialTotalAsset) * 100 : 0;
        
        // 计算持仓数量
        const totalPositions = account.positions ? account.positions.reduce((sum, pos) => sum + pos.volume, 0) : 0;

        return {
          ...account,
          total_return_rate: `${totalReturnRate.toFixed(2)}%`,
          total_positions: totalPositions,
        };
      });
      
      if (accounts.value.length > 0) {
        selectedAccount.value = accounts.value[0].account_id;
      }
    }
  } catch (error) {
    console.error('获取账户信息失败：', error);
  }
});

const selectedAccountData = computed(() => {
  const account = accounts.value.find((acc) => acc.account_id === selectedAccount.value);
  if (!account) return [];
  return [
    {
      account_id: account.account_id,
      total_asset: account.total_asset,
      cash: account.cash,
      frozen_cash: account.frozen_cash,
      total_return_rate: account.total_return_rate,
      total_positions: account.total_positions,
      market_value: account.market_value,
    },
  ];
});

const selectedStocks = computed(() => {
  const account = accounts.value.find((acc) => acc.account_id === selectedAccount.value);
  if (!account || !account.positions) return [];
  
  return account.positions.map((pos) => {
    return {
      stock_code: pos.stock_code,
      open_price: pos.open_price,
      volume: pos.volume,
      avg_price: pos.avg_price,
      market_value: pos.market_value,
    };
  });
});

// 动态调整列宽
const adjustColumnWidth = () => {
  const table = document.querySelector('.el-table__body-wrapper');
  if (!table) return;

  columns.value.forEach((column) => {
    const cells = table.querySelectorAll(`.el-table__row td:nth-child(${column.prop})`);
    let maxWidth = column.minWidth;
    cells.forEach((cell) => {
      const contentWidth = cell.scrollWidth;
      if (contentWidth > maxWidth) {
        maxWidth = contentWidth;
      }
    });
    column.width = maxWidth;
  });

  stockColumns.value.forEach((column) => {
    const cells = table.querySelectorAll(`.el-table__row td:nth-child(${column.prop})`);
    let maxWidth = column.minWidth;
    cells.forEach((cell) => {
      const contentWidth = cell.scrollWidth;
      if (contentWidth > maxWidth) {
        maxWidth = contentWidth;
      }
    });
    column.width = maxWidth;
  });
};

watch(selectedAccountData, () => {
  setTimeout(adjustColumnWidth, 0);
});

watch(selectedStocks, () => {
  setTimeout(adjustColumnWidth, 0);
});
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