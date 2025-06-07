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
import ChartSection from './ChartSection.vue';

export default {
  name: 'StrategyExecutionResult',
  components: {
    ChartSection,
  },
  setup() {
    const keyMetrics = ref([]);



    onMounted(() => {
      // 直接使用模拟数据
      keyMetrics.value = [
        { 
          metricName: '总收益率', 
          metricValue: '+8.2%', 
          description: '当前策略累计收益率' 
        },
        { 
          metricName: '年化收益率', 
          metricValue: '+12.5%', 
          description: '年化投资回报率' 
        },
        { 
          metricName: '最大回撤', 
          metricValue: '-3.8%', 
          description: '历史最大回撤幅度' 
        },
        { 
          metricName: '夏普比率', 
          metricValue: '1.85', 
          description: '风险调整后收益指标' 
        },
        { 
          metricName: '胜率', 
          metricValue: '68.5%', 
          description: '盈利交易占比' 
        },
        { 
          metricName: '交易次数', 
          metricValue: '127', 
          description: '累计执行交易次数' 
        }
      ];
    });

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
  color: #000000;
  text-shadow: 0 0 8px rgba(64, 224, 255, 0.6);
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 6px;
  font-size: 12px;
  color: #000000;
  overflow: hidden;
}

.transaction-curve {
  flex: 2;
  margin-bottom: 12px;
  min-height: 300px;
}

.transaction-curve :deep(.chart-section) {
  height: 100%;
}

.key-metrics {
  flex: 1;
  margin-bottom: 12px;
  min-height: 150px;
}

.metrics-table {
  margin-top: 8px;
  height: calc(100% - 30px);
  overflow-y: auto;
}

.download-button {
  margin-top: 12px;
  align-self: flex-end;
  padding: 4px 12px;
  font-size: 12px;
  flex-shrink: 0;
}

/* Element UI组件深色主题适配 */
:deep(.el-table) {
  background: transparent !important;
  color: #000000 !important;
  font-size: 12px;
}

:deep(.el-table th.el-table__cell) {
  background: rgba(64, 224, 255, 0.2) !important;
  color: #000000 !important;
  border-bottom: 1px solid rgba(64, 224, 255, 0.3) !important;
  padding: 2px 0;
  font-size: 12px;
  font-weight: bold !important;
}

:deep(.el-table td.el-table__cell) {
  background: transparent !important;
  color: #000000 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 2px 0;
  font-size: 12px;
}

:deep(.el-table tr:hover td) {
  background: rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-button) {
  background: linear-gradient(135deg, rgba(64, 224, 255, 0.3), rgba(30, 144, 255, 0.3)) !important;
  border: 1px solid rgba(64, 224, 255, 0.5) !important;
  color: #ffffff !important;
  border-radius: 6px !important;
  box-shadow: 0 0 15px rgba(64, 224, 255, 0.3) !important;
  transition: all 0.3s ease !important;
  text-shadow: 0 0 5px rgba(64, 224, 255, 0.5);
}

:deep(.el-button:hover) {
  background: linear-gradient(135deg, rgba(64, 224, 255, 0.5), rgba(30, 144, 255, 0.5)) !important;
  border-color: rgba(64, 224, 255, 0.8) !important;
  box-shadow: 0 0 25px rgba(64, 224, 255, 0.6) !important;
  transform: translateY(-2px);
}
</style>
