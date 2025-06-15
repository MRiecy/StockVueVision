<template>
  <div class="analysis-module">
    <div class="module-header">
      <h3>资产类别对比分析</h3>
      <div class="header-controls">
        <el-select
          v-model="selectedAccount"
          placeholder="请选择账户"
          @change="handleAccountChange"
          class="account-select"
        >
          <el-option
            v-for="account in accounts"
            :key="account.account_id"
            :label="account.account_id"
            :value="account.account_id"
          />
        </el-select>
        <el-button
          type="primary"
          size="small"
          @click="toggleChart"
          class="toggle-chart-btn"
        >
          {{ showChart ? '隐藏图表' : '显示图表' }}
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else-if="error" class="error-state">
      <el-alert
        :title="error"
        type="error"
        :closable="false"
        show-icon
      />
    </div>

    <template v-else-if="assetData && assetData.length > 0">
      <div v-show="showChart" ref="chartRef" class="chart-area"></div>

      <el-table
        :data="assetData"
        style="width: 100%"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="category" label="资产类别" width="180" />
        <el-table-column prop="totalAssets" label="总资产">
          <template #default="scope">
            {{ formatCurrency(scope.row.totalAssets) }}
          </template>
        </el-table-column>
        <el-table-column prop="returnRate" label="收益率">
          <template #default="scope">
            <span :class="getReturnRateClass(scope.row.returnRate)">
              {{ scope.row.returnRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="growthRate" label="增长率">
          <template #default="scope">
            <span :class="getGrowthRateClass(scope.row.growthRate)">
              {{ scope.row.growthRate }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <div v-else class="no-data-state">
      <el-empty description="暂无数据" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { fetchAssetCategoryData } from '@/api/acp.js';
import { fetchAccountInfo } from '@/api/accountApi.js';

export default {
  name: 'AssetCategoryAnalysis',
  setup() {
    const chartRef = ref(null);
    const chart = ref(null);
    const showChart = ref(false);
    const loading = ref(true);
    const error = ref(null);
    const assetData = ref([]);
    const accounts = ref([]);
    const selectedAccount = ref('');

    const headerStyle = () => ({
      backgroundColor: 'rgba(64, 224, 255, 0.2)',
      color: '#000000',
      fontWeight: 'bold',
      padding: '8px 0',
      textAlign: 'center',
      borderBottom: '1px solid rgba(64, 224, 255, 0.3)'
    });

    const cellStyle = ({ column }) => ({
      padding: '8px 0',
      textAlign: column.align || 'center',
      color: '#000000',
      backgroundColor: 'transparent',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    });

    const tableRowClassName = ({ rowIndex }) => {
      if (rowIndex % 2 === 0) {
        return 'even-row';
      }
      return '';
    };

    const loadAccounts = async () => {
      try {
        const data = await fetchAccountInfo();
        if (data && data.accounts) {
          accounts.value = data.accounts;
          if (accounts.value.length > 0) {
            selectedAccount.value = accounts.value[0].account_id;
          }
        }
      } catch (err) {
        console.error('加载账户信息失败:', err);
      }
    };

    const loadData = async () => {
      if (!selectedAccount.value) return;

      loading.value = true;
      error.value = null;
      try {
        console.log('开始加载数据，当前选中账户:', selectedAccount.value);
        const response = await fetchAssetCategoryData(selectedAccount.value);
        console.log('API响应:', response);

        if (!response || !response.accounts) {
          console.error('API响应数据格式错误:', response);
          error.value = '数据格式错误';
          return;
        }

        // 找到选中的账户数据
        const accountData = response.accounts.find(acc => acc.account_id === selectedAccount.value);
        console.log('找到的账户数据:', accountData);

        if (!accountData || !accountData.positions) {
          console.error('未找到账户数据或持仓数据');
          error.value = '未找到账户数据';
          return;
        }

        // 将持仓数据转换为资产类别数据
        assetData.value = accountData.positions.map(position => {
          const data = {
            category: position.stock_code,
            totalAssets: position.market_value,
            returnRate: position.daily_return,
            growthRate: position.asset_ratio * 100 // 将资产比例转换为百分比
          };
          console.log('转换后的数据项:', data);
          return data;
        });

        console.log('最终处理后的数据:', assetData.value);

        if (showChart.value) {
          setTimeout(() => {
            initChart();
          }, 100);
        }
      } catch (err) {
        console.error('加载资产类别数据失败:', err);
        error.value = '加载数据失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };

    const handleAccountChange = (accountId) => {
      selectedAccount.value = accountId;
      loadData();
    };

    const initChart = () => {
      if (!chartRef.value) {
        console.log('图表容器不存在');
        return;
      }

      if (!assetData.value || assetData.value.length === 0) {
        console.log('没有数据可以显示');
        return;
      }

      console.log('初始化图表...');
      chart.value = echarts.init(chartRef.value);
      const option = {
        title: {
          text: '资产类别对比分析',
          textStyle: {
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['持仓市值', '日收益率', '资产占比'],
          textStyle: {
            color: '#ffffff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: assetData.value.map(item => item.category),
          axisLabel: {
            color: '#ffffff',
            rotate: 45
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '金额',
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLabel: {
              color: '#ffffff',
              formatter: (value) => {
                return value.toFixed(0);
              }
            }
          },
          {
            type: 'value',
            name: '百分比',
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLabel: {
              color: '#ffffff',
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '持仓市值',
            type: 'bar',
            data: assetData.value.map(item => item.totalAssets),
            itemStyle: {
              color: '#40E0FF'
            }
          },
          {
            name: '日收益率',
            type: 'line',
            yAxisIndex: 1,
            data: assetData.value.map(item => item.returnRate),
            itemStyle: {
              color: '#FFD700'
            }
          },
          {
            name: '资产占比',
            type: 'line',
            yAxisIndex: 1,
            data: assetData.value.map(item => item.growthRate),
            itemStyle: {
              color: '#32CD32'
            }
          }
        ]
      };

      chart.value.setOption(option);
      console.log('图表初始化完成');
    };

    const toggleChart = () => {
      showChart.value = !showChart.value;
      if (showChart.value) {
        setTimeout(() => {
          initChart();
        }, 100);
      }
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 2
      }).format(value);
    };

    const getReturnRateClass = (rate) => {
      return {
        'positive-rate': rate > 0,
        'negative-rate': rate < 0
      };
    };

    const getGrowthRateClass = (rate) => {
      return {
        'positive-rate': rate > 0,
        'negative-rate': rate < 0
      };
    };

    onMounted(async () => {
      await loadAccounts();
      await loadData();
      window.addEventListener('resize', () => {
        if (chart.value) {
          chart.value.resize();
        }
      });
    });

    onUnmounted(() => {
      if (chart.value) {
        chart.value.dispose();
      }
      window.removeEventListener('resize', () => {
        if (chart.value) {
          chart.value.resize();
        }
      });
    });

    return {
      chartRef,
      showChart,
      loading,
      error,
      assetData,
      accounts,
      selectedAccount,
      handleAccountChange,
      toggleChart,
      formatCurrency,
      getReturnRateClass,
      getGrowthRateClass,
      headerStyle,
      cellStyle,
      tableRowClassName
    };
  }
};
</script>

<style scoped>
.analysis-module {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(64, 224, 255, 0.1);
  margin-bottom: 20px;
  width: 100%;
  color: #000000;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.module-header h3 {
  margin: 0;
  font-size: 1.2em;
  color: #000000;
}

.account-select {
  width: 200px;
}

.toggle-chart-btn {
  background: rgba(64, 224, 255, 0.2);
  border: 1px solid rgba(64, 224, 255, 0.4);
  color: #000000;
  transition: all 0.3s ease;
}

.toggle-chart-btn:hover {
  background: rgba(64, 224, 255, 0.3);
  transform: translateY(-2px);
}

.chart-area {
  height: 400px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
}

.loading-state,
.error-state,
.no-data-state {
  padding: 20px;
  text-align: center;
}

.positive-rate {
  color: #32CD32;
}

.negative-rate {
  color: #FF4444;
}

:deep(.el-table) {
  background: transparent;
  color: #000000;
}

:deep(.el-table th) {
  background: rgba(64, 224, 255, 0.1) !important;
  color: #000000 !important;
}

:deep(.el-table td) {
  background: transparent !important;
  color: #000000 !important;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: rgba(64, 224, 255, 0.05) !important;
}

:deep(.el-table__body tr:hover > td) {
  background: rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-select) {
  width: 200px;
}

:deep(.el-select .el-input__inner) {
  border-radius: 4px;
  border: 1px solid rgba(64, 224, 255, 0.3);
  padding: 5px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #000000;
}

:deep(.el-select .el-input__inner:focus) {
  border-color: rgba(64, 224, 255, 0.6);
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.3);
}

:deep(.el-select-dropdown) {
  background: rgba(26, 31, 58, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 224, 255, 0.3) !important;
}

:deep(.el-select-dropdown .el-option) {
  color: #000000 !important;
  background: transparent !important;
}

:deep(.el-select-dropdown .el-option:hover) {
  background: rgba(64, 224, 255, 0.2) !important;
}

:deep(.el-select-dropdown .el-option.is-selected) {
  background: rgba(64, 224, 255, 0.3) !important;
  color: #000000 !important;
}
</style>
