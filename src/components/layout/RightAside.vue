<template>
    <div class="right-aside">
      <!-- 上部分 -->
      <div class="upper-section">
        <!-- 资产对比分析模块 -->
        <AssetComparisonAnalysis />
      </div>
  
      <!-- 下部分 -->
      <div class="lower-section">
         <!-- 下部分标题为风险评估 -->
        <div class="title">风险评估</div>
        <!-- 上方区域：风险阈值 -->
        <div class="risk-threshold">
          <h4>风险阈值</h4>
          <el-table :data="riskThresholdData" border style="width: 100%">
            <el-table-column prop="metric" label="指标" />
            <el-table-column prop="value" label="数值" />
          </el-table>
        </div>
  
        <!-- 中间区域：风险预警 -->
        <div class="risk-warning">
          <h4>风险预警</h4>
          <el-alert
            title="当前暂无风险"
            type="warning"
            :closable="false"
          />
        </div>
  
        <!-- 下方区域：风险分析报告 -->
        <div class="risk-analysis">
          <h4>风险分析报告</h4>
          <div class="report-content">
            点击下载风险分析报告。
            <!-- 可以在此添加更多内容或图表 -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // 引入新组件
  import AssetComparisonAnalysis from './AssetComparisonAnalysis.vue';
  export default {
    name: 'RightAside',
    components: {
      AssetComparisonAnalysis, // 注册新组件
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
 .right-aside {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  padding: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333333;
}

.upper-section,
.lower-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.upper-section {
  margin-bottom: 20px;
}

.lower-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.risk-threshold,
.risk-warning,
.risk-analysis {
  padding: 15px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

/* 表格样式 */
.el-table {
  margin-top: 15px;
  background-color: #ffffff;
  border-radius: 4px;
}

.el-table td,
.el-table th {
  padding: 8px 0;
  text-align: center;
  color: #666666;
}

.el-table th {
  background-color: #f5f5f5;
  color: #333333;
  font-weight: bold;
}

.risk-threshold .el-table {
  max-height: 200px;
  overflow-y: auto;
}

.report-content {
  padding: 10px;
  overflow-y: auto;
  color: #666666;
}
</style>