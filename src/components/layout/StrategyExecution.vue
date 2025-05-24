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
              description: '基于PE、PB等基本面指标的价值投资策略',
              parameters: [
                { paramKey: 'PE', paramValue: '20', description: '市盈率上限' },
                { paramKey: 'PB', paramValue: '2.5', description: '市净率上限' }
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
  padding: 10px;
  box-sizing: border-box;
}

.strategy-display-module {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.select-container {
  margin-bottom: 10px;
}

.strategy-description {
  margin-top: 10px;
  padding: 8px;
  background-color: #f5f6fa;
  border-radius: 4px;
  font-size: 12px;
}

.strategy-parameters {
  margin-top: 10px;
}

.el-select {
  width: 100%;
}

.el-select .el-input__inner {
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  font-size: 12px;
  padding: 5px;
}

.el-table {
  font-size: 12px;
}

.el-table th,
.el-table td {
  padding: 4px 0;
  font-size: 12px;
}

.el-table th {
  background-color: #f5f5f5;
}

.el-select-dropdown__item.selected {
  color: #3366cc;
}
</style>
