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
        <el-table :data="riskThresholdData" border style="width: 100%; height: 200px;">
          <el-table-column prop="metric" label="指标" />
          <el-table-column prop="value" label="数值" />
        </el-table>
      </div>

      <!-- 中间区域：风险预警 -->
      <div class="risk-warning">
        <h4>风险预警</h4>
        <el-alert title="当前暂无风险" type="warning" :closable="false" />
      </div>

      <!-- 下方区域：风险分析报告 -->
      <div class="risk-analysis">
        <h4>风险分析报告</h4>
        <div class="report-content">
          点击下载风险分析报告。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AssetComparisonAnalysis from './AssetComparisonAnalysis.vue';

export default {
  name: 'RightAside',
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
.right-aside {
  height: 100%; /* 占满父容器高度 */
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 0; /* 移除默认内边距 */
}

.upper-section {
  height: 50%; /* 固定高度为右侧栏的上半部分 */
  overflow-y: auto; /* 多出来的部分通过滚动条滑动显示 */
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lower-section {
  height: 50%; /* 固定高度为右侧栏的下半部分 */
  overflow-y: auto; /* 多出来的部分通过滚动条滑动显示 */
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.risk-threshold,
.risk-warning,
.risk-analysis {
  flex: 1; /* 子元素按比例填充 */
  padding: 15px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.title {
  font-weight: bold; /* 加粗字体 */
  font-size: 18px; /* 可以根据需要调整字体大小 */
  margin-bottom: 10px; /* 与下方内容的间距 */

}

.content {
  flex: 1; /* 内容区域占满剩余空间 */
  overflow-y: auto; /* 内容超出时显示滚动条 */
}
.el-table {
  height: 100%; /* 表格高度占满 */
}

.report-content {
  flex: 1; /* 报告内容区域占满 */
  padding: 10px;
  overflow-y: auto;
  color: #666666;
}
</style>