<template>
  <div class="strategy-execution-result">
    <div class="result-display-module">
      <div class="title">策略执行结果</div>
      <div class="result-content">
        <!-- 替换为 ChartSection 组件 -->
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ChartSection from './ChartSection.vue'; // 引入 ChartSection 组件

export default {
  name: 'StrategyExecutionResult',
  components: {
    ChartSection, // 注册 ChartSection 组件
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
.strategy-execution-result {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.result-display-module {
  width: 100%;
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

.result-content {
  margin-top: 20px;
}

.transaction-curve {
  margin-bottom: 20px;
}

.key-metrics {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.metrics-table {
  margin-top: 10px;
}

.download-button {
  margin-top: 20px;
  align-self: flex-end;
}
</style>