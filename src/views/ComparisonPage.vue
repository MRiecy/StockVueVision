<template>
  <div class="comparison-page">
    <div class="left-section">
      <AssetComparisonAnalysis />
    </div>
    <div class="right-section">
      <div class="risk-assessment">
        <div class="title">风险评估</div>
        <div class="risk-threshold">
          <h4>风险阈值</h4>
          <el-table :data="riskThresholdData" border style="width: 100%; height: 200px;">
            <el-table-column prop="metric" label="指标" />
            <el-table-column prop="value" label="数值" />
          </el-table>
        </div>

        <div class="risk-warning">
          <h4>风险预警</h4>
          <el-alert title="当前暂无风险" type="warning" :closable="false" />
        </div>

        <div class="risk-analysis">
          <h4>风险分析报告</h4>
          <div class="report-content">
            点击下载风险分析报告。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AssetComparisonAnalysis from '@/components/layout/AssetComparisonAnalysis.vue';

export default {
  name: 'ComparisonPage',
  components: {
    AssetComparisonAnalysis,
  },
  data() {
    return {
      riskThresholdData: [
        { metric: '总资金', value: '10000' },
        { metric: '止损点', value: '5%' },
        { metric: '长期波动率', value: '10%' },
        { metric: '最大回测', value: '15%' },
        { metric: '股票仓位', value: '60%' },
      ],
    };
  },
};
</script>

<style scoped>
.comparison-page {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #2c3e50;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  color: #2c3e50;
  overflow: hidden;
}

.left-section {
  width: 60%;
  height: 100%;
  background-color: #ecf0f1;
  border-radius: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.right-section {
  width: 40%;
  height: 100%;
  background-color: #ecf0f1;
  border-radius: 0;
}

/* 添加新的样式 */
.left-section :deep(.asset-comparison-analysis) {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
}

.left-section :deep(.asset-comparison-analysis::-webkit-scrollbar) {
  width: 6px;
}

.left-section :deep(.asset-comparison-analysis::-webkit-scrollbar-thumb) {
  background-color: #95a5a6;
  border-radius: 3px;
}

.left-section :deep(.asset-comparison-analysis::-webkit-scrollbar-track) {
  background-color: #ecf0f1;
}

.risk-assessment {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.risk-threshold,
.risk-warning,
.risk-analysis {
  background-color: #ffffff;
  padding: 15px;
  border: 1px solid #bdc3c7;
}

h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.report-content {
  color: #2c3e50;
  padding: 10px;
}

/* 调整 Element Plus 组件样式 */
:deep(.el-table) {
  background-color: #ffffff;
  color: #2c3e50;
  border-radius: 0;
}

:deep(.el-table th) {
  background-color: #bdc3c7 !important;
  color: #2c3e50;
}

:deep(.el-table td) {
  background-color: #ffffff;
  color: #2c3e50;
}

:deep(.el-table--border) {
  border-color: #bdc3c7;
  border-radius: 0;
}

:deep(.el-table--border th),
:deep(.el-table--border td) {
  border-color: #bdc3c7;
}

:deep(.el-alert) {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}

:deep(.el-alert__title) {
  color: #e6a23c;
}

/* 移除所有子组件的圆角 */
:deep(*) {
  border-radius: 0 !important;
}
</style>
