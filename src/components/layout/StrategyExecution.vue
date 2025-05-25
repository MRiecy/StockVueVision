<template>
  <div class="strategy-execution">
    <div class="strategy-display-module">
      <div class="title">当前执行策略</div>
      <div class="select-container">
        <el-select v-model="selectedStrategy" placeholder="请选择策略" @change="handleStrategyChange">
          <el-option
            v-for="strategy in strategies"
            :key="strategy.id"
            :label="strategy.name"
            :value="strategy"
          />
        </el-select>
      </div>
      <div class="strategy-description">
        <div class="title">策略简介</div>
        <div>{{ selectedStrategy.description }}</div>
      </div>
      <div class="strategy-parameters">
        <div class="title">策略参数设置</div>
        <el-table :data="selectedStrategy.parameters" style="width: 100%">
          <el-table-column prop="paramKey" label="参数名称" />
          <el-table-column prop="paramValue" label="参数值" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'StrategyExecution',
  setup() {
    const strategies = ref([]);
    const selectedStrategy = ref({
      description: '',
      parameters: []
    });

    const fetchStrategies = async () => {
      try {
        const response = await axios.get('/api/strategies/');
        if (response.data && response.data.strategies && response.data.strategies.length > 0) {
          strategies.value = response.data.strategies;
          selectedStrategy.value = response.data.strategies[0];

          if (!selectedStrategy.value.parameters) {
            selectedStrategy.value.parameters = [];
          }
        } else {
          console.warn('获取到的策略数据格式不正确或为空');
          strategies.value = [
            {
              id: 1,
              name: '量化价值策略',
              description: '基于PE、PB等基本面指标的价值投资策略，专注于寻找被低估的优质股票',
              parameters: [
                { paramKey: 'PE', paramValue: '20', description: '市盈率上限' },
                { paramKey: 'PB', paramValue: '2.5', description: '市净率上限' },
                { paramKey: 'ROE', paramValue: '15%', description: '净资产收益率下限' },
                { paramKey: '仓位', paramValue: '80%', description: '最大仓位比例' }
              ]
            },
            {
              id: 2,
              name: '动量交易策略',
              description: '基于价格和成交量的技术分析策略，捕捉市场短期趋势',
              parameters: [
                { paramKey: 'MA5', paramValue: '激活', description: '5日均线策略' },
                { paramKey: 'MA20', paramValue: '激活', description: '20日均线策略' },
                { paramKey: 'VOL', paramValue: '150%', description: '成交量放大倍数' },
                { paramKey: '止损', paramValue: '5%', description: '止损比例' }
              ]
            },
            {
              id: 3,
              name: '均值回归策略',
              description: '基于股价偏离均值的统计套利策略，适合震荡市场',
              parameters: [
                { paramKey: 'BOLL', paramValue: '2.0', description: '布林带标准差' },
                { paramKey: 'RSI', paramValue: '30-70', description: 'RSI指标区间' },
                { paramKey: '回归期', paramValue: '20天', description: '均值回归周期' },
                { paramKey: '仓位', paramValue: '60%', description: '最大仓位比例' }
              ]
            }
          ];
          selectedStrategy.value = strategies.value[0];
        }
      } catch (error) {
        console.error('获取策略列表失败：', error);
        strategies.value = [
          {
            id: 1,
            name: '量化价值策略',
            description: '基于PE、PB等基本面指标的价值投资策略',
            parameters: [
              { paramKey: 'PE', paramValue: '20', description: '市盈率上限' },
              { paramKey: 'PB', paramValue: '2.5', description: '市净率上限' }
            ]
          }
        ];
        selectedStrategy.value = strategies.value[0];
      }
    };

    onMounted(fetchStrategies);

    const handleStrategyChange = () => {
      console.log('当前选中策略：', selectedStrategy.value);
    };

    return {
      strategies,
      selectedStrategy,
      handleStrategyChange,
    };
  },
};
</script>

<style scoped>
.strategy-execution {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px;
  box-sizing: border-box;
  overflow: hidden;
}

.strategy-display-module {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid rgba(64, 224, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(64, 224, 255, 0.1);
  overflow: hidden;
}

.title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #000000;
  text-shadow: 0 0 8px rgba(64, 224, 255, 0.6);
  flex-shrink: 0;
}

.select-container {
  margin-bottom: 6px;
  flex-shrink: 0;
}

.strategy-description {
  margin-top: 6px;
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(64, 224, 255, 0.1);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 6px;
  font-size: 10px;
  color: #000000;
  backdrop-filter: blur(5px);
  line-height: 1.3;
}

.strategy-parameters {
  margin-top: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.strategy-parameters .title {
  margin-bottom: 6px;
}

.el-select {
  width: 100%;
}

/* Element UI组件深色主题适配 */
:deep(.el-select .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(64, 224, 255, 0.3) !important;
  border-radius: 4px;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: rgba(64, 224, 255, 0.5) !important;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: rgba(64, 224, 255, 0.6) !important;
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.3) !important;
}

:deep(.el-input__inner) {
  color: #000000 !important;
  background: transparent !important;
  font-size: 11px;
  padding: 3px 8px;
  height: 28px !important;
  line-height: 28px !important;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(0, 0, 0, 0.6) !important;
}

:deep(.el-input) {
  height: 28px !important;
}

:deep(.el-input__wrapper) {
  height: 28px !important;
  padding: 0 8px !important;
}

:deep(.el-table) {
  background: transparent !important;
  color: #000000 !important;
  font-size: 10px;
  border: none !important;
}

:deep(.el-table .el-table__header-wrapper) {
  background: transparent !important;
}

:deep(.el-table .el-table__body-wrapper) {
  background: transparent !important;
  max-height: none !important;
}

:deep(.el-table th.el-table__cell) {
  background: rgba(64, 224, 255, 0.2) !important;
  color: #000000 !important;
  border-bottom: 1px solid rgba(64, 224, 255, 0.3) !important;
  padding: 2px 6px !important;
  font-size: 10px;
  font-weight: bold !important;
  height: 28px !important;
}

:deep(.el-table td.el-table__cell) {
  background: transparent !important;
  color: #000000 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 2px 6px !important;
  font-size: 10px;
  line-height: 1.2;
  height: 26px !important;
}

:deep(.el-table tr:hover td) {
  background: rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-table .cell) {
  padding: 0 !important;
  line-height: 1.2 !important;
}

/* 下拉选项样式 */
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
