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
        <el-table 
          :data="selectedAccountData" 
          style="width: 100%" 
          border
          :header-cell-style="headerStyle"
          :cell-style="cellStyle"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="account_id"
            label="资金账号"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="total_asset"
            label="总资产"
            min-width="150"
            align="right"
          />
          <el-table-column
            prop="cash"
            label="可用金额"
            min-width="150"
            align="right"
          />
          <el-table-column
            prop="frozen_cash"
            label="冻结金额"
            min-width="120"
            align="right"
          />
          <el-table-column
            prop="total_return_rate"
            label="总收益率"
            min-width="120"
            align="right"
          />
          <el-table-column
            prop="total_positions"
            label="持仓数量"
            min-width="120"
            align="right"
          />
          <el-table-column
            prop="market_value"
            label="持仓市值"
            min-width="150"
            align="right"
          />
        </el-table>
      </div>
    </div>

    <!-- 子资产模块 -->
    <div class="asset-details">
      <div class="title">账户资产数据详情</div>
      <div class="table-stock">
        <el-table 
          :data="selectedStocks" 
          style="width: 100%" 
          border
          :header-cell-style="headerStyle"
          :cell-style="cellStyle"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="stock_code"
            label="股票代码"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="open_price"
            label="当前价格"
            min-width="120"
            align="right"
          />
          <el-table-column
            prop="volume"
            label="持仓数量"
            min-width="120"
            align="right"
          />
          <el-table-column
            prop="avg_price"
            label="成本价"
            min-width="120"
            align="right"
          />
          <el-table-column
            prop="market_value"
            label="股票市值"
            min-width="150"
            align="right"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchAccountInfo } from '@/api/accountApi';

const accounts = ref([]);
const selectedAccount = ref('');

const headerStyle = () => ({
  backgroundColor: '#f5f5f5',
  fontWeight: 'bold',
  padding: '8px 0',
  textAlign: 'center'
});

const cellStyle = ({ column }) => ({
  padding: '8px 0',
  textAlign: column.align || 'center'
});

const tableRowClassName = ({ rowIndex }) => {
  if (rowIndex % 2 === 0) {
    return 'even-row';
  }
  return '';
};

onMounted(async () => {
  try {
    console.log('开始获取账户信息...');
    const data = await fetchAccountInfo();
    console.log('获取到的账户数据:', data);
    if (data && data.accounts) {
      accounts.value = data.accounts.map((account) => {
        console.log('处理账户数据:', account.account_id);
        const initialTotalAsset = 10000000;
        const totalReturnRate = initialTotalAsset !== 0 
          ? ((account.total_asset - initialTotalAsset) / initialTotalAsset) * 100 
          : 0;
        
        const totalPositions = account.positions 
          ? account.positions.reduce((sum, pos) => sum + pos.volume, 0) 
          : 0;

        return {
          ...account,
          total_return_rate: `${totalReturnRate.toFixed(2)}%`,
          total_positions: totalPositions,
        };
      });
      
      if (accounts.value.length > 0) {
        selectedAccount.value = accounts.value[0].account_id;
        console.log('已选择默认账户:', selectedAccount.value);
      }
    } else {
      console.warn('获取到的账户数据格式不正确:', data);
    }
  } catch (error) {
    console.error('获取账户信息失败：', error);
  }
});

// 处理账户选择变更
const handleAccountChange = (accountId) => {
  selectedAccount.value = accountId;
};

const selectedAccountData = computed(() => {
  const account = accounts.value.find((acc) => acc.account_id === selectedAccount.value);
  if (!account) return [];
  return [
    {
      account_id: account.account_id,
      total_asset: formatNumber(account.total_asset, 2),
      cash: formatNumber(account.cash, 2),
      frozen_cash: formatNumber(account.frozen_cash, 2),
      total_return_rate: account.total_return_rate,
      total_positions: formatNumber(account.total_positions, 0),
      market_value: formatNumber(account.market_value, 2),
    },
  ];
});

const selectedStocks = computed(() => {
  const account = accounts.value.find((acc) => acc.account_id === selectedAccount.value);
  if (!account || !account.positions) return [];
  
  // 根据股票市值降序排序，并选取前10条记录
  return account.positions
    .sort((a, b) => b.market_value - a.market_value) // 降序排序
    .slice(0, 10) // 取前10条
    .map((pos) => {
      return {
        stock_code: pos.stock_code,
        open_price: formatNumber(pos.open_price, 4),
        volume: formatNumber(pos.volume, 0),
        avg_price: formatNumber(pos.avg_price, 4),
        market_value: formatNumber(pos.market_value, 2),
      };
    });
});

const formatNumber = (value, decimals) => {
  if (value === undefined || value === null) return '0.'.padEnd(decimals + 2, '0');
  const num = Number(value);
  if (isNaN(num)) return '0.'.padEnd(decimals + 2, '0');
  
  const parts = num.toFixed(decimals).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
</script>

<style scoped>
.left-aside {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.asset-display-module, .asset-details {
  width: 100%;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.select-container {
  margin-bottom: 15px;
}

.table-container, .table-stock {
  width: 100%;
  overflow: hidden;
}

.table-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
}

.table-stock {
  overflow-y: auto;
}

.el-select {
  width: 100%;
}

.el-select .el-input__inner {
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  padding: 10px;
  font-size: 14px;
}

.el-table {
  font-size: 14px;
  color: #333;
  table-layout: auto;
}

.el-table th {
  padding: 8px 0;
}

.el-table td {
  padding: 8px 0;
}

.even-row {
  background-color: #f9f9f9;
}

.el-table__body-wrapper {
  overflow-x: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .left-aside {
    flex-direction: column;
  }
  
  .table-container, .table-stock {
    height: auto;
  }
  
  .el-table {
    font-size: 12px;
  }
}
</style>