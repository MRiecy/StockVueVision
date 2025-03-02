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
import { ref, onMounted, } from 'vue';
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
  flex-direction: column; /* 垂直排列子元素 */
}

.strategy-display-module {
  width: 100%;
  padding: 20px;
  border: 1px solid #dcdcdc; /* 添加浅灰色边框 */
  border-radius: 8px; /* 添加圆角 */
  background-color: #ffffff; /* 组件背景色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /* 添加阴影效果 */
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.select-container {
  margin-bottom: 20px;
}

.strategy-description {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f6fa;
  border-radius: 8px;
}

.strategy-parameters {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
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