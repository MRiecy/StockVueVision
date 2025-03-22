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
  { prop: 'name', label: '资金账号', minWidth: 100, width: 100 },
  { prop: 'rate', label: '总收益率', minWidth: 100, width: 100 },
  { prop: 'stocks', label: '持股数量', minWidth: 100, width: 100 },
  { prop: 'fund', label: '总资产', minWidth: 100, width: 100 },
]);
const stockColumns = ref([
  { prop: 'name', label: '股票代码', minWidth: 100, width: 100 },
  { prop: 'currentPrice', label: '当前价格', minWidth: 100, width: 100 },
  { prop: 'turnoverRate', label: '换手率', minWidth: 100, width: 100 },
  { prop: 'volume', label: '持仓数量', minWidth: 100, width: 100 },
]);

onMounted(async () => {
  try {
    const data = await fetchAccountInfo();
    if (data && data.accounts) {
      accounts.value = data.accounts.map((acc) => {
        return {
          name: acc.account_id,
          rate: '',
          fund: acc.total_asset,
          stocks: (acc.positions || []).map((pos) => {
            const currentPrice = pos.volume && pos.volume > 0
              ? (pos.market_value / pos.volume).toFixed(2)
              : pos.open_price;
            return {
              name: pos.stock_code,
              currentPrice,
              turnoverRate: '-',
              volume: pos.volume,
            };
          }),
        };
      });
      if (accounts.value.length > 0) {
        selectedAccount.value = accounts.value[0].name;
      }
    }
  } catch (error) {
    console.error('获取账户信息失败：', error);
  }
});

const selectedAccountData = computed(() => {
  const account = accounts.value.find((acc) => acc.name === selectedAccount.value);
  if (!account) return [];
  return [
    {
      name: account.name,
      rate: account.rate,
      stocks: account.stocks.length,
      fund: account.fund,
    },
  ];
});

const selectedStocks = computed(() => {
  const account = accounts.value.find((acc) => acc.name === selectedAccount.value);
  return account ? account.stocks : [];
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