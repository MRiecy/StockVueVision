<template>
  <div class="strategy-result">
    <div class="title">策略执行结果</div>
    <div class="result-content">
      <ChartSection class="transaction-curve" />

      <div class="key-metrics">
        <div class="title">关键指标</div>
        <div class="metrics-table">
          <el-table :data="keyMetrics" border style="width: 100%">
            <el-table-column prop="metricName" label="指标名称" />
            <el-table-column prop="metricValue" label="指标值" />
            <el-table-column prop="description" label="描述" />
          </el-table>
        </div>
      </div>

      <el-button type="primary" @click="downloadReport" class="download-button">查看并下载执行报告</el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ChartSection from './ChartSection.vue';

export default {
  name: 'StrategyExecutionResult',
  components: {
    ChartSection,
  },
  setup() {
    const keyMetrics = ref([]);

    const fetchExecutionResult = async () => {
      try {
        const response = await axios.get('/api/execution-result');
        keyMetrics.value = response.data.keyMetrics;
      } catch (error) {
        console.error('获取策略执行结果失败：', error);
      }
    };

    onMounted(fetchExecutionResult);

    const downloadReport = () => {
      console.log('下载策略执行报告');
    };

    return {
      keyMetrics,
      downloadReport,
    };
  },
};
</script>

<style scoped>
.strategy-result {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
  box-sizing: border-box;
}

.title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 8px;
}

.result-content {
  margin-top: 8px;
  padding: 6px;
  background-color: #f5f6fa;
  border-radius: 4px;
  font-size: 12px;
}

.transaction-curve {
  margin-bottom: 12px;
}

.transaction-curve :deep(.chart-section) {
  height: 300px;
}

.key-metrics {
  margin-bottom: 12px;
}

.metrics-table {
  margin-top: 8px;
}

.download-button {
  margin-top: 12px;
  align-self: flex-end;
  padding: 4px 12px;
  font-size: 12px;
}

.el-table {
  font-size: 12px;
}

.el-table th,
.el-table td {
  padding: 2px 0;
  font-size: 12px;
}

.el-table th {
  background-color: #f5f5f5;
}
</style>
