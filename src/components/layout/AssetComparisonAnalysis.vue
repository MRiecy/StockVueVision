<template>
  <div class="asset-comparison-analysis">
    <!-- 资产类别对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">资产类别对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleCategoryChart">点击查看图表</button>
        <div class="analysis-chart" v-if="isCategoryChartVisible">
          <div ref="categoryChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>资产类别数据表</h4>
          <el-table :data="categoryData" border style="width: 100%">
            <el-table-column prop="category" label="资产类别" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
            <el-table-column prop="marketShare" label="市场份额" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 时间段对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">时间段对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleTimeChart">点击查看图表</button>
        <div class="analysis-chart" v-if="isTimeChartVisible">
          <div ref="timeChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>时间段数据表</h4>
          <el-table :data="timeData" border style="width: 100%">
            <el-table-column prop="timePeriod" label="时间段" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
            <el-table-column prop="growthRate" label="增长率" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 地区对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">地区对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleRegionChart">点击查看图表</button>
        <div class="analysis-chart" v-if="isRegionChartVisible">
          <div ref="regionChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>地区数据表</h4>
          <el-table :data="regionData" border style="width: 100%">
            <el-table-column prop="region" label="地区" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
            <el-table-column prop="investmentRate" label="投资率" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'AssetComparisonAnalysis',
  setup() {
    const categoryChart = ref(null);
    const timeChart = ref(null);
    const regionChart = ref(null);

    // 资产类别数据
    const categoryData = ref([
      { category: '股票', totalAssets: 100000, returnRate: '5%', marketShare: '30%' },
      { category: '债券', totalAssets: 80000, returnRate: '3%', marketShare: '20%' },
      { category: '基金', totalAssets: 120000, returnRate: '4%', marketShare: '25%' },
      { category: '现金', totalAssets: 50000, returnRate: '1%', marketShare: '15%' },
      { category: '其他', totalAssets: 30000, returnRate: '2%', marketShare: '10%' },
    ]);

    // 时间段数据
    const timeData = ref([
      { timePeriod: '2024-01', totalAssets: 200000, returnRate: '4%', growthRate: '5%' },
      { timePeriod: '2024-02', totalAssets: 220000, returnRate: '5%', growthRate: '10%' },
      { timePeriod: '2024-03', totalAssets: 250000, returnRate: '6%', growthRate: '15%' },
      { timePeriod: '2024-04', totalAssets: 280000, returnRate: '7%', growthRate: '20%' },
      { timePeriod: '2024-05', totalAssets: 300000, returnRate: '8%', growthRate: '25%' },
    ]);

    // 地区数据
    const regionData = ref([
      { region: '北京', totalAssets: 150000, returnRate: '5%', investmentRate: '30%' },
      { region: '上海', totalAssets: 180000, returnRate: '6%', investmentRate: '35%' },
      { region: '深圳', totalAssets: 200000, returnRate: '7%', investmentRate: '40%' },
      { region: '广州', totalAssets: 120000, returnRate: '4%', investmentRate: '25%' },
      { region: '杭州', totalAssets: 100000, returnRate: '3%', investmentRate: '20%' },
    ]);

    const isCategoryChartVisible = ref(false);
    const isTimeChartVisible = ref(false);
    const isRegionChartVisible = ref(false);

    // 初始化资产类别图表
    const initCategoryChart = () => {
      const chart = echarts.init(categoryChart.value);
      chart.setOption({
        title: {
          text: '资产类别对比分析',

          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: ['总资产', '收益率'],
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: categoryData.value.map(item => item.category),
        },
        yAxis: [
          {
            type: 'value',
            name: '总资产',
            position: 'left',
            axisLabel: { formatter: '{value} 元' },
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            axisLabel: { formatter: '{value}%' },
          },
        ],
        series: [
          {
            name: '总资产',
            type: 'bar',
            data: categoryData.value.map(item => item.totalAssets),
            itemStyle: { color: '#5470C6' },
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: categoryData.value.map(item => parseFloat(item.returnRate)),
            itemStyle: { color: '#EE6666' },
          },
        ],
      });

      // 调整图表宽度自适应
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };

    // 初始化时间段图表
    const initTimeChart = () => {
      const chart = echarts.init(timeChart.value);
      chart.setOption({
        title: {
          text: '时间段对比分析',

          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' },
        },
        legend: {
          data: ['总资产', '收益率', '增长率'],
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: timeData.value.map(item => item.timePeriod),
        },
        yAxis: [
          {
            type: 'value',
            name: '总资产',
            position: 'left',
            axisLabel: { formatter: '{value} 元' },
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            axisLabel: { formatter: '{value}%' },
          },
        ],
        series: [
          {
            name: '总资产',
            type: 'line',
            data: timeData.value.map(item => item.totalAssets),
            itemStyle: { color: '#5470C6' },
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: timeData.value.map(item => parseFloat(item.returnRate)),
            itemStyle: { color: '#EE6666' },
          },
          {
            name: '增长率',
            type: 'line',
            yAxisIndex: 1,
            data: timeData.value.map(item => parseFloat(item.growthRate)),
            itemStyle: { color: '#FFB657' },
          },
        ],
      });

      // 调整图表宽度自适应
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };

    // 初始化地区图表
    const initRegionChart = () => {
      const chart = echarts.init(regionChart.value);
      chart.setOption({
        title: {
          text: '地区对比分析',

          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' },
        },
        legend: {
          data: ['总资产', '收益率', '投资率'],
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: regionData.value.map(item => item.region),
        },
        yAxis: [
          {
            type: 'value',
            name: '总资产',
            position: 'left',
            axisLabel: { formatter: '{value} 元' },
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            axisLabel: { formatter: '{value}%' },
          },
        ],
        series: [
          {
            name: '总资产',
            type: 'bar',
            data: regionData.value.map(item => item.totalAssets),
            itemStyle: { color: '#5470C6' },
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: regionData.value.map(item => parseFloat(item.returnRate)),
            itemStyle: { color: '#EE6666' },
          },
          {
            name: '投资率',
            type: 'line',
            yAxisIndex: 1,
            data: regionData.value.map(item => parseFloat(item.investmentRate)),
            itemStyle: { color: '#FFB657' },
          },
        ],
      });

      // 调整图表宽度自适应
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };

    // 切换图表显示
    const toggleCategoryChart = () => {
  isCategoryChartVisible.value = !isCategoryChartVisible.value;
  if (isCategoryChartVisible.value) {
    nextTick(() => {
      initCategoryChart();
    });
  } else {
    // 销毁图表实例
    if (categoryChart.value) {
      const chart = echarts.getInstanceByDom(categoryChart.value);
      if (chart) {
        chart.dispose();
      }
    }
  }
};

    const toggleTimeChart = () => {
  isTimeChartVisible.value = !isTimeChartVisible.value;
  if (isTimeChartVisible.value) {
    nextTick(() => {
      initTimeChart();
    });
  } else {
    // 销毁图表实例
    if (timeChart.value) {
      const chart = echarts.getInstanceByDom(timeChart.value);
      if (chart) {
        chart.dispose();
      }
    }
  }
};

     const toggleRegionChart = () => {
  isRegionChartVisible.value = !isRegionChartVisible.value;
  if (isRegionChartVisible.value) {
    nextTick(() => {
      initRegionChart();
    });
  } else {
    // 销毁图表实例
    if (regionChart.value) {
      const chart = echarts.getInstanceByDom(regionChart.value);
      if (chart) {
        chart.dispose();
      }
    }
  }
};

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
  width: 100%;
}

.analysis-module {
  margin-bottom: 20px;
  width: 100%;
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
  width: 100%;
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
  width: 100%;
}

.analysis-chart {
  margin-bottom: 20px;
  width: 100%;
}

.analysis-chart > div {
  width: 100%;
  height: 400px;
}
</style>