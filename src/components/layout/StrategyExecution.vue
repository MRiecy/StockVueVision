<template>
    <div class="strategy-execution">
      <el-card class="strategy-card">
        <template #header>
          <div class="strategy-header">
            <span>当前执行策略</span>
          </div>
        </template>
        <div class="strategy-content">
          <el-select v-model="selectedStrategy" placeholder="请选择策略">
            <el-option
              v-for="strategy in strategies"
              :key="strategy.id"
              :label="strategy.name"
              :value="strategy"
            />
          </el-select>
          <el-card class="strategy-details">
            <template #header>
              <div class="strategy-info-header">
                <span>策略简介</span>
              </div>
            </template>
            <div class="strategy-description">
              {{ selectedStrategy.description }}
            </div>
          </el-card>
          <el-card class="strategy-details">
            <template #header>
              <div class="strategy-info-header">
                <span>策略参数设置</span>
              </div>
            </template>
            <div class="strategy-parameters">
              <el-table :data="selectedStrategy.parameters" border style="width: 100%">
                <el-table-column prop="paramKey" label="参数名称" />
                <el-table-column prop="paramValue" label="参数值" />
                <el-table-column prop="description" label="描述" />
              </el-table>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'StrategyExecution',
    setup() {
      const strategies = ref([]);
      const selectedStrategy = ref({});
  
      const fetchStrategies = async () => {
        try {
          const response = await axios.get('/api/strategies');
          strategies.value = response.data;
          selectedStrategy.value = response.data[0];
        } catch (error) {
          console.error('获取策略列表失败：', error);
        }
      };
  
      onMounted(fetchStrategies);
  
      watch(selectedStrategy, () => {
        console.log('当前选中策略：', selectedStrategy.value);
      });
  
      return {
        strategies,
        selectedStrategy,
      };
    },
  };
  </script>
  
  <style scoped>
  .strategy-execution {
    padding: 20px;
  }
  
  .strategy-card {
    margin-bottom: 20px;
  }
  
  .strategy-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .strategy-content {
    margin-top: 20px;
  }
  
  .strategy-info-header {
    font-weight: bold;
  }
  
  .strategy-description {
    padding: 10px;
    background-color: #f5f6fa;
    margin-bottom: 10px;
  }
  
  .strategy-parameters {
    padding: 10px;
  }
  </style>