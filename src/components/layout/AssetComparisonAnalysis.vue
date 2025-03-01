<template>
  <div class="asset-comparison-analysis">
    <!-- 资产类别对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">资产类别对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleCategoryChart">点击查看图表</button>
        <div class="analysis-chart" v-show="isCategoryChartVisible">
          <div ref="categoryChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>资产类别数据表</h4>
          <el-table :data="categoryData" border style="width: 100%">
            <el-table-column prop="category" label="资产类别" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 时间段对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">时间段对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleTimeChart">点击查看图表</button>
        <div class="analysis-chart" v-show="isTimeChartVisible">
          <div ref="timeChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>时间段数据表</h4>
          <el-table :data="timeData" border style="width: 100%">
            <el-table-column prop="timePeriod" label="时间段" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 地区对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">地区对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleRegionChart">点击查看图表</button>
        <div class="analysis-chart" v-show="isRegionChartVisible">
          <div ref="regionChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>地区数据表</h4>
          <el-table :data="regionData" border style="width: 100%">
            <el-table-column prop="region" label="地区" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'AssetComparisonAnalysis',
  setup() {
    const categoryChart = ref(null);
    const timeChart = ref(null);
    const regionChart = ref(null);

    const categoryData = ref([
      { category: '股票', totalAssets: 100000, returnRate: '5%' },
      { category: '债券', totalAssets: 80000, returnRate: '3%' },
      { category: '基金', totalAssets: 120000, returnRate: '4%' },
    ]);

    const timeData = ref([
      { timePeriod: '2024-01', totalAssets: 200000, returnRate: '4%' },
      { timePeriod: '2024-02', totalAssets: 220000, returnRate: '5%' },
      { timePeriod: '2024-03', totalAssets: 250000, returnRate: '6%' },
    ]);

    const regionData = ref([
      { region: '北京', totalAssets: 150000, returnRate: '5%' },
      { region: '上海', totalAssets: 180000, returnRate: '6%' },
      { region: '深圳', totalAssets: 200000, returnRate: '7%' },
    ]);

    const isCategoryChartVisible = ref(false);
    const isTimeChartVisible = ref(false);
    const isRegionChartVisible = ref(false);

    const initCategoryChart = () => {
      const chart = echarts.init(categoryChart.value);
      chart.setOption({
        title: { text: '资产类别对比' },
        xAxis: { type: 'category', data: ['股票', '债券', '基金'] },
        yAxis: { type: 'value' },
        series: [
          { name: '总资产', data: [100000, 80000, 120000], type: 'bar' },
        ],
      });
    };

    const initTimeChart = () => {
      const chart = echarts.init(timeChart.value);
      chart.setOption({
        title: { text: '时间段对比' },
        xAxis: { type: 'category', data: ['2024-01', '2024-03'] }, // 假设时间段比较少，实际可以根据数据调整
        yAxis: { type: 'value' },
        series: [
          { name: '总资产', data: [200000, 250000], type: 'line' }, // 假设数据较少
        ],
      });
    };

    const initRegionChart = () => {
      const chart = echarts.init(regionChart.value);
      chart.setOption({
        title: { text: '地区对比' },
        xAxis: { type: 'category', data: ['北京', '深圳'] }, // 假设地区比较少，实际可以根据数据调整
        yAxis: { type: 'value' },
        series: [
          { name: '总资产', data: [150000, 200000], type: 'bar' }, // 假设数据较少
        ],
      });
    };

    const toggleCategoryChart = () => {
      isCategoryChartVisible.value = !isCategoryChartVisible.value;
    };

    const toggleTimeChart = () => {
      isTimeChartVisible.value = !isTimeChartVisible.value;
    };

    const toggleRegionChart = () => {
      isRegionChartVisible.value = !isRegionChartVisible.value;
    };

    onMounted(() => {
      initCategoryChart();
      initTimeChart();
      initRegionChart();
    });

    return {
      categoryChart,
      timeChart,
      regionChart,
      categoryData,
      timeData,
      regionData,
      isCategoryChartVisible,
      isTimeChartVisible,
      isRegionChartVisible,
      toggleCategoryChart,
      toggleTimeChart,
      toggleRegionChart,
    };
  },
};
</script>

<style scoped>
.asset-comparison-analysis {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.analysis-module {
  margin-bottom: 20px;
}

.module-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333333;
}

.module-content {
  display: flex;
  flex-direction: column;
}

.module-button {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.module-button:hover {
  background-color: #66b1ff;
}

.module-table {
  margin-top: 10px;
}

.analysis-chart {
  margin-bottom: 20px;
}

.module-content h4 {
  margin-top: 10px;
  margin-bottom: 10px;
}

/* 调整图表容器大小 */
.analysis-chart > div {
  height: 400px; /* 增大图表高度 */
}
</style>