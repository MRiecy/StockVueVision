<template>
  <div class="asset-comparison-analysis">
    <!-- 资产类别对比分析 -->
    <el-row :gutter="20" class="analysis-row">
      <el-col :span="24">
        <el-card class="analysis-subcard">
          <div class="subcard-header">
            <span>资产类别对比分析</span>
          </div>
          <el-button type="primary" class="subcard-button" @click="toggleCategoryChart">点击查看图表</el-button>
          <div class="analysis-chart" v-show="isCategoryChartVisible">
            <div ref="categoryChart" style="width: 100%; height: 400px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="analysis-subcard">
          <div class="subcard-header">
            <span>资产类别数据表</span>
          </div>
          <el-table :data="categoryData" border style="width: 100%">
            <el-table-column prop="category" label="资产类别" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 时间段对比分析 -->
    <el-row :gutter="20" class="analysis-row">
      <el-col :span="24">
        <el-card class="analysis-subcard">
          <div class="subcard-header">
            <span>时间段对比分析</span>
          </div>
          <el-button type="primary" class="subcard-button" @click="toggleTimeChart">点击查看图表</el-button>
          <div class="analysis-chart" v-show="isTimeChartVisible">
            <div ref="timeChart" style="width: 100%; height: 400px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="analysis-subcard">
          <div class="subcard-header">
            <span>时间段数据表</span>
          </div>
          <el-table :data="timeData" border style="width: 100%">
            <el-table-column prop="timePeriod" label="时间段" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 地区对比分析 -->
    <el-row :gutter="20" class="analysis-row">
      <el-col :span="24">
        <el-card class="analysis-subcard">
          <div class="subcard-header">
            <span>地区对比分析</span>
          </div>
          <el-button type="primary" class="subcard-button" @click="toggleRegionChart">点击查看图表</el-button>
          <div class="analysis-chart" v-show="isRegionChartVisible">
            <div ref="regionChart" style="width: 100%; height: 400px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="analysis-subcard">
          <div class="subcard-header">
            <span>地区数据表</span>
          </div>
          <el-table :data="regionData" border style="width: 100%">
            <el-table-column prop="region" label="地区" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
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

    // 图表显示状态
    const isCategoryChartVisible = ref(false);
    const isTimeChartVisible = ref(false);
    const isRegionChartVisible = ref(false);

    // 初始化图表
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
        xAxis: { type: 'category', data: ['2024-01', '2024-02', '2024-03'] },
        yAxis: { type: 'value' },
        series: [
          { name: '总资产', data: [200000, 220000, 250000], type: 'line' },
        ],
      });
    };

    const initRegionChart = () => {
      const chart = echarts.init(regionChart.value);
      chart.setOption({
        title: { text: '地区对比' },
        xAxis: { type: 'category', data: ['北京', '上海', '深圳'] },
        yAxis: { type: 'value' },
        series: [
          { name: '总资产', data: [150000, 180000, 200000], type: 'bar' },
        ],
      });
    };

    // 切换图表显示
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
  padding: 20px;
}

.analysis-row {
  margin-bottom: 20px;
}

.analysis-subcard {
  margin-bottom: 20px;
}

.analysis-chart {
  margin-bottom: 20px;
}

.subcard-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.subcard-button {
  margin-bottom: 10px;
}
</style>